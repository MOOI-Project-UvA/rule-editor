<template>
  <!--
        displays recursively the content fields ('sentences') in a document.
        Hides itself if showFrameSource is true and this sentence is not part of the source of the
        frame that is currently being edited
    -->
  <div v-for="(item, index) in textPiece" :key="index">
    <q-item v-ripple :id="item.id">
      <q-item-section side>
        <!--        <input-->
        <!--          type="checkbox"-->
        <!--          :id="t"-->
        <!--          :name=""-->
        <!--          v-model=""-->
        <!--        />-->
        <q-checkbox
          :name="item.id"
          :id="item.id"
          v-model="item.checked"
          @update:model-value="toggleBox"
        />
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
  },
  computed: {
    checkedChunks() {
      return this.textPiece.filter((item) => item.checked);
    },
  },
  methods: {
    toggleBox: function (val, evt) {
      console.log("toggling", val, this.checkedChunks);
    },
  },
};
</script>

<style lang="css" scoped>
.text-chunk {
  margin: 10px 0px;
  display: grid;
  grid-template-columns: 10px auto;
}

.relation-bar {
  width: 3px;
  margin-right: 2px;
  /* height: 100%; */
  display: inline-block;
  pointer-events: none;
}

.text-piece {
  display: inline-block;
}

.has-relation {
  background-color: #1976d2;
  cursor: pointer;
  pointer-events: all;
}
</style>
