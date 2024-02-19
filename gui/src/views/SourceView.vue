<template>
  <q-card flat bordered class="q-ma-sm full-height">


    <div class="row items-center q-pa-sm">
      <div class="col-1 text-bold">Sources</div>
      <div class="col">
        <q-btn class="q-mx-sm" v-for="doc in sourceDocuments" size="md" flat
          :color="doc.id == displayedSource?.id ? 'primary' : 'grey-5'" icon="mdi-book-search"
          @click="displayedSource = doc">
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

    <q-card-section class="q-pt-none">
      <template v-if="displayedSource && displayedSource.sentences.some((e) => e.checked)">
        <!-- show recursively all text leafs in the document tree -->
        <div class="flex full-height scrollable">
          <!-- <TextElement :textPiece="displayedSource" /> -->
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
import TextElement from "../components/TextElement.vue";

export default {
  components: {
    TextElement,
  },
  data: () => ({
    expanded: [],
    displayedSource: null
  }),
  mounted() {
    this.displayedSource = this.sourceDocuments.length > 0 ? this.sourceDocuments[0] : null
  },
  computed: {
    reconstructedData() {
      return this.$store.getters.reconstructedData;
    },
    sourceDocuments() {
      let docs = [...this.$store.state.sourceDocuments]
      //sort alphabetically on title
      docs.sort((d1, d2) => d1.title.localeCompare(d2.title))
      return docs
    },
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited
    },
  },
  watch: {
    sourceDocuments() {
      console.log("sourceDocs changed")
      this.displayedSource = this.sourceDocuments.length > 0 ? this.sourceDocuments[0] : null
    }
  }
};
</script>

<style lang="css" scoped>
.scrollable {
  overflow-y: auto;
}
</style>
