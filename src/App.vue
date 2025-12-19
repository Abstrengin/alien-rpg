<template>
  <div class="flex flex-col min-h-screen">
    <!-- Tab Navigation -->
    <div
      class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40"
    >
      <div class="max-w-7xl mx-auto px-2 sm:px-4">
        <div class="flex items-center justify-between gap-2 sm:gap-1">
          <!-- App Logo/Title -->
          <div
            class="py-3 sm:pr-4 sm:py-4 sm:border-r border-gray-200 dark:border-gray-700"
          >
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">
              Alien RPG Tools
            </h1>
          </div>

          <!-- Desktop Tab Buttons -->
          <div class="hidden sm:flex gap-2 flex-1">
            <button
              v-for="app in apps"
              :key="app.id"
              :class="[
                'px-4 py-4 font-semibold transition-all duration-200 border-b-2 whitespace-nowrap text-base',
                activeApp === app.id
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300',
              ]"
              @click="setActiveApp(app.id)"
            >
              {{ app.name }}
            </button>
          </div>

          <!-- Mobile Menu & Right Actions -->
          <div class="flex items-center gap-2">
            <!-- Hamburger Menu (Mobile Only) -->
            <button
              class="sm:hidden px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <!-- Dark Mode Toggle -->
            <button
              class="px-3 sm:px-4 py-2 text-sm bg-gray-400 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded transition-colors"
              @click="toggleDarkMode"
            >
              {{ isDarkMode ? "🌙" : "☀️" }}
            </button>
          </div>
        </div>

        <!-- Mobile Menu Dropdown -->
        <div
          v-if="isMobileMenuOpen"
          class="sm:hidden border-t border-gray-200 dark:border-gray-700"
        >
          <button
            v-for="app in apps"
            :key="app.id"
            :class="[
              'w-full text-left px-4 py-3 font-semibold transition-all duration-200 border-l-4',
              activeApp === app.id
                ? 'bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800',
            ]"
            @click="
              setActiveApp(app.id);
              isMobileMenuOpen = false;
            "
          >
            {{ app.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- App Content -->
    <div class="flex-1">
      <!-- Alien RPG Generator App -->
      <div
        v-if="activeApp === 'alien-rpg'"
        class="w-full"
      >
        <AlienRpgApp />
      </div>

      <!-- Space Travel Tool App -->
      <div
        v-if="activeApp === 'space-travel'"
        class="w-full"
      >
        <SpaceTravelApp />
      </div>

      <!-- Job Generator App -->
      <div
        v-if="activeApp === 'job-generator'"
        class="w-full"
      >
        <JobGeneratorApp />
      </div>

      <!-- Encounters App -->
      <div
        v-if="activeApp === 'encounters'"
        class="w-full"
      >
        <EncountersApp />
      </div>

      <!-- About Section -->
      <div
        v-if="activeApp === 'about'"
        class="w-full"
      >
        <About />
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AlienRpgApp from "./apps/star-system-generator/App.vue";
import SpaceTravelApp from "./apps/space-travel-tool/App.vue";
import JobGeneratorApp from "./apps/job-generator/App.vue";
import EncountersApp from "./apps/encounters/App.vue";
import About from "./components/About.vue";
import Footer from "./components/Footer.vue";

const activeApp = ref("alien-rpg");
const isDarkMode = ref(true);
const isElectronApp = ref(false);
const isMobileMenuOpen = ref(false);

const apps = [
  { id: "alien-rpg", name: "Star System Generator" },
  { id: "space-travel", name: "Space Travel Tool" },
  { id: "job-generator", name: "Job Generator" },
  { id: "encounters", name: "Encounters" },
  { id: "about", name: "About" },
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
