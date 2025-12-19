<template>
  <transition name="slide-down">
    <div
      v-if="isElectron && updateAvailable"
      class="fixed top-0 left-0 right-0 bg-blue-600 dark:bg-blue-700 text-white shadow-lg z-50"
    >
      <div
        class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4"
      >
        <div class="flex-1">
          <p class="font-semibold mb-1">Update Available</p>
          <p class="text-sm text-blue-100">
            A new version is ready to install.
            <span v-if="updateProgress > 0 && updateProgress < 100">
              Downloading: {{ updateProgress }}%
            </span>
          </p>
          <div
            v-if="updateProgress > 0 && updateProgress < 100"
            class="mt-2 w-full bg-blue-500 rounded h-2 overflow-hidden"
          >
            <div
              class="bg-white h-full transition-all duration-300"
              :style="{ width: updateProgress + '%' }"
            />
          </div>
        </div>
        <button
          v-if="updateProgress === 0 || updateProgress === 100"
          class="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded font-semibold transition-colors duration-200 whitespace-nowrap"
          @click="installUpdate"
        >
          {{ updateProgress === 100 ? "Install & Restart" : "Download" }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useUpdater } from "@/shared/composables/useUpdater";

const { isElectron, updateAvailable, updateProgress, installUpdate } =
  useUpdater();
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
}

.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
