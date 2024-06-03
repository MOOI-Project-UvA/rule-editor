<template>
    <div v-if="frameBeingDeleted" id="confirmation-panel">
        <q-card bordered>
            <q-card-section>
                <div class="text-h6">Delete this frame?</div>
                <div class="text-subtitle2">{{ frameBeingDeleted.label }}</div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn color="primary" flat @click="cancelDeletion">No</q-btn>
                <q-btn color="negative" flat @click="deleteFrame">Yes</q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script>
export default {
    methods: {
        cancelDeletion() {
            this.$store.state.frameBeingDeleted = null
        },
        deleteFrame() {
            this.$store.commit("removeFrame", this.frameBeingDeleted)
            this.$store.state.frameBeingDeleted = null
        }
    },
    computed: {
        frameBeingDeleted() {
            return this.$store.state.frameBeingDeleted
        },
    }
}
</script>

<style scoped>
#confirmation-panel {
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>