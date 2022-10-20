<template>
  <div class="row">
      <div class="col-4"><SourceView /></div>
      <div class="col-4"><FrameEditorView /></div>
      <div class="col-4"><FrameNetworkView /></div>
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
