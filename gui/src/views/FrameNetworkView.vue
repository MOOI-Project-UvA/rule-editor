<template>
  <div id="frame-chip-container">
    <div id="status">{{ message }}</div>
    <div id="chip-container">
      <div v-for="frame in frames" @click="onClick(frame)">
        <FrameChip :frame="frame" :disable="
          allowedSubTypes &&
          frame.type === 'fact' &&
          !allowedSubTypes.includes(frame.subClass)
        " :removable="message === 'Click to edit'" functionality="chip-container" />
      </div>
    </div>
  </div>
</template>

<script>
import FrameChip from "../components/FrameChip.vue";

export default {
  computed: {
    frames() {
      return this.$store.state.frames;
    },
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
    allowedSubTypes() {

      console.log("frameBeingEdited", this.$store.state.frameBeingEdited)
      return this.$store.state.frameBeingEdited && this.$store.state.frameBeingEdited.type != 'fact'
        ? this.$store.state
          .frameBeingEdited
          .allowedSubClassesForActiveField
        : false
    },
    message() {
      return this.frameBeingEdited && this.frameBeingEdited.type !== 'fact'
        ? "Add to frame"
        : this.frames.length > 0 ? "Click to edit" : ""
    }
  },

  components: {
    FrameChip,
  },
  methods: {
    onClick(frame) {
      console.log("clicked frame", frame)
      console.log("this.frameBeingEdited", this.frameBeingEdited);
      //add frame to field in frame being edited
      if (this.frameBeingEdited) {
        // it adds a chip into a form to the FrameEditorView
        console.log("adding frame to", this.frameBeingEdited)
        this.frameBeingEdited.addFrame(frame);
      } else {
        console.log("setting frame being edited")
        // it opens the frame form in the middle
        this.$store.commit("setFrameBeingEdited", frame);
      }
    },
  },
};
</script>

<style lang="css" scoped>
#frame-chip-container {
  margin: 20px 0px;
  display: inline-block;
}

#chip-container {
  display: flex;
  flex-wrap: wrap;
}

.message {
  /* margin-top: 10px; */
}
</style>
