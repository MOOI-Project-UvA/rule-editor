import { createStore } from "vuex";
import { Fact } from "../model/fact.js";
import { Act } from "../model/act.js";
import { Claimduty } from "../model/claimduty.js";
import reconstructText from "../helpers/reconstructText.js";
import { saveAs } from "file-saver";
import { parseJsonToFrames } from "../helpers/import.js";
import { json } from "d3-fetch";
import {
  addParentReferencesToDocument,
  getSentencesInDocument,
} from "../helpers/document.js";
import { v4 as uuid4 } from "uuid";
// Create a new store instance.
const store = createStore({
  state() {
    return {
      frames: [], //list of frames in interpretation
      annotationMode: null,
      frameBeingEdited: null, //frame for which editor-pane is opened
      booleanConstructBeingEdited: null, //boolean-field being edited, so we can add clicked frame to it
      showFrameSource: false, //show sources for currently edited frame
      sourceDocuments: [], // documents that are opened in the current interpretation
      annotationBeingEdited: null,
      availableSources: [], //list of sources that the user can choose from
      taskInformation: {
        title: "",
        description: "",
      }, // information about the task
    };
  },
  getters: {
    getFileContent: (state) => state.fileContent,
    reconstructedData: (state) => state.reconstructedData,
    getTaskInformation: (state) => state.taskInformation,
  },
  mutations: {
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
      if (annotation) {
        frame.addAnnotation(annotation); //this also sets annotation.frame
      }
      frame.type = frameType;
      frame["id"] = uuid4();
      state.frames = [...state.frames, frame];

      //if a booleanconstruct is being edited, add the new frame to it
      if (state.booleanConstructBeingEdited) {
        state.booleanConstructBeingEdited.frame = frame;
        state.booleanConstructBeingEdited = null; //deselect boolean construct
        //if frame is being edited and is has an active field, add frame to that field
      } else if (state.frameBeingEdited && state.frameBeingEdited.activeField) {
        state.frameBeingEdited.addFrame(frame);
      } else {
        state.frameBeingEdited = frame;
      }
    },
    createNewFrameViaNlp(state, { frameType, annotation, subType, role }) {
      let frame = new Fact();
      if (annotation) {
        frame.addAnnotation(annotation); //this also sets annotation.frame
      }
      frame.type = frameType;

      subType === "Agent"
        ? frame.comments.push(`Recommended role by the NLP model: ${role}`)
        : null;

      frame.subType = frameType.subTypes.filter(
        (d) => d.id == subType.toLowerCase(),
      )[0];
      frame["id"] = uuid4();
      state.frames = [...state.frames, frame];
    },
    setFrameBeingEdited(state, frame) {
      state.frameBeingEdited = frame;
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
    readAvailableSources(context) {
      console.log("reading available sources");
      json("/sources.json").then((data) => {
        context.state.availableSources = data;
      });
    },
    //reads source, so user can annotate and create frames
    //source object contains filename where to read the source from
    addSource(context, sourceId) {
      // console.log("addSource", sourceId)
      const source = this.state.availableSources.find((s) => s.id == sourceId);
      // console.log("reading", source.fileName)
      json(source.fileName).then((data) => {
        const document = data["@graph"].find((d) => "document" in d).document;
        document.title = source.title;
        //add parent references to each part of the document
        addParentReferencesToDocument(document);
        //add attribute to each sentence to store annotations
        getSentencesInDocument(document).forEach((s, i) => {
          s["annotations"] = [];
          s["checked"] = true;
          s["orderId"] = i;
          s["loading"] = false;
        });
        const sentences = getSentencesInDocument(document);
        document.sentences = sentences;

        context.state.sourceDocuments = [
          ...context.state.sourceDocuments,
          document,
        ];
        // console.log("context.state.sourceDocuments", context.state.sourceDocuments)
      });
    },
    createAct(context) {
      console.log("create act frame");
      context.state.frameBeingEdited = new Act();
    },
    saveInterpretation(context) {
      console.log("saving interpretation");
      //convert frames to json string
      //replace object references by id's
      console.log("frames", context.state.frames);
      const string = JSON.stringify(
        context.state.frames.map((f) => f.toFlatObject()),
      );
      console.log("string", string);
      const blob = new Blob([string], {
        type: "text/plain;charset=utf-8",
      });
      const dateString = new Date().toISOString().substring(0, 10);
      saveAs(blob, `${dateString}_interpretation.json`);
    },
    loadInterpretation(context, jsonText) {
      context.state.frames = parseJsonToFrames(jsonText);
      console.log("loaded interpretation", context.state.frames);
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
