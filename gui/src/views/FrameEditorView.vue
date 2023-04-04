<template>
  <div id="current-frame" v-if="frameBeingEdited">
    <template v-if="frameBeingEdited.type == 'act'">
      <ActFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="frameBeingEdited.type == 'fact'">
      <AtomicFactFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="frameBeingEdited.type == 'complexFact'">
      <ComplexFactFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="frameBeingEdited.type == 'duty'">
      <DutyFrameForm @closed="closeActiveFrame" />
    </template>
  </div>
</template>

<script>
import ActFrameForm from "../components/ActFrameForm.vue";
import AtomicFactFrameForm from "../components/AtomicFactFrameForm.vue";
import ComplexFactFrameForm from "../components/ComplexFactFrameForm.vue";
import DutyFrameForm from "../components/DutyFrameForm.vue";

export default {
  components: {
    ActFrameForm,
    AtomicFactFrameForm,
    ComplexFactFrameForm,
    DutyFrameForm,
  },
  computed: {
    activeFrameData() {
      return this.$store.state.activeFrameData;
    },
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
  },
  methods: {
    startNewFrame(type) {
      this.$store.dispatch("startNewFrame", type);
    },
    closeActiveFrame() {
      this.$store.commit("setFrameBeingEdited", null);
    },
  },
};
</script>

<style lang="css" scoped></style>
