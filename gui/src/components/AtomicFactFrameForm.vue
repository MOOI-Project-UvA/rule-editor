<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
        <div class="float-left text-h6">{{ frame.fact ? frame.fact : "Atomic fact" }}</div>
        <div v-if="frame.subClass" class="float-right">
          {{ frame.subClass }}
          <q-icon :name="icons[frame.subClass]"/>
        </div>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <q-input v-model="frame.fact" label="Fact" />
      <q-input v-model="frame.function" label="Function" />
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { icons } from '../helpers/config.js'
export default {
  data: () => ({
    icons: icons
  }),
  computed: {
    frame() {
      return this.$store.state.frameBeingEdited
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
