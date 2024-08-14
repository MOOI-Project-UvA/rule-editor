<template>
  <!--
        displays the content fields ('sentences') in a document.
        Allows the end-user to include a sentence into an interpretation by checking
        the corresponding checkbox.
    -->
  <div>
    <div v-for="sentence in sourceDocument.sentences">
      <q-checkbox v-model="sentence.checked" size="xs">
        <slot>
          <div :style="`margin-left:${sentence.level * 5}px`"> {{ sentence.text }}</div>
        </slot>
      </q-checkbox>

    </div>

  </div>
</template>

<script>
export default {
  props: {
    sourceDocument: Object
  }
}
</script>
