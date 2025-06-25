<template>
  <div class="row q-ma-md items-center">
    <div class="q-ml-lg row items-center q-gutter-xs cursor-pointer nav-button text-primary"
      :class="{'selected': activeView?.id == view.id}"
      v-for="view in views"
      @click="this.updateActiveView(view)">
       <q-icon :name="view.icon" size="sm"/>
         <div>
          {{ view.label }}
         </div>
    </div>
    <div class="q-ml-lg col">
      <div class="float-right">
        <LoadSaveInterpretationBanner/></div>
    </div>
  </div>
</template>

<script>
import TaskDefinitionView from "../views/TaskDefinitionView.vue";
import SourceCollectionView from "../views/SourceCollectionView.vue";
import InterpretationView from "../views/interpretation/InterpretationView.vue";
import LoadSaveInterpretationBanner from "./LoadSaveIntepretationBanner.vue"
import { markRaw } from 'vue' //to prevent components from becoming reactie

export default {
    data: () => ({
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
        label: "Make interpretations executable", 
        component: null,
        completed: false,
        icon: 'mdi-timeline-check-outline'
      },
      {
        id: 4,
        label: "Execute task",
        component: null,
        completed: false,
        icon: 'mdi-playlist-check'
      },
    ],
  }),
  props: {
    activeView: Object
  },
  components: {
    TaskDefinitionView,
    InterpretationView,
    SourceCollectionView,
    LoadSaveInterpretationBanner
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
.nav-button {
  border-bottom: 2px solid #ffffff00;
  padding: 8px 2px;
}
.nav-button:hover {
  border-bottom: 2px solid #b6d1ec;
}
.nav-button.selected {
  border-bottom: 2px solid #b6d1ec;
}
</style>