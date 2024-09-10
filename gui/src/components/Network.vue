<template>
    <NetworkMenu />
    <ForceDirectedGraph :nodesAndLinks="visibleNetwork" @node-clicked="toggleCollapse" />
</template>

<script>
import { Network } from "../model/network.js"
import NetworkMenu from "./NetworkMenu.vue"
import { hexColorsLight, nodeSizes } from "../helpers/config.js"
import ForceDirectedGraph from "./ForceDirectedGraph.vue";
import { max } from "d3-array"

export default {
    data: () => ({
        colors: hexColorsLight,
        //when laying out sequence of acts, aim for this distance between them
        horizontalDistanceBetweenActs: 100,
        idsOfNodesInNetwork: []
    }),
    components: {
        ForceDirectedGraph,
        NetworkMenu
    },
    mounted() {
        //check if a frame is selected, if so, set this as starting point for the network
        if (this.frameBeingEdited) {
            this.idsOfNodesInNetwork = [this.frameBeingEdited.id]
        }
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
        frameFilter() {
            return this.$store.state.frameFilter
        },
        idsOfActsOpenInEditor() {
            return this.framesOpenInEditor.filter(f => f.typeId == "act").map(act => act.id)
        },
        network() {
            const network = new Network()
            network.createNetwork(this.frames)
            console.log("created network")
            //add styling: color and size
            network.nodes.forEach(node => {
                node.color = node.subType ? hexColorsLight[node.subType] : hexColorsLight[node.type]
                node.radius = nodeSizes[node.type]
                node.isInVisualization = false
                node.isCollapsed = true //don't show children
            })
            //add styling: color and arrow
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
        visibleNetwork() {
            console.log("visibleNetwork")
            //apply filter, leaving out nodes that are not part of the visible network or that do not apply to filter
            const visibleNodes = this.network.nodes.filter(n => this.idsOfNodesInNetwork.includes(n.id) && this.nodeFitsFilter(n))
            const visibleLinks = this.network.links.filter(l => visibleNodes.includes(l.source.visible)
                && visibleNodes.includes(l.target.visible))
            return { nodes: visibleNodes, links: visibleLinks } //this triggers redrawing the network
        }
    },
    methods: {
        // toggleOpenFrame(node) {
        //     //check if node's frame is already open in editor. If so, close it.
        //     const index = this.framesOpenInEditor.findIndex(f => f.id == node.id)
        //     const frame = this.frames.find(f => f.id == node.id)
        //     if (index == -1) {
        //         //not yet open in editor, add it
        //         this.$store.state.frameBeingEdited = frame
        //         this.$store.state.framesOpenInEditor.push(frame)
        //     } else {
        //         //node is already open; close it.
        //         this.$store.commit("removeFrameFromEditList", frame)
        //     }
        // },
        toggleCollapse(node) {
            console.log("clicked node", node)
            console.log("related nodes",)
            // if (node.isCollapsed) {
            //     console.log("node is collapsed. Expanding node...")
            //     //show immediate children
            //     node.isCollapsed = false
            //     this.network.getRelatedNodes(node).forEach(child => {
            //         console.log("related node", child)
            //         if (!(this.idsOfNodesInNetwork.includes(child.id))) {
            //             this.idsOfNodesInNetwork.push(child.id)
            //         }
            //     })
            // } else {
            //     //hide all descendants and collapse all descendants
            //     node.isCollapsed = true
            //     this.network.getDescendants(node).forEach(descendant => {
            //         console.log("descendant", descendant)
            //         const nodeIndex = this.idsOfNodesInNetwork.findIndex(descendant.id)
            //         this.idsOfNodesInNetwork.splice(nodeIndex, 1)
            //         descendant.isCollapsed = true
            //     })
            // }
            // this.idsOfNodesInNetwork = [...this.idsOfNodesInNetwork]
        },
        nodeFitsFilter(node) {
            return Object.keys(this.frameFilter).length == 0
                || (this.frameFilter[node.type].selected && (!(node.subType) || this.frameFilter[node.type].subTypes[node.subType].selected))
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