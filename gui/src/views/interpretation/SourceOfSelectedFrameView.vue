<template>
    <div class="fill-height scrollable q-pa-sm">
        <div v-for="sourceDoc in sourceDocuments">
            <div class="text-primary text-bold">{{ sourceDoc.title }}</div>
            <div v-for="sentence in sourceDoc.getSentencesForFrame(frameBeingEdited)" @click="scrollToSource(sentence)">
                <span v-for="snippet in sentence.snippets" :class="{ highlighted: snippetIdsInFrameSource.includes(snippet.id) }">
                    {{ snippet.text }}
                </span>
            </div>
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
        //sentences part of which is annotated for this frame
        sentencesInFrameSource() {
            return this.sourceDocuments.map(doc => doc.getSentencesForFrame(this.frameBeingEdited)).flat()
        },
        //snippets that are part of the frame's annotations
        snippetIdsInFrameSource() {
            const snippets = this.sentencesInFrameSource.map(sentence => sentence.snippets).flat()
            return snippets.filter(snippet => snippet.annotations
                .some(annotation => annotation.frame.id == this.frameBeingEdited.id))
                .map(snippet => snippet.id)
        }
    },
    methods: {
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