<template>
    <div class="fill-height scrollable q-pa-sm">
        <div v-for="sourceDoc in sourceDocuments">
            <div class="text-primary text-bold">{{ sourceDoc.title }}</div>
            <SentenceList
                :sentences="getSentencesForFrameInSourcedoc(sourceDoc)"
                :indent="false"
                :showSentenceButtons="true"
                @sentenceButtonClicked="scrollToSource"
            />
        </div>
    </div>
</template>
<script>
    import SentenceList from "../../components/SentenceList.vue";
export default {
    components: {
        SentenceList
    },
    computed: {
        frameBeingEdited() {
            return this.$store.state.frameBeingEdited;
        },
        sourceDocuments() {
            return this.$store.state.sourceDocuments;
        },
        //snippets that are part of the frame's annotations
        //TODO -> do we need this?
        snippetIdsInFrameSource() {
            const snippets = this.sentencesInFrameSource.map(sentence => sentence.snippets).flat()
            return snippets.filter(snippet => snippet.annotations
                .some(annotation => annotation.frame.id == this.frameBeingEdited.id))
                .map(snippet => snippet.id)
        }
    },
    methods: {
        //get sentences for selected frame (and all its subframes) from the given source doc
        getSentencesForFrameInSourcedoc(doc) {
            const frames = [this.frameBeingEdited, ...this.frameBeingEdited.allFrames]
            const uniqueSentencesSorted = frames.map(f => doc.getSentencesForFrame(f))
            .flat()
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort((s1,s2) => s1.id.localeCompare(s2.id))
            return uniqueSentencesSorted
        },
        //in source view, scroll to clicked sentence
        scrollToSource(sentence) {
            //show correct source
            this.$store.state.displayedSourceDocument = sentence.sourceDocument
            //scroll to sentence
            this.$store.state.sentenceToScrollTo = sentence
        },

    },
    watch: {
        frameBeingEdited() {
            console.log("frameBeingEdited", this.frameBeingEdited)
        }
    }
}
</script>

<style>
.highlighted {
    /* background-color: #eeeeee; */
    text-decoration: underline;
    font-weight: bold;
}

.scrollable {
  overflow-y: auto;
}

.fill-height {
  height: calc(100vh - 250px);
}
</style>