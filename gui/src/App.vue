<template>
  <div class="row">
    <!-- source view column -->
    <div class="col-5 q-p-2 fill-height">
      <SourceView />
    </div>
    <div class="col-3 q-p-2">
      <FrameNetworkView />
    </div>
    <!-- chip view + editor forms column-->
    <div class="col-4 q-p-2">
      <!-- save and load interpretation buttons -->
      <div class="row">
        <Menu />
      </div>
      <div class="row">
        <!-- frame editor view -->
        <FrameEditorView />

        <!--        &lt;!&ndash; chip view &ndash;&gt;-->
        <!--        <div class="col-4 column">-->
        <!--          <FrameNetworkView />-->
        <!--        </div>-->
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

