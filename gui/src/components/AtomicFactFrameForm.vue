<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
        <div class="float-left text-h6">{{ frame.name ? frame.name : "Atomic fact" }}</div>
        <div class="float-right">
          {{ frame.subClass }}
          <!-- <q-icon :name="frame.subClass in icons ? icons[frame.subClass] : icons['other']"/> -->
        </div>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <q-input v-model="frame.name" label="Fact" />
      <!-- <q-input v-model="frame.function" label="Function" /> -->
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { icons, colors } from '../helpers/config.js'
export default {
  data: () => ({
    icons: icons, //from template you cannot access imported icons directly
    colors: colors
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
