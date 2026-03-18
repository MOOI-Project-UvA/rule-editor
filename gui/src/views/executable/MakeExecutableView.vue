<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-btn color="primary" label="Generate eFLINT" :loading="isGenerating" @click="generateEflint" />
      <q-btn color="primary" outline label="Apply selection" :disable="!eflintBase" @click="applySelection" />
      <q-btn-dropdown
        color="primary"
        outline
        label="Export eFLINT"
        :disable="!eflintBase && !eflintFinal"
      >
        <q-list>
          <q-item clickable v-close-popup dense :disable="!eflintBase" @click="exportEflint('specification')">
            <q-item-section>Specification (.eflint)</q-item-section>
          </q-item>
          <q-item clickable v-close-popup dense :disable="!eflintFinal" @click="exportEflint('scenario')">
            <q-item-section>Scenario (.eflint)</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-5">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1">Frames</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-btn flat label="Select all shown" class="q-mr-sm" @click="selectAll" />
            <q-btn flat label="Select none" @click="selectNone" />

            <q-list bordered separator class="q-mt-md">
              <q-item v-for="f in framesUnion" :key="f.id">
                <q-item-section avatar>
                  <q-checkbox :model-value="selectedIds.includes(f.id)" @click.stop="toggle(f.id)" />
                </q-item-section>

                <q-item-section class="cursor-pointer" @click="toggle(f.id)">
                  <q-item-label>{{ f.shortName }}</q-item-label>
                  <q-item-label caption>
                    {{ f.typeId === "fact" ? (f.subTypeIds?.[0] || f.typeId) : f.typeId }}
                  </q-item-label>

                  <div v-if="isAgentFact(f) && selectedIds.includes(f.id)" @click.stop class="q-mt-xs">
                    <div
                      v-for="(name, idx) in (agentInstanceNames[f.id] || [])"
                      :key="`${f.id}-${idx}`"
                      class="row items-center q-gutter-sm q-mb-xs"
                    >
                      <q-input
                        dense
                        outlined
                        placeholder="instance name"
                        :model-value="name"
                        @update:model-value="setAgentInstanceName(f.id, idx, $event)"
                        style="flex: 1;"
                      />
                      <q-btn dense flat label="Delete" @click.stop="removeAgentInstance(f.id, idx)" />
                    </div>

                    <q-btn dense flat label="Add instance" @click.stop="addAgentInstance(f.id)" />
                  </div>

                  <div v-if="isAct(f) && selectedIds.includes(f.id)" @click.stop class="q-mt-xs">
                    <q-select
                      dense
                      outlined
                      label="Actor type"
                      :options="agentTypeOptions()"
                      emit-value
                      map-options
                      v-model="actSelections[f.id].actorType"
                      class="q-mb-xs"
                    />
                    <q-select
                      dense
                      outlined
                      label="Actor name"
                      :options="agentNameOptions(actSelections[f.id]?.actorType)"
                      emit-value
                      map-options
                      v-model="actSelections[f.id].actorName"
                      class="q-mb-xs"
                    />
                    <q-select
                      dense
                      outlined
                      label="Recipient type"
                      :options="agentTypeOptions()"
                      emit-value
                      map-options
                      v-model="actSelections[f.id].recipientType"
                      class="q-mb-xs"
                    />
                    <q-select
                      dense
                      outlined
                      label="Recipient name"
                      :options="agentNameOptions(actSelections[f.id]?.recipientType)"
                      emit-value
                      map-options
                      v-model="actSelections[f.id].recipientName"
                      class="q-mb-xs"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="row items-center q-gutter-sm">
              <div class="text-subtitle2">Queries</div>
              <q-btn flat dense label="Select all acts" @click="selectAllQueries" />
              <q-btn flat dense label="Select none" @click="selectNoneQueries" />
            </div>

            <q-list bordered separator class="q-mt-sm">
              <q-item v-for="f in actFrames" :key="`query-${f.id}`">
                <q-item-section avatar>
                  <q-checkbox :model-value="querySelectedIds.includes(f.id)" @click.stop="toggleQuery(f.id)" />
                </q-item-section>

                <q-item-section class="cursor-pointer" @click="toggleQuery(f.id)">
                  <q-item-label>{{ f.shortName }}</q-item-label>
                  <q-item-label caption>query act</q-item-label>

                  <div v-if="querySelectedIds.includes(f.id)" @click.stop class="q-mt-xs">
                    <q-select
                      dense
                      outlined
                      label="Actor type"
                      :options="agentTypeOptions()"
                      emit-value
                      map-options
                      v-model="queryActSelections[f.id].actorType"
                      class="q-mb-xs"
                    />
                    <q-select
                      dense
                      outlined
                      label="Actor name"
                      :options="agentNameOptions(queryActSelections[f.id]?.actorType)"
                      emit-value
                      map-options
                      v-model="queryActSelections[f.id].actorName"
                      class="q-mb-xs"
                    />
                    <q-select
                      dense
                      outlined
                      label="Recipient type"
                      :options="agentTypeOptions()"
                      emit-value
                      map-options
                      v-model="queryActSelections[f.id].recipientType"
                      class="q-mb-xs"
                    />
                    <q-select
                      dense
                      outlined
                      label="Recipient name"
                      :options="agentNameOptions(queryActSelections[f.id]?.recipientType)"
                      emit-value
                      map-options
                      v-model="queryActSelections[f.id].recipientName"
                      class="q-mb-xs"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 q-mb-xs">Selection lines</div>
            <q-input
              :model-value="selectionLines.join('\n')"
              type="textarea"
              autogrow
              outlined
              readonly
              input-style="font-family: monospace;"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-7">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1">eFLINT</div>
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
    </div>
  </div>
</template>

<script>
import { convertInterpretationToJson } from "../../helpers/importExport.js";
import { buildEflintApiUrl } from "../../services/AuthService.js";

export default {
  name: "MakeExecutableView",

  data() {
    return {
      isGenerating: false,
      querySelectedIds: [],
      queryClickOrder: [],
      queryActSelections: {},
    };
  },

  computed: {
    selectedIds: {
      get() { return this.$store.state.executableSelectedIds || []; },
      set(v) { this.$store.state.executableSelectedIds = v; },
    },

    clickOrder: {
      get() { return this.$store.state.executableClickOrder || []; },
      set(v) { this.$store.state.executableClickOrder = v; },
    },

    agentInstanceNames: {
      get() { return this.$store.state.executableAgentInstanceNames || {}; },
      set(v) { this.$store.state.executableAgentInstanceNames = v; },
    },

    actSelections: {
      get() { return this.$store.state.executableActSelections || {}; },
      set(v) { this.$store.state.executableActSelections = v; },
    },

    eflintBase: {
      get() { return this.$store.state.executableEflintBase || ""; },
      set(v) { this.$store.state.executableEflintBase = v; },
    },

    eflintFinal: {
      get() { return this.$store.state.executableEflintFinal || ""; },
      set(v) { this.$store.state.executableEflintFinal = v; },
    },

    allFrames() {
      const a = this.$store.state.frames || [];
      const b = this.$store.state.framesOpenInEditor || [];
      const byId = new Map();
      [...a, ...b].forEach((f) => {
        if (f && f.id) byId.set(f.id, f);
      });
      return [...byId.values()];
    },

    framesUnion() {
      const rank = (f) => {
        if (f.typeId === "fact") {
          if (f.subTypeIds?.[0] === "agent") return 0;
          if (f.subTypeIds?.[0] === "object") return 1;
          if (f.subTypeIds?.[0] === "condition") return 2;
          return 3;
        }
        if (f.typeId === "act") return 4;
        return 9;
      };

      return this.allFrames
        .filter((f) => !(f.typeId === "fact" && ["action"].includes(f.subTypeIds?.[0])))
        .slice()
        .sort((a, b) => {
          const ra = rank(a), rb = rank(b);
          if (ra !== rb) return ra - rb;
          return a.shortName.localeCompare(b.shortName);
        });
    },

    actFrames() {
      return this.framesUnion.filter((f) => this.isAct(f));
    },

    selectedFrames() {
      const byId = Object.fromEntries(this.framesUnion.map((f) => [f.id, f]));
      const seen = new Set();
      const out = [];

      for (const id of this.clickOrder) {
        if (!this.selectedIds.includes(id)) continue;
        if (!byId[id]) continue;
        if (seen.has(id)) continue;
        seen.add(id);
        out.push(byId[id]);
      }

      return out;
    },

    querySelectedFrames() {
      const byId = Object.fromEntries(this.actFrames.map((f) => [f.id, f]));
      const seen = new Set();
      const out = [];

      for (const id of this.queryClickOrder) {
        if (!this.querySelectedIds.includes(id)) continue;
        if (!byId[id]) continue;
        if (seen.has(id)) continue;
        seen.add(id);
        out.push(byId[id]);
      }

      return out;
    },

    selectionLines() {
      const frameLines = this.selectedFrames
        .map((f) => {
          if (this.isAgentFact(f)) {
            const names = this.agentInstanceNames[f.id] || [];
            return names
              .filter((n) => String(n).trim().length > 0)
              .map((n) => `+[${f.shortName}]("${this.escape(n)}") .`)
              .join("\n");
          }

          if (this.isAct(f)) {
            return this.buildActTerm(f, this.actSelections[f.id] || {});
          }

          return `+[${f.shortName}] .`;
        })
        .join("\n")
        .split("\n")
        .filter((l) => l.trim().length > 0);

      const queryLines = this.querySelectedFrames
        .map((f) => `?Holds(${this.buildActTerm(f, this.queryActSelections[f.id] || {})}).`);

      return [...frameLines, ...queryLines];
    },
  },

  methods: {
    agentTypeOptions() {
      return this.framesUnion
        .filter((f) => this.isAgentFact(f))
        .map((f) => ({ label: f.shortName, value: f.id }));
    },

    agentNameOptions(typeId) {
      return (this.agentInstanceNames[typeId] || []).map((name) => ({ label: name, value: name }));
    },

    findFrameById(id) {
      return this.framesUnion.find((f) => f.id === id) || this.allFrames.find((f) => f.id === id) || null;
    },

    inferredActSelection(f) {
      const actorType = f?.actor?.id || "";
      const recipientType = f?.recipient?.id || "";
      const actorFrame = this.findFrameById(actorType);
      const recipientFrame = this.findFrameById(recipientType);

      return {
        actorType,
        actorName: actorFrame ? this.defaultAgentInstanceName(actorFrame) : "",
        recipientType,
        recipientName: recipientFrame ? this.defaultAgentInstanceName(recipientFrame) : "",
      };
    },

    ensureAgentTypeHasDefaultName(typeId) {
      if (!typeId) return;
      if (this.agentInstanceNames[typeId] !== undefined) return;
      const frame = this.findFrameById(typeId);
      if (!frame || !this.isAgentFact(frame)) return;
      this.agentInstanceNames = {
        ...this.agentInstanceNames,
        [typeId]: [this.defaultAgentInstanceName(frame)],
      };
    },

    buildActTerm(f, selection) {
      const actorFrame = this.findFrameById(selection.actorType || f.actor?.id);
      const recipientFrame = this.findFrameById(selection.recipientType || f.recipient?.id);
      const at = actorFrame?.shortName || f.actor?.shortName || "";
      const rt = recipientFrame?.shortName || f.recipient?.shortName || "";
      const an = this.escape(selection.actorName || "");
      const rn = this.escape(selection.recipientName || "");
      return `[${f.shortName}]([${at}]("${an}"), [${rt}]("${rn}"))`;
    },


    normalizeEflint(text) {
      // Newlines are only allowed directly after a full stop.
      // Any newline (including blank lines) that interrupts a statement is collapsed into a space.
      const lines = text.split('\n');
      const out = [];
      let buffer = '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === '') {
          // Blank line: only emit as a separator when we are NOT mid-statement.
          // If we are mid-statement (buffer not ending with '.'), absorb the blank line.
          if (buffer === '') {
            out.push('');
          }
          // else: mid-statement blank line — skip it, keep accumulating
        } else {
          buffer = buffer === '' ? trimmed : buffer + ' ' + trimmed;
          if (buffer.endsWith('.')) { out.push(buffer); buffer = ''; }
        }
      }

      if (buffer !== '') out.push(buffer);
      return out.join('\n');
    },

    defaultAgentInstanceName(f) {
      return f.shortName.trim().replace(/\s+/g, "_") + "_1";
    },

    isAgentFact(f) {
      return f.typeId === "fact" && f.subTypeIds?.[0] === "agent";
    },

    isAct(f) {
      return f.typeId === "act";
    },

    escape(s) {
      return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    },

    addAgentInstance(agentId) {
      const cur = this.agentInstanceNames[agentId] || [];
      this.agentInstanceNames = {
        ...this.agentInstanceNames,
        [agentId]: [...cur, ""],
      };
    },

    removeAgentInstance(agentId, idx) {
      const cur = this.agentInstanceNames[agentId] || [];
      const next = cur.filter((_, i) => i !== idx);
      this.agentInstanceNames = {
        ...this.agentInstanceNames,
        [agentId]: next.length ? next : [""],
      };
    },

    setAgentInstanceName(agentId, idx, value) {
      const cur = this.agentInstanceNames[agentId] || [];
      const next = cur.slice();
      next[idx] = value;
      this.agentInstanceNames = {
        ...this.agentInstanceNames,
        [agentId]: next,
      };
    },

    toggle(id) {
      if (this.selectedIds.includes(id)) {
        this.selectedIds = this.selectedIds.filter((x) => x !== id);
        this.clickOrder = this.clickOrder.filter((x) => x !== id);
        return;
      }

      this.selectedIds = [...this.selectedIds, id];
      this.clickOrder = [...this.clickOrder, id];

      const f = this.framesUnion.find((x) => x.id === id);

      if (f && this.isAgentFact(f) && this.agentInstanceNames[id] === undefined) {
        this.agentInstanceNames = { ...this.agentInstanceNames, [id]: [this.defaultAgentInstanceName(f)] };
      }

      if (f && this.isAct(f) && this.actSelections[id] === undefined) {
        const inferred = this.inferredActSelection(f);
        this.ensureAgentTypeHasDefaultName(inferred.actorType);
        this.ensureAgentTypeHasDefaultName(inferred.recipientType);
        this.actSelections = {
          ...this.actSelections,
          [id]: inferred,
        };
      }
    },

    toggleQuery(id) {
      if (this.querySelectedIds.includes(id)) {
        this.querySelectedIds = this.querySelectedIds.filter((x) => x !== id);
        this.queryClickOrder = this.queryClickOrder.filter((x) => x !== id);
        return;
      }

      this.querySelectedIds = [...this.querySelectedIds, id];
      this.queryClickOrder = [...this.queryClickOrder, id];

      const f = this.actFrames.find((x) => x.id === id);
      if (!f || this.queryActSelections[id] !== undefined) return;

      const inferred = this.inferredActSelection(f);
      this.ensureAgentTypeHasDefaultName(inferred.actorType);
      this.ensureAgentTypeHasDefaultName(inferred.recipientType);
      this.queryActSelections = {
        ...this.queryActSelections,
        [id]: inferred,
      };
    },

    selectAll() {
      this.selectedIds = this.framesUnion.map((f) => f.id);
      this.clickOrder = [...this.selectedIds];

      const names = { ...this.agentInstanceNames };
      const acts = { ...this.actSelections };

      this.framesUnion.forEach((f) => {
        if (this.isAgentFact(f) && names[f.id] === undefined) names[f.id] = [this.defaultAgentInstanceName(f)];
        if (this.isAct(f) && acts[f.id] === undefined) {
          acts[f.id] = this.inferredActSelection(f);
          this.ensureAgentTypeHasDefaultName(acts[f.id].actorType);
          this.ensureAgentTypeHasDefaultName(acts[f.id].recipientType);
        }
      });

      this.agentInstanceNames = names;
      this.actSelections = acts;
    },

    selectAllQueries() {
      this.querySelectedIds = this.actFrames.map((f) => f.id);
      this.queryClickOrder = [...this.querySelectedIds];

      const queryActs = { ...this.queryActSelections };
      this.actFrames.forEach((f) => {
        if (queryActs[f.id] === undefined) {
          queryActs[f.id] = this.inferredActSelection(f);
          this.ensureAgentTypeHasDefaultName(queryActs[f.id].actorType);
          this.ensureAgentTypeHasDefaultName(queryActs[f.id].recipientType);
        }
      });

      this.queryActSelections = queryActs;
    },

    selectNoneQueries() {
      this.querySelectedIds = [];
      this.queryClickOrder = [];
    },

    selectNone() {
      this.selectedIds = [];
      this.clickOrder = [];
    },

    applySelection() {
      this.eflintFinal = this.normalizeEflint(`${this.eflintBase}\n\n${this.selectionLines.join("\n")}\n`);
    },

    sanitizeFilePart(value) {
      return String(value || "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .slice(0, 50);
    },

    buildEflintFilename(kind) {
      const dateString = new Date().toISOString().substring(0, 19).replace(/[:T]/g, "-");
      const taskLabel = this.sanitizeFilePart(this.$store.state.task?.label) || "task";
      return `${dateString}_${taskLabel}_${kind}.eflint`;
    },

    downloadTextFile(content, fileName, mimeType = "text/plain;charset=utf-8") {
      const blob = new Blob([content], { type: mimeType });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    },

    exportEflint(kind) {
      const content = kind === "scenario" ? this.eflintFinal : this.eflintBase;
      if (!content) return;
      const fileName = this.buildEflintFilename(kind);
      this.downloadTextFile(content, fileName, "application/octet-stream;charset=utf-8");
    },

    async generateEflint() {
      this.isGenerating = true;

      try {
        const interpretation = convertInterpretationToJson(
          this.$store.state.task,
          this.allFrames,
          this.$store.state.sourceDocuments || []
        );

        const resp = await fetch(buildEflintApiUrl("/generate-eflint"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ interpretation }),
        });

        const data = await resp.json();
        const eflint = data?.eflint || "";

        this.eflintBase = this.normalizeEflint(eflint);
        this.eflintFinal = this.normalizeEflint(eflint);
      } finally {
        this.isGenerating = false;
      }
    },
  },
};
</script>
