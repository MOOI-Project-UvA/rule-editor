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
            frameBeingEdited.activeField &&
            !allowedSubTypes.includes(frameType.id)
            " :removable="message === 'Click to edit'" functionality="chip-container" />
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
            frameBeingEdited.activeField &&
            !allowedSubTypes.includes(subType.id)
            " :removable="message === 'Click to edit'" functionality="chip-container" />
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
        allowedSubTypes() {
            console.log("frameBeingEdited", this.frameBeingEdited);
            return this.$store.state.frameBeingEdited &&
                this.frameBeingEdited.type.class == "relation"
                ? this.frameBeingEdited.allowedSubClassesForActiveField
                : [];
        },
        message() {
            return this.frameBeingEdited &&
                ["act", "claim_duty"].includes(this.frameBeingEdited)
                ? "Add to frame"
                : "";
        },
        annotationBeingEdited() {
            return this.$store.state.annotationBeingEdited
        },
        addingAnnotationToExistingFrame() {
            return this.$store.state.addingAnnotationToExistingFrame
        }
    },
    methods: {
        onClick(frame) {
            console.log("clicked frame", frame);
            console.log("this.frameBeingEdited", this.frameBeingEdited);
            console.log("this.annotationBeingEdited", this.annotationBeingEdited);

            if (
                this.annotationBeingEdited &&
                this.addingAnnotationToExistingFrame
            ) {
                this.$store.state.annotationBeingEdited.frame = frame
                this.$store.state.addingAnnotationToExistingFrame = false;
                this.$store.state.annotationBeingEdited = null;
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
                // it opens the frame form in the middle
                this.$store.state.frameBeingEdited = frame
                this.$store.state.framesOpenInEditor.push(frame)
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