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
        <SentenceList :sentences="sentences" />
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
      <template v-if="isExistingFrame">
        <q-btn color="negative" @click="deleteFrame">Delete</q-btn>
        <div class="message">Any changes have been saved</div>
        <q-btn color="primary" @click="saveFrame">Close</q-btn>
      </template>
      <template v-else>
        <q-btn color="negative" @click="cancelFrame">Delete</q-btn>
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
import ApiServices from "../services/ApiServices.js";
import { Annotation } from "../model/annotation.js";
import { Snippet } from "../model/snippet";
import { frameTypes } from "../model/frame.js";


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
    cancelFrame() {
      this.$store.commit("cancelFrameBeingEdited")
    },
    saveFrame() {
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

    async sendDataToNlp(sentence) {
      console.log("sentence: ", sentence);
      sentence.loading = true;
      const response = await ApiServices.fetchNlpPrediction(sentence.content);

      sentence.loading = false;

      let lastIndex = 0;
      // create a new annotation
      let annotation = new Annotation();
      response.predicted_entities.forEach((pair, index, arr) => {
        const token = pair[0];
        const role = pair[1];

        const range = this.getRange(sentence.content, token, lastIndex);

        lastIndex = range[1];

        if (role === "None") return;

        if (arr[index + 1][1] === role) {
          range[1] += 1;
          const snippet = new Snippet(
            // this.textPiece.documentId, //document id
            // this.textPiece.id, //sentence id
            // this.textPiece, //sentence
            sentence.documentId,
            sentence.id,
            // sentence, //sentence object
            range, //[start, end]
            token, //selected text
          );

          annotation.addSnippet(snippet); //this also sets snippet.annotation

          return;
        } else {
          const snippet = new Snippet(
            sentence.documentId, // documentId
            sentence.id, // sentence.id
            // sentence, //sentence object
            range, //[start, end]
            token, //selected text
          );

          annotation.addSnippet(snippet); //this also sets snippet.annotation

          const selectedType = frameTypes.filter((d) => d.id == "fact")[0];

          // create frame
          this.$store.commit("createNewFrameViaNlp", {
            frameType: selectedType,
            annotation: annotation,
            subType: role === "Recipient" || role === "Actor" ? "Agent" : role,
            role: role,
          });
          annotation = new Annotation();
        }
      });
    },
    getRange(string, token, lastIndex) {
      // how about a potential second occurrence of the same token?
      const index = string.indexOf(token, lastIndex);
      if (index !== -1) {
        const endIndex = index + token.length;
        // console.log(index, endIndex);

        return [index, endIndex];
      }
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
