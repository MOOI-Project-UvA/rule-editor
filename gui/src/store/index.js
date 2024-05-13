import { createStore } from "vuex";
import { Fact } from "../model/fact.js";
import { Act } from "../model/act.js";
import { Claimduty } from "../model/claimduty.js";
import { saveAs } from "file-saver";
import {
  convertInterpretationToJson,
  parseJsonToFrames,
} from "../helpers/importExport.js";
import { json, text } from "d3-fetch";
import { SourceDocument } from "../model/sourceDocument.js";
import { v4 as uuid4 } from "uuid";
// Create a new store instance.
const store = createStore({
  state() {
    return {
      frames: [], //list of frames in interpretation
      frameBeingEdited: null, //frame for which editor-pane is opened
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
    addNewFrame(state, { frameType, annotation }) {
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
      state.frameBeingEdited = frame;
      state.framesOpenInEditor.push(frame)
      if (annotation) {
        annotation.frame = frame
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
    cancelFrameBeingEdited(state) {
      const index = state.framesOpenInEditor.indexOf(state.frameBeingEdited)
      state.framesOpenInEditor.splice(index, 1)
      const indexFrameBeingEdited = Math.max(0, index - 1)
      state.frameBeingEdited = state.framesOpenInEditor.length > 0 ? state.framesOpenInEditor[indexFrameBeingEdited] : null;
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
      if (frame == state.frameBeingEdited) {
        state.frameBeingEdited = null;
        state.booleanConstructBeingEdited = null;
        state.showFrameSource = null;
      }
      const index = state.frames.indexOf(frame);
      state.frames.splice(index, 1);
    },
    removeAtomicFact(state, frame) {
      // remove the fact from an act or a complexFact
      // case1: complex fact
      // get the generated ids (frame._id) of the complexFrames, which contain the AtomicFact

      state.frames
        .filter((f) => f.type == "fact" && f.booleanConstruct)
        .forEach((f) => {
          f.booleanConstruct.removeFrame(frame);
        });
      const actFrameIds = state.frames
        .filter((fr) => fr._type === "act")
        .filter((act) => {
          const term = act._terminates.find((d) => d._id === frame._id);
          const creates = act._creates.find((d) => d._id === frame._id);
          const action =
            act._action !== null && act._action._id === frame._id
              ? act._action._id
              : undefined;
          const actor =
            act._actor !== null && act._actor._id == frame._id
              ? act._actor._id
              : undefined;
          const object =
            act._object !== null && act._object._id == frame._id
              ? act._object._id
              : undefined;
          const precondition =
            act._precondition !== null && act._precondition._id == frame._id
              ? act._precondition._id
              : undefined;
          const recipient =
            act._recipient !== null && act._recipient._id == frame._id
              ? act._recipient._id
              : undefined;

          const exist = [
            term,
            creates,
            action,
            actor,
            object,
            precondition,
            recipient,
          ];
          // console.log("exist?:", exist);
          // console.log("exist?:", !exist.every((d) => d === undefined));
          return !exist.every((d) => d === undefined);
        })
        .map((fr) => fr._id);
      // console.log("ids of acts:", actFrameIds);

      if (actFrameIds.length > 0) {
        actFrameIds.forEach((id) => {
          const index = state.frames.findIndex((d) => d._id === id);

          state.frames[index]._terminates = state.frames[
            index
          ]._terminates.filter((fr) => fr._id !== frame._id);
          state.frames[index]._creates = state.frames[index]._creates.filter(
            (fr) => fr._id !== frame._id,
          );
          state.frames[index]._action =
            state.frames[index]._action !== null &&
              state.frames[index]._action._id === frame._id
              ? null
              : state.frames[index]._action;
          state.frames[index]._actor =
            state.frames[index]._actor !== null &&
              state.frames[index]._actor._id == frame._id
              ? null
              : state.frames[index]._actor;
          state.frames[index]._object =
            state.frames[index]._object !== null &&
              state.frames[index]._object._id == frame._id
              ? null
              : state.frames[index]._object;
          state.frames[index]._precondition =
            state.frames[index]._precondition !== null &&
              state.frames[index]._precondition._id == frame._id
              ? null
              : state.frames[index]._precondition;
          state.frames[index]._recipient =
            state.frames[index]._recipient !== null &&
              state.frames[index]._recipient._id == frame._id
              ? null
              : state.frames[index]._recipient;
        });
      }

      // remove the Atomicfact from the list of frames
      state.frames = state.frames.filter((fr) => fr._id !== frame._id);
      // console.log("updated list of frames:", state.frames.length, state.frames);
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
        const sourceDoc = new SourceDocument(document, source.title, checkedSentenceIds)
        console.log("sourceDoc", sourceDoc)
        let updatedDocumentList = [
          ...context.state.sourceDocuments,
          sourceDoc
        ];
        //sort alphabetically on title
        updatedDocumentList.sort((d1, d2) => d1.title.localeCompare(d2.title))
        context.state.sourceDocuments = updatedDocumentList
      })
    },
    createAct(context) {
      console.log("create act frame");
      context.state.frameBeingEdited = new Act();
    },
    saveInterpretation(context) {
      const jsonString = JSON.stringify(
        convertInterpretationToJson(
          context.state.frames,
          context.state.sourceDocuments,
        ),
      );
      const blob = new Blob([jsonString], {
        type: "text/plain;charset=utf-8",
      });
      const dateString = new Date().toISOString().substring(0, 19);
      saveAs(blob, `${dateString}_interpretation.json`);
    },
    loadInterpretation(context, jsonText) {
      context.state.sourceDocuments = [];
      context.state.frames = parseJsonToFrames(jsonText);

      //read sources and replace sentenceIds in snippets with the sentence object
      JSON.parse(jsonText).sourceDocs.forEach((d) => {
        context.dispatch("addSource", {
          sourceId: d.id,
          checkedSentenceIds: d.checkedSentenceIds,
        });
      });
    },
    // gets the id of the hovered frame
    // and updates the frames array, which contain
    highlightElements(context, hoveredElement) {
      // array with ids of the related elements ...
      let relatedIds = new Array(hoveredElement._id);
      // Case 1: Hovering over an atomic fact, higlight the related parents
      if (
        hoveredElement._type === "fact" &&
        !hoveredElement._booleanConstruct
      ) {
        // check if acts contain this element
        context.state.frames
          .filter((d) => d._type === "act")
          .forEach((d) =>
            d.checkFrameExistance(d, hoveredElement)
              ? relatedIds.push(d._id)
              : null,
          );
        // console.log("actIds without contexts:", relatedIds)

        // check if contexts contain this element
        context.state.frames
          .filter(
            (d) =>
              d._type === "fact" &&
              d._booleanConstruct &&
              d._id !== hoveredElement._id,
          )
          .forEach((d) =>
            d.checkFrameExistance(hoveredElement)
              ? relatedIds.push(d._id)
              : null,
          );
        // console.log("actIds with contexts:", relatedIds)
        // console.log("context.state.frames: ", context.state.frames)
      }
      // Case 2: if the hovered element is an Act, highlight the corresponding facts
      if (hoveredElement._type === "act") {
        relatedIds = relatedIds.concat(hoveredElement.childrenIds);
      }
      // Case 3: if the hovered element is a context, highlight the corresponding facts
      // check if a booleanConstruct could contain acts or other complex structures.
      if (hoveredElement._type === "fact" && hoveredElement._booleanConstruct) {
        // give me all the children
        relatedIds = relatedIds.concat(hoveredElement.retrieveChildrenIds);
      }

      // change the transparecy of the non-related atomic facts
      context.state.frames.forEach((d) => {
        return relatedIds.includes(d._id)
          ? (d._highlight = false)
          : (d._highlight = true);
      });
    },
    // Mouseout restore
    unhighlightElements(context) {
      context.state.frames.forEach((d) => (d._highlight = false));
    },
  },
});

export { store };
