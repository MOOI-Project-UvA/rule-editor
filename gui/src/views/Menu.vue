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
    <!-- add -->
    <q-item class="q-pt-md">
      <div id="frame-type-buttons" class="row inline justify-start items-baseline no-wrap">
        <div class="area-label">
          <div class="text-weight-bold text-right q-mr-sm" style="width: 80px">
            Add:
          </div>
        </div>
        <div class="btn-area">
          <q-btn-group class="q-mr-sm">
            <q-btn v-for="tag in tags" :color="colors[tag.value]" :icon="icons[tag.value]" @click="createFact(tag.value)">
              <q-tooltip class="text-subtitle2">
                Create fact of type {{ tag.label }}
              </q-tooltip>
            </q-btn>
          </q-btn-group>
          <!--          <q-btn-->
          <!--            class="q-mr-sm"-->
          <!--            color="primary"-->
          <!--            :icon="icons['complexFact']"-->
          <!--            label="complex fact"-->
          <!--            @click="$store.dispatch('createComplexFact')"-->
          <!--          />-->
          <q-btn class="q-mr-sm" color="primary" :icon="icons['act']" label="act" @click="$store.dispatch('createAct')">
            <q-tooltip class="text-subtitle2">
              Create an Act
            </q-tooltip>
          </q-btn>
          <!--          <q-btn-->
          <!--            class="q-mr-sm"-->
          <!--            color="primary"-->
          <!--            :icon="icons['duty']"-->
          <!--            label="duty"-->
          <!--            @click="startNewFrame('duty')"-->
          <!--            disabled-->
          <!--          />-->
        </div>
      </div>
    </q-item>
    <!-- functions -->
    <q-item>
      <div class="row inline justify-start items-baseline no-wrap">
        <div class="area-label">
          <div class="text-weight-bold text-right q-mr-sm" style="width: 80px">
            Functions:
          </div>
        </div>
        <div class="btn-area">
          <q-btn class="q-mr-sm" color="primary" icon="mdi-content-save" label="Save interpretation"
            @click="saveInterpretationClicked" />
          <q-btn color="primary" @click="chooseFile()" icon="mdi-file-upload-outline" label="Load interpretation" />
          <input id="fileUpload" type="file" @change="handleFileSelection" hidden ref="fileUpload" />
        </div>
      </div>
    </q-item>
    <!-- show -->
    <q-item>
      <div class="row inline justify-start items-baseline no-wrap">
        <div class="area-label">
          <div class="text-weight-bold text-right q-mr-sm" style="width: 80px">
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
import { Fact, Annotation } from '../helpers/flint.js'

export default {
  data: () => ({
    icons: icons,
    colors: colors,
    tags: [
      { label: "Agent", value: "agent" },
      { label: "Action", value: "action" },
      { label: "Object", value: "object" },
      { label: "Context", value: "context" }
    ],
  }),
  methods: {
    createFact(tag) {
      let frame = new Fact()
      frame.annotation = new Annotation(
        null, //documentId
        null, //sentenceId
        [], //characterRange
        "" //annotatedText
      )
      frame.annotation.tag = tag
      this.$store.commit("addFrame", frame)
      this.$store.commit("setFrameBeingEdited", frame)
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
