<template>
  <q-card flat bordered v-if="frame">

    <q-card-section>
      <div class="float-right"><q-btn size="sm" round flat color="primary" icon="mdi-comment-text-outline"
          @click="toggleComments"></q-btn></div>
      <q-input v-model="frame.label" label="Label" input-style="font-size: 16pt; font-weight:bold" />
      <q-input v-model="frame.claimduty" label="Claim-Duty" autogrow />
    </q-card-section>
    <q-card-section>
      <template v-if="frame.sentences.length > 0">
        <div v-for="sentence in frame.sentences">
          <TextElement :textPiece="sentence" />
        </div>
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
    <q-card-section>
      <q-toggle v-model="showSource" label="Show source" @update:model-value="toggleShowSource" color="primary"
        :disable="frame.sourceText.length == 0" />
    </q-card-section>
    <q-card-actions>
      <q-btn color="primary" @click="closeForm">Close</q-btn>
    </q-card-actions>
  </q-card>
  <CommentsList :fact="frame" :showComments="showComments" @closed="() => { showComments = false }" />
</template>

<script>
import FactInputField from "./FactInputField.vue";
import CommentsList from "./CommentsList.vue";
import BooleanConstructPanel from "./BooleanConstructPanel.vue";
import TextElement from "./TextElement.vue"

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
    // showFrameSource() {
    //   return this.$store.state.showFrameSource
    // }
  },
  methods: {
    closeForm() {
      this.$store.state.frameBeingEdited = null;
    },
    toggleComments() {
      this.showComments = !this.showComments
    },
    toggleShowSource() {
      this.$store.commit("setShowFrameSource", this.showSource)
    },
  },
  components: {
    FactInputField, CommentsList, BooleanConstructPanel, TextElement
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
