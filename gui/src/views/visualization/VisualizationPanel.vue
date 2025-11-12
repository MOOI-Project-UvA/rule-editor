<!-- shows the actual visualization: the overall node-link graph of acts, and the detailed tree-view of a frame -->
<template>
    <div>
        <NodeLinkDiagram :nodes="network.nodes" :links="network.links"/>
    </div>
</template>

<script>
import NodeLinkDiagram from "../../components/NodeLinkDiagram.vue";
import {Network} from "../../model/viz/network.js" // class for storing data on nodes and links

export default {
    data: () => ({
        
    }),
    components: {
        NodeLinkDiagram,
    },
    computed: {
        frames() {
            return this.$store.state.frames;
        },
        network() {
            return new Network(this.frames) //if frames changes, maybe not recreate a whole new network?
        }
    }
}
</script>