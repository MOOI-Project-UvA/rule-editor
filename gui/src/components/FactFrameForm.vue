<template>
  <q-card flat bordered class="my-card">
    <q-card-section>
      <div class="row">
        <div class="col-2">FACT {{ frame.subTypeId ? "of sub-type " + frameTypes.fact.subTypes[frame.subTypeId].label :
          "" }}
        </div>
        <div class="col q-gutter-sm">
          <q-btn size="sm" round v-for="(subType, subTypeId) in frameTypes.fact.subTypes"
            :color="frame.subTypeId == subTypeId ? colors[subTypeId] : 'grey-6'" :icon="icons[subTypeId]"
            @click="setSubType(subTypeId)">
            <q-tooltip class="text-subtitle2">
              Set subtype to {{ subType.label }}
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col-1">
          <q-btn size="sm" round flat color="primary" icon="mdi-comment-text-outline"
            @click="showComments = !showComments">
            <q-badge v-if="frame.comments.length > 0" color="primary" floating>{{ frame.comments.length }}</q-badge>
            <q-tooltip class="text-subtitle2">
              Comments
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
      <template v-if="frameIsBeingDeleted">
        <div class="q-mr-sm">Are you sure you want to delete this frame?</div>
        <q-btn color="negative" @click="deleteFrame">Yes
          <q-tooltip class="text-subtitle2">
            Delete this frame
          </q-tooltip>
        </q-btn>
        <q-btn color="primary" @click="frameIsBeingDeleted = false">No</q-btn>
      </template>
      <template v-else>
        <q-btn color="negative" @click="frameIsBeingDeleted = true">Delete</q-btn>
        <q-btn color="primary" @click="closeFrame">Close
          <q-tooltip class="text-subtitle2">
            Any changes have been saved
          </q-tooltip>
        </q-btn>
      </template>
    </q-card-actions>
  </q-card>
  <CommentsList :fact="frame" :showComments="showComments" @closed="showComments = false" />
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
    showComments: false,
    frameTypes: frameTypes,
    frameIsBeingDeleted: false //true when user clicked delete button
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
  },
  methods: {
    closeFrame() {
      this.$store.commit("removeFrameFromEditList", this.frame)
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
    setSubType(subTypeId) {
      this.frame.subTypeId = this.frame.subTypeId == subTypeId ? null : subTypeId
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
