<template>
    <div class="fit" ref="container" @mousemove="handleMouseMove($event)"
    @mouseup="handleMouseUp($event)">
        <svg :width="width" :height="height" ref="svg">
            <rect
                :width="width"
                :height="height"
                fill="#fafafa"
                @click="this.$store.state.selectedNode = null"
            />
            <defs>
                <marker
                    id="arrow"
                    viewBox="0 0 20 20"
                    refX="14"
                    refY="10"
                    markerWidth="12"
                    markerHeight="12"
                    orient="auto-start-reverse"
                >
                    <path
                        d="M 0 0 L 20 10 L 0 20 z"
                        :fill="this.selectedNode ? grayedOutColor : edgeColor"
                    />
                </marker>
            </defs>
            <g ref="network" >
                <g :transform="`translate(${width / 2},${height / 2})`">
                    <g id="links">
                        <path v-for="link in linkPositions"
                            :d="getCurvedPath(
                                link.source.x,
                                link.source.y,
                                link.target.x,
                                link.target.y,
                                link.directed
                            )"
                            :stroke="this.selectedNode ? grayedOutColor : edgeColor"
                            fill="none"
                            :marker-end="link.directed ? 'url(#arrow)' : ''"
                        />
                    </g>
                    <g id="nodes">
                        <g v-for="node in nodePositions"
                            class="cursor-pointer"
                            :transform="`translate(${node.x},${node.y})`"
                            @mousedown="handleMouseDown($event, node)"
                            @mouseover="showPosition(node)"
                        >
                            <NodePanel :node="node" @delete="$emit('delete', node)"/>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    </div>
</template>

<script>
import {
        initSimulation,
        restartSimulation,
        positionsUpdated,
        stopSimulation
    } from "../helpers/forceSimulation.js";
import NodePanel from "./NodePanel.vue"
import { select } from "d3-selection"
import { zoom, zoomIdentity } from "d3-zoom"
import {Network} from "../model/viz/network.js";

export default {
    data: () => ({
        nodePositions: [],
        linkPositions: [],
        width: 0,
        height: 0,
        draggedNode: null,
        draggedDistance: 0,
        mouseDownPos: null, //to see if node is just clicked or also dragged
        currentZoomLevel: 1,
        edgeColor: "#666666",
        grayedOutColor: "#dddddd",
        arrowSize: 25,
        zoomBehaviour: null
    }),
    props: {
        nodes: Array,
        links: Array
    },
    emits: ["delete"],
    mounted() {
        console.log("NLD mounted | nodes", this.nodes, "links", this.links)
        this.initZoom()
        //handle event coming from forceSimulation when node positions have been calculated
        positionsUpdated.on('change', (network) => {
            this.nodePositions = [...network.nodePositions]
            this.linkPositions = [...network.linkPositions]

           if (network.isFinal) {
            // Mark the network as simulated
            if (this.$store.state.network) {
                this.$store.state.network.simulated = true;
            }
           }

        });

        this.setSize()
        // Only run simulation if not already simulated
        if (!this.$store.state.network.simulated) {
          initSimulation();
          restartSimulation(this.nodes, this.links);
        } else {
          // Just use the stored positions
          this.nodePositions = this.nodes;
          this.linkPositions = this.links;
        }
        // initSimulation()
        // restartSimulation(this.nodes, this.links)
        // if there is a saved zoom, apply it
        if (this.$store.state.networkZoomTransform) {
          const t = this.$store.state.networkZoomTransform;
          const svg = select(this.$refs.svg);
          // Create a transform with the given zoom level and translation
          const transform = zoomIdentity.translate(t.x, t.y).scale(t.k);
          // Apply the transform
          svg.call(this.zoomBehaviour.transform, transform);
        }
    },
    components: {
        NodePanel
    },
    computed: {
        selectedNode() {
            return this.$store.state.selectedNode
        },
    },
    methods: {
        showPosition(node) {
            //console.log("node", node.fx, node.fy)
        },
        initZoom() {
            this.zoomBehaviour = zoom().on("zoom",
                (e) => {
                    this.currentZoomLevel = e.transform.k;
                    select(this.$refs.network).attr("transform", e.transform)
                    this.$store.commit('setNetworkZoom', e.transform);
                }
            )
            select(this.$refs.svg).call(this.zoomBehaviour)
        },
        setSize() {
            const bbox = this.$refs.container.getBoundingClientRect()
            this.width = bbox.width
            this.height = bbox.height
        },
        handleMouseDown(e, node) {
            e.stopPropagation();
            this.draggedNode = node;
            this.mouseDownPos = [e.clientX, e.clientY]
            //halt simulation
            stopSimulation()

        },
        handleMouseMove(e) {
            if (this.draggedNode) {
                this.draggedDistance += Math.abs(e.movementX + e.movementY);
                this.draggedNode.x += e.movementX / this.currentZoomLevel;
                this.draggedNode.y += e.movementY / this.currentZoomLevel;
                this.nodePositions = [...this.nodePositions]
            }
        },
        handleMouseUp(e) {
            if (this.draggedDistance < 3) {
                //no drag, but selection only
                this.$store.state.selectedNode =
                        this.selectedNode && this.selectedNode.id == this.draggedNode.id
                            ? null
                            : this.draggedNode;
            } else {
                //fix position
                this.draggedNode.fx = this.draggedNode.x
                this.draggedNode.fy = this.draggedNode.y
                this.draggedNode.sticky = true
                //restart simulation?
            }

            this.draggedNode = null;
            this.draggedDistance = 0;
            this.mouseDownPos = null;

        },
        //to prevent arrow point overlapping with node
        adaptLinkLength(x1, y1, x2, y2) {
            const deltaX = x2 - x1
            const deltaY = y2 - y1
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            return [
                x2 - (this.arrowSize / length) * deltaX,
                y2 - (this.arrowSize / length) * deltaY
            ]
        },
        getCurvedPath(x1, y1, x2, y2, adaptLength = false, curve = 0) {
            if (x1 == x2 && y1 == y2) {
                //self loop. shift y1 up, and y2 down
                y1 += 4;
                y2 -= 4;
            }
            if (adaptLength) { //if link is directed, shorten curve so there is room for arrow point
                [x2,y2] = this.adaptLinkLength(x1, y1, x2, y2)
            }
            const dx = x2 - x1;
            const dy = y2 - y1;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;

            const len = Math.sqrt(dx * dx + dy * dy);

            const normX = -dy / len;
            const normY = dx / len;

            const cx = mx + normX * curve;
            const cy = my + normY * curve;

            return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
        },
    },
    watch: {
        nodes() {
            console.log("NLD nodes changed", this.nodes)
            //restart simulation
            restartSimulation(this.nodes, this.links)
        },
        links() {
            console.log("links changed")
        }
    }
}
</script>

<style>
    text {
        user-select: none;
    }
</style>