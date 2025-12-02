<script>
import SentenceList from "./SentenceList.vue";
import AnnotatedRecommendations from "./AnnotatedRecommendations.vue";

export default {
  name: "NlpModal",
  components: {SentenceList, AnnotatedRecommendations},
  data(){
    return {
      sampleText:
        'Indien door het college is vastgesteld dat recht op bijstand bestaat, wordt de bijstand toegekend vanaf de dag waarop dit recht is ontstaan, voorzover deze dag niet ligt voor de dag waarop de belanghebbende zich heeft gemeld om bijstand aan te vragen.',
      sampleAnnotations: [
          {
          id: '1',
          text: 'wordt',
          type: 'Action',
          start: 70,
          end: 75,
          status: 'pending'
        },
        {
          id: '2',
          text: 'de bijstand',
          type: 'Object',
          start: 76,
          end: 87,
          status: 'pending'
        },
        {
          id: '3',
          text: 'toegekend',
          type: 'Action',
          start: 88,
          end: 97,
          status: 'pending'
        }
        ]
    }
  },
  computed: {
    showNlpModal(){
      return this.$store.state.showNlpModal
    },
    sentencesToNlp(){
      return this.$store.state.textSentToNlp
    }
  },
  mounted(){
    console.log("NLP Modal mounted with sentences: ", this.sentencesToNlp)
  },
  methods:{
    closeNlpModal(){
      // close nlp modal
      this.$store.commit('setNlpModal',false);
      // remove the sentences sent for analysis to model
      this.$store.commit('setTextToNlp', []);
    }
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
<!--          <SentenceList-->
<!--            :sentences="sentencesToNlp"-->
<!--            :indent="false"-->
<!--            :showSentenceButtons="false"-->
<!--            :isSourceOfSelectedFrame="false"-->
<!--          />-->
          <div class="recommendations-section">
            <AnnotatedRecommendations :text="sampleText" :annotations="sampleAnnotations"></AnnotatedRecommendations>
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
          <q-btn flat label="OK" @click="closeNlpModal" />
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