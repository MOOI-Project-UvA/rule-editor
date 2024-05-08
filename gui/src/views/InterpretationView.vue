<script>
import SourceView from "./SourceView.vue";
import FramesView from "./FramesView.vue";
import AnnotationPanel from "../components/AnnotationPanel.vue";
import AnnotationList from "../components/AnnotationList.vue"
import NewFrameMenu from "../components/NewFrameMenu.vue";
import LoadSaveMenu from "../components/LoadSaveMenu.vue";

export default {
  name: "InterpretationView",
  components: {
    AnnotationPanel,
    AnnotationList,
    FramesView,
    SourceView,
    NewFrameMenu,
    LoadSaveMenu,
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
        <!-- <div>
          <LoadSaveMenu />
        </div> -->
      </div>
    </div>
  </div>
  <AnnotationPanel />
  <AnnotationList />
</template>

<style scoped lang="css"></style>
