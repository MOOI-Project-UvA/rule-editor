<script>
export default {
  name: "TaskDefinitionView",
  data: () => ({
    description: null,
    title: null,
  }),
  computed: {
    validateForm() {
      console.log(
        "!this.description",
        !this.description,
        "!this.title",
        !this.title,
        "AND",
        !this.description || !this.title,
      );
      return !this.description || !this.title;
    },
  },

  methods: {
    storeTaskData() {
      this.$store.commit("setTaskInformation", {
        title: this.title,
        description: this.description,
      });
      // emit event to the parent component to update the store
      this.$emit("updateStepper");
    },
  },
};
</script>

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
          <q-item-label caption>Step 1</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-avatar>
            <q-icon
              name="mdi-information-outline"
              class="cursor-pointer"
            ></q-icon>
            <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
              <div style="max-width: 300px">
                At this step, you can define a task and its description.
              </div>
            </q-tooltip>
          </q-avatar>
        </q-item-section>
      </q-item>
      <!--      <q-item class="q-ma-sm">-->
      <!--        <q-item-section avatar>-->
      <!--          <q-avatar icon="mdi-head-dots-horizontal-outline" rounded size="xl">-->
      <!--          </q-avatar>-->
      <!--        </q-item-section>-->

      <!--        <q-item-section>-->
      <!--          <q-item-label>Define task</q-item-label>-->
      <!--          <q-item-label caption-->
      <!--            >At this this step, you can define a task and its-->
      <!--            description</q-item-label-->
      <!--          >-->
      <!--        </q-item-section>-->
      <!--      </q-item>-->
      <q-separator></q-separator>
      <q-card-section>
        <q-input
          filled
          v-model="title"
          label="Title"
          hint="Define a title for the task"
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
          hint="Define a description for the task"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          clearable
        />
        <div></div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions class="q-pa-md">
        <q-space></q-space>
        <q-btn
          type="submit"
          color="primary"
          @click="storeTaskData"
          :disable="validateForm"
          >Continue</q-btn
        >
        <!-- TODO: form validation and next step of process -->
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped lang="css"></style>
