import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue({
      customElement: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: "src/main.js",
      formats: ["iife"],
      name: "AlienRPGTools",
      fileName: () => "alien-rpg-tools.js",
    },
  },
  define: {
    "process.env": process.env,
  },
});
