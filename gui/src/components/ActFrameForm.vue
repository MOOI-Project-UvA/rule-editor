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
      <q-input v-model="frame.act" label="Act" autogrow />
    </q-card-section>
    <q-card-section>
      <template v-if="sentences?.length > 0">
        <SentenceList :sentences="sentences" :showNLP="true" />
      </template>
      <template v-else>
        <div class="source-text">No source added yet</div>
      </template>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <div>
        <RoleSelector :frame="frame" attribute="action" label="Action" :multipleFramesAllowed="false" />
        <RoleSelector :frame="frame" attribute="actor" label="Actor" :multipleFramesAllowed="false" />
        <RoleSelector :frame="frame" attribute="object" label="Object" :multipleFramesAllowed="false" />
        <RoleSelector :frame="frame" attribute="recipient" label="Recipient" :multipleFramesAllowed="false" />

        <div class="label">Precondition</div>
        <BooleanConstructPanel :booleanConstruct="frame.precondition" />

        <div class="label">Postcondition</div>
        <RoleSelector :frame="frame" attribute="creates" label="Creates" :multipleFramesAllowed="true" />
        <RoleSelector :frame="frame" attribute="terminates" label="Terminates" :multipleFramesAllowed="true" />
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn color="negative" @click="deleteFrame">Delete</q-btn>


      <q-btn color="primary" @click="closeFrame">Close
        <q-tooltip class="text-subtitle2">
          Any changes have been saved
        </q-tooltip>
      </q-btn>


    </q-card-actions>
  </q-card>
  <CommentsList :fact="frame" :showComments="showComments" @closed="showComments = false" />
</template>

<script>
import RoleSelector from "./RoleSelector.vue";
import SentenceList from "./SentenceList.vue";
import CommentsList from "./CommentsList.vue";
import BooleanConstructPanel from "./BooleanConstructPanel.vue";

export default {
  emits: ["closed"],
  data: () => ({
    showSource: false,
    showComments: false,
    // loading: false,
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
    annotationBeingEdited() {
      return this.$store.state.annotationBeingEdited;
    },
    booleanConstructBeingEdited() {
      return this.$store.state.booleanConstructBeingEdited
    },
  },
  methods: {
    closeFrame() {
      this.frame.activeField = null
      this.$store.commit("removeFrameFromEditList", this.frame)
    },
    deleteFrame() {
      this.$store.state.frameBeingDeleted = this.frame
    },
    toggleShowSource() {
      this.$store.commit("setShowFrameSource", this.showSource);
    },
  },
  components: {
    RoleSelector,
    SentenceList,
    CommentsList,
    BooleanConstructPanel,
  },
};
</script>

<style lang="css" scoped>
.label {
  margin-left: 0px;
}

.source-text {
  font-style: italic;
}
</style>
