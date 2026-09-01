<template>
  <q-dialog v-model="open">
    <q-card class="changelog-dialog">
      <q-card-section class="changelog-header">
        <div class="row items-center no-wrap">
          <q-icon name="mdi-history" size="24px" color="white" class="q-mr-sm" />
          <div>
            <div class="changelog-title">FLINT Rule Editor Changelog</div>
            <div class="changelog-subtitle">Features, fixes and improvements</div>
          </div>
        </div>
        <q-btn flat round dense icon="mdi-close" color="white" v-close-popup />
      </q-card-section>

      <q-card-section class="scroll changelog-content">
        <template v-if="changelog.length">
          <div
            v-for="entry in changelog"
            :key="entry.version"
            class="version-block"
            :class="{ unreleased: entry.status === 'unreleased' }"
          >
            <div class="version-row" @click="toggleVersion(entry.version)">
              <div class="version-left">
                <span class="version-number">{{ entry.version }}</span>
                <span class="version-date">{{ entry.date }}</span>
              </div>
              <div class="version-right">
                <q-badge
                  :color="entry.status === 'unreleased' ? 'orange' : 'positive'"
                  :label="entry.status === 'unreleased' ? 'Unreleased' : 'Released'"
                  class="q-mr-sm"
                />
                <q-icon :name="expanded.includes(entry.version) ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
              </div>
            </div>

            <div v-if="expanded.includes(entry.version)" class="version-content">
              <div v-for="section in entry.sections" :key="section.type" class="section-block">
                <div class="section-title">{{ section.type }}</div>
                <ul class="section-items">
                  <li v-for="item in section.items" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="empty-changelog">
          No changelog entries are available.
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "WhatsNewModal",
  props: {
    modelValue: Boolean,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      changelog: [],
      expanded: [],
    };
  },
  computed: {
    open: {
      get() { return this.modelValue; },
      set(value) { this.$emit("update:modelValue", value); },
    },
  },
  methods: {
    async loadChangelog() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}changelog.json`);
        if (!response.ok) {
          return;
        }
        const changelog = await response.json();
        if (Array.isArray(changelog)) {
          this.changelog = changelog;
          this.expanded = changelog[0]?.version ? [changelog[0].version] : [];
        }
      } catch {
      }
    },
    toggleVersion(version) {
      const index = this.expanded.indexOf(version);
      if (index === -1) {
        this.expanded.push(version);
      } else {
        this.expanded.splice(index, 1);
      }
    },
  },
  mounted() {
    this.loadChangelog();
  },
};
</script>

<style scoped>
.changelog-dialog {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  max-width: 95vw;
  width: 600px;
}

.changelog-header {
  align-items: center;
  background: #1976d2;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
}

.changelog-title {
  font-size: 16px;
  font-weight: 700;
}

.changelog-subtitle {
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  margin-top: 2px;
}

.changelog-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.version-block {
  border: 1px solid #e2e6ec;
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;
}

.version-block.unreleased {
  border-color: #f5a623;
}

.version-row {
  align-items: center;
  background: #f9fafb;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
}

.version-row:hover {
  background: #f0f3f7;
}

.version-left,
.version-right {
  align-items: center;
  display: flex;
}

.version-left {
  gap: 12px;
}

.version-right {
  gap: 4px;
}

.version-number {
  color: #1976d2;
  font-size: 15px;
  font-weight: 700;
}

.version-date {
  color: #6b7280;
  font-size: 12px;
}

.version-content {
  border-top: 1px solid #e2e6ec;
  padding: 12px 16px 16px;
}

.section-block {
  margin-bottom: 12px;
}

.section-block:last-child {
  margin-bottom: 0;
}

.section-title {
  color: #1976d2;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.section-items {
  margin: 0;
  padding-left: 20px;
}

.section-items li {
  color: #4a5568;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 4px;
}

.empty-changelog {
  color: #6b7280;
  font-size: 13px;
  padding: 12px 4px;
}
</style>