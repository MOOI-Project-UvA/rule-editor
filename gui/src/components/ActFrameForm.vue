<template>
  <q-card flat bordered v-if="frame">
    <!--test -->

    <q-card-section>
      <div class="float-right"><q-btn size="sm" round flat color="primary" icon="mdi-comment-text-outline"
          @click="toggleComments"></q-btn></div>
      <q-input v-model="frame.label" label="Label" input-style="font-size: 16pt; font-weight:bold" />

    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <div>
        <q-input v-model="frame.act" label="Act" />
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
        <FactInputField label="Precondition" :active="frame.activeField === 'precondition'"
          :facts="frame.precondition ? [frame.precondition] : []" @factRemoveClicked="frame.precondition = null"
          @click="frame.activeField = 'precondition'" />
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
      <q-toggle label="Show sources" color="primary" v-model="showSource" />
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
  <CommentsList :fact="frame" :showComments="showComments" @closed="() => { showComments = false }" />
</template>

<script>
import FactInputField from "./FactInputField.vue";
import CommentsList from "./CommentsList.vue";
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
    cancelClicked() {
      this.$emit("closed");
    },
    saveClicked() {

      //store frame if it is a new frame
      this.$store.commit("addFrame", this.frame);
      this.$emit("closed");
    },
    toggleComments() {
      this.showComments = !this.showComments
    }
  },
  components: {
    FactInputField, CommentsList
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
</style>
