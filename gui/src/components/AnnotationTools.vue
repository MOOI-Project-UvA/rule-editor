<template>
  <!-- In this component, we can add any controllers related to the annotation tool,
    e.g., pick an annotation mode... -->
  <div>
    <span class="q-mr-sm">Select mode:</span>
    <q-btn-toggle
      v-model="annotationMode"
      no-caps
      rounded
      unelevated
      toggle-color="primary"
      color="white"
      text-color="primary"
      :options="[
        { label: 'Annotation', value: 'ANNOTATION', disable: false },
        { label: 'Relation', value: 'RELATIONS', disable: true },
      ]"
      @update:model-value="pickMode"
    >
    </q-btn-toggle>
  </div>
</template>

<script>
export default {
  name: "AnnotationTools",
  data: () => ({
    annotationMode: "ANNOTATION",
  }),

  methods: {
    pickMode: function (value) {
      console.log("selected mode: ", value);
      this.annotationMode = value;
      this.$store.commit("setAnnotationMode", value);
    },
  },
};
</script>

<style></style>
