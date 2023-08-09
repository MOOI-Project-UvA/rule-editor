<template>
  <div class="field-container">
    <div>
      <div>
        <q-btn class="button" round :color="active ? 'primary' : 'grey-6'" size="xs" icon="mdi-pencil"
          @click="$emit('click')" />
        <span>{{ label }}</span>
        <div v-if="active" class="button-label">Select existing frame or select source and create new frame</div>
      </div>
    </div>
    <div>
      <FrameChip v-for="fact in facts" :frame="fact" removable functionality="editor-form"
        @remove="$emit('factRemoveClicked', fact)" />
    </div>
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

.field-container {
  margin: 10px 0px;
}

.button-label {
  display: inline-block;
  font-style: italic;
  margin-left: 5px;
}
</style>
