<template>
  <q-card flat bordered v-if="frame">

    <q-card-section>
      <div class="float-right">
        <q-btn size="sm" round flat color="primary" icon="mdi-comment-text-outline"
          @click="showComments = !showComments">
          <q-badge v-if="frame.comments.length > 0" color="primary" floating>{{ frame.comments.length }}</q-badge>
          <q-tooltip class="text-subtitle2">
            Comments
          </q-tooltip>
        </q-btn>
      </div>
      <q-input v-model="frame.label" label="Label" input-style="font-size: 12pt; font-weight:bold" />
      <q-input v-model="frame.claimduty" label="Claim-Duty" autogrow />
    </q-card-section>
    <q-card-section>
      <template v-if="sentences?.length == 0">
        <div class="text-italic">No source added yet</div>
      </template>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <div>
        <RoleSelector :frame="frame" attribute="duty" label="Duty" :multipleFramesAllowed="false" />
        <RoleSelector :frame="frame" attribute="actor" label="Actor" :multipleFramesAllowed="false" />
        <RoleSelector :frame="frame" attribute="holder" label="Holder" :multipleFramesAllowed="false" />
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <template v-if="frameIsBeingDeleted">
        <div class="q-mr-sm">Are you sure you want to delete this frame?</div>
        <q-btn color="negative" @click="deleteFrame">Yes
          <q-tooltip class="text-subtitle2">
            Delete this frame
          </q-tooltip>
        </q-btn>
        <q-btn color="primary" @click="frameIsBeingDeleted = false">No</q-btn>
      </template>
      <template v-else>
        <q-btn color="negative" @click="frameIsBeingDeleted = true">Delete</q-btn>
        <q-btn color="primary" @click="closeFrame">Close
          <q-tooltip class="text-subtitle2">
            Any changes have been saved
          </q-tooltip>
        </q-btn>
      </template>
    </q-card-actions>
  </q-card>
  <CommentsList :fact="frame" :showComments="showComments" @closed="showComments = false" />
</template>

<script>
import RoleSelector from "./RoleSelector.vue";
import CommentsList from "./CommentsList.vue";
import BooleanConstructPanel from "./BooleanConstructPanel.vue";
import SentenceList from "./SentenceList.vue";

export default {
  emits: ["closed"],
  data: () => ({
    showSource: false,
    showComments: false,
    frameIsBeingDeleted: false //true when user clicked delete button
  }),
  computed: {
    frame() {
      return this.$store.state.frameBeingEdited;
    },
    sourceDocuments() {
      return this.$store.state.sourceDocuments;
    },
    sentences() {
      return this.sourceDocuments
        .map(sourceDoc => sourceDoc.getSentencesForFrame(this.frame))
        .flat()
    },
  },
  methods: {
    closeFrame() {
      this.frame.activeField = null
      this.$store.commit("removeFrameFromEditList", this.frame)
    },
    deleteFrame() {
      this.$store.commit("removeFrame", this.frame)
    },
    toggleShowSource() {
      this.$store.commit("setShowFrameSource", this.showSource)
    },
  },
  components: {
    RoleSelector,
    CommentsList,
    BooleanConstructPanel,
    SentenceList
  },
};
</script>
