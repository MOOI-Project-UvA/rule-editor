<template>
    <div>Fact or Booleanconstruct</div>
    <q-icon name="mdi-close" color="red" size="14px"/>
    <div v-for="node in visibleNodes">
        {{ node.frame.shortName }}
    </div>
</template>

<script>
import { Tree } from "../model/viz/tree.js";
import { max } from "d3-array"

const margin = { left: 20, right: 700, top: 16, bottom: 16 };
const nodeSpacing = {
    hor: 30,
    vert: 30,
    onlyChildVertShift: 30,
};
const operatorSymbols = {
    greaterThan: ">",
    lessThan: "<",
    lessThanOrEqualTo: "≤",
    greaterThanOrEqualTo: "≥",
    equals: "==",
    assign: "=",
    plus: "+",
    minus: "-",
};

const dotsAndLinesColor = "#555555";


export default {
    data: () => ({
        tree: null,
        visibleNodes: []
    }),
    props: {
        factOrBooleanConstruct: Object
    },
    mounted() {
        this.tree = new Tree(this.factOrBooleanConstruct);
        console.log("this.tree", this.tree)
        //only top node visible, or (if top node is a boolean operator) the top 2 layers
        if (this.tree.root.outgoingLinks.length == 1) {
            this.tree.root.collapsed = true;
        } else {
            this.tree.root.collapsed = false;
            this.tree.root.outgoingLinks.forEach((link) => {
                link.target.collapsed = true;
            });
        }
        this.updateNodePositions();
    },
    computed: {
        width() {
            return margin.left + max(this.visibleNodes.map((n) => n.position[0])) + margin.right;
        },
        height() {
            return margin.top + max(this.visibleNodes.map((n) => n.position[1])) + margin.top;
        }
    },
    methods: {
        getAllNodes(node) {
            return [node].concat(
                node.outgoingLinks.map((link) => this.getAllNodes(link.target)).flat()
            );
        },
        getVisibleLeafNodes(node) {
            return node.outgoingLinks.length == 0 || node.collapsed
                ? [node]
                : node.outgoingLinks
                    .map((link) => this.getVisibleLeafNodes(link.target))
                    .flat();
        },
        setNodePositions(node) {
            //set x position
            if (node.incomingLinks.length == 0) {
                node.position[0] = 0;
            } else {
                const parentNode = node.incomingLinks[0].source;
                node.position[0] = parentNode.position[0] + nodeSpacing.hor;
            }
            //set y position. y position of leafs have been set in updateNodePositions
            if (!node.collapsed && node.outgoingLinks.length > 0) {
                //first set position of children, then
                //take y pos of first child
                const children = node.outgoingLinks.map((link) => link.target);
                children.forEach((child) => {
                    this.setNodePositions(child);
                });
                node.position[1] = children[0].position[1];
            }
        },
        updateNodePositions() {
            const allNodes = this.getAllNodes(this.tree.root);
            allNodes.forEach((node) => {
                node.position = []; //empty array means node is invisible
            });
            //set y-pos of visible leaf nodes
            this.getVisibleLeafNodes(this.tree.root).forEach((leaf, i) => {
                leaf.position[1] = i * nodeSpacing.vert;
            });
            //tree is null when bc is empty (no frame, no children)
            this.setNodePositions(this.tree.root);
            this.shiftDownSingleChildNodes(this.tree.root);
            this.visibleNodes = allNodes.filter((node) => node.position.length > 0);
            console.log("this.visibleNodes", this.visibleNodes)
        },
        shiftDownSingleChildNodes(node, dy = 0) {
            //apply shift of ancestor(s)
            let shift = dy;
            node.position[1] += shift;
            if (!node.collapsed) {
                if (node.outgoingLinks.length == 1) {
                    shift += nodeSpacing.onlyChildVertShift;
                    shift = this.shiftDownSingleChildNodes(
                        node.outgoingLinks[0].target,
                        shift,
                    );
                } else {
                    node.outgoingLinks.forEach((link) => {
                        shift = this.shiftDownSingleChildNodes(link.target, shift);
                    });
                }
            }
            return shift;
        }
    },
    watch: {
        width() {
            console.log("width", this.width)
        },
        height() {
            console.log("height", this.height)
        }
    }
}
</script>