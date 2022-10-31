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
  mounted() {
    const that = this;
    this.recogitoInstance = new Recogito({
      content: that.$refs.panel,
      widgets: that.widgets,
    });
    // this.setEventHandlers();
    this.recogitoInstance.on("createAnnotation", (annotation) => {
      // this.saveAnnotation(annotation);
      console.log("created Annotation!: ", annotation);
    });
  },
  methods: {
    setEventHandlers() {
      // Add an event handler
      this.recogitoInstance.on("createAnnotation", (annotation) => {
        // this.saveAnnotation(annotation);
        console.log("created Annotation!: ", annotation);
      });
      //   this.recogitoInstance.on("updateAnnotation", (annotation) => {
      //     // this.updateAnnotation(annotation);
      //     console.log("updating Annotation!: ", annotation);
      //   });
      //   this.recogitoInstance.on("deleteAnnotation", (annotation) => {
      //     // this.deleteAnnotation(annotation);
      //     console.log("deleting Annotation!: ", annotation);
      //   });

      //   this.recogitoInstance.setAnnotations(this.annotationsForThisSentence);
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
