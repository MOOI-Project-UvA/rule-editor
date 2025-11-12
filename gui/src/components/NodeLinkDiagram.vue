<template>
    <div>Network</div>
    <div>{{ nodes.length }} nodes</div>
    <div>{{ links.length }} links</div>
    <svg width="1000" height="1000">
        <g :transform="`translate(${width / 2},${height / 2})`">
            <g id="nodes">
                <circle v-for="node in nodePositions" :cx="node.x" :cy="node.y" r="5"
                    fill="#000000" stroke="#000000" stroke-width="2"
                    @mousedown=""/>
            </g>
        </g>
    </svg>
</template>

<script>
import {
        initSimulation,
        restartSimulation,
        positionsUpdated
    } from "../helpers/forceSimulation.js";

export default {
    data: () => ({
        nodePositions: [],
        linkPositions: [],
        width: 1000,
        height: 1000
    }),
    props: {
        nodes: Array,
        links: Array
    },
    mounted() {
        positionsUpdated.on('change', (network) => {
            this.nodePositions = network.nodePositions
            this.linkPositions = network.linkPositions
        });
        initSimulation()
        restartSimulation(this.nodes, this.links)
    },
    computed: {
    },
    watch: {
        // nodes() {
        //     console.log("nodes changed")
        //     restartSimulation(this.nodes, this.links)
        // },
        // links() {
        //     restartSimulation(this.nodes, this.links)
        // },
        // nPos() {
        //     console.log("nodePositions changed", this.nPos)
        // }
        nodePositions() {
            console.log("nodePositions", this.nodePositions)
        }
    }
}
</script>