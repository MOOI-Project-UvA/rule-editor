<template>
  <div class="document">
    <div class="q-mb-sm row no-wrap items-baseline" v-for="sentence in sentences.filter(s => s.visible)">
      <div>
        <q-btn v-if="sentence.children.filter(c => c.text.length > 0).length > 0" round size="sm"
          :icon="sentence.collapsed ? 'mdi-chevron-right' : 'mdi-chevron-down'" flat text-color="primary"
          @click="sentence.toggleCollapse()"></q-btn>
      </div>

      <div :ref="`sentence-${sentence.iri}`" @mouseup="handleSelection" :style="getStyleForSentence(sentence)">
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
import { getStyleForSentenceFormat } from "../helpers/sourceFormatting.js"
import { Annotation } from "../model/annotation";

export default {
  props: {
    sentences: Array //these sentences have been filtered according to their 'selected' property in SourceView
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
    getStyleForSentence(sentence) {
      return {
        ...getStyleForLineSpacing(sentence),
        ...getStyleForSentenceFormat(sentence)
      }
    },
    handleSelection(event) {
      const selection = window.getSelection();
      if (selection.toString().length > 0) {
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
            'activeField' in this.frameBeingEdited && //frame should have roles
            this.frameBeingEdited.activeField
          ) {
            //if there is only one subtype allowed for this fact, assign that subtype to the frame
            const subTypeId =
              this.frameBeingEdited.allowedSubTypesForActiveField.length == 1
                ? this.frameBeingEdited.allowedSubTypesForActiveField[0]
                : null;

            //store reference to the currently being edited frame
            const relationFrame = this.$store.state.frameBeingEdited;
            console.log("adding new fact with label", selection.toString())
            this.$store.commit("addNewFrame", {
              frameTypeId: 'fact',
              subTypeId: subTypeId,
              annotation: annotation,
              openInEditor: true,
              initialLabel: selection.toString()
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
        //set length of annotation in number of snippets. this is used to set the order of the underlining: long annotations
        //will be closer to the text than shorter ones
        annotation.nrSnippets = selectedSnippets.length
        //update underlining of annotations in the source text, for the currently showing document
        setVerticalPositionOfAnnotationLines(this.displayedSourceDocument)

        selection.empty()
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
    //when user pressed 'scroll to source'
    scrollToSentence() {
      if (this.sentenceToScrollTo) {
        const ref = this.$refs[`sentence-${this.sentenceToScrollTo.iri}`]
        if (ref && ref.length > 0 && ref[0]) {
          ref[0].scrollIntoView({ block: "center", behavior: 'smooth' });
          this.$store.state.sentenceToScrollTo = null
        }
      }
    }
  },
  watch: {
    sentenceToScrollTo() {
      this.scrollToSentence()
    },
    sentences() {
      this.scrollToSentence()
    }
  },
};
</script>

<style scoped>
.document {
  word-wrap: break-word;
}
</style>
