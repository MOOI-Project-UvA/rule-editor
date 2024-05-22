<template>
  <div
    id="annotationPanel"
    ref="annotationPanel"
    v-if="annotation"
    :style="{
      left: coordX + 50 + 'px',
      top: coordY - 100 + 'px',
    }"
  >
    <q-card bordered>
      <q-card-section>
        <div>
          <span v-for="snippet in snippetsForThisAnnotation">
            {{ snippet.text }}
          </span>
        </div>
      </q-card-section>
      <q-card-section>
        <template v-if="annotation.frame">
          <div class="label">Change type of fact frame</div>
        </template>
        <template v-else>
          <div class="label">Create new frame</div>
        </template>
        <div>
          <q-btn
            v-for="frameType in frameTypes"
            class="q-mr-sm"
            :label="frameType.label"
            :color="
              !annotation.frame || annotation.frame.type == frameType
                ? colors[frameType.id]
                : 'grey-6'
            "
            @click="frameTypeButtonClicked(frameType)"
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <div class="label">Or</div>
        <q-btn
          flat
          @click="addingToExistingFrame"
          color="primary"
          :disabled="frames.length == 0"
        >
          Add to existing frame
        </q-btn>
      </q-card-actions>
      <q-card-actions>
        <q-btn color="negative" flat @click="cancelAnnotation">Cancel</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { frameTypes } from "../model/frame.js";
import { colors } from "../helpers/config.js";
export default {
  data: () => ({
    frameTypes: frameTypes,
    colors: colors,
    coordX: 0,
    coordY: 0,
  }),
  computed: {
    annotation() {
      return this.$store.state.annotationBeingEdited;
    },
    frames() {
      return this.$store.state.frames;
    },
    clickedPosition() {
      return this.$store.state.clickedPosition;
    },
    snippetsForThisAnnotation() {
      return this.$store.state.sourceDocuments
        .map((sourceDoc) => sourceDoc.getSnippetsForAnnotation(this.annotation))
        .flat();
    },
  },
  // update component lifecycle hook
  updated() {
    if (this.annotation) {
      this.coordY = this.determineCoordY(
        this.annotation,
        this.$refs.annotationPanel.clientHeight,
      );
      this.coordX = this.determineCoordX(this.annotation);
    }
  },
  methods: {
    frameTypeButtonClicked(frameType) {
      //create new frame, set annotation's frame to this new frame
      this.$store.commit("addNewFrame", {
        frameType: frameType,
        annotation: this.annotation,
        subType: null,
      });
      this.$store.commit("setAnnotationBeingEdited", null);
    },
    cancelAnnotation() {
      this.$store.commit("setAnnotationBeingEdited", null);
    },
    addingToExistingFrame() {
      this.$store.state.annotationToBeAddedToExistingFrame = this.annotation;
      this.$store.state.addingAnnotationToExistingFrame = true;
      this.$store.state.annotationBeingEdited = null;
    },
    // removeAnnotation() {
    //     //this is only called if annotation has a frame.
    //     //remove the annotaiton from the frame, and from the store
    //     this.annotation.frame.removeAnnotation(this.annotation)
    //     this.$store.commit("setAnnotationBeingEdited", null)
    // },
    determineCoordX(annotation) {
      return window.innerWidth - this.clickedPosition[0] > 440
        ? this.clickedPosition[0]
        : this.clickedPosition[0] - 440;
    },
    determineCoordY(annotation, componentsHeight) {
      if (window.innerHeight - this.clickedPosition[1] < componentsHeight) {
        return this.clickedPosition[1] - componentsHeight;
      } else {
        return this.clickedPosition[1];
      }
    },
  },
};
</script>

<style lang="css" scoped>
#annotationPanel {
  position: absolute;
  width: 440px;
}

.message {
  font-weight: bold;
}

.label {
  margin-right: 10px;
}

.label.bold {
  font-weight: bold;
}
</style>
