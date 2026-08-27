<template>
  <div class="flex flex-col min-h-screen">
    <!-- Tab Navigation -->
    <div
      class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40"
    >
      <div class="max-w-7xl mx-auto px-2 sm:px-4">
        <div class="flex items-center gap-1 sm:gap-2">
          <!-- App Logo/Title -->
          <div
            class="py-3 pr-2 sm:pr-3 sm:py-3 sm:border-r border-gray-200 dark:border-gray-700 flex-shrink-0"
          >
            <h1 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white whitespace-nowrap">
              Alien RPG Tools
            </h1>
          </div>

          <!-- Home (always visible) -->
          <button
            class="hidden sm:block flex-shrink-0 px-2.5 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap"
            :class="
              activeApp === 'home'
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300'
            "
            @click="setActiveApp('home')"
          >
            Home
          </button>

          <!-- Desktop Tool Strip (scrolls horizontally on overflow) -->
          <div class="hidden sm:flex flex-1 min-w-0 overflow-x-auto no-scrollbar">
            <button
              v-for="app in toolApps"
              :key="app.id"
              :class="[
                'px-2.5 py-3 font-semibold transition-colors duration-200 border-b-2 whitespace-nowrap text-sm',
                activeApp === app.id
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300',
              ]"
              :title="app.name"
              @click="setActiveApp(app.id)"
            >
              {{ app.short }}
            </button>
          </div>

          <!-- About (always visible) -->
          <button
            class="hidden sm:block flex-shrink-0 px-2.5 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap"
            :class="
              activeApp === 'about'
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300'
            "
            @click="setActiveApp('about')"
          >
            About
          </button>

          <!-- Mobile Menu & Right Actions -->
          <div class="flex items-center gap-2 flex-shrink-0 ml-auto sm:ml-2">
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
              class="px-3 py-2 text-sm bg-gray-400 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded transition-colors"
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
      <div
        v-if="activeApp === 'home'"
        class="w-full"
      >
        <Home @navigate="handleNavigate" />
      </div>

      <template
        v-for="app in toolApps"
        :key="app.id"
      >
        <div
          v-if="activeApp === app.id"
          class="w-full"
        >
          <component :is="app.component" />
        </div>
      </template>

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
import { ref, computed, onMounted } from "vue";
import Home from "./components/Home.vue";
import About from "./components/About.vue";
import Footer from "./components/Footer.vue";
import { isElectron, initTheme, applyThemeClass } from "@/shared/theme.js";

import StarSystemGenerator from "./apps/star-system-generator/App.vue";
import SpaceTravelTool from "./apps/space-travel-tool/App.vue";
import CombatTracker from "./apps/combat-tracker/App.vue";
import ContractCargoGenerator from "./apps/contract-cargo-generator/App.vue";
import PanicTool from "./apps/panic-tool/App.vue";
import NpcGenerator from "./apps/npc-generator/App.vue";
import CreatureGenerator from "./apps/creature-generator/App.vue";
import ShipGenerator from "./apps/ship-generator/App.vue";
import SupplySalvageGenerator from "./apps/supply-salvage-generator/App.vue";

const activeApp = ref("home");
const isDarkMode = ref(true);
const isMobileMenuOpen = ref(false);

const toolApps = [
  { id: "star-system-generator", name: "Star System Generator", short: "Star Systems", component: StarSystemGenerator },
  { id: "space-travel-tool", name: "Space Travel Tool", short: "Travel", component: SpaceTravelTool },
  { id: "combat-tracker", name: "Combat Tracker", short: "Combat", component: CombatTracker },
  { id: "contract-cargo-generator", name: "Contract & Cargo Generator", short: "Contracts", component: ContractCargoGenerator },
  { id: "panic-tool", name: "Stress & Panic Tool", short: "Panic", component: PanicTool },
  { id: "npc-generator", name: "NPC Generator", short: "NPCs", component: NpcGenerator },
  { id: "creature-generator", name: "Creature Generator", short: "Creatures", component: CreatureGenerator },
  { id: "ship-generator", name: "Ship Generator", short: "Ships", component: ShipGenerator },
  { id: "supply-salvage-generator", name: "Supply & Salvage Generator", short: "Salvage", component: SupplySalvageGenerator },
];

const apps = computed(() => [
  { id: "home", name: "Home" },
  ...toolApps.map(({ id, name }) => ({ id, name })),
  { id: "about", name: "About" },
]);

const setActiveApp = (appId) => {
  activeApp.value = appId;
};

const handleNavigate = (appId) => {
  setActiveApp(appId);
};

onMounted(() => {
  isDarkMode.value = initTheme() === "dark";

  if (isElectron()) {
    document.documentElement.setAttribute("data-electron", "true");
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeQuery.addEventListener("change", () => {
      applyThemeClass(isDarkMode.value ? "dark" : "light");
    });
  }
});

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  const mode = isDarkMode.value ? "dark" : "light";
  applyThemeClass(mode);
  localStorage.setItem("theme-preference", mode);
};
</script>
