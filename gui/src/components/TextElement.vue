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
import { Annotation, Snippet } from "../model/annotation.js"
import { getDocumentForTextPiece } from '../helpers/document'

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
                        .filter(s => s.documentId == this.documentId && s.sentenceId == this.textPiece.id)
                        .map(s => ({ annotation: a, snippet: s })))
                    .flat()
            } else {
                return []
            }
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

            //if there is an active annotation being edited, add snippet to that annotation
            //create annotation or use existing one

            if (this.annotationBeingEdited) {
                this.annotationBeingEdited.addSnippet(snippet)
            } else {
                //see if there is an existing annotation containing this snippet
                //go through all snippets in this sentence and find any at the clicked position
                const existingSnippet = this.snippets.find(
                    h => (h.snippet.characterRange[0] <= range[0]) && (h.snippet.characterRange[1] >= range[1])
                )
                //if there is a snippet at this location, use the associated annotation
                //else create a new annotation
                let annotation
                if (existingSnippet) {
                    annotation = existingSnippet.annotation
                } else {
                    annotation = new Annotation()
                    annotation.addSnippet(snippet) //this should trigger re-rendering the sentence
                    annotation.positionOnScreen = [event.clientX, event.clientY]
                    this.$store.commit("addAnnotation", annotation)
                }
                this.$store.commit("setAnnotationBeingEdited", annotation)
            }

            //coupling of annotation to frame will is done in Annotation panel
            console.log("annotationBeingEdited", this.annotationBeingEdited)
        }
    },
    watch: {
        annotations() {
            console.log("annotations are updated")
        },
        snippets() {
            console.log("snippets are updated")
        },
        htmlText() {
            console.log("htmlText is updated", this.htmlText)
        }
    }
}
</script>

<style lang="css" scoped>
.text-chunk {
    margin: 10px 0px;
}
</style>