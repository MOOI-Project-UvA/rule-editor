<template>
  <div id="source-collection-view">
    <q-card flat bordered class="my-card q-ma-sm" style="width: 600px">
      <q-item class="q-ma-sm">
        <q-item-section avatar>
          <q-avatar icon="mdi-bookmark-box-multiple-outline" rounded size="xl">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>Collect sources {{ activeSource }}</q-item-label>
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
                <!--                {{ (activeDocIndex = docIndex) }}-->
                <q-card flat square class="q-ma-sm q-pa-sm">
                  <q-card-section class="q-pt-none scrollable">
                    <!-- show recursively all text leafs in the document tree -->
                    <ListComponent :textPiece="sourceDocument.sentences" />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </q-card-section>
        </div>
      </div>
      <q-separator></q-separator>

      <q-card-actions class="q-pa-md" id="source-collection-view-actions">
        <q-btn type="submit" color="primary" @click="$emit('decreaseStepper')"
          >Back</q-btn
        >
        <q-space></q-space>
        <q-btn type="submit" color="primary" @click="storeSelectSources"
          >Continue</q-btn
        >
        <!-- TODO: add events to continue and back buttons. Validation is needed as well (at least one selected sentence) -->
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
    activeSource() {
      console.log("this.expandedSources", this.expandedSources);
      return this.expandedSources;
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
      // TODO: updated the selected sentences based on the checkedsentences
      // emit event to the parent component to update the stepper
      this.$emit("updateStepper");
    },
  },
  watch: {
    sourceDocuments() {
      console.log("sourceDocuments", this.sourceDocuments);
    },
  },
};
</script>

<style lang="css" scoped>
#source-collection-view {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  height: 85vh;
  overflow: hidden;
}

#source-collection-card-content {
  height: 64vh;
  overflow-y: auto;
}

#source-collection-view-actions {
  width: 100%;
  position: absolute;
  bottom: 0px;
}

.scrollable {
  height: 100%;
}
</style>
