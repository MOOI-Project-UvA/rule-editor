<template>
  <div class="field-container">
    <div>
      <q-btn class="button" round :color="active ? 'primary' : 'grey-6'" size="xs" icon="mdi-pencil"
        @click="$emit('click')" />
      <span>{{ label }}</span>

    </div>

    <div class="chips">
      <div class="chip" v-for="fact in facts">
        <FrameChip :frame="fact" @click="onClick(fact)" />
        <q-btn round size="xs" flat color="negative" icon="mdi-close" @click="$emit('factRemoveClicked', fact)" />
      </div>
      <div v-if="active && facts.length == 0" class="button-label">Select existing frame or create frame from source
      </div>
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
  },
  computed: {
    framesOpenInEditor() {
      return this.$store.state.framesOpenInEditor
    }
  },
  methods: {
    onClick(fact) {
      //add to list of edited frames, if not yet in it
      if (!(this.framesOpenInEditor.some(f => f.id == fact.id))) {
        this.$store.state.framesOpenInEditor = [...this.$store.state.framesOpenInEditor, fact]
      }
      this.$store.state.frameBeingEdited = fact
    }
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

.chip {
  display: flex;
  flex-direction: row;
}
</style>
