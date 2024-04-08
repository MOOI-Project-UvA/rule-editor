<template>
  <!--
    Copyright 2023 Nederlandse Organisatie voor Toegepast Natuur-
    wetenschappelijk Onderzoek TNO / TNO, Netherlands Organisation for 
    applied scientific research

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  */
  -->


  <q-stepper id="stepper-id" v-model="step" ref="stepper" color="primary" animated flat header-nav>
    <q-step :name="1" title="Define a task" icon="mdi-head-dots-horizontal-outline" :done="step > 1" done-color="green"
      caption="Step 1" class="row justify-center content-center" :header-nav="step > 1">
      <TaskDefinitionView @update-stepper="updateStepperValue" />
    </q-step>
    <q-step :name="2" title="Collect sources" icon="mdi-bookmark-box-multiple-outline"
      class="row justify-center content-start" :done="step > 2" done-color="green" caption="Step 2"
      :header-nav="step > 2">
      <SourceCollectionView @update-stepper="updateStepperValue" @decrease-stepper="decreaseStepperValue" />
    </q-step>

    <q-step :name="3" title="Interpret sources" icon="mdi-thought-bubble-outline" :done="step > 3" done-color="green"
      caption="Step 3" :header-nav="step > 3">
      <InterpretationView />
      <!-- <TestView/> -->
    </q-step>
    <q-step :name="4" title="Validate interpretations" icon="mdi-timeline-check-outline" :done="step > 4" disable
      caption="Step 4">
    </q-step>
    <q-step :name="5" title="Perform task" icon="mdi-playlist-check" :done="step > 5" disable caption="Step 5">
    </q-step>
  </q-stepper>
</template>

<script>
import TaskDefinitionView from "./views/TaskDefinitionView.vue";
import SourceCollectionView from "./views/SourceCollectionView.vue";
import InterpretationView from "./views/InterpretationView.vue";

export default {
  name: "app",
  data: () => ({
    step: 1,
  }),

  components: {
    InterpretationView,
    SourceCollectionView,
    TaskDefinitionView
  },

  mounted() {
    //FOR DEBUGGING EDITOR GUI, SKIP FIRST STEPS
    // this.step = 3
    // this.$store.dispatch("loadInterpretationForDebugging")
  },
  methods: {
    updateStepperValue() {
      this.$refs.stepper.next();
    },
    decreaseStepperValue() {
      this.$refs.stepper.previous();
    },
  },
};
</script>
