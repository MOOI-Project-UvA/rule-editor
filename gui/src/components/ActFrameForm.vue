<template>
  <q-card flat bordered class="my-card">
      <q-card-section>
        <div class="text-h6">
            <q-input outlined v-model="text" label="Titel" />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </q-card-section>
    </q-card>
</template>

<script>
export default {
  data: () => ({
    text: ""
  })
}
</script>

<style lang="css" scoped>
</style>
