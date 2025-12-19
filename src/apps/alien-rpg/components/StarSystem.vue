<template>
  <div id="star-system" class="mb-8">
    <div
      class="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-gray-300 dark:border-gray-700"
    >
      <div class="flex-1">
        <h2 class="mb-0 text-2xl font-bold text-gray-900 dark:text-white">
          Generate A Star System
        </h2>
      </div>
      <div>
        <InfoIcon
          aria-label="Show star system information"
          @click="showModalSS1 = true"
        />
      </div>
    </div>
    <div class="flex flex-wrap gap-3 mb-6">
      <div class="w-full">
        <div
          class="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm"
        >
          <label
            class="px-4 py-2 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent dark:to-transparent border-r border-gray-300 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap"
            for="inputGroupSelect01"
            >Select Star Type</label
          >
          <select
            id="selectStar"
            v-model="selectedValue"
            class="flex-1 px-4 py-2 border-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
            @change="handleChange"
          >
            <option
              v-for="option in starType"
              :key="option.value"
              :value="option.value"
            >
              {{ option.type }}
            </option>
          </select>
        </div>
      </div>
      <div v-show="selectedValue" class="w-full" @click="handleChange">
        <button
          class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-lg uppercase w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          GENERATE NEW {{ selectedStarType }}
        </button>
      </div>
    </div>

    <div
      v-if="selectedValue"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4"
    >
      <div class="flex-1">
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
          >
            <div class="flex flex-wrap items-center">
              <div class="flex-1">
                <p
                  class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
                >
                  GAS GIANTS
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex justify-between items-start">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Quantity:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                gasGiantsRoll
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
          >
            <div class="flex flex-wrap items-center">
              <div class="flex-1">
                <p
                  class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
                >
                  TERRESTRIAL PLANETS
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex justify-between items-start">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Quantity:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                terrestrialPlanetsRoll
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
          >
            <div class="flex flex-wrap items-center">
              <div class="flex-1">
                <p
                  class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
                >
                  ICE PLANETS
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex justify-between items-start">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Quantity:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                icePlanetsRoll
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
          >
            <div class="flex flex-wrap items-center">
              <div class="flex-1">
                <p
                  class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
                >
                  ASTEROID BELTS
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex justify-between items-start">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Quantity:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                asteroidBeltsRoll
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="selectedValue && gasGiantsRoll > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3"
    >
      <div v-show="selectedValue && gasGiantsRoll > 0" class="flex-1">
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
          >
            <div class="flex flex-wrap items-center">
              <div class="flex-1">
                <p
                  class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
                >
                  GAS GIANT MOONS
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex justify-between items-start">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Quantity:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                gasGiantMoonsRoll
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-show="selectedValue && gasGiantsRoll > 0" class="flex-1">
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
          >
            <div class="flex flex-wrap items-center">
              <div class="flex-1">
                <p
                  class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
                >
                  GAS GIANT FEATURES
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex flex-col gap-2">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Features:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                gasGiantFeaturesRoll
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-show="selectedValue && asteroidBeltsRoll > 0" class="flex-1">
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
          >
            <div class="flex flex-wrap items-center">
              <div class="flex-1">
                <p
                  class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
                >
                  ASTEROID BELT FEATURES
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex flex-col gap-2">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Features:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                asteroidBeltFeaturesRoll
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- MODALS -->
  <Modal v-model:model-value="showModalSS1" title="PLANET SIZE NOTES">
    <p>You can find more information on Star Systems in the Core Rulebook.</p>
    <p>For Star Types, go to page 330.</p>
    <p class="mb-0">For Star System Generator and Details, go to page 340.</p>
    <template #footer>
      <button
        class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
        @click="showModalSS1 = false"
      >
        Close
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { computed, ref } from "vue";
import InfoIcon from "@/shared/components/InfoIcon.vue";

// Modal
import Modal from "@/shared/components/Modal.vue";
const showModalSS1 = ref(false);

// Data Initialization
const selectedValue = ref(0);
const starType = ref([
  {
    value: 1,
    type: "Giant",
    description: "Huge, bright and cool star in a late stage of evolution",
    brightnessClass: "Type III",
  },
  {
    value: 2,
    type: "Subgiant",
    description: "A large, bright star, exhausting its fuel",
    brightnessClass: "Type IV",
  },
  {
    value: 3,
    type: "Main Sequence",
    description: "Small but incredibly common type of star",
    brightnessClass: "Type V",
  },
  {
    value: 4,
    type: "White Dwarf",
    description: "A dead, burnt-out star, tiny and super-dense",
    brightnessClass: "Type DA",
  },
  {
    value: 5,
    type: "Red Dwarf",
    description: "A red main sequence star, small and cool. Very common star",
    brightnessClass: "Type MV",
  },
  {
    value: 6,
    type: "White Main Sequence",
    description: "White main sequence stars that burn hot and brightly",
    brightnessClass: "Type AOV",
  },
]);

const gasGiantFeatures = [
  "Storms",
  "Single Super Storm",
  "Rings",
  "High Winds",
  "Intense Radiation Fields",
  "Small Gas Giant",
];
const asteroidBeltFeatures = [
  "Bright and Highly Visable",
  "High Orbital Inclination",
  "Dust Belt",
  "Contains Several Large Dwarf Planets",
  "Very Wide, Covering Several Orbits",
  "Intensely Mineral Rich Asteroids",
];

const selectedStarType = computed(() => {
  const selectedItem = starType.value.find(
    (option) => option.value === selectedValue.value
  );
  return selectedItem ? selectedItem.type : "";
});

// Random roll generation helper function for numbers
function getRandomRoll(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Random roll generation helper function for strings
function getRandomStringRoll(arr) {
  const randomString = Math.floor(Math.random() * arr.length);
  return arr[randomString];
}

// Function to handle random planet generation based on selected star type
function generatePlanetRoll(adjustments = 0) {
  let baseRoll = getRandomRoll(1, 7);
  let finalRoll = baseRoll + adjustments;
  return Math.max(finalRoll, 0);
}

const emit = defineEmits(["selectedStarSystemValue", "dataGenerated"]);

// Handle change in star selection
function handleChange() {
  emit("selectedStarSystemValue", selectedValue.value);
  gasGiantsRoll.value = generatePlanetRoll(
    selectedValue.value === 2 ? -2 : selectedValue.value === 4 ? -5 : -1
  );
  terrestrialPlanetsRoll.value = generatePlanetRoll(
    [4, 5].includes(selectedValue.value) ? -3 : 0
  );
  icePlanetsRoll.value = generatePlanetRoll(
    [1, 2, 3].includes(selectedValue.value) ? 0 : 1,
    6
  );
  asteroidBeltsRoll.value = generatePlanetRoll(
    [2, 4].includes(selectedValue.value) ? -5 : -3
  );
  gasGiantMoonsRoll.value = generatePlanetRoll(4);
  gasGiantFeaturesRoll.value = getRandomStringRoll(gasGiantFeatures);
  asteroidBeltFeaturesRoll.value = getRandomStringRoll(asteroidBeltFeatures);

  // Emit generated data for export/history
  emit("dataGenerated", {
    type: selectedStarType.value,
    gasGiants: gasGiantsRoll.value,
    terrestrialPlanets: terrestrialPlanetsRoll.value,
    icePlanets: icePlanetsRoll.value,
    asteroidBelts: asteroidBeltsRoll.value,
    gasGiantMoons: gasGiantMoonsRoll.value > 0 ? gasGiantMoonsRoll.value : null,
    gasGiantFeatures:
      gasGiantsRoll.value > 0 ? gasGiantFeaturesRoll.value : null,
    asteroidBeltFeatures:
      asteroidBeltsRoll.value > 0 ? asteroidBeltFeaturesRoll.value : null,
  });
}

// Planet roll variables
const gasGiantsRoll = ref(0);
const terrestrialPlanetsRoll = ref(0);
const icePlanetsRoll = ref(0);
const asteroidBeltsRoll = ref(0);
const gasGiantMoonsRoll = ref(0);
const gasGiantFeaturesRoll = ref(0);
const asteroidBeltFeaturesRoll = ref(0);
</script>

<style></style>
