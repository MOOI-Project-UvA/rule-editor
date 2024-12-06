<template>
  <div id="task-definition-view">
    <q-card flat bordered style="width: 500px; max-width: 600px">
      <q-item class="q-ma-md">
        <q-item-section avatar>
          <q-avatar icon="mdi-head-dots-horizontal-outline" rounded size="xl">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>Define a task</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-avatar>
            <q-icon
              name="mdi-information-outline"
              class="cursor-pointer"
            ></q-icon>
            <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
              <div style="max-width: 300px">Define a task.</div>
            </q-tooltip>
          </q-avatar>
        </q-item-section>
      </q-item>
      <q-separator></q-separator>
      <q-card-section>
        <q-input
          filled
          v-model="label"
          label="Label"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          clearable
        />
        <q-input
          type="textarea"
          filled
          v-model="description"
          label="Description"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          clearable
        />
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions class="q-pa-md">
        <q-space></q-space>
        <q-btn
          type="submit"
          color="primary"
          @click="storeTaskData"
          :disable="formIsInvalid"
          >Continue</q-btn
        >
        <!-- TODO: form validation and next step of process -->
        <q-btn @click="retrieveSources">Get sources</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { Task } from "../model/task.js";
export default {
  name: "TaskDefinitionView",
  data: () => ({
    description: null,
    label: null,
  }),
  computed: {
    formIsInvalid() {
      return !this.description || !this.label;
    },
    task() {
      return this.$store.state.task;
    },
  },
  mounted() {
    if (!this.task) {
      this.$store.state.task = new Task();
    } else {
      this.description = this.task.description;
      this.label = this.task.label;
    }
  },

  methods: {
    storeTaskData() {
      this.$store.state.task.label = this.label;
      this.$store.state.task.description = this.description;
      // emit event to the parent component to update the store
      this.$emit("updateStepper");
    },
    async retrieveSources() {
      const response = await fetch(
        "/.netlify/functions/getAvailableSourcesFromTriply",
      ).then((response) => response.json());
      console.log("response:", response);
      return response;
    },
  },
};
</script>

<style scoped lang="css"></style>
