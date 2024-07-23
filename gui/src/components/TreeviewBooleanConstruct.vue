<script>
import FrameChip from "./FrameChip.vue";
import {BooleanConstruct} from "../model/booleanConstruct.js";
export default {
  name: "TreeviewBooleanConstruct",
  components: {
    FrameChip
  },
  props: {
    booleanConstruct: Object
  },
  data: () => ({
    booleanOptions: [
      { label: "AND", value: "and", description: "AND (boolean)" },
      { label: "OR", value: "or", description: "OR (boolean)" },
      { label: "PLUS", value: "plus", description: "Plus (arithmetic)" },
      { label: "MINUS", value: "minus", description: "Minus (arithmetic)" },
      {
        label: ">",
        value: "greaterThan",
        description: "Greater than (comparison)",
      },
      { label: "<", value: "lessThan", description: "Less than (comparison)" },
      {
        label: "≥",
        value: "greaterThanOrEqualTo",
        description: "Greater than or Equal to (comparison)",
      },
      {
        label: "≤",
        value: "lessThanOrEqualTo",
        description: "Less than or Equal to (comparison)",
      },
      { label: "=", value: "assign", description: "Assignment" },
      { label: "==", value: "equals", description: "Equals (comparison)" },
      { label: "IF", value: "if", description: "If function" },
    ],
    selectModel: [],
    options: null,
    selectedNode: null,
  }),
  computed: {
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited;
    },
    booleanConstructBeingEdited() {
      return this.$store.state.booleanConstructBeingEdited;
    },
    booleanConstructBeingEditedId(){
      return this.$store.state.booleanConstructBeingEdited?.id;
    },
    isBeingEdited() {
      const expression =  this.selectedNode == this.booleanConstructBeingEditedId
      return this.selectedNode ? expression : false
    },
  },
  watch: {
    selectedNode: function(newV, oldV){
      console.log('newV:', newV, 'oldV:', oldV);
      const selectionOld = this.getNodeByKey(oldV)
      selectionOld && oldV ? selectionOld.beingEdited = false : null

      const selectionNew = this.getNodeByKey(newV)
      selectionNew ? selectionNew.beingEdited = true : null
      // set the focus to the new node
      this.$store.state.booleanConstructBeingEdited = selectionNew

    }
  },
  mounted() {
    this.options = Array.from(this.booleanOptions);
  },
  methods: {
    getNodeByKey(key) {
      console.log("returned node in the tree:", key);
      console.log(this.$refs["tree-structure"].getNodeByKey(key));
      return this.$refs["tree-structure"].getNodeByKey(key);
    },
    selectValue(val, node) {
      console.log("using the q-select: value", val.value, node);
      node.operatorToJoinChildren = val.value


      // console.log("this.value", this.sampleStructure[0]);
    },
    passFunctionToLines() {
      //TODO: filter data structure, then pick its children and next to those children add the operator.
    },
    // filters the lists of operators in the select panel
    filterFn(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.options = this.booleanOptions.filter(
          (v) => v.value.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    // adds children to the selected node.
    addChild(nodeData) {
      console.log("adding child to booleanConstruct")
      const newChild = new BooleanConstruct()
      nodeData.children.push(newChild)
      newChild.parent = nodeData
      console.log("newCHild: ", newChild)
      this.selectedNode = newChild.id

    },
    // adds an extra level of hierarchy to the selected node
    subdivide(event, nodeData){
      event.stopPropagation();
      console.log("subdividing!", nodeData)
      nodeData.subdivide();
    },
    toggleNegation(nodeId) {
      const selectedData = this.getNodeByKey(nodeId);
      selectedData.isNegated = !selectedData.isNegated;
    },
    removeFrame(node){
      node.beingEdited = false
      node.removeFrame(node.frame);
    },
    // removing extra level of hierarchy from a node
    deleteBooleanConstruct(event, nodeData) {
      event.stopPropagation();
      nodeData.beingEdited = false
      //if bc has no parent, do not delete, since that would leave precondition empty
      //instead: clean
      if (nodeData.parent) {
        nodeData.delete();
      } else {
        nodeData.clean();
      }
      this.selectedNode = null

    },
    //  while clicking the body of each node in the treeview
    handleClick(event, node) {
      //prevent propagation to underlying panels
      event.stopPropagation();
      //if empty leaf node, select for adding frame
      if (
        !node.frame &&
        node.children.length == 0
      ) {
          // this.$store.state.booleanConstructBeingEdited =  node;
          this.selectedNode = node.id
        //de-select any other properties of the active frame, if it is a relation
        if ('activeField' in this.frameBeingEdited) {
          this.frameBeingEdited.activeField = null
        }
      }
    },
  },
};
</script>

<template>
  <div id="treeview">

    <q-tree
      class="q-mt-md"
      ref="tree-structure"
      :nodes="[booleanConstruct]"
      node-key="id"
      v-model:selected="selectedNode"
      selected-color="primary"
      dense
      default-expand-all
    >
      <template v-slot:default-header="prop">
        <div class="row items-center full-width justify-between">
          <!--          <q-icon-->
          <!--            :name="prop.node.icon || 'share'"-->
          <!--            color="orange"-->
          <!--            size="28px"-->
          <!--            class="q-mr-sm"-->
          <!--          />-->
          <div
            class="boolean-menu row items-center "
            v-on:click.stop
            v-if="prop.node.children.length > 0"
          >
            <div class="select-element">
              <q-select
                dense
                filled
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                label="Pick a function"
                :options="options"
                style="width: 100px; margin: 5px 10px"
                v-model="prop.node.operatorToJoinChildren"
                @update:model-value="
                  (value) => {
                    selectValue(value, prop.node);
                  }
                "
                @filter="filterFn"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-italic text-grey">
                      No options slot
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="add-child">
              <q-btn
                size="sm"
                dense
                outline
                class="q-ml-sm"
                @click="addChild(prop.node)"
                >Add child</q-btn
              >
            </div>
            <div>
              <q-btn
                  size="sm"
                  color="#007bc7"
                  dense
                  flat
                  icon="mdi-format-list-bulleted-square"
                  @click="subdivide($event,prop.node)"
              />
            </div>
            <div>
              <q-btn
                size="sm"
                :text-color="prop.node.isNegated ? 'red' : '#d42d19'"
                color="#d42d19"
                dense
                :outline="prop.node.isNegated ? true : false"
                :flat="prop.node.isNegated ? false : true"
                icon="mdi-minus-circle-outline"
                @click="toggleNegation(prop.node.id)"
              />
            </div>
          </div>
          <div v-else>
            <span>This is the header of the node: I don't have children!</span>
          </div>
        </div>
      </template>
      <template v-slot:default-body="prop">
        <div
          class="panel flex flex-row"
          :class="{ active: prop.node.beingEdited, negated: prop.node.isNegated }"
          @click="handleClick($event, prop.node)"
          v-if="prop.node.children.length == 0"
        >
          <div class="col">
            <!-- negation label -->
            <div v-if="prop.node.isNegated" class="negation-label">NOT</div>
            <template v-if="prop.node.frame">
              <!-- boolean construct is 'atomic': it refers to a frame, and has no children -->
              <div class="row-container">
                <!-- selected chip -->
                <FrameChip :frame="prop.node.frame" :disable="false" />
                <!-- remove chip button -->
                <q-btn
                    round
                    size="xs"
                    flat
                    color="negative"
                    icon="mdi-close"
                    @click="removeFrame(prop.node)"
                />
              </div>
            </template>
             <div v-if="prop.node.beingEdited && !prop.node.frame" class="button-label">
               Select frame or create new frame from source
             </div>
          </div>
          <!--  list of buttons on the right  -->
          <div class="col-1 buttons-container">
            <div>
              <q-btn
                size="sm"
                color="#d42d19"
                dense
                flat
                icon="mdi-minus-circle-outline"
                @click="toggleNegation(prop.node.id)"
              />
            </div>
            <div>
              <q-btn
                  size="sm"
                  color="#007bc7"
                  dense
                  flat
                  icon="mdi-format-list-bulleted-square"
                  @click="subdivide($event,prop.node)"
              />
            </div>
            <div v-if="prop.node.parent">
              <q-btn
                  size="sm"
                  color="#007bc7"
                  dense
                  flat
                  icon="mdi-close"
                  @click="deleteBooleanConstruct($event,prop.node)"
              />
            </div>
          </div>
          <!--              <div v-if="prop.node.label">-->
          <!--                <span class="text-weight-bold">This node has a story</span>:-->
          <!--                {{ prop.node.label }}-->
          <!--              </div>-->
          <!--              <span v-else class="text-weight-light text-black"-->
          <!--              <span v-else class="text-weight-light text-black"-->
          <!--                >This is some default content.</span>-->
        </div>
<!--        <div v-else class="panel">-->
<!--          <p>additional options</p>-->
<!--        </div>-->
      </template>
    </q-tree>
  </div>
</template>

<style scoped lang="css">
.panel {
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 10px 4px;
  border-radius: 5px;
  margin-left: 2px;
  box-shadow: 0px 0px 4px #aaaaaa;
  background-color: #ffffff;
  border: solid 2px #ffffff;
}

.panel.active {
  border: solid 2px rgb(25, 118, 210);
}

.panel.negated {
  /* border: dotted 2px hsl(17, 79%, 46%); */
  background-color: rgb(255, 231, 222);
}
.bordered-panel {
  border-left: 2px solid #007bc6;
  padding-left: 14px;
}

.operator-label {
  color: #007bc6;
  text-transform: uppercase;
}

.button-label {
  display: inline-block;
  font-style: italic;
  margin-left: 5px;
  color: #1a1a1a;
}

.negation-label {
  font-weight: bold;
  font-size: 9pt;
  margin-bottom: 2px;
  color: #d42d19;
}

.row-container {
  display: flex;
  flex-direction: row;
}

.button-container {
  display: flex;
  flex-direction: column;
}
</style>
