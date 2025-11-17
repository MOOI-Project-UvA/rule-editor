<script>
import SentenceList from "./SentenceList.vue";

export default {
  name: "NlpModal",
  components: {SentenceList},
  computed: {
    showNlpModal(){
      return this.$store.state.showNlpModal
    },
    sentencesToNlp(){
      return this.$store.state.textSentToNlp
    }
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
      full-height
      persistent
    >
      <q-card class="column full-height" style="width: 700px">
        <q-card-section>
          <div class="text-h6">FlintFiller Recommendations</div>
        </q-card-section>
        <q-card-section class="col q-pt-none">
          Click on the highlighted words to accept or discard the annotations. Each annotation type has its own color - green indicates accepted, faded red with dashed border indicates discarded.
        </q-card-section>

        <q-card-section class="col q-ma-lg" style="border: 1px solid lightgrey;">
          <SentenceList
            :sentences="sentencesToNlp"
            :indent="true"
            :showSentenceButtons="false"
            :isSourceOfSelectedFrame="false"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" @click="closeNlpModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<style scoped lang="css">

</style>