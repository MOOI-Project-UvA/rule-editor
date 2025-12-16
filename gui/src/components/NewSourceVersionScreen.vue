<template>
    <q-card flat bordered class="my-card q-ma-sm q-pa-sm full-width full-height column no-wrap">
        <div class="row">
            <div class="col"></div>
            <q-btn icon="mdi-close" flat round dense @click="$emit('close')" />
        </div>
        <div class="scrollable">
            <div v-for="sentence in oldSource.sentences" class="row">
                <div class="col">
                    <span v-for="snippet in sentence.snippets">
                        {{ snippet.text }}
                    </span>
                </div>
                <div class="col">
                    <span v-for="snippet in sentence.snippets">
                        {{ snippet.text }}
                    </span>
                </div>
            </div>
        </div>
    </q-card>
</template>

<script>
    export default {
        data: () => ({
            mappingFromOldToNew : {}
        }),
        props: {
            oldSource: Object,
            newSource: Object
        },
        mounted() {
            this.initializeMapping()
        },
        methods: {
            processChanges() {
                //apply all changes to the new source
            },
            initializeMapping() {
                this.mappingFromOldToNew = {}
                let indexNewSentence
                this.oldSource.sentences.forEach(oldSentence => {
                    //find corresponding sentence in newSource
                    let newSentence = this.newSource.sentences[indexNewSentence]
                    if (newSentence.id != oldSentence.id && newSentence.isRevisionOf != oldSentence.id) {
                        operation = "DELETED"
                        newSentence = null
                    } else {
                        if (newSentence.isRevisionOf == oldSentence.id) {
                            operation = "EDITED"
                        } else {
                            operation = "COPIED"
                        }
                        indexNewSentence ++
                    }
                    this.mappingFromOldToNew[oldSentence.id] = {
                        newSentence: newSentence,
                        operation: operation
                    }
                })
            }
        }
    }
</script>