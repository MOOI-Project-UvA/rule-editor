<template>
  <div class="document" @mouseup="handleSelection">
    <div class="q-mb-md row no-wrap items-center" :style="getStyleForLineSpacing(sentence)" v-for="sentence in sentences">
       <div>
        <span class="snippet" :style="getStyleForUnderlining(snippet, sentence)" v-for="snippet in sentence.snippets"
        :data-snippet-id="snippet.id" :data-sentence-id="sentence.id">
        {{ snippet.text }}
      </span>
         </div>
      <div v-if="showNLP && sentences.length > 0" class="self-center">
        <q-btn size="sm" round flat color="primary" class="q-mt-sm" icon="mdi-text-recognition"
          :loading="sentence.loading" @click.stop="sendDataToNlp(sentence)" @mouseup.stop>
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


    </div>

  </div>
</template>

<script>
import {
  getSelectionAsSnippets,
  splitAndReturnSelectedSnippets,
} from "../helpers/annotating.js";
import {
  getStyleForUnderlining,
  getStyleForLineSpacing,
} from "../helpers/underlining.js";
import { Annotation } from "../model/annotation";
import { frameTypes } from "../model/frame";
import { Snippet } from "../model/snippet";
import ApiServices from "../services/ApiServices.js";
export default {
  props: {
    sentences: Array,
    showNLP: Boolean
  },
  computed: {
    annotationBeingEdited() {
      return this.$store.state.annotationBeingEdited;
    },
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
    booleanConstructBeingEdited() {
      return this.$store.state.booleanConstructBeingEdited;
    },
  },
  methods: {
    getStyleForUnderlining,
    getStyleForLineSpacing,
    handleSelection(event) {
      const selection = window.getSelection();
      if (selection.toString().length > 0) {
        console.log("selection", selection);
        //if no annotation is open, create a new one, else use the existing one that is open
        let annotation;
        if (this.annotationBeingEdited) {
          annotation = this.annotationBeingEdited;
        } else {
          annotation = new Annotation();
          //if user is creating a frame for a role, create fact immediately, without
          //showing the annotation panel
          if (
            this.frameBeingEdited &&
            this.frameBeingEdited.type.class == "relation" &&
            this.frameBeingEdited.activeField
          ) {
            const factFrameType = frameTypes.find((t) => t.id == "fact");
            //if there is only one subtype allowed for this fact, assign that subtype to the frame
            const subTypeId =
              this.frameBeingEdited.allowedSubTypesForActiveField.length == 1
                ? this.frameBeingEdited.allowedSubTypesForActiveField[0]
                : null;
            const subType = subTypeId
              ? factFrameType.subTypes.find((t) => t.id == subTypeId)
              : null;
            //store reference to the currently being edited frame
            const relationFrame = this.$store.state.frameBeingEdited;
            this.$store.commit("addNewFrame", {
              frameType: factFrameType,
              annotation: annotation,
              subType: subType,
            });
            relationFrame.addFrame(this.$store.state.frameBeingEdited);
            this.frameBeingEdited.activeField = null;
          } else {
            //no role is selected, or role is booleanconstruct (that requires annotation panel)
            this.$store.state.annotationBeingEdited = annotation;
          }
        }
        //get selection in terms of start/end sentences, snippets, and offsets
        const selectionAsSnippets = getSelectionAsSnippets(
          selection,
          this.sentences,
        );
        //split snippets and return those that correspond with the selection
        console.log("selectionAsSnippets", selectionAsSnippets);
        const selectedSnippets = splitAndReturnSelectedSnippets(
          selectionAsSnippets,
          this.sentences,
        );
        selectedSnippets.forEach((s) => {
          s.addAnnotation(annotation);
        });
      } else {
        const clickedSentence = this.sentences.find(
          (s) => s.id == selection.anchorNode.parentNode.dataset.sentenceId,
        );
        const clickedSnippet = clickedSentence.snippets.find(
          (s) => s.id == selection.anchorNode.parentNode.dataset.snippetId,
        );
        this.$store.state.selectedSnippet = clickedSnippet;
      }
      this.$store.state.clickedPosition = [event.clientX, event.clientY];
    },
    async sendDataToNlp(sentence) {
      console.log("sentence: ", sentence);
      sentence.loading = true;
      const response = await ApiServices.fetchNlpPrediction(sentence.text);

      sentence.loading = false;

      let lastIndex = 0;
      // create a new annotation
      let annotation = new Annotation();
      response.predicted_entities.forEach((pair, index, arr) => {
        const token = pair[0];
        const role = pair[1];

        const range = this.getRange(sentence.text, token, lastIndex);

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
  watch: {
    sentences() {
      console.log("this.sentences", this.sentences);
    },
  },
};
</script>

<style scoped>
.document {
  word-wrap: break-word;
}

#sentence-list{
  //display: flex;
  //justify-content: space-between;
}
</style>
