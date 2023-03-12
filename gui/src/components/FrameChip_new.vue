<template>
  <!--  <q-chip-->
  <!--    class="chip"-->
  <!--    clickable-->
  <!--    @click="onClick(frame)"-->
  <!--    :removable="removable"-->
  <!--    v-model="frame.shown"-->
  <!--    @remove="log('Icecream')"-->
  <!--    :disable="disable"-->
  <!--    :color="disable ? 'grey-5' : (frame.type == 'fact' ? colors[frame.subClass] : 'primary')"-->
  <!--    text-color="white"-->
  <!--    :icon="icons[frame.type]">-->
  <!--    {{ frame.name }}-->
  <!--  </q-chip>-->
  <q-chip
    class="chip"
    :removable="removable"
    @remove="onRemove"
    :color="
      disable
        ? 'grey-5'
        : frame.type == 'fact'
        ? colors[frame.subClass]
        : 'primary'
    "
    text-color="white"
    :icon="icons[frame.type]"
  >
    {{ frame.name }}-{{ disable }}
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
      default: true,
      type: Boolean,
    },
    disable: {
      default: false,
      type: Boolean,
    },
  },
  emits: ["remove"],

  methods: {
    onRemove: function () {
      // !this.disable
      //   ? this.$emit("remove")
      console.log("remove chip from list!");
      // here there should be a function deleting the
      // first: the 1)agent, 2)object, 3)action, 4) other
      //   then: the above elements from parts of complex facts or acts,
      //   and an act or a complex fact.
      // frames: remove element from complex frames explicitly probably ... and set it to null...
    },
  },
};
</script>

<style lang="css" scoped>
.chip {
  /*user-select: none;*/
  cursor: pointer;
}
</style>
