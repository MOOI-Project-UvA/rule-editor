<template>
    <q-card flat bordered class="my-card q-ma-sm q-pa-sm full-width full-height column no-wrap">
        <div class="row">
            <div class="col"></div>
            <q-btn icon="mdi-close" flat round dense @click="applyAndClose" />
        </div>
        <div class="scrollable" v-if="mappingFromOldToNew">
            <div v-for="oldSentence in oldSource.sentences" class="row">
                <div class="col">
                    <span v-for="snippet in oldSentence.snippets">
                        {{ snippet.text }}
                    </span>
                </div>
                
                <div class="col-1 q-pa-xs">
                    <q-btn size="xs" round v-for="operation in operations"
            :color="mappingFromOldToNew[oldSentence.id].operation == operation.id ? operation.color : 'grey-5'" :icon="operation.icon"
            @click="mappingFromOldToNew[oldSentence.id].operation = operation.id" />
                </div>
                <div class="col">
                    <template v-if="mappingFromOldToNew[oldSentence.id].operation == 'COPIED'">
                        <span v-for="snippet in mappingFromOldToNew[oldSentence.id].newSentence.snippets">
                            {{ snippet.text }}
                        </span>
                    </template>
                    <template v-if="mappingFromOldToNew[oldSentence.id].operation == 'CHANGED'">
                        <textarea class="full-width" :ref="oldSentence.id">{{ mappingFromOldToNew[oldSentence.id].newSentence.snippets
                                .map(s => s.text).join("").trim() }}</textarea>
                    </template>
                </div>
            </div>
        </div>
    </q-card>
</template>

<script>
    export default {
        data: () => ({
            mappingFromOldToNew : null,
            operations: [
                {
                    id: "COPIED",
                    icon: "mdi-content-copy",
                    color: "primary"
                },
                {
                    id: "DELETED",
                    icon: "mdi-close",
                    color: "negative"
                },
                {
                    id: "CHANGED",
                    icon: "mdi-pencil",
                    color: "secondary"
                },
            ]
        }),
        props: {
            oldSource: Object,
            newSource: Object
        },
        mounted() {
            this.initializeMapping()
        },
        methods: {
            initializeMapping() {
                const oldSentences = this.oldSource.sentences;
                const newSentences = this.newSource.sentences;

                const mapping = Object.create(null);
                let indexNewSentence = 0
                oldSentences.forEach(oldSentence => {
                    //find corresponding sentence in newSource
                    let newSentence = newSentences[indexNewSentence] ?? null;
                    
                    let operation
                    if (newSentence.id != oldSentence.id && newSentence.isRevisionOf != oldSentence.id) {
                        operation = "DELETED"
                        newSentence = null
                    } else {
                        operation = (newSentence.isRevisionOf === oldSentence.id) ? "CHANGED" : "COPIED";
                        indexNewSentence ++
                    }
                    mapping[oldSentence.id] = {
                        newSentence: newSentence,
                        operation: operation
                    }
                })
                this.mappingFromOldToNew = mapping
                console.log(this.mappingFromOldToNew)
            },
            applyAndClose() {
                this.applyChanges()
                this.$emit('close')
            },
            applyChanges() {
                const oldSentences = this.oldSource.sentences
                //apply all operations. for now: apply changes only
                console.log("this.$refs", this.$refs)
                oldSentences.map(s => s.id).forEach(id => {
                    if (this.mappingFromOldToNew[id].operation == "CHANGED") {
                        let newSentence = this.mappingFromOldToNew[id].newSentence
                        newSentence.isRevisionOf = id
                        newSentence.content = this.$refs[id][0].value
                    }
                })
            }
        },
    }
</script>