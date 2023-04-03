<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
      <div class="float-left text-h6">{{ frame.name }}</div>
      <div class="float-right">
        Complex
        <q-icon :name="icons.complex" />
      </div>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <q-input v-model="frame.name" label="Fact" />
      <div>Operator:</div>
      <q-option-group v-model="frame.operator" :options="operators" color="primary" inline />
      <FactInputField :label="labels[frame.operator]" :facts="frame.factList"
        @factRemoveClicked="(fact) => { frame.removeFrame(fact) }" />
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { icons } from "../helpers/config.js";
import FactInputField from "./FactInputField.vue";
export default {
  data: () => ({
    icons: icons,
    operators: [
      {
        label: "AND",
        value: "and",
      },
      {
        label: "OR",
        value: "or",
      },
      {
        label: "NOT",
        value: "not",
      },
    ],
    labels: {
      and: "Conjunctive facts",
      or: "Disjunctive facts",
      not: "Negated fact",
    },
  }),
  components: {
    FactInputField,
  },
  computed: {
    frame() {
      return this.$store.state.frameBeingEdited;
    },
  },
  methods: {
    cancelClicked() {
      this.$emit("closed");
    },
    saveClicked() {
      //store frame
      this.$store.commit("addFrame", this.frame);
      this.$emit("closed");
    },
  },
};
</script>

<style lang="css" scoped></style>
