<template>
  <div class="row">
    <div v-if="framesOpenInEditor.length > 0" class="col-2 bg-grey-12 q-pa-md q-ma-sm">
      <div class="text-bold">
        Editing:
      </div>
      <div v-for="frame in framesOpenInEditor">
        <div class="edit-entry">
          <div :class="{ dot: frame == frameBeingEdited }" />
          <div class="text-white frame-label chip ellipsis" style="max-width: 200px;"
            :class="frame.typeId == 'fact' && frame.subTypeId ? 'bg-' + colors[frame.subTypeId] : 'bg-' + colors[frame.typeId]"
            @click="frameChipClicked(frame)">
            {{ frame.label != "" ? frame.label : frame.typeId == 'fact' && frame.subTypeId ?
      frameTypes.fact.subTypes[frame.subTypeId].label : frameTypes[frame.typeId].label }}
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <q-card flat bordered v-if="frameBeingEdited" class="my-card q-ma-sm">
        <template v-if="frameBeingEdited.typeId == 'fact'">
          <FactFrameForm />
        </template>
        <template v-else-if="frameBeingEdited.typeId == 'act'">
          <ActFrameForm />
        </template>
        <template v-else-if="frameBeingEdited.typeId == 'claim_duty'">
          <ClaimdutyFrameForm />
        </template>
      </q-card>
    </div>
  </div>

</template>

<script>
import ActFrameForm from "../components/ActFrameForm.vue";
import FactFrameForm from "../components/FactFrameForm.vue";
import ClaimdutyFrameForm from "../components/ClaimdutyFrameForm.vue";
import { icons, colors } from "../helpers/config.js";
import { frameTypes } from "../model/frame";

export default {
  data: () => ({
    icons: icons,
    colors: colors,
    frameTypes: frameTypes
  }),
  components: {
    ActFrameForm,
    FactFrameForm,
    ClaimdutyFrameForm,
  },
  computed: {
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
    framesOpenInEditor() {
      return this.$store.state.framesOpenInEditor
    },
    addingAnnotationToExistingFrame() {
      return this.$store.state.addingAnnotationToExistingFrame;
    },
    booleanConstructBeingEdited() {
      return this.$store.state.booleanConstructBeingEdited;
    },
  },
  methods: {
    frameChipClicked(frame) {
      if (
        this.addingAnnotationToExistingFrame
      ) {
        this.$store.state.annotationToBeAddedToExistingFrame.frame = frame
        this.$store.state.addingAnnotationToExistingFrame = false;
        this.$store.state.annotationToBeAddedToExistingFrame = null;
      } else if (
        this.frameBeingEdited &&
        'activeField' in this.frameBeingEdited &&
        this.frameBeingEdited.activeField
      ) {
        //add frame to field in frame being edited
        console.log("adding frame to", this.frameBeingEdited);
        this.frameBeingEdited.addFrame(frame);
        this.frameBeingEdited.activeField = null
      } else if (this.booleanConstructBeingEdited) {
        this.booleanConstructBeingEdited.frame = frame;
        this.$store.state.booleanConstructBeingEdited = null;
      } else {
        this.$store.state.frameBeingEdited = frame
      }
    },
  }
};
</script>

<style lang="css" scoped>
.chip {
  user-select: none;
  cursor: pointer;
}

.frame-label {
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 10pt;
  line-height: 1rem;
  margin: 2px;
}

.edit-entry {
  display: grid;
  grid-template-columns: 8px auto;
  column-gap: 2px;
}

.dot {
  margin-top: 10px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #666666;
}
</style>
