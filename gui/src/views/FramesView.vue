<template>
  <q-card flat bordered class="my-card q-ma-sm">
    <!-- card title section -->
    <div :class="sourceViewIsCollapsed ? 'container-row' : 'container-column'">
      <div :class="{ 'height-fill-available': !sourceViewIsCollapsed }">
        <div class="height-content row q-pa-sm items-center">
          <div class="col-1 text-bold">Frames</div>
          <div class="col q-ml-md">
            <NewFrameMenu />
          </div>

          <q-input bottom-slots v-model="searchTerm" label="Filter frames on label" dense>
            <template v-slot:prepend>
              <q-icon name="mdi-magnify" />
            </template>
            <template v-slot:append>
              <q-icon size="xs" name="mdi-close" @click="searchTerm = ''" class="cursor-pointer" />
            </template>
          </q-input>
          <div class="col-1">
            <q-avatar class="float-right" size="lg">
              <q-icon name="mdi-information-outline" class="cursor-pointer"></q-icon>
              <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
                <div style="max-width: 300px">
                  This view lists the frames in the interpretation, grouped by type and, if applicable, subtype. Click a
                  frame to edit it or view its details.
                </div>
              </q-tooltip>
            </q-avatar>
          </div>
        </div>

        <div :class="{ 'height-fill-available': !sourceViewIsCollapsed }" class="q-pa-sm">
          <FramesList :searchTerm="searchTerm" />
        </div>
      </div>

      <div v-if="frameBeingEdited" :class="{ 'height-content': !sourceViewIsCollapsed }" class="frame-editor-panel">
        <FrameEditorPanel />
      </div>
    </div>
  </q-card>
</template>

<script>
import NewFrameMenu from "../components/NewFrameMenu.vue";
import FramesList from "../components/FramesList.vue";
import FrameEditorPanel from "../components/FrameEditorPanel.vue";
import { frameTypes } from "../model/frame";
import { icons, colors } from "../helpers/config";

export default {
  data: () => ({
    frameTypes: frameTypes,
    icons: icons,
    colors: colors,
    searchTerm: ""
  }),
  computed: {
    sourceViewIsCollapsed() {
      return this.$store.state.sourceViewIsCollapsed;
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
    FrameEditorPanel,
  },

  watch: {
    sourceViewIsCollapsed() {
      console.log("sourceViewIsCollapsed", this.sourceViewIsCollapsed);
    },
  },
};
</script>

<style lang="css" scoped>
.container-column {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 193px);
  height: auto;
}

.container-row {
  display: flex;
  flex-direction: row;
  min-height: calc(100vh - 193px);
  height: auto;
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
