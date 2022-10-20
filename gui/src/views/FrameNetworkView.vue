<template>
  <div>Frame network view</div>
  <div>{{ frames.length }} frames stored</div>
</template>

<script>
export default {
  computed: {
    frames() {
      return this.$store.state.frames
    }
  }
}
</script>

<style lang="css" scoped>
</style>
