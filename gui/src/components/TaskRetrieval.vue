<script>
import { alertWidget } from "../helpers/alertWidget.js";

export default {
  name: "TaskRetrieval",
  data() {
    return {
      triplyColumns: [
        { name: "iri", label: "IRI", field: "iri", align: "center" },
        { name: "title", label: "Title", field: "title", align: "center" },
        { name: "editor", label: "Creator", field: "editor", align: "center" },
        { name: "date", label: "Date", field: "date", align: "center" },
      ],
      mongoColumns: [
        {
          name: "project_id",
          label: "Project ID",
          field: "project_id",
          align: "center",
        },
        { name: "title", label: "Title", field: "title", align: "center" },
        { name: "owner", label: "Owner", field: "owner", align: "center" },
        {
          name: "latest_version",
          label: "Latest Version",
          field: "latest_version",
          align: "center",
        },
        {
          name: "modified_at",
          label: "Modified",
          field: "modified_at",
          align: "center",
        },
      ],
      selected: [],
      selectedMongoVersion: null,
    };
  },
  computed: {
    source() {
      return this.$store.state.taskOverviewSource || "triply";
    },
    columns() {
      return this.source === "mongo" ? this.mongoColumns : this.triplyColumns;
    },
    rowKey() {
      return this.source === "mongo" ? "project_id" : "iri";
    },
    rows() {
      return this.source === "mongo"
        ? this.$store.state.availableProjectsInMongo
        : this.$store.state.availableTasksInTripleStore;
    },
    show() {
      return this.$store.state.showTaskOverview;
    },
    title() {
      return this.source === "mongo" ? "MongoDB projects" : "Triply tasks";
    },
    visibleColumns() {
      return this.source === "mongo"
        ? ["title", "owner", "latest_version", "modified_at"]
        : ["title", "editor", "date"];
    },
    mongoVersionOptions() {
      return (this.$store.state.availableProjectVersionsInMongo || []).map((v) => ({
        label: `v${v.project_version} · ${v.metadata?.modified_at || v.modified_at || ""}`,
        value: v.project_version,
      }));
    },
  },
  watch: {
    async selected(newSelection) {
      this.selectedMongoVersion = null;
      if (this.source !== "mongo" || newSelection.length === 0) {
        this.$store.commit("setAvailableProjectVersionsInMongo", []);
        return;
      }

      await this.$store.dispatch(
        "readAvailableProjectVersionsInMongo",
        newSelection[0].project_id,
      );
    },
  },
  methods: {
    async retrieveTask() {
      if (this.selected.length > 0) {
        if (this.source === "mongo") {
          await this.$store.dispatch("addTaskFromMongo", {
            projectId: this.selected[0].project_id,
            projectVersion: this.selectedMongoVersion,
          });
        } else {
          this.$store.dispatch("addTaskFromTriply", this.selected[0].iri);
        }
        this.$store.commit("setTaskOverview", false);
        this.$store.commit("setAvailableProjectVersionsInMongo", []);
        this.selected = [];
        this.selectedMongoVersion = null;
      } else {
        alertWidget("error", "Please select a task from the table!");
      }
    },
    closeDialog() {
      this.$store.commit("setTaskOverview", false);
      this.$store.commit("setAvailableProjectVersionsInMongo", []);
      this.selected = [];
      this.selectedMongoVersion = null;
    },
  },
};
</script>

<template>
  <div id="task-overview" class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="show"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 800px">
        <q-card-section>
          <q-table
            :title="title"
            flat
            bordered
            :visible-columns="visibleColumns"
            :rows="rows"
            :columns="columns"
            :row-key="rowKey"
            selection="single"
            v-model:selected="selected"
          />

          <div v-if="source === 'mongo' && selected.length > 0" class="q-mt-md">
            <q-select
              v-model="selectedMongoVersion"
              :options="mongoVersionOptions"
              label="Version (optional, default is latest)"
              emit-value
              map-options
              clearable
              outlined
              dense
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            flat
            label="Close"
            color="red"
            @click="closeDialog"
          />
          <q-btn flat label="Retrieve task" @click="retrieveTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped lang="css"></style>
