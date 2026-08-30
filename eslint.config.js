import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "dist",
      "dist-web",
      "dist-ssr",
      "node_modules",
      "build",
      "android",
      "Release",
      ".git",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    // Parse <script lang="ts"> blocks inside .vue files with the TS parser.
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
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
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Blob: "readonly",
        URL: "readonly",
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        requestAnimationFrame: "readonly",
        require: "readonly",
        __dirname: "readonly",
        customElements: "readonly",
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-unused-vars": "off",
      // Template layout is Prettier's job now. Turn off the vue/recommended
      // stylistic rules that fight it, or every formatted file reports noise.
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
      "vue/html-closing-bracket-spacing": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/html-indent": "off",
      "vue/first-attribute-linebreak": "off",
    },
  },
  {
    // Ported tool components are kept byte-identical to their source in the
    // tiesthatbindgaming.com repo. Don't let --fix reformat them to this
    // project's Vue style; only real problems should surface here.
    files: ["src/apps/*/tool.vue"],
    rules: {
      "vue/html-indent": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/html-closing-bracket-spacing": "off",
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
      "vue/attributes-order": "off",
      "vue/first-attribute-linebreak": "off",
      "vue/html-quotes": "off",
    },
  },
  {
    // Node / Electron / build config files are CommonJS or plain scripts.
    files: [
      "**/*.cjs",
      "public/**/*.js",
      "scripts/**/*.js",
      "*.config.js",
      "postcss.config.js",
      "tailwind.config.js",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
