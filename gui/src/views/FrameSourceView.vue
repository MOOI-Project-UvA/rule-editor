<template>
  <div class="source-list-container">
    <q-card v-for="source in frame.sources"  class="my-card q-ma-sm">
      <q-card-section>
        <div class="text-subtitle1">{{source.document.title}}</div>
        <div class="text-subtitle2">{{source.document.docID}}</div>
      </q-card-section>
      <q-card-section>
        <div v-html="getHtmlTextSnippet(source)" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    frame: Object
  },
  mounted() {
    console.log("frame", this.frame)
    console.log("sources", this.frame.sources)
  },
  methods: {
    getHtmlTextSnippet(source) {
      const selector = source.target.selector.find(s => s.type == 'TextPositionSelector')
      const text = source.document.text
      const snippet =
        text.substring(selector.start-100, selector.start) +
        "<span class='highlight'>" +
        text.substring(selector.start, selector.end) +
        "</span>" +
        text.substring(selector.end, selector.end + 100)
      console.log("snippet", snippet)
      return snippet
    }
  }

}
</script>

<style lang="css" scoped>
  .highlight {
    background-color: #557766;
  }
</style>
