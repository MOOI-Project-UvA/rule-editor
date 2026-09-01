<template>
  <q-btn
    flat
    dense
    size="sm"
    icon="mdi-undo"
    text-color="primary"
    :disable="!canUndo"
    @click="performUndo"
  >
    <q-tooltip v-if="canUndo">Undo: {{ lastLabel }} (Ctrl+Z)</q-tooltip>
    <q-tooltip v-else>Nothing to undo</q-tooltip>
  </q-btn>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  name: "UndoButton",
  setup() {
    return { $q: useQuasar() };
  },
  computed: {
    stack() {
      return this.$store.state.undoStack || [];
    },
    canUndo() {
      return this.stack.length > 0;
    },
    lastLabel() {
      return this.canUndo ? this.stack[this.stack.length - 1].label : "";
    },
  },
  mounted() {
    window.addEventListener("keydown", this.onKeydown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeydown);
  },
  methods: {
    performUndo() {
      if (!this.canUndo) return;
      const label = this.lastLabel;
      this.$store.commit("performUndo");
      this.$q.notify({
        type: "info",
        message: `Undone: ${label}`,
        timeout: 1500,
        position: "bottom",
      });
    },
    onKeydown(event) {
      const isUndo = (event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && event.key.toLowerCase() === "z";
      if (!isUndo) return;
      const target = event.target;
      if (target?.isContentEditable || target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      event.preventDefault();
      this.performUndo();
    },
  },
};
</script>