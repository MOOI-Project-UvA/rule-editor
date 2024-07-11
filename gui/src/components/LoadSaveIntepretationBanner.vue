<script>
import { icons } from "../helpers/config.js";

export default {
  name: "LoadSaveInterpretationBanner",
  data: () => ({
    icons: icons,
  }),
  methods: {
    saveInterpretationAsJson() {
      this.$store.dispatch("saveInterpretationAsJson");
    },
    saveInterpretationAsTurtle() {
      this.$store.dispatch("saveInterpretationAsTurtle");
    },
    chooseFile() {
      //document.getElementById("fileUpload").click()
      this.$refs.fileUpload.click();
    },
    handleFileSelection(evt) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.$store.dispatch("loadInterpretation", evt.target.result);
      };
      reader.readAsText(evt.target.files[0]);
    },
  },
};
</script>

<template>
  <!-- banner container questions to save or load interpretations -->

  <div class="row q-gutter-sm q-ma-sm">
    <q-btn round size="sm" icon="mdi-file-upload-outline" color="primary">
      <q-menu fit transition-show="jump-down" transition-hide="jump-up">
        <q-list>
          <q-item class="label" disable>
            <q-item-label>Locally</q-item-label>
          </q-item>
          <q-separator></q-separator>
          <q-item clickable v-close-popup dense @click="chooseFile">
            <q-item-section>JSON</q-item-section>
          </q-item>
          <q-item disable clickable v-close-popup dense>
            <q-item-section>RDF</q-item-section>
          </q-item>
          <q-separator></q-separator>
          <q-item class="label" disable>
            <q-item-label>Remotely</q-item-label>
          </q-item>
          <q-separator></q-separator>
          <q-item clickable v-close-popup dense disable>
            <q-item-section>Triply</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
        <div>
          Load an interpretation
        </div>
      </q-tooltip>
    </q-btn>
    <q-btn round size="sm" icon="mdi-content-save" color="primary">
      <q-menu fit transition-show="jump-down" transition-hide="jump-up">
        <q-list>
          <q-item class="label" disable>
            <q-item-label>Locally</q-item-label>
          </q-item>
          <q-separator></q-separator>
          <q-item clickable v-close-popup dense @click="saveInterpretationAsJson">
            <q-item-section>JSON</q-item-section>
          </q-item>
          <q-item clickable v-close-popup dense @click="saveInterpretationAsTurtle">
            <q-item-section>RDF</q-item-section>
          </q-item>
          <q-separator></q-separator>
          <q-item class="label" disable>
            <q-item-label>Remotely</q-item-label>
          </q-item>
          <q-separator></q-separator>
          <q-item clickable v-close-popup dense disable>
            <q-item-section>Triply</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
        <div>
          Save the current interpretation
        </div>
      </q-tooltip>
    </q-btn>


    <input id="fileUpload" type="file" @change="handleFileSelection" hidden ref="fileUpload" />

  </div>
</template>

<style scoped lang="css">
.label {
  min-height: 20px;
}
</style>
