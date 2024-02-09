<template>
  <q-card flat bordered class="my-card q-ma-sm">
    <!-- card title section -->
    <q-item>
      <q-item-section>
        <q-item-label>Frames <span v-if="message">({{ message }})</span></q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-avatar>
          <q-icon name="mdi-information-outline" class="cursor-pointer"></q-icon>
          <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
            <div style="max-width: 300px">
              In this view, you can see the annotations made in the source view.
              The annotations are facts and are grouped by subtype. By clicking
              on a fact, you can add them to complex facts, acts and/or
              claim-duties (right view).
            </div>
          </q-tooltip>
        </q-avatar>
      </q-item-section>
    </q-item>
    <q-separator />
    <!-- main content of the card  -->
    <q-item>
      <div id="frame-chip-container">
        <template v-for="frameClass in ['fact', 'relation']">
          <div class="class-label">{{ frameClass }}</div>
          <div class="fact-container" v-for="frameType in frameTypes.filter((t) => t.class == frameClass)">
            <div v-if="frameType.class != 'fact'">
              <b>{{ frameType.label }}</b>
            </div>
            <div class="chips">
              <div v-for="frame in frames.filter(
                (f) => f.type.id == frameType.id && !f.subType,
              )" @click="onClick(frame)">
                <FrameChip :frame="frame" :disable="frameBeingEdited != null &&
                  frameBeingEdited.type.class == 'relation' &&
                  frameBeingEdited.activeField &&
                  !allowedSubTypes.includes(frameType.id)
                  " :removable="message === 'Click to edit'" functionality="chip-container" />
              </div>
            </div>
            <div v-if="'subTypes' in frameType">
              <div v-for="subType in frameType.subTypes" class="q-ml-sm">
                <q-avatar size="md" :icon="icons[subType.id]" />
                <b>{{ subType.label }}</b>
                <div v-for="frame in frames.filter(
                  (f) =>
                    f.type.id == frameType.id &&
                    f.subType &&
                    f.subType.id == subType.id,
                )" @click="onClick(frame)">
                  <FrameChip :frame="frame" :disable="frameBeingEdited != null &&
                    frameBeingEdited.type.class == 'relation' &&
                    frameBeingEdited.activeField &&
                    !allowedSubTypes.includes(subType.id)
                    " :removable="message === 'Click to edit'" functionality="chip-container" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </q-item>
  </q-card>
</template>

<script>
import FrameChip from "../components/FrameChip.vue";
import { frameTypes } from "../model/frame";
import { icons, colors } from "../helpers/config";

export default {
  data: () => ({
    frameTypes: frameTypes,
    icons: icons,
    colors: colors,
  }),
  computed: {
    frames() {
      return this.$store.state.frames;
    },
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
    annotationBeingEdited() {
      return this.$store.state.annotationBeingEdited;
    },
    booleanConstructBeingEdited() {
      return this.$store.state.booleanConstructBeingEdited;
    },
    allowedSubTypes() {
      console.log("frameBeingEdited", this.frameBeingEdited);
      return this.$store.state.frameBeingEdited &&
        this.frameBeingEdited.type.class == "relation"
        ? this.frameBeingEdited.allowedSubClassesForActiveField
        : [];
    },
    message() {
      return this.frameBeingEdited &&
        ["act", "claim_duty"].includes(this.frameBeingEdited)
        ? "Add to frame"
        : this.frames.length > 0
          ? "Click to edit"
          : "";
    },
  },

  components: {
    FrameChip,
  },
  methods: {
    onClick(frame) {
      console.log("clicked frame", frame);
      console.log("this.frameBeingEdited", this.frameBeingEdited);
      console.log("this.annotationBeingEdited", this.annotationBeingEdited);

      if (
        this.annotationBeingEdited &&
        this.annotationBeingEdited.addingToExistingFrame
      ) {
        frame.addAnnotation(this.annotationBeingEdited);
        this.annotationBeingEdited.addingToExistingFrame = false;
        this.$store.state.annotationBeingEdited = null;
      } else if (
        this.frameBeingEdited &&
        this.frameBeingEdited.type.class == "relation" &&
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
        console.log("setting frame being edited");
        // it opens the frame form in the middle
        this.$store.commit("setFrameBeingEdited", frame);
      }
    },
  },
  watch: {
    frames() {
      console.log("frames", this.frames);
    },
  },
};
</script>

<style lang="css" scoped>
#status {
  min-height: 25px;
}

#frame-chip-container {
  margin: 10px 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.class-label {
  text-transform: uppercase;
}

.fact-container {
  margin: 10px 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.chip-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: flex-start;
}

.chips {
  /* display: flex;
  flex-direction: row;
  flex-wrap: wrap; */
}

.message {
  font-size: 9pt;
  color: #333333;
}
</style>
