<template>
    <!--
        displays recursively the content fields ('sentences') in a document.
        Hides itself if showFrameSource is true and this sentence is not part of the source of the
        frame that is currently being edited
    -->
    <template v-if="!isLeafElement || !showFrameSource || frameBeingEditedHasAnnotationsInThisSentence">
        <div class="text-chunk" v-if="isSentence" @mouseup="handleSelection" v-html="htmlText" ref="sentenceElement">
        </div>
        <div v-for="child in textPiece.children">
            <TextElement :textPiece="child" />
        </div>
    </template>
</template>

<script>
import { getSelectedCharacterRange, getHtmlWithHighlights } from '../helpers/highlightText.js'
import { Annotation, Snippet } from "../model/annotation.js"
import { getDocumentForTextPiece } from '../helpers/document'

export default {
    props: {
        textPiece: Object
    },
    computed: {
        showFrameSource() {
            return this.$store.state.showFrameSource
        },
        isSentence() {
            return 'content' in this.textPiece
        },
        isLeafElement() {
            return this.textPiece.class == "src:LeafElement"
        },
        //id of document that this textPiece is part of
        documentId() {
            return getDocumentForTextPiece(this.textPiece)['@id']
        },
        sentenceId() {
            return this.isSentence ? this.textPiece['id'] : null
        },
        annotations() {
            return this.$store.state.annotations
        },
        annotationBeingEdited() {
            return this.$store.state.annotationBeingEdited
        },
        //snippets for this sentence, so we can color them to annotation type
        snippets() {
            if (this.isSentence) {
                //get each snippet together with its annotation
                return this.annotations
                    .map(a => a.snippets
                        .filter(s => s.documentId == this.documentId && s.sentenceId == this.textPiece.id))
                    //.map(s => ({ annotation: a, snippet: s })))
                    .flat()
            } else {
                return []
            }
        },
        frameBeingEditedHasAnnotationsInThisSentence() {
            const frameBeingEdited = this.$store.state.frameBeingEdited
            if (!frameBeingEdited) {
                return false
            }
            const snippetsOfFrame = frameBeingEdited.annotations.map(a => a.snippets).flat()
            return snippetsOfFrame.some(s => (s.sentenceId == this.sentenceId && s.documentId == this.documentId))
        },
        htmlText() {
            return getHtmlWithHighlights(this.textPiece.content, this.snippets)
        }
    },
    methods: {
        handleSelection(event) {
            console.log("handleSelection")
            const selection = window.getSelection()
            const range = getSelectedCharacterRange(this.$refs['sentenceElement'], selection)

            const snippet = new Snippet(
                this.documentId,
                this.sentenceId,
                range,
                selection.toString()
            )

            console.log("snippet", snippet)

            //if there is an active annotation being edited, add snippet to that annotation
            //create annotation or use existing one

            if (this.annotationBeingEdited) {
                this.annotationBeingEdited.addSnippet(snippet) //this also sets snippet.annotation
            } else {
                //see if there is an existing annotation containing this snippet.
                //go through all snippets in this sentence and find any at the clicked position
                console.log("this.snippets", this.snippets)
                const existingSnippet = this.snippets.find(
                    s => (s.characterRange[0] <= range[0]) && (s.characterRange[1] >= range[1])
                )
                //if there is a snippet at this location, use the associated annotation
                //else create a new annotation
                let annotation
                if (existingSnippet) {
                    annotation = existingSnippet.annotation
                } else {
                    annotation = new Annotation()
                    annotation.addSnippet(snippet) //this also sets snippet.annotation
                    annotation.positionOnScreen = [event.clientX, event.clientY]
                    this.$store.commit("addAnnotation", annotation)
                }
                this.$store.commit("setAnnotationBeingEdited", annotation)
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