<template>
  <q-card flat bordered v-if="frame">
    <q-card-section>
      <div class="float-right">
        <q-btn
          size="sm"
          round
          flat
          color="primary"
          icon="mdi-comment-text-outline"
          @click="toggleComments"
        ></q-btn>
      </div>
      <q-input
        v-model="frame.label"
        label="Label"
        input-style="font-size: 16pt; font-weight:bold"
      />
      <q-input v-model="frame.act" label="Act" autogrow />
    </q-card-section>
    <q-card-section>
      <template v-if="frame.sentences.length > 0">
        <div
          v-for="sentence in frame.sentences.sort(function (a, b) {
            return a.orderId - b.orderId;
          })"
          class="row no-wrap justify-between items-center"
        >
          <TextElement :textPiece="sentence" />
          <q-btn
            size="md"
            round
            flat
            color="primary"
            class="q-mt-sm"
            icon="mdi-text-recognition"
            v-if="frame.sentences.length > 0"
            :loading="sentence.loading"
            @click="sendDataToNlp(sentence)"
          >
            <q-tooltip anchor="bottom middle" class="text-subtitle2">
              <span
                >Detect constituents of an act frame. <br />This feature is
                still experimental, so use it with caution. <br />It is
                recommended to use it only once per text snippet.</span
              >
            </q-tooltip>
            <template v-slot:loading>
              <q-spinner-gears />
            </template>
          </q-btn>
        </div>
      </template>
      <template v-else>
        <div class="source-text">No source added yet</div>
      </template>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <div>
        <FactInputField
          label="Action"
          :active="frame.activeField === 'action'"
          :facts="frame.action ? [frame.action] : []"
          @factRemoveClicked="frame.action = null"
          @click="
            frame.activeField = frame.activeField == 'action' ? null : 'action'
          "
        />

        <FactInputField
          label="Actor"
          :active="frame.activeField === 'actor'"
          :facts="frame.actor ? [frame.actor] : []"
          @factRemoveClicked="frame.actor = null"
          @click="
            frame.activeField = frame.activeField == 'actor' ? null : 'actor'
          "
        />

        <FactInputField
          label="Object"
          :active="frame.activeField === 'object'"
          :facts="frame.object ? [frame.object] : []"
          @factRemoveClicked="frame.object = null"
          @click="
            frame.activeField = frame.activeField == 'object' ? null : 'object'
          "
        />

        <FactInputField
          label="Recipient"
          :active="frame.activeField === 'recipient'"
          :facts="frame.recipient ? [frame.recipient] : []"
          @factRemoveClicked="frame.recipient = null"
          @click="
            frame.activeField =
              frame.activeField == 'recipient' ? null : 'recipient'
          "
        />

        <div class="label">Precondition</div>
        <BooleanConstructPanel :booleanConstruct="frame.precondition" />

        <div class="label">Postcondition</div>

        <div class="indent">
          <FactInputField
            label="Creates"
            :active="frame.activeField === 'creates'"
            :facts="frame.creates"
            @factRemoveClicked="
              (fact) => {
                const index = frame.creates.indexOf(fact);
                if (index !== -1) {
                  frame.creates.splice(index, 1);
                }
              }
            "
            @click="
              frame.activeField =
                frame.activeField == 'creates' ? null : 'creates'
            "
          />

          <FactInputField
            label="Terminates"
            :active="frame.activeField === 'terminates'"
            :facts="frame.terminates"
            @factRemoveClicked="
              (fact) => {
                const index = frame.terminates.indexOf(fact);
                if (index !== -1) {
                  frame.terminates.splice(index, 1);
                }
              }
            "
            @click="
              frame.activeField =
                frame.activeField == 'terminates' ? null : 'terminates'
            "
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-toggle
        v-model="showSource"
        label="Show source"
        @update:model-value="toggleShowSource"
        color="primary"
        :disable="frame.sourceText.length == 0"
      />
    </q-card-section>
    <q-card-actions>
      <q-btn color="primary" @click="closeForm">Close</q-btn>
    </q-card-actions>
  </q-card>
  <CommentsList
    :fact="frame"
    :showComments="showComments"
    @closed="
      () => {
        showComments = false;
      }
    "
  />
</template>

<script>
import FactInputField from "./FactInputField.vue";
import CommentsList from "./CommentsList.vue";
import BooleanConstructPanel from "./BooleanConstructPanel.vue";
import TextElement from "./TextElement.vue";
import ApiServices from "../services/ApiServices.js";
import { Annotation, Snippet } from "../model/annotation.js";
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
    annotationBeingEdited() {
      return this.$store.state.annotationBeingEdited;
    },
  },
  mounted() {},
  methods: {
    closeForm() {
      this.$store.state.frameBeingEdited = null;
    },
    toggleComments() {
      this.showComments = !this.showComments;
    },
    toggleShowSource() {
      this.$store.commit("setShowFrameSource", this.showSource);
    },
    async sendDataToNlp(sentence) {
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
            sentence, //sentence object
            range, //[start, end]
            token, //selected text
          );

          annotation.addSnippet(snippet); //this also sets snippet.annotation

          return;
        } else {
          const snippet = new Snippet(
            sentence, //sentence object
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
