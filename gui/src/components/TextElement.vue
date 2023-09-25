<template>
    <!--
        displays recursively the content fields ('sentences') in a document.
        Hides itself if showFrameSource is true and this sentence is not part of the source of the
        frame that is currently being edited
    -->
    <template v-if="!isLeafElement || !showFrameSource || frameBeingEditedHasAnnotationsInThisSentence">
        <!-- show colored bar and textual content -->
        <div class="text-chunk">
            <div class="relation-bar" :class="{ 'has-relation': relationAnnotationsForSentence.length > 0 }"
                @click="relationBarClicked" />
            <div class="text-piece" v-if="isSentence" @mouseup="handleSelection" v-html="htmlText" ref="sentenceElement">

            </div>
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
            return this.textPiece.class == "src:LeafElement" //class in chopper output
        },
        //id of document that this textPiece is part of
        documentId() {
            return getDocumentForTextPiece(this.textPiece)['@id']
        },
        sentenceId() {
            return this.isSentence ? this.textPiece['id'] : null
        },
        annotations() {
            return this.$store.state.frames.map(f => f.annotations).flat()
        },
        annotationBeingEdited() {
            return this.$store.state.annotationBeingEdited
        },
        //snippets for this sentence, so we can color them to annotation type
        //only snippets of annotations of fact frames
        snippets() {
            if (this.isSentence) {
                //get each snippet of frame type fact that are in this sentence.
                //these will be highlighted in the sentence
                return this.annotations.filter(a => a.frame && a.frame.type.class == 'fact')
                    .map(a => a.snippets
                        .filter(s => s.sentence == this.textPiece))
                    .flat()
            } else {
                return []
            }
        },
        relationAnnotationsForSentence() {
            if (this.isSentence) {
                //get each snippet of frame type fact. these will be highlighted in the sentence
                return this.annotations.filter(a => (
                    a.frame &&
                    a.frame.type.class == 'relation' &&
                    a.snippets.some(s => s.sentence == this.textPiece)
                ))
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
            return snippetsOfFrame.some(s => (s.sentence == this.textPiece))
        },
        htmlText() {
            return getHtmlWithHighlights(this.textPiece.content, this.snippets)
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
                    snippet.annotation.positionOnScreen = [event.clientX, event.clientY]
                    this.$store.commit("setAnnotationBeingEdited", snippet.annotation)
                }
            } else {
                //no existing annotation at the clicked location
                const selection = window.getSelection()
                const range = getSelectedCharacterRange(this.$refs['sentenceElement'], selection)
                //if the user actually selected something (and not just clicked)
                if (range[0] != range[1]) {
                    console.log("textPiece", this.textPiece)
                    const snippet = new Snippet(
                        this.textPiece, //sentence object
                        range, //[start, end]
                        selection.toString() //selected text
                    )
                    //if there is an active annotation being edited, add snippet to that annotation
                    //else create new annotation and add snippet
                    if (this.annotationBeingEdited) {
                        this.annotationBeingEdited.addSnippet(snippet) //this also sets snippet.annotation
                    } else {
                        let annotation = new Annotation()
                        annotation.addSnippet(snippet) //this also sets snippet.annotation
                        annotation.positionOnScreen = [event.clientX, event.clientY]
                        this.$store.commit("setAnnotationBeingEdited", annotation)
                    }
                }

            }
        },
        relationBarClicked() {
            console.log("relationBarClicked", this.annotations)
            this.$store.commit("setAnnotationBeingEdited", this.relationAnnotationsForSentence[0])
        }
    },
    watch: {
        //add listeners to highlighted snippets in html
        //https://stackoverflow.com/questions/24775725/loop-through-childnodes
        htmlText() {
            //add this point, htmlText is not yet rendered, so childnodes is still one textnode
            //we need to wait for the next renderstep before adding mouseover events
            this.$nextTick(() => {
                if (this.$refs['sentenceElement']) {
                    const nodes = this.$refs['sentenceElement'].childNodes
                    for (let i = 0; i < nodes.length; i++) {
                        let node = nodes[i]
                        if (node.nodeName == "SPAN") {
                            node.onmouseover = () => { this.hoveredSnippetId = node.id }
                            node.onmouseout = () => { this.hoveredSnippetId = null }
                        }
                    }
                }
            })
        }
    }
}
</script>

<style lang="css" scoped>
.text-chunk {
    margin: 10px 0px;
    display: grid;
    grid-template-columns: 10px auto;
}

.relation-bar {
    width: 3px;
    margin-right: 2px;
    /* height: 100%; */
    display: inline-block;
    pointer-events: none;
}

.text-piece {
    display: inline-block;
}

.has-relation {
    background-color: #1976d2;
    cursor: pointer;
    pointer-events: all;
}
</style>