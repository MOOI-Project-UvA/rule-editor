<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
      <div class="row">
        <div class="col-2">FACT {{ frame.subType && !frame.isComplex ? "of sub-type " + frame.subType.label : "" }}
        </div>
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
      <template v-if="sentences?.length > 0">
        <SentenceList :sentences="sentences" />
      </template>
      <template v-else>
        <div class="source-text">No source added yet</div>
      </template>
    </q-card-section>
    <q-card-section>
      <q-input v-model="frame.label" label="Label" input-style="font-size: 16pt; font-weight:bold" />
    </q-card-section>
    <q-card-section>
      <q-input v-model="frame.fact" label="Fact" autogrow />
    </q-card-section>
    <!-- <div class="row">
      <div class="col q-gutter-sm">
        <q-checkbox size="sm" v-model="frame.isComplex" label="Fact is subdivided" />
      </div>
    </div> -->
    <q-card-section v-if="frame.isComplex">
      <div class="label">Subdivision</div>
      <BooleanConstructPanel :booleanConstruct="frame.subdivision" :frame="frame" />
    </q-card-section>
    <!-- <q-card-section>
      <q-toggle v-model="showSource" label="Show source" @update:model-value="toggleShowSource" />
      <q-toggle v-model="subdivided" label="Subdivide in facts" @update:model-value="toggleSubdivision" />
    </q-card-section> -->
    <q-card-actions align="right">
      <template v-if="isExistingFrame">
        <q-btn color="negative" @click="deleteFrame">Delete</q-btn>
        <div class="message">Any changes have been saved</div>
        <q-btn color="primary" @click="saveFrame">Close</q-btn>
      </template>
      <template v-else>
        <q-btn color="negative" @click="cancelFrame">Delete</q-btn>
        <q-btn color="primary" @click="saveFrame">Save</q-btn>
      </template>
    </q-card-actions>
  </q-card>
  <CommentsList :fact="frame" :showComments="showComments" @closed="() => { showComments = false }" />
</template>

<script>
import { icons, colors } from '../helpers/config.js'
import CommentsList from './CommentsList.vue';
import SentenceList from "./SentenceList.vue"
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
    sourceDocuments() {
      return this.$store.state.sourceDocuments;
    },
    sentences() {
      return this.sourceDocuments
        .map(sourceDoc => sourceDoc.getSentencesForFrame(this.frame))
        .flat()
    },
    frame() {
      return this.$store.state.frameBeingEdited;
    },
    frames() {
      return this.$store.state.frames;
    },
    isExistingFrame() {
      return this.frames.some((f) => f.id == this.frame.id)
    },
    factSubTypes() {
      const factType = frameTypes.find(f => f.id == "fact")
      return factType.subTypes
    },
  },
  mounted() {
    if (this.frame.booleanConstruct) {
      this.subdivided = true
    }
  },
  methods: {
    cancelFrame() {
      this.$store.commit("cancelFrameBeingEdited")
    },
    saveFrame() {
      this.$store.commit("saveFrameBeingEdited")
    },
    deleteFrame() {
      this.$store.commit("removeFrame", this.frame)
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
  components: { BooleanConstructPanel, CommentsList, SentenceList }
}
</script>

<style lang="css" scoped>
.message {
  font-size: 10pt;
  font-style: italic;
  margin-right: 10px;
}
</style>
