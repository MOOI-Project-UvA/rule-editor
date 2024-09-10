<template>
    <!-- button for adding all nodes to network -->

    <!-- filter -->
    <div v-for="frameType in Object.values(filter)">
        <label><input type="checkbox" v-model="frameType.selected" @change="updateFilter">
            {{ frameType.label }}
        </label>
        <template v-if="'subTypes' in frameType">
            <div v-for="subType in frameType.subTypes">
                <label><input type="checkbox" v-model="subType.selected" @change="updateFilter">
                    {{ subType.label }}
                </label>
            </div>
        </template>
    </div>
</template>

<script>
import { frameTypes } from "../model/frame.js"
export default {
    data: () => ({
        filter: {}
    }),
    mounted() {
        //if frameFilter is empty, initialize it with all types and subtypes selected
        if (Object.keys(this.frameFilter).length == 0) {
            //filter is empty. Initialize.
            this.filter = { ...frameTypes }
            Object.values(this.filter).forEach(frameType => {
                frameType.selected = true
                if ("subTypes" in frameType) {
                    Object.values(frameType.subTypes).forEach(subType => {
                        subType.selected = true
                    })
                }
            })
        } else {
            //copy current filter to local filter
            this.filter = this.frameFilter
        }
    },
    computed: {
        frameFilter() {
            return this.$store.state.frameFilter
        }
    },
    methods: {
        updateFilter() {
            this.$store.state.frameFilter = { ...this.filter }
        }
    }
}
</script>
