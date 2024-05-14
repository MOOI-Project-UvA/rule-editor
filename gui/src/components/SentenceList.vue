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
import { frameTypes } from "../model/frame";
export default {
    props: {
        sentences: Array
    },
    computed: {
        annotationBeingEdited() {
            return this.$store.state.annotationBeingEdited
        },
        frameBeingEdited() {
            return this.$store.state.frameBeingEdited
        },
        booleanConstructBeingEdited() {
            return this.$store.state.booleanConstructBeingEdited
        }
    },
    methods: {
        getStyleForUnderlining,
        getStyleForLineSpacing,
        handleSelection(event) {
            const selection = window.getSelection()
            if (selection.toString().length > 0) {
                //if no annotation is open, create a new one, else use the existing one that is open
                let annotation
                if (this.annotationBeingEdited) {
                    annotation = this.annotationBeingEdited
                } else {
                    annotation = new Annotation()
                    //if user is creating a frame for a role, create fact immediately, without
                    //showing the annotation panel
                    if (this.frameBeingEdited && this.frameBeingEdited.type.class == 'relation' &&
                        this.frameBeingEdited.activeField) {
                        console.log("this.frameBeingEdited.activeField", this.frameBeingEdited.activeField)
                        const factFrameType = frameTypes.find(t => t.id == "fact")
                        //if there is only one subtype allowed for this fact, assign that subtype to the frame
                        const subTypeId = this.frameBeingEdited.allowedSubTypesForActiveField.length == 1
                            ? this.frameBeingEdited.allowedSubTypesForActiveField[0] : null
                        const subType = subTypeId ? factFrameType.subTypes.find(t => t.id == subTypeId) : null
                        console.log("subType", subType, factFrameType)
                        //store reference to the currently being edited frame
                        const relationFrame = this.$store.state.frameBeingEdited
                        this.$store.commit("addNewFrame", {
                            frameType: factFrameType,
                            annotation: annotation,
                            subType: subType
                        })
                        relationFrame.addFrame(this.$store.state.frameBeingEdited)
                        this.frameBeingEdited.activeField = null
                    } else {
                        //no role is selected, or role is booleanconstruct (that requires annotation panel)
                        this.$store.state.annotationBeingEdited = annotation
                    }
                }
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
            console.log("this.sentences", this.sentences)
        },
    },
}
</script>

<style scoped>
.document {
    word-wrap: break-word;
}
</style>
