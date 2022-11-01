<template>
  <q-card flat bordered class="my-card" v-if="frame">
    <q-card-section>
        <div class="text-h6">{{ frame.fact ? frame.fact : "Fact frame" }}</div>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <q-input square outlined clearable v-model="frame.fact" label="Fact" />
      <q-input square outlined clearable v-model="frame.function" label="Function" />
      <q-input square outlined clearable v-model="frame.source" label="Source" />
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  data: () => ({
  }),
  computed: {
    frame() {
      return this.$store.state.activeFrameData
    }
  },
  methods: {
    cancelClicked() {
      this.$emit("closed")
    },
    saveClicked() {
      //store frame
      this.$store.commit("addFrame", this.frame)
      this.$emit("closed")
    }
  }
}
</script>

<style lang="css" scoped>
</style>
