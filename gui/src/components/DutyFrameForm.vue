<template>
  <q-card flat bordered class="my-card" v-if="frame">
    <q-card-section>
        <div class="text-h6">{{ frame.duty ? frame.duty : "Duty frame" }}</div>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <InputField
        v-for="field in fields"
        :label="field.label"
        :attribute="field.attribute"
        :value="frame[field.attribute]"
        @input="frame[field.attribute] = $event.target.value"
        @linked="link(field, $event)"
        :indented="field.indented"
        :linkWithAnnotation="field.linkWithAnnotation"
      />
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import InputField from './InputField.vue'
export default {
  data: () => ({
    fields: [
      { label: "Duty", attribute: "duty", indented: false },
      { label: "Duty holder", attribute: "holder", indented: true },
      { label: "Claimant", attribute: "claimant", indented: true},
      { label: "Creating act", attribute: "creatingAct", indented: true},
      { label: "Terminating act", attribute: "terminatingAct", indented: true},
      { label: "Enforcing act", attribute: "enforcingAct", indented: true},
      { label: "Source", attribute: "source", indented: true }
    ]
  }),
  computed: {
    frame() {
      return this.$store.state.activeFrameData
    }
  },
  components: {
    InputField
  },
  methods: {
    cancelClicked() {
      this.$emit("closed")
    },
    saveClicked() {
      //store frame
      this.$store.commit("addFrame", this.frame)
      this.$emit("closed")
    },
    link(field, annotation) {
      console.log("link", field, annotation)
      const text = annotation.target.selector
        .find(s => s.type == 'TextQuoteSelector')
        .exact
      //assign it to this field in the frame
      this.frame[field.attribute] = text
    }
  }
}
</script>

<style lang="css" scoped>
</style>
