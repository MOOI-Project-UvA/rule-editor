<template>
  <div id="frame-type-buttons" class="q-pa-md q-gutter-sm">
    Add:
    <q-btn-group>
      <q-btn v-for="tag in tags" :color="colors[tag.value]" :icon="icons[tag.value]" @click="createFact(tag.value)">
        <q-tooltip class="text-subtitle2">
          Create fact of type {{ tag.label }}
        </q-tooltip>
      </q-btn>
    </q-btn-group>
    <q-btn color="primary" :icon="icons['act']" label="act" @click="$store.dispatch('createAct')" />
    <!-- <q-btn color="primary" :icon="icons['duty']" label="duty" @click="startNewFrame('duty')" disabled /> -->
  </div>
  <div id="current-frame" v-if="frameBeingEdited">
    <template v-if="frameBeingEdited.type == 'act'">
      <ActFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="frameBeingEdited.type == 'fact'">
      <FactFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="frameBeingEdited.type == 'duty'">
      <DutyFrameForm @closed="closeActiveFrame" />
    </template>
  </div>
</template>

<script>
import ActFrameForm from '../components/ActFrameForm.vue'
import FactFrameForm from '../components/FactFrameForm.vue'
import DutyFrameForm from '../components/DutyFrameForm.vue'
import { icons, colors } from '../helpers/config.js'
import { Fact, Annotation } from '../helpers/flint.js'

export default {
  data: () => ({
    icons: icons,
    colors: colors,
    tags: [
      { label: "Agent", value: "agent" },
      { label: "Action", value: "action" },
      { label: "Object", value: "object" },
      { label: "Context", value: "context" }
    ],
  }),
  components: {
    ActFrameForm,
    FactFrameForm,
    DutyFrameForm
  },
  computed: {
    activeFrameData() {
      return this.$store.state.activeFrameData
    },
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited
    }
  },
  methods: {
    createFact(tag) {
      let frame = new Fact()
      frame.annotation = new Annotation(
        null, //documentId
        null, //sentenceId
        [], //characterRange
        "" //annotatedText
      )
      frame.annotation.tag = tag
      this.$store.commit("addFrame", frame)
      this.$store.commit("setFrameBeingEdited", frame)
    },
    closeActiveFrame() {
      this.$store.commit("setFrameBeingEdited", null)
    }
  }
};
</script>

<style lang="css" scoped></style>
