<template>
  <div id="source-collection-view">
    <q-card flat bordered class="my-card q-ma-sm" style="width: 600px">
      <q-item>
        <q-item-section>
          <q-item-label>Source view</q-item-label>
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
                v-model="expanded[docIndex]"
                expand-icon-toggle
                switch-toggle-side
                expand-separator
                icon="mdi-book-search-outline"
                :caption="sourceDocument.title"
                default-opened
              >
                <q-card flat square class="q-ma-sm q-pa-sm">
                  <q-card-section class="q-pt-none scrollable">
                    <!-- show recursively all text leafs in the document tree -->
                    <TextElement :textPiece="sourceDocument" />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </q-card-section>
        </div>
      </div>
      <q-separator></q-separator>

      <q-card-actions class="q-pa-md" id="source-collection-view-actions">
        <q-btn
          type="submit"
          color="primary"
          @click="storeTaskData"
          :disable="validateForm"
          >Back</q-btn
        >
        <q-space></q-space>
        <q-btn
          type="submit"
          color="primary"
          @click="storeTaskData"
          :disable="validateForm"
          >Continue</q-btn
        >
        <!-- TODO: form validation and next step of process -->
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import TextElement from "../components/TextElement.vue";
import SourceLoader from "../components/SourceLoader.vue";
export default {
  components: {
    TextElement,
    SourceLoader,
  },
  data: () => ({
    expanded: [],
  }),
  computed: {
    reconstructedData() {
      return this.$store.getters.reconstructedData;
    },
    sourceDocuments() {
      return this.$store.state.sourceDocuments;
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
  height: 66vh;
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
