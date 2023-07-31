<template>
  <q-card flat bordered class="my-card" v-if="frame">
    <q-card-section>
      <div class="text-h6">{{ frame.duty ? frame.duty : "Duty frame" }}</div>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">

    </q-card-section>
    <q-card-actions>
      <q-btn color="primary" @click="closeForm">Close</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  data: () => ({

  }),
  computed: {
    frame() {
      return this.$store.state.frameBeingEdited
    }
  },
  methods: {
    closeForm() {
      this.$store.state.frameBeingEdited = null;
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

<style lang="css" scoped></style>
