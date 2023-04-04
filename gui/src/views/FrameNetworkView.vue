<template>
  <q-card flat bordered class="my-card q-ma-sm">
    <q-item>
      <q-item-section>
        <q-item-label>Source view</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-avatar>
          <q-icon
            name="mdi-information-outline"
            class="cursor-pointer"
          ></q-icon>
          <q-tooltip>
            <div style="max-width: 300px">
              In this view, you can see the annotations made in the source view.
              The annotations are facts and are grouped by type. By clicking on
              a fact, you can add them to complex facts or acts (right view).
            </div>
          </q-tooltip>
        </q-avatar>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item>
      <div id="frame-chip-container">
        <div id="status">{{ message }}</div>
        <div id="chip-container">
          <div v-for="frame in frames" @click="onClick(frame)">
            <FrameChip
              :frame="frame"
              :disable="
                allowedSubTypes &&
                frame.type === 'fact' &&
                !allowedSubTypes.includes(frame.subClass)
              "
              :removable="message === 'Click to edit'"
              functionality="chip-container"
            />
          </div>
        </div>
      </div>
    </q-item>
  </q-card>
</template>

<script>
import FrameChip from "../components/FrameChip.vue";

export default {
  computed: {
    frames() {
      return this.$store.state.frames;
    },
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
    allowedSubTypes() {
      console.log("frameBeingEdited", this.$store.state.frameBeingEdited);
      return this.$store.state.frameBeingEdited &&
        this.$store.state.frameBeingEdited.type != "fact"
        ? this.$store.state.frameBeingEdited.allowedSubClassesForActiveField
        : false;
    },
    message() {
      return this.frameBeingEdited && this.frameBeingEdited.type != "fact"
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
      if (this.frameBeingEdited && this.frameBeingEdited.type !== "fact") {
        // it adds a chip into a form to the FrameEditorView
        this.frameBeingEdited.addFrame(frame);
      } else {
        // it opens the frame form in the middle
        this.$store.commit("setFrameBeingEdited", frame);
      }
    },
  },
};
</script>

<style lang="css" scoped>
#frame-chip-container {
  margin: 20px 0px;
  display: inline-block;
}

#chip-container {
  display: flex;
  flex-wrap: wrap;
}

.message {
  /* margin-top: 10px; */
}
</style>
