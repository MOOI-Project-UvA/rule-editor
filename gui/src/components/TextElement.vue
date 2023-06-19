<template>
    <!-- displays recursively the content fields ('sentences') mmmin a document -->
    <div class="text-chunk" v-if="isSentence" @mouseup="handleSelection" v-html="htmlText" ref="sentenceElement">
    </div>
    <!-- <div class="text-chunk" v-if="isSentence" v-html="htmlText" ref="sentenceElement">
    </div> -->
    <div v-for="child in textPiece.children">
        <TextElement :textPiece="child" />
    </div>
</template>

<script>
import { getSelectedCharacterRange, getHtmlWithHighlights } from '../helpers/highlightText.js'
import { Annotation } from "../model/annotation.js"
import { getDocumentForTextPiece } from '../helpers/document'
import { max } from 'd3-array'
export default {
    props: {
        textPiece: Object
    },
    computed: {
        isSentence() {
            return 'content' in this.textPiece
        },
        //id of document that this textPiece is part of
        documentId() {
            return getDocumentForTextPiece(this.textPiece)['@id']
        },
        //highlights for this sentence, so we can color the snippets according to annotation type
        highlights() {
            if (this.isSentence) {
                const factFrames = this.$store.state.frames.filter(f => f.type == "fact")
                const annotations = factFrames.map(f => f.annotation)
                //get each snippet together with its annotation
                return annotations
                    .map(a => a.snippets
                        .filter(s => s.documentId == this.documentId && s.sentenceId == this.textPiece.id)
                        .map(s => ({ annotation: a, snippet: s })))
                    .flat()
            } else {
                return []
            }
        },
        htmlText() {
            return getHtmlWithHighlights(this.textPiece.content, this.highlights)
        },
        frameBeingEdited() {
            return this.$store.state.frameBeingEdited
        }
    },
    methods: {
        handleSelection(event) {
            console.log("handleSelection")
            console.log("frameBeingEdited", this.frameBeingEdited)
            const selection = window.getSelection()
            const range = getSelectedCharacterRange(this.$refs['sentenceElement'], selection)
            let annotation = null
            //if there is a frame being edited, use the (empty) annotation of that frame
            if (this.frameBeingEdited) {
                console.log("frame being edited", this.frameBeingEdited)
                annotation = this.frameBeingEdited.annotation
                //if the annotation has no snippet yet, add the selected one
                if (this.frameBeingEdited.sourceText.length == 0) {
                    annotation.addSnippet(this.documentId, this.textPiece.id, range, selection.toString())
                }

            } else {
                //check if there is an existing annotation at the selected range
                const highlight = this.highlights.find(h => (h.snippet.characterRange[0] <= range[0]) && (h.snippet.characterRange[1] >= range[1]))
                annotation = highlight ? highlight.annotation : null
            }
            console.log("found existing annotation", annotation)
            //if there is no existing annotation, create a new one
            if (!annotation && (range[0] != range[1])) {
                //create new annotation
                annotation = new Annotation()
                annotation.addSnippet(this.documentId,
                    this.textPiece.id, //sentence ID
                    range, //characterRange
                    selection.toString() //selected text
                )
            }
            if (annotation) {
                annotation.positionOnScreen = [event.clientX, event.clientY]
                this.$store.commit("setAnnotationBeingEdited", annotation)
            }
        },
        clicked(tag) {
            console.log("clicked", tag)
        }
    }
}
</script>

<style lang="css" scoped>
.text-chunk {
    margin: 10px 0px;
}
</style>