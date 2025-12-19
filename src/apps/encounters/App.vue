<template>
  <div :class="isElectronApp ? 'min-h-screen' : ''">
    <div class="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-8">
      <!-- Sidebar -->
      <aside class="w-full lg:w-64 lg:flex-shrink-0">
        <div class="sticky top-24 space-y-4">
          <!-- Info Card -->
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
                <strong>Alien RPG Encounter Generator</strong> helps you quickly
                create encounters for your
                <a
                  href="https://www.tiesthatbindgaming.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Alien RPG
                </a>
                campaigns.
              </p>
              <p class="mb-3">
                Generate space encounters, planetary encounters, and colony
                encounters. Each type has unique tables for creating adventure,
                danger, and horror in the far reaches of space.
              </p>
              <p class="mb-3">
                <strong>Version:</strong> 1.0.0
              </p>
              <p class="mb-0">
                Rules source: Alien RPG Core Rulebook, Chapter 12: Campaign Play
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
              @click="resetGenerator"
            >
              RESET
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main
        class="flex-1 w-full text-gray-900 dark:text-gray-100 transition-colors duration-200"
      >
        <EncounterGenerator :key="resetKey" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import EncounterGenerator from "./components/EncounterGenerator.vue";
import Modal from "@/shared/components/Modal.vue";
import "./style.css";

const isElectronApp = ref(false);
const showAppInfo = ref(false);
const resetKey = ref(0);

onMounted(() => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem("theme-preference");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // Default to dark mode
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme-preference", "dark");
  }

  // Try multiple ways to detect Electron
  const hasElectronAPI =
    typeof window !== "undefined" && window.electron?.isElectron === true;
  const hasElectronProcess =
    typeof process !== "undefined" && process.versions?.electron;

  isElectronApp.value = hasElectronAPI || hasElectronProcess;

  // Apply system theme-aware background for Electron
  if (isElectronApp.value) {
    document.documentElement.setAttribute("data-electron", "true");
    applyElectronBackground();

    // Listen for system theme changes
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeQuery.addEventListener("change", applyElectronBackground);
  }
});

function applyElectronBackground() {
  const isDark =
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const backgroundColor = isDark ? "#030712" : "#ffffff";
  document.documentElement.style.backgroundColor = backgroundColor;
  document.body.style.backgroundColor = backgroundColor;
}

const resetGenerator = () => {
  resetKey.value++;
};
</script>
