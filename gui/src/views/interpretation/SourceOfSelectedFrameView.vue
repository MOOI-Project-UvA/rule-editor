<template>
    <div class="fit scroll q-pa-sm" v-if="frameBeingEdited">
      <div class="controller-group">
        <div id="checkbox-group" v-if="frameBeingEdited.typeId != 'fact'">
          <span class="text-sm">Show source of: </span>
          <q-checkbox v-model="showSourceOfPrecondition" size="xs">precondition</q-checkbox>
          <q-checkbox v-model="showSourceOfPostcondition" size="xs">postcondition</q-checkbox>
        </div>
        <div class="action-group q-mt-sm q-mb-sm" v-if="frameBeingEdited.sourceSentences.length > 0">
          <q-btn
             size="sm"
             flat
             label="Detect roles in snippets"
             color="primary"
             icon="mdi-text-recognition"
             :loading="nlpIsBusy"
             :disable="frameBeingEdited.sourceSentences.every((s) => s.nlpSelected == false)"
             @click.stop="applyNlpToSource"
             @mouseup.stop
         >
            <q-tooltip anchor="bottom middle" class="text-subtitle2">
              <span>
                Detect roles in the sources of an act frame.<br/>This feature is still
                experimental, so use it with caution.
              </span>
            </q-tooltip>
            <template v-slot:loading>
              <q-spinner-gears />
            </template>
          </q-btn>
        </div>
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
// added for nlp support
import {fetchNlpPrediction} from "../../services/ApiServices.js";

export default {
  data: () => ({
    showSourceOfPrecondition: false,
    showSourceOfPostcondition: false,
    nlpRoleToSubtype: {
      Actor: "agent",
      Recipient: "agent",
      Action: "action",
      Object: "object",
      Duty: "duty",
    },
    nlpIsBusy: false,
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
      const response = await fetchNlpPrediction(sentence.text);
      return response
    },
    applyNlpToSource: async function () {
      console.log("nlp", this.frameBeingEdited.sourceSentences);

      // set the loading indicator to true
      this.nlpIsBusy = true;
      // store the sentences that are sent for analysis and the results in an array.
      const results = []
      // send each source sentence to NLP and get the result.
      for (const sentence of this.frameBeingEdited.sourceSentences) {
        if (!sentence.nlpSelected) continue;
        const response = await this.sendDataToNlp(sentence);
        results.push({ sentence, predictions: response?.predicted_entities });
      }
      // pass the results to the store
      this.$store.commit('setNlpResults', results)
      // set the loading indicator to false
      this.nlpIsBusy = false;
      // show the NLP modal window
      this.$store.commit('setNlpModal', true)
    }
  },
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