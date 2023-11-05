<script>
import SourceView from "./SourceView.vue";
import FrameNetworkView from "./FrameNetworkView.vue";
import FrameEditorView from "./FrameEditorView.vue";
import AnnotationPanel from "../components/AnnotationPanel.vue";
import Menu from "./Menu.vue";

export default {
  name: "InterpretationView",
  components: {
    Menu,
    AnnotationPanel,
    FrameEditorView,
    FrameNetworkView,
    SourceView,
  },
};
</script>

<template>
  <div id="interpretation-view">
    <q-card flat bordered class="my-card q-ma-sm fill-height">
      <!-- header -->
      <q-item class="q-ma-sm">
        <q-item-section avatar>
          <q-avatar icon="mdi-thought-bubble-outline" rounded size="xl">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>Interpret sources</q-item-label>
          <q-item-label caption>Step 3</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-avatar>
            <q-icon
              name="mdi-information-outline"
              class="cursor-pointer"
            ></q-icon>
            <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
              <div style="max-width: 300px">
                In this view, you can interpret selected legal sources from the
                repository. You are able to start the interpretation process by
                selecting text snippets and assigning one of the four supported
                labels: 1) Agent, 2) Action, 3) Object, 4) Conditions.
              </div>
            </q-tooltip>
          </q-avatar>
        </q-item-section>
      </q-item>
      <q-separator />
      <!-- main content of the card -->
      <!-- source view column -->
      <div class="row q-mt-xl q-mx-lg">
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
    </q-card>
  </div>
  <AnnotationPanel />
</template>

<style scoped lang="css">
#interpretation-view {
  min-height: calc(100vh - 72px - 48px - 50px);
}
.fill-height {
  min-height: calc(100vh - 72px - 48px - 50px);
}
</style>
