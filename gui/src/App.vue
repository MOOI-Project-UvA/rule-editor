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
  <div class="q-pa-md q-ma-md">
    <q-stepper
      v-model="step"
      ref="stepper"
      animated
      color="primary"
      flat
      style="height: 94vh"
    >
      <q-step
        :name="1"
        title="Define a task"
        icon="mdi-head-dots-horizontal-outline"
        :done="step > 1"
        caption="Step 1"
        class="fill-height row justify-center content-center"
      >
        <TaskDefinitionView
          @update-stepper="updateStepperValue"
        ></TaskDefinitionView>
      </q-step>
      <q-step
        :name="2"
        title="Collect sources"
        icon="mdi-bookmark-box-multiple-outline"
        :done="step > 2"
        caption="Step 2"
      >
        <SourceCollectionView
          @update-stepper="updateStepperValue"
          @decrease-stepper="decreaseStepperValue"
        ></SourceCollectionView>
      </q-step>
      <q-step
        :name="3"
        title="Interpret sources"
        icon="mdi-thought-bubble-outline"
        :done="step > 2"
        caption="Step 3"
      >
        <div class="row" style="height: 100%">
          <!-- source view column -->
          <div class="col-4">
            <SourceView />
          </div>
          <div class="col-3">
            <FrameNetworkView />
          </div>
          <!-- chip view + editor forms column-->
          <div class="col-5">
            <!-- save and load interpretation buttons -->
            <div class="row">
              <Menu />
            </div>
            <div class="row">
              <!-- frame editor view -->
              <FrameEditorView />
            </div>
          </div>
        </div>
        <AnnotationPanel />
      </q-step>
      <q-step
        :name="4"
        title="Validate interpretation"
        icon="mdi-timeline-check-outline"
        :done="step > 3"
        disable
        caption="Step 4"
      >
      </q-step>
      <q-step
        :name="5"
        title="Perform task"
        icon="mdi-playlist-check"
        :done="step > 4"
        disable
        caption="Step 5"
      >
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation class="bottom: 0px;">
          <q-btn
            @click="$refs.stepper.next()"
            color="primary"
            :label="step === 4 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script>
import SourceView from "./views/SourceView.vue";
import FrameEditorView from "./views/FrameEditorView.vue";
import FrameNetworkView from "./views/FrameNetworkView.vue";
import Menu from "./views/Menu.vue";
import AnnotationPanel from "./components/AnnotationPanel.vue";
import TaskDefinitionView from "./views/TaskDefinitionView.vue";
import SourceCollectionView from "./views/SourceCollectionView.vue";

export default {
  name: "app",
  data: () => ({
    step: 1,
  }),

  components: {
    SourceCollectionView,
    TaskDefinitionView,
    SourceView,
    FrameEditorView,
    FrameNetworkView,
    Menu,
    AnnotationPanel,
  },

  mounted() {
    this.$store.dispatch("readAvailableSources");
  },
  methods: {
    updateStepperValue() {
      console.log("I am updating the stepper value from step 1");
      this.$refs.stepper.next();
    },
    decreaseStepperValue() {
      console.log("I am decreasing the stepper's value from step 2");
      this.$refs.stepper.previous();
    },
  },
};
</script>
<style scoped>
.fill-height {
  height: calc(100vh - 210px);
}
</style>
