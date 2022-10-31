<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
        <div class="text-h6">{{ frame.duty ? frame.duty : "Duty frame" }}</div>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <q-input square outlined clearable v-model="frame.duty" label="Duty" />
      <q-input square outlined clearable v-model="frame.dutyHolder" label="Duty holder" />
      <q-input square outlined clearable v-model="frame.claimant" label="Claimant" />
      <q-input square outlined clearable v-model="frame.creatingAct" label="Creating act" />
      <q-input square outlined clearable v-model="frame.terminatingAct" label="Terminating act" />
      <q-input square outlined clearable v-model="frame.enforcingAct" label="Enforcing act" />
      <q-input square outlined clearable v-model="frame.source" label="Source" />
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  data: () => ({
    frame: {
        type: 'duty',
        duty: null,
        dutyHolder: null,
        claimant: null,
        creatingAct: null,
        terminatingAct: null,
        enforcingAct: null,
        source: null
    }
  }),
  methods: {
    cancelClicked() {
      this.$emit("closed")
    },
    saveClicked() {
      //store frame
      this.$store.commit("addFrame", this.frame)
      this.$emit("closed")
    }
  }
}
</script>

<style lang="css" scoped>
</style>
