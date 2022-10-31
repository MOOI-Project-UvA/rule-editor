import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      frames: [],
      annotationMode: null,
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
  },
  actions: {},
});

export { store };
