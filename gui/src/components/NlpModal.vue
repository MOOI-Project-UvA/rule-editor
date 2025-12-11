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
            console.log("recommendedAnnotations:", recommendedAnnotations.filter(a => a.status === 'accepted'))
            console.log("sentence:", sentence)
            console.log("index:", index)

            // if there multiple snippets and there are no accepted annotations in one, skip it
            if (recommendedAnnotations.filter(a => a.status === 'accepted').length === 0) return;

            for (let i=0;i<recommendedAnnotations.filter(a => a.status === 'accepted').length;i++){
              const annotation = new Annotation();
              console.log("recommendedAnnotation:", recommendedAnnotations[i])
              const role = recommendedAnnotations[i].type
              console.log("role", role)
              console.log("this.nlpRoleToSubtype", this.nlpRoleToSubtype)
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
                console.log("adding", annotation, "to snippet", s);
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
    acceptActions(){
      console.log("clicking OK!", this.acceptedRecommendations)
      // close nlp modal
      this.$store.commit('setNlpModal',false);
      // remove the sentences sent for analysis to model
      this.$store.commit('setTextToNlp', []);
      // TODO: make the recommendations part of the interpretation
      this.acceptedRecommendations > 0 ? this.integrateRecommendations() : null
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
          Click on the highlighted words to accept or discard the annotations. Each annotation type has its own color - green indicates accepted, faded red with dashed border indicates discarded.
        </q-card-section>
        <q-card-section class="col">
          <div class="recommendations-section mb-2" v-for="(sentence,index) in nlpResults" :key="`sentence-${index}`">
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
              <div class="text-h6">Annotation Type Colors:</div>
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
            <div class="legend-item">
              <span class="swatch accepted"></span>
              <span class="label">Accepted</span>
            </div>
            <div class="legend-item">
              <span class="swatch discarded"></span>
              <span class="label">Discarded</span>
            </div>
          </div>
            </div>
            <div class="instructions">
              <h2 class="text-h6">How to use:</h2>
              <ul class="instructions-list">
                <li>• Click on highlighted words to see annotation details</li>
                <li>• Each annotation type has its own color as shown above</li>
                <li>• Use the "Accept" button to approve the annotation</li>
                <li>• Use the "Discard" button to reject the annotation</li>
                <li>• Accepted annotations turn green, discarded ones become faded with a dashed border</li>
                <li>• The status summary shows counts of pending, accepted, and discarded annotations</li>
              </ul>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          {{acceptedRecommendations}}
          <q-btn flat label="Cancel" color="negative" @click="closeNlpModal" />
          <q-btn flat label="OK" @click="acceptActions" :disable="totalPendingCount >0" color="primary">
            <q-tooltip v-if="totalPendingCount > 0" anchor="top middle" self="bottom middle" :offset="[10, 10]" class="text-body2">
              There are still pending annotations. Please accept or discard them before proceeding further.
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

.swatch.actor { background: #FEF9C3; border-color: #FDE68A; }
.swatch.action { background: #CCFBF1; border-color: #99F6E4; }
.swatch.object { background: #FFF7ED; border-color: #FFD8A8; }
.swatch.recipient { background: #FEF9C3; border-color: #FDE68A; }
.swatch.accepted { background: #DCFCE7; border-color: #86EFAC; }
.swatch.discarded { background: #FFEBEE; border-color: #FBCACA; opacity: 0.8; }

.instructions-list {
  margin: 8px 0 0 0;
  padding-left: 0;
  list-style: none;
  color: #555;
}

.instructions-list li {
  margin-bottom: 6px;
}
</style>