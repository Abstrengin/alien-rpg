<template>
  <div
    class="export-controls flex flex-wrap justify-between items-center gap-4"
  >
    <!-- Title/Link - always visible on the left -->
    <div class="text-gray-600 dark:text-gray-400 hidden sm:block">
      <a
        href="https://www.tiesthatbindgaming.com"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
      >
        Alien RPG Star System Generator
      </a>
    </div>

    <!-- Right side container with buttons and toggle -->
    <div class="flex flex-wrap gap-2 items-center">
      <!-- Export buttons container -->
      <div
        v-if="hasData"
        class="flex flex-wrap gap-2"
      >
        <button
          class="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded export-btn"
          :class="{ 'copy-success': copySuccess }"
          :disabled="isCopying"
          aria-label="Copy generated data to clipboard"
          @click="handleCopy"
        >
          <svg
            v-if="!copySuccess"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect
              x="9"
              y="9"
              width="13"
              height="13"
              rx="2"
              ry="2"
            />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {{ copySuccess ? "Copied!" : "Copy" }}
        </button>

        <button
          class="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded export-btn"
          aria-label="Download data as JSON file"
          @click="handleDownloadJSON"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line
              x1="12"
              y1="15"
              x2="12"
              y2="3"
            />
          </svg>
          JSON
        </button>

        <button
          class="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded export-btn"
          aria-label="Download data as text file"
          @click="handleDownloadText"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line
              x1="12"
              y1="15"
              x2="12"
              y2="3"
            />
          </svg>
          Text
        </button>

        <button
          class="px-3 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded export-btn"
          aria-label="Print generated data"
          @click="handlePrint"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path
              d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
            />
            <rect
              x="6"
              y="14"
              width="12"
              height="8"
            />
          </svg>
          Print
        </button>
      </div>

      <!-- Dark mode toggle -->
      <button
        class="px-4 py-2.5 text-sm bg-gray-600 hover:bg-gray-700 dark:bg-gray-400 dark:hover:bg-gray-300 text-white dark:text-gray-900 rounded export-btn transition-colors flex items-center justify-center"
        :aria-label="
          isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
        "
        @click="toggleDarkMode"
      >
        <svg
          v-if="!isDarkMode"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-brightness-high-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-moon-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useExport } from "./composables/useExport";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const isDarkMode = ref(true);

const {
  isCopying,
  copySuccess,
  copyToClipboard,
  downloadAsJSON,
  downloadAsText,
  formatForPrint,
} = useExport();

const hasData = computed(() => {
  return Object.keys(props.data).length > 0;
});

onMounted(() => {
  // Sync with saved theme preference (dark mode is default)
  const savedTheme = localStorage.getItem("theme-preference");
  isDarkMode.value = savedTheme !== "light";
});

const toggleDarkMode = () => {
  const html = document.documentElement;
  isDarkMode.value = !isDarkMode.value;

  if (isDarkMode.value) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  // Update body background color for Electron
  const backgroundColor = isDarkMode.value ? "#030712" : "#ffffff";
  document.documentElement.style.backgroundColor = backgroundColor;
  document.body.style.backgroundColor = backgroundColor;

  // Persist preference in localStorage
  localStorage.setItem("theme-preference", isDarkMode.value ? "dark" : "light");
};

const formatDataAsText = (data) => {
  let text = "=== ALIEN RPG STAR SYSTEM GENERATOR ===\n\n";

  if (data.starSystem) {
    text += "--- STAR SYSTEM ---\n";
    text += `Star Type: ${data.starSystem.type}\n`;
    text += `Gas Giants: ${data.starSystem.gasGiants}\n`;
    text += `Terrestrial Planets: ${data.starSystem.terrestrialPlanets}\n`;
    text += `Ice Planets: ${data.starSystem.icePlanets}\n`;
    text += `Asteroid Belts: ${data.starSystem.asteroidBelts}\n`;
    if (data.starSystem.gasGiantMoons) {
      text += `Gas Giant Moons: ${data.starSystem.gasGiantMoons}\n`;
    }
    if (data.starSystem.gasGiantFeatures) {
      text += `Gas Giant Features: ${data.starSystem.gasGiantFeatures}\n`;
    }
    if (data.starSystem.asteroidBeltFeatures) {
      text += `Asteroid Belt Features: ${data.starSystem.asteroidBeltFeatures}\n`;
    }
    text += "\n";
  }

  if (data.planet) {
    text += "--- PLANET ---\n";
    text += `Type: ${data.planet.type}\n`;
    text += `Size: ${data.planet.size}\n`;
    text += `Surface Gravity: ${data.planet.surfaceGravity}\n`;
    text += `Atmosphere: ${data.planet.atmosphere}\n`;
    text += `Temperature: ${data.planet.temperature}\n`;
    text += `Average Temperature: ${data.planet.averageTemperature}\n`;
    text += `Geosphere: ${data.planet.geosphere}\n`;
    if (data.planet.terrain) {
      text += `Terrain: ${data.planet.terrain}\n`;
    }
    text += "\n";
  }

  if (data.colony) {
    text += "--- COLONY ---\n";
    text += `Size: ${data.colony.size}\n`;
    text += `Population: ${data.colony.population}\n`;
    text += `Mission Type: ${data.colony.missionType}\n`;
    text += `In Orbit: ${data.colony.inOrbit}\n`;
    text += `Number of Factions: ${data.colony.numberOfFactions}\n`;
    text += `Colony Factions: ${data.colony.factions}\n`;
    text += `Allegiance (Independent): ${data.colony.allegianceIndependent}\n`;
    text += `Allegiance (American/Anglo-Japanese): ${data.colony.allegianceAmerican}\n`;
    text += `Scenario Hook: ${data.colony.scenarioHook}\n`;
  }

  text += `\nGenerated: ${new Date().toLocaleString()}\n`;

  return text;
};

const handleCopy = async () => {
  const text = formatDataAsText(props.data);
  await copyToClipboard(text);
};

const handleDownloadJSON = () => {
  const filename = `star-system-${Date.now()}.json`;
  downloadAsJSON(props.data, filename);
};

const handleDownloadText = () => {
  const text = formatDataAsText(props.data);
  const filename = `star-system-${Date.now()}.txt`;
  downloadAsText(text, filename);
};

const handlePrint = () => {
  formatForPrint();
};
</script>
