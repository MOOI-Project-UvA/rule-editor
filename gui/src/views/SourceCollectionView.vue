<template>
  <!-- This component contains the content of the source collection view -->
  <div id="source-collection-view">
    <q-card flat bordered class="my-card q-ma-sm" style="width: 600px">
      <!-- header -->
      <q-item class="q-ma-sm">
        <q-item-section avatar>
          <q-avatar icon="mdi-bookmark-box-multiple-outline" rounded size="xl">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>Collect sources</q-item-label>
          <q-item-label caption>Step 2</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-avatar>
            <q-icon
              name="mdi-information-outline"
              class="cursor-pointer"
            ></q-icon>
            <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
              <div style="max-width: 300px">
                In this view, you can select legal sources from the repository.
                After selection, a legal source is reconstructed and you are
                able to start the interpretation process by selected text
                snippets and assigning one of the four supported labels: 1)
                Agent, 2) Action, 3) Object, 4) Conditions.
              </div>
            </q-tooltip>
          </q-avatar>
        </q-item-section>
      </q-item>
      <q-separator />
      <!--  main content of the card-->
      <q-card-section>
        <SourceLoader />
      </q-card-section>
      <div id="source-collection-card-content">
        <!-- the retrieved legal text will be shown here -->
        <div v-for="(sourceDocument, docIndex) in sourceDocuments">
          <q-card-section>
            <q-list bordered class="rounded-borders q-pa-md">
              <q-expansion-item
                v-model="expandedSources[docIndex]"
                expand-icon-toggle
                switch-toggle-side
                expand-separator
                icon="mdi-book-search-outline"
                :caption="sourceDocument.title"
                default-opened
              >
                <q-card
                  flat
                  square
                  class="q-ma-sm q-pa-sm expansion-items"
                  :style="`max-height: calc(100vh - 136px - 78px - 88px - 48px - 24px - 72px - (${
                    docIndex + 1
                  } * 120px));`"
                >
                  <q-card-section class="q-pt-none">
                    <!-- show recursively all text leafs in the document tree -->
                    <ListComponent
                      :textPiece="sourceDocument.sentences"
                      :docId="docIndex"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </q-card-section>
        </div>
      </div>
      <!--  action section  -->
      <q-card-actions class="q-pa-md" id="source-collection-view-actions">
        <q-btn type="submit" color="primary" @click="$emit('decreaseStepper')"
          >Back</q-btn
        >
        <q-space></q-space>

        <q-btn
          type="submit"
          color="primary"
          @click="storeSelectSources"
          :disable="!anyCheckedSentences"
          >Continue</q-btn
        >
      </q-card-actions>
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
  }),
  computed: {
    sourceDocuments() {
      return this.$store.state.sourceDocuments;
    },
    anyCheckedSentences() {
      return this.sourceDocuments.length > 0
        ? this.sourceDocuments
            .map((d) => d.sentences.some((e) => e.checked))
            .every((e) => e)
        : false;
    },
  },
  methods: {
    storeSelectSources: function () {
      console.log(
        "storing selected sources!",
        this.sourceDocuments,
        this.expandedSources,
        this.activeDocIndex,
        // this.sourceDocuments[this.activeDocIndex].selectedSentences,
      );
      // emit event to the parent component to update the stepper
      this.$emit("updateStepper");
    },
  },
  watch: {
    sourceDocuments() {
      console.log(
        "sourceDocuments",
        this.sourceDocuments
          .map((d) => d.sentences)
          .filter((d) => {
            return d.some((e) => e.checked);
          }),
      );
    },
  },
};
</script>

<style lang="css" scoped>
#source-collection-view {
  display: flex;
  flex-direction: row;
  justify-content: center;
  //height: calc(100vh - 13 6px);
  overflow: hidden;
}

#source-collection-card-content {
  //height: calc(100vh - 136px - 78px - 88px - 48px - 24px);
  height: calc(100vh - 136px - 78px - 88px - 48px - 24px);
  //overflow-y: auto;
  overflow: hidden;
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
  //max-height: calc(100vh - 136px - 78px - 88px - 48px - 24px - 72px);
  overflow-y: auto;
}
</style>
