<template>
  <div class="navigation-bar">
    <div class="navigation-tabs">
      <div
        v-for="view in views"
        :key="view.id"
        class="row items-center q-gutter-xs cursor-pointer nav-button text-primary"
        :class="{'selected': activeView?.id == view.id}"
        @click="updateActiveView(view)"
      >
        <q-icon :name="view.icon" size="sm" />
        <div>{{ view.label }}</div>
      </div>
    </div>
    <div class="navigation-actions">
      <q-btn
        v-if="isWhatsNewEnabled"
        round
        dense
        icon="mdi-history"
        color="white"
        text-color="primary"
        @click="whatsNewOpen = true"
      >
        <q-tooltip>What's new?</q-tooltip>
      </q-btn>
      <LoadSaveInterpretationBanner />
    </div>
    <WhatsNewModal v-model="whatsNewOpen" />
  </div>
</template>

<script>
import TaskDefinitionView from "../views/TaskDefinitionView.vue";
import SourceCollectionView from "../views/SourceCollectionView.vue";
import InterpretationView from "../views/interpretation/InterpretationView.vue";
import VisualizationView from "../views/visualization/VisualizationView.vue";
import MakeExecutableView from "../views/executable/MakeExecutableView.vue";
import ExecuteTaskView from "../views/executable/ExecuteTaskView.vue";
import LoadSaveInterpretationBanner from "./LoadSaveIntepretationBanner.vue"
import WhatsNewModal from "./WhatsNewModal.vue"
import { markRaw } from 'vue' //to prevent components from becoming reactie

export default {
    data: () => ({
  whatsNewOpen: false,
    views: [
      {
        id:0,
        label: "Set task",
        component: markRaw(TaskDefinitionView),
        completed: false,
        icon: 'mdi-head-dots-horizontal-outline'
      },
      {
        id: 1,
        label: "Collect sources",
        component: markRaw(SourceCollectionView),
        completed: false,
        icon: 'mdi-bookmark-box-multiple-outline'
      },
      {
        id: 2,
        label: "Interpret sources",
        component: markRaw(InterpretationView),
        completed: false,
        icon: 'mdi-thought-bubble-outline'
      },
      {
        id: 3,
        label: "View interpretation",
        component: markRaw(VisualizationView),
        completed: false,
        icon: 'mdi-file-tree'
      },
      {
        id: 4,
        label: "Make interpretations executable", 
        component: markRaw(MakeExecutableView),
        completed: false,
        icon: 'mdi-timeline-check-outline'
      },
      {
        id: 5,
        label: "interactive eFLINT",
        component: markRaw(ExecuteTaskView),
        completed: false,
        icon: 'mdi-playlist-check'
      },
    ],
  }),
  props: {
    activeView: Object
  },
  computed: {
    isWhatsNewEnabled() {
      const value = import.meta.env.VITE_WHATS_NEW_ENABLED;
      return value === undefined || value === "" || String(value).toLowerCase() === "true";
    },
  },
  components: {
    TaskDefinitionView,
    InterpretationView,
    SourceCollectionView,
    LoadSaveInterpretationBanner,
    WhatsNewModal,
  },
  mounted() {
    this.updateActiveView(this.views[0])
  },
  methods: {
    updateActiveView(newView) {
      this.$emit('update:activeView', newView);
    }
  }

}
</script>

<style>
.navigation-bar {
  align-items: center;
  display: flex;
  gap: 12px;
  min-width: 0;
  padding: 8px 16px;
}

.navigation-tabs {
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  gap: 20px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: thin;
}

.navigation-actions {
  align-items: center;
  background: #e6f1fc;
  border-radius: 6px;
  display: flex;
  flex: 0 0 auto;
  gap: 6px;
  padding: 5px;
}

.nav-button {
  border-bottom: 2px solid #ffffff00;
  flex: 0 0 auto;
  padding: 8px 2px;
  white-space: nowrap;
}
.nav-button:hover {
  border-bottom: 2px solid #b6d1ec;
}
.nav-button.selected {
  border-bottom: 2px solid #b6d1ec;
}

@media (max-width: 600px) {
  .navigation-bar {
    gap: 8px;
    padding: 8px;
  }

  .navigation-tabs {
    gap: 14px;
  }
}
</style>