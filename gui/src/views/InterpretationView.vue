<script>
import SourceView from "./SourceView.vue";
import FrameNetworkView from "./FrameNetworkView.vue";
import FrameEditorView from "./FrameEditorView.vue";
import AnnotationPanel from "../components/AnnotationPanel.vue";
import Menu from "./Menu.vue";

export default {
  name: "InterpretationView",
  components: {
    Menu,
    AnnotationPanel,
    FrameEditorView,
    FrameNetworkView,
    SourceView,
  },
};
</script>

<template>
  <div id="interpretation-view" class="row" style="height: 100%">
    <!-- source view column -->
    <div class="col-4">
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

<style scoped lang="css"></style>
