import { createStore } from "vuex";
import { Fact } from "../model/fact.js";
import { Act } from "../model/act.js";
import { Claimduty } from "../model/claimduty.js";
import { saveAs } from "file-saver";
import {
  convertInterpretationToJson,
  parseJsonToInterpretation,
} from "../helpers/importExport.js";
import { json, text } from "d3-fetch";
import { SourceDocument } from "../model/sourceDocument.js";
import { v4 as uuid4 } from "uuid";
import { convertToRDF, convertRDFToJSON } from "../services/ApiServices.js";
import { getSourceList } from "../services/ApiServices";
// Create a new store instance.
const store = createStore({
  state() {
    return {
      step: 1, //step in the process
      frames: [], //list of frames in interpretation
      frameBeingEdited: null, //frame for which editor-pane is opened
      framesOpenInEditor: [], //list of frames in edit mode. any new frames are not saved to the frames list.
      booleanConstructBeingEdited: null, //boolean-field being edited, so we can add clicked frame to it
      sourceDocuments: [], // documents that are used in the current interpretation
      sentenceToScrollTo: null, // sentence that should be visible in source panel, because 'scroll to source' is clicked in frame editor
      displayedSourceDocument: null, //document that is currently showing in the source view
      annotationBeingEdited: null, //annotation for which source text has been selected / is being selected
      annotationToBeAddedToExistingFrame: null, //annotation selected to be added to an existing frame
      addingAnnotationToExistingFrame: false, //true if user is in the process of selecting a frame to add the annotationBeingEdited to
      selectedSnippet: null, // selected snippet in the source text
      clickedPosition: null,
      availableSources: [], //list of sources available in repo
      availableSourcesInTripleStore: [], //list of sources available in triple store
      task: null, //{id, type, label, description}
      sourceViewIsCollapsed: false, //whether or not the panel showing the source is collapsed
      frameFilter: {}, //for each frame type and sub types: whether or not the user selected the frame type (for filtering in network view)
      showDependenciesBetweenActs: false //whether or not to show dependeny relations 'Before' between acts
    };
  },
  mutations: {
    //add new frame to list of frames being edited. does not permanently store
    //the frame to the frames list yet. storing permanently is done when the save
    //button in the frame editor is clicked.
    addNewFrame(state, { frameTypeId, subTypeId, annotation, openInEditor, initialLabel }) {
      let frame;
      switch (frameTypeId) {
        case "fact":
          frame = new Fact(initialLabel);
          break;
        case "act":
          frame = new Act();
          break;
        case "claim_duty":
          frame = new Claimduty();
          break;
      }
      frame.typeId = frameTypeId;
      if (subTypeId) { frame.subTypeId = subTypeId }

      if (annotation) {
        annotation.frame = frame
      }

      state.frames = [...state.frames, frame];

      if (state.booleanConstructBeingEdited) {
        state.booleanConstructBeingEdited.frame = frame
        state.booleanConstructBeingEdited = null
      }

      if (openInEditor) {
        this.commit("setFrameBeingEdited", frame)
      }
    },
    setFrameBeingEdited(state, frame) {
      state.frameBeingEdited = frame;
      if (!(state.framesOpenInEditor.some(f => f.id == frame.id))) {
        state.framesOpenInEditor.push(frame)
      }
    },
    removeFrameFromEditList(state, frame) {
      //remove the frame from the list of frames that are open in the editor
      const index = state.framesOpenInEditor.findIndex(f => f.id == frame.id)
      state.framesOpenInEditor.splice(index, 1)
      //if there are any frames left open in the editor, set frameBeingEdited to
      //the last of those. else set frameBeingEdited to null.s
      state.frameBeingEdited = state.framesOpenInEditor.length > 0 ? state.framesOpenInEditor[state.framesOpenInEditor.length - 1] : null;
    },
    createNewFrameViaNlp(state, { frameType, annotation, subType, role }) {
      let frame = new Fact();
      if (annotation) {
        annotation.frame = frame
      }
      frame.type = frameType;
      //frame.label = frame.fact.substring(0, 20);

      subType === "Agent"
        ? frame.comments.push(`Recommended role by the NLP model: ${role}`)
        : null;

      frame.subType = frameType.subTypes.filter(
        (d) => d.id == subType.toLowerCase(),
      )[0];
      frame["id"] = uuid4();
      state.frames = [...state.frames, frame];
    },
    removeFrame(state, frame) {
      //check if frame in editing list
      const openFrameIndex = state.framesOpenInEditor.findIndex(f => f.id == frame.id)
      if (openFrameIndex != -1) {
        state.framesOpenInEditor.splice(openFrameIndex, 1);
      }
      if (state.frameBeingEdited.id == frame.id) {
        const nrFramesOpen = state.framesOpenInEditor.length
        //if frame is the one being edited, assign other frame
        //to be open in editor, if there are any other frames being edited
        state.frameBeingEdited = nrFramesOpen > 0
          ? state.framesOpenInEditor[nrFramesOpen - 1]
          : null
        state.booleanConstructBeingEdited = null;
      }
      //remove frame from frames list
      const frameIndex = state.frames.findIndex(f => f.id == frame.id);
      if (frameIndex != -1) {
        state.frames.splice(frameIndex, 1);
      }

      //remove frame from any attribute of frames of type 'relation' and from
      //any boolean construct in a frame
      state.frames.forEach(f => f.deleteReferencesToFrame(frame))

      //remove annotations that have this frame as their frame, in all source documents
      state.sourceDocuments.forEach(doc => doc.deleteAnnotationsForFrame(frame))
    },
    deleteAnnotation(state, annotation) {
      //go through all snippets and remove annotation from them, if they contain the annotation
      state.sourceDocuments.forEach(doc => {
        doc.deleteAnnotation(annotation)
      })
    }
  },
  actions: {
    loadInterpretationForDebugging(context) {
      json(`./sources.json`).then((data) => {
        context.state.availableSources = data;
        text("./interpretation_DEBUG/interpretation.json").then(data => {
          context.dispatch("loadInterpretation", data)
        })
      });
    },
    //read sources that are available on server
    //depricated as soon as these sources are available in triple store
    readAvailableSources(context) {
      json(`./sources.json`).then((data) => {
        context.state.availableSources = data;
      });
    },
    async readAvailableSourcesInTripleStore(context) {
      context.state.availableSourcesInTripleStore = await getSourceList()
    },
    //reads source
    addSource(context, sourceDescription) {
      json(sourceDescription.fileName).then((jsonLdObject) => {
        context.dispatch("createSourceDocFromJsonLD", jsonLdObject)
      })
    },
    createSourceDocFromJsonLD(context, jsonLdObject) {
      const sourceDoc = new SourceDocument(jsonLdObject)
      //todo: check if sourceDoc is already in list
      context.state.sourceDocuments = [
        ...context.state.sourceDocuments,
        sourceDoc
      ];
      //sort alphabetically on title
      context.state.sourceDocuments.sort((d1, d2) => d1.title.localeCompare(d2.title))
      context.state.sourceDocuments
    },
    createAct(context) {
      context.state.frameBeingEdited = new Act();
    },
    saveInterpretationAsJson(context) {
      //combine frames that are saved with frames open in editor
      //keep unique list of frames
      const allFrames = context.state.frames
        .concat(context.state.framesOpenInEditor)
        .filter((frame, index, array) => array.findIndex(f => f.id == frame.id) === index)

      //ones and open in the editor
      const jsonString = JSON.stringify(
        convertInterpretationToJson(
          context.state.task,
          allFrames,
          context.state.sourceDocuments,
        ),
      );
      const blob = new Blob([jsonString], {
        type: "text/plain;charset=utf-8",
      });
      const dateString = new Date().toISOString().substring(0, 19);
      saveAs(blob, `${dateString}_interpretation.json`);
    },
    async saveInterpretationAsTurtle(context) {
      //combine frames that are saved with frames open in editor
      //keep unique list of frames
      const allFrames = context.state.frames
        .concat(context.state.framesOpenInEditor)
        .filter((frame, index, array) => array.findIndex(f => f.id == frame.id) === index)

      //ones and open in the editor
      const jsonString = JSON.stringify(
        convertInterpretationToJson(
          context.state.task,
          allFrames,
          context.state.sourceDocuments,
        ),
      )
      const response = await convertToRDF(jsonString);
      const blob = new Blob([response], {
        type: "text/turtle;charset=utf-8",
      });
      const dateString = new Date().toISOString().substring(0, 10);
      saveAs(blob, `${dateString}_interpretation.ttl`);
    },
    loadInterpretation(context, jsonText) {
      const interpretation = parseJsonToInterpretation(jsonText)
      context.state.task = interpretation.task
      context.state.sourceDocuments = interpretation.sourceDocs;
      context.state.frames = interpretation.frames
      //reset selection
      context.state.frameBeingEdited = null
      context.state.framesOpenInEditor = []
      context.state.booleanConstructBeingEdited = null
      //show the interpretation view
      context.state.step = 3
    },
    async loadInterpretationFromRDF(context, rdfText) {
      const jsonString = await convertRDFToJSON(rdfText);
      context.dispatch("loadInterpretation", jsonString)
      // //reset selection
      // context.state.frameBeingEdited = null
      // context.state.framesOpenInEditor = []
      // context.state.booleanConstructBeingEdited = null
      // //show the interpretation view
      // context.state.step = 3
    }
  },
});

export { store };
