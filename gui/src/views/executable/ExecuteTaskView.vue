<template>
  <div class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1">Execute task</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-caption q-mb-xs">Specification</div>
        <div class="row items-center q-gutter-sm q-mb-sm">
          <q-btn
            color="primary"
            label="Run specification"
            :loading="isRunningSpec"
            :disable="!eflintBase"
            @click="runEflint(eflintBase, 'Specification')"
          />
        </div>
        <q-input
          v-model="eflintBase"
          type="textarea"
          autogrow
          outlined
          input-style="font-family: monospace;"
        />

        <div class="text-caption q-mt-md q-mb-xs">Scenario</div>
        <div class="row items-center q-gutter-sm q-mb-sm">
          <q-btn
            color="primary"
            label="Run scenario"
            :loading="isRunningScenario"
            :disable="!eflintFinal"
            @click="runEflint(eflintFinal, 'Scenario')"
          />
        </div>
        <q-input
          v-model="eflintFinal"
          type="textarea"
          autogrow
          outlined
          input-style="font-family: monospace;"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle2 q-mb-xs">Last execution</div>
        <div class="text-caption q-mb-xs">{{ lastRunLabel || "No runs yet" }}</div>
        <q-input
          :model-value="lastRunStdout"
          type="textarea"
          autogrow
          outlined
          readonly
          label="Stdout"
          input-style="font-family: monospace;"
        />
        <q-input
          class="q-mt-sm"
          :model-value="lastRunStderr"
          type="textarea"
          autogrow
          outlined
          readonly
          label="Stderr"
          input-style="font-family: monospace;"
        />
        <div class="text-caption q-mt-sm">Exit code: {{ lastRunCode }}</div>
        <div v-if="lastRunError" class="text-negative q-mt-sm">{{ lastRunError }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { buildExecuteUrl } from "../../services/eflintEndpoints.js";
export default {
  name: "ExecuteTaskView",

  data() {
    return {
      isRunningSpec: false,
      isRunningScenario: false,
      lastRunLabel: "",
      lastRunStdout: "",
      lastRunStderr: "",
      lastRunCode: "",
      lastRunError: "",
    };
  },

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

  methods: {
    async runEflint(code, label) {
      const isSpec = label === "Specification";
      this.lastRunError = "";
      if (isSpec) {
        this.isRunningSpec = true;
      } else {
        this.isRunningScenario = true;
      }

      try {
        const url = buildExecuteUrl();
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eflint: code }),
        });

        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          const detail = data?.detail || "Execution failed";
          this.lastRunError = typeof detail === "string" ? detail : JSON.stringify(detail);
        }

        this.lastRunLabel = label;
        this.lastRunStdout = data?.stdout || "";
        this.lastRunStderr = data?.stderr || "";
        this.lastRunCode = data?.code ?? "";
      } catch (error) {
        this.lastRunError = error?.message || "Failed to execute";
        this.lastRunStdout = "";
        this.lastRunStderr = "";
        this.lastRunCode = "";
        this.lastRunLabel = label;
      } finally {
        if (isSpec) {
          this.isRunningSpec = false;
        } else {
          this.isRunningScenario = false;
        }
      }
    },
  },
};
</script>
