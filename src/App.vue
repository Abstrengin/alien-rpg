<template>
  <div :class="isElectronApp ? 'min-h-screen' : ''">
    <!-- Tab Navigation -->
    <div
      class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40"
    >
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center gap-1">
          <!-- App Logo/Title -->
          <div class="pr-4 py-4 border-r border-gray-200 dark:border-gray-700">
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">
              TTBG Tools
            </h1>
          </div>

          <!-- Tab Buttons -->
          <div class="flex gap-2 flex-1">
            <button
              v-for="app in apps"
              :key="app.id"
              :class="[
                'px-4 py-4 font-semibold transition-all duration-200 border-b-2 whitespace-nowrap',
                activeApp === app.id
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300',
              ]"
              @click="setActiveApp(app.id)"
            >
              {{ app.name }}
            </button>
          </div>

          <!-- Right Actions -->
          <div class="pl-4 border-l border-gray-200 dark:border-gray-700 py-4">
            <button
              class="px-4 py-2 text-sm bg-gray-400 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded transition-colors"
              @click="toggleDarkMode"
            >
              {{ isDarkMode ? "🌙" : "☀️" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- App Content -->
    <div class="min-h-[calc(100vh-80px)]">
      <!-- Alien RPG Generator App -->
      <div v-if="activeApp === 'alien-rpg'" class="w-full">
        <AlienRpgApp />
      </div>

      <!-- Space Travel Tool App -->
      <div v-if="activeApp === 'space-travel'" class="w-full">
        <SpaceTravelApp />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AlienRpgApp from "./apps/alien-rpg/App.vue";
import SpaceTravelApp from "./apps/space-travel-tool/App.vue";
import "./style.css";

const activeApp = ref("alien-rpg");
const isDarkMode = ref(true);
const isElectronApp = ref(false);

const apps = [
  { id: "alien-rpg", name: "Star System Generator" },
  { id: "space-travel", name: "Space Travel Tool" },
];

const setActiveApp = (appId) => {
  activeApp.value = appId;
};

onMounted(() => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem("theme-preference");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    isDarkMode.value = true;
  } else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
    isDarkMode.value = false;
  } else {
    // Default to dark mode
    document.documentElement.classList.add("dark");
    isDarkMode.value = true;
    localStorage.setItem("theme-preference", "dark");
  }

  // Apply initial background
  applyElectronBackground();

  // Detect Electron
  const hasElectronAPI =
    typeof window !== "undefined" && window.electron?.isElectron === true;
  const hasElectronProcess =
    typeof process !== "undefined" && process.versions?.electron;

  isElectronApp.value = hasElectronAPI || hasElectronProcess;

  if (isElectronApp.value) {
    document.documentElement.setAttribute("data-electron", "true");
    applyElectronBackground();

    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeQuery.addEventListener("change", applyElectronBackground);
  }
});

const toggleDarkMode = () => {
  const html = document.documentElement;
  isDarkMode.value = !isDarkMode.value;

  if (isDarkMode.value) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  const backgroundColor = isDarkMode.value ? "#030712" : "#ffffff";
  document.documentElement.style.backgroundColor = backgroundColor;
  document.body.style.backgroundColor = backgroundColor;

  localStorage.setItem("theme-preference", isDarkMode.value ? "dark" : "light");
};

const applyElectronBackground = () => {
  const isDark =
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const backgroundColor = isDark ? "#030712" : "#ffffff";
  document.documentElement.style.backgroundColor = backgroundColor;
  document.body.style.backgroundColor = backgroundColor;
};
</script>
