<template>
    <!-- displays recursively the content fields ('sentences') mmmin a document -->
    <div class="text-chunk" v-if="isSentence" @mouseup="handleSelection" v-html="htmlText" ref="sentenceElement">
    </div>
    <div v-for="child in textPiece.children">
        <TextElement :textPiece="child" />
    </div>
</template>

<script>
import { getSelectedCharacterRange, getHtmlWithHighlights } from '../helpers/highlightText.js'
import { Annotation } from "../helpers/flint.js"
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
        //annotations for this sentence, so we know what to highlight
        annotations() {
            if (this.isSentence) {
                const factFrames = this.$store.state.frames.filter(f => f.type == "fact")
                const annotations = factFrames.map(f => f.annotation)
                return annotations.filter(a => a.documentId == this.documentId && a.sentenceId == this.textPiece.id)
            } else {
                return []
            }
        },
        htmlText() {
            return getHtmlWithHighlights(this.textPiece.content, this.annotations)
        }
    },
    methods: {
        handleSelection(event) {
            console.log("handleSelection")
            const selection = window.getSelection()
            const range = getSelectedCharacterRange(this.$refs['sentenceElement'], selection)
            console.log("range", range)
            console.log("annotations", this.annotations)
            //check if there is an existing annotation at the selected range
            let annotation = this.annotations.find(a => (a.characterRange[0] <= range[0]) && (a.characterRange[1] >= range[1]))
            if (!annotation) {
                //create new annotation
                annotation = new Annotation(
                    this.documentId,
                    this.textPiece.id, //sentence ID
                    range, //characterRange
                    selection.toString() //selected text
                )
            }
            annotation.positionOnScreen = [event.clientX, event.clientY]
            this.$store.commit("setAnnotationBeingEdited", annotation)
        },
        handleSelection2(event) {
            const selection = window.getSelection()
            console.log("selection", selection)
            const rangeStart = Math.min(selection.anchorOffset, selection.focusOffset)
            const rangeEnd = Math.max(selection.anchorOffset, selection.focusOffset)
            if (rangeEnd > rangeStart) {
                //correct for adding html tags in text. TODO: find out what is really going on here
                const annotationsBeforeCurrentOne = this.annotations.filter(a => a.characterRange[1] < rangeEnd)
                const positionOfLastAnnotation = annotationsBeforeCurrentOne.length == 0
                    ? 0
                    : max(annotationsBeforeCurrentOne.map(a => a.characterRange[1]))
                const characterRange = [rangeStart + positionOfLastAnnotation, rangeEnd + positionOfLastAnnotation]
                const annotation = new Annotation(
                    this.documentId,
                    this.textPiece.id, //sentence ID
                    characterRange, //characterRange
                    this.textPiece.content.substring(characterRange[0], characterRange[1]) //annotated text
                )
                console.log("adding annotation", annotation)
                annotation.positionOnScreen = [event.clientX, event.clientY]
                this.$store.commit("setAnnotationBeingEdited", annotation)
            } else {
                this.$store.commit("setAnnotationBeingEdited", null)
            }
        }
    }
}
</script>

<style lang="css" scoped>
.text-chunk {
    margin: 10px 0px;
}
</style>