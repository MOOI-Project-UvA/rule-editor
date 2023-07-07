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
                <q-card-actions>
                    <template v-if="annotation.frame">
                        <div class="label">Change frame type</div>
                    </template>
                    <template v-else>
                        <div class="label">Create new frame</div>
                    </template>
                    <q-btn-group>
                        <q-btn v-for="tag in tags" :label="tag.label"
                            :color="(!annotation.frame || annotation.frame.type == tag.value) ? colors[tag.value] : 'grey-6'"
                            @click="frameTypeButtonClicked(tag.value)" />
                    </q-btn-group>
                </q-card-actions>
                <q-card-actions>
                    <div class="label">Or</div>
                    <template v-if="annotation.frame">
                        <q-btn @click="removeAnnotation" color="negative">Remove annotation</q-btn>
                    </template>
                    <template v-else>
                        <q-btn @click="annotation.addingToExistingFrame = true" color="primary">
                            Add to existing frame
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
import { colors } from '../helpers/config.js'
export default {
    data: () => ({
        tags: [
            { label: "Agent", value: "agent" },
            { label: "Action", value: "action" },
            { label: "Other", value: "other" },
            { label: "Act", value: "act" },
            { label: "Duty", value: "duty" }
        ],
        colors: colors
    }),
    computed: {
        annotation() {
            return this.$store.state.annotationBeingEdited
        }
    },
    methods: {
        frameTypeButtonClicked(frameType) {
            if (!this.annotation.frame) {
                //there is no frame attached to this 
                this.$store.commit("addNewFrame", { frameType: frameType, annotation: this.annotation })
                //this.annotation.addSimilarAnnotationsToFrame()
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
            this.annotation.frame.removeAnnotation(this.annotation)
            if (this.annotation.frame.annotations.length == 0) {
                this.$store.commit("removeFrame", this.annotation.frame)
            }
            this.$store.commit("removeAnnotation", this.annotation)
            this.$store.commit("setAnnotationBeingEdited", null)
        }
    },
}
</script>

<style lang="css" scoped>
#annotationPanel {
    position: absolute;
    width: 400px;
}

.message {
    font-weight: bold;
}

.label {
    margin-right: 10px;
}
</style>