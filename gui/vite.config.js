import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

const eflintApiBaseUrl = process.env.VITE_EFLINT_API_BASE_URL || "http://localhost:8000";
const authApiBaseUrl = process.env.VITE_AUTH_API_BASE_URL || "http://localhost:8101";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar(),
  ],
  server: {
    proxy: {
      "/api/predict": {
        target: "https://nlp-api-normativesystems.tnodatalab.nl",
        secure: false,
        changeOrigin: true,
      },
      "/api/wrapUp": {
        target: "https://wrap-up-api-normativesystems.tnodatalab.nl",
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wrapUp/, ""),
      },
      "/api/unwrap": {
        target: "https://unwrap-api-normativesystems.tnodatalab.nl",
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/unwrap/, ""),
      },
      "/api/serverless/getSources": {
        target: "/.netlify/functions/getAvailableSourcesFromTriply",
        secure: false,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/.netlify\/functions/, ""),
      },
      "/api/serverless/getSource": {
        target: "/.netlify/functions/getSourceFromTriply",
        secure: false,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/.netlify\/functions/, ""),
      },
      "/api/serverless/getAvailableTasks": {
        target: "/.netlify/functions/getAvailableTasksFromTriply",
        secure: false,
        changeOrigin: true,
      },
      "/api/serverless/getTask": {
        target: "/.netlify/functions/getTaskFromTriply",
        secure: false,
        changeOrigin: true,
      },
      "/api/serverless/saveTaskAtTriply": {
        target: "/.netlify/functions/saveTask",
        secure: false,
        changeOrigin: true,
      },
      "/api/serverless/saveTaskAtMongo": {
        target: "/.netlify/functions/saveTaskToMongo",
        secure: false,
        changeOrigin: true,
      },
      "/auth": {
        target: authApiBaseUrl,
        secure: false,
        changeOrigin: true,
      },
      "/generate-eflint": {
        target: eflintApiBaseUrl,
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
