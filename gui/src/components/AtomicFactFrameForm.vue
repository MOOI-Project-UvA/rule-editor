<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
      FACT of type <i>{{ frame.subClass }}</i>
      <!-- <q-icon :name="frame.subClass in icons ? icons[frame.subClass] : icons['other']"/> -->
    </q-card-section>
    <q-card-section>
      <q-input v-model="frame.label" label="label" input-style="font-size: 16pt; font-weight:bold" />
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <q-input v-model="frame.fact" label="Fact" autogrow />
      <!-- <q-input v-model="frame.function" label="Function" /> -->
    </q-card-section>
    <q-card-section>
      <q-toggle v-model="subdivided" label="Opdelen in facts" @update:model-value="subdivisionToggled" />
      <div v-if="subdivided" class="q-ml-xs">
        <BooleanConstructPanel :booleanConstruct="frame.booleanConstruct" />
      </div>
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { icons, colors } from '../helpers/config.js'
import BooleanConstructPanel from './BooleanConstructPanel.vue'
import { BooleanConstruct } from '../helpers/flint';
export default {
  data: () => ({
    icons: icons,
    colors: colors,
    subdivided: false
  }),
  computed: {
    frame() {
      return this.$store.state.frameBeingEdited;
    }
  },
  methods: {
    cancelClicked() {
      this.$emit("closed");
    },
    saveClicked() {
      //store frame
      this.$store.commit("addFrame", this.frame);
      this.$emit("closed");
    },
    subdivisionToggled() {
      console.log("subdiv")
      this.frame.booleanConstruct = this.subdivided
        ? new BooleanConstruct()
        : null
    }
  },
  components: { BooleanConstructPanel }
}
</script>

<style lang="css" scoped></style>
