<script>
import { icons } from "../helpers/config.js";

export default {
  name: "LoadSaveInterpretationBanner",
  data: () => ({
    icons: icons,
  }),
  methods: {
    saveInterpretationClicked() {
      this.$store.dispatch("saveInterpretation");
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
        class="q-mx-sm"
        icon="mdi-content-save"
        label="Save"
        outline
        rounded
        size="md"
        @click="saveInterpretationClicked"
      />
      your progress or to
      <q-btn
        @click="chooseFile()"
        icon="mdi-file-upload-outline"
        label="Load"
        outline
        rounded
        size="md"
        class="q-mx-sm"
      />
      <input
        id="fileUpload"
        type="file"
        @change="handleFileSelection"
        hidden
        ref="fileUpload"
      />
      load a previous work of yours?
    </div>
  </div>
</template>

<style scoped lang="css"></style>
