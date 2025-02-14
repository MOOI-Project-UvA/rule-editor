import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

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
        target:
          "http://localhost:9999/.netlify/functions/getAvailableSourcesFromTriply",
        secure: false,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/.netlify\/functions/, ""),
      },
      "/api/serverless/getSource": {
        target: "http://localhost:9999/.netlify/functions/getSourceFromTriply",
        secure: false,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/.netlify\/functions/, ""),
      },
      "/api/serverless/getAvailableTasks": {
        target:
          "http://localhost:9999/.netlify/functions/getAvailableTasksFromTriply",
        secure: false,
        changeOrigin: true,
      },
      "/api/serverless/getTask": {
        target: "http://localhost:9999/.netlify/functions/getTaskFromTriply",
        secure: false,
        changeOrigin: true,
      },
      "/api/serverless/saveTaskAtTriply": {
        target: "http://localhost:9999/.netlify/functions/saveTask",
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
