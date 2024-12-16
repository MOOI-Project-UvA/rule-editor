<template>

  <div>
    <div class="text-white frame-label ellipsis chip" style="max-width: 400px;"
      :class="frame.subTypeId ? 'bg-' + colors[frame.subTypeId] : 'bg-' + colors[frame.typeId]">
      {{ frame.shortName != "" ? frame.shortName : frame.subTypeId ? frameTypes.fact.subTypes[frame.subTypeId].label :
        frameTypes[frame.typeId].label }}
    </div>
    <!-- <div class="text-white frame-label ellipsis chip" style="max-width: 200px;"
      :class="frame.subTypeId ? 'bg-' + colors[frame.subTypeId] : 'bg-' + colors[frame.typeId]">
      {{ frame.typeId }} |{{ frame.subTypeId }}|
    </div> -->
    <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
      <div style="max-width: 300px">
        {{ frame.shortName != "" ? frame.shortName : "- no label given yet -" }}
      </div>
    </q-tooltip>
  </div>
</template>

<script>
import { icons, colors } from "../helpers/config.js";
import { frameTypes } from "../model/frame";
export default {
  data: () => ({
    icons: icons,
    colors: colors,
    hover: false,
    frameTypes: frameTypes
  }),
  props: {
    frame: Object,
    disable: {
      default: false,
      type: Boolean,
    },
  },
  emits: ["remove"],
  methods: {
    onRemove: function () {
      console.log("on remove")
      if (this.functionality === "chip-container") {
        this.deleteFact();
      } else {
        this.$emit("remove");
      }

      // here there should be a function deleting the
      // first: the 1)agent, 2)object, 3)action, 4) other
      //   then: the above elements from parts of complex facts or acts,
      //   and an act or a complex fact.
      // frames: remove element from complex frames explicitly probably ... and set it to null...
    },
    /*
     * Deletes a fact/Act from store
     */
    deleteFact() {
      console.log("delete fact")
      this.$store.commit("removeFrame", this.frame);
      this.$store.commit("setFrameBeingEdited", null)
    },
    onOver: function (frame) {
      //disabled for now since it looks very restless
      //this.$store.dispatch('highlightElements', fact)
    },
    onLeave: function (frame) {
      //this.$store.dispatch('unhighlightElements')
    }
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
</style>
