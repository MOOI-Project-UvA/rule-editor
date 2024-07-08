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
  setVerticalPositionOfAnnotationLines
} from "../helpers/underlining.js";
import { Annotation } from "../model/annotation";

export default {
  props: {
    sentences: Array
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
        const selectedSnippets = splitAndReturnSelectedSnippets(
          selectionAsSnippets,
          this.sentences,
        );
        selectedSnippets.forEach((s) => {
          s.addAnnotation(annotation);
        });
        //set length of annotation in number of snippets. this is used to set the order of the underlining.
        annotation.nrSnippets = selectedSnippets.length
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
    }
  },
  watch: {
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
