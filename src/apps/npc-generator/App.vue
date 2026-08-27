<template>
  <div :class="isElectronApp ? 'min-h-screen' : ''">
    <div class="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-8">
      <aside class="w-full lg:w-64 lg:flex-shrink-0">
        <div class="sticky top-24 space-y-4">
          <div
            class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700"
          >
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold"
              @click="showAppInfo = true"
            >
              APP INFO
            </button>
            <Modal
              v-model:model-value="showAppInfo"
              title="ABOUT THIS TOOL"
            >
              <p class="mb-3">
                <strong>NPC Generator</strong> generates a quick NPC: career, motivation, appearance, personality, and an optional hidden agenda and crew relationship.
              </p>
              <p class="mb-3">
                Part of the Alien RPG Tools suite by
                <a
                  href="https://www.tiesthatbindgaming.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Ties That Bind Gaming
                </a>.
              </p>
              <p class="mb-3">
                Compatible with both the original <strong>Alien RPG</strong> and the
                <strong>Evolved Edition</strong>.
              </p>
              <p class="mb-0">
                <strong>Version:</strong> {{ APP_VERSION }}
              </p>
              <template #footer>
                <button
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  @click="showAppInfo = false"
                >
                  Close
                </button>
              </template>
            </Modal>

            <button
              class="w-full mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
              @click="reset"
            >
              RESET
            </button>
          </div>
        </div>
      </aside>

      <main
        class="flex-1 w-full text-gray-900 dark:text-gray-100 transition-colors duration-200"
      >
        <Tool :key="resetKey" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Tool from "./tool.vue";
import Modal from "@/shared/components/Modal.vue";
import { isElectron } from "@/shared/theme.js";
import { APP_VERSION } from "@/shared/version.js";

const isElectronApp = ref(false);
const showAppInfo = ref(false);
const resetKey = ref(0);

onMounted(() => {
  isElectronApp.value = isElectron();
  if (isElectronApp.value) {
    document.documentElement.setAttribute("data-electron", "true");
  }
});

const reset = () => {
  resetKey.value++;
};
</script>
