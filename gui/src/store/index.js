import { createStore } from "vuex";
import { AtomicFact, ComplexFact, Act } from "../helpers/flint.js";
import reconstructText from "../helpers/reconstructText.js";
import { saveAs } from "file-saver";
import { parseJsonToFrames } from "../helpers/import.js";
import { json } from 'd3-fetch'
import { addParentReferencesToDocument, getSentencesInDocument } from "../helpers/document.js"
import { v4 as uuid4 } from 'uuid'
// Create a new store instance.
const store = createStore({
  state() {
    return {
      frames: [],
      annotationMode: null,
      frameBeingEdited: null,
      fieldBeingEdited: null,
      showFrameSource: false, //show sources for currently edited frame
      // fileContent: null, // the decomposed data will be stored to this one
      // reconstructedData: {
      //   label: "Example title",
      //   docID: "Example docID",
      //   text: "",
      // },
      sourceDocuments: [], // documents that the current interpretation is using as a source
      annotationBeingEdited: null,
      availableSources: [] //list of sources that the user can choose from
    };
  },
  getters: {
    getFileContent: (state) => state.fileContent,
    reconstructedData: (state) => state.reconstructedData,
  },
  mutations: {
    addFrame(state, frame) {
      //add frame if it does not exist yet
      if (!(state.frames.includes(frame))) {
        //set unique id for this frame
        frame["id"] = uuid4();
        state.frames = [...state.frames, frame];
      }
    },
    // setAnnotationMode(state, selectedMode) {
    //   state.annotationMode = selectedMode;
    // },
    setFrameBeingEdited(state, frame) {
      state.frameBeingEdited = frame;
    },
    setShowFrameSource(state, show) {
      state.showFrameSource = show;
    },
    // setFileContent(state, decomposedData) {
    //   state.fileContent = decomposedData;
    //   console.log("decomposedData: ", decomposedData);
    // },
    // setReconstructedData(state, data) {
    //   state.reconstructedData.text = reconstructText(
    //     "",
    //     data.fileContent.document.children
    //   );
    //   state.reconstructedData.docID = data.fileName
    //   console.log("reconstuct")
    // },
    setAnnotationBeingEdited(state, annotation) {
      state.annotationBeingEdited = annotation
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
    readAvailableSources(context) {
      console.log("reading available sources")
      json('public/sources.json').then(data => {
        context.state.availableSources = data
      })
    },
    //reads source, so user can annotate and create frames
    //source object contains filename where to read the source from
    addSource(context, sourceId) {
      const source = this.state.availableSources.find(s => s.id == sourceId)
      console.log("reading", source.fileName)
      json(source.fileName).then(data => {
        const document = data['@graph'].find(d => 'document' in d).document
        document.title = source.title
        //add parent references to each part of the document
        addParentReferencesToDocument(document)
        //add attribute to each sentence to store annotations
        getSentencesInDocument(document).forEach(s => s['annotations'] = [])
        context.state.sourceDocuments = [...context.state.sourceDocuments, document]
        console.log("context.state.sourceDocuments", context.state.sourceDocuments)
      })
    },
    //if annotation has a corresponding fact, update the fact frame.
    //otherwise, show an empty factframe for a new fact
    addAtomicFact(context, annotation) {
      const frame = new AtomicFact()
      frame.annotation = annotation
      context.commit("addFrame", frame)
      console.log("added atomic fact", frame)
    },
    createAct(context) {
      console.log("create act frame");
      context.state.frameBeingEdited = new Act();
    },
    createComplexFact(context) {
      console.log("create complex fact")
      context.state.frameBeingEdited = new ComplexFact()
    },
    saveInterpretation(context) {
      console.log("saving interpretation")
      //convert frames to json string
      //replace object references by id's
      console.log("frames", context.state.frames)
      const string = JSON.stringify(context.state.frames.map(f => f.toFlatObject()))
      console.log("string", string)
      const blob = new Blob([string], {
        type: "text/plain;charset=utf-8",
      });
      const dateString = new Date().toISOString().substring(0, 10);
      saveAs(blob, `${dateString}_interpretation.json`);
    },
    loadInterpretation(context, jsonText) {
      context.state.frames = parseJsonToFrames(jsonText)
      console.log("loaded interpretation", context.state.frames)
    },
    deleteComplexFact(context, frame) {
      console.log("index.js-complexFact:", frame);
      context.commit("remove");
    },

  }
});

export { store };
