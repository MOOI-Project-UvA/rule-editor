<template>
    <div class="fill-height scrollable q-pa-sm">
        <div v-for="sourceDoc in sourceDocuments">
            <div class="text-primary text-bold">{{ sourceDoc.title }}</div>
            <SentenceList
                :sentences="sourceDoc.getSentencesForFrame(frameBeingEdited)"
                :indent="false"
                :showSentenceButtons="true"
                :isSourceOfSelectedFrame="true"
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