<script>
export default {
  name: "TaskDefinitionView",
  data: () => ({
    description: null,
    title: null,
  }),
};
</script>

<template>
  <div id="task-definition-view">
    <q-card flat bordered style="max-width: 500px">
      <q-item class="q-ma-sm">
        <q-item-section avatar>
          <q-avatar icon="mdi-head-dots-horizontal-outline" rounded size="xl">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Define task</q-item-label>
          <q-item-label caption
            >At this this step, you can define a task and its
            description</q-item-label
          >
        </q-item-section>
      </q-item>
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
        />
        <div></div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions class="q-pa-md">
        <q-space></q-space>
        <q-btn type="submit" color="primary">Continue</q-btn>
        <!--       TODO: form validation and next step of process-->
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped lang="css"></style>
