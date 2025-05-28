<template>
  <q-card flat bordered>

    <div :class="{ 'height-fill-available': !sourceViewIsCollapsed }" class="fit">
      <div class="height-content row q-pa-sm items-center q-gutter-md">
        <div class="col-auto">
          <NewFrameMenu />
        </div>


      </div>


    </div>

    <div v-if="frameBeingEdited" :class="{ 'height-content': !sourceViewIsCollapsed }" class="frame-editor-panel">
      <FrameEditorPanel />
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
