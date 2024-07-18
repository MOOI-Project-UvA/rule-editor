<script>
export default {
  name: "draggableTreeView",
  data(){
    return {
        simple: [
        {
          label: "Satisfied customers (with avatar)",
          avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
          children: [
            {
              label: "Good food (with icon)",
              icon: "restaurant_menu",
              children: [
                { label: "Quality ingredients" },
                { label: "Good recipe" }
              ]
            },
            {
              label: "Good service (disabled node with icon)",
              icon: "room_service",
              children: [
                { label: "Prompt attention", disabled: true },
                { label: "Professional waiter" }
              ]
            },
            {
              label: "Pleasant surroundings (with icon)",
              icon: "photo",
              children: [
                {
                  label: "Happy atmosphere (with image)",
                  img: "https://cdn.quasar.dev/img/logo_calendar_128px.png"
                },
                { label: "Good table presentation" },
                { label: "Pleasing decor" }
              ]
            }
          ]
        }
      ]
    }
  },
  methods:{
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
        if (node.label === label)
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

      const fromResult = this.getNodeByLabel(this.simple, from, -1);
      const toResult =
        to === "root" ? null : this.getNodeByLabel(this.simple, to, -1);

      if (fromResult) {
        // Return if trying to move a parent node into a child of that same parent
        if (
          toResult &&
          this.getNodeByLabel(fromResult.node, toResult.node.label, -1)
        )
          return;

        if (fromResult.parent && fromResult.parent.children) {
          fromResult.parent.children.splice(fromResult.index, 1);
        } else {
          this.simple.splice(fromResult.index, 1);
        }

        if (toResult && toResult.node) {
          if (toResult.node.children)
            toResult.node.children.splice(0, 0, fromResult.node);
          // else Vue.set(toResult.node, "children", [fromResult.node]);
          else toResult.node["children"]= [fromResult.node];
          this.$refs.tree.setExpanded(toResult.node.label, true);
        } else if (to === "root") {
          this.simple.splice(this.simple.length, 0, fromResult.node);
        }
      }
    },
    dragStart(event, key) {
      if (event.target) {
        const target = event.target;
        const parent = this.getNodeParent(target);
        if (parent) parent.classList.add("dragging");
      }
      if (event.dataTransfer && event.target)
        event.dataTransfer.setData("node", key);
    },
    dragStop(event) {
      if (event.target) {
        const target = event.target;
        const parent = this.getNodeParent(target);
        if (parent) parent.classList.remove("dragging");
      }
    },
    drop(event, key) {
      event.preventDefault();
      const target = event.target;
      let nodeKey = "";
      if (event.dataTransfer) nodeKey = event.dataTransfer.getData("node");
      if (target) target.classList.remove("container");
      if (nodeKey) {
        this.moveNode(nodeKey, key);
        console.log(`Move ${nodeKey} to ${key}`);
      }
    },
    dragOver(event) {
      event.preventDefault();
      const target = event.target;
      if (target) target.classList.add("container");
    },
    dragLeave(event) {
      event.preventDefault();
      const target = event.target;
      if (target) target.classList.remove("container");
    },
    dragEnter(event) {
      event.preventDefault();
    }
  }
}
</script>

<template>
  <div
      id="draggable-tree"
  >
    <div class="q-pa-md q-gutter-sm">
    <q-tree ref="tree" :nodes="simple" node-key="label" default-expand-all class="mett-page-tree">
      <template v-slot:default-header="prop">
				<div
					class="row items-center fit mett-tree-item cursor-pointer"
					draggable="true"
					@drop="drop($event, prop.key)"
          @dragenter="dragEnter"
					@dragover="dragOver"
					@dragleave="dragLeave"
					@dragstart="dragStart($event, prop.key)"
					@dragend="dragStop"
				>
					{{ prop.node.label }}
				</div>
			</template>
    </q-tree>
    	<div class="q-pa-md text-grey-7 mett-tree-item" @drop="drop($event, 'root')" @dragover="dragOver" @dragenter="dragEnter" @dragLeave="dragLeave">
			Move to root
		</div>
  </div>
  </div>

</template>

<style scoped lang="css">
[draggable="true"] {
  /*
   To prevent user selecting inside the drag source
  */
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.mett-page-tree {
  .q-tree__node-header {
    padding: 0;
  }

  .q-tree__node--child > .q-tree__node-header {
    &:focus {
      box-shadow: none;
    }
  }

  .q-tree__node {
    &.dragging {
      background: rgba(#333f52, 0.1);
      border-radius: 4px;

      .q-hoverable:hover > .q-focus-helper {
        background: none;
        opacity: 0;
      }
    }
  }
}

.mett-tree-item {
  border-radius: 4px;
  padding: 8px;

  &.container {
    background: rgba(#008847, 0.1);
  }
}


</style>