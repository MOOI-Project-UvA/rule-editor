<template>
  <div id="frame-type-buttons" class="q-pa-md q-gutter-sm">
    Add:
    <q-btn color="primary" :icon="icons['complexFact']" label="complex fact"
      @click="$store.dispatch('createComplexFact')" />
    <q-btn color="primary" :icon="icons['act']" label="act" @click="$store.dispatch('createAct')" />
    <q-btn color="primary" :icon="icons['duty']" label="duty" @click="startNewFrame('duty')" disabled />
  </div>
  <div id="current-frame" v-if="frameBeingEdited">
    <template v-if="frameBeingEdited.type == 'act'">
      <ActFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="frameBeingEdited.type == 'fact'">
      <AtomicFactFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="frameBeingEdited.type == 'complexFact'">
      <ComplexFactFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="frameBeingEdited.type == 'duty'">
      <DutyFrameForm @closed="closeActiveFrame" />
    </template>
  </div>
</template>

<script>
import ActFrameForm from '../components/ActFrameForm.vue'
import AtomicFactFrameForm from '../components/AtomicFactFrameForm.vue'
import ComplexFactFrameForm from '../components/ComplexFactFrameForm.vue'
import DutyFrameForm from '../components/DutyFrameForm.vue'
import { icons, colors } from '../helpers/config.js'

export default {
  data: () => ({
    icons: icons,
    colors: colors
  }),
  components: {
    ActFrameForm,
    AtomicFactFrameForm,
    ComplexFactFrameForm,
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
    startNewFrame(type) {
      this.$store.dispatch("startNewFrame", type)
    },
    closeActiveFrame() {
      this.$store.commit("setFrameBeingEdited", null)
    }
  }
};
</script>

<style lang="css" scoped></style>
