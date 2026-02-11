<template>
  <div class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1">Execute task</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-caption q-mb-xs">Specification</div>
        <q-input
          v-model="eflintBase"
          type="textarea"
          autogrow
          outlined
          readonly
          input-style="font-family: monospace;"
        />

        <div class="text-caption q-mt-md q-mb-xs">Scenario</div>
        <q-input
          v-model="eflintFinal"
          type="textarea"
          autogrow
          outlined
          readonly
          input-style="font-family: monospace;"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "ExecuteTaskView",

  computed: {
    eflintBase: {
      get() { return this.$store.state.executableEflintBase || ""; },
      set(v) { this.$store.state.executableEflintBase = v; },
    },
    eflintFinal: {
      get() { return this.$store.state.executableEflintFinal || ""; },
      set(v) { this.$store.state.executableEflintFinal = v; },
    },
  },
};
</script>
