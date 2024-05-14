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
        <FactInputField label="Duty" :active="frame.activeField === 'duty'" :facts="frame.duty ? [frame.duty] : []"
          @factRemoveClicked="frame.duty = null"
          @click="frame.activeField = frame.activeField == 'duty' ? null : 'duty'" />

        <FactInputField label="Actor" :active="frame.activeField === 'actor'" :facts="frame.actor ? [frame.actor] : []"
          @factRemoveClicked="frame.actor = null"
          @click="frame.activeField = frame.activeField == 'actor' ? null : 'actor'" />

        <FactInputField label="Holder" :active="frame.activeField === 'holder'"
          :facts="frame.holder ? [frame.holder] : []" @factRemoveClicked="frame.holder = null"
          @click="frame.activeField = frame.activeField == 'holder' ? null : 'holder'" />
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn color="negative" @click="cancelFrame">Delete</q-btn>
      <q-btn color="primary" @click="saveFrame">Save</q-btn>
    </q-card-actions>
  </q-card>
  <CommentsList :fact="frame" :showComments="showComments" @closed="() => { showComments = false }" />
</template>

<script>
import FactInputField from "./FactInputField.vue";
import CommentsList from "./CommentsList.vue";
import BooleanConstructPanel from "./BooleanConstructPanel.vue";

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
  },
  methods: {
    cancelFrame() {
      this.$store.commit("cancelFrameBeingEdited")
    },
    saveFrame() {
      this.$store.commit("saveFrameBeingEdited")
    },
    toggleComments() {
      this.showComments = !this.showComments
    },
    toggleShowSource() {
      this.$store.commit("setShowFrameSource", this.showSource)
    },
  },
  components: {
    FactInputField, CommentsList, BooleanConstructPanel
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
