import { createStore } from "vuex";
import { AtomicFact, ComplexFact, Act } from "../helpers/flint.js";
import reconstructText from "../helpers/reconstructText.js";
import { saveAs } from "file-saver";
import { parseJsonToFrames } from "../helpers/import.js";
import { json } from 'd3-fetch'
import { addParentReferencesToDocument, getSentencesInDocument } from "../helpers/document.js"

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
        frame["id"] = state.frames.length;
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
      console.log("setAnnotationBeingEdited")
      state.annotationBeingEdited = annotation
    }
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
      annotation.frame = frame
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
    }
  }
});

export { store };
