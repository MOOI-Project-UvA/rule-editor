<template>
  <div id="frame-type-buttons" class="q-pa-md q-gutter-sm">
    <q-btn
      color="primary"
      icon="mdi-file-document-edit-outline"
      label="Add act"
      @click="$store.dispatch('createAct')"
    />
    <q-btn
      color="secondary"
      icon="mdi-file-document-edit-outline"
      label="Add complex fact"
      @click="$store.dispatch('createComplexFact')"
    />
    <q-btn
      color="purple"
      icon="mdi-file-document-edit-outline"
      label="Add duty"
      @click="startNewFrame('duty')"
    />
  </div>
  <div id="current-frame" v-if="frameBeingEdited">
    <template v-if="frameBeingEdited.type == 'act'">
      <ActFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="frameBeingEdited.type == 'fact' && frameBeingEdited.subClass != 'complex'">
      <AtomicFactFrameForm @closed="closeActiveFrame"/>
    </template>
    <template v-if="frameBeingEdited.type == 'fact' && frameBeingEdited.subClass == 'complex'">
      <ComplexFactFrameForm @closed="closeActiveFrame"/>
    </template>
    <template v-if="frameBeingEdited.type == 'duty'">
      <DutyFrameForm @closed="closeActiveFrame"/>
    </template>
  </div>
</template>

<script>
import ActFrameForm from '../components/ActFrameForm.vue'
import AtomicFactFrameForm from '../components/AtomicFactFrameForm.vue'
import ComplexFactFrameForm from '../components/ComplexFactFrameForm.vue'
import DutyFrameForm from '../components/DutyFrameForm.vue'

export default {
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
