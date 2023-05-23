<template>
    <q-dialog v-model="showComments" @update:model-value="closeClicked">
        <q-card style="width: 500px">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Comments</div>
                <q-space />
                <q-btn icon="mdi-close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section v-for="comment in fact.comments">
                {{ comment }}
            </q-card-section>

            <q-card-section>
                <q-input v-model="newComment" filled type="textarea" label="New comment" />
            </q-card-section>

            <q-card-actions>
                <q-btn color="primary" @click="addComment">Add</q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
export default {
    data: () => ({
        newComment: ""
    }),
    props: {
        showComments: Boolean,
        fact: Object
    },
    methods: {
        closeClicked() {
            this.$emit("closed");
        },
        addComment() {
            this.fact.comments.push(this.newComment)
            this.newComment = ""
        }
    }
}
</script>
