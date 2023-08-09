<template>
    <div>
        <template v-if="booleanConstruct.frame">
            <!-- boolean construct is 'atomic': it refers to a frame, and has no children -->
            <div>
                <q-btn size="sm" :text-color="booleanConstruct.isNegated ? 'white' : 'grey-5'"
                    :color="booleanConstruct.isNegated ? 'negative' : 'grey-5'" dense :flat="!booleanConstruct.isNegated"
                    @click="booleanConstruct.isNegated = !booleanConstruct.isNegated">NOT</q-btn>
                <FrameChip :frame="booleanConstruct.frame" :disable="false" :removable="true" functionality="editor-form"
                    @remove="removeChipFromContext" />
            </div>

        </template>
        <template v-if="booleanConstruct.children.length > 0">
            <!-- boolean construct is not atomic: it has one or more children joined by a boolean operator. -->
            <!-- each child is a boolean construct -->
            <div class="bordered-panel">
                <div v-for="child, i in booleanConstruct.children">
                    <BooleanConstructPanel :booleanConstruct="child" />
                    <template v-if="i < booleanConstruct.children.length - 1">
                        <div class="operator-label">{{ booleanConstruct.operatorToJoinChildren }}</div>
                    </template>

                    <template v-else>
                        <!-- after last child: -->
                        <!-- show button(s) for adding another child if the last child has a value -->
                        <!-- show multiple buttons if this BC has no operator set yet -->
                        <!-- else show one button with this BC's operator -->
                        <template v-if="child.frame || child.children.length > 0">

                            <template v-if="booleanConstruct.operatorToJoinChildren">
                                <q-btn class="q-mt-sm" size="sm" color="primary" dense
                                    @click="addChild(booleanConstruct.operatorToJoinChildren)">{{
                                        booleanConstruct.operatorToJoinChildren }}</q-btn>
                            </template>
                            <template v-else>
                                <!-- show options for boolean operator -->
                                <q-btn-group flat>
                                    <q-btn v-for="option in booleanOptions" size="sm" color="primary" dense
                                        @click="addChild(option.value)">{{
                                            option.label }}</q-btn>
                                </q-btn-group>
                            </template>
                        </template>
                    </template>
                </div>
            </div>
        </template>
        <!-- show button for adding frame if BC is empty and is a leaf node -->
        <template v-if="!booleanConstruct.frame && booleanConstruct.children.length == 0">
            <div>
                <q-btn size="sm" color="#333333" dense flat icon="mdi-arrow-right" @click="addParent">
                    Bring one level down
                </q-btn>
                <div>
                    <q-btn class="button" round :color="isBeingEdited ? 'primary' : 'grey-6'" size="xs" icon="mdi-pencil"
                        @click="isBeingEdited = !isBeingEdited" />
                    <div v-if="isBeingEdited" class="button-label">
                        Select existing frame or select source and create new frame</div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>

import FrameChip from "./FrameChip.vue"
export default {
    name: "booleanConstructPanel",
    data: () => ({
        textSnippet: "",
        tags: [
            { label: "Agent", value: "agent" },
            { label: "Action", value: "action" },
            { label: "Object", value: "object" },
            { label: "Conditions", value: "conditions" }
        ],
        booleanOptions: [
            { label: 'AND', value: 'and' },
            { label: 'OR', value: 'or' }
        ],
        isBeingEdited: false
    }),
    props: {
        booleanConstruct: Object
    },
    mounted() {
        this.isBeingEdited = this.booleanConstruct == this.booleanConstructBeingEdited
    },
    computed: {
        frameBeingEdited() {
            return this.$store.state.frameBeingEdited
        },
        booleanConstructBeingEdited() {
            return this.$store.state.booleanConstructBeingEdited
        }
    },
    components: {
        FrameChip
    },
    methods: {
        createFact(tag) {
            let frame = new Fact()
            frame.annotation = new Annotation(
                null, //documentId
                null, //sentenceId
                [], //characterRange
                this.textSnippet //annotatedText
            )
            frame.annotation.tag = tag
            frame.fact = this.textSnippet
            this.$store.commit("addFrame", frame)
            this.booleanConstruct.frame = frame
            this.textSnippet = ""
        },
        addParent() {
            this.booleanConstruct.addParent()
        },
        addChild(operator) {
            this.booleanConstruct.operatorToJoinChildren = operator
            this.booleanConstruct.addEmptyChild()
        },
        toggleSelection() {

        },
        removeChipFromContext() {
            this.booleanConstruct.removeFrame(this.booleanConstruct.frame);
        }
    },
    watch: {
        isBeingEdited() {
            if (this.isBeingEdited) {
                this.$store.state.booleanConstructBeingEdited = this.booleanConstruct
                this.frameBeingEdited.activeField = null
            } else {
                this.$store.state.booleanConstructBeingEdited = null
            }
        }
    }
}
</script>

<style>
.bordered-panel {
    border-left: 2px solid #007bc6;
    padding-left: 14px;
}

.operator-label {
    color: #007bc6;
    text-transform: uppercase;
}

.button-label {
    display: inline-block;
    font-style: italic;
    margin-left: 5px;
}
</style>