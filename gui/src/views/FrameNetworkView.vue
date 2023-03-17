<template>
  <div id="frame-chip-container">
    <div>{{ message }}</div>
    <div v-for="frame in frames" @click="onClick(frame)">
      <FrameChip :frame="frame" :disable="
        allowedSubTypes &&
        frame.type == 'fact' &&
        !allowedSubTypes.includes(frame.subClass)
      " />
    </div>
  </div>
</template>

<script>
import FrameChip from '../components/FrameChip.vue'
export default {
  computed: {
    frames() {
      return this.$store.state.frames
    },
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited
    },
    allowedSubTypes() {
      console.log("frameBeingEdited", this.$store.state.frameBeingEdited)
      return this.$store.state.frameBeingEdited && this.$store.state.frameBeingEdited.type != 'fact'
        ? this.$store.state
          .frameBeingEdited
          .allowedSubClassesForActiveField
        : null
    },
    message() {
      return this.frameBeingEdited && this.frameBeingEdited.type != 'fact'
        ? "Add to frame"
        : this.frames.length > 0 ? "Click to edit" : ""
    }
  },
  components: {
    FrameChip
  },
  methods: {
    onClick(frame) {
      console.log("this.frameBeingEdited", this.frameBeingEdited)
      if (this.frameBeingEdited && this.frameBeingEdited.type != 'fact') {
        this.frameBeingEdited.addFrame(frame)
      } else {
        this.$store.commit("setFrameBeingEdited", frame)
      }
    }
  }
}
</script>

<style lang="css" scoped>
#frame-chip-container {
  margin: 20px 0px;
}

.message {
  /* margin-top: 10px; */
}
</style>
