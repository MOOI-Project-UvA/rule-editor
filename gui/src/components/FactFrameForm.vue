<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
      FACT of type <i>{{ frame.subClass }}</i>
      <div class="float-right">
        <q-btn size="sm" round flat color="primary" icon="mdi-comment-text-outline" @click="toggleComments">
        </q-btn>
      </div>
    </q-card-section>
    <q-card-section>
      <q-input v-model="frame.label" label="Label" input-style="font-size: 16pt; font-weight:bold" />
    </q-card-section>
    <q-card-section>
      <q-input v-model="frame.fact" label="Fact" autogrow />
    </q-card-section>
    <q-toggle v-model="subdivided" label="Subdivide in facts" @update:model-value="toggleSubdivision" />
    <q-card-section v-if="subdivided">
      <q-input class="pb-sm" v-model="frame.annotation.annotatedText" label="Source" autogrow readonly />
      <BooleanConstructPanel :booleanConstruct="frame.booleanConstruct" :frame="frame" />
    </q-card-section>
    <q-card-actions>
      <q-btn flat @click="cancelClicked">Cancel</q-btn>
      <q-btn color="primary" @click="saveClicked">Save</q-btn>
    </q-card-actions>
  </q-card>
  <CommentsList :fact="frame" :showComments="showComments" @closed="() => { showComments = false }" />
</template>

<script>
import { icons, colors } from '../helpers/config.js'
import CommentsList from './CommentsList.vue';
import BooleanConstructPanel from './BooleanConstructPanel.vue'
import { BooleanConstruct } from '../helpers/flint';


export default {
  emits: ["closed"],
  data: () => ({
    icons: icons,
    colors: colors,
    subdivided: false,
    showComments: false
  }),
  computed: {
    frame() {
      return this.$store.state.frameBeingEdited;
    }
  },
  mounted() {
    if (this.frame.booleanConstruct) {
      this.subdivided = true
    }
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
    toggleSubdivision() {
      if (this.subdivided) {
        if (!this.frame.booleanConstruct) {
          this.frame.booleanConstruct = new BooleanConstruct()
          this.frame.booleanConstruct.addEmptyChild()
        }

      } else {
        this.frame.booleanConstruct = null
      }
    },
    toggleComments() {
      this.showComments = !this.showComments
    }
  },
  components: { BooleanConstructPanel, CommentsList }
}
</script>

<style lang="css" scoped></style>
