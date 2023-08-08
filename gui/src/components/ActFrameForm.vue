<template>
  <q-card flat bordered v-if="frame">

    <q-card-section>
      <div class="float-right"><q-btn size="sm" round flat color="primary" icon="mdi-comment-text-outline"
          @click="toggleComments"></q-btn></div>
      <q-input v-model="frame.label" label="Label" input-style="font-size: 16pt; font-weight:bold" />
      <q-input v-model="frame.act" label="Act" autogrow />
    </q-card-section>
    <q-card-section>
      <div class="source-text">{{ frame.sourceText }}</div>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <div>

        <FactInputField label="Action" :active="frame.activeField === 'action'"
          :facts="frame.action ? [frame.action] : []" @factRemoveClicked="frame.action = null"
          @click="frame.activeField = 'action'" />
        <FactInputField label="Actor" :active="frame.activeField === 'actor'" :facts="frame.actor ? [frame.actor] : []"
          @factRemoveClicked="frame.actor = null" @click="frame.activeField = 'actor'" />
        <FactInputField label="Object" :active="frame.activeField === 'object'"
          :facts="frame.object ? [frame.object] : []" @factRemoveClicked="frame.object = null"
          @click="frame.activeField = 'object'" />
        <FactInputField label="Recipient" :active="frame.activeField === 'recipient'"
          :facts="frame.recipient ? [frame.recipient] : []" @factRemoveClicked="frame.recipient = null"
          @click="frame.activeField = 'recipient'" />
        <div class="label">Precondition</div>
        <FactInputField label="Precondition" :active="frame.activeField === 'precondition'"
          @click="frame.activeField = 'precondition'" />
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
              " @click="frame.activeField = 'creates'" />
          <FactInputField label="Terminates" :active="frame.activeField === 'terminates'" :facts="frame.terminates"
            @factRemoveClicked="(fact) => {
              const index = frame.terminates.indexOf(fact);
              if (index !== -1) {
                frame.terminates.splice(index, 1);
              }
            }
              " @click="frame.activeField = 'terminates'" />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-toggle v-model="showSource" label="Show source" @update:model-value="toggleShowSource" color="primary" />
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
