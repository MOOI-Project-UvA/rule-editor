<template>
    <!-- <div id="all" @mouseup="handleSelection">
        <div class="snippet" :class="{ color: i % 2 == 1 }" v-for="(snippet, i) in snippets" :id="i">{{ snippet.text }}
        </div>
    </div> -->
    <div @mouseup="handleSelection">
        <div class="sentence" v-for="sentence in sentences">
            <div class="snippet" v-for="snippet in sentence.snippets">
                <SnippetContainer :snippet="snippet" :level="0">
                </SnippetContainer>
            </div>
        </div>
    </div>
    <hr />
    <div>
        <div class="sentence" v-for="sentence in sentences">
            <div class="snippet-info" v-for="snippet in sentence.snippets">
                <div>{{ snippet.text }}</div>
                <div>{{ snippet.annotations.length }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import SnippetContainer from "./SnippetContainer.vue"
export default {
    data: () => ({
        //snippets: ["abcdefghijklmnopqrs"],
        sentences: [
            {
                id: 0,
                snippets: [
                    { id: 0, sentenceId: 0, text: "abcdefghijklmnopqrs", annotations: [] }
                ]
            },
            {
                id: 1,
                snippets: [
                    { id: 1, sentenceId: 1, text: "tuvwxyz", annotations: [] }
                ]
            },
            {
                id: 2,
                snippets: [
                    { id: 2, sentenceId: 2, text: "0123456789", annotations: [] }
                ]
            }
        ]
    }),
    components: {
        SnippetContainer
    },
    computed: {
        snippets() {
            return this.sentences.map(s => s.snippets).flat()
        }
    },
    methods: {
        handleSelection() {
            //https://www.reddit.com/r/javascript/comments/37i307/have_a_node_need_the_element_id_attribute/
            const selObj = window.getSelection()
            console.log(selObj)
            console.log(selObj.toString())
            if (selObj.toString().length > 0) {
                const annotation = {
                    id: new Date().getTime()
                    //snippets: []
                }

                const range = selObj.getRangeAt(0)
                console.log("range", range)
                console.log("range.startContainer", range.startContainer)
                //console.log(this.$refs['div2'])
                // const id = range.startContainer.getAttribute('id')
                // console.log("id", id)

                let startSencenceIndex
                let endSentenceIndex
                let startSnippet
                let endSnippet
                let startOffset //within snippet
                let endOffset

                //divs have the same id as the corresponding snippet

                //selection started in this snippet (anchorNode)
                const anchorSnippet = this.snippets.find(s => s.id == selObj.anchorNode.parentNode.id)
                //selection ended in this snippet (focusNode)
                const focusSnippet = this.snippets.find(s => s.id == selObj.focusNode.parentNode.id)

                const anchorSentenceIndex = this.sentences.findIndex(s => s.id == anchorSnippet.sentenceId)
                const focusSentenceIndex = this.sentences.findIndex(s => s.id == focusSnippet.sentenceId)

                if (anchorSentenceIndex > focusSentenceIndex) { //user selected from right to left
                    startSnippet = focusSnippet //first snippet in selection
                    endSnippet = anchorSnippet //last snippet in selection
                    startOffset = selObj.focusOffset
                    endOffset = selObj.anchorOffset
                } else if (anchorSentenceIndex == focusSentenceIndex) {
                    //anchor and focussnippet are in the same sentence. Check the order of the snippets
                    //using the index of both within the sentence
                    const anchorSnippetIndex = this.sentences[anchorSentenceIndex].snippets.findIndex(s => s.id == anchorSnippet.id)
                    const focusSnippetIndex = this.sentences[focusSentenceIndex].snippets.findIndex(s => s.id == focusSnippet.id)
                    if (anchorSnippetIndex > focusSnippetIndex) { //user selected from right to left
                        startSnippet = focusSnippet //first snippet in selection
                        endSnippet = anchorSnippet //last snippet in selection
                    } else if (anchorSnippetIndex == focusSnippetIndex) {
                        startSnippet = anchorSnippet //first snippet in selection
                        endSnippet = focusSnippet //last snippet in selection
                        if (selObj.anchorOffset > selObj.focusOffset) { //user selected from right to left
                            startOffset = selObj.focusOffset
                            endOffset = selObj.anchorOffset
                        } else { //user selected from left to right
                            startOffset = selObj.anchorOffset
                            endOffset = selObj.focusOffset
                        }
                    } else { //user selected from left to right
                        startSnippet = anchorSnippet //first snippet in selection
                        endSnippet = focusSnippet //last snippet in selection
                        startOffset = selObj.anchorOffset
                        endOffset = selObj.focusOffset
                    }
                } else { //anchorSentenceIndex < focusSentenceIndex, user selected from left to right
                    startSnippet = anchorSnippet //first snippet in selection
                    endSnippet = focusSnippet //last snippet in selection
                    startOffset = selObj.anchorOffset
                    endOffset = selObj.focusOffset
                }

                const selectedSnippets = this.splitAndReturnSelectedSnippets(
                    startSnippet,
                    startOffset,
                    endSnippet,
                    endOffset
                )
                //assign newly created annotation to these snippets
                selectedSnippets.forEach(s => s.annotations.push(annotation))
                //TODO: add snippets to annotation?
            }
        },
        splitAndReturnSelectedSnippets(startSnippet, startOffset, endSnippet, endOffset) {
            console.log("splitAndReturnSelectedSnippets", startSnippet, startOffset, endSnippet, endOffset)
            let newSnippets = []
            let selectionSnippets = [] //snippets that are covered by selection
            //only the 1 or 2 sentence(s) that contain the startSnippet and endSnippet are affected

            // //add un-split snippets left of start snippet to new snippets
            // for (let i = 0; i < startSnippetIndex; i++) {
            //     newSnippets.push({ ...this.snippets[i] })
            // }
            // const startSnippet = this.snippets[startSnippetIndex]
            // console.log("startSnippet", startSnippet)
            // const startSubSnippets = this.splitSnippet(startSnippet, startOffset)
            // console.log("startSubSnippets", startSubSnippets)
            // if (startSubSnippets[0].text.length > 0) {
            //     newSnippets.push(startSubSnippets[0])
            // }

            // const endSnippet = this.snippets[endSnippetIndex]
            // const endSubSnippets =
            //     //if start and end is same, then split the rightmost startSubSnippet
            //     endSnippetIndex == startSnippetIndex
            //         ? this.splitSnippet(
            //             startSubSnippets[1],
            //             endOffset - startOffset
            //         )
            //         : this.splitSnippet(endSnippet, endOffset)

            // if (endSnippetIndex != startSnippetIndex) {
            //     if (startSubSnippets[1].text.length > 0) {
            //         newSnippets.push(startSubSnippets[1])
            //         selectionSnippets.push(startSubSnippets[1])
            //     }

            //     //add un-split snippets between start and end snippet
            //     for (let i = startSnippetIndex + 1; i < endSnippetIndex; i++) {
            //         newSnippets.push({ ...this.snippets[i] })
            //         selectionSnippets.push({ ...this.snippets[i] })
            //     }
            // }

            // //TODO re-assign annotations
            // if (endSubSnippets[0].text.length > 0) {
            //     newSnippets.push(endSubSnippets[0])
            //     selectionSnippets.push(endSubSnippets[0])
            // }
            // if (endSubSnippets[1].text.length > 0) {
            //     newSnippets.push(endSubSnippets[1])
            // }
            // console.log("endSnippetIndex + 1", endSnippetIndex + 1, "this.snippets.length", this.snippets.length)
            // //add un-split snippets left of start snippet to new snippets
            // for (let i = endSnippetIndex + 1; i < this.snippets.length; i++) {
            //     newSnippets.push({ ...this.snippets[i] })
            // }
            // this.snippets = [...newSnippets]
            // console.log("newSnippets", newSnippets)
            // console.log("selectionSnippets", selectionSnippets)
            return selectionSnippets
        },
        splitSnippet(snippet, index) {
            const leftSnippet = {
                id: snippet.id + "_0",
                annotations: [...snippet.annotations],
                text: snippet.text.substring(0, index)
            }
            const rightSnippet = {
                id: snippet.id + "_1",
                annotations: [...snippet.annotations],
                text: snippet.text.substring(index)
            }
            return [leftSnippet, rightSnippet]
        }
    }
}
</script>

<style scoped>
.highlight {
    background-color: aqua;
}

.snippet {
    display: inline-block;
    font-size: 16pt;
}

.color {
    background-color: #dddddd;
}

.snippet-info {
    display: grid;
    grid-template-columns: 160px auto;
    gap: 5px;
}
</style>