<template>
    <div>
        <template v-if="level < snippet.annotations.length">
            <div class="underlined">
                <SnippetContainer :snippet="snippet" :level="level + 1" />
            </div>
        </template>
        <template v-else>
            <div :id="snippet.id">{{ snippet.text }}</div>
        </template>
    </div>
</template>

<script>
export default {
    name: "snippet_container",
    props: {
        snippet: Object,
        level: Number
    }
}
</script>
<style>
.underlined {
    border-bottom: 2px solid #007bc6;
    margin-bottom: 1px;
}
</style>