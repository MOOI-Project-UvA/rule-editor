<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
        <div class="text-h6">{{ frame.act ? frame.act : "Act frame" }}</div>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <q-input square outlined clearable v-model="frame.act" label="Act" />
      <q-input square outlined clearable v-model="frame.action" label="Action" />
      <q-input square outlined clearable v-model="frame.actor" label="Actor" />
      <q-input square outlined clearable v-model="frame.object" label="Object" />
      <q-input square outlined clearable v-model="frame.precondition" label="Precondition" />
      <q-input square outlined clearable v-model="frame.recipient" label="Recipient" />
      <q-input square outlined clearable v-model="frame.resultPos" label="Result (+)" />
      <q-input square outlined clearable v-model="frame.resultNeg" label="Result (-)" />
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
        type: 'act',
        act: null,
        action: null,
        actor: null,
        object: null,
        precondition: null,
        recipient: null,
        resultPos: null,
        resultNeg: null,
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
