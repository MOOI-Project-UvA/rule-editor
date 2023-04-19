<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
      COMPLEX FACT
    </q-card-section>
    <q-card-section>
      <q-input v-model="frame.label" label="Label" input-style="font-size: 16pt; font-weight:bold" />
    </q-card-section>
    <q-card-section>
      <q-input v-model="frame.fact" label="Fact" autogrow />
    </q-card-section>
    <template v-if="frame && frame.booleanConstruct">
      <BooleanConstructPanel :booleanConstruct="frame.booleanConstruct" :frame="frame" />
    </template>
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { BooleanConstruct } from '../helpers/flint';
import BooleanConstructPanel from './BooleanConstructPanel.vue';
export default {
  data: () => ({
  }),
  components: {
    BooleanConstructPanel,
  },
  mounted() {
    if (!this.frame.booleanConstruct) {
      this.frame.booleanConstruct = new BooleanConstruct()
      this.frame.booleanConstruct.addEmptyChild()
    }
  },
  computed: {
    frame() {
      return this.$store.state.frameBeingEdited;
    },
  },
  methods: {
    cancelClicked() {
      this.$emit("closed");
    },
    saveClicked() {
      console.log("saving", this.frame.booleanConstruct.toFlatObject())
      //store frame
      this.$store.commit("addFrame", this.frame);
      this.$emit("closed");
    },
  },
};
</script>

<style lang="css" scoped></style>
