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
    },
  },
});
