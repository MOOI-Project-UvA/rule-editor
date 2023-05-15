<template>
  <q-card flat bordered class="my-card q-ma-sm">
    <!-- card title section -->
    <q-item>
      <q-item-section>
        <q-item-label>Interpretation view</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-avatar>
          <q-icon name="mdi-information-outline" class="cursor-pointer"></q-icon>
          <q-tooltip>
            <div style="max-width: 300px">
              In this view, you can see the annotations made in the source view.
              The annotations are facts and are grouped by type. By clicking on
              a fact, you can add them to complex facts or acts (right view).
            </div>
          </q-tooltip>
        </q-avatar>
      </q-item-section>
    </q-item>
    <q-separator />
    <!-- main content of the card  -->
    <q-item>
      <div id="frame-chip-container">
        <div id="status">{{ message }}</div>
        <div id="fact-container">
          <div id="agent-container" class="chip-container">
            <div><b>Agents</b></div>
            <div class="message" v-if="agents.length === 0">No available agents</div>
            <div class="chips">
              <div v-for="frame in agents" @click="onClick(frame)">
                <FrameChip :frame="frame" :disable="allowedSubTypes &&
                  frame.type === 'fact' &&
                  !allowedSubTypes.includes(frame.subClass)
                  " :removable="message === 'Click to edit'" functionality="chip-container" />
              </div>
            </div>
          </div>

          <div id="action-container" class="chip-container">
            <div><b>Actions</b></div>
            <div class="message" v-if="actions.length === 0">No available actions</div>
            <div class="chips">
              <div v-for="frame in actions" @click="onClick(frame)">
                <FrameChip :frame="frame" :disable="allowedSubTypes &&
                  frame.type === 'fact' &&
                  !allowedSubTypes.includes(frame.subClass)
                  " :removable="message === 'Click to edit'" functionality="chip-container" />
              </div>
            </div>
          </div>

          <div id="object-container" class="chip-container">
            <div><b>Objects</b></div>
            <div class="message" v-if="objects.length === 0">No available objects</div>
            <div v-for="frame in objects" @click="onClick(frame)">
              <div class="chips">
                <FrameChip :frame="frame"
                  :disable="allowedSubTypes && frame.type === 'fact' && !allowedSubTypes.includes(frame.subClass)"
                  :removable="message === 'Click to edit'" functionality="chip-container" />
              </div>
            </div>
          </div>
          <div id="context-container" class="chip-container">
            <div><b>Context</b></div>
            <div class="message" v-if="contexts.length === 0">No available contexts</div>
            <div class="chips">
              <div v-for="frame in contexts" @click="onClick(frame)">
                <FrameChip :frame="frame" :disable="allowedSubTypes &&
                  frame.type === 'fact' &&
                  !allowedSubTypes.includes(frame.subClass)
                  " :removable="message === 'Click to edit'" functionality="chip-container" />
              </div>
            </div>
          </div>
          <div id="act-container" class="chip-container">
            <div><b>Acts</b></div>
            <div class="message" v-if="acts.length === 0">No available acts</div>
            <div class="chips">
              <div v-for="frame in acts" @click="onClick(frame)">
                <FrameChip :frame="frame" :disable="allowedSubTypes &&
                  frame.type === 'fact' &&
                  !allowedSubTypes.includes(frame.subClass)
                  " :removable="message === 'Click to edit'" functionality="chip-container" />
              </div>
            </div>
          </div>
        </div>

        <!--        <div id="complexFact-container">-->
        <!--          <div v-for="frame in complexFacts" @click="onClick(frame)">-->


        <!--            <FrameChip-->
        <!--              :frame="frame"-->
        <!--              :disable="-->
        <!--                allowedSubTypes &&-->
        <!--                frame.type === 'fact' &&-->
        <!--                !allowedSubTypes.includes(frame.subClass)-->
        <!--              "-->
        <!--              :removable="message === 'Click to edit'"-->
        <!--              functionality="chip-container"-->
        <!--            />-->

        <!--          </div>-->
        <!--        </div>-->

      </div>
    </q-item>

  </q-card>
</template>

<script>
import FrameChip from "../components/FrameChip.vue";

export default {
  computed: {
    frames() {
      return this.$store.state.frames;
    },
    agents() {
      return this.$store.state.frames.filter(d => d._type === 'fact' && d._annotation._tag === 'agent')
    },
    actions() {
      return this.$store.state.frames.filter(d => d._type === 'fact' && d._annotation._tag === 'action')
    },
    objects() {
      return this.$store.state.frames.filter(d => d._type === 'fact' && d._annotation._tag === 'object')
    },
    contexts() {
      return this.$store.state.frames.filter(d => d._type === 'fact' && d._annotation._tag === 'context')
    },
    complexFacts() {
      return this.$store.state.frames.filter(d => d._type === 'complexFact')
    },
    acts() {
      return this.$store.state.frames.filter(d => d._type === 'act')
    },
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
    allowedSubTypes() {
      console.log("frameBeingEdited", this.$store.state.frameBeingEdited);
      return this.$store.state.frameBeingEdited &&
        this.$store.state.frameBeingEdited.type != "fact"
        ? this.$store.state.frameBeingEdited.allowedSubClassesForActiveField
        : false;
    },
    message() {
      return this.frameBeingEdited && this.frameBeingEdited.type !== 'fact'
        ? "Add to frame"
        : this.frames.length > 0 ? "Click to edit" : ""
    }
  },

  components: {
    FrameChip,
  },
  methods: {
    onClick(frame) {
      console.log("clicked frame", frame)
      console.log("this.frameBeingEdited", this.frameBeingEdited);
      //add frame to field in frame being edited
      if (this.frameBeingEdited) {
        // it adds a chip into a form to the FrameEditorView
        console.log("adding frame to", this.frameBeingEdited)
        this.frameBeingEdited.addFrame(frame);
      } else {
        console.log("setting frame being edited")
        // it opens the frame form in the middle
        this.$store.commit("setFrameBeingEdited", frame);
      }
    },
  },
};
</script>

<style lang="css" scoped>
#status {
  min-height: 25px;
}

#frame-chip-container {
  /*height: calc(100vh - 180px);*/
  margin: 10px 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

}

#fact-container {
  /*height: calc(100vh - 180px);*/
  margin: 10px 0px;
  display: flex;
  /*flex-direction: row;*/
  /*flex-wrap: wrap;*/
  /*justify-content: space-between;*/
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
}

/*#chip-container {*/
/*  display: flex;*/
/*}*/
/*#fact-container{*/
/*  !*min-width: 200px;*!*/
/*  !*width:100%;*!*/
/*  !*min-height: 100px;*!*/
/*}*/

/*#agent-container{*/
/*  !*min-width: 200px;*!*/
/*  min-height: 100px;*/
/*}*/

/*#action-container{*/
/*  !*min-width: 200px;*!*/
/*  !*display:flex;*!*/
/*  !*flex-direction: row;*!*/
/*  !*flex-wrap: wrap;*!*/
/*  min-height: 100px;*/
/*}*/
/*#act-container{*/
/*  !*min-width: 200px;*!*/
/*  !*display:flex;*!*/
/*  !*flex-direction: row;*!*/
/*  !*flex-wrap: wrap;*!*/
/*  min-height: 100px;*/
/*}*/
/*#object-container{*/
/*  !*min-width: 200px;*!*/
/*  !*display:flex;*!*/
/*  !*flex-direction: row;*!*/
/*  !*flex-wrap: wrap;*!*/
/*  min-height: 100px;*/
/*}*/
/*#context-container{*/
/*  !*min-width: 200px;*!*/
/*  !*display:flex;*!*/
/*  !*flex-direction: row;*!*/
/*  !*flex-wrap: wrap;*!*/
/*  min-height: 100px;*/
/*}*/

.chip-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: flex-start;
  min-height: 120px !important;
}

.chips {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;


}

/*.chip-container{*/
/*  min-width: 200px;*/
/*  min-height: 100px;*/

/*  !*margin-right: 5px;*!*/
/*  !*overflow-y: auto;*!*/
/*}*/
.message {
  font-size: 9pt;
  color: #333333;
}
</style>
