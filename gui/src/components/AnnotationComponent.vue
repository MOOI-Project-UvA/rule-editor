<template>
  <div class="annotation-container">
    <div v-if="document" id="panel" ref="panel" v-html="document.text"></div>
  </div>
</template>

<script>
import { Recogito } from "@recogito/recogito-js";
import "@recogito/recogito-js/dist/recogito.min.css";
import createWidget from "../helpers/tagSelectorWidgets";

export default {
  name: "AnnotationComponent",
  props: {
    document: {
      type: Object,
      required: true,
      default: null
    },
    tagList: {
      type: Array,
      required: false,
      default() {
        return ["Agent", "Action", "Object", "Other"];
      },
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
          { widget: "TAG", vocabulary: ["Agent", "Action", "Object"] },
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
    const tagSelectorWidget = createWidget(this.tagList);

    this.recogitoInstance = new Recogito({
      content: this.$refs.panel,
      widgets: [
        { widget: "COMMENT" },
        // { widget: this.createFactFrame },
        { widget: tagSelectorWidget }],
    });
    // load annotations
    this.recogitoInstance.loadAnnotations("/annotations.json");
    // adding event handlers
    this.setEventHandlers();
  },
  methods: {
    setEventHandlers() {
      this.recogitoInstance.on("createAnnotation", (annotation) => {
        console.log("created Annotation!: ", annotation);
        annotation.document = this.document //store legal text with the annotation
        this.$store.dispatch('showAtomicFactForAnnotation', annotation)
      });
      this.recogitoInstance.on("selectAnnotation", (annotation) => {
        // this.saveAnnotation(annotation);
        console.log("selected Annotation!: ", annotation);
        this.$store.dispatch('showAtomicFactForAnnotation', annotation)
      });
      this.recogitoInstance.on("updateAnnotation", (annotation, previous) => {
        console.log("updated", annotation)
        this.$store.dispatch('showAtomicFactForAnnotation', annotation)
      })
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

:deep() .label-button {
  background-color: #f5f5f5;
  border: solid 1px black;
  border-radius: 6px;
  margin: 5px 0px 0px 5px;
  padding: 3px;
  opacity: 0.6;
  cursor: pointer;
}
:deep() .label-button.selected {
  background-color: #4483c4;
  color: #ffffff;
  border: solid 1px black;
  opacity: 1;
}
:deep() .colorselector-widget button {
  outline: none;
  border: none;
  cursor: pointer;
  margin: 4px;
  background-color: #4483c4;
  color: #ffffff;
  padding: 8px;
}
</style>
