<template>
  <div>
    <q-select v-model="selectedSource" use-input label="Add source text" :options="sourcesNotYetLoaded" behavior="menu"
      autocomplete="title" option-label="title" @update:model-value="handleSelection">
      <template v-slot:before>
        <q-icon name="mdi-book-outline" />
      </template>
    </q-select>
  </div>
</template>

<script>
export default {
  data: () => ({
    selectedSource: null,
  }),
  computed: {
    availableSources() {
      return this.$store.state.availableSources;
    },
    //already loaded sources
    sourceDocuments() {
      return this.$store.state.sourceDocuments;
    },
    sourcesNotYetLoaded() {
      const loadedDocIds = this.sourceDocuments.map((d) => d["@id"]);
      return this.availableSources.filter((s) => !loadedDocIds.includes(s.id));
    },
  },
  methods: {
    handleSelection() {
      console.log("handleSelection", this.selectedSource);
      this.$store.dispatch("addSource", { sourceId: this.selectedSource.id, checkedSentences: null });
      this.selectedSource = null;
    },
  },
};
</script>
