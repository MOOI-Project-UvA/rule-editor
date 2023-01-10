<template>
  <div class="row">
      <div class="col-5 column"><SourceView /></div>
      <div class="col-5 column"><FrameEditorView /></div>
      <div class="col-2 column"><FrameNetworkView /></div>
  </div>
</template>

<script>

import SourceView from './views/SourceView.vue'
import FrameEditorView from './views/FrameEditorView.vue'
import FrameNetworkView from './views/FrameNetworkView.vue'

export default {
  name: 'app',

  components: {
    SourceView,
    FrameEditorView,
    FrameNetworkView
  }


}
</script>

<style>
  .column {
    padding: 3px;
  }
</style>
