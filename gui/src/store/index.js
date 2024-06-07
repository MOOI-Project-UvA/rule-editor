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
import {convertToRDF} from "../services/ApiServices.js";
// Create a new store instance.
const store = createStore({
  state() {
    return {
      step: 1, //step in the process
      frames: [], //list of frames in interpretation
      frameBeingEdited: null, //frame for which editor-pane is opened
      frameBeingDeleted: null, //frame for which confirmation of deletion is being asked
      framesOpenInEditor: [], //list of frames in edit mode. any new frames are not saved to the frames list.
      booleanConstructBeingEdited: null, //boolean-field being edited, so we can add clicked frame to it
      showFrameSource: false, //show sources for currently edited frame
      sourceDocuments: [], // documents that are opened in the current interpretation
      annotationBeingEdited: null, //annotation for which source text has been selected / is being selected
      annotationToBeAddedToExistingFrame: null, //annotation selected to be added to an existing frame
      addingAnnotationToExistingFrame: false, //true if user is in the process of selecting a frame to add the annotationBeingEdited to
      selectedSnippet: null, // selected snippet in the source text
      clickedPosition: null,
      availableSources: [], //list of sources that the user can choose from
      taskInformation: {
        title: "",
        description: "",
      }, // information about the task
      sourceViewIsCollapsed: false //whether or not the panel showing the source is collapsed
    };
  },
  getters: {
    getTaskInformation: (state) => state.taskInformation,
  },
  mutations: {
    //add new frame to list of frames being edited. does not permanently store
    //the frame to the frames list yet. storing permanently is done when the save
    //button in the frame editor is clicked.
    addNewFrame(state, { frameType, annotation, subType }) {
      let frame;
      switch (frameType.class) {
        case "fact":
          frame = new Fact();
          break;
        case "relation":
          switch (frameType.id) {
            case "act":
              frame = new Act();
              break;
            case "claim_duty":
              frame = new Claimduty();
              break;
          }
          break;
      }
      frame.type = frameType;
      frame.subType = subType ? subType : null
      state.frameBeingEdited = frame;
      state.framesOpenInEditor.push(frame)
      if (annotation) {
        annotation.frame = frame
      }
      if (state.booleanConstructBeingEdited) {
        state.booleanConstructBeingEdited.frame = frame
        state.booleanConstructBeingEdited = null
      }
    },
    saveFrameBeingEdited(state) {
      //if frameBeingEdited is new, add it to the list
      //refresh the list to force rerendering of the view
      if (!state.frames.some((f) => f.id == state.frameBeingEdited.id)) {
        state.frames.push(state.frameBeingEdited);
      }
      state.frames = [...state.frames];
      //if a booleanconstruct is being edited, add the new frame to it
      // if (state.booleanConstructBeingEdited) {
      //   state.booleanConstructBeingEdited.frame = frame;
      //   state.booleanConstructBeingEdited = null; //deselect boolean construct
      //   //if frame is being edited and is has an active field, add frame to that field
      // } else if (state.frameBeingEdited && state.frameBeingEdited.activeField) {
      //   state.frameBeingEdited.addFrame(frame);
      // }
      //remove the frame from the list of frames that are open in the editor
      const index = state.framesOpenInEditor.indexOf(state.frameBeingEdited)
      state.framesOpenInEditor.splice(index, 1)
      //if there are any frames left open in the editor, set frameBeingEdited to
      //the first of those
      state.frameBeingEdited = state.framesOpenInEditor.length > 0 ? state.framesOpenInEditor[0] : null;

    },
    createNewFrameViaNlp(state, { frameType, annotation, subType, role }) {
      let frame = new Fact();
      if (annotation) {
        frame.addAnnotation(annotation); //this also sets annotation.frame
      }
      frame.type = frameType;
      frame.label = frame.fact.substring(0, 20);

      subType === "Agent"
        ? frame.comments.push(`Recommended role by the NLP model: ${role}`)
        : null;

      frame.subType = frameType.subTypes.filter(
        (d) => d.id == subType.toLowerCase(),
      )[0];
      frame["id"] = uuid4();
      state.frames = [...state.frames, frame];
    },
    setShowFrameSource(state, show) {
      state.showFrameSource = show;
    },
    setAnnotationBeingEdited(state, annotation) {
      state.annotationBeingEdited = annotation;
    },
    removeFrame(state, frame) {
      //check if frame in editing list
      const openFrameIndex = state.framesOpenInEditor.findIndex(f => f.id == frame.id)
      if (openFrameIndex != -1) {
        state.framesOpenInEditor.splice(openFrameIndex, 1);
        //state.framesOpenInEditor = [...state.framesOpenInEditor]
      }
      if (state.frameBeingEdited.id == frame.id) {
        const nrFramesOpen = state.framesOpenInEditor.length
        //if frame is the one being edited, assign other frame
        //to be open in editor, if there are any other frames being edited
        state.frameBeingEdited = nrFramesOpen > 0
          ? state.framesOpenInEditor[nrFramesOpen - 1]
          : null
        state.booleanConstructBeingEdited = null;
        state.showFrameSource = null;
      }
      //check if frame is in frames list (containing all saved frames)
      const frameIndex = state.frames.findIndex(f => f.id == frame.id);
      if (frameIndex != -1) {
        state.frames.splice(frameIndex, 1);
      }

      //remove frame from any attribute of frames of type 'relation' and from
      //any boolean construct in a frame
      //those frames can be in list of edited frames as well
      const allFrames = state.frames
        .concat(state.framesOpenInEditor)
        .filter((frame, index, array) => array.findIndex(f => f.id == frame.id) === index)
      allFrames.forEach(f => f.deleteReferencesToFrame(frame))

      //remove frame from its annotations
      // state.sourceDocuments.forEach(doc => {
      //   doc.getAnnotationsForFrame(frame).forEach(annotation => {
      //     annotation.frame = null
      //   })
      // })

      //remove annotations that have this frame as their frame, in all source documents
      state.sourceDocuments.forEach(doc => doc.deleteAnnotationsForFrame(frame))
    },
    setTaskInformation(state, task) {
      console.log("in index.js: ", task);
      state.taskInformation.title = task.title;
      state.taskInformation.description = task.description;
    },
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
    readAvailableSources(context) {
      console.log("reading available sources");
      json(`./sources.json`).then((data) => {
        context.state.availableSources = data;
      });
    },
    //reads source, so user can annotate and create frames
    //source object contains filename where to read the source from
    //checkedSentences is used when reading an existing interpretation: it contains
    //the sentences that are selected by the user as relevant for the interpretation.
    addSource(context, { sourceId, checkedSentenceIds }) {
      const source = this.state.availableSources.find((s) => s.id == sourceId);
      console.log("source", source)
      console.log("reading", source.fileName)
      json(source.fileName).then((chopperData) => {
        console.log("chopperData", chopperData)
        //get document from chopper data.
        const document = chopperData["@graph"].find((d) => ('document' in d)).document;
        console.log("document", document)
        //TODO check if source doc already exists, from a loaded interpretation
        let sourceDoc = context.state.sourceDocuments.find(d => d.id == document['@id'])
        if (!sourceDoc) {
          sourceDoc = new SourceDocument(document['@id'], checkedSentenceIds)
          context.state.sourceDocuments = [
            ...context.state.sourceDocuments,
            sourceDoc
          ];
        }

        sourceDoc.fillSentencesFromChopperDocument(document)
        sourceDoc.title = source.title

        //sort alphabetically on title
        context.state.sourceDocuments.sort((d1, d2) => d1.title.localeCompare(d2.title))
        context.state.sourceDocuments
      })
    },
    createAct(context) {
      console.log("create act frame");
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
    async saveInterpretationAsTurtle(context){
      //combine frames that are saved with frames open in editor
      //keep unique list of frames
      const allFrames = context.state.frames
        .concat(context.state.framesOpenInEditor)
        .filter((frame, index, array) => array.findIndex(f => f.id == frame.id) === index)

      //ones and open in the editor
      const jsonString = JSON.stringify(
        convertInterpretationToJson(
          allFrames,
          context.state.sourceDocuments,
        ),
      )
      console.log("jsonString:", jsonString)
      const response = await convertToRDF(jsonString);
      console.log("response from convertToRDF:", response);
      const blob = new Blob([response], {
        type: "text/turtle;charset=utf-8",
      });
      const dateString = new Date().toISOString().substring(0, 10);
      saveAs(blob, `${dateString}_interpretation.ttl`);

    },
    loadInterpretation(context, jsonText) {
      const interpretation = parseJsonToInterpretation(jsonText)
      console.log("loaded interpretation", interpretation)
      context.state.sourceDocuments = interpretation.sourceDocs;
      context.state.frames = interpretation.frames

      /**
       * at this point, the source docs created from the loaded interpretation
       * do not contain sentence text yet, and they miss snippets that are
       * not annotated. Read source files and add this missing information
      */
      JSON.parse(jsonText).sourceDocs.forEach((d) => {
        context.dispatch("addSource", {
          sourceId: d.id,
          checkedSentenceIds: d.checkedSentenceIds,
        });
      });
      //skip to step 3 to show the interpretation
      context.state.step = 3
    },
  },
});

export { store };
