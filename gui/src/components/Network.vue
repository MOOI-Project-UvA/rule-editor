<template>
    <ForceDirectedGraph :nodesAndLinks="nodesAndLinks" @node-clicked="openFrame" />
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
                link.color = link.type == "dependency" ? hexColorsLight["act"] : "#ffffff"
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
            network.printInConsole()
            return network
        },
    },
    methods: {
        openFrame(node) {
            console.log("open frame", node)
            //find corresponding frame
            const frame = this.frames.find(f => f.id == node.id)
            //open this frame in edit panel
            this.$store.state.frameBeingEdited = frame
            //if the frame is not yet in the list of edited frames, add it
            if (!(this.framesOpenInEditor.some(f => f.id == frame.id))) {
                this.$store.state.framesOpenInEditor = [...this.$store.state.framesOpenInEditor, frame]
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