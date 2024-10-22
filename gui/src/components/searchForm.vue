<template>
  <div class="q-pa-md" style="max-width: 500px">
    <q-form
      @submit="onSubmit"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
    >
      <q-input
        filled
        v-model="sourceTitle"
        label="Search for a legal source"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'This field is required']"
        clearable
        hint="For the time being an example text is: BWBR0005730"
      >
        <template v-slot:prepend>
          <q-icon name="mdi-book-search-outline" />
        </template>
        <template v-slot:after>
          <q-btn
            label="Submit"
            type="submit"
            color="primary"
            :disable="sourceTitle == null"
            @click.enter.prevent="onSubmit"
          />
        </template>
      </q-input>
    </q-form>
  </div>
</template>

<script>
export default {
  name: "searchForm",
  data: () => ({
    sourceTitle: "BWBR0005730",
  }),
  methods: {
    onSubmit: function (event) {
      console.log("event", event);
      this.$emit("showText");
    },
  },
};
</script>

<style></style>
