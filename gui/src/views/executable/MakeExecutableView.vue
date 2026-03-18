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
            <q-scroll-area style="height: 500px">
            <q-list bordered separator class="q-mt-md" style="overflow-y: auto;">
              <q-item v-for="f in framesUnion" :key="f.id">
                <q-item-section avatar>
                  <q-checkbox :model-value="selectedIds.includes(f.id)" @click.stop="toggle(f.id)" />
                </q-item-section>

                <q-item-section class="cursor-pointer" @click="toggle(f.id)">
                  <q-item-label>{{ f.shortName }}</q-item-label>
                  <q-item-label caption>
                    {{ f.typeId === "fact" ? (f.subTypeIds?.[0] || f.typeId) : f.typeId }}
                  </q-item-label>

                  <!-- <div v-if="isAgentFact(f) && selectedIds.includes(f.id)" @click.stop class="q-mt-xs">
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
                  </div> -->

                  <!-- <div v-if="isAct(f) && selectedIds.includes(f.id)" @click.stop class="q-mt-xs">
                    <q-select
                      dense
                      outlined
                      label="Actor type"
                      :options="agentTypeOptions(f.actor)"
                      emit-value
                      map-options
                      v-model="actSelections[f.id].actorName"
                      class="q-mb-xs"
                    />
                    <q-select
                      dense
                      outlined
                      label="Recipient type"
                      :options="agentTypeOptions(f.recipient)"
                      emit-value
                      map-options
                      v-model="actSelections[f.id].recipientName"
                      class="q-mb-xs"
                    />
                  </div> -->
                </q-item-section>
              </q-item>
            </q-list>
            </q-scroll-area>
          </q-card-section>

          <q-separator />

          <!-- <q-card-section>
            <div class="text-subtitle2 q-mb-xs">Selection lines</div>
            <q-input
              :model-value="selectionLines.join('\n')"
              type="textarea"
              autogrow
              outlined
              readonly
              input-style="font-family: monospace;"
            />
          </q-card-section> -->
        </q-card>
      </div>

      <div class="col-12 col-lg-7">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption q-mb-xs">Enabled acts
              <ul>
                <li v-for="f in this.enabledActs"> {{  f.shortName }} <q-btn flat @click.stop="this.applyAct(f)"> Apply </q-btn> </li>               
              </ul>
            </div>

            <div class="text-caption q-mt-md q-mb-xs">Disabled acts
              <ul>
                <li v-for="f in this.disabledActs"> {{  f.shortName }} </li>
              </ul>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { convertInterpretationToJson } from "../../helpers/importExport.js";
import { buildEflintApiUrl } from "../../services/AuthService.js";
import {
  buildExecuteUrl,
  buildReplSessionInputUrl,
  buildReplSessionStartUrl,
  buildReplSessionStopUrl,
} from "../../services/eflintEndpoints.js";


export default {
  name: "MakeExecutableView",

  data() {
    return { 
      isGenerating: false,
      replSessionId: "",
      isStartingRepl: false,
      replBuffer: "",
      isRunningRepl: false,
      replTerminalOutput: "",
      replError: "",
      enabledActs: [],
      disabledActs: [],
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
        // if (f.typeId === "act") return 4;
        return 9;
      };

      return this.allFrames
        .filter((f) => !(this.isAct(f) || f.typeId === "fact" && ["action"].includes(f.subTypeIds?.[0])))
        .slice()
        .sort((a, b) => {
          const ra = rank(a), rb = rank(b);
          if (ra !== rb) return ra - rb;
          return a.shortName.localeCompare(b.shortName);
        });
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

    selectionLines() {
      return this.selectedFrames
        .map((f) => {
          if (this.isAgentFact(f)) {
            const names = this.agentInstanceNames[f.id] || [];
            return names
              .filter((n) => String(n).trim().length > 0)
              .map((n) => `+[${f.shortName}]("${this.escape(n)}") .`)
              .join("\n");
          }

          if (this.isAct(f)) {
            const sel = this.actSelections[f.id] || {};
            const at = f.actor.shortName || "";
            const rt = f.recipient.shortName || "";
            const an = this.escape(sel.actorName || "");
            const rn = this.escape(sel.recipientName || "");
            return `[${f.shortName}]([${at}]("${an}"), [${rt}]("${rn}")).`;
          }

          return `+[${f.shortName}] .`;
        })
        .join("\n")
        .split("\n")
        .filter((l) => l.trim().length > 0);
    },
  },

  async mounted()  {
    this.allFrames.forEach((f) => {
      if (this.isAct(f)) {
        this.disabledActs.push(f);
      }
    })
    await Promise.all([this.generateEflint(),this.startReplSession()])
    await this.sendReplCommand(this.eflintBase)
  },


  methods: {
    async startReplSession() {
      if (this.replSessionId || this.isStartingRepl) {
        return;
      }

      this.replTerminalOutput = "";
      this.replBuffer = "";
      this.replError = "";
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
        console.log("Repl session: " + this.replSessionId)
      } catch (error) {
        this.replError = error?.message || "Failed to start REPL session";
      } finally {
        this.isStartingRepl = false;
      }
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

    async sendReplCommand(data) {
      if (!this.replSessionId || !data || this.isRunningRepl) {
        return;
      }

      console.log("Running with: " + data)
      const ndata = this.normalizeReplCommand(data)
      this.replError = "";
      this.isRunningRepl = true;

      try {
        const url = buildReplSessionInputUrl(this.replSessionId);
        console.log(url)
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: ndata}),
        });
        console.log(resp)

        const data = await resp.json().catch(() => ({}));
        console.log(data)
        if (!resp.ok) {
          const detail = data?.detail || "REPL execution failed";
          this.replError = typeof detail === "string" ? detail : JSON.stringify(detail);
          console.log("Error: " + this.replError)
          return;
        }

        console.log(data?.stdout);
        if (data.stdout) {
          const to_process = data.stdout.split(/\r?\n/)
          const rx_name = /\[(.+?)\]/
          const added = to_process.filter((i) => i.startsWith('+')).map((i) => rx_name.exec(i)[1])
          const removed = to_process.filter((i) => i.startsWith('-') || i.startsWith('~')).map((i) => rx_name.exec(i)[1])

          console.log("Added & Removed")
          console.log(added)
          console.log(removed)

          this.allFrames.forEach((e) => {
            if (added.includes(e.shortName)) {
               if (this.isAct(e)) {
                this.enabledActs.push(e)
                this.disabledActs = this.disabledActs.filter((f) => f.id != e.id)
               } else {
                this.selectedIds = [...this.selectedIds, e.id];
                this.clickOrder = [...this.clickOrder, e.id];
               }
            } else if (removed.includes(e.shortName)) {
               if (this.isAct(e)) {
                this.disabledActs.push(e)
                this.enabledActs = this.enabledActs.filter((f) => f.id != e.id)
               } else {
                this.selectedIds = this.selectedIds.filter((x) => x !== e.id);
                this.clickOrder = this.clickOrder.filter((x) => x !== e.id);
               }
            }
          });

        }
        console.log(data?.stderr);
        if (data?.running === false) {
          this.replSessionId = "";
        }
      } catch (error) {
        this.replError = error?.message || "Failed to execute REPL";
      } finally {
        this.isRunningRepl = false;
      }
    },

    applyAct(f) {
      this.sendReplCommand("[" + f.shortName + "]()")
    },

    agentTypeOptions(type) {
      return this.agentInstanceNames[type.id]
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
      const f = this.framesUnion.find((x) => x.id === id);

      if (this.selectedIds.includes(id)) {
        this.selectedIds = this.selectedIds.filter((x) => x !== id);
        this.clickOrder = this.clickOrder.filter((x) => x !== id);

        if (f && !this.isAct(f) && !this.isAgentFact(f)) {
          this.sendReplCommand("-[" + f.shortName + "]");
        }
        return;
      }

      this.selectedIds = [...this.selectedIds, id];
      this.clickOrder = [...this.clickOrder, id];

      if (f && this.isAgentFact(f) && this.agentInstanceNames[id] === undefined) {
        this.sendReplCommand("+[" + f.shortName + "]");
        this.agentInstanceNames = { ...this.agentInstanceNames, [id]: [""] };
        return
      }

      if (f && this.isAct(f) && this.actSelections[id] === undefined) {
        this.actSelections = {
          ...this.actSelections,
          [id]: { actorType: "", actorName: "", recipientType: "", recipientName: "" },
        };
        return
      }

      this.sendReplCommand("+[" + f.shortName + "]");
      
    },

    selectAll() {
      this.selectedIds = this.framesUnion.map((f) => f.id);
      this.clickOrder = [...this.selectedIds];

      const names = { ...this.agentInstanceNames };
      const acts = { ...this.actSelections };

      this.framesUnion.forEach((f) => {
        if (this.isAgentFact(f) && names[f.id] === undefined) names[f.id] = [""];
        if (this.isAct(f) && acts[f.id] === undefined) {
          acts[f.id] = { actorType: "", actorName: "", recipientType: "", recipientName: "" };
        }
      });

      this.agentInstanceNames = names;
      this.actSelections = acts;
    },

    selectNone() {
      this.selectedIds = [];
      this.clickOrder = [];
    },

    applySelection() {
      this.eflintFinal = `${this.eflintBase}\n\n${this.selectionLines.join("\n")}\n`;
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

        this.eflintBase = eflint;
        this.eflintFinal = eflint;
      } finally {
        this.isGenerating = false;
      }
    },
  },
};
</script>
