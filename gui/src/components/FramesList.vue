<template>
    <div>
        <div class="fact-container" v-for="(frameType, frameTypeId) in frameTypes">
            <div class="row">
                <b>{{ frameType.label }}</b>
                <div v-if="networkShowing" class="q-ml-xs">
                    <q-btn
                        class="no-padding "
                        flat
                        round
                        color="primary"
                        size="xs"
                        icon="mdi-plus"
                        @click="addNodes(frameTypeId)"
                    />
                    <q-btn
                        class="no-padding"
                        flat
                        round
                        color="secondary"
                        size="xs"
                        icon="mdi-close"
                        @click="deleteNodes(frameTypeId)"
                    />
                </div>
            </div>
            <div class="chips">
                <div v-for="frame in getFrames(frameTypeId, null)">
                    <FrameChip :frame="frame" :showInverse="networkShowing && !isInNetwork(frame)"/>
                </div>
            </div>
            <div v-if="'subTypes' in frameType">
                <div v-for="(subType, subTypeId) in frameType.subTypes" class="q-ml-sm">
                    <div class="row">
                        <q-avatar size="md" :icon="icons[subTypeId]" />
                        <b>{{ subType.label }}</b>
                        <div v-if="networkShowing" class="q-ml-xs">
                            <q-btn
                                class="no-padding"
                                flat
                                round
                                color="primary"
                                size="xs"
                                icon="mdi-plus"
                                @click="addNodes(frameTypeId, subTypeId)"
                            />
                            <q-btn
                                class="no-padding"
                                flat
                                round
                                color="secondary"
                                size="xs"
                                icon="mdi-close"
                                @click="deleteNodes(frameTypeId, subTypeId)"
                            />
                        </div>
                    </div>
                    <div class="chips">
                        <div v-for="frame in getFrames(frameTypeId, subTypeId)">
                            <FrameChip :frame="frame" :showInverse="networkShowing && !isInNetwork(frame)"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FrameChip from "../components/FrameChip.vue";
import { frameTypes } from "../model/frame";
import { icons } from "../helpers/config";
export default {
    data: () => ({
        frameTypes: frameTypes,
        icons: icons,
        minimumLengthSearchTerm: 2
    }),
    components: {
        FrameChip,
    },
    props: {
        searchTerm: String,
    },
    computed: {
        frames() {
            return this.$store.state.frames;
        },
        filteredFrames() {
            let frames = this.searchTerm.length >= this.minimumLengthSearchTerm
                ? this.frames.filter(f => f.shortName.toLowerCase().includes(this.searchTerm.toLowerCase()))
                : this.frames
            frames.sort((f1, f2) => f1.shortName.localeCompare(f2.shortName))
            return frames
        },
        frameBeingEdited() {
            return this.$store.state.frameBeingEdited;
        },
        annotationToBeAddedToExistingFrame() {
            return this.$store.state.annotationToBeAddedToExistingFrame
        },
        addingAnnotationToExistingFrame() {
            return this.$store.state.addingAnnotationToExistingFrame
        },
        framesOpenInEditor() {
            return this.$store.state.framesOpenInEditor
        },
        booleanConstructBeingEdited() {
            return this.$store.state.booleanConstructBeingEdited
        },
        network() {
            return this.$store.state.network
        },
        networkShowing() {
            return this.$store.state.activeView.id == 3 //View interpretation
        }
    },
    methods: {
        getFrames(typeId, subTypeId) {
            return subTypeId
                ? this.filteredFrames.filter((f) => f.typeId == typeId && f.subTypeIds.includes(subTypeId))
                : this.filteredFrames.filter((f) => f.typeId == typeId && (f.typeId != 'fact' || f.subTypeIds.length == 0))
        },
        isInNetwork(frame) {
            return this.network.nodes.some(n => n.frame.id == frame.id)
        },
        addNodes(typeId, subTypeId) {
            this.getFrames(typeId, subTypeId).forEach(f => this.network.addNode(f))
        },
        deleteNodes(typeId, subTypeId) {
            this.getFrames(typeId, subTypeId).forEach(f => this.network.deleteNode(f))
        }
    }
}
</script>

<style lang="css" scoped>
.class-label {
    text-transform: uppercase;
}

.fact-container {
    margin: 10px 0px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.chips {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.grayed-out {
    /* opacity: 0.9; */
    filter:grayscale(0.8)
}
.no-padding {
    padding: -2px;
}
.inline {
    display: inline-block;
}
</style>