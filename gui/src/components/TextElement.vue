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
                annotation.documentId = this.documentId
                annotation.sentenceId = this.textPiece.id
                annotation.characterRange = range
                annotation.annotatedText = selection.toString()
            } else {
                //check if there is an existing annotation at the selected range
                annotation = this.annotations.find(a => (a.characterRange[0] <= range[0]) && (a.characterRange[1] >= range[1]))
            }
            console.log("found existing annotation", annotation)
            //if there is no existing annotation, create a new one
            if (!annotation && (range[0] != range[1])) {
                //create new annotation
                annotation = new Annotation(
                    this.documentId,
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