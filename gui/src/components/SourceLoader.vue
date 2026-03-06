<template>
  <div class="flex flex-row items-center">
    <div class="col">
      <q-select
        v-model="selectedSource"
        use-input
        label="Add source from server"
        :options="sourcesNotYetLoaded"
        behavior="menu"
        autocomplete="title"
        option-label="title"
        @update:model-value="handleSelection"
      >
        <template v-slot:before>
          <q-icon name="mdi-book-outline" />
        </template>
      </q-select>
    </div>
    <div class="q-ml-lg text-right">
      <q-btn
        round
        size="sm"
        icon="mdi-file-upload-outline"
        color="white"
        text-color="primary"
        @click="chooseFile"
      >
        <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
          <div>Upload source from local filesystem</div>
        </q-tooltip>
      </q-btn>
    </div>
  </div>
  <input
    id="fileUpload"
    type="file"
    @change="handleFileSelection"
    hidden
    ref="fileUpload"
  />
</template>

<script>
import { reformatDate } from "../helpers/dateTimeFunctions.js";

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
      //TODO: filter out loaded documents
      return this.availableSources;
    },
  },
  methods: {
    reformatDate,
    handleSelection() {
      this.$store.dispatch("addSource", this.selectedSource);
      this.selectedSource = null;
    },
    chooseFile() {
      this.$refs.fileUpload.click();
    },
    handleFileSelection(evt) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const jsonLdObject = JSON.parse(evt.target.result);
        this.$store.dispatch("createSourceDocFromJsonLD", jsonLdObject);
      };
      reader.readAsText(evt.target.files[0]);
    },
  },
};
</script>
