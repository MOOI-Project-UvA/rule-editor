<template>
  <div class="row q-gutter-x-xs">
    <div v-for="panel in panels" :class="{ col: panel.expanded }">
      <div v-if="panel.expanded" class="row items-center q-px-xs bg-primary">
        <q-avatar text-color="white" size="lg" :icon="panel.icon" />
        <div class="col text-white">{{ panel.label }}</div>
        <q-btn round flat text-color="white" size="xs" icon="mdi-arrow-collapse-left"
          @click="panel.expanded = false"></q-btn>
      </div>
      <div v-else>
        <q-btn round color="primary" size="sm" :icon="panel.icon" @click="panel.expanded = true"></q-btn>
      </div>
      <template v-if="panel.expanded">
        <component :is="panel.component" />
      </template>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue' //to prevent components from becoming reactie
//use component from interpretation view to list all frames
import FrameListView from "../interpretation/FrameListView.vue";
import VisualizationPanel from './VisualizationPanel.vue';

export default {
  name: "InterpretationView",
  components: {
    FrameListView,
    VisualizationPanel
  },
  //icons from https://pictogrammers.com/library/mdi/
  data: () => ({
    panels: [
      {
        label: "Frames",
        component: markRaw(FrameListView),
        expanded: false,
        icon: 'mdi-format-list-bulleted-square'
      },
      {
        label: "Network",
        component: markRaw(VisualizationPanel),
        expanded: true,
        icon: 'mdi-file-tree'
      },
    ]
  }),
};
</script>