<template>
    <div id="annotationPanel" v-if="annotation" :style="{
        left: annotation.positionOnScreen[0] + 'px',
        top: annotation.positionOnScreen[1] + 'px',
    }">
        <q-card bordered>
            <q-card-section>
                <div>
                    {{ annotation.sourceText }}
                </div>
            </q-card-section>



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
                    <div class="label bold">Fact</div>
                    <q-btn-group>
                        <q-btn v-for="frameType in frameTypes.filter(t => t.class == 'fact')" :label="frameType.label"
                            :color="(!annotation.frame || annotation.frame.type == frameType) ? colors[frameType.id] : 'grey-6'"
                            @click="frameTypeButtonClicked(frameType)" />
                    </q-btn-group>
                    <div class="label bold">Relation</div>
                    <q-btn-group>
                        <q-btn v-for="frameType in frameTypes.filter(t => t.class == 'relation')" :label="frameType.label"
                            :color="(!annotation.frame || annotation.frame.type == frameType) ? colors[frameType.id] : 'grey-6'"
                            @click="frameTypeButtonClicked(frameType)" />
                    </q-btn-group>
                </q-card-section>
                <q-card-actions>
                    <div class="label">Or</div>
                    <template v-if="annotation.frame">
                        <q-btn @click="removeAnnotation" color="negative">Remove annotation</q-btn>
                    </template>
                    <template v-else>
                        <q-btn @click="annotation.addingToExistingFrame = true" color="primary"
                            :disabled="frames.length == 0">
                            Add to existing fact
                        </q-btn>
                    </template>
                </q-card-actions>
            </template>

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
        colors: colors
    }),
    computed: {
        annotation() {
            return this.$store.state.annotationBeingEdited
        },
        frames() {
            return this.$store.state.frames
        }
    },
    methods: {
        frameTypeButtonClicked(frameType) {
            if (!this.annotation.frame) {
                //there is no frame attached to this.
                //create new frame and add annotation to it
                this.$store.commit("addNewFrame", { frameType: frameType, annotation: this.annotation })
                this.annotation.addSimilarAnnotationsToFrame(this.$store.state.sourceDocuments)
            } else {
                //there is a frame attached to this, change it type according to the selected type
                this.annotation.frame.type = frameType
            }
            this.$store.commit("setAnnotationBeingEdited", null)
        },
        cancelAnnotation() {
            //remmove annotation if it is not connected to a frame
            if (!this.annotation.frame) {
                this.$store.commit("removeAnnotation", this.annotation)
            }
            this.$store.commit("setAnnotationBeingEdited", null)
        },
        removeAnnotation() {
            //this is only called if annotation has a frame.
            //remove the annotaiton from the frame, and from the store
            this.annotation.frame.removeAnnotation(this.annotation)
            this.$store.commit("removeAnnotation", this.annotation)
            this.$store.commit("setAnnotationBeingEdited", null)
        }
    },
}
</script>

<style lang="css" scoped>
#annotationPanel {
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
</style>