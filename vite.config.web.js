import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Standalone single-page-app build for browser hosting (itch.io HTML5 channel).
 *
 * Unlike vite.config.js (library / custom-element mode for the WordPress embed
 * and Electron), this produces a normal SPA from index.html into dist-web/.
 * base: "./" keeps asset URLs relative so the build works from the sub-path
 * itch.io serves it under.
 */
export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-web",
    emptyOutDir: true,
  },
  define: {
    "process.env": {},
  },
});
