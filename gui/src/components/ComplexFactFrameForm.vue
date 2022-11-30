<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
      <div class="float-left text-h6">{{ frame.fact ? frame.fact : "Complex fact" }}</div>
      <div class="float-right">Complex
        <q-icon :name="icons.complex"/>
      </div>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <q-input v-model="frame.fact" label="Fact" />
      <div>Operator:</div>
      <q-option-group
        v-model="operator"
        :options="options"
        color="primary"
        inline
      />
      <q-item-label header>{{ labels[operator] }}</q-item-label>
      <q-item v-for="f in frame.frameList">
        <q-item-section>
          <FrameChip :frame="f" />
        </q-item-section>
      </q-item>

    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { icons } from '../helpers/config.js'
import FrameChip from './FrameChip.vue'
export default {
  data: () => ({
    icons: icons,
    operator: null,
    options: [
      {
        label: "AND",
        value: "and"
      },
      {
        label: "OR",
        value: "or"
      },
      {
        label: "NOT",
        value: "not"
      }
    ],
    labels: {
      and: "Conjunctive facts",
      or: "Disjunctive facts",
      not: "Negated fact"
    }
  }),
  mounted() {
    this.operator = this.options[0].value
  },
  components: {
    FrameChip
  },
  computed: {
    frame() {
      return this.$store.state.frameBeingEdited
    },
  },
  methods: {
    cancelClicked() {
      this.$emit("closed")
    },
    saveClicked() {
      //store frame
      this.$store.commit("addFrame", this.frame)
      this.$emit("closed")
    }
  }
}
</script>

<style lang="css" scoped>
</style>
