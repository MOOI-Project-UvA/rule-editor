<template>
  <div class="field-container">
    <div>
      <q-btn class="button" round :color="active ? 'primary' : 'grey-6'" size="xs" icon="mdi-pencil"
        @click="$emit('click')" />
      <span>{{ label }}</span>
      
    </div>

    <div class="chips">
      <FrameChip v-for="fact in facts" :frame="fact" removable functionality="editor-form"
        @remove="$emit('factRemoveClicked', fact)" />
        <div v-if="active" class="button-label">Select frame</div>
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
  margin: 3px 0px;
  display: grid;
  grid-template-columns: 100px auto;
}

.button-label {
  display: inline-block;
  font-style: italic;
  margin-left: 5px;
}

.chips {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
