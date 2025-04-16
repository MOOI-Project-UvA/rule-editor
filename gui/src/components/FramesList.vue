<template>
    <div>
        <div class="fact-container" v-for="(frameType, frameTypeId) in frameTypes">
            <b>{{ frameType.label }}</b>
            <div class="chips">
                <div v-for="frame in filteredFrames.filter(
            (f) => f.typeId == frameTypeId && (f.typeId != 'fact' || f.subTypeIds.length == 0),
        )" @click="onClick(frame)">
                    <FrameChip :frame="frame" :disable="frameBeingEdited != null &&
            ['act', 'claim-duty'].includes(frameBeingEdited.typeId) &&
            frameBeingEdited.activeField != null" />
                </div>
            </div>
            <div v-if="'subTypes' in frameType">
                <div v-for="(subType, subTypeId) in frameType.subTypes" class="q-ml-sm">
                    <q-avatar size="md" :icon="icons[subTypeId]" />
                    <b>{{ subType.label }}</b>
                    <div class="chips">
                        <div v-for="frame in filteredFrames.filter(
            (f) =>
                f.typeId == frameTypeId &&
                f.subTypeIds.includes(subTypeId),
        )" @click="onClick(frame)">
                            <FrameChip :frame="frame" :disable="frameBeingEdited != null &&
            ['act', 'claim-duty'].includes(frameBeingEdited.typeId) &&
            frameBeingEdited.activeField != null &&
            !frameBeingEdited.allowedSubTypesForActiveField.includes(subTypeId)" />
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
        searchTerm: String
    },
    computed: {
        frames() {
            return this.$store.state.frames;
        },
        filteredFrames() {
            return this.searchTerm.length >= this.minimumLengthSearchTerm
                ? this.frames.filter(f => f.shortName.toLowerCase().includes(this.searchTerm.toLowerCase()))
                : this.frames
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
        }
    },
    methods: {
        onClick(frame) {
            if (
                this.addingAnnotationToExistingFrame
            ) {
                //add annotation to this frame
                this.$store.state.annotationToBeAddedToExistingFrame.frame = frame
                this.$store.state.addingAnnotationToExistingFrame = false;
                this.$store.state.annotationToBeAddedToExistingFrame = null;
            } else if (
                this.frameBeingEdited &&
                'activeField' in this.frameBeingEdited &&
                this.frameBeingEdited.activeField
            ) {
                //add frame to field in frame being edited
                console.log("adding frame to", this.frameBeingEdited);
                this.frameBeingEdited.addFrame(frame);
                this.frameBeingEdited.activeField = null
            } else if (this.booleanConstructBeingEdited) {
                this.booleanConstructBeingEdited.frame = frame;
                this.$store.state.booleanConstructBeingEdited = null;
            } else {
                //open this frame in edit panel
                this.$store.state.frameBeingEdited = frame
                //if the frame is not yet in the list of edited frames, add it
                if (!(this.framesOpenInEditor.some(f => f.id == frame.id))) {
                    this.$store.state.framesOpenInEditor = [...this.$store.state.framesOpenInEditor, frame]
                }
            }
        },
    },
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
</style>