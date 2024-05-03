<template>
    <div>
        <template v-if="level < annotationIdsInSentence.length">
            <div class="underlined snippet"
                :style="{ borderBottom: annotationAtThisLevelForSnippet ? '4px solid ' + annotationAtThisLevelForSnippet.color : '4px solid #ffffff' }"
                :data-snippet-id="snippet.id" :data-sentence-id="snippet.sentenceId">
                <SnippetContainer class="snippet" :snippet="snippet" :level="level + 1" :sentence="sentence"
                    :data-snippet-id="snippet.id" :data-sentence-id="snippet.sentenceId" />
            </div>
        </template>
        <template v-else>
            <div class="snippet-text" :data-snippet-id="snippet.id" :data-sentence-id="snippet.sentenceId">{{
            snippet.text }}
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: "snippet_container",
    props: {
        snippet: Object,
        level: Number,
        sentence: Object
    },
    computed: {
        annotationIdsInSentence() {
            return this.sentence.snippets.map(s => s.annotations)
                .flat()
                .map(a => a.id)
                .filter((value, index, array) => array.indexOf(value) === index);
        },
        annotationAtThisLevelForSnippet() {
            const annotationId = this.annotationIdsInSentence[this.level]
            return this.snippet.annotations.find(a => a.id == annotationId)
        }

    }
}
</script>
<style>
.underlined {
    /* border-bottom: 2px solid #007bc6; */
    margin-bottom: 2px;
}

.snippet {
    display: inline;
}

.snippet-text {
    display: inline;
    font-size: 16pt;
    /* margin-right: 5px; */
}
</style>