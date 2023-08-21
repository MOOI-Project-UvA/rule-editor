<template>
  <div class="q-pa-md" style="max-width: 500px">
    <!-- <q-form @submit.prevent="onSubmit" class="q-gutter-md"> -->
    <q-file outlined bottom-slots v-model="file" label="Add source document" counter max-files="1" style="width: 350px"
      accept="application/JSON" name="file_uploader">
      <template v-slot:before>
        <q-icon name="mdi-attachment" />
      </template>

      <template v-slot:hint>Upload a decomposed source (.json).</template>
      <template v-slot:append>
        <q-icon v-if="file !== null" name="mdi-close" @click.stop.prevent="file = null" class="cursor-pointer" />
        <q-icon name="mdi-search" @click.stop.prevent />
      </template>

      <template v-slot:after>
        <q-btn label="Add" type="submit" color="primary" :disable="file == null" :loading="loading"
          @click.enter.prevent="onSubmit" />
      </template>
    </q-file>
    <!-- <div>
      <q-btn
        label="Submit"
        type="submit"
        color="primary"
        :disable="file == null"
      />
    </div> -->
    <!-- </q-form> -->
  </div>
</template>

<script>
export default {
  name: "UploadDecomposedSource",
  data: () => ({
    file: null,
    loading: false,
  }),
  methods: {
    counterLabelFn: function ({ totalSize, filesNumber, maxFiles }) {
      return `${filesNumber} files of ${maxFiles} | ${totalSize}`;
    },
    readJsonFile: function (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(JSON.parse(event.target.result));
        };
        reader.onerror = (event) => {
          reject(error);
        };
        reader.readAsText(file);
      });
    },
    onSubmit: async function (evt) {

      if (this.file) {

        //this.loading = true
        const that = this;
        // the actual content of the file in JSON
        const fileContent = await this.readJsonFile(this.file);
        const document = fileContent['@graph'].find(d => 'document' in d).document
        this.$store.commit("addSourceDocument", document)
        this.file = null // clear input field
        // setTimeout(() => {

        //   // keeping the properties, we are interested in ...
        //   const data = fileContent["@graph"].filter((d) =>
        //     Boolean(d.document)
        //   )[0];
        //   // retrieving the filename of the loaded decomposed source.
        //   data.filename = that.file.name.split('.')[0]
        //   this.$store.dispatch("reconstructTextAction", data)
        //     .then((res) => {
        //       that.loading = res;
        //     })
        // }, 500)

      }

    },

  },
};
</script>

<style></style>
