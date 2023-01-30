<template>
  <div class="row">
    <div class="col-5 column">
      <template v-if="showFrameSource">
        <FrameSourceView :frame="frameBeingEdited" />
      </template>
      <template v-else>
        <SourceView />
      </template>
    </div>
    <div class="col-7 column">
      <div class="row">
        <Menu />
      </div>
      <div class="row">
        <div class="col-8 column">
          <FrameEditorView />
        </div>
        <div class="col-4 column">
          <FrameNetworkView />
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import SourceView from './views/SourceView.vue'
import FrameSourceView from './views/FrameSourceView.vue'
import FrameEditorView from './views/FrameEditorView.vue'
import FrameNetworkView from './views/FrameNetworkView.vue'
import Menu from './views/Menu.vue'

export default {
  name: 'app',

  components: {
    SourceView,
    FrameSourceView,
    FrameEditorView,
    FrameNetworkView,
    Menu
  },
  computed: {
    showFrameSource() {
      return this.$store.state.showFrameSource
    },
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited
    }
  }
}
</script>

<style>
.column {
  padding: 3px;
}
</style>
