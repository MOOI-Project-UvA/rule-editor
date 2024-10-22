<template>
    <q-dialog v-model="showComments" @update:model-value="closeClicked">
        <q-card style="width: 500px">
            <q-card-section class="flex flex-row items-baseline q-pb-none">
                <div class="text-h6">Comments</div>
                <div v-if="fact.comments.length > 0" class="q-ml-sm text-sm">(click comment to edit)</div>
                <q-space />
                <q-btn icon="mdi-close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
                <div v-for="comment in fact.comments">
                    <template v-if="commentBeingEdited == comment">
                        <q-input v-model="commentBeingEdited.content" filled type="textarea" />
                        <q-btn class="q-mt-sm q-mr-sm" color="negative"
                            @click="commentBeingDeleted = comment; commentBeingEdited = null">Delete</q-btn>
                        <q-btn class="q-mt-sm" color="primary" @click="commentBeingEdited = null">Save</q-btn>
                    </template>
                    <template v-else-if="commentBeingDeleted == comment">
                        <div class="q-my-sm">{{ comment.content }}</div>
                        <div>Are you sure to delete this comment?</div>
                        <q-btn class="q-mt-sm q-mr-sm" color="negative" @click="deleteComment">Yes</q-btn>
                        <q-btn class="q-mt-sm" color="primary" @click="commentBeingDeleted = null">No</q-btn>
                    </template>
                    <template v-else>
                        <div class="q-my-sm cursor-pointer" @click="commentBeingEdited = comment">
                            {{ comment.content }}
                        </div>
                    </template>
                    <hr />
                </div>
                <!-- hide new comment panel if another comment is being edited -->
                <div v-if="!commentBeingEdited && !commentBeingDeleted">
                    <q-input v-model="newComment.content" filled type="textarea" label="New comment" />
                    <q-btn class="q-mt-sm" color="primary" @click="addComment">Add</q-btn>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { Comment } from '../model/comment.js';
export default {
    data: () => ({
        commentBeingEdited: null,
        commentBeingDeleted: null,
        newComment: null
    }),
    mounted() {
        this.newComment = new Comment()
    },
    props: {
        showComments: Boolean,
        fact: Object
    },
    computed: {
        editingExistingComment() {
            return this.fact.comments.some(c => c.id == commentBeingEdited?.id)
        }
    },
    methods: {
        closeClicked() {
            this.$emit("closed");
        },
        addComment() {
            this.fact.comments.push(this.newComment)
            this.newComment = new Comment()
        },
        deleteComment() {
            const index = this.fact.comments.findIndex(c => c.id == this.commentBeingDeleted.id)
            this.fact.comments.splice(index, 1)
            this.commentBeingDeleted = null
        }
    }
}
</script>
