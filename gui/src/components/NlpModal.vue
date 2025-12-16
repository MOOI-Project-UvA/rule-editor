<script>
import SentenceList from "./SentenceList.vue";
import AnnotatedRecommendations from "./AnnotatedRecommendations.vue";
import {buildAnnotations} from "../helpers/utilities.js";
import {Annotation} from "../model/annotation.js";
import { setVerticalPositionOfAnnotationLines } from "../helpers/underlining.js";
import { getSelectedRangeAsSnippets,splitAndReturnSelectedSnippets } from "../helpers/annotating.js";

export default {
  name: "NlpModal",
  components: {SentenceList, AnnotatedRecommendations},
  data(){
    return {
      pendingCounts: [], // combines the counts of the pending annotation in the children component
      nlpRoleToSubtype: {
        Actor: "agent",
        Recipient: "agent",
        Action: "action",
        Object: "object",
        Duty: "duty",
      },
    }
  },
  computed: {
    showNlpModal(){
      return this.$store.state.showNlpModal
    },
    nlpResults(){
      return this.$store.state.nlpResults
    },
    totalPendingCount() {
      return this.pendingCounts.reduce((sum, c) => sum + c, 0);
    },
    acceptedRecommendations(){
      return this.nlpResults.map(r => r.recommendedAnnotations)
          .reduce((accumulator, currentValue) => accumulator + currentValue.filter(z => (z.status === 'accepted')).length, 0);
    },
    reviewedRecommendations(){
      return this.nlpResults.map(r => r.recommendedAnnotations)
          .reduce((accumulator, currentValue) => accumulator + currentValue.filter(z => (z.status === 'accepted' || z.status === 'discarded')).length, 0);
    },
    displayedSourceDocument() {
      return this.$store.state.displayedSourceDocument;
    },
    frameBeingEdited(){
      return this.$store.state.frameBeingEdited;
    }
  },
  mounted(){
    console.log("NLP Modal mounted with sentences")
  },
  beforeUpdate() {
    console.log("this.sentencesToNlp:", this.nlpResults)
    this.nlpResults.forEach((r)=>{
      r.recommendedAnnotations = buildAnnotations(r.predictions,r.sentence.text)
    })
  },
  methods:{
    updatePendingCount({ index, count }) {
      this.pendingCounts[index] = count;
    },
    closeNlpModal(){
      // close nlp modal
      this.$store.commit('setNlpModal',false);
      // remove the sentences sent for analysis to model
      this.$store.commit('setNlpResults', []);
    },
    integrateRecommendations(){

      this.nlpResults.forEach(
          ({recommendedAnnotations, sentence},index)=>{

            // if there multiple snippets and there are no accepted annotations in one, skip it
            if (recommendedAnnotations.filter(a => a.status === 'accepted').length === 0) return;

            for (let i=0;i<recommendedAnnotations.filter(a => a.status === 'accepted').length;i++){
              const annotation = new Annotation();
              const role = recommendedAnnotations[i].type
              //create fact for this annotation, use the role suggested by NLP to set the correct subtype
              const subTypeId = this.nlpRoleToSubtype[role];
              this.$store.commit("addNewFrame", {
                frameTypeId: "fact",
                subTypeId: subTypeId,
                annotation: annotation,
                openInEditor: false,
              });
              //get snippets that are covered by the character range
              const selectionAsSnippets = getSelectedRangeAsSnippets(sentence, [recommendedAnnotations[i].start,
                recommendedAnnotations[i].end,
              ]);

              //split snippets, and return those that fit the character range
              const selectedSnippets = splitAndReturnSelectedSnippets(
                  selectionAsSnippets,
                  this.frameBeingEdited.sourceSentences,
              );

              selectedSnippets.forEach((s) => {
                s.addAnnotation(annotation);
              });

              //set length of annotation in number of snippets. this is used to set the order of the underlining: long annotations
              //will be closer to the text than shorter ones
              annotation.nrSnippets = selectedSnippets.length;
              //update underlining of annotations in the source text, for the currently showing document
              setVerticalPositionOfAnnotationLines(this.displayedSourceDocument);
            }
          })
    },
    acceptActions: function () {
      // close nlp modal
      this.$store.commit('setNlpModal', false);
      // remove the sentences sent for analysis to model
      this.$store.commit('setTextToNlp', []);
      // if any recommendations were accepted, integrate them into the interpretation
      if(this.acceptedRecommendations > 0) this.integrateRecommendations();
    },

  }
}
</script>

<template>
  <div id="nlp-modal-div">
    <q-dialog
      v-model="showNlpModal"
      persistent
    >
      <q-card style="width: 900px">
        <q-card-section class="col">
          <div class="text-h6">FlintFiller Recommendations</div>
        </q-card-section>
        <q-card-section class="col q-pt-none">
          Review the FlintFiller recommendations. Click on a highlighted text snippet to accept, discard, or skip the recommendation. Click Cancel to return to the interpretation view without making changes, or click OK to integrate the accepted recommendations into the interpretation.
        </q-card-section>
        <q-card-section class="col">
          <div class="recommendations-section q-mb-sm" v-for="(sentence,index) in nlpResults" :key="`sentence-${index}`">
            <AnnotatedRecommendations
                ref="annotatedRecommendations"
                :index=index
                :text="sentence.sentence.text"
                v-model:annotations="sentence.recommendedAnnotations"
                @pending-count-changed="updatePendingCount"
            />
          </div>
          <div class="bottom q-mx-sm">
            <div class="legend">
              <div class="text-h6">Roles:</div>
              <div class="legend-grid">
            <div class="legend-item">
              <span class="swatch actor"></span>
              <span class="label">Actor</span>
            </div>
            <div class="legend-item">
              <span class="swatch action"></span>
              <span class="label">Action</span>
            </div>
            <div class="legend-item">
              <span class="swatch object"></span>
              <span class="label">Object</span>
            </div>
            <div class="legend-item">
              <span class="swatch recipient"></span>
              <span class="label">Recipient</span>
            </div>
          </div>
            </div>
          </div>
        </q-card-section>
        {{reviewedRecommendations}}
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Cancel" color="negative" @click="closeNlpModal" />
          <q-btn flat label="OK" @click="acceptActions" :disable="reviewedRecommendations === 0" color="primary">
            <q-tooltip v-if="reviewedRecommendations === 0 && totalPendingCount > 0" anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-body2">
              You have not reviewed any recommendations yet.
            </q-tooltip>
            <q-tooltip v-if="reviewedRecommendations > 0 && totalPendingCount > 0" anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-body2">
              Have in mind that there are still pending annotations.
            </q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<style scoped lang="css">

.recommendations-section {
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 16px;
}

.bottom {
  margin-top: 20px;
  display: grid;
  gap: 18px;
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.swatch {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.swatch.actor { background: #F2C037; border-color: #FDE68A; }
.swatch.action { background: #26A69A; border-color: #99F6E4; }
.swatch.object { background: #ff6f00; border-color: #FFD8A8; }
.swatch.recipient { background: #F2C037; border-color: #FDE68A; }

</style>