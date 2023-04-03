<template>
  <q-chip
    class="chip"
    :removable="removable"
    :disable="disable"
    @remove="onRemove"
    :color="
      disable
        ? 'grey-5'
        : frame.type === 'fact'
        ? colors[frame.subClass]
        : 'primary'
    "
    text-color="white"
    :icon="frame.type==='fact' ? icons[frame.subClass] : icons[frame.type]"
  >
    {{ frame.name }}
  </q-chip>
</template>

<script>
import { icons, colors } from "../helpers/config.js";
export default {
  data: () => ({
    icons: icons,
    colors: colors,
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
    deleteFact: function () {
      console.log("frame to be deleted: ", this.frame);
      // case1: delete a complex fact.
      switch (this.frame._type) {
        case "complexFact":
          this.$store.commit("removeComplexFact", this.frame);
          break;
        case "act":
          this.$store.commit("removeAct", this.frame);
          break;
        case "fact":
          this.$store.commit("removeAtomicFact", this.frame);
          break;
      }
    },
  },
};
</script>

<style lang="css" scoped>
.chip {
  user-select: none;
}
</style>
