<!-- panel that pops up when user is adding an annotation to an existing frame -->
<template>
    <div id="adding-annotation-panel" v-if="addingAnnotationToExistingFrame" :style="{
        left: '10px',
        bottom: '10px',
    }">
        <q-card bordered>
            <q-card-section>
                <div class="message">Click frame to add annotation</div>
            </q-card-section>
            <q-card-actions>
                <q-btn flat @click="cancelAdding">Cancel</q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script>
export default {
    computed: {
        addingAnnotationToExistingFrame() {
            return this.$store.state.addingAnnotationToExistingFrame
        }
    },
    methods: {
        cancelAdding() {
            this.$store.state.addingAnnotationToExistingFrame = false
            this.$store.state.annotationToBeAddedToExistingFrame = null
        }
    },
}
</script>

<style lang="css" scoped>
#adding-annotation-panel {
    position: absolute;
    width: 240px;
}
</style>