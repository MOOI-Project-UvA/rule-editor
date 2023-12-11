<template>
  <q-card flat bordered class="my-card q-ma-sm" id="menu-card">
    <!-- load and save interpretation -->
    <q-item>
      <div class="row inline justify-start items-baseline no-wrap q-mb-sm">
        <div class="btn-area">
          <q-btn class="q-mr-sm" color="primary" icon="mdi-content-save" label="Save"
            @click="saveInterpretationClicked" />
          <q-btn color="primary" @click="chooseFile()" icon="mdi-file-upload-outline" label="Load" />
          <input id="fileUpload" type="file" @change="handleFileSelection" hidden ref="fileUpload" />
        </div>
      </div>
    </q-item>
  </q-card>
</template>
  
<script>
import { icons } from "../helpers/config.js";

export default {
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
        console.log("evt.target.result", evt.target.result);
        this.$store.dispatch("loadInterpretation", evt.target.result);
      };
      reader.readAsText(evt.target.files[0]);
    },
  },
};
</script>
  
<style lang="css" scoped>
#menu-card {
  width: 600px;
}
</style>
  