<template>
  <div :class="isElectronApp ? 'min-h-screen' : ''">
    <UpdateNotification />
    <div
      class="max-w-7xl mx-auto px-4 py-8 text-gray-900 dark:text-gray-100 transition-colors duration-200"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 pt-4 mb-8 border border-gray-200 dark:border-gray-700"
      >
        <Directions @reset-generator="handleReset" />
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 pt-6 mb-8 border border-gray-200 dark:border-gray-700"
      >
        <StarSystem
          :key="resetKey"
          @selected-star-system-value="handleStarTypeSelection"
          @data-generated="handleStarSystemData"
        />
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 pt-6 mb-8 border border-gray-200 dark:border-gray-700"
      >
        <PlanetGenerator
          :key="resetKey"
          :selected-star-type="selectedStarType"
          @data-generated="handlePlanetData"
        />
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 pt-6 mb-8 border border-gray-200 dark:border-gray-700"
      >
        <ColonyGenerator
          :key="resetKey"
          :disabled="disableButton"
          @data-generated="handleColonyData"
        />
      </div>

      <GeneratorFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, provide, reactive, onMounted } from "vue";
import Directions from "./components/Directions.vue";
import StarSystem from "./components/StarSystem.vue";
import PlanetGenerator from "./components/PlanetGenerator.vue";
import ColonyGenerator from "./components/ColonyGenerator.vue";
import GeneratorFooter from "./components/Footer.vue";
import UpdateNotification from "./components/UpdateNotification.vue";
import "./style.css";

// Detect if running in Electron
const isElectronApp = ref(false);
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

// Apply background based on dark class or system preference
function applyElectronBackground() {
  const isDarkMode =
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const backgroundColor = isDarkMode ? "#030712" : "#ffffff";
  document.documentElement.style.backgroundColor = backgroundColor;
  document.body.style.backgroundColor = backgroundColor;
}

// Generated data tracking
const generatedData = ref({});

// Reset Generator, button located in Directions
const resetKey = ref(0);
const disableButton = ref(0);
function handleReset() {
  resetKey.value++;
  sharedState.pgPlanetGeneratorTrigger = 0;
  generatedData.value = {};
}

// Selected Star Type
const selectedStarType = ref(0);
const handleStarTypeSelection = (value) => {
  selectedStarType.value = value;
};

// Share the dice roller between child components
const diceRoller = {
  getRandomRoll: (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  },

  rollD3: () => {
    return Math.floor(Math.random() * 3) + 1;
  },

  rollD6: () => {
    return Math.floor(Math.random() * 6) + 1;
  },

  generate2D6Roll: (adjustments = 0) => {
    let baseRoll =
      diceRoller.getRandomRoll(1, 7) + diceRoller.getRandomRoll(1, 7);
    let finalRoll = baseRoll + adjustments;
    return Math.min(Math.max(finalRoll, 2), 12);
  },

  generate3D6Roll: (adjustments = 0) => {
    let baseRoll =
      diceRoller.getRandomRoll(1, 7) +
      diceRoller.getRandomRoll(1, 7) +
      diceRoller.getRandomRoll(1, 7);
    let finalRoll = baseRoll + adjustments;
    return Math.min(Math.max(finalRoll, 2), 12);
  },

  generateD66Roll: (adjustments = 0) => {
    let tens = diceRoller.rollD6() + adjustments;
    tens = Math.max(1, Math.min(6, tens));
    const ones = diceRoller.rollD6();
    let finalRoll = tens * 10 + ones;
    return Math.max(11, Math.min(66, finalRoll));
  },
};
provide("diceRoller", diceRoller);

// Shared state (multiple variables)
const sharedState = reactive({
  pgPlanetAtmosphereRoll: 0,
  pgPlanetSizeRoll: 0,
  pgPlanetGeneratorTrigger: 0,
  colonyGeneratorTrigger: 0,
});

// Provide the shared state and an updater function
provide("sharedState", sharedState);

// Data generation handlers
const handleStarSystemData = (data) => {
  generatedData.value = { ...generatedData.value, starSystem: data };
};

const handlePlanetData = (data) => {
  generatedData.value = { ...generatedData.value, planet: data };
};

const handleColonyData = (data) => {
  generatedData.value = { ...generatedData.value, colony: data };
};
</script>
