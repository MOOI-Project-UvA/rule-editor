<template>
  <!--
        displays recursively the content fields ('sentences') in a document.
        Allows the end-user to include a sentence into an interpretation by checking
        the corresponding checkbox.
    -->
  <div v-for="(item, index) in textPiece" :key="index">
    <q-item tag="label" v-ripple :id="item.id">
      <q-item-section side top>
        <q-checkbox :name="item.id" :id="item.id" v-model="item.checked" />
      </q-item-section>

      <q-item-section
        class="text-piece text-chunk"
        v-html="item.content"
        ref="sentenceElement"
      >
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  props: {
    textPiece: Array,
    docId: Number,
  },
  computed: {
    // checkedChunks() {
    //   return this.textPiece.filter((item) => item.checked);
    // },
  },
  methods: {
    // toggleBox: function (val, evt) {
    //   console.log("toggling", val, this.checkedChunks);
    //   console.log(
    //     "toggling2: ",
    //     this.textPiece.some((d) => d.checked),
    //   );
    //   // this.$emit("anyCheckedSentences", {
    //   //   id: this.docId,
    //   //   checkedSentences: this.textPiece.some((d) => d.checked),
    //   // });
    // },
  },
};
</script>

<style lang="css" scoped>
.text-chunk {
  margin: 5px 0px;
  display: grid;
  grid-template-columns: 5px auto;
}

.text-piece {
  display: inline-block;
}
</style>
