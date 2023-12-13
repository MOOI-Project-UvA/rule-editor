<template>
  <q-card flat bordered v-if="frame">
    <q-card-section>
      <div class="float-right">
        <q-btn size="sm" round flat color="primary" icon="mdi-comment-text-outline" @click="toggleComments"></q-btn>
      </div>
      <q-input v-model="frame.label" label="Label" input-style="font-size: 16pt; font-weight:bold" />
      <q-input v-model="frame.act" label="Act" autogrow />
    </q-card-section>
    <q-card-section>
      <template v-if="frame.sentences.length > 0">
        <div v-for="sentence in frame.sentences.sort(function (a, b) {
          return a.orderId - b.orderId;
        })">
          <TextElement :textPiece="sentence" />
        </div>
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

        <div class="indent">
          <FactInputField label="Creates" :active="frame.activeField === 'creates'" :facts="frame.creates"
            @factRemoveClicked="(fact) => {
              const index = frame.creates.indexOf(fact);
              if (index !== -1) {
                frame.creates.splice(index, 1);
              }
            }
              " @click="
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
      </div>
    </q-card-section>
    <q-card-section>
      <q-toggle v-model="showSource" label="Show source" @update:model-value="toggleShowSource" color="primary"
        :disable="frame.sourceText.length == 0" />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn color="primary" @click="closeForm">Cancel</q-btn>
      <q-btn color="primary" @click="saveFrame">Save</q-btn>
    </q-card-actions>
  </q-card>
  <CommentsList :fact="frame" :showComments="showComments" @closed="() => {
    showComments = false;
  }
    " />
</template>

<script>
import FactInputField from "./FactInputField.vue";
import CommentsList from "./CommentsList.vue";
import BooleanConstructPanel from "./BooleanConstructPanel.vue";
import TextElement from "./TextElement.vue";

export default {
  emits: ["closed"],
  data: () => ({
    showSource: false,
    showComments: false,
  }),
  computed: {
    frame() {
      return this.$store.state.frameBeingEdited;
    },
    // showFrameSource() {
    //   return this.$store.state.showFrameSource
    // }
  },
  mounted() {
    console.log("actframeForm: ", this.frame.sentences);
  },
  methods: {
    closeForm() {
      this.$store.state.frameBeingEdited = null;
    },
    saveFrame() {
      this.$store.commit("saveFrameBeingEdited")
      this.$store.state.frameBeingEdited = null;
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
    CommentsList,
    BooleanConstructPanel,
    TextElement,
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
