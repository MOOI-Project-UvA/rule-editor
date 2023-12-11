<script>
import SourceView from "./SourceView.vue";
import FrameNetworkView from "./FrameNetworkView.vue";
import FrameEditorView from "./FrameEditorView.vue";
import AnnotationPanel from "../components/AnnotationPanel.vue";
import NewFrameMenu from "../components/NewFrameMenu.vue";
import LoadSaveMenu from "../components/LoadSaveMenu.vue";

export default {
  name: "InterpretationView",
  components: {
    AnnotationPanel,
    FrameEditorView,
    FrameNetworkView,
    SourceView,
    NewFrameMenu,
    LoadSaveMenu
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
        <NewFrameMenu />
        <FrameEditorView />
      </div>
      <div class="col-4">
        <LoadSaveMenu />
        <FrameNetworkView />
      </div>
    </div>
  </div>
  <AnnotationPanel />
</template>

<style scoped lang="css">
#interpretation-view {
  min-height: calc(100vh - 72px - 48px - 50px);
}

.fill-height {
  min-height: calc(100vh - 72px - 48px - 50px);
}
</style>
