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
        <!-- show text input field if BC is empty -->
        <template v-if="!booleanConstruct.frame && booleanConstruct.children.length == 0">
            <div>
                <q-btn size="sm" color="#333333" dense flat icon="mdi-arrow-right" @click="addParent" />
                <q-input dense v-model="textSnippet" label="Enter source text or select existing frame" autogrow
                    @focus="onFocus()" @blur="onBlur()" ref="textInputField">
                    <template v-slot:after>
                        <q-btn-group flat>
                            <q-btn v-for="tag in tags" size="sm" :color="colors[tag.value]" dense :icon="icons[tag.value]"
                                @click="createFact(tag.value)" :disabled="textSnippet.length == 0">
                                <q-tooltip class="text-subtitle2">
                                    Create frame of type {{ tag.label }}
                                </q-tooltip>
                            </q-btn>
                        </q-btn-group>
                    </template></q-input>
            </div>
        </template>
    </div>
</template>

<script>
import { colors, icons } from "../helpers/config.js"
import { Fact } from "../helpers/flint.js"
import { Annotation } from "../model/annotation.js"
import FrameChip from "./FrameChip.vue"
export default {
    name: "booleanConstructPanel",
    data: () => ({
        textSnippet: "",
        tags: [
            { label: "Agent", value: "agent" },
            { label: "Action", value: "action" },
            { label: "Object", value: "object" },
            { label: "Context", value: "context" }
        ],
        booleanOptions: [
            { label: 'AND', value: 'and' },
            { label: 'OR', value: 'or' }
        ],
        colors: colors,
        icons: icons
    }),
    props: {
        booleanConstruct: Object,
        frame: Object
    },
    mounted() {
        //set focus to text field so you can start typing (or select a frame) immediately
        if ('textInputField' in this.$refs) {
            this.$refs.textInputField.focus();
        }
    },
    computed: {
        frameBeingEdited() {
            return this.$store.state.frameBeingEdited
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
        onFocus() {
            this.frameBeingEdited.booleanConstructBeingEdited = this.booleanConstruct
        },
        onBlur() {
            //this.frameBeingEdited.booleanContructBeingEdited = null
        },
        removeChipFromContext() {
            this.booleanConstruct.removeFrame(this.booleanConstruct.frame);
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
</style>