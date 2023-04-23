<template>
  <div class="row">
    <!-- source view column -->
    <div class="col-md-5 column fill-height">
      <SourceView />
    </div>
    <div class="col-md-3 column">
      <FrameNetworkView />
    </div>
    <!-- chip view + editor forms column-->
    <div class="col-md-4 column">
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
  <div
    id="annotationPanel"
    v-if="annotationBeingEdited"
    :style="{
      left: annotationBeingEdited.positionOnScreen[0] + 'px',
      top: annotationBeingEdited.positionOnScreen[1] + 'px',
    }"
  >
    <AnnotationPanel :annotation="annotationBeingEdited" />
  </div>
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
  },
  computed: {
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
    annotationBeingEdited() {
      return this.$store.state.annotationBeingEdited;
    },
  },
};
</script>

<style>
.column {
  padding: 3px;
}

#annotationPanel {
  position: absolute;
}
</style>
