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
  <div id="interpretation-view">
    <!-- main content of the card -->
    <!-- source view column -->
    <div class="row q-mt-xl q-mx-lg">
      <div class="col-4">
        <SourceView />
      </div>
      <div class="col-4">
        <FrameNetworkView />
      </div>
      <!-- chip view + editor forms column-->
      <div class="col-4">
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
  </div>
  <AnnotationPanel />
</template>

<style scoped lang="css">
#interpretation-view {
  //min-height: calc(100vh - 72px - 48px - 50px);
}
.fill-height {
  //min-height: calc(100vh - 72px - 48px - 50px);
}
</style>
