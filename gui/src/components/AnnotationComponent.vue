<template>
  <div class="annotation-container">
    <div id="panel" ref="panel" v-html="text"></div>
  </div>
</template>

<script>
import { Recogito } from "@recogito/recogito-js";
import "@recogito/recogito-js/dist/recogito.min.css";

export default {
  name: "AnnotationComponent",
  props: {
    text: {
      type: String,
      required: true,
      default: "",
    },
    tagList: {
      type: Array,
      required: false,
    },
    mode: {
      type: String,
      default: "Annotation",
      required: false,
    },
    widgets: {
      type: Array,
      required: false,
      default() {
        return [
          { widget: "COMMENT" },
          {
            widget: "TAG",
            vocabulary: ["Place", "Person", "Event", "Organization", "Animal"],
          },
        ];
      },
    },
  },
  data: () => ({
    recogitoInstance: null,
  }),
  computed: {
    annotationMode() {
      return this.$store.state.annotationMode;
    },
  },
  mounted() {
    this.recogitoInstance = new Recogito({
      content: this.$refs.panel,
      widgets: this.widgets,
    });
    // adding event handlers
    this.setEventHandlers();
  },
  methods: {
    setEventHandlers() {
      // used when annotation has been created
      this.recogitoInstance.on("createAnnotation", (annotation) => {
        // this.saveAnnotation(annotation);
        console.log("created Annotation!: ", annotation);
      });
      // load annotations
      this.recogitoInstance.loadAnnotations("/annotations.json");
    },
  },
  watch: {
    annotationMode(mode) {
      this.recogitoInstance.setMode(mode);
    },
  },
};
</script>

<style scoped>
#panel {
  overflow-y: auto;
  max-height: 75vh;
  z-index: 100;
}
</style>
