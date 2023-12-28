<template>
  <!-- load and save interpretation  -->
  <q-card flat bordered class="my-card q-ma-sm" id="menu-card">
    <q-item>
      <q-item-section>
        <q-item-label>Load/save interpretation </q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-avatar>
          <q-icon
            name="mdi-information-outline"
            class="cursor-pointer"
          ></q-icon>
          <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
            <div style="max-width: 300px">
              In this view, you can press the buttons and save your
              interpretation or load an existing interpretation.
            </div>
          </q-tooltip>
        </q-avatar>
      </q-item-section>
    </q-item>
    <q-separator></q-separator>

    <q-item>
      <div
        class="row inline justify-start items-baseline no-wrap q-mb-sm q-mt-sm"
      >
        <div class="btn-area">
          <q-btn
            class="q-mr-sm"
            color="primary"
            icon="mdi-content-save"
            label="Save"
            @click="saveInterpretationClicked"
          />
          <q-btn
            color="primary"
            @click="chooseFile()"
            icon="mdi-file-upload-outline"
            label="Load"
          />
          <input
            id="fileUpload"
            type="file"
            @change="handleFileSelection"
            hidden
            ref="fileUpload"
          />
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

<style lang="css" scoped></style>
