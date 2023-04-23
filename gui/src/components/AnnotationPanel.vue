<template>
    <div v-if="annotation">
        <q-card bordered>
            <!-- <q-card-section>
                <div class="text-h6">{{ annotation.annotatedText }}</div>
            </q-card-section> -->
            <q-card-actions>
                <q-btn-group>
                    <q-btn v-for="tag in tags" :label="tag.label"
                        :color="tag.value == selectedTag ? colors[tag.value] : 'grey-6'" @click="selectedTag = tag.value" />
                </q-btn-group>
            </q-card-actions>
            <q-card-actions>
                <q-btn color="primary" @click="saveAnnotation" :disabled="!selectedTag">Save</q-btn>
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
            { label: "Object", value: "object" },
            { label: "Context", value: "context" }
        ],
        selectedTag: null,
        colors: colors
    }),
    props: {
        annotation: Object //{sentence, characterRange, tag, positionOnScreen, annotatedText}
    },
    mounted() {
        this.selectedTag = this.annotation.tag
    },
    computed: {
        frameForThisAnnotation() {
            return this.$store.state.frames.find(f => f.annotation == this.annotation)
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

<style lang="css" scoped></style>