<template>
  <q-card flat bordered class="my-card q-ma-sm" id="menu-card">
    <q-item>
      <q-item-section>
        <q-item-label>Interpretation actions</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-avatar>
          <q-icon name="mdi-information-outline" class="cursor-pointer">
          </q-icon>
          <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
            <div style="max-width: 300px"> Description.. </div>
          </q-tooltip>
        </q-avatar>
      </q-item-section>
    </q-item>
    <q-separator />
    <!-- add fact -->
    <q-item>
      <div id="frame-type-buttons" class="row inline justify-start items-baseline no-wrap">
        <div class="area-label">
          <div class="text-weight-bold text-right q-mr-sm" style="width: 100px">
            Add fact:
          </div>
        </div>
        <div>
          <q-btn v-for="frameType in frameTypes.filter(f => f.class == 'fact')" class="q-mr-sm"
            :color="colors[frameType.id]" :label="frameType.label" @click="createFrame(frameType)">
            <q-tooltip class="text-subtitle2">
              Add fact of type {{ frameType.label }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-item>
    <!-- add relation -->
    <q-item>
      <div id="frame-type-buttons" class="row inline justify-start items-baseline no-wrap">
        <div class="area-label">
          <div class="text-weight-bold text-right q-mr-sm" style="width: 100px">
            Add relation:
          </div>
        </div>
        <div>
          <q-btn v-for="frameType in frameTypes.filter(f => f.class == 'relation')" class="q-mr-sm"
            :color="colors[frameType.id]" :label="frameType.label" @click="createFrame(frameType)">
            <q-tooltip class="text-subtitle2">
              Add relation of type {{ frameType.label }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-item>
    <!-- load and save interpretation -->
    <q-item>
      <div class="row inline justify-start items-baseline no-wrap">
        <div class="area-label">
          <div class="text-weight-bold text-right q-mr-sm" style="width: 100px">
            Interpretation:
          </div>
        </div>
        <div class="btn-area">
          <q-btn class="q-mr-sm" color="primary" icon="mdi-content-save" label="Save"
            @click="saveInterpretationClicked" />
          <q-btn color="primary" @click="chooseFile()" icon="mdi-file-upload-outline" label="Load" />
          <input id="fileUpload" type="file" @change="handleFileSelection" hidden ref="fileUpload" />
        </div>
      </div>
    </q-item>
    <!-- show -->
    <q-item>
      <div class="row inline justify-start items-baseline no-wrap">
        <div class="area-label">
          <div class="text-weight-bold text-right q-mr-sm" style="width: 100px">
            Show:
          </div>
        </div>
        <div class="btn-area">
          <q-btn class="q-mr-sm" color="primary" icon="mdi-source-branch" label="relations" disable />
        </div>
      </div>
    </q-item>
  </q-card>
</template>

<script>

import { icons, colors } from "../helpers/config.js";
import { Fact } from "../model/fact.js"
import { Act, ClaimDuty } from '../helpers/flint.js'
import { frameTypes } from "../model/frame";

export default {
  data: () => ({
    icons: icons,
    colors: colors,
    frameTypes: frameTypes
  }),
  methods: {
    createFrame(frameType) {
      //add frame with empty annotation
      this.$store.commit("addNewFrame", { frameType: frameType, annotation: null })
    },
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
        console.log("evt.target.result", evt.target.result)
        this.$store.dispatch("loadInterpretation", evt.target.result);
      };
      reader.readAsText(evt.target.files[0]);
    },

    startNewFrame(type) {
      this.$store.dispatch("startNewFrame", type);
    },
    closeActiveFrame() {
      this.$store.commit("setFrameBeingEdited", null);
    },
  },
};
</script>

<style lang="css" scoped>
#menu-card {
  width: 600px;

}
</style>
