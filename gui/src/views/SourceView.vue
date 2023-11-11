<template>
  <q-card flat bordered class="my-card q-ma-sm">
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
              In this view, you are able to start the interpretation process by
              selecting text snippets and assigning one of the four supported
              labels: 1) Fact, 2) Act, and 3) Claim duty relation.
            </div>
          </q-tooltip>
        </q-avatar>
      </q-item-section>
    </q-item>
    <q-separator />

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
              <q-card-section
                class="q-pt-none scrollable"
                style="max-height: 60vh"
              >
                <!-- show recursively all text leafs in the document tree -->
                <TextElement
                  v-if="sourceDocument.sentences.some((e) => e.checked)"
                  :textPiece="sourceDocument"
                />
                <div v-else>
                  <p>
                    You have not selected any sentences of this source for
                    interpretation. Please, consider going back to step 2!
                  </p>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import TextElement from "../components/TextElement.vue";

export default {
  components: {
    TextElement,
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
.scrollable {
  overflow-y: auto;
}
</style>
