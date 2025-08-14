<script>
import FrameChip from "./FrameChip.vue";

export default {
  name: "DraggableTreeView",
  components: { FrameChip },
  data() {
    return {
      simple: [
        {
          id: "Satisfied customers (with avatar)",
          avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
          children: [
            {
              id: "Good food (with icon)",
              icon: "restaurant_menu",
              children: [{ id: "Quality ingredients" }, { id: "Good recipe" }],
            },
            {
              id: "Good service (disabled node with icon)",
              icon: "room_service",
              children: [
                { id: "Prompt attention", disabled: true },
                { id: "Professional waiter" },
              ],
            },
            {
              id: "Pleasant surroundings (with icon)",
              icon: "photo",
              children: [
                {
                  id: "Happy atmosphere (with image)",
                  img: "https://cdn.quasar.dev/img/logo_calendar_128px.png",
                },
                { id: "Good table presentation" },
                { id: "Pleasing decor" },
              ],
            },
          ],
        },
      ],
      subdivision: [
        {
          id: "parent1",
          frame: null,
          isNegated: false,
          children: [
            {
              id: "parent2",
              frame: null,
              isNegated: false,
              children: [
                {
                  id: "subdivision-parent2-1",
                  frame: {
                    id: "fact2",
                    shortName: "fact2",
                    fullName: "",
                    typeId: "fact",
                    subTypeId: null,
                    comments: [],
                    subdivision: {
                      id: "subdivision-fact2-1",
                      frame: null,
                      isNegated: false,
                      children: [
                        {
                          id: "c2c962bc-a6c3-46d5-826d-08eb05c84489",
                          frame: null,
                          isNegated: false,
                          children: [],
                          operatorToJoinChildren: null,
                          parent: {
                            id: "subdivision-fact2",
                            frame: null,
                            isNegated: false,
                            children: [
                              {
                                id: "c2c962bc-a6c3-46d5-826d-08eb05c84489",
                                frame: null,
                                isNegated: false,
                                children: [],
                                operatorToJoinChildren: null,
                                parent: "[Circular]",
                              },
                            ],
                            operatorToJoinChildren: "and",
                            parent: null,
                          },
                        },
                      ],
                      operatorToJoinChildren: "and",
                      parent: null,
                    },
                    isComplex: true,
                  },
                  isNegated: false,
                  children: [],
                  operatorToJoinChildren: null,
                  parent: {
                    id: "parent2",
                    frame: null,
                    isNegated: false,
                    children: [
                      {
                        id: "subdivision-parent2-1",
                        frame: {
                          id: "fact2",
                          shortName: "fact2",
                          fullName: "",
                          typeId: "fact",
                          subTypeId: null,
                          comments: [],
                          subdivision: "[Circular]",
                          isComplex: true,
                        },
                        isNegated: false,
                        children: [],
                        operatorToJoinChildren: null,
                        parent: "[Circular]",
                        beingEdited: true,
                      },
                      {
                        id: "subdivision-parent2-2",
                        frame: {
                          id: "fact3",
                          shortName: "fact3",
                          fullName: "",
                          typeId: "fact",
                          subTypeId: null,
                          comments: [],
                          subdivision: {
                            id: "subdivision-fact3",
                            frame: null,
                            isNegated: false,
                            children: [
                              {
                                id: "21b39a45-68ec-448d-bf61-e853c3286a60",
                                frame: null,
                                isNegated: false,
                                children: [],
                                operatorToJoinChildren: null,
                                parent: "[Circular]",
                                beingEdited: false,
                              },
                            ],
                            operatorToJoinChildren: "and",
                            parent: null,
                          },
                          isComplex: true,
                        },
                        isNegated: false,
                        children: [],
                        operatorToJoinChildren: null,
                        parent: "[Circular]",
                        beingEdited: false,
                      },
                    ],
                    operatorToJoinChildren: "and",
                    parent: {
                      id: "parent1",
                      frame: null,
                      isNegated: false,
                      children: [
                        "[Circular]",
                        {
                          id: "parent3",
                          frame: null,
                          isNegated: false,
                          children: [
                            {
                              id: "subdivision-parent3",
                              frame: {
                                id: "fact5",
                                shortName: "fact5",
                                fullName: "",
                                typeId: "fact",
                                subTypeId: null,
                                comments: [],
                                subdivision: {
                                  id: "subdivision-fact5",
                                  frame: null,
                                  isNegated: false,
                                  children: [
                                    {
                                      id: "0d8160b4-864a-4f55-92d1-4c1c7c0bf97a",
                                      frame: null,
                                      isNegated: false,
                                      children: [],
                                      operatorToJoinChildren: null,
                                      parent: "[Circular]",
                                    },
                                  ],
                                  operatorToJoinChildren: "and",
                                  parent: null,
                                },
                                isComplex: true,
                              },
                              isNegated: false,
                              children: [],
                              operatorToJoinChildren: null,
                              parent: "[Circular]",
                              beingEdited: false,
                            },
                            {
                              id: "subdivision-parent3-2",
                              frame: {
                                id: "fact6",
                                shortName: "fact6",
                                fullName: "",
                                typeId: "fact",
                                subTypeId: null,
                                comments: [],
                                subdivision: {
                                  id: "subdivision-fact6",
                                  frame: null,
                                  isNegated: false,
                                  children: [
                                    {
                                      id: "e71a601e-afa7-4f23-87f3-51afc13e9b30",
                                      frame: null,
                                      isNegated: false,
                                      children: [],
                                      operatorToJoinChildren: null,
                                      parent: "[Circular]",
                                    },
                                  ],
                                  operatorToJoinChildren: "and",
                                  parent: null,
                                },
                                isComplex: true,
                              },
                              isNegated: false,
                              children: [],
                              operatorToJoinChildren: null,
                              parent: "[Circular]",
                              beingEdited: false,
                            },
                          ],
                          operatorToJoinChildren: "and",
                          parent: "[Circular]",
                          beingEdited: false,
                        },
                        {
                          id: "parent4",
                          frame: {
                            id: "fact7",
                            shortName: "fact7",
                            fullName: "",
                            typeId: "fact",
                            subTypeId: null,
                            comments: [],
                            subdivision: {
                              id: "subdivision-fact7",
                              frame: null,
                              isNegated: false,
                              children: [
                                {
                                  id: "subdivision-fact7-7",
                                  frame: null,
                                  isNegated: false,
                                  children: [],
                                  operatorToJoinChildren: null,
                                  parent: "[Circular]",
                                },
                              ],
                              operatorToJoinChildren: "and",
                              parent: null,
                            },
                            isComplex: true,
                          },
                          isNegated: false,
                          children: [],
                          operatorToJoinChildren: null,
                          parent: "[Circular]",
                          beingEdited: false,
                        },
                      ],
                      operatorToJoinChildren: "and",
                      parent: null,
                      beingEdited: true,
                    },
                    beingEdited: false,
                  },
                  beingEdited: true,
                },
                {
                  id: "subdivision-parent2-2",
                  frame: {
                    id: "fact3",
                    shortName: "fact3",
                    fullName: "",
                    typeId: "fact",
                    subTypeId: null,
                    comments: [],
                    subdivision: {
                      id: "subdivision-fact3",
                      frame: null,
                      isNegated: false,
                      children: [
                        {
                          id: "21b39a45-68ec-448d-bf61-e853c3286a60",
                          frame: null,
                          isNegated: false,
                          children: [],
                          operatorToJoinChildren: null,
                          parent: "[Circular]",
                          beingEdited: false,
                        },
                      ],
                      operatorToJoinChildren: "and",
                      parent: null,
                    },
                    isComplex: true,
                  },
                  isNegated: false,
                  children: [],
                  operatorToJoinChildren: null,
                  parent: "[Circular]",
                  beingEdited: false,
                },
              ],
              operatorToJoinChildren: "and",
              parent: "[Circular]",
              beingEdited: false,
            },
            {
              id: "parent3",
              frame: null,
              isNegated: false,
              children: [
                {
                  id: "subdivision-parent3",
                  frame: {
                    id: "fact5",
                    shortName: "fact5",
                    fullName: "",
                    typeId: "fact",
                    subTypeId: null,
                    comments: [],
                    subdivision: {
                      id: "subdivision-fact5",
                      frame: null,
                      isNegated: false,
                      children: [
                        {
                          id: "0d8160b4-864a-4f55-92d1-4c1c7c0bf97a",
                          frame: null,
                          isNegated: false,
                          children: [],
                          operatorToJoinChildren: null,
                          parent: "[Circular]",
                        },
                      ],
                      operatorToJoinChildren: "and",
                      parent: null,
                    },
                    isComplex: true,
                  },
                  isNegated: false,
                  children: [],
                  operatorToJoinChildren: null,
                  parent: "[Circular]",
                  beingEdited: false,
                },
                {
                  id: "subdivision-parent3-2",
                  frame: {
                    id: "fact6",
                    shortName: "fact6",
                    fullName: "",
                    typeId: "fact",
                    subTypeId: null,
                    comments: [],
                    subdivision: {
                      id: "subdivision-fact6",
                      frame: null,
                      isNegated: false,
                      children: [
                        {
                          id: "e71a601e-afa7-4f23-87f3-51afc13e9b30",
                          frame: null,
                          isNegated: false,
                          children: [],
                          operatorToJoinChildren: null,
                          parent: "[Circular]",
                        },
                      ],
                      operatorToJoinChildren: "and",
                      parent: null,
                    },
                    isComplex: true,
                  },
                  isNegated: false,
                  children: [],
                  operatorToJoinChildren: null,
                  parent: "[Circular]",
                  beingEdited: false,
                },
              ],
              operatorToJoinChildren: "and",
              parent: "[Circular]",
              beingEdited: false,
            },
            {
              id: "parent4",
              frame: {
                id: "fact7",
                shortName: "fact7",
                fullName: "",
                typeId: "fact",
                subTypeId: null,
                comments: [],
                subdivision: {
                  id: "subdivision-fact7",
                  frame: null,
                  isNegated: false,
                  children: [
                    {
                      id: "subdivision-fact7-7",
                      frame: null,
                      isNegated: false,
                      children: [],
                      operatorToJoinChildren: null,
                      parent: "[Circular]",
                    },
                  ],
                  operatorToJoinChildren: "and",
                  parent: null,
                },
                isComplex: true,
              },
              isNegated: false,
              children: [],
              operatorToJoinChildren: null,
              parent: "[Circular]",
              beingEdited: false,
            },
          ],
          operatorToJoinChildren: "and",
          parent: null,
          beingEdited: true,
        },
      ],
      toResult: null,
      draggingId: null,
      dragOverId: null,
      toggleOptions: [
        { label: "Swap order", value: "swapping" },
        { label: "Move child", value: "nesting" },
      ],
      mode: "nesting",
    };
  },
  watch: {
    toResult(val) {
      this.$nextTick(() => {
        const treeRef = this.$refs["tree-structure"];
        if (!treeRef || typeof treeRef.setExpanded !== "function") {
          console.warn(
            "Tree structure ref or setExpanded() not ready",
            treeRef,
          );
          return;
        }
        if (!val) {
          console.warn("Invalid value for node id", val);
          return;
        }
        console.log("new toResult:", val.id);

        treeRef.setExpanded(val.id, true);
      });
    },
  },

  methods: {
    getNodeByKey(key) {
      return this.$refs["tree-structure"].getNodeByKey(key);
    },
    getNodeParent(elem) {
      let parent = null;
      while (elem.parentNode && !parent) {
        elem = elem.parentNode;
        if (elem.classList.contains("q-tree__node")) parent = elem;
      }
      return parent;
    },
    getNodeByLabel(node, label, currentIndex, parentNode) {
      let array;
      let parent;
      if (!Array.isArray(node)) {
        parent = node;
        if (node.id === label)
          return { node: node, index: currentIndex, parent: parentNode };
        array = node.children;
      } else {
        array = node;
      }
      if (array) {
        let i;
        let result = null;
        for (i = 0; result == null && i < array.length; i++) {
          result = this.getNodeByLabel(array[i], label, i, parent);
        }
        return result;
      }
      return null;
    },
    moveNode(from, to) {
      console.log("moving nodes!");
      if (from === to) return;

      const fromResult = this.getNodeByLabel(this.subdivision, from, -1);
      const toResult =
        to === "root" ? null : this.getNodeByLabel(this.subdivision, to, -1);

      if (fromResult) {
        // Return if trying to move a parent node into a child of that same parent
        if (
          toResult &&
          this.getNodeByLabel(fromResult.node, toResult.node.id, -1)
        )
          return;

        if (fromResult.parent && fromResult.parent.children) {
          fromResult.parent.children.splice(fromResult.index, 1);
        } else {
          this.subdivision.splice(fromResult.index, 1);
        }

        if (toResult && toResult.node) {
          if (toResult.node.children) {
            console.log("if", toResult.node.children);
            console.log("fromResult:", fromResult);
            toResult.node.children.splice(0, 0, fromResult.node);
            console.log("if-after", toResult.node.children);
          }
          // else Vue.set(toResult.node, "children", [fromResult.node]);
          else {
            console.log("else");
            toResult.node["children"] = [fromResult.node];
          }
          console.log("toResult.node:", toResult.node);
          this.toResult = toResult.node;
          // this.$refs.tree.setExpanded(toResult.node.id, true);
        } else if (to === "root") {
          this.subdivision.splice(this.subdivision.length, 0, fromResult.node);
        }
      }
    },
    swapNodes(fromKey, toKey) {
      console.log("swapping nodes!");
      if (fromKey === toKey) return;

      const fromResult = this.getNodeByLabel(this.subdivision, fromKey, -1);
      const toResult = this.getNodeByLabel(this.subdivision, toKey, -1);

      if (!fromResult || !toResult) return;

      const fromParent = fromResult.parent;
      const toParent = toResult.parent;

      // Helper to find index in parent's children or subdivision root
      const findIndex = (parent, node) => {
        if (!parent) return this.subdivision.indexOf(node);
        return parent.children.indexOf(node);
      };

      const fromIndex = findIndex(fromParent, fromResult.node);
      const toIndex = findIndex(toParent, toResult.node);

      if (fromParent === toParent) {
        // Same parent: swap positions in children array
        if (fromParent) {
          const children = fromParent.children;
          children.splice(fromIndex, 1, toResult.node);
          children.splice(toIndex, 1, fromResult.node);
        } else {
          // Top-level subdivision array
          this.subdivision.splice(fromIndex, 1, toResult.node);
          this.subdivision.splice(toIndex, 1, fromResult.node);
        }
      } else {
        // Different parents: remove nodes from their parents and insert into the other's children
        if (fromParent) fromParent.children.splice(fromIndex, 1);
        else this.subdivision.splice(fromIndex, 1);

        if (toParent) toParent.children.splice(toIndex, 1);
        else this.subdivision.splice(toIndex, 1);

        if (fromParent) {
          fromParent.children.splice(fromIndex, 0, toResult.node);
        } else {
          this.subdivision.splice(fromIndex, 0, toResult.node);
        }

        if (toParent) {
          toParent.children.splice(toIndex, 0, fromResult.node);
        } else {
          this.subdivision.splice(toIndex, 0, fromResult.node);
        }
      }
    },
    dragStart(event, key) {
      console.log("drag started...");
      console.log("drag key:", key);
      this.draggingId = key;
      if (event.target) {
        const target = event.target;
        const parent = this.getNodeParent(target);
        if (parent) parent.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("node-id", key);
        // Use entire row as drag image
        const row = event.target.closest(".my-row");
        if (row) {
          event.dataTransfer.setDragImage(
            row,
            row.offsetWidth / 2,
            row.offsetHeight / 2,
          );
        }
      }
      if (event.dataTransfer && event.target)
        event.dataTransfer.setData("node", key);
    },
    dragStop(event) {
      console.log("drag stop...");
      if (event.target) {
        const target = event.target;
        const parent = this.getNodeParent(target);
        if (parent) parent.classList.remove("dragging");
        this.draggingId = null;
        this.dragOverId = null;
      }
    },
    drop(event, key) {
      event.preventDefault();
      console.log("drop key:", key);
      const target = event.target;
      let nodeKey = "";
      if (event.dataTransfer) nodeKey = event.dataTransfer.getData("node");
      if (target) target.classList.remove("container");
      if (nodeKey) {
        console.log("nodeKey:", nodeKey);

        // this.$refs.tree.setExpanded(this.toResult.node.id, true);
        // console.log(`Move ${nodeKey} to ${key}`);
        // console.log("toResult:", this.toResult);
        // const nodeInfo = this.getNodeByKey(this.toResult.id);
        // nodeInfo.frame = null;
        // console.log("nodeInfo:", nodeInfo);

        if (this.mode === "swapping") {
          // Swap nodes
          this.swapNodes(nodeKey, key);
          console.log(`Swapped nodes ${nodeKey} and ${key}`);
        } else {
          // move nodes as child
          this.moveNode(nodeKey, key);
          console.log(`Moved node ${nodeKey} to ${key}`);
        }

        this.draggingId = null;
        this.dragOverId = null;
      }
    },
    // drop(event, key) {
    //   event.preventDefault();
    //   console.log("drop key:", key);
    //   const target = event.target;
    //   let nodeKey = "";
    //   if (event.dataTransfer) nodeKey = event.dataTransfer.getData("node");
    //   if (target) target.classList.remove("container");
    //   if (nodeKey) {
    //     console.log("nodeKey:", nodeKey);
    //     this.moveNode(nodeKey, key);
    //
    //     // this.$refs.tree.setExpanded(this.toResult.node.id, true);
    //     console.log(`Move ${nodeKey} to ${key}`);
    //     console.log("toResult:", this.toResult);
    //     const nodeInfo = this.getNodeByKey(this.toResult.id);
    //     nodeInfo.frame = null;
    //     console.log("nodeInfo:", nodeInfo);
    //
    //     if (this.mode === "one") {
    //       // Swap nodes if Shift key is pressed
    //       this.swapNodes(nodeKey, key);
    //       console.log(`Swapped nodes ${nodeKey} and ${key}`);
    //     } else {
    //       // Default behavior: move node as child
    //       this.moveNode(nodeKey, key);
    //       console.log(`Moved node ${nodeKey} to ${key}`);
    //     }
    //
    //     this.draggingId = null;
    //     this.dragOverId = null;
    //   }
    // },
    dragOver(event, id) {
      console.log("dragging...");
      event.preventDefault();
      const target = event.target;
      if (target) target.classList.add("container");
      if (id !== this.dragOverId) this.dragOverId = id;
    },
    dragLeave(event, id) {
      console.log("drag event is over!");
      event.preventDefault();
      const target = event.target;
      if (target) target.classList.remove("container");
      if (this.dragOverId === id) this.dragOverId = null;
    },
    subdivide(event, nodeData) {
      console.log("nodeData to subdivide:", nodeData);
      event.stopPropagation();
      nodeData.subdivide();
      // set the top level of the construct to be expanded
      // this.$refs["tree-structure"].setExpanded(this.parentNodeId, true);
      // // set the current node to expanded
      // this.$refs["tree-structure"].setExpanded(nodeData.id, true);
      // // determine margin of parent
      // !nodeData.parent && nodeData.children.length > 0
      //   ? (this.notMargined = false)
      //   : null;
    },
  },
};
</script>

<template>
  <div id="draggable-tree">
    <div class="q-pa-md q-gutter-sm">
      <div class="flex flex-start items-baseline">
        <div id="label">Mode:</div>
        <div id="ui-element" class="q-ml-sm">
          <q-btn-toggle
            v-model="mode"
            :options="toggleOptions"
            name="mode-selector"
            size="sm"
            rounded
          ></q-btn-toggle>
        </div>
      </div>

      <q-tree
        ref="tree-structure"
        :nodes="subdivision"
        node-key="id"
        default-expand-all
      >
        <template v-slot:default-header="prop">
          <span
            v-if="dragOverId === prop.node.id && mode == 'nesting'"
            class="plus-icon"
          >
            <q-icon name="mdi-plus-circle-outline" color="primary" size="sm" />
          </span>
          <span
            v-if="dragOverId === prop.node.id && mode == 'swapping'"
            class="plus-icon"
          >
            <q-icon
              name="mdi-swap-vertical-circle-outline"
              color="primary"
              size="sm"
            />
          </span>
          <div
            v-if="prop.node.children.length > 0"
            class="row items-center my-row"
            :class="{
              'drag-over': dragOverId === prop.node.id,
              dragging: draggingId === prop.node.id,
            }"
            :data-node-id="prop.node.id"
            @dragleave="dragLeave($event, prop.node.id)"
            @drop="drop($event, prop.key)"
            @dragover="dragOver($event, prop.node.id)"
          >
            {{ prop.node.id }}

            <div>
              <q-icon
                name="mdi-drag"
                draggable="true"
                @mousedown.stop
                @dragstart="dragStart($event, prop.key)"
                @dragend="dragStop"
                class="cursor-pointer drag-handle"
                style="cursor: grab"
              ></q-icon>
            </div>
          </div>
        </template>
        <template v-slot:default-body="prop">
          <div
            class="panel flex flex-row q-pr-md my-row"
            :class="{
              active: prop.node.beingEdited,
              negated: prop.node.isNegated,
              'drag-over': dragOverId === prop.node.id,
              dragging: draggingId === prop.node.id,
            }"
            @dragleave="dragLeave($event, prop.node.id)"
            @drop="drop($event, prop.key)"
            @dragover="dragOver($event, prop.node.id)"
            v-if="prop.node.children.length === 0"
          >
            <div class="col">
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
                  >
                    <q-tooltip class="text-subtitle2">
                      <div>Remove this frame.</div>
                    </q-tooltip>
                  </q-btn>
                </div>
              </template>
              <div
                v-if="prop.node.beingEdited && !prop.node.frame"
                class="button-label"
              >
                Select frame or create new frame from source
              </div>
            </div>
            <!--  list of buttons on the right  -->
            <div class="col-1 buttons-container">
              <div>
                <q-btn
                  size="sm"
                  class="button-label"
                  dense
                  flat
                  icon="mdi-format-list-bulleted-square"
                  @click="subdivide($event, prop.node)"
                >
                  <q-tooltip class="text-subtitle2">
                    <div>Add a new layer of complexity at this level.</div>
                  </q-tooltip>
                </q-btn>
              </div>
              <div v-if="prop.node.parent">
                <q-btn
                  class="button-label"
                  size="sm"
                  dense
                  flat
                  icon="mdi-close"
                  @click="deleteBooleanConstruct($event, prop.node)"
                >
                  <q-tooltip class="text-subtitle2">
                    <div v-if="!prop.node.parent.parent">
                      Can not remove the only child in the hierarchy.
                    </div>
                    <div v-else>Remove this child.</div>
                  </q-tooltip>
                </q-btn>
              </div>
              <div>
                <q-icon
                  name="mdi-drag"
                  draggable="true"
                  @mousedown.stop
                  @dragstart="dragStart($event, prop.key)"
                  @dragend="dragStop"
                  class="cursor-pointer drag-handle"
                  style="cursor: grab"
                ></q-icon>
              </div>
            </div>
          </div>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<style scoped>
[draggable="true"] {
  /* To prevent user selecting inside the drag source */
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.mett-page-tree .q-tree__node-header {
  padding: 0;
}

.mett-page-tree .q-tree__node--child > .q-tree__node-header:focus {
  box-shadow: none;
}

.mett-page-tree .q-tree__node.dragging {
  background: rgba(51, 63, 82, 0.1); /* #333f52 in RGBA */
  border-radius: 4px;
}

.mett-page-tree .q-tree__node.dragging .q-hoverable:hover > .q-focus-helper {
  background: none;
  opacity: 0;
}

.mett-tree-item {
  border-radius: 4px;
  padding: 8px;
}

.my-row {
  background: #fff;
  border-radius: 4px;
  transition: background 0.15s;
  user-select: none;
  min-height: 36px;
}

.drag-handle {
  font-size: 1.8em;
  opacity: 1;
  margin-left: 3px;
  color: #1a1a1a;
}

.drag-over {
  background: #e0f7fa !important;
}

.dragging {
  opacity: 0.4;
  background: rgba(51, 63, 82, 0.1); /* #333f52 in RGBA */
  border-radius: 4px;
}
.panel {
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 10px 4px;
  border-radius: 5px;
  margin-left: 2px;
  box-shadow: 0px 0px 2px #aaaaaa;
  background-color: #ffffff;
  border: solid 1px #dddddd;
  width: 270px;
}

.panel.active {
  border: solid 2px rgb(25, 118, 210);
}

.panel.negated {
  /* border: dotted 2px hsl(17, 79%, 46%); */
  background-color: rgb(255, 231, 222);
}

.button-label {
  display: inline-block;
  font-style: italic;
  margin-left: 5px;
  color: #1a1a1a !important;
}

.row-container {
  display: flex;
  flex-direction: row;
}

.notMargined {
  margin-left: -17px !important;
}

:deep(.q-tree__node-header)::before {
  padding-top: 25px;
}
#treeview {
  overflow-y: auto;
  margin-right: 10px !important;
}
.add-child-btn {
  min-width: 60px !important;
}
</style>
