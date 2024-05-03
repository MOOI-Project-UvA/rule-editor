<template>
    <div @mouseup="handleSelection" class="text">
        <div class="sentence" :style="getStyleForLineSpacing(sentence)" v-for="sentence in sentences">
            <span class="snippet" :style="getStyleForUnderlining(snippet, sentence)"
                v-for="snippet in sentence.snippets" :snippet="snippet" :data-snippet-id="snippet.id"
                :data-sentence-id="sentence.id">
                {{ snippet.text }}
            </span>
        </div>
    </div>
</template>

<script>
import { getSelectionAsSnippets, splitAndReturnSelectedSnippets } from "../helpers/annotating.js"
import { getStyleForUnderlining, getStyleForLineSpacing } from "../helpers/underlining.js"
export default {
    data: () => ({
        sentences: [
            {
                id: 0,
                snippets: [
                    { id: 0, sentenceId: 0, text: "Afwachten van onderzoek naar de geschiktheid van de aspirant-adoptiefouders, bedoeld in artikel 11 van de Wet opneming buitenlandse kinderen ter adoptie.", annotations: [] }
                ]
            },
            {
                id: 1,
                snippets: [
                    { id: 0, sentenceId: 1, text: "Het verrichten van arbeid als geestelijk voorganger of godsdienstleraar.", annotations: [] }
                ]
            },
            {
                id: 2,
                snippets: [
                    { id: 0, sentenceId: 2, text: "Verblijf als stagiaire of practicant.", annotations: [] }
                ]
            }
        ],
        annotationNumber: 0
    }),
    methods: {
        getStyleForUnderlining,
        getStyleForLineSpacing,
        handleSelection() {
            const selection = window.getSelection()
            if (selection.toString().length > 0) {
                const annotation = {
                    id: 'annotation_' + this.annotationNumber
                }
                this.annotationNumber++
                //get selection in terms of start/end sentences, snippets, and offsets
                const selectionAsSnippets = getSelectionAsSnippets(selection, this.sentences)
                console.log("selectionAsSnippets", selectionAsSnippets)
                //split snippets and return those that correspond with the selection
                const selectedSnippets = splitAndReturnSelectedSnippets(
                    selectionAsSnippets,
                    this.sentences
                )
                selectedSnippets.forEach(s => s.annotations.push(annotation))
            }
        }
    }
}

</script>

<style scoped>
.highlight {
    background-color: aqua;
}

.snippet {
    display: inline;
}

.color {
    background-color: #dddddd;
}

.text {
    border: 1px solid #333333;
    width: 600px;
    word-wrap: break-word;
}

.sentence {
    margin-bottom: 0px;
}

.sentence-label {
    font-size: 9pt;
    font-weight: bold;
}

.snippet-info {
    display: grid;
    grid-template-columns: 160px 100px auto;
    gap: 5px;
    margin-left: 10px;
}

.annotation-info {
    margin-left: 60px;
}
</style>