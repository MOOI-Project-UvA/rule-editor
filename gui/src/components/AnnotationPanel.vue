<template>
    <div id="annotationPanel" v-if="annotation" :style="{
        left: annotation.positionOnScreen[0] + 'px',
        top: annotation.positionOnScreen[1] + 'px',
    }">
        <q-card bordered>
            <template v-if="selectingFrameForAnnotation">
                Select existing frame
            </template>
            <template v-else>
                <q-card-section>
                    <div v-for="snippet in annotation.snippets">
                        {{ snippet.text }}
                    </div>
                </q-card-section>
                <q-card-actions>
                    <div class="q-gutter-sm">
                        <q-radio dense v-model="creatingNewFrame" :val="true" label="New frame" />
                        <q-radio dense v-model="creatingNewFrame" :val="false" label="Existing frame" />
                    </div>
                </q-card-actions>
                <q-card-actions>
                    <q-btn-group>
                        <q-btn v-for="tag in tags" :label="tag.label"
                            :color="tag.value == selectedTag ? colors[tag.value] : 'grey-6'"
                            @click="selectedTag = tag.value" />
                    </q-btn-group>
                </q-card-actions>
                <q-card-actions>
                    <q-btn color="primary" @click="saveAnnotation" :disabled="!selectedTag">Save</q-btn>
                    <q-btn flat @click="cancelAnnotation">Cancel</q-btn>
                </q-card-actions>
            </template>
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
            { label: "Other", value: "other" }
        ],
        selectedTag: null,
        colors: colors,
        creatingNewFrame: true,
        selectingFrameForAnnotation: false
    }),
    mounted() {
        console.log("***mounted")
        //this.selectedTag = this.annotation.tag
    },
    computed: {
        annotation() {
            return this.$store.state.annotationBeingEdited
        }
    },
    methods: {
        saveAnnotation() {
            //create fact for the annotation that is being edited
            //and add the annotation to that fact
            this.annotation.tag = this.selectedTag
            console.log("saving this.annotation", this.annotation, "that is part of this frame:", this.frameForThisAnnotation)
            //create fact if this is a new annotation
            if (!this.frameForThisAnnotation) {
                this.$store.dispatch("addFact", this.annotation)
            }
            this.$store.commit("setAnnotationBeingEdited", null)
        },
        cancelAnnotation() {
            this.$store.commit("setAnnotationBeingEdited", null)
        }
    }
}
</script>

<style lang="css" scoped>
#annotationPanel {
    position: absolute;
}
</style>