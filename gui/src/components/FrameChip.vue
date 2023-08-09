<template>
  <q-chip :class="{ chip: true, active: frame['_highlight'], notActive: !frame['_highlight'] }" :removable="removable"
    :disable="disable" @remove="onRemove" :color="disable
      ? 'grey-5'
      : colors[frame.type.id]
      " text-color="white" :icon="icons[frame.type.id]" v-on:mouseover="onOver(frame)"
    v-on:mouseleave="onLeave(frame)">
    {{ frame.label }}
    <!-- contexts which have been subdivided contain have a badge on top-right. edit: not relevant since we don't have complex facts anymore -->
    <!-- <q-badge v-if="!!frame._booleanConstruct" style="margin-top: -2px;" dense color="negative" rounded floating></q-badge> -->
  </q-chip>
</template>

<script>
import { icons, colors } from "../helpers/config.js";
export default {
  data: () => ({
    icons: icons,
    colors: colors,
    hover: false,
  }),
  props: {
    frame: Object,
    removable: {
      default: false,
      type: Boolean,
    },
    disable: {
      default: false,
      type: Boolean,
    },
    functionality: {
      default: "chip-container",
      type: String,
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
    onOver: function (fact) {
      //disabled for now since it looks very restless
      //this.$store.dispatch('highlightElements', fact)
    },
    onLeave: function (fact) {
      this.$store.dispatch('unhighlightElements')
    }
  }
};
</script>

<style lang="css" scoped>
.chip {
  user-select: none;
}

.active {
  opacity: 0.2;
}

.notActive {
  opacity: 1;
}
</style>
