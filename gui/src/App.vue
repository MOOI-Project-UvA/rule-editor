<template>
  <!--
    Copyright 2023 Nederlandse Organisatie voor Toegepast Natuur-
    wetenschappelijk Onderzoek TNO / TNO, Netherlands Organisation for 
    applied scientific research

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  */
  -->

  <div class="column fit">
    <LoginForm
      v-if="authEnabled && !isAuthenticated"
      class="col"
      :loading="authLoading"
      :error-message="authError"
      @login="onLogin"
    />
    <template v-else>
      <div class="col-auto row justify-end q-pa-sm" v-if="authEnabled">
        <q-btn flat dense label="Logout" @click="onLogout" />
      </div>
      <div class="col-auto">
        <NavigationBar v-model:activeView="activeView"/>
      </div>
      <div class="col q-px-sm scroll">
        <component v-if="activeView" :is="activeView.component" />
      </div>
      <div>
        <TaskRetrieval />
      </div>
    </template>
  </div>

</template>

<script>
import { alertWidget } from "./helpers/alertWidget.js";
import { retrieveDeploymentInformation } from "./helpers/utilities.js";
import TaskRetrieval from "./components/TaskRetrieval.vue";
import NavigationBar from "./components/NavigationBar.vue";
import LoginForm from "./components/LoginForm.vue";
import {
  getCurrentUser,
  isAuthEnabled,
  login,
  logout,
} from "./services/AuthService.js";

export default {
  name: "app",
  data: () => ({
    hash: import.meta.env.VITE_VERSION,
    repo: import.meta.env.VITE_REPOSITORY_URL,
    branch: import.meta.env.VITE_BRANCH,
    activeView: null,
    authEnabled: isAuthEnabled(),
    isAuthenticated: false,
    authLoading: false,
    authError: "",
    appInitialized: false,
  }),
  components: {
    NavigationBar,
    TaskRetrieval,
    LoginForm,
  },

  async mounted() {
    if (!this.authEnabled) {
      this.isAuthenticated = true;
      this.initializeAppAfterAuth();
      return;
    }

    this.authLoading = true;
    try {
      await getCurrentUser();
      this.isAuthenticated = true;
      this.authError = "";
      this.initializeAppAfterAuth();
    } catch {
      this.isAuthenticated = false;
    } finally {
      this.authLoading = false;
    }
  },

  methods: {
    async onLogin({ username, password }) {
      this.authError = "";
      this.authLoading = true;
      try {
        await login(username, password);
        this.isAuthenticated = true;
        this.initializeAppAfterAuth();
      } catch {
        this.authError = "Invalid username or password";
      } finally {
        this.authLoading = false;
      }
    },
    async onLogout() {
      this.authLoading = true;
      try {
        await logout();
      } finally {
        this.isAuthenticated = false;
        this.authLoading = false;
      }
    },
    initializeAppAfterAuth() {
      if (this.appInitialized) return;

      if (this.repo != null) {
        const message = retrieveDeploymentInformation(
          this.repo,
          this.branch,
          this.hash,
        );
        alertWidget("welcome", message);
      }

      this.$store.dispatch("readAvailableSources");
      this.appInitialized = true;
    },
  },
};
</script>

<style>

</style>
