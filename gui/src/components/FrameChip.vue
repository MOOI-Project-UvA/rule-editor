<template>
  <q-chip :color="colors[frame.type]" text-color="white" icon="mdi-file-document-edit-outline">
    {{ frameName }}
  </q-chip>
</template>

<script>
export default {
  data: () => ({
    colors: {
      'act': 'primary',
      'fact': 'secondary',
      'duty': 'purple'
    }
  }),
  props: {
    frame: Object
  },
  computed: {
    frameName() {
      switch(this.frame.type) {
        case 'act':
          return this.frame.act
          break
        case 'fact':
          return this.frame.fact
          break
        case 'duty':
          return this.frame.duty
          break
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
