<template>
    <ForceDirectedGraph :nodesAndLinks="nodesAndLinks" @node-clicked="toggleOpenFrame" />
</template>

<script>
import { Network } from "../model/network.js"
import { hexColorsLight, nodeSizes } from "../helpers/config.js"
import ForceDirectedGraph from "./ForceDirectedGraph.vue";
import { max } from "d3-array"
export default {
    data: () => ({
        colors: hexColorsLight,
        //when laying out sequence of acts, aim for this distance between them
        horizontalDistanceBetweenActs: 100
    }),
    components: {
        ForceDirectedGraph
    },
    computed: {
        frames() {
            return this.$store.state.frames;
        },
        acts() {
            return this.frames.filter(frame => frame.typeId == "act")
        },
        frameBeingEdited() {
            return this.$store.state.frameBeingEdited
        },
        framesOpenInEditor() {
            return this.$store.state.framesOpenInEditor
        },
        actsOpenInEditor() {
            return this.framesOpenInEditor.filter(frame => frame.typeId == "act")
        },
        nodesAndLinks() {
            let network = new Network()
            network.addNodesAndDependencyRelationsForActs(this.acts, this.actsOpenInEditor)
            //add preferred position
            //add colors
            //add node sizes
            // color: frame.subtypeId ? hexColorsLight[frame.subtypeId] : hexColorsLight[frame.typeId],
            //     radius: nodeSizes[frame.typeId],
            //     preferredPosition: null
            network.nodes.forEach(node => {
                node.color = node.subType ? hexColorsLight[node.subType] : hexColorsLight[node.type]
                node.radius = nodeSizes[node.type]
                node.stroke = this.framesOpenInEditor.map(f => f.id).includes(node.id) ? "#ffa900" : "none"
            })
            network.links.forEach(link => {
                link.color = link.type == "dependency" ? hexColorsLight["act"] : "#dddddd"
                link.drawArrow = link.type == "dependency"
            })
            //add preferred positions for act nodes
            const actNodes = network.nodes.filter(n => n.type == "act")
            //get largest sequence index
            const largestSequenceNumber = max(actNodes.map(n => n.sequenceIndex))
            actNodes.forEach(actNode => {
                actNode.preferredPosition = {
                    x: (actNode.sequenceIndex - largestSequenceNumber / 2) * this.horizontalDistanceBetweenActs,
                    strength: 0.3
                }
            })
            return network
        },
    },
    methods: {
        toggleOpenFrame(node) {
            //check if node's frame is already open in editor. If so, close it.
            const index = this.framesOpenInEditor.findIndex(f => f.id == node.id)
            const frame = this.frames.find(f => f.id == node.id)
            if (index == -1) {
                //not yet open in editor, add it
                this.$store.state.frameBeingEdited = frame
                this.$store.state.framesOpenInEditor.push(frame)
            } else {
                //node is already open; close it.
                this.$store.commit("removeFrameFromEditList", frame)
            }
        },
    },
    watch: {
        nodesAndLinks() {
            console.log("***this.nodesAndLinks", this.nodesAndLinks)

        }
    }
}
</script>

<style>
.height-fill-available {
    width: 100%;
    height: 100%;
    flex: 1;
    /* Fill available height */
    overflow-y: auto;
    /* Enable vertical scrolling */
}
</style>