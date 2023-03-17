<template>
    <div v-if="annotation">
        <q-card bordered>
            <q-card-section>
                <div class="text-h6">{{ annotation.annotatedText }}</div>
            </q-card-section>
            <q-card-actions>
                <q-btn-group>
                    <q-btn v-for="tag in tags" :label="tag.label"
                        :color="tag.value == annotation.tag ? colors[tag.value] : 'grey-6'" @click="setTag(tag.value)" />
                </q-btn-group>
            </q-card-actions>
            <q-card-actions>
                <q-btn color="primary" @click="saveAnnotation">Save</q-btn>
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
            { label: "Other", value: "other" }
        ],
        selectedTag: null,
        colors: colors
    }),
    props: {
        annotation: Object //{sentence, characterRange, tag, positionOnScreen, annotatedText}
    },
    methods: {
        saveAnnotation() {
            //create atomic fact for the annotation that is being edited
            //and add the annotation to that fact
            this.$store.dispatch("addAtomicFact", this.annotation)
            this.$store.commit("setAnnotationBeingEdited", null)
        },
        cancelAnnotation() {
            this.$store.commit("setAnnotationBeingEdited", null)
        },
        setTag(tagValue) {
            this.annotation.tag = this.annotation.tag == tagValue ? null : tagValue
        }
    }
}
</script>

<style lang="css" scoped></style>