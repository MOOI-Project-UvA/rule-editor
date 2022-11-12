import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      frames: [],
      annotationMode: null,
      activeFrameData: null,
      selectedAnnotation: null
    };
  },
  mutations: {
    addFrame(state, frame) {
      //sets the user state. re-assign to trigger resonsiveness
      state.frames = [...state.frames, frame];
    },
    setAnnotationMode(state, selectedMode) {
      state.annotationMode = selectedMode;
    },
    setActiveFrameData(state, frameData) {
      state.activeFrameData = frameData
    },
    setSelectedAnnotation(state, annotation) {
      state.selectedAnnotation = annotation
    }
  },
  actions: {
    startNewFrame(context, type) {
      console.log("startNewFrame", type)
      switch(type) {
        case 'act':
          context.state.activeFrameData = {
            type: 'act',
            act: null,
            action: null,
            actor: null,
            object: null,
            precondition: null,
            recipient: null,
            resultPos: null,
            resultNeg: null,
            source: null
          }
          break
        case 'fact':
          context.state.activeFrameData = {
            type: 'fact',
            fact: null,
            function: null,
            source: null
          }
          break
        case 'duty':
          context.state.activeFrameData = {
            type: 'duty',
            duty: null,
            holder: null,
            claimant: null,
            creatingAct: null,
            terminatingAct: null,
            enforcingAct: null,
            source: null
          }
          break
      }
    },
    closeActiveFrame(context) {
      context.state.activeFrameData = null
    },
    addAnnotationToActiveFrame(context, annotation) {
      const text = annotation.annotation.target.selector
        .find(s => s.type == 'TextQuoteSelector')
        .exact
      const tag = annotation.annotation.bodies
        .find(b => ('purpose' in b) && b.purpose == 'tagging')
        .value
      // find corresponding field in active frame
      if (context.state.activeFrameData) {
        const field = Object.keys(context.state.activeFrameData)
          .find(f => f.toLowerCase() == tag.toLowerCase())
        if (field) {
          context.state.activeFrameData[field] = text
        }
      }
    }
  },
});

export { store };
