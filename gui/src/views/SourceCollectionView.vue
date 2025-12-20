<template>
  <template v-if="showVersionsSideBySide">
    <NewSourceVersionScreen :oldSource="oldSourceDocument" :newSource="newSourceDocument" @close="closeSideBySide"/>
  </template>
  <template v-else>
    <div id="source-collection-view">
      <q-card flat bordered class="my-card q-ma-sm" style="width: 1000px">
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
                        <q-btn size="sm" color="primary" class="q-mr-md"
                          @click="sourceDocument.sentenceTree.selected = true">Select all</q-btn>
                        <q-btn size="sm" color="negative" class="q-mr-md" @click="sourceDocument.sentenceTree.selected = false">Deselect
                          all</q-btn>
                          <q-btn size="sm" icon="mdi-close" @click="$store.state.sourceDocuments.splice(docIndex,1)">Remove from interpretation</q-btn>
                          <q-btn size="sm" class="float-right" icon="mdi-content-copy" @click="showNewVersion(sourceDocument)">New version</q-btn>
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
      </q-card>
    </div>
  </template>
</template>

<script>
import SourceLoader from "../components/SourceLoader.vue";
import ListComponent from "../components/ListComponent.vue";
import { SourceDocument } from "../model/sourceDocument";
import NewSourceVersionScreen from "../components/NewSourceVersionScreen.vue";

export default {
  components: {
    NewSourceVersionScreen,
    ListComponent,
    SourceLoader,
  },
  data: () => ({
    expandedSources: [],
    splitterModel: 20,
    tab: 0,
    oldSourceDocument: null,
    newSourceDocument: null,
    showVersionsSideBySide: false
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
    },
    showNewVersion(sourceDocument) {
      this.oldSourceDocument = sourceDocument
      //check if a new version has already be created. if so show that one, if not, create a new document
      let newDoc = this.sourceDocuments.find(d => d.isUpdateOf && d.isUpdateOf == sourceDocument.id)
      if (!newDoc) {
        newDoc = new SourceDocument(sourceDocument.jsonLd, sourceDocument.id)
        //update title, for now: add '_new'
        newDoc.title += "_new"
        this.$store.state.sourceDocuments.push(newDoc)
      }
      this.newSourceDocument = newDoc
      this.showVersionsSideBySide = true //show old and new side by side
    },
    closeSideBySide() {
      this.showVersionsSideBySide = false
      this.newSourceDocument = null
      this.oldSourceDocument = null
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
