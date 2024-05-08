<template>
    <!-- show panel if snippet is selected and contains annotations -->
    <div id="annotation-list" v-if="selectedAnnotations.length > 0" :style="{
        left: `${clickedPosition[0] - 50}px`,
        top: `${clickedPosition[1]}px`,
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
                    <div @click="deleteAnnotation(annotation)">
                        Delete
                    </div>
                    <template v-if="annotation.frame">
                        <div @click="openFrameOfAnnotation(annotation)">
                            Open frame
                        </div>
                    </template>
                    <template v-else>
                        <div @click="addAnnotationToExistingFrame(annotation)">
                            Add to frame
                        </div>
                    </template>
                </div>
            </q-card-section>
            <!--
            <template v-if="annotation.addingToExistingFrame">
                <q-card-section>
                    <div class="message">Select existing frame</div>
                </q-card-section>
            </template>
<template v-else>
                <q-card-section>
                    <template v-if="annotation.frame">
                        <div class="label">Change type of fact frame</div>
                    </template>
<template v-else>
                        <div class="label">Create new frame</div>
                    </template>
<div>
    <q-btn v-for="frameType in frameTypes" class="q-mr-sm" :label="frameType.label"
        :color="(!annotation.frame || annotation.frame.type == frameType) ? colors[frameType.id] : 'grey-6'"
        @click="frameTypeButtonClicked(frameType)" />
</div>
</q-card-section>
<q-card-actions>
    <div class="label">Or</div>
    <template v-if="annotation.frame">
                        <q-btn @click="removeAnnotation" color="negative">Remove annotation</q-btn>
                    </template>
    <template v-else>
                        <q-btn @click="annotation.addingToExistingFrame = true" color="primary"
                            :disabled="frames.length == 0">
                            Add to existing frame
                        </q-btn>
                    </template>
</q-card-actions>
</template>-->

            <q-card-actions>
                <q-btn flat @click="cancelAnnotation">Cancel</q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script>
import { frameTypes } from '../model/frame.js'
import { colors } from '../helpers/config.js'
export default {
    data: () => ({
        frameTypes: frameTypes,
        colors: colors,
        maxLengthSourceShow: 100 //show max this nr of chars of an annotation source
    }),
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
        },
        addAnnotationToExistingFrame(annotation) {
            //TODO
        }
    },
}
</script>

<style lang="css" scoped>
#annotation-list {
    position: absolute;
    width: 440px;
}

.message {
    font-weight: bold;
}

.label {
    margin-right: 10px;
}

.label.bold {
    font-weight: bold;
}

.annotation-row {
    display: grid;
    grid-template-columns: auto max-content max-content;
    column-gap: 5px;
}
</style>