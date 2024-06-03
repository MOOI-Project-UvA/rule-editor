<script>
import SourceView from "./SourceView.vue";
import FramesView from "./FramesView.vue";

import NewFrameMenu from "../components/NewFrameMenu.vue";
import LoadSaveMenu from "../components/LoadSaveMenu.vue";
import AnnotationPanel from "../components/AnnotationPanel.vue";
import AnnotationList from "../components/AnnotationList.vue"
import AddingAnnotationToFramePanel from "../components/AddingAnnotationToFramePanel.vue"
import DeleteConfirmationPanel from "../components/DeleteConfirmationPanel.vue"

export default {
  name: "InterpretationView",
  components: {
    FramesView,
    SourceView,
    NewFrameMenu,
    LoadSaveMenu,
    AnnotationPanel,
    AnnotationList,
    AddingAnnotationToFramePanel,
    DeleteConfirmationPanel
  },
  computed: {
    sourceViewIsCollapsed() {
      return this.$store.state.sourceViewIsCollapsed
    }
  }
};
</script>

<template>
  <div>
    <!-- main content of the card -->
    <!-- source view column -->
    <div class="row">
      <div v-show="!sourceViewIsCollapsed" class="col-5">
        <SourceView />
      </div>
      <div class="col-auto">
        <q-btn round size="xs" :icon="sourceViewIsCollapsed ? 'mdi-arrow-expand-right' : 'mdi-arrow-collapse-left'"
          @click="this.$store.state.sourceViewIsCollapsed = !this.$store.state.sourceViewIsCollapsed"></q-btn>
      </div>
      <div class="col">
        <div>
          <FramesView />
        </div>
      </div>
    </div>
  </div>
  <!-- panel that appears when a new annotation is made by selecting source text -->
  <AnnotationPanel />
  <!-- panel that appears when existing annotation(s) have been clicked in the source text -->
  <AnnotationList />
  <!-- panel that appears when user is adding an annotation to a frame -->
  <AddingAnnotationToFramePanel />
  <!-- panel that asks for confirmation when user is deleting a frame -->
  <DeleteConfirmationPanel />
</template>

<style scoped lang="css"></style>
