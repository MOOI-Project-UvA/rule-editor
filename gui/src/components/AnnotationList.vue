<template>
    <!-- show panel if snippet is selected and contains annotations -->
    <!-- <div id="annotation-list" v-if="selectedSnippet" :style="{
        left: `${clickedPosition[0] - 50}px`,
        top: `${clickedPosition[1]}px`,
    }"> -->
    <div id="annotation-list" v-if="selectedSnippet && selectedSnippet.annotations.length > 0" :style="{
        left: `10px`,
        bottom: `10px`,
    }">
        <q-card bordered>
            <q-card-section>
                <!-- list all annotations associated with this snippet -->
                <div class="annotation-row" v-for="annotation in selectedAnnotations">
                    <div class="ellipsis" style="max-width: 200px;">
                        {{ getAnnotationSource(annotation) }}
                        <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
                            <div style="max-width: 300px">
                                {{ getAnnotationSource(annotation) }}
                            </div>
                        </q-tooltip>
                    </div>
                    <q-btn color="negative" flat @click="deleteAnnotation(annotation)">Delete</q-btn>
                    <template v-if="annotation.frame">
                        <q-btn flat @click="openFrameOfAnnotation(annotation)">Open frame</q-btn>
                    </template>
                    <template v-else>
                        <q-btn flat @click="addAnnotationToExistingFrame(annotation)">Add to frame</q-btn>
                    </template>
                </div>
            </q-card-section>
            <q-card-actions>
                <q-btn flat @click="cancelAnnotation">Cancel</q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script>
export default {
    computed: {
        selectedSnippet() {
            return this.$store.state.selectedSnippet
        },
        selectedAnnotations() {
            return this.selectedSnippet
                ? this.selectedSnippet.annotations
                : []
        },
        selectedSourceDocument() {
            return this.selectedSnippet
                ? this.selectedSnippet.sentence.sourceDocument
                : null
        },
        clickedPosition() {
            return this.$store.state.clickedPosition
        },
        framesOpenInEditor() {
            return this.$store.state.framesOpenInEditor
        },

    },
    methods: {
        cancelAnnotation() {
            this.$store.state.selectedSnippet = null
        },
        deleteAnnotation(annotation) {
            //remove the annotaiton from the frame, and from the snippets
            this.selectedSourceDocument.deleteAnnotation(annotation)
            if (this.selectedAnnotations.length == 0) {
                this.$store.state.selectedSnippet = null
            }
        },
        getSnippets(annotation) {
            return this.selectedSourceDocument ? this.selectedSourceDocument.getSnippetsForAnnotation(annotation) : []
        },
        getAnnotationSource(annotation) {
            return this.getSnippets(annotation).map(s => s.text).join("")
        },
        openFrameOfAnnotation(annotation) {
            //if annotation's frame is not yet in the list of frames being edited, add it
            if (!(this.framesOpenInEditor.some(f => f.id == annotation.frame.id))) {
                this.$store.state.framesOpenInEditor = [...this.$store.state.framesOpenInEditor, annotation.frame]
            }
            this.$store.state.frameBeingEdited = annotation.frame
            //close annotation list panel
            this.$store.state.selectedSnippet = null
        },
        addAnnotationToExistingFrame(annotation) {
            this.$store.state.annotationToBeAddedToExistingFrame = annotation
            this.$store.state.addingAnnotationToExistingFrame = true
            //close annotation list panel
            this.$store.state.selectedSnippet = null
        }
    },
}
</script>

<style lang="css" scoped>
#annotation-list {
    position: absolute;
    width: 440px;
}

.annotation-row {
    display: grid;
    grid-template-columns: auto max-content max-content;
    column-gap: 5px;
    align-items: center;
}
</style>