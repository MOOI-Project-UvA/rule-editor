<template>
  <div id="frame-type-buttons" class="q-pa-md q-gutter-sm">
    <q-btn
      color="primary"
      icon="mdi-file-document-edit-outline"
      label="Add act frame"
      @click="startNewFrame('act')"
    />
    <q-btn
      color="secondary"
      icon="mdi-file-document-edit-outline"
      label="Add fact frame"
      @click="startNewFrame('fact')"
    />
    <q-btn
      color="purple"
      icon="mdi-file-document-edit-outline"
      label="Add duty frame"
      @click="startNewFrame('duty')"
    />
  </div>
  <div id="current-frame" v-if="activeFrameData">
    <template v-if="activeFrameData.type == 'act'">
      <ActFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="activeFrameData.type == 'fact'">
      <FactFrameForm @closed="closeActiveFrame"/>
    </template>
    <template v-if="activeFrameData.type == 'duty'">
      <DutyFrameForm @closed="closeActiveFrame"/>
    </template>
  </div>
</template>

<script>
import ActFrameForm from '../components/ActFrameForm.vue'
import FactFrameForm from '../components/FactFrameForm.vue'
import DutyFrameForm from '../components/DutyFrameForm.vue'

export default {
  components: {
    ActFrameForm,
    FactFrameForm,
    DutyFrameForm
  },
  computed: {
    activeFrameData() {
      return this.$store.state.activeFrameData
    }
  },
  methods: {
    startNewFrame(type) {
      this.$store.dispatch("startNewFrame", type)
    },
    closeActiveFrame() {
      this.$store.dispatch("closeActiveFrame")
    }
  }
};
</script>

<style lang="css" scoped></style>
