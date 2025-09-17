<template>
  <div>
    <div
      class="text-white frame-label ellipsis non-selectable"
      style="max-width: 400px"
      :class="disabled ? 'bg-grey no-pointer-events cursor-not-allowed' : `bg-${frameColor} cursor-pointer`"
      @click="handleClick"
    >
      {{
        frame.shortName?.length > 0 ? frame.shortName : frame.typeId
      }}
    </div>
    <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
      <div style="max-width: 300px">
        {{ frame.fullName != "" ? frame.fullName : "- no full name given yet -" }}
      </div>
    </q-tooltip>
  </div>
</template>

<script>
import { icons, colors } from "../helpers/config.js";
import { frameTypes } from "../model/frame";
import { copySnippetsFromFrameToFrame } from "../helpers/annotating.js"
export default {
  data: () => ({
    icons: icons,
    colors: colors,
    frameTypes: frameTypes,
  }),
  props: {
    frame: Object
  },
  computed: {
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited
    },
    booleanConstructBeingEdited() {
      return this.$store.state.booleanConstructBeingEdited
    },
    annotationToBeAddedToExistingFrame() {
        return this.$store.state.annotationToBeAddedToExistingFrame
    },
    addingAnnotationToExistingFrame() {
        return this.$store.state.addingAnnotationToExistingFrame
    },
    framesOpenInEditor() {
        return this.$store.state.framesOpenInEditor
    },
    frameColor() {
      return this.frame.typeId != "fact" || this.frame.subTypeIds.length == 0
          ? colors[this.frame.typeId] 
          : this.frame.subTypeIds.length > 1
            ? colors.multiple
            : colors[this.frame.subTypeIds[0]]
    },
    //prevent non-fact frames from being selected as a role of an Act or ClaimDuty
    //or as part of a boolean construct
    //prevent a frame from being part of itselfs
    disabled() {
      return this.frameBeingEdited != null &&
      ((['act', 'claim-duty'].includes(this.frameBeingEdited.typeId) &&
            this.frameBeingEdited.activeField != null) || (this.booleanConstructBeingEdited != null))
            && (this.frame.typeId == 'act' || this.frame.id == this.frameBeingEdited.id)
    },
    sourceDocuments() {
      return this.$store.state.sourceDocuments
    }
  },
  methods: {
    handleClick() {
        if (
            this.addingAnnotationToExistingFrame
        ) {
            //add annotation to this frame
            this.$store.state.annotationToBeAddedToExistingFrame.frame = this.frame
            this.$store.state.addingAnnotationToExistingFrame = false;
            this.$store.state.annotationToBeAddedToExistingFrame = null;
        } else if (
            this.frameBeingEdited &&
            'activeField' in this.frameBeingEdited &&
            this.frameBeingEdited.activeField
        ) {
            //add frame to field in frame being edited
            this.frameBeingEdited.addFrame(this.frame);
            this.frameBeingEdited.activeField = null
            //copy annotations of this frame to the frameBeingEdited (since this frame is now part of the frameBeingEdited)
            copySnippetsFromFrameToFrame(this.sourceDocuments, this.frame, this.frameBeingEdited)
        } else if (this.booleanConstructBeingEdited) {
            this.booleanConstructBeingEdited.frame = this.frame;
            this.$store.state.booleanConstructBeingEdited = null;
        } else {
            //open this frame in edit panel
            this.$store.state.frameBeingEdited = this.frame
            //if the frame is not yet in the list of edited frames, add it
            if (!(this.framesOpenInEditor.some(f => f.id == this.frame.id))) {
                this.$store.state.framesOpenInEditor = [...this.$store.state.framesOpenInEditor, this.frame]
            }
        }
    },

  }
};
</script>

<style lang="css" scoped>


.frame-label {
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 10pt;
  line-height: 1rem;
  margin: 2px;
}
</style>
