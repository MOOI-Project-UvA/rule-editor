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
              <span> Detect constituents of an act frame. </span>
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
    // showFrameSource() {
    //   return this.$store.state.showFrameSource
    // }
  },
  mounted() {
    console.log("actframeForm: ", this.frame.sentences);
    console.log("available frametypes", frameTypes);
  },
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
      console.log("send data to NLP!", sentence);
      sentence.loading = true;
      const response = await ApiServices.fetchNlpPrediction(sentence.content);
      console.log("response:", response);
      sentence.loading = false;
      //TODO: the response consists of an array of arrays...
      //Actions needed:
      // - 1) for each token get the range (differences in HTML and simple string)
      // - 2) and create a fact frame with a specific role..
      // - 3) annotate text
      //         - 3.1) What if there is already an annotation in one case?

      let lastIndex = 0;
      response.predicted_entities.forEach((pair) => {
        const token = pair[0];
        const role = pair[1];

        const range = this.getRange(sentence.content, token, lastIndex);
        console.log("pair: ", pair);
        console.log("ranges: ", range);

        lastIndex = range[1];
        if (role === "None") {
          console.log("just before return!", token, role);
          return;
        }
        console.log("after return!");

        if (range[0] != range[1]) {
          const snippet = new Snippet(
            sentence, //sentence object
            range, //[start, end]
            token, //selected text
          );
          console.log("snippet", snippet);
          //if there is an active annotation being edited, add snippet to that annotation
          //else create new annotation and add snippet
          // we probably do not need this one ... for the nLP part..
          // if (this.annotationBeingEdited) {
          //   this.annotationBeingEdited.addSnippet(snippet); //this also sets snippet.annotation
          //   console.log(
          //     "this.annotaionBeingEdited: ",
          //     this.annotationBeingEdited,
          //   );
          // } else {
          // getting position on screen in this case without an event?
          let annotation = new Annotation();
          annotation.addSnippet(snippet); //this also sets snippet.annotation
          // annotation.positionOnScreen = [207, 545];
          console.log("annotation", annotation);
          const selectedType = frameTypes.filter((d) => d.id == "fact")[0];
          console.log("frametypes", selectedType);

          // create frame
          this.$store.commit("createNewFrameViaNlp", {
            frameType: selectedType,
            annotation: annotation,
            subType: role,
          });
          // TODO:
          //  1) find range in HTML instead of text,
          //  2) add modal window for previewing the NLP part
          //  3) create chips for each element.. -> check FrameNetworkView.vue
          //  4) if successive elements have the same label in the predictions merge the facts...
          //  5) if a token is met multiple times per string, pick the correct instance... DONE

          //shows the pop-up window...
          // setAnnotationBeingEdited?
          // this.$store.commit("setAnnotationBeingEdited", annotation);

          // create a frame as next step..
          // go to the annotation panel next..
          // in index.js => addnewFrame () -> set subtype in this frame... frame.addAnnotation...
          // }
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
