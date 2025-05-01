<script>
import FrameChip from "./FrameChip.vue";

export default {
  name: "draggableTreeView",
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
          id: "4e0c5c02-a219-4a3a-bd58-62ebd35eb646",
          frame: null,
          isNegated: false,
          children: [
            {
              id: "8dfaa238-9123-4bb0-ad10-b51c3b893222",
              frame: null,
              isNegated: false,
              children: [
                {
                  id: "5d7d777c-dff9-49ba-87e2-2945ba32afd5",
                  frame: {
                    id: "4992d5fb-bd42-4c0b-b32f-7fa590da721d",
                    shortName: "fact2",
                    fullName: "",
                    typeId: "fact",
                    subTypeId: null,
                    comments: [],
                    subdivision: {
                      id: "6627dd91-cb0d-452f-b7b0-4a91c57cc967",
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
                            id: "6627dd91-cb0d-452f-b7b0-4a91c57cc967",
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
                    id: "8dfaa238-9123-4bb0-ad10-b51c3b893222",
                    frame: null,
                    isNegated: false,
                    children: [
                      {
                        id: "5d7d777c-dff9-49ba-87e2-2945ba32afd5",
                        frame: {
                          id: "4992d5fb-bd42-4c0b-b32f-7fa590da721d",
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
                        id: "82e63ba9-1935-46b0-aa63-862f33e82795",
                        frame: {
                          id: "7fb159a0-542c-45e2-bb0a-d01f598f543c",
                          shortName: "fact3",
                          fullName: "",
                          typeId: "fact",
                          subTypeId: null,
                          comments: [],
                          subdivision: {
                            id: "75f52322-9578-40c6-8eda-38600ce3daeb",
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
                      id: "4e0c5c02-a219-4a3a-bd58-62ebd35eb646",
                      frame: null,
                      isNegated: false,
                      children: [
                        "[Circular]",
                        {
                          id: "5ba8e097-0728-4a9f-9b81-f365e56a0678",
                          frame: null,
                          isNegated: false,
                          children: [
                            {
                              id: "be354525-7d54-45d1-96fa-cc570a82cea3",
                              frame: {
                                id: "05195279-3150-47b0-a97e-224ee081286c",
                                shortName: "fact5",
                                fullName: "",
                                typeId: "fact",
                                subTypeId: null,
                                comments: [],
                                subdivision: {
                                  id: "24284867-f0f3-413b-9211-f27af5b3638e",
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
                              id: "db2b259a-08fa-42d0-9933-e79bd503c204",
                              frame: {
                                id: "d27cf66c-00c5-4dee-a421-7b85c9d64376",
                                shortName: "fact6",
                                fullName: "",
                                typeId: "fact",
                                subTypeId: null,
                                comments: [],
                                subdivision: {
                                  id: "976c7bd5-ba07-4d4e-993f-ac1a10eb29b3",
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
                          id: "21255d77-e2a7-4edd-9be0-93ce3d1538e6",
                          frame: {
                            id: "eeaf2c0c-1300-4576-b74c-e07573b6c5b7",
                            shortName: "fact7",
                            fullName: "",
                            typeId: "fact",
                            subTypeId: null,
                            comments: [],
                            subdivision: {
                              id: "ce76397e-e3a0-45b1-b155-6de750736edb",
                              frame: null,
                              isNegated: false,
                              children: [
                                {
                                  id: "dcf21fd0-c585-421c-8759-f87a89a0a65f",
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
                  id: "82e63ba9-1935-46b0-aa63-862f33e82795",
                  frame: {
                    id: "7fb159a0-542c-45e2-bb0a-d01f598f543c",
                    shortName: "fact3",
                    fullName: "",
                    typeId: "fact",
                    subTypeId: null,
                    comments: [],
                    subdivision: {
                      id: "75f52322-9578-40c6-8eda-38600ce3daeb",
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
              id: "5ba8e097-0728-4a9f-9b81-f365e56a0678",
              frame: null,
              isNegated: false,
              children: [
                {
                  id: "be354525-7d54-45d1-96fa-cc570a82cea3",
                  frame: {
                    id: "05195279-3150-47b0-a97e-224ee081286c",
                    shortName: "fact5",
                    fullName: "",
                    typeId: "fact",
                    subTypeId: null,
                    comments: [],
                    subdivision: {
                      id: "24284867-f0f3-413b-9211-f27af5b3638e",
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
                  id: "db2b259a-08fa-42d0-9933-e79bd503c204",
                  frame: {
                    id: "d27cf66c-00c5-4dee-a421-7b85c9d64376",
                    shortName: "fact6",
                    fullName: "",
                    typeId: "fact",
                    subTypeId: null,
                    comments: [],
                    subdivision: {
                      id: "976c7bd5-ba07-4d4e-993f-ac1a10eb29b3",
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
              id: "21255d77-e2a7-4edd-9be0-93ce3d1538e6",
              frame: {
                id: "eeaf2c0c-1300-4576-b74c-e07573b6c5b7",
                shortName: "fact7",
                fullName: "",
                typeId: "fact",
                subTypeId: null,
                comments: [],
                subdivision: {
                  id: "ce76397e-e3a0-45b1-b155-6de750736edb",
                  frame: null,
                  isNegated: false,
                  children: [
                    {
                      id: "dcf21fd0-c585-421c-8759-f87a89a0a65f",
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
    dragStart(event, key) {
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
        this.moveNode(nodeKey, key);

        // this.$refs.tree.setExpanded(this.toResult.node.id, true);
        console.log(`Move ${nodeKey} to ${key}`);
        console.log("toResult:", this.toResult);
        const nodeInfo = this.getNodeByKey(this.toResult.id);
        nodeInfo.frame = null;
        console.log("nodeInfo:", nodeInfo);

        this.draggingId = null;
        this.dragOverId = null;
      }
    },
    dragOver(event, id) {
      event.preventDefault();
      const target = event.target;
      if (target) target.classList.add("container");
      if (id !== this.dragOverId) this.dragOverId = id;
    },
    dragLeave(event, id) {
      event.preventDefault();
      const target = event.target;
      if (target) target.classList.remove("container");
      if (this.dragOverId === id) this.dragOverId = null;
    },
  },
};
</script>

<template>
  <div id="draggable-tree">
    <div class="q-pa-md q-gutter-sm">
      <q-tree
        ref="tree-structure"
        :nodes="subdivision"
        node-key="id"
        default-expand-all
      >
        <template v-slot:default-header="prop">
          <span v-if="dragOverId === prop.node.id" class="plus-icon">
            <q-icon name="mdi-plus-circle-outline" color="primary" size="sm" />
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
