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
    }),
    components: {
        NodeLinkDiagram,
        FrameDetailsTreePlot
    },
    created() {
        this.$store.state.network = new Network(this.frames) //TODO: change this, so network is not recreated every time the user switches view
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
        network() {
            return this.$store.state.network
        },
        nodesInNetwork() {
            return this.$store.state.network ? this.$store.state.network.nodes : [] 
        }
    },
    methods: {
        deleteNode(node) {
            console.log("DELETE node", node)
            this.network.deleteNode(node.frame)
        }
    },
    watch: {
        nodesInNetwork() {
            console.log("nodesInNetwork changed")
            this.nodes = this.network.nodes
            this.links = this.network.links
        },
        network() {
            console.log("network changed")
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