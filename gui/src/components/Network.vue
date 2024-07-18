<template>
    <ForceDirectedGraph :nodesAndLinks="nodesAndLinks" @node-clicked="openFrame" />
</template>

<script>
import { getDependencyRelationsBetweenActs } from "../helpers/network.js"
import { hexColorsLight } from "../helpers/config.js"
import ForceDirectedGraph from "./ForceDirectedGraph.vue";
export default {
    data: () => ({
        colors: hexColorsLight
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
            //for now: only show acts and show facts that are part of the
            //dependency between 2 acts, i.e. facts that are part of
            //'creates' of one act, and part of 'precondition' of the depending act
            //const nodes = this.dependenciesBetweenActs
            //dependency relations between acts
            //relations between acts and facts:
            //act-'creates'-fact, fact-'isPartOfPrecondition'-act
            let nodes = []
            let links = []
            //add all acts to node list
            this.frames.filter(frame => frame.typeId == "act").forEach(act => {
                nodes.push({
                    id: act.id,
                    label: act.label,
                    typeId: act.typeId,
                    subtypeId: null,
                    color: this.colors[act.typeId],
                    radius: 10
                })
            })
            this.dependenciesBetweenActs.forEach(dep => {
                //add facts to network that are part of dependency between acts
                dep.dependencyFacts.forEach(fact => {
                    nodes.push({
                        id: fact.id,
                        label: fact.label,
                        typeId: fact.typeId,
                        subtypeId: fact.subtypeId,
                        color: fact.subtypeId ? this.colors[fact.subtypeId] : this.colors[fact.typeId],
                        radius: 5
                    })
                })
                links.push({
                    source: dep.sourceAct.id,
                    target: dep.targetAct.id,
                    type: "dependency",
                    drawArrow: true
                })
                dep.dependencyFacts.forEach(fact => {
                    links.push({
                        source: dep.sourceAct.id,
                        target: fact.id,
                        type: "creates",
                        drawArrow: false
                    })
                    links.push({
                        source: fact.id,
                        target: dep.targetAct.id,
                        type: "isPartOfPrecondition",
                        drawArrow: false
                    })
                })
            })
            nodes = nodes.filter((node, index, array) => array.findIndex(n => n.id == node.id) === index)
            links = links.filter((link, index, array) => array.findIndex(
                l => l.source == link.source && l.target == link.target && l.type == link.type
            ) === index)
            return { nodes: nodes, links: links }
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
        dependenciesBetweenActs() {
            console.log("this.dependenciesBetweenActs", this.dependenciesBetweenActs)
        },
        nodesAndLinks() {
            console.log("this.nodesAndLinks", this.nodesAndLinks)
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