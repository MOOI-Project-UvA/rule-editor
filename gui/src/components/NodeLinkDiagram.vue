<template>
    <div ref="container">
        <svg :width="width" :height="height">
            <g :transform="`translate(${width / 2},${height / 2})`">
                <g id="nodes">
                    <circle v-for="node in nodePositions" :cx="node.x" :cy="node.y" r="5"
                        fill="#000000" stroke="#000000" stroke-width="2"
                        @mousedown=""/>
                </g>
            </g>
        </svg>
    </div>
    
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
        width: 0,
        height: 0
    }),
    props: {
        nodes: Array,
        links: Array
    },
    mounted() {
        //handle event coming from forceSimulation when node positions have been calculated
        positionsUpdated.on('change', (network) => {
            this.nodePositions = network.nodePositions
            this.linkPositions = network.linkPositions
        });
        this.setSize()
        initSimulation()
        restartSimulation(this.nodes, this.links)
    },
    computed: {
    },
    methods: {
        setSize() {
            const bbox = this.$refs.container.getBoundingClientRect()
            console.log(bbox.width, bbox.height)
            this.width = bbox.width
            this.height = bbox.height
        },
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