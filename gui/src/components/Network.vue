<template>
    <ForceDirectedGraph :nodesAndLinks="nodesAndLinks" @node-clicked="openFrame" />
</template>

<script>
import {
    getDependencyRelationsBetweenActs,
    getBooleanConstructAsNodesAndLinks,
    getFrameListAsNodesAndLinks,
    setSequenceOfActnodes
} from "../helpers/network.js"
import { hexColorsLight } from "../helpers/config.js"
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
        framesOpenInEditor() {
            return this.$store.state.framesOpenInEditor
        },
        dependenciesBetweenActs() {
            return getDependencyRelationsBetweenActs(this.frames)
        },
        nodesAndLinks() {
            //for debugging: print all frames
            console.log("frames", this.frames)

            //as a default, only show acts and their dependency links
            let nodes = this.frames.filter(frame => frame.typeId == "act").map(act =>
            ({
                id: act.id,
                label: act.label,
                typeId: act.typeId,
                subtypeId: null,
                color: this.colors[act.typeId],
                radius: 10
            })
            )
            let links = this.dependenciesBetweenActs.map(dep =>
            ({
                source: dep.sourceAct.id,
                target: dep.targetAct.id,
                type: "dependency",
                color: "#333333",
                drawArrow: true
            })
            )
            //add all other frames connected with any acts (via a role) that are open in the editor
            let nodesFromRoles = []
            let linksFromRoles = []
            this.framesOpenInEditor.filter(frame => frame.typeId == "act").forEach(act => {
                //get frames for this act, via roles
                //single value roles:
                ["action", "actor", "object", "recipient"].forEach(roleAttribute => {
                    const fact = act[roleAttribute]
                    if (fact) {
                        nodesFromRoles.push({
                            id: fact.id,
                            label: fact.label,
                            typeId: fact.typeId,
                            subtypeId: fact.subTypeId,
                            color: fact.subTypeId ? this.colors[fact.subTypeId] : this.colors[fact.typeId],
                            radius: 5
                        })
                        linksFromRoles.push({
                            source: act.id,
                            target: fact.id,
                            type: roleAttribute,
                            color: "#ffffff",
                            drawArrow: false
                        })
                    }
                })
                //add nodes and links for precondition, if any
                const preconditionNodesAndLinks = getBooleanConstructAsNodesAndLinks(act.precondition)
                //the first node is the root of the precondition
                if (preconditionNodesAndLinks.nodes.length > 0) {
                    linksFromRoles.push({
                        source: act.id,
                        target: preconditionNodesAndLinks.nodes[0].id,
                        type: "precondition",
                        color: "#ffffff",
                        drawArrow: false
                    })
                    nodesFromRoles = nodesFromRoles.concat(preconditionNodesAndLinks.nodes)
                    linksFromRoles = linksFromRoles.concat(preconditionNodesAndLinks.links)
                }
                //add nodes and links for 'creates' and 'terminates'
                ["creates", "terminates"].forEach(roleAttribute => {
                    const frameListNodesAndLinks = getFrameListAsNodesAndLinks(act[roleAttribute])
                    console.log("frameListNodesAndLinks", frameListNodesAndLinks)
                    if (frameListNodesAndLinks.nodes.length > 0) {
                        //first node is anonymous node representing framelist
                        linksFromRoles.push({
                            source: act.id,
                            target: frameListNodesAndLinks.nodes[0].id,
                            type: roleAttribute,
                            color: "#ffffff",
                            drawArrow: false
                        })
                        nodesFromRoles = nodesFromRoles.concat(frameListNodesAndLinks.nodes)
                        linksFromRoles = linksFromRoles.concat(frameListNodesAndLinks.links)
                    }
                })
            })
            console.log("nodesFromRoles", nodesFromRoles, "linksFromRoles", linksFromRoles)
            console.log("nodes", nodes, "links", links)
            //some facts may be part of multiple roles, and end up multiple times in the nodesFromRoles list
            //filter out those duplicates
            nodesFromRoles = nodesFromRoles.filter((node, index, array) => array.findIndex(n => n.id == node.id) === index)
            // links = links.filter((link, index, array) => array.findIndex(
            //     l => l.source == link.source && l.target == link.target && l.type == link.type
            // ) === index)
            nodes = nodes.concat(nodesFromRoles)
            links = links.concat(linksFromRoles)
            const network = { nodes: nodes, links: links }
            setSequenceOfActnodes(network)
            //use sequence index to set preferred x position and the strength of the force pushing the node to that x position
            const largestSequenceNumber = max(network.nodes.filter(n => n.typeId == "act").map(act => act.sequenceIndex))
            console.log("largestSequenceNumber", largestSequenceNumber)
            network.nodes.forEach(node => {
                node.preferredX = node.typeId == "act"
                    ? (node.sequenceIndex - largestSequenceNumber / 2) * this.horizontalDistanceBetweenActs
                    : 0 //center
                node.strengthX = node.typeId == "act"
                    ? 0.3
                    : 0.1
            })
            console.log("network", network)
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