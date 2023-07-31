<template>
  <div class="row">
    <!-- source view column -->
    <div class="col-4 fill-height">
      <SourceView />
    </div>
    <div class="col-3">
      <FrameNetworkView />
    </div>
    <!-- chip view + editor forms column-->
    <div class="col-5">
      <!-- save and load interpretation buttons -->
      <div class="row">
        <Menu />
      </div>
      <div class="row">
        <!-- frame editor view -->
        <FrameEditorView />
      </div>
    </div>
  </div>
  <AnnotationPanel />
</template>

<script>
import SourceView from "./views/SourceView.vue";
import FrameEditorView from "./views/FrameEditorView.vue";
import FrameNetworkView from "./views/FrameNetworkView.vue";
import Menu from "./views/Menu.vue";
import AnnotationPanel from "./components/AnnotationPanel.vue";

export default {
  name: "app",

  components: {
    SourceView,
    FrameEditorView,
    FrameNetworkView,
    Menu,
    AnnotationPanel,
  },
  mounted() {
    this.$store.dispatch("readAvailableSources");
  }
};
</script>

