<template>
  <div>

    <div>
      <q-btn
        class="button"
        round
        :color="active ? colors.fact : 'grey-6'"
        size="xs"
        icon="mdi-pencil"
        @click="$emit('click')"
      />
      <span>{{ label }}</span>
    </div>
  </div>
  <div>
    <FrameChip
      v-for="fact in facts"
      :frame="fact"
      removable
      @remove="$emit('factRemoveClicked', fact)"/>
  </div>
</template>

<script>
import FrameChip from './FrameChip.vue'
import { colors } from '../helpers/config.js'
export default {
  data: () => ({
    colors: colors
  }),
  props: {
    label: String,
    active: {
      default: true,
      type: Boolean
    },
    facts: {
      default: [],
      type: Array
    }
  },
  emits: ['click', 'factRemoveClicked'],
  components: {
    FrameChip
  }
}
</script>

<style lang="css" scoped>
  .button {
    margin-right: 5px;
  }
</style>
