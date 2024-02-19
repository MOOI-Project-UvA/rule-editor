<template>
  <q-card flat bordered id="current-frame" v-if="frameBeingEdited" class="my-card q-ma-sm">
    <template v-if="frameBeingEdited.type.class == 'fact'">
      <FactFrameForm />
    </template>
    <template v-else-if="frameBeingEdited.type.id == 'act'">
      <ActFrameForm />
    </template>
    <template v-else-if="frameBeingEdited.type.id == 'claim_duty'">
      <ClaimdutyFrameForm />
    </template>
  </q-card>
</template>

<script>
import ActFrameForm from "../components/ActFrameForm.vue";
import FactFrameForm from "../components/FactFrameForm.vue";
import ClaimdutyFrameForm from "../components/ClaimdutyFrameForm.vue";

export default {
  data: () => ({}),
  components: {
    ActFrameForm,
    FactFrameForm,
    ClaimdutyFrameForm,
  },
  computed: {
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
  },
};
</script>

<style lang="css" scoped>
#current-frame {
  width: 100%;
}
</style>
