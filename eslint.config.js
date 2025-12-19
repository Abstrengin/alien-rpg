import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    ignores: [
      "dist",
      "node_modules",
      "build",
      ".git",
      "src/apps/space-travel-tool/dist",
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,jsx,cjs,ts,mts,tsx,vue}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: "readonly",
        process: "readonly",
        navigator: "readonly",
        setTimeout: "readonly",
        Blob: "readonly",
        URL: "readonly",
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        require: "readonly",
        __dirname: "readonly",
        customElements: "readonly",
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
];
