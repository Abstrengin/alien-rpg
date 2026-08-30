<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700"
  >
    <label
      for="app-edition"
      class="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"
    >
      Edition
    </label>
    <select
      id="app-edition"
      v-model="edition"
      class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
    >
      <option v-for="(label, value) in EDITION_LABELS" :key="value" :value="value">
        {{ label }}
      </option>
    </select>
    <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Applies to every tool in the suite.</p>
  </div>
</template>

<script setup>
import { useEdition, EDITION_LABELS } from "@/shared/edition";

const edition = useEdition();
</script>
