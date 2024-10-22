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
              <div style="max-width: 300px">
                Define a task.
              </div>
            </q-tooltip>
          </q-avatar>
        </q-item-section>
      </q-item>
      <q-separator></q-separator>
      <q-card-section>
        <q-input
          filled
          v-model="title"
          label="Title"
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
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { Task } from "../model/task.js"
export default {
  name: "TaskDefinitionView",
  data: () => ({
    description: null,
    title: null,
  }),
  computed: {
    formIsInvalid() {
      return !this.description || !this.title;
    },
    task() {
      return this.$store.state.task;
    },
  },
  mounted() {
    console.log("task", this.task)
    if (!this.task) {
      this.$store.state.task = new Task()
    } else {
      this.description = this.task.description;
      this.title = this.task.title;
    }
  },

  methods: {
    storeTaskData() {
      this.$store.state.task.title = this.title
      this.$store.state.task.description = this.description
      // emit event to the parent component to update the store
      this.$emit("updateStepper");
    },
  },
};
</script>

<style scoped lang="css"></style>
