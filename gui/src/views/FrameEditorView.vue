<template>
  <div id="frame-type-buttons" class="q-pa-md q-gutter-sm">
      <q-btn
        color="primary"
        icon="mdi-file-document-edit-outline"
        label="Add act frame"
        @click="currentFrameType = 'act'"
      />
      <q-btn
        color="secondary"
        icon="mdi-file-document-edit-outline"
        label="Add fact frame"
        @click="currentFrameType = 'fact'"
      />
      <q-btn
        color="purple"
        icon="mdi-file-document-edit-outline"
        label="Add duty frame"
        @click="currentFrameType = 'duty'"
      />
  </div>
  <div id="current-frame">
    <template v-if="currentFrameType == 'act'">
      <ActFrameForm @closed="currentFrameType = null"/>
    </template>
  </div>
</template>

<script>
import ActFrameForm from '../components/ActFrameForm.vue'
export default {
  data: () => ({
    currentFrameType: null
  }),
  components: {
    ActFrameForm
  },

}
</script>

<style lang="css" scoped>
</style>
