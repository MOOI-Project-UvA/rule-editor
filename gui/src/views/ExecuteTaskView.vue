<template>
  <div id="execute-task-view" class="flex flex-center">
    <q-card flat bordered style="width: 500px; max-width: 600px">
      <q-item class="q-ma-md">
        <q-item-section avatar>
          <q-avatar icon="mdi-playlist-check" rounded size="xl">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>Execute task</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator></q-separator>
      <q-card-section>
        <q-input 
          filled 
          v-model="executionText" 
          label="Execution data" 
          type="textarea"
          autogrow
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "ExecuteTaskView",
  data() {
    return {
      executionText: ''
    }
  },
  mounted() {
    // Get the response data from store if available
    if (this.$store.state.executableResponse) {
      this.executionText = this.$store.state.executableResponse;
    }
  }
}
</script>
