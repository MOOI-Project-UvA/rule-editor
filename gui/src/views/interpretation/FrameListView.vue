<template>
  <q-card flat bordered>

    <div :class="{ 'height-fill-available': !sourceViewIsCollapsed }" class="fit">
      <div class="height-content row q-pa-sm items-center q-gutter-md">
        <div class="col-auto">
          <div class="row q-gutter-xs items-center">
            <div>View as:</div>
            <div class="q-gutter-xs">
              <q-radio size="xs" dense v-model="view" val="list" label="List" />
              <q-radio size="xs" dense v-model="view" val="network" label="Network" />
            </div>
          </div>
        </div>

        <div class="col">
          <q-input bottom-slots v-model="searchTerm" label="Filter frames on label" dense>
            <template v-slot:prepend>
              <q-icon name="mdi-magnify" />
            </template>
            <template v-slot:append>
              <q-icon size="xs" name="mdi-close" @click="searchTerm = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
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

      <div :class="{ 'height-fill-available': !sourceViewIsCollapsed }" class="fit q-pa-sm">
        <template v-if="view == 'list'">
          <FramesList :searchTerm="searchTerm" />
        </template>
        <template v-else>
          <Network />
        </template>

      </div>
    </div>


  </q-card>
</template>

<script>
import NewFrameMenu from "../../components/NewFrameMenu.vue";
import FramesList from "../../components/FramesList.vue";
import Network from "../../components/Network.vue"
import FrameEditorPanel from "../../components/FrameEditorPanel.vue";
import { icons, colors } from "../../helpers/config";

export default {
  data: () => ({
    icons: icons,
    colors: colors,
    searchTerm: "",
    view: "list" //either 'list' or 'network'
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
        ["act", "claim_duty"].includes(this.frameBeingEdited.typeId)
        ? this.frameBeingEdited.allowedSubClassesForActiveField
        : [];
    },
    message() {
      return this.frameBeingEdited &&
        ["act", "claim_duty"].includes(this.frameBeingEdited.typeId)
        ? "Add to frame"
        : "";
    },
  },

  components: {
    FramesList,
    Network,
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
