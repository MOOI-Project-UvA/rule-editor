import { createStore } from "vuex";
import { AtomicFact, ComplexFact, Act } from '../helpers/flint.js'

// Create a new store instance.
const store = createStore({
  state() {
    return {
      frames: [],
      annotationMode: null,
      frameBeingEdited: null,
      fieldBeingEdited: null,
      showFrameSource: false //show sources for currently edited frame
    };
  },
  mutations: {
    addFrame(state, frame) {
      //add id
      frame['id'] = state.frames.length
      //sets the user state. re-assign to trigger resonsiveness
      console.log("adding frame", frame)
      state.frames = [...state.frames, frame];
    },
    setAnnotationMode(state, selectedMode) {
      state.annotationMode = selectedMode;
    },
    setFrameBeingEdited(state, frame) {
      state.frameBeingEdited = frame
    },
    setShowFrameSource(state, show) {
      state.showFrameSource = show
    }
  },
  actions: {
    // startNewFrame(context, type) {
    //   console.log("startNewFrame", type)
    //   switch(type) {
    //     case 'act':
    //       context.state.activeFrameData = {
    //         type: 'act',
    //         act: null,
    //         action: null,
    //         actor: null,
    //         object: null,
    //         precondition: null,
    //         recipient: null,
    //         resultPos: null,
    //         resultNeg: null,
    //         source: null
    //       }
    //       break
    //     case 'fact':
    //       context.state.activeFrameData = {
    //         type: 'fact',
    //         fact: null,
    //         function: null,
    //         source: null
    //       }
    //       break
    //     case 'duty':
    //       context.state.activeFrameData = {
    //         type: 'duty',
    //         duty: null,
    //         holder: null,
    //         claimant: null,
    //         creatingAct: null,
    //         terminatingAct: null,
    //         enforcingAct: null,
    //         source: null
    //       }
    //       break
    //   }
    // },
    //if annotation has a corresponding fact, show the fact frame.
    //otherwise, show an empty factframe for a new fact
    showAtomicFactForAnnotation(context, annotation) {
      console.log("showAtomicFactForAnnotation", annotation)

      const text = annotation.target.selector
        .find(s => s.type == 'TextQuoteSelector')
        .exact

      //find any existing fact frame for this annotation
      let frame = context.state.frames
        .filter(f => f.type == 'fact')
        .find(f => f.annotation == annotation)
      if (!frame) {
        frame = new AtomicFact(
          text, //name
          annotation //annotation
        )
      }
      context.state.frameBeingEdited = frame
    },
    createAct(context) {
      console.log("create act frame")
      context.state.frameBeingEdited = new Act()
    },
    createComplexFact(context) {
      console.log("create complex fact")
      context.state.frameBeingEdited = new ComplexFact()
    }
  }
});

export { store };
