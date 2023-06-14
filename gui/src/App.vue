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
  <div class="row">
    <!-- source view column -->
    <div class="col-5 q-p-2 fill-height">
      <SourceView />
    </div>
    <div class="col-3 q-p-2">
      <FrameNetworkView />
    </div>
    <!-- chip view + editor forms column-->
    <div class="col-4 q-p-2">
      <!-- save and load interpretation buttons -->
      <div class="row">
        <Menu />
      </div>
      <div class="row">
        <!-- frame editor view -->
        <FrameEditorView />

        <!--        &lt;!&ndash; chip view &ndash;&gt;-->
        <!--        <div class="col-4 column">-->
        <!--          <FrameNetworkView />-->
        <!--        </div>-->
      </div>
    </div>
  </div>
  <div id="annotationPanel" v-if="annotationBeingEdited" :style="{
    left: annotationBeingEdited.positionOnScreen[0] + 'px',
    top: annotationBeingEdited.positionOnScreen[1] + 'px',
  }">
    <AnnotationPanel :annotation="annotationBeingEdited" />
  </div>
</template>

<script>
import SourceView from "./views/SourceView.vue";
import FrameEditorView from "./views/FrameEditorView.vue";
import FrameNetworkView from "./views/FrameNetworkView.vue";
import Menu from "./views/Menu.vue";
import AnnotationPanel from "./components/AnnotationPanel.vue";

export default {
  name: "app",

  components: {
    SourceView,
    FrameEditorView,
    FrameNetworkView,
    Menu,
    AnnotationPanel,
  },
  mounted() {
    this.$store.dispatch("readAvailableSources");
  },
  computed: {
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
    annotationBeingEdited() {
      return this.$store.state.annotationBeingEdited;
    },
  },
};
</script>

<style>
#annotationPanel {
  position: absolute;
}
</style>
