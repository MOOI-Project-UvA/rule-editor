<template>
  <div class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1">interactive eFLINT</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-caption q-mb-xs">Specification</div>
        <q-input
          v-model="eflintBase"
          type="textarea"
          autogrow
          outlined
          input-style="font-family: monospace;"
        />

        <div class="text-caption q-mt-md q-mb-xs">Scenario</div>
        <q-input
          v-model="eflintFinal"
          type="textarea"
          autogrow
          outlined
          input-style="font-family: monospace;"
        />

        <div class="text-caption q-mt-md q-mb-xs">Queries</div>
        <q-input
          v-model="eflintQuery"
          type="textarea"
          autogrow
          outlined
          input-style="font-family: monospace;"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle2 q-mb-xs">REPL</div>
        <div class="text-caption q-mb-sm">Experimental interactive mode (persistent session)</div>

        <div class="row items-center q-gutter-sm q-mb-sm">
          <q-btn
            color="primary"
            label="Start REPL"
            :loading="isStartingRepl"
            :disable="!!replSessionId"
            @click="startReplSession()"
          />
          <q-btn
            flat
            label="Stop REPL"
            :disable="!replSessionId"
            @click="stopReplSession()"
          />
          <div class="text-caption">Session: {{ replSessionId ? 'active' : 'stopped' }}</div>
        </div>

        <div ref="replTerminalScroll" class="repl-terminal q-mb-sm">
          <div
            ref="replTerminal"
            class="repl-terminal-input"
            tabindex="0"
            @click="focusTerminal()"
            @keydown="onTerminalKeydown"
            @paste.prevent="onTerminalPaste"
          >
            <pre class="repl-terminal-content">{{ renderedTerminal }}</pre>
          </div>
        </div>

        <transition name="diff-fade">
          <div v-if="hasReplState" class="diff-panel q-mb-sm">
            <div class="diff-panel-header">
              Changes after last command
            </div>
            <div
              v-for="item in factDiff"
              :key="item.fact"
              :class="item.type === 'added' ? 'diff-added' : 'diff-removed'"
            >
              {{ item.type === 'added' ? '+' : '-' }} {{ item.fact }}
            </div>
            <div v-if="factDiff.length === 0" class="diff-empty">
              No fact changes detected.
            </div>
          </div>
        </transition>

        <div class="row items-center q-gutter-sm q-mt-sm q-mb-sm">
          <q-btn
            color="primary"
            label="Send"
            :loading="isRunningRepl"
            :disable="!replSessionId || !replBuffer"
            @click="sendReplCommand(replBuffer)"
          />
          <q-btn
            flat
            label="Paste"
            :disable="!replSessionId"
            @click="pasteFromClipboard()"
          />
        </div>
        <div class="text-caption q-mb-sm">Shortcuts: Ctrl+V / Shift+Insert / Paste button (Win+V opens Windows clipboard history)</div>
        <div v-if="replError" class="text-negative q-mt-sm">{{ replError }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {
  buildReplSessionInputUrl,
  buildReplSessionStartUrl,
  buildReplSessionStopUrl,
} from "../../services/eflintEndpoints.js";
export default {
  name: "ExecuteTaskView",

  data() {
    return {
      replSessionId: "",
      isStartingRepl: false,
      replBuffer: "",
      replCursorPos: 0,
      replHistory: [],
      replHistoryIndex: -1,
      replHistoryDraft: "",
      isRunningRepl: false,
      replTerminalOutput: "",
      replError: "",
      previousFactState: {},
      factDiff: [],
      hasReplState: false,
      isDiffing: false,
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
    eflintQuery: {
      get() { return this.$store.state.executableEflintQuery || ""; },
      set(v) { this.$store.state.executableEflintQuery = v; },
    },
    renderedTerminal() {
      if (!this.replTerminalOutput && !this.replSessionId) {
        return "No REPL output yet. Start REPL to begin.";
      }
      const base = this.replTerminalOutput || "";
      if (!this.replSessionId) {
        return base;
      }
      const before = this.replBuffer.slice(0, this.replCursorPos);
      const after = this.replBuffer.slice(this.replCursorPos);
      return `${base}> ${before}█${after}`;
    },
  },

  watch: {
    replTerminalOutput() {
      this.scrollTerminalToBottom();
    },
    replBuffer() {
      this.scrollTerminalToBottom();
    },
  },

  methods: {
    focusTerminal() {
      this.$refs.replTerminal?.focus();
    },

    scrollTerminalToBottom() {
      this.$nextTick(() => {
        const scrollEl = this.$refs.replTerminalScroll;
        if (!scrollEl) {
          return;
        }
        scrollEl.scrollTop = scrollEl.scrollHeight;
      });
    },

    onTerminalPaste(event) {
      if (!this.replSessionId) {
        return;
      }

      const pastedText = event?.clipboardData?.getData("text") || "";
      if (!pastedText) {
        return;
      }
      const text = pastedText.replace(/\r/g, "");
      this.replBuffer = this.replBuffer.slice(0, this.replCursorPos) + text + this.replBuffer.slice(this.replCursorPos);
      this.replCursorPos += text.length;
    },

    async pasteFromClipboard() {
      if (!this.replSessionId || !navigator?.clipboard?.readText) {
        return;
      }
      try {
        const pastedText = await navigator.clipboard.readText();
        if (pastedText) {
          const text = pastedText.replace(/\r/g, "");
          this.replBuffer = this.replBuffer.slice(0, this.replCursorPos) + text + this.replBuffer.slice(this.replCursorPos);
          this.replCursorPos += text.length;
        }
      } catch {
      }
    },

    onTerminalKeydown(event) {
      if (!this.replSessionId) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
        event.preventDefault();
        this.pasteFromClipboard();
        return;
      }

      if (event.shiftKey && event.key === "Insert") {
        event.preventDefault();
        this.pasteFromClipboard();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (this.replBuffer) {
          this.sendReplCommand(this.replBuffer);
        }
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        if (this.replCursorPos > 0) {
          this.replBuffer = this.replBuffer.slice(0, this.replCursorPos - 1) + this.replBuffer.slice(this.replCursorPos);
          this.replCursorPos--;
        }
        return;
      }

      if (event.key === "Delete") {
        event.preventDefault();
        if (this.replCursorPos < this.replBuffer.length) {
          this.replBuffer = this.replBuffer.slice(0, this.replCursorPos) + this.replBuffer.slice(this.replCursorPos + 1);
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        this.replCursorPos = Math.max(0, this.replCursorPos - 1);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        this.replCursorPos = Math.min(this.replBuffer.length, this.replCursorPos + 1);
        return;
      }

      if (event.key === "Home" || (event.ctrlKey && event.key === "a")) {
        event.preventDefault();
        this.replCursorPos = 0;
        return;
      }

      if (event.key === "End" || (event.ctrlKey && event.key === "e")) {
        event.preventDefault();
        this.replCursorPos = this.replBuffer.length;
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!this.replHistory.length) {
          return;
        }
        if (this.replHistoryIndex === -1) {
          this.replHistoryDraft = this.replBuffer;
        }
        this.replHistoryIndex = Math.min(this.replHistoryIndex + 1, this.replHistory.length - 1);
        this.replBuffer = this.replHistory[this.replHistory.length - 1 - this.replHistoryIndex];
        this.replCursorPos = this.replBuffer.length;
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (this.replHistoryIndex === -1) {
          return;
        }
        this.replHistoryIndex--;
        this.replBuffer = this.replHistoryIndex === -1
          ? this.replHistoryDraft
          : this.replHistory[this.replHistory.length - 1 - this.replHistoryIndex];
        this.replCursorPos = this.replBuffer.length;
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        this.replBuffer = this.replBuffer.slice(0, this.replCursorPos) + "  " + this.replBuffer.slice(this.replCursorPos);
        this.replCursorPos += 2;
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (event.key.length === 1) {
        event.preventDefault();
        this.replBuffer = this.replBuffer.slice(0, this.replCursorPos) + event.key + this.replBuffer.slice(this.replCursorPos);
        this.replCursorPos++;
      }
    },

    appendToRepl(text) {
      if (!text) {
        return;
      }
      const current = this.replTerminalOutput || "";
      this.replTerminalOutput = `${current}${text}`;
    },

    normalizeReplCommand(command) {
      if (!command) {
        return "";
      }

      return command
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join(" ")
        .trim();
    },

    parseFactState(rawOutput) {
      const state = {};
      for (const line of rawOutput.split("\n")) {
        const match = line.match(/^(.+?)\s*=\s*(True|False)\s*$/);
        if (match) {
          state[match[1].trim()] = match[2];
        }
      }
      return state;
    },

    computeFactDiff(before, after) {
      const diff = [];
      for (const [fact, value] of Object.entries(after)) {
        if (value === "True" && before[fact] !== "True") {
          diff.push({ fact, type: "added" });
        }
      }
      for (const [fact, value] of Object.entries(before)) {
        if (value === "True" && after[fact] !== "True") {
          diff.push({ fact, type: "removed" });
        }
      }
      return diff;
    },

    async fetchAndDiffState(captureOnly = false) {
      if (!this.replSessionId || this.isDiffing) {
        return;
      }

      this.isDiffing = true;
      try {
        const resp = await fetch(buildReplSessionInputUrl(this.replSessionId), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: ":d" }),
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          return;
        }

        const currentFactState = this.parseFactState(data.stdout || "");
        if (!captureOnly) {
          this.factDiff = this.computeFactDiff(this.previousFactState, currentFactState);
        }
        this.previousFactState = currentFactState;
        this.hasReplState = true;
      } finally {
        this.isDiffing = false;
      }
    },

    async startReplSession() {
      if (this.replSessionId || this.isStartingRepl) {
        return;
      }

      this.replTerminalOutput = "";
      this.replBuffer = "";
      this.replCursorPos = 0;
      this.replHistory = [];
      this.replHistoryIndex = -1;
      this.replHistoryDraft = "";
      this.replError = "";
      this.factDiff = [];
      this.previousFactState = {};
      this.hasReplState = false;
      this.isStartingRepl = true;

      try {
        const url = buildReplSessionStartUrl();
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          const detail = data?.detail || "Failed to start REPL session";
          this.replError = typeof detail === "string" ? detail : JSON.stringify(detail);
          return;
        }

        this.replSessionId = data?.sessionId || "";
        this.appendToRepl(data?.stdout || "");
        this.appendToRepl(data?.stderr || "");
        this.$nextTick(() => this.focusTerminal());
        this.scrollTerminalToBottom();
        await this.fetchAndDiffState(true);
      } catch (error) {
        this.replError = error?.message || "Failed to start REPL session";
      } finally {
        this.isStartingRepl = false;
      }
    },

    async stopReplSession() {
      if (!this.replSessionId) {
        return;
      }

      const currentSessionId = this.replSessionId;
      this.replSessionId = "";
      this.replBuffer = "";
      this.replCursorPos = 0;
      this.replHistory = [];
      this.replHistoryIndex = -1;
      this.replHistoryDraft = "";
      this.factDiff = [];
      this.previousFactState = {};
      this.hasReplState = false;

      try {
        const url = buildReplSessionStopUrl(currentSessionId);
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch {
      }
    },

    async sendReplCommand(command) {
      if (!this.replSessionId || !command || this.isRunningRepl) {
        return;
      }

      const normalizedCommand = this.normalizeReplCommand(command);
      if (!normalizedCommand) {
        return;
      }

      this.replError = "";
      this.isRunningRepl = true;
      this.replHistory.push(normalizedCommand);
      this.replHistoryIndex = -1;
      this.replHistoryDraft = "";
      this.replBuffer = "";
      this.replCursorPos = 0;
      this.appendToRepl(`> ${normalizedCommand}\n`);

      try {
        const url = buildReplSessionInputUrl(this.replSessionId);
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: normalizedCommand }),
        });

        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          const detail = data?.detail || "REPL execution failed";
          this.replError = typeof detail === "string" ? detail : JSON.stringify(detail);
          return;
        }

        this.appendToRepl(data?.stdout || "");
        this.appendToRepl(data?.stderr || "");
        if (data?.running === false) {
          this.replSessionId = "";
        }
      } catch (error) {
        this.replError = error?.message || "Failed to execute REPL";
      } finally {
        this.isRunningRepl = false;
        this.$nextTick(() => this.focusTerminal());
        this.scrollTerminalToBottom();
        if (this.replSessionId) {
          await this.fetchAndDiffState();
        }
      }
    },

  },

  beforeUnmount() {
    if (this.replSessionId) {
      this.stopReplSession();
    }
  },
};
</script>

<style scoped>
.repl-terminal {
  background: #000;
  color: #d4ffd4;
  border-radius: 6px;
  border: 1px solid #333;
  min-height: 260px;
  max-height: 420px;
  overflow: auto;
  padding: 12px;
}

.repl-terminal-content {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  line-height: 1.4;
}

.repl-terminal-input {
  min-height: 236px;
  cursor: text;
  outline: none;
}

.diff-panel {
  background: #0d1b2a;
  border: 1px solid #2a3f5f;
  border-left: 3px solid #4a90d9;
  border-radius: 4px;
  padding: 8px 12px;
  color: #c8d4e8;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  line-height: 1.6;
}

.diff-panel-header {
  color: #8899bb;
  font-family: sans-serif;
  font-size: 11px;
  margin-bottom: 6px;
}

.diff-added {
  color: #4caf50;
}

.diff-removed {
  color: #ef5350;
}

.diff-empty {
  color: #8899bb;
}

.diff-fade-enter-active,
.diff-fade-leave-active {
  transition: opacity 0.25s ease;
}

.diff-fade-enter-from,
.diff-fade-leave-to {
  opacity: 0;
}
</style>
