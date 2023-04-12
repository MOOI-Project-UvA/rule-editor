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
    <BooleanConstructPanel :booleanConstruct="frame.booleanConstruct" :frame="frame" />
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import BooleanConstructPanel from './BooleanConstructPanel.vue';
export default {
  data: () => ({
  }),
  components: {
    BooleanConstructPanel,
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
      //store frame
      this.$store.commit("addFrame", this.frame);
      this.$emit("closed");
    },
  },
};
</script>

<style lang="css" scoped></style>
