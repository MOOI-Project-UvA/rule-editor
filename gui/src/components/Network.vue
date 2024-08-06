<template>
    <ForceDirectedGraph :nodesAndLinks="highlightedAndFilteredNetwork" @node-clicked="toggleOpenFrame" />
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
        frameBeingEdited() {
            return this.$store.state.frameBeingEdited
        },
        framesOpenInEditor() {
            return this.$store.state.framesOpenInEditor
        },
        idsOfActsOpenInEditor() {
            return this.framesOpenInEditor.filter(f => f.typeId == "act").map(act => act.id)
        },
        network() {
            const network = new Network()
            network.createNetwork(this.frames)
            console.log("created network")
            network.nodes.forEach(node => {
                node.color = node.subType ? hexColorsLight[node.subType] : hexColorsLight[node.type]
                node.radius = nodeSizes[node.type]
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
        highlightedAndFilteredNetwork() {
            this.network.nodes.forEach(node => {
                node.stroke = this.framesOpenInEditor.map(f => f.id).includes(node.id) ? "#ffa900" : "none"
            })
            this.network.setNodeVisibility(this.idsOfActsOpenInEditor)
            return { nodes: this.network.nodes, links: this.network.links } //this triggers redrawing the network
        }
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
        idsOfActsOpenInEditor() {
            console.log("ids of acts open", this.idsOfActsOpenInEditor)
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