<template>
  <q-card flat bordered v-if="frame">
    <q-card-section>
      <div class="float-right">
        <q-btn size="sm" round flat color="primary" icon="mdi-comment-text-outline" @click="toggleComments"></q-btn>
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
        <FactInputField label="Action" :active="frame.activeField === 'action'"
          :facts="frame.action ? [frame.action] : []" @factRemoveClicked="frame.action = null" @click="
    frame.activeField = frame.activeField == 'action' ? null : 'action'
    " />

        <FactInputField label="Actor" :active="frame.activeField === 'actor'" :facts="frame.actor ? [frame.actor] : []"
          @factRemoveClicked="frame.actor = null" @click="
    frame.activeField = frame.activeField == 'actor' ? null : 'actor'
    " />

        <FactInputField label="Object" :active="frame.activeField === 'object'"
          :facts="frame.object ? [frame.object] : []" @factRemoveClicked="frame.object = null" @click="
    frame.activeField = frame.activeField == 'object' ? null : 'object'
    " />

        <FactInputField label="Recipient" :active="frame.activeField === 'recipient'"
          :facts="frame.recipient ? [frame.recipient] : []" @factRemoveClicked="frame.recipient = null" @click="
    frame.activeField =
    frame.activeField == 'recipient' ? null : 'recipient'
    " />

        <div class="label">Precondition</div>
        <BooleanConstructPanel :booleanConstruct="frame.precondition" />

        <div class="label">Postcondition</div>

        <FactInputField label="Creates" :active="frame.activeField === 'creates'" :facts="frame.creates"
          @factRemoveClicked="(fact) => {
    const index = frame.creates.indexOf(fact);
    if (index !== -1) {
      frame.creates.splice(index, 1);
    }
  }" @click="
    frame.activeField =
    frame.activeField == 'creates' ? null : 'creates'
    " />

        <FactInputField label="Terminates" :active="frame.activeField === 'terminates'" :facts="frame.terminates"
          @factRemoveClicked="(fact) => {
    const index = frame.terminates.indexOf(fact);
    if (index !== -1) {
      frame.terminates.splice(index, 1);
    }
  }
    " @click="
    frame.activeField =
    frame.activeField == 'terminates' ? null : 'terminates'
    " />
      </div>

    </q-card-section>
    <!-- <q-card-section>
      <q-toggle v-model="showSource" label="Show source" @update:model-value="toggleShowSource" color="primary"
        :disable="frame.annotations.length == 0" />
    </q-card-section> -->
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
  <CommentsList :fact="frame" :showComments="showComments" @closed="() => {
    showComments = false;
  }
    " />
</template>

<script>
import FactInputField from "./FactInputField.vue";
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
      this.showComments = !this.showComments;
    },
    toggleShowSource() {
      this.$store.commit("setShowFrameSource", this.showSource);
    },
  },
  components: {
    FactInputField,
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
