<template>
  <q-chip
    :removable="removable"
    :disable="disable"
    @remove="$emit('remove')"
    :color="disable ? '#dddddd' : colors[frame.type]"
    text-color="white"
    :icon="frame.type == 'fact' && (frame.subClass in icons) ? icons[frame.subClass] : icons['other']">
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
</style>
