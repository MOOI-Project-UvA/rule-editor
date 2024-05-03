<template>
    <span class="snippet underline">{{ snippet.text }}</span>
</template>

<script>
export default {
    props: {
        snippet: Object,
        sentence: Object
    }
}
</script>

<style>
.snippet {
    display: inline;
}

.underline {
    padding-bottom: 30px;
    line-height: 18px;
    background: linear-gradient(180deg, #00ff00 2px, #ffffff 2px, #ffffff 4px, #ffff00 4px, #ffff00 6px, #ffffff 6px, #ffffff 8px, #ff00ff 8px);
    background-size: 100% 10px;
    background-repeat: no-repeat;
    background-position: 0px;
}
</style>