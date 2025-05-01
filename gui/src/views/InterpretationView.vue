<script>
//icons from https://pictogrammers.com/library/mdi/
import SourceView from "./SourceView.vue";
import FrameListView from "./FrameListView.vue";
import FrameEditView from "./FrameEditView.vue"

import AnnotationPanel from "../components/AnnotationPanel.vue";
import AnnotationList from "../components/AnnotationList.vue"
import AddingAnnotationToFramePanel from "../components/AddingAnnotationToFramePanel.vue"

import { markRaw } from 'vue' //to prevent components from becoming reactie

export default {
  name: "InterpretationView",
  components: {
    FrameListView,
    FrameEditView,
    SourceView,
    AnnotationPanel,
    AnnotationList,
    AddingAnnotationToFramePanel,
  },
  data: () => ({
    panels: [
      {
        label: "Source",
        component: markRaw(SourceView),
        expanded: true,
        icon: 'mdi-file-document-outline'
      },
      {
        label: "Frames",
        component: markRaw(FrameListView),
        expanded: true,
        icon: 'mdi-application-outline'
      },
      {
        label: "Edit",
        component: markRaw(FrameEditView),
        expanded: true,
        icon: 'mdi-pencil'
      },
    ]
  }),
};
</script>

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

<style scoped lang="css">
.vertical {
  writing-mode: vertical-rl;
}
</style>
