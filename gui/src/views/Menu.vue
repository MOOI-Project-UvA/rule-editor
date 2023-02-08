<template>
    <div class="q-pa-md q-gutter-sm">
        <q-btn color="primary" icon="mdi-content-save" label="Save interpretation" @click="saveInterpretationClicked" />
        <q-btn color="primary" @click="chooseFile()" icon="mdi-file-upload-outline" label="Load interpretation" />
        <input id="fileUpload" type="file" @change="handleFileSelection" hidden ref="fileUpload" />
    </div>
</template>

<script>
export default {
    methods: {
        saveInterpretationClicked() {
            this.$store.dispatch("saveInterpretation")
        },
        chooseFile() {
            //document.getElementById("fileUpload").click()
            this.$refs.fileUpload.click()
        },
        handleFileSelection(evt) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                this.$store.dispatch("loadInterpretation", evt.target.result)
            };
            reader.readAsText(evt.target.files[0]);
        }
    }
}

</script>

<style lang="css" scoped>

</style>