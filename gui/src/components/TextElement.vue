<template>
    <!--
        displays recursively the content fields ('sentences') in a document.
        Hides itself if showFrameSource is true and this sentence is not part of the source of the
        frame that is currently being edited
    -->
    <template v-if="!isLeafElement || !showFrameSource || frameBeingEditedHasAnnotationsInThisSentence">
        <div class="text-chunk" v-if="isSentence" @mouseup="handleSelection" v-html="htmlText" ref="sentenceElement">
        </div>
        <!-- <div class="text-chunk" v-if="isSentence" v-html="htmlText" ref="sentenceElement">
        </div> -->
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
    data: () => ({
        hoveredSnippetId: null
    }),
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
            return getHtmlWithHighlights(this.textPiece.content, this.snippets, this.sentenceId)
        }
    },
    methods: {
        handleSelection(event) {
            console.log("handleSelection")
            //check if there is an annotation at the clicked location
            if (this.hoveredSnippetId) {
                //if there is no annotation being edited, show the annotation associated with the clicked snippet
                //else do nothing
                if (!this.annotationBeingEdited) {
                    const snippet = this.snippets.find(s => s.id == this.hoveredSnippetId)
                    this.$store.commit("setAnnotationBeingEdited", snippet.annotation)
                }
            } else {
                //no existing annotation at the clicked location
                const selection = window.getSelection()
                const range = getSelectedCharacterRange(this.$refs['sentenceElement'], selection)

                const snippet = new Snippet(
                    this.documentId,
                    this.sentenceId,
                    range,
                    selection.toString()
                )
                //if there is an active annotation being edited, add snippet to that annotation
                //else create new annotation and add snippet
                if (this.annotationBeingEdited) {
                    this.annotationBeingEdited.addSnippet(snippet) //this also sets snippet.annotation
                } else {
                    let annotation = new Annotation()
                    annotation.addSnippet(snippet) //this also sets snippet.annotation
                    annotation.positionOnScreen = [event.clientX, event.clientY]
                    this.$store.commit("addAnnotation", annotation)
                    this.$store.commit("setAnnotationBeingEdited", annotation)
                }
            }
        }
    },
    watch: {
        //add listeners to highlighted snippets in html
        //https://stackoverflow.com/questions/24775725/loop-through-childnodes
        htmlText() {
            //add this point, htmlText is not yet rendered, so childnodes is still one textnode
            //we need to wait for the next renderstep before adding mouseover events
            this.$nextTick(() => {
                const nodes = this.$refs['sentenceElement'].childNodes
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i]
                    if (node.nodeName == "SPAN") {
                        node.onmouseover = () => { this.hoveredSnippetId = node.id }
                        node.onmouseout = () => { this.hoveredSnippetId = null }
                    }
                }
            })
        },
        hoveredSnippetId() {
            console.log(this.hoveredSnippetId)
        }
    }
}
</script>

<style lang="css" scoped>
.text-chunk {
    margin: 10px 0px;
}
</style>