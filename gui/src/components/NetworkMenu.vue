<template>
    <!-- button for adding all nodes to network -->

    <!-- filter -->

    <div class="inline-block">Show frames of type:</div>
    <div class="inline-block q-ml-md" v-for="frameType in Object.values(filter)">
        <label class="text-weight-bold text-subtitle1"><input type="checkbox" v-model="frameType.selected"
                @change="updateFilter">
            {{ frameType.label }}
        </label>
        <template v-if="'subTypes' in frameType">
            <div class="inline-block q-ml-sm" v-for="subType in frameType.subTypes">
                <label><input type="checkbox" v-model="subType.selected" @change="updateFilter"
                        :disabled="!frameType.selected">
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
            // this.filter['anonymous'] = {
            //     class: 'anonymous',
            //     label: 'Other',
            //     selected: true
            // }
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
