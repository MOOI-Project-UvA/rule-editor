<template>
    <div>
        <template v-for="frameClass in ['fact', 'relation']">
            <div class="class-label">{{ frameClass }}</div>
            <div class="fact-container" v-for="frameType in frameTypes.filter((t) => t.class == frameClass)">
                <div v-if="frameType.class != 'fact'">
                    <b>{{ frameType.label }}</b>
                </div>
                <div class="chips">
                    <div v-for="frame in frames.filter(
            (f) => f.type.id == frameType.id && !f.subType,
        )" @click="onClick(frame)">
                        <FrameChip :frame="frame" :disable="frameBeingEdited != null &&
            frameBeingEdited.type.class == 'relation' &&
            frameBeingEdited.activeField != null" />
                    </div>
                </div>
                <div v-if="'subTypes' in frameType">
                    <div v-for="subType in frameType.subTypes" class="q-ml-sm">
                        <q-avatar size="md" :icon="icons[subType.id]" />
                        <b>{{ subType.label }}</b>
                        <div class="chips">
                            <div v-for="frame in frames.filter(
            (f) =>
                f.type.id == frameType.id &&
                f.subType &&
                f.subType.id == subType.id,
        )" @click="onClick(frame)">
                                <FrameChip :frame="frame" :disable="frameBeingEdited != null &&
            frameBeingEdited.type.class == 'relation' &&
            frameBeingEdited.activeField != null &&
            !frameBeingEdited.allowedSubTypesForActiveField.includes(subType.id)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
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
    }),
    mounted() {
        console.log("frameslist mounted: frametypes", this.frameTypes)
    },
    components: {
        FrameChip,
    },
    computed: {
        frames() {
            return this.$store.state.frames;
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
        }
    },
    methods: {
        onClick(frame) {
            console.log("clicked frame", frame);
            console.log("this.frameBeingEdited", this.frameBeingEdited);
            console.log("this.annotationBeingEdited", this.annotationBeingEdited);

            if (
                this.addingAnnotationToExistingFrame
            ) {
                this.$store.state.annotationToBeAddedToExistingFrame.frame = frame
                this.$store.state.addingAnnotationToExistingFrame = false;
                this.$store.state.annotationToBeAddedToExistingFrame = null;
            } else if (
                this.frameBeingEdited &&
                this.frameBeingEdited.type.class == "relation" &&
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
                console.log("setting frame being edited");
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