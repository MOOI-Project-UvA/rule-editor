<template>
  <div class="field-container">
    <div class="spacer" :class="{ indented: indented }" />
    <q-input square outlined clearable
      v-model="value" :label="label" />
    <div>
      <template v-if="linkWithAnnotationAllowed">
        <q-btn round color="primary" icon="mdi-link-variant" size="10px" @click="linkButtonClicked"/>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    allowedAttributes: {
      "Agent": ["actor", "recipient", "claimant", "holder"],
      "Action": ["action"],
      "Object": ["object"]
    }
  }),
  props: {
    label: String,
    value: String,
    attribute: String,
    indented: Boolean
  },
  computed: {
    selectedAnnotation() {
      return this.$store.state.selectedAnnotation
    },
    tagOfSelectedAnnotation() {
      if (!this.selectedAnnotation) return null
      const tagBody = this.selectedAnnotation.body.find(b => b.purpose == 'tagging')
      return tagBody ? tagBody.value : null
    },
    linkWithAnnotationAllowed() {
      return this.tagOfSelectedAnnotation
        ? this.allowedAttributes[this.tagOfSelectedAnnotation].includes(this.attribute)
        : false
    }
  },
  methods: {
    linkButtonClicked() {
      this.$emit("linked", this.selectedAnnotation)
    }
  }

}
</script>

<style lang="css" scoped>
  .field-container {
    display: grid;
    grid-template-columns: max-content auto 30px;
    column-gap: 6px;
    align-items: center;
  }
  .spacer {
    width: 0px;
  }
  .spacer.indented {
    width: 30px;
  }
</style>
