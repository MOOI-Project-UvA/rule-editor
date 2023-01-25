<template>
  <div class="q-pa-md" style="max-width: 500px">
    <!-- <q-form @submit.prevent="onSubmit" class="q-gutter-md"> -->
    <q-file
      outlined
      bottom-slots
      v-model="file"
      label="Upload a file"
      counter
      max-files="1"
      style="width: 350px"
      accept="application/JSON"
      name="file_uploader"
    >
      <template v-slot:before>
        <q-icon name="mdi-attachment" />
      </template>

      <template v-slot:hint>Upload a decomposed source (.json).</template>
      <template v-slot:append>
        <q-icon
          v-if="file !== null"
          name="mdi-close"
          @click.stop.prevent="file = null"
          class="cursor-pointer"
        />
        <q-icon name="mdi-search" @click.stop.prevent />
      </template>

      <template v-slot:after>
        <q-btn
          label="Submit"
          type="submit"
          color="primary"
          :disable="file == null"
          @click.enter.prevent="onSubmit"
        />
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
  }),
  methods: {
    counterLabelFn: function ({ totalSize, filesNumber, maxFiles }) {
      return `${filesNumber} files of ${maxFiles} | ${totalSize}`;
    },
    readJsonFile: async function (file) {
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
      console.log("file upload model: ", this.file);
      if (this.file) {
        // the actual content of the file in JSON
        const fileContent = await this.readJsonFile(this.file);
        // keeping the properties, we are interested in ...
        const data = fileContent["@graph"].filter((d) =>
          Boolean(d.document)
        )[0];
        console.log("result: ", data);
        this.$store.commit("setFileContent", data);
      }
      // case with actual form...
      // const formData = new FormData(evt.target);
      // console.log("file upload: ", formData.entries());
      // const data = [];

      // for (const [name, value] of formData.entries()) {
      //   console.log("file here 1");
      //   if (value.name.length > 0) {
      //     console.log("file here 2");
      //     data.push({
      //       name,
      //       value: value.name,
      //     });
      //   }
      // }
    },
  },
};
</script>

<style></style>
