<template>
  <q-card flat bordered class="my-card q-ma-sm">
    <!-- card title section -->
    <div :class="sourceViewIsCollapsed ? 'container-row' : 'container-column'">

      <div class="height-fill-available">
        <div class="height-content row q-pa-sm">
          <div class="col-1 text-bold">Frames</div>
          <div class="col q-ml-md">
            <NewFrameMenu />
          </div>
          <div class="col-1">
            <q-avatar class="float-right" size="lg">
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
          </div>
        </div>

        <!-- <div :class="{ 'height-fill-available': !sourceViewIsCollapsed }" class="q-pa-sm"> -->
        <div class="height-fill-available q-pa-sm">
          <FramesList />
        </div>
      </div>

      <!-- <div :class="{ 'height-content': !sourceViewIsCollapsed }" class="frame-editor-panel"> -->
      <div class="height-content frame-editor-panel">
        <div v-if="frameBeingEdited">
          <FrameEditorPanel />
        </div>
      </div>
    </div>

  </q-card>
</template>

<script>

import NewFrameMenu from "../components/NewFrameMenu.vue";
import FramesList from "../components/FramesList.vue"
import FrameEditorPanel from "../components/FrameEditorPanel.vue";
import { frameTypes } from "../model/frame";
import { icons, colors } from "../helpers/config";

export default {
  data: () => ({
    frameTypes: frameTypes,
    icons: icons,
    colors: colors,
  }),
  computed: {
    sourceViewIsCollapsed() {
      return this.$store.state.sourceViewIsCollapsed
    },
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
        : "";
    },
  },

  components: {
    FramesList,
    NewFrameMenu,
    FrameEditorPanel
  },
};
</script>

<style lang="css" scoped>
.container-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
}

.container-row {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 140px);
}

.height-content {
  flex: 0 0 auto;
  /* Take only the needed height */
}

.height-fill-available {
  flex: 1;
  /* Fill available height */
  overflow-y: auto;
  /* Enable vertical scrolling */
}

.scrollable-content {
  /* Optional styles for scrollable content */
  height: 100%;
  /* Ensure full height of container */
  padding: 10px;
  /* Adjust as needed */
}

.frame-editor-panel {
  min-width: 50%;
}
</style>
