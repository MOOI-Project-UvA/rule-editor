<!-- shows the actual visualization: the overall node-link graph of acts, and the detailed tree-view of a frame -->
<template>
    <div class="fit relative">
        <NodeLinkDiagram v-if="network" :nodes="nodes" :links="links" @delete="deleteNode"/>
        <div v-if="selectedNode" class="overlay no-pointer-events">
            <FrameDetailsTreePlot :frame="selectedNode.frame"/>
        </div>
    </div>
</template>

<script>
import NodeLinkDiagram from "../../components/NodeLinkDiagram.vue";
import {Network} from "../../model/viz/network.js" // class for storing data on nodes and links
import FrameDetailsTreePlot from "../../components/FrameDetailsTreePlot.vue";

export default {
    data: () => ({
        nodes: [], //reactive,
        links: [], //reactive
        network: null
    }),
    components: {
        NodeLinkDiagram,
        FrameDetailsTreePlot
    },
    created() {
        this.network = new Network(this.frames)
        this.nodes = this.network.nodes
        this.links = this.network.links
    },
    computed: {
        frames() {
            return this.$store.state.frames;
        },
        
        selectedNode() {
            return this.$store.state.selectedNode
        },
        frameBeingEdited() {
            return this.$store.state.frameBeingEdited
        },       
    },
    methods: {
        deleteNode(node) {
            console.log("DELETE node", node)
            this.network.deleteNode(node)
            this.nodes = [...this.network.nodes]

        }
    },
    watch: {
        frameBeingEdited() {
            console.log("VP frameBeingEdited", this.frameBeingEdited)
            this.network.addNode(this.frameBeingEdited)
            this.nodes = [...this.network.nodes]
            console.log("this.nodes", this.nodes)
        },
        nodes() {
            console.log("VP nodes changed", this.nodes)
        },
    }
}
</script>

<style>
.relative {
    position:relative;
}
.overlay {
    position:absolute;
    top:10px;
    bottom:10px;
    right: 10px;
    width: 400px;
}
</style>