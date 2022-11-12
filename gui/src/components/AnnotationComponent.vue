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
            vocabulary: ["Agent", "Action", "Object"],
          }
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
        this.$store.commit("setSelectedAnnotation", annotation)
      });
      // load annotations
      this.recogitoInstance.loadAnnotations("/annotations.json");
      this.recogitoInstance.on("selectAnnotation", (annotation) => {
        // this.saveAnnotation(annotation);
        console.log("selected Annotation!: ", annotation);
        this.$store.commit("setSelectedAnnotation", annotation)
      });
    }
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
<style>
.colorselector-widget button {
  outline:none;
  border:none;
  cursor:pointer;
  margin:4px;
  background-color: #4483c4;
  color: #ffffff;
  padding: 8px;
}
</style>
