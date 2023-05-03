<template>
  <q-card flat bordered id="current-frame" v-if="frameBeingEdited" class="my-card q-ma-sm">
    <template v-if="frameBeingEdited.type === 'act'">
      <ActFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="frameBeingEdited.type === 'fact'">
      <FactFrameForm @closed="closeActiveFrame" />
    </template>
    <template v-if="frameBeingEdited.type === 'duty'">
      <DutyFrameForm @closed="closeActiveFrame" />
    </template>
  </q-card>
</template>

<script>
import ActFrameForm from '../components/ActFrameForm.vue'
import FactFrameForm from '../components/FactFrameForm.vue'
import DutyFrameForm from '../components/DutyFrameForm.vue'
import { icons, colors } from '../helpers/config.js'
import { Fact, Annotation } from '../helpers/flint.js'

export default {
  data: () => ({}),
  components: {
    ActFrameForm,
    FactFrameForm,
    DutyFrameForm
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

<style lang="css" scoped>
#current-frame{
  width: 600px;
}
</style>
