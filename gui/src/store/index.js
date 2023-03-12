import { createStore } from "vuex";
import { AtomicFact, ComplexFact, Act } from "../helpers/flint.js";
import reconstructText from "../helpers/reconstructText.js";
import { saveAs } from "file-saver";
import { parseJsonToFrames } from "../helpers/import.js";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      frames: [],
      annotationMode: null,
      frameBeingEdited: null,
      fieldBeingEdited: null,
      showFrameSource: false, //show sources for currently edited frame
      fileContent: null, // the decomposed data will be stored to this one
      reconstructedData: {
        label: "Example title",
        docID: "Example docID",
        text: "",
      },
    };
  },
  mutations: {
    addFrame(state, frame) {
      //add id
      frame["id"] = state.frames.length;
      //sets the user state. re-assign to trigger resonsiveness
      console.log("adding frame", frame);
      state.frames = [...state.frames, frame];
    },
    setAnnotationMode(state, selectedMode) {
      state.annotationMode = selectedMode;
    },
    setFrameBeingEdited(state, frame) {
      state.frameBeingEdited = frame;
    },
    setShowFrameSource(state, show) {
      state.showFrameSource = show;
    },
    setFileContent(state, decomposedData) {
      state.fileContent = decomposedData;
      console.log("decomposedData: ", decomposedData);
    },
    setReconstructedData(state, data) {
      state.reconstructedData.text = reconstructText(
        "",
        data.fileContent.document.children
      );
      state.reconstructedData.docID = data.fileName;
      console.log("reconstuct");
    },
    removeComplexFact(state, frame) {
      state.frames = state.frames.filter((fr) => fr._id !== frame._id);
      console.log("updated list of frames:", state.frames.length, state.frames);
    },
    removeAct(state, frame) {
      // removed the act from the list of frames
      state.frames = state.frames.filter((fr) => fr._id !== frame._id);
      console.log("updated list of frames:", state.frames.length, state.frames);
    },
    removeAtomicFact(state, frame) {
      // remove the fact from an act or a complexFact
      // case1: complex fact
      // get the generated ids (frame._id) of the complexFrames, which contain the AtomicFact
      const complexFramesIds = state.frames
        .filter((fr) => fr._type === "complexFact")
        .filter((fr) => fr._factList.find((d) => d._id === frame._id))
        .map((fr) => fr._id);
      console.log("id of complexFrames:", complexFramesIds);

      if (complexFramesIds.length > 0) {
        complexFramesIds.forEach((id) => {
          const index = state.frames.findIndex((d) => d._id === id);
          state.frames[index]._factList = state.frames[index]._factList.filter(
            (fr) => fr._id !== frame._id
          );
        });
      }
      // get the generated ids of the acts that contain the AtomicFact to be deleted
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
          console.log("exist?:", exist);
          console.log("exist?:", !exist.every((d) => d === undefined));
          return !exist.every((d) => d === undefined);
        })
        .map((fr) => fr._id);
      console.log("ids of acts:", actFrameIds);

      if (actFrameIds.length > 0) {
        actFrameIds.forEach((id) => {
          const index = state.frames.findIndex((d) => d._id === id);

          state.frames[index]._terminates = state.frames[
            index
          ]._terminates.filter((fr) => fr._id !== frame._id);
          state.frames[index]._creates = state.frames[index]._creates.filter(
            (fr) => fr._id !== frame._id
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
      console.log("updated list of frames:", state.frames.length, state.frames);
    },
  },
  actions: {
    //if annotation has a corresponding fact, show the fact frame.
    //otherwise, show an empty factframe for a new fact
    showAtomicFactForAnnotation(context, annotation) {
      console.log("showAtomicFactForAnnotation", annotation);

      const text = annotation.target.selector.find(
        (s) => s.type == "TextQuoteSelector"
      ).exact;

      //find any existing fact frame for this annotation
      let frame = context.state.frames
        .filter((f) => f.type == "fact")
        .find((f) => f.annotation == annotation);
      if (!frame) {
        frame = new AtomicFact(
          text, //name
          annotation //annotation
        );
        frame = new AtomicFact();
        frame.name = text;
        frame.annotation = annotation;
        // adding this for property for removing the chips
        frame.shown = true;
      }
      context.state.frameBeingEdited = frame;
    },
    createAct(context) {
      console.log("create act frame");
      context.state.frameBeingEdited = new Act();
    },
    createComplexFact(context) {
      console.log("create complex fact");
      context.state.frameBeingEdited = new ComplexFact();
    },
    saveInterpretation(context) {
      console.log("saving interpretation");
      //convert frames to json string
      //replace object references by id's
      console.log("frames", context.state.frames);
      const string = JSON.stringify(
        context.state.frames.map((f) => f.toFlatObject())
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
    readDecomposedData(context, fileContent) {
      const filename = fileContent.filename;
      return new Promise((resolve, reject) => {
        context.commit("setFileContent", fileContent);
        resolve({ fileContent: context.state.fileContent, fileName: filename });
      });
    },
    reconstructTextAction({ dispatch, commit }, data) {
      return dispatch("readDecomposedData", data).then((res) => {
        commit("setReconstructedData", res);
        return false;
      });
    },
    deleteComplexFact(context, frame) {
      console.log("index.js-complexFact:", frame);
      context.commit("remove");
    },
  },
  getters: {
    getFileContent: (state) => state.fileContent,
    getReconstructedData: (state) => state.reconstructedData,
  },
});

export { store };
