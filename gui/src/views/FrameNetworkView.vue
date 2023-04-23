<template>
  <q-card flat bordered class="my-card q-ma-sm">
    <q-item>
      <q-item-section>
        <q-item-label>Interpretation view</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-avatar>
          <q-icon
            name="mdi-information-outline"
            class="cursor-pointer"
          ></q-icon>
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
    <q-item>


      <div id="frame-chip-container" >
        <div id="status">{{ message }}</div>
        <div id="fact-container">
          <div id="agent-container" class="chip-container">
          <span><b>Agents</b></span>
          <div v-for="frame in agents" @click="onClick(frame)">


            <FrameChip
              :frame="frame"
              :disable="
                allowedSubTypes &&
                frame.type === 'fact' &&
                !allowedSubTypes.includes(frame.subClass)
              "
              :removable="message === 'Click to edit'"
              functionality="chip-container"
            />

          </div>
        </div>
          <div id="action-container" class="chip-container">
           <span><b>Actions</b></span>
          <div v-for="frame in actions" @click="onClick(frame)">


            <FrameChip
              :frame="frame"
              :disable="
                allowedSubTypes &&
                frame.type === 'fact' &&
                !allowedSubTypes.includes(frame.subClass)
              "
              :removable="message === 'Click to edit'"
              functionality="chip-container"
            />

          </div>
        </div>
          <div id="object-container" class="chip-container">
          <span><b>Objects</b></span>
          <div v-for="frame in objects" @click="onClick(frame)">

            <FrameChip
              :frame="frame"
              :disable="
                allowedSubTypes &&
                frame.type === 'fact' &&
                !allowedSubTypes.includes(frame.subClass)
              "
              :removable="message === 'Click to edit'"
              functionality="chip-container"
            />

          </div>
        </div>
          <div id="context-container" class="chip-container">
          <span><b>Context</b></span>
          <div v-for="frame in contexts" @click="onClick(frame)">


            <FrameChip
              :frame="frame"
              :disable="
                allowedSubTypes &&
                frame.type === 'fact' &&
                !allowedSubTypes.includes(frame.subClass)
              "
              :removable="message === 'Click to edit'"
              functionality="chip-container"
            />

          </div>
        </div>
          <div id="act-container" class="chip-container">
          <span><b>Acts</b></span>
          <div v-for="frame in acts" @click="onClick(frame)">


            <FrameChip
              :frame="frame"
              :disable="
                allowedSubTypes &&
                frame.type === 'fact' &&
                !allowedSubTypes.includes(frame.subClass)
              "
              :removable="message === 'Click to edit'"
              functionality="chip-container"
            />

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
      return this.$store.state.frames.filter(d=> d._type === 'fact' && d._annotation._tag === 'agent')
    },
    actions() {
      return this.$store.state.frames.filter(d=> d._type === 'fact' && d._annotation._tag === 'action')
    },
    objects() {
      return this.$store.state.frames.filter(d=> d._type === 'fact' && d._annotation._tag === 'object')
    },
    contexts() {
      return this.$store.state.frames.filter(d=> d._type === 'fact' && d._annotation._tag === 'other')
    },
    complexFacts(){
      return this.$store.state.frames.filter(d=> d._type === 'complexFact')
    },
    acts(){
      return this.$store.state.frames.filter(d=> d._type === 'act')
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
#frame-chip-container {
  margin: 20px 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
 #fact-container {
  margin: 20px 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

#chip-container {
  display: flex;

}
.chip-container{
  min-width: 200px;
  height: 200px;
  margin-right: 5px;
  overflow-y: auto;

}

.message {
  /* margin-top: 10px; */
}
</style>
