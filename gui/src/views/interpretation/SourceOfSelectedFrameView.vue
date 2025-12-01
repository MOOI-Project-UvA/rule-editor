<template>
    <div class="fit scroll q-pa-sm" v-if="frameBeingEdited">
       <div v-if="frameBeingEdited.typeId != 'fact'">
        <span class="text-sm">Show source of</span>
        <q-checkbox v-model="showSourceOfPrecondition" size="xs">precondition</q-checkbox>
        <q-checkbox v-model="showSourceOfPostcondition" size="xs">postcondition</q-checkbox>
       </div>
       <div v-if="frameBeingEdited.sourceSentences.length > 0">
         <span class="text-sm">Detect roles in the snippets</span>
         <q-btn
             size="sm"
             round
             flat
             color="primary"
             icon="mdi-text-recognition"
             :loading="nlpIsBusy"
             @click.stop="applyNlpToSource"
             @mouseup.stop
         >
           <q-tooltip anchor="bottom middle" class="text-subtitle2">
             <span>
               Detect roles in the snippetsof an act frame.<br/>This feature is still
               experimental, so use it with caution.
             </span>
           </q-tooltip>
           <template v-slot:loading>
             <q-spinner-gears />
           </template>
         </q-btn>
       </div>
       <div v-for="sourceDoc in sourceDocuments">
            <div class="text-primary text-bold">{{ sourceDoc.title }}</div>
            <SentenceList
                :sentences="getSentencesForFrameInSourceDoc(sourceDoc)"
                :indent="false"
                :showSentenceButtons="true"
                :showDeleteButtons="frameBeingEdited.typeId != 'fact'"
                :isSourceOfSelectedFrame="true"
                @sentenceButtonClicked="scrollToSource"
                @deleteButtonClicked="removeSentenceFromSource"
            />
            <div v-if="getSentencesForFrameInSourceDoc(sourceDoc).length == 0">-</div>
        </div>
    </div>
</template>
<script>
import SentenceList from "../../components/SentenceList.vue";
import {fetchNlpPrediction} from "../../services/ApiServices.js";
export default {
  data: () => ({
    showSourceOfPrecondition: false,
    showSourceOfPostcondition: false,
  }),
  components: {
    SentenceList
  },
  computed: {
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
    sourceDocuments() {
      return this.$store.state.sourceDocuments;
    },
    nlpIsBusy() {
      //if nlp is not ready for one or more of this act's sentences, return true
      return this.frameBeingEdited.sourceSentences.some((s) => s.loading);
    },
  },
  methods: {
    //in source view, scroll to clicked sentence
    scrollToSource(sentence) {
      //show correct source
      this.$store.state.displayedSourceDocument = sentence.sourceDocument
      //scroll to sentence
      this.$store.state.sentenceToScrollTo = sentence
    },
    removeSentenceFromSource(sentence) {
      const index = this.frameBeingEdited.sourceSentences.findIndex(s => s.id == sentence.id)
      this.frameBeingEdited.sourceSentences.splice(index, 1)
    },
    getSentencesForFrameInSourceDoc(doc) {
      let sentences = this.frameBeingEdited.typeId == "fact"
          ? doc.getSentencesForFrame(this.frameBeingEdited)
          : this.frameBeingEdited.sourceSentences.filter(s => s.sourceDocument.id == doc.id)
              //add sentences for pre and postcondition
              .concat(this.showSourceOfPrecondition
                  ? this.frameBeingEdited.precondition.allFramesNoSubdivision
                      .map(frame => doc.getSentencesForFrame(frame)).flat()
                  : [])
              .concat(this.showSourceOfPostcondition
                  ? this.frameBeingEdited.creates.concat(this.frameBeingEdited.terminates)
                      .map(frame => doc.getSentencesForFrame(frame)).flat()
                  : []
              )
              .filter((sentence, index, sentences) => sentences.findIndex(s => s.id == sentence.id) === index);


      sentences.sort((s1, s2) => s1.id.localeCompare(s2.id))
      return sentences
    },
    async sendDataToNlp(sentence) {
      sentence.loading = true;
      // store the sentence that is sent for analysis..
      this.$store.commit("setTextToNlp", sentence)
      const response = await fetchNlpPrediction(sentence.text);
      //filter out entries with no role
      let entities = response.predicted_entities; //.filter(([_, role]) => role != "None")

      sentence.loading = false;
      console.log("entities", entities);
      //ignore entities that have special tokens like '[CLS]'.
      entities = entities.filter(
          ([token, _]) => sentence.text.indexOf(token) != -1,
      );

      this.$store.commit('setNlpModal', true)

      //current character range of subsequent tokens with equal roles
      // let characterRangeStart = 0;
      // let characterRangeEnd = 0;
      // entities.forEach(([token, role], index) => {
      //   //get start and end index of token in sentence
      //   const tokenRange = this.getRange(
      //     sentence.text,
      //     token,
      //     characterRangeEnd,
      //   );
      //
      //   characterRangeEnd = tokenRange[1];
      //
      //   if (
      //     (index < entities.length - 1 && role != entities[index + 1][1]) ||
      //     index == entities.length - 1
      //   ) {
      //     //next token has different role, or this is last token
      //     //create annotation for current sequence of tokens with same role
      //     //unless the role is None
      //     if (role != "None") {
      //       const annotation = new Annotation();
      //       //create fact for this annotation, use the role suggested by NLP to set the correct subtype
      //       const subTypeId = this.nlpRoleToSubtype[role];
      //       this.$store.commit("addNewFrame", {
      //         frameTypeId: "fact",
      //         subTypeId: subTypeId,
      //         annotation: annotation,
      //         openInEditor: false,
      //       });
      //       //get snippets that are covered by the character range
      //       const selectionAsSnippets = getSelectedRangeAsSnippets(sentence, [
      //         characterRangeStart,
      //         characterRangeEnd,
      //       ]);
      //       //split snippets, and return those that fit the character range
      //       const selectedSnippets = splitAndReturnSelectedSnippets(
      //         selectionAsSnippets,
      //         this.frame.sourceSentences,
      //       );
      //       selectedSnippets.forEach((s) => {
      //         console.log("adding", annotation, "to snippet", s);
      //         s.addAnnotation(annotation);
      //       });
      //       //set length of annotation in number of snippets. this is used to set the order of the underlining: long annotations
      //       //will be closer to the text than shorter ones
      //       annotation.nrSnippets = selectedSnippets.length;
      //       //update underlining of annotations in the source text, for the currently showing document
      //       setVerticalPositionOfAnnotationLines(this.displayedSourceDocument);
      //     }
      //     //start new sequence of tokens
      //     characterRangeStart = tokenRange[0];
      //   }
      // });
    },
    applyNlpToSource() {
      console.log("nlp", this.frameBeingEdited.sourceSentences);
      // sending multiple snippets at the same time. all of them at once in the source of
      // selected frame pane ...
      // New approach:
      // Show modal window ...
      // Show recommendations ...
      // accept/reject
      // integrate into the interpretation the accepted ones.
      this.frameBeingEdited.sourceSentences.forEach((sentence) => {
        this.sendDataToNlp(sentence);
      });
    }
  },
  watch: {
    frameBeingEdited() {
      //console.log("frameBeingEdited", this.frameBeingEdited)
    }
  }
}
</script>

<style>
.highlighted {
    /* background-color: #eeeeee; */
    text-decoration: underline;
    font-weight: bold;
}

.scrollable {
  overflow-y: auto;
}

.fill-height {
  height: calc(100vh - 180px);
}
</style>