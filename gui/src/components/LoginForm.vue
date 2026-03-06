<template>
  <div class="fit row items-center justify-center q-pa-md">
    <q-card flat bordered style="width: 100%; max-width: 420px;">
      <q-card-section>
        <div class="text-h6">Sign in</div>
        <div class="text-caption text-grey-7">Use your username and password to access the editor.</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-md">
        <q-input
          v-model="username"
          label="Username"
          outlined
          dense
          autocomplete="username"
          @keyup.enter="submit"
        />
        <q-input
          v-model="password"
          label="Password"
          type="password"
          outlined
          dense
          autocomplete="current-password"
          @keyup.enter="submit"
        />
        <q-banner v-if="errorMessage" dense rounded class="bg-red-1 text-negative">
          {{ errorMessage }}
        </q-banner>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Login" :loading="loading" @click="submit" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },
  emits: ["login"],
  data: () => ({
    username: "",
    password: "",
  }),
  methods: {
    submit() {
      this.$emit("login", {
        username: this.username,
        password: this.password,
      });
    },
  },
};
</script>