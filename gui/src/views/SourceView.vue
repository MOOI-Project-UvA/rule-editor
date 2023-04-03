<template>
  <q-card flat class="my-card q-ma-sm">
    <!-- <div>
      <span @click="console.log('asdf')">test</span>
    </div> -->
    <q-card-section>
      <!-- <upload-decomposed-source></upload-decomposed-source> -->
      <SourceLoader />
    </q-card-section>
    <!-- controllers for the annotation part -->
    <!-- <q-card-section class="q-ml-md">
      <annotation-tools></annotation-tools>
    </q-card-section> -->
    <!-- the retrieved legal text will be shown here -->
    <div v-for="sourceDocument, docIndex in sourceDocuments">
      <q-card-section>
        <q-list bordered class="rounded-borders q-pa-md">
          <q-expansion-item v-model="expanded[docIndex]" expand-icon-toggle switch-toggle-side expand-separator
            icon="mdi-book-search-outline" :caption="sourceDocument.title" default-opened>
            <q-card flat square class="q-ma-sm q-pa-sm" style="max-height: 80vh">
              <q-card-section class="q-pt-none scrollable" style="max-height: 70vh">
                <TextElement :textPiece="sourceDocument" />
              </q-card-section>
            </q-card>

            <!-- <q-separator /> -->
            <!-- <q-card flat square class="q-ma-sm q-pa-sm" style="max-height: 80vh">
            <q-card-section class="q-pt-none">
              <annotation-component :document="reconstructedData">
              </annotation-component>
            </q-card-section>
          </q-card> -->
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import AnnotationComponent from "../components/AnnotationComponent.vue";
import AnnotationTools from "../components/AnnotationTools.vue";
// import UploadDecomposedSource from "../components/UploadDecomposedSource.vue";
import TextElement from "../components/TextElement.vue"
import SourceLoader from "../components/SourceLoader.vue"
export default {
  components: {
    AnnotationComponent,
    AnnotationTools,
    // UploadDecomposedSource,
    TextElement,
    SourceLoader
  },
  data: () => ({
    expanded: []
  }),
  computed: {
    reconstructedData() {
      return this.$store.getters.reconstructedData;
    },
    sourceDocuments() {
      return this.$store.state.sourceDocuments
    }
  },
  methods: {},
};
</script>

<style lang="css" scoped>
.scrollable {
  overflow-y: auto;
}
</style>
