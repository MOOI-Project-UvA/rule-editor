<template>
  <!-- load and save interpretation  -->
  <div>
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
              @click="showSavingOptions"
            />
            <q-btn
              class="q-mr-sm"
              color="primary"
              icon="mdi-file-upload-outline"
              label="Load"
              @click="showLoadOptions"
            />
          </div>
        </div>
      </q-item>
    </q-card>
    <!-- modal dialog for saving interpretation  -->
    <q-dialog v-model="saveModal" style="width: fit-content">
      <q-card class="my-card" style="width: 700px">
        <q-card-section>
          <div class="text-h6">Save progress</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Would you like to
          <q-chip
            outline
            color="primary"
            clickable
            @click="saveInterpretationLocally"
            >save an interpretation locally</q-chip
          >
          or to
          <q-chip
            outline
            color="primary"
            clickable
            @click="showGraphNameFunction"
            >save an interpretation remotely</q-chip
          >?
        </q-card-section>

        <q-slide-transition duration="500">
          <q-card v-if="showGraphName">
            <q-separator v-if="showGraphName" class="q-mb-lg"></q-separator>
            <q-card-section>
              <q-form ref="graphNameForm" class="q-gutter-md">
                <div
                  class="row justify-start items-center"
                  style="width: 600px"
                >
                  <div class="q-mr-md">
                    <q-input
                      style="width: 220px"
                      filled
                      v-model="graphName"
                      label="Set a graph name"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) ||
                          'This property is required',
                      ]"
                    />
                  </div>
                  <div class="self-center">
                    <q-btn
                      style="top: -10px"
                      label="Submit"
                      color="primary"
                      :loading="loading"
                      :disable="!graphName"
                      @click="saveInterpretationRemotely"
                    />
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-slide-transition>
        <q-separator class="q-mb-lg"></q-separator>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" @click="closeSaveDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- modal dialog for loading interpration -->
    <q-dialog v-model="loadModal" style="width: fit-content">
      <q-card class="my-card" style="width: 700px">
        <q-card-section>
          <div class="text-h6">Load interpretation</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Would you like to
          <q-chip outline color="primary" clickable @click="chooseFile"
            >load an interpretation from a file</q-chip
          >
          <input
            id="fileUpload"
            type="file"
            @change="loadLocalFile"
            hidden
            ref="fileUpload"
          />
          or to
          <q-chip
            outline
            color="primary"
            clickable
            @click="showRemoteLoadFormFunction"
            >load a remote interpretation?</q-chip
          >?
        </q-card-section>

        <q-slide-transition duration="500">
          <q-card v-if="showRemoteLoadForm">
            <q-separator
              v-if="showRemoteLoadForm"
              class="q-mb-lg"
            ></q-separator>
            <q-card-section>
              <q-form ref="selectGraphForm" class="q-gutter-md">
                <div
                  class="row justify-start items-center"
                  style="width: 600px"
                >
                  <div class="q-mr-md">
                    <q-select
                      v-model="selectedGraph"
                      :options="availableGraphs"
                      label="Choose a graph"
                      transition-show="scale"
                      transition-hide="scale"
                      style="width: 300px"
                      clearable
                    />
                  </div>
                  <div class="self-center">
                    <q-btn
                      style="top: -10px"
                      label="Load graph"
                      color="primary"
                      :loading="loadingIndLoadForm"
                      @click="loadSelectedGraph"
                    />
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-slide-transition>
        <q-separator class="q-mb-lg"></q-separator>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" @click="closeLoadDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { icons } from "../helpers/config.js";
import { alertWidget } from "../helpers/alertWidget.js";

export default {
  data: () => ({
    icons: icons,
    loading: false,
    loadingIndLoadForm: false,
    saveModal: false,
    loadModal: false,
    showGraphName: false,
    showRemoteLoadForm: false,
    graphName: null,
    selectedGraph: null,
    // availableGraphs: null,
  }),
  mounted() {
    this.retrieveAvailableGraphs();
  },
  computed: {
    availableGraphs() {
      return this.$store.getters.getAvailableGraphs;
    },
  },
  methods: {
    retrieveAvailableGraphs() {
      this.$store.dispatch("retrieveAvailableGraphs");
    },
    saveInterpretationLocally() {
      this.showGraphName = false;
      this.$store.dispatch("saveInterpretation");
    },

    showGraphNameFunction() {
      console.log("showing Graph name!", this.showGraphName);
      this.showGraphName = true;
    },
    showRemoteLoadFormFunction() {
      console.log("showing remote load form!", this.showLoadOptions());
      this.retrieveAvailableGraphs();
      this.showRemoteLoadForm = true;
    },
    showSavingOptions() {
      this.saveModal = true;
    },
    showLoadOptions() {
      this.loadModal = true;
    },
    closeSaveDialog() {
      this.saveModal = false;
      this.showGraphName = false;
      this.$refs.graphNameForm.resetValidation();
    },
    closeLoadDialog() {
      this.loadModal = false;
      // this.showGraphName = false;
      // this.$refs.phNameForm.resetValidation();
    },
    async saveInterpretationRemotely(event) {
      console.log("@submit - do something here", event);
      this.$refs.graphNameForm.validate().then((success) => {
        if (success) {
          // yay, models are correct
          console.log("success!");
          this.loading = true;

          this.$store
            .dispatch("saveInterpretationRemotely", this.graphName)
            .then(() => {
              console.log("fulfilled");
              this.loading = false;
              alertWidget("success", "The request was successful!");
              this.saveModal = false;
            })
            .catch((error) => {
              console.log("error:", error);
              this.loading = false;
              alertWidget(
                "error",
                "An error occurred while serving your request!",
              );
            });
        } else {
          // oh no, user has filled in
          // at least one invalid value
          console.log("no success!");
          // this.$refs.graphNameForm.resetValidation();
        }
      });

      // this.saveModal = true;
      // this.loading = false;
    },
    async loadSelectedGraph(event) {
      this.loadingIndLoadForm = true;
      console.log("selectedGraph is: ", this.selectedGraph);
      // this.$store.dispatch("retrieveSelectedGraph", this.selectedGraph);
      const selectedGraphIRI = encodeURIComponent(this.selectedGraph.value);
      console.log("selectedGraphIRI", selectedGraphIRI);

      this.$store
        .dispatch("retrieveSelectedGraph", selectedGraphIRI)
        .then(() => {
          console.log("fulfilled");
          this.loadingIndLoadForm = false;
          alertWidget("success", "The request was successful!");
          this.loadModal = false;
        })
        .catch((error) => {
          console.log("error:", error);
          this.loadingIndLoadForm = false;
          alertWidget("error", "An error occurred while serving your request!");
        });
    },
    chooseFile() {
      //document.getElementById("fileUpload").click()
      this.$refs.fileUpload.click();
    },
    loadLocalFile(evt) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        console.log("evt.target.result", JSON.stringify(evt.target.result));
        this.$store.dispatch("loadInterpretation", evt.target.result);
      };
      reader.readAsText(evt.target.files[0]);
    },
  },
};
</script>

<style lang="css" scoped>
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 1s ease;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
.my-card {
  width: 100%;
  max-width: 700px;
}
</style>
