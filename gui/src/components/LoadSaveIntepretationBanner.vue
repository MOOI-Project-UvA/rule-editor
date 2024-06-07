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
      <q-btn outline class="q-mx-sm text-lowercase text-white" label="save" icon="mdi-content-save" >
        <q-menu fit transition-show="jump-down" transition-hide="jump-up">
          <q-list>
            <q-item class="label"  disable>
              <q-item-label>Locally</q-item-label>
            </q-item>
            <q-separator ></q-separator>
            <q-item clickable v-close-popup dense @click="saveInterpretationAsJson">
              <q-item-section>JSON</q-item-section>
            </q-item>
            <q-item clickable v-close-popup dense  @click="saveInterpretationAsTurtle">
              <q-item-section>RDF</q-item-section>
            </q-item>
            <q-separator ></q-separator>
            <q-item class="label" disable>
              <q-item-label>Remote</q-item-label>
            </q-item>
            <q-separator ></q-separator>
            <q-item clickable v-close-popup dense disable>
              <q-item-section>Triply</q-item-section>
            </q-item>

          </q-list>
        </q-menu>
      </q-btn>
<!--      <q-btn-dropdown-->
<!--        class="q-mx-sm text-lowercase"-->
<!--        icon="mdi-content-save"-->
<!--        label="Save"-->
<!--        outline-->
<!--        touch -->
<!--        size="md"-->
<!--        @click="saveInterpretationClicked"-->
<!--        transition-show="jump-down"-->
<!--        transition-hide="jump-up"-->
<!--      >-->
<!--&lt;!&ndash;        <q-menu fit class="" transition-show="jump-down"&ndash;&gt;-->
<!--&lt;!&ndash;          transition-hide="jump-up">&ndash;&gt;-->
<!--          <q-list>-->
<!--            <q-item class="label" >-->
<!--                <q-item-label>Locally</q-item-label>-->
<!--            </q-item>-->
<!--            <q-separator ></q-separator>-->
<!--            <q-item clickable v-close-popup>-->
<!--              <q-item-section>JSON</q-item-section>-->
<!--            </q-item>-->
<!--            <q-item clickable v-close-popup>-->
<!--              <q-item-section>RDF</q-item-section>-->
<!--            </q-item>-->
<!--          </q-list>-->
<!--&lt;!&ndash;        </q-menu>&ndash;&gt;-->
<!--      </q-btn-dropdown>-->
      your progress or to
      <q-btn
        @click="chooseFile()"
        icon="mdi-file-upload-outline"
        label="Load"
        outline
        size="md"
        class="q-mx-sm text-lowercase"
      />
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
.label{
  min-height: 20px
}
</style>
