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
    this.widgets.push(this.addToFrameWidget)
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
    addToFrameWidget(annotation) {
      let container = document.createElement('div')
      container.className = 'colorselector-widget'
      const button = document.createElement('button')
      button.textContent = 'Add to frame'
      button.addEventListener('click', () => {
        this.$store.dispatch('addAnnotationToActiveFrame', annotation)
      })
      container.appendChild(button)
      return container
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
