<template>
  <q-card flat bordered v-if="frame">

    <q-card-section>
      <div class="float-right"><q-btn size="sm" round flat color="primary" icon="mdi-comment-text-outline"
          @click="toggleComments"></q-btn></div>
      <q-input v-model="frame.label" label="Label" input-style="font-size: 16pt; font-weight:bold" />
      <q-input v-model="frame.claimduty" label="Claim-Duty" autogrow />
    </q-card-section>
    <q-card-section>
      <template v-if="sentences?.length > 0">
        <SentenceList :sentences="sentences" />
      </template>
      <template v-else>
        <div class="source-text">No source added yet</div>
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
      <q-btn color="negative" @click="deleteFrame">Delete</q-btn>
      <template v-if="isExistingFrame">
        <div class="message">Any changes have been saved</div>
        <q-btn color="primary" @click="saveFrame">Close</q-btn>
      </template>
      <template v-else>
        <q-btn color="primary" @click="saveFrame">Save</q-btn>
      </template>
    </q-card-actions>
  </q-card>
  <CommentsList :fact="frame" :showComments="showComments" @closed="() => { showComments = false }" />
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
    showComments: false
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
    frames() {
      return this.$store.state.frames;
    },
    isExistingFrame() {
      return this.frames.some((f) => f.id == this.frame.id)
    },
  },
  methods: {
    saveFrame() {
      this.frame.activeField = null
      this.$store.commit("saveFrameBeingEdited");
    },
    deleteFrame() {
      this.$store.commit("removeFrame", this.frame)
    },
    toggleComments() {
      this.showComments = !this.showComments
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

<style lang="css" scoped>
.label {
  margin-left: 0px;
}

.indent {
  margin-left: 30px;
}

.source-text {
  font-style: italic;
}
</style>
