<template>
  <footer
    class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
  >
    <div
      class="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-gray-500 dark:text-gray-400"
    >
      <p class="text-center sm:text-left">
        © 2026 Ties That Bind Gaming™ · Fan-made tool for Alien RPG
      </p>
      <p class="flex flex-wrap items-center justify-center gap-x-2 gap-y-0">
        <a
          href="https://www.tiesthatbindgaming.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          TTBG
        </a>
        <span aria-hidden="true">·</span>
        <a
          href="https://diegeticsimulators.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Diegetic Simulators
        </a>
        <span aria-hidden="true">·</span>
        <a
          href="https://github.com/Abstrengin/alien-rpg"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          GitHub
        </a>
        <span aria-hidden="true">·</span>
        <span>v{{ APP_VERSION }} · MIT</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
import { APP_VERSION } from "@/shared/version.js";
</script>
