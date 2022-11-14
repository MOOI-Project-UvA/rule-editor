<template>
  <div id="frame-chip-container">
    <div v-for="frame in frames">
      <FrameChip :frame="frame" />
    </div>
  </div>
</template>

<script>
import FrameChip from '../components/FrameChip.vue'
export default {
  computed: {
    frames() {
      return this.$store.state.frames
    }
  },
  components: {
    FrameChip
  }
}
</script>

<style lang="css" scoped>
  #frame-chip-container {
    margin: 20px 0px;
  }
</style>
