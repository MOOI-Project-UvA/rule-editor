<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
      <div class="row">
        <div class="col-2">FACT {{ frame.subType && !frame.isComplex ? "of sub-type " + frame.subType.label : "" }}</div>
        <div class="col q-gutter-sm">
          <q-btn size="sm" round v-for="subType in factSubTypes"
            :color="frame.subType && frame.subType.id == subType.id ? colors[subType.id] : 'grey-6'"
            :icon="icons[subType.id]" @click="setSubType(subType)">
            <q-tooltip class="text-subtitle2">
              Set subtype to {{ subType.label }}
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col-1">
          <q-btn size="sm" round flat color="primary" icon="mdi-comment-text-outline" @click="toggleComments">
            <q-tooltip class="text-subtitle2">
              Add comment
            </q-tooltip>
          </q-btn>
        </div>
      </div>

    </q-card-section>
    <q-card-section>
      <q-input v-model="frame.label" label="Label" input-style="font-size: 16pt; font-weight:bold" />
    </q-card-section>
    <q-card-section>
      <q-input v-model="frame.fact" label="Fact" autogrow />
    </q-card-section>
    <div class="row">
      <div class="col q-gutter-sm">
        <q-checkbox size="sm" v-model="frame.isComplex" label="Fact is subdivided" />
      </div>
    </div>
    <q-card-section v-if="frame.isComplex">
      <div class="label">Subdivision</div>
      <BooleanConstructPanel :booleanConstruct="frame.subdivision" :frame="frame" />
    </q-card-section>
    <q-card-section>
      <q-toggle v-model="showSource" label="Show source" @update:model-value="toggleShowSource" />
      <!-- <q-toggle v-model="subdivided" label="Subdivide in facts" @update:model-value="toggleSubdivision" /> -->
    </q-card-section>
    <q-card-actions align="right">
      <q-btn color="primary" @click="closeForm">Cancel</q-btn>
      <q-btn color="primary" @click="saveFrame">Save</q-btn>
    </q-card-actions>
  </q-card>
  <CommentsList :fact="frame" :showComments="showComments" @closed="() => { showComments = false }" />
</template>

<script>
import { icons, colors } from '../helpers/config.js'
import CommentsList from './CommentsList.vue';
import BooleanConstructPanel from './BooleanConstructPanel.vue'
import { BooleanConstruct } from '../model/booleanConstruct.js';
import { frameTypes } from "../model/frame";

export default {
  emits: ["closed"],
  data: () => ({
    icons: icons,
    colors: colors,
    subdivided: false,
    showSource: false,
    showComments: false
  }),
  computed: {
    console: () => console,
    frame() {
      return this.$store.state.frameBeingEdited;
    },
    factSubTypes() {
      const factType = frameTypes.find(f => f.id == "fact")
      return factType.subTypes
    }
  },
  mounted() {
    if (this.frame.booleanConstruct) {
      this.subdivided = true
    }
  },
  methods: {
    closeForm() {
      this.$store.commit("cancelFrameBeingEdited")
    },
    saveFrame() {
      this.$store.commit("saveFrameBeingEdited")
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
    toggleShowSource() {
      this.$store.commit("setShowFrameSource", this.showSource)
    },
    toggleComments() {
      this.showComments = !this.showComments
    },
    setSubType(subType) {
      this.frame.subType = this.frame.subType && this.frame.subType.id == subType.id ? null : subType
    }
  },
  components: { BooleanConstructPanel, CommentsList }
}
</script>

<style lang="css" scoped></style>
