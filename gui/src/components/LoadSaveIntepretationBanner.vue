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

  <div class="row inline justify-start items-baseline no-wrap q-mb-sm q-mt-sm">
    <div class="btn-area">
      Would you like to
      <q-btn
        outline
        class="q-mx-sm text-lowercase text-white"
        label="save"
        icon="mdi-content-save"
      >
        <q-menu fit transition-show="jump-down" transition-hide="jump-up">
          <q-list>
            <q-item class="label" disable>
              <q-item-label>Locally</q-item-label>
            </q-item>
            <q-separator></q-separator>
            <q-item
              clickable
              v-close-popup
              dense
              @click="saveInterpretationAsJson"
            >
              <q-item-section>JSON</q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              dense
              @click="saveInterpretationAsTurtle"
            >
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
      </q-btn>
      your progress or to
      <q-btn
        outline
        class="q-mx-sm text-lowercase text-white"
        label="load"
        icon="mdi-file-upload-outline"
      >
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
      </q-btn>

      <input
        id="fileUpload"
        type="file"
        @change="handleFileSelection"
        hidden
        ref="fileUpload"
      />
      previous work of yours?
    </div>
  </div>
</template>

<style scoped lang="css">
.label {
  min-height: 20px;
}
</style>
