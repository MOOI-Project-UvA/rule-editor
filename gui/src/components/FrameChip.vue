<template>
  <q-chip
    class="chip"
    :removable="removable"
    :disable="disable"
    @remove="$emit('remove')"
    :color="disable ? 'grey-5' : (frame.type == 'fact' ? colors[frame.subClass] : 'primary')"
    text-color="white"
    :icon="icons[frame.type]">
    {{ frame.name }}
  </q-chip>
</template>

<script>
import { icons, colors } from '../helpers/config.js'
export default {
  data: () => ({
    icons: icons,
    colors: colors
  }),
  props: {
    frame: Object,
    removable: {
      default: false,
      type: Boolean
    },
    disable: {
      default: false,
      type: Boolean
    },
  },
  emits: ['remove']
}
</script>

<style lang="css" scoped>
  .chip {
    user-select: none;
  }
</style>
