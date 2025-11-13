<template>
   <div class="row fit">
    <template v-for="panel in panels">
      <template v-if="panel.expanded">
        <div class="col column fit q-mr-xs">
          <div class="col-auto">
            <div class="row items-center q-px-xs bg-primary">
              <q-btn round flat text-color="white" size="sm" :icon="panel.icon" @click="panel.expanded = false"></q-btn>
              <div class="col text-white">{{ panel.label }}</div>
              <q-btn round flat text-color="white" size="xs" icon="mdi-arrow-collapse-left"
                @click="panel.expanded = false"></q-btn>
            </div>
          </div>
          <!-- this part scrolls -->
          <div class="col fit scroll">
            <component :is="panel.component" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="q-mr-xs">
          <q-btn round color="primary" size="sm" :icon="panel.icon" @click="panel.expanded = true"></q-btn>
        </div>
      </template>
    </template>
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