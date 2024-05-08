<template>
    <div class="document" @mouseup="handleSelection">
        <div class="q-mb-sm" :style="getStyleForLineSpacing(sentence)" v-for="sentence in sentences">
            <span class="snippet" :style="getStyleForUnderlining(snippet, sentence)"
                v-for="snippet in sentence.snippets" :data-snippet-id="snippet.id" :data-sentence-id="sentence.id">
                {{ snippet.text }}
            </span>
        </div>
    </div>
</template>

<script>
import { getSelectionAsSnippets, splitAndReturnSelectedSnippets } from "../helpers/annotating.js"
import { getStyleForUnderlining, getStyleForLineSpacing } from "../helpers/underlining.js"
import { Annotation } from "../model/annotation";
export default {
    props: {
        sentences: Array
    },
    methods: {
        getStyleForUnderlining,
        getStyleForLineSpacing,
        handleSelection(event) {
            const selection = window.getSelection()
            if (selection.toString().length > 0) {
                let annotation = new Annotation();
                this.$store.state.annotationBeingEdited = annotation
                //get selection in terms of start/end sentences, snippets, and offsets
                const selectionAsSnippets = getSelectionAsSnippets(selection, this.sentences)
                //split snippets and return those that correspond with the selection
                const selectedSnippets = splitAndReturnSelectedSnippets(
                    selectionAsSnippets,
                    this.sentences
                )
                selectedSnippets.forEach(s => {
                    s.addAnnotation(annotation)
                })

            } else {
                const clickedSentence = this.sentences.find(s => s.id == selection.anchorNode.parentNode.dataset.sentenceId)
                const clickedSnippet = clickedSentence.snippets.find(s => s.id == selection.anchorNode.parentNode.dataset.snippetId)
                this.$store.state.selectedSnippet = clickedSnippet
            }
            this.$store.state.clickedPosition = [event.clientX, event.clientY]
        },
    },
}
</script>

<style scoped>
.document {
    word-wrap: break-word;
}
</style>
