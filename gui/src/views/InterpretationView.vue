<script>
import SourceView from "./SourceView.vue";
import FramesView from "./FramesView.vue";
import FrameEditorView from "./FrameEditorView.vue";
import AnnotationPanel from "../components/AnnotationPanel.vue";
import NewFrameMenu from "../components/NewFrameMenu.vue";
import LoadSaveMenu from "../components/LoadSaveMenu.vue";

export default {
  name: "InterpretationView",
  components: {
    AnnotationPanel,
    FrameEditorView,
    FramesView,
    SourceView,
    NewFrameMenu,
    LoadSaveMenu,
  },
};
</script>

<template>
  <div class="full-height">
    <!-- main content of the card -->
    <!-- source view column -->
    <div class="row">
      <div class="col-6">
        <SourceView />
      </div>
      <!-- <div class="col-3">
        <div class="row">
          <FrameEditorView />
        </div>
      </div> -->
      <div class="col-6">
        <div>
          <!-- <FramesView /> -->
        </div>
        <!-- <div>
          <LoadSaveMenu />
        </div> -->
      </div>
    </div>
  </div>
  <AnnotationPanel />
</template>

<style scoped lang="css"></style>
