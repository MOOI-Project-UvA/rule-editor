<template>
  <div class="document" @mouseup="handleSelection">
    <div class="q-mb-md row no-wrap items-center" :style="getStyleForLineSpacing(sentence)"
      v-for="sentence in sentences" :ref="`sentence-${sentence.id}`">
      <div>
        <span :style="getStyleForUnderlining(snippet, frameBeingEdited)" v-for="snippet in sentence.snippets"
          :data-snippet-id="snippet.id" :data-sentence-id="sentence.id">
          {{ snippet.text }}
        </span>
      </div>
      <div v-if="showNLP && sentences.length > 0" class="self-center">
        <q-btn size="sm" round flat color="primary" class="q-mt-sm" icon="mdi-text-recognition"
          :loading="sentence.loading" @click.stop="sendDataToNlp(sentence)" @mouseup.stop>
          <q-tooltip anchor="bottom middle" class="text-subtitle2">
            <span>Detect constituents of an act frame. <br />This feature is
              still experimental, so use it with caution. <br />It is
              recommended to use it only once per text snippet.</span>
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
  getSelectedRangeAsSnippets,
  splitAndReturnSelectedSnippets,
} from "../helpers/annotating.js";
import {
  getStyleForUnderlining,
  getStyleForLineSpacing,
  setVerticalPositionOfAnnotationLines
} from "../helpers/underlining.js";
import { Annotation } from "../model/annotation";
import ApiServices from "../services/ApiServices.js";

export default {
  data: () => ({
    nlpRoleToSubtype: {
      "Actor": "agent",
      "Recipient": "agent",
      "Action": "action",
      "Object": "object",
      "Duty": "duty"
    }
  }),
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
    sentenceToScrollTo() {
      return this.$store.state.sentenceToScrollTo
    },
    displayedSourceDocument() {
      return this.$store.state.displayedSourceDocument
    }
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
            'activeField' in this.frameBeingEdited &&
            this.frameBeingEdited.activeField
          ) {
            //if there is only one subtype allowed for this fact, assign that subtype to the frame
            const subTypeId =
              this.frameBeingEdited.allowedSubTypesForActiveField.length == 1
                ? this.frameBeingEdited.allowedSubTypesForActiveField[0]
                : null;

            //store reference to the currently being edited frame
            const relationFrame = this.$store.state.frameBeingEdited;
            this.$store.commit("addNewFrame", {
              frameTypeId: 'fact',
              subTypeId: subTypeId,
              annotation: annotation,
              openInEditor: true
            });
            //add the frame that has just being created to the proper role in the relation (act / claim-duty)
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
        //update underlining of annotations in the source text, for the currently showing document
        setVerticalPositionOfAnnotationLines(this.displayedSourceDocument)
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
      //filter out entries with no role
      const entities = response.predicted_entities //.filter(([_, role]) => role != "None")

      sentence.loading = false;
      console.log("entities", entities)

      //current character range of subsequent tokens with equal roles
      let characterRangeStart = 0
      let characterRangeEnd = 0
      entities.forEach(([token, role], index) => {

        //get start and end index of token in sentence
        const tokenRange = this.getRange(sentence.text, token, characterRangeEnd);

        characterRangeEnd = tokenRange[1]

        if (index < entities.length - 1 && role != entities[index + 1][1] || index == entities.length - 1) {
          //next token has different role, or this is last token
          //create annotation for current sequence of tokens with same role
          //unless the role is None
          if (role != "None") {
            const annotation = new Annotation()
            //create fact for this annotation, use the role suggested by NLP to set the correct subtype
            const subTypeId = this.nlpRoleToSubtype[role]
            this.$store.commit("addNewFrame", {
              frameTypeId: 'fact',
              subTypeId: subTypeId,
              annotation: annotation,
              openInEditor: false
            })
            //get snippets that are covered by the character range
            const selectionAsSnippets = getSelectedRangeAsSnippets(
              sentence,
              [characterRangeStart, characterRangeEnd]
            )
            //split snippets, and return those that fit the character range
            const selectedSnippets = splitAndReturnSelectedSnippets(
              selectionAsSnippets,
              this.sentences,
            );
            selectedSnippets.forEach((s) => {
              s.addAnnotation(annotation);
            });
          }
          //start new sequence of tokens
          characterRangeStart = tokenRange[0]
        }
      });
    },
    getRange(string, token, lastIndex) {
      // how about a potential second occurrence of the same token?
      const index = string.indexOf(token, lastIndex);
      if (index !== -1) {
        const endIndex = index + token.length;
        return [index, endIndex];
      }
    },
  },
  watch: {
    sentences() {
      console.log("this.sentences", this.sentences);
    },
    snippetIdsOfFrameBeingEdited() {
      console.log("this.snippetIdsOfFramesBeingEdited", this.snippetIdsOfFrameBeingEdited)
    },
    sentenceToScrollTo() {
      if (this.sentenceToScrollTo) {
        const element = this.$refs[`sentence-${this.sentenceToScrollTo.id}`][0];
        element.scrollIntoView({ block: "center", behavior: 'smooth' });
        this.$store.state.sentenceToScrollTo = null
      }
    }
  },
};
</script>

<style scoped>
.document {
  word-wrap: break-word;
}
</style>
