<template>
  <!-- This component contains the content of the source collection view -->
  <div id="source-collection-view">
    <q-card flat bordered class="my-card q-ma-sm" style="width: 1000px">
      <!-- header -->
      <!--<q-item class="q-ma-sm">
        <q-item-section avatar>
          <q-avatar icon="mdi-bookmark-box-multiple-outline" rounded size="xl">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>Collect sources</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="mdi-information-outline" class="cursor-pointer"></q-icon>
            <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
              <div style="max-width: 300px">
                In this view, you can select legal sources either from the server or from your local file system.
              </div>
            </q-tooltip>
          </q-avatar>
        </q-item-section>
      </q-item>
      <q-separator />-->
      <!--  main content of the card-->
      <q-card-section>
        <SourceLoader />
      </q-card-section>
      <div id="source-collection-card-content">
        <!-- the retrieved legal text will be shown here -->
        <div>
          <q-splitter v-model="splitterModel" class="q-mt-lg">
            <template v-slot:before>
              <q-tabs v-model="tab" vertical shrink dense class="text-grey" active-color="primary"
                indicator-color="primary">
                <q-tab v-for="(sourceDocument, docIndex) in sourceDocuments" :key="docIndex" :name="docIndex"
                  icon="mdi-book-outline" :label="abbreviateTitle(sourceDocument.title)" />
              </q-tabs>
            </template>
            <template v-slot:after>
              <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up"
                transition-next="jump-up">
                <q-tab-panel v-for="(sourceDocument, docIndex) in sourceDocuments" :key="docIndex" :name="docIndex">
                  <q-card flat square>
                    <q-card-section>
                      <q-btn color="primary" size="sm" class="q-mr-md"
                        @click="sourceDocument.sentenceTree.selected = true">Select all</q-btn>
                      <q-btn color="negative" size="sm" @click="sourceDocument.sentenceTree.selected = false">Deselect
                        all</q-btn>
                    </q-card-section>
                    <q-card-section class="q-pt-none expansion-items">
                      <ListComponent :sourceDocument="sourceDocument" />
                    </q-card-section>
                  </q-card>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </div>
      </div>
      <!--  action section  -->
      <!-- <q-card-actions class="q-pa-md" id="source-collection-view-actions">
        <q-btn type="submit" color="primary" @click="$emit('decreaseStepper')">Back</q-btn>
        <q-space></q-space>

        <q-btn type="submit" color="primary" @click="storeSelectSources"
          :disable="!anyCheckedSentences">Continue</q-btn>
      </q-card-actions>-->
    </q-card>
  </div>
</template>

<script>
import SourceLoader from "../components/SourceLoader.vue";
import ListComponent from "../components/ListComponent.vue";

export default {
  components: {
    ListComponent,
    SourceLoader,
  },
  data: () => ({
    expandedSources: [],
    splitterModel: 20,
    tab: 0,
  }),
  computed: {
    sourceDocuments() {
      return this.$store.state.sourceDocuments;
    },
    anyCheckedSentences() {
      return this.sourceDocuments.length > 0;
    },
  },
  methods: {
    storeSelectSources: function () {
      // emit event to the parent component to update the stepper
      this.$emit("updateStepper");
    },
    abbreviateTitle: function (name) {
      return name === "General Data Protection Regulation" ? "GDPR" : name;
    }
  }
};
</script>

<style lang="css" scoped>
#source-collection-view {
  display: flex;
  flex-direction: row;
  justify-content: center;
  /* height: calc(100vh - 13 6px); */
  overflow: hidden;
}

#source-collection-card-content {
  /* height: calc(100vh - 136px - 78px - 88px - 48px - 24px); */
  height: calc(100vh - 136px - 78px - 88px - 48px - 20px);
  overflow-y: hidden;
  /* overflow: hidden; */
  z-index: 1 !important;
}

#source-collection-view-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  width: 100%;
  position: absolute;
  bottom: 0px;
  z-index: 3 !important;
  background: white;
}

.expansion-items {
  /* max-height: calc(100vh - 136px - 78px - 88px - 48px - 24px - 72px); */
  max-height: calc(100vh - 136px - 78px - 88px - 48px - 24px - 120px);
  /* height: calc(100vh - 136px - 78px - 88px - 48px - 24px - 72px); */
  overflow-y: auto;
}
</style>
