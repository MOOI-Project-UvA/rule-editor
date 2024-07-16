<template>
  <q-card flat bordered class="q-ma-sm">
    <div class="row items-center q-pa-sm">
      <div class="col-1 text-bold">Sources</div>
      <div class="col">
        <q-btn class="q-mx-sm" v-for="doc in sourceDocuments" size="md" flat
          :color="doc.id == displayedSourceDocument?.id ? 'primary' : 'grey-5'" icon="mdi-book-search"
          @click="setDisplayedSourceDocument(doc)">
          {{ doc.title }}
        </q-btn>
      </div>

      <div class="col-1">
        <q-avatar class="float-right" size="lg">
          <q-icon name="mdi-information-outline" class="cursor-pointer"></q-icon>
          <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
            <div style="max-width: 300px">
              In this view, you are able to start the interpretation process by
              selecting text snippets and assigning one of the four supported
              labels: 1) Fact, 2) Act, and 3) Claim duty relation.
            </div>
          </q-tooltip>
        </q-avatar>
      </div>
    </div>
    <q-separator />

    <q-card-section class="q-pa-none">
      <template v-if="displayedSourceDocument && displayedSourceDocument.sentences.length > 0">
        <!-- show all sentences in document -->
        <div class="fill-height scrollable q-pa-md">
          <SentenceList :sentences="displayedSourceDocument.sentences.filter((s) => s.checked)" :showNLP="true" />
        </div>
      </template>
      <template v-else>
        <div>
          <p>
            You have not selected any sentences of this source for
            interpretation. Please, consider going back to step 2!
          </p>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script>
import SentenceList from "../components/SentenceList.vue";
export default {
  components: {
    SentenceList,
  },
  mounted() {
    //show by default the first document in the list of source documents
    this.$store.state.displayedSourceDocument =
      this.sourceDocuments.length > 0 ? this.sourceDocuments[0] : null;
  },
  computed: {
    sourceDocuments() {
      return this.$store.state.sourceDocuments;
    },
    displayedSourceDocument() {
      return this.$store.state.displayedSourceDocument;
    }
  },
  methods: {
    setDisplayedSourceDocument(document) {
      this.$store.state.displayedSourceDocument = document
    }
  },
  watch: {
    sourceDocuments() {
      this.$store.state.displayedSourceDocument = this.sourceDocuments.length > 0 ? this.sourceDocuments[0] : null
    }
  }
};
</script>

<style lang="css" scoped>
.scrollable {
  overflow-y: auto;
}

.fill-height {
  height: calc(100vh - 250px);
}

.snippet {
  display: inline;
}
</style>
