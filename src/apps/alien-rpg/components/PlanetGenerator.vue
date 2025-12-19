<template>
  <div id="planet-generator" class="mb-8">
    <div
      class="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-gray-300 dark:border-gray-700"
    >
      <div class="flex-1">
        <h2 class="mb-0 text-2xl font-bold text-gray-900 dark:text-white">
          Generate A Planet
        </h2>
      </div>
    </div>
    <div class="flex flex-wrap gap-3 mb-6">
      <div class="w-full">
        <div
          class="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm"
        >
          <label
            class="px-4 py-2 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent border-r border-gray-300 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap"
            for="inputGroupSelect01"
            >Select Planet Type</label
          >
          <select
            id="selectPlanet"
            v-model="selectedPlanetValue"
            class="flex-1 px-4 py-2 border-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
            @change="handlePlanetChange"
          >
            <option
              v-for="option in planetType"
              :key="option.value"
              :value="option.value"
            >
              {{ option.type }}
            </option>
          </select>
        </div>
      </div>
      <div
        v-show="selectedPlanetValue"
        class="w-full"
        @click="handlePlanetChange"
      >
        <button
          class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-lg uppercase w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          GENERATE NEW {{ selectedPlanetType }}
        </button>
      </div>
    </div>
    <div
      v-if="selectedPlanetValue"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
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
                  Planet Size
                </p>
              </div>
              <div class="flex-1 flex justify-end">
                <InfoIcon
                  aria-label="Show planet size information"
                  @click="showModal1 = true"
                />
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div
              class="flex justify-between items-start pb-2 border-b border-gray-100"
            >
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Size:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                planetSizeSize
              }}</span>
            </div>
            <div
              class="flex justify-between items-start pb-2 border-b border-gray-100"
            >
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Gravity:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                planetSizeAtmosphere
              }}</span>
            </div>
            <div class="flex justify-between items-start">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Examples:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                planetSizeExample
              }}</span>
            </div>
          </div>
          <Modal v-model:model-value="showModal1" title="PLANET SIZE NOTES">
            <p>
              The size listed is the diameter of the planet in kilometers, with
              examples of roughly equivalent bodies from our Solar System.
              Worlds with lower than 0.7 G are considered low-gravity worlds
              while those of 1.3 G or above are classed as high gravity. On both
              low and high-G worlds, characters will have trouble moving around
              and get a –2 modification to all AGILITY, CLOSE COMBAT and STAMINA
              tests. After a period of acclimation, this modification
              disappears.
            </p>
            <p class="mb-0">See p.332 in Core Rulebook for more info.</p>
            <template #footer>
              <button
                class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
                @click="showModal1 = false"
              >
                Close
              </button>
            </template>
          </Modal>
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
                  Atmosphere
                </p>
              </div>
              <div class="flex-1 flex justify-end">
                <InfoIcon
                  aria-label="Show atmosphere information"
                  @click="showModal2 = true"
                />
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex flex-col gap-2">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Type:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                planetAtmosphereType
              }}</span>
            </div>
          </div>
          <Modal v-model:model-value="showModal2" title="ATMOSPHERE NOTES">
            <p>
              The size of a planet may affect the atmosphere, with the low-digit
              entries (2–8) generally more common for small worlds and the
              higher ones (9–12) associated with larger worlds. Many planets
              have toxic and unbreathable atmospheres—be prepared!
            </p>
            <p class="mb-0">See p.332 in Core Rulebook for more info.</p>
            <template #footer>
              <button
                class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
                @click="showModal2 = false"
              >
                Close
              </button>
            </template>
          </Modal>
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
                  Temperature
                </p>
              </div>
              <div class="flex-1 flex justify-end">
                <InfoIcon
                  aria-label="Show temperature information"
                  @click="showModal3 = true"
                />
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div
              class="flex justify-between items-start pb-2 border-b border-gray-100"
            >
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Temperature:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                planetTempTemperature
              }}</span>
            </div>
            <div
              class="flex justify-between items-start pb-2 border-b border-gray-100"
            >
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Average:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                planetTempAverageTemp
              }}</span>
            </div>
            <div class="flex flex-col gap-2">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Description:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                planetTempDesc
              }}</span>
            </div>
          </div>
          <Modal v-model:model-value="showModal3" title="TEMPERATURE NOTES">
            <p>
              The average surface temperature of a planet is dependent on its
              distance from the star as well as the planet's atmosphere. This
              temperature provides a clue as to its position in the star system
            </p>
            <p class="mb-0">See p.334 in Core Rulebook for more info.</p>
            <template #footer>
              <button
                class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
                @click="showModal3 = false"
              >
                Close
              </button>
            </template>
          </Modal>
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
                  Geosphere
                </p>
              </div>
              <div class="flex-1 flex justify-end">
                <InfoIcon
                  aria-label="Show geosphere information"
                  @click="showModal4 = true"
                />
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div
              class="flex justify-between items-start pb-2 border-b border-gray-100"
            >
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Type:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                planetGeoType
              }}</span>
            </div>
            <div class="flex flex-col gap-2">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Description:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                planetGeoDesc
              }}</span>
            </div>
          </div>
          <Modal v-model:model-value="showModal4" title="GEOSPHERE NOTES">
            <p>
              Results on the geosphere table (below) tell you the proportion of
              dry land to ocean that exists on the planet. Note that a Frozen
              world will have locked up all of the seas and oceans as ice and a
              Burning world will have turned its oceans to steam. Also, it
              should be pointed out that, when it comes to other planets, not
              all oceans are comprised of water.
            </p>
            <p class="mb-0">See p.334 in Core Rulebook for more info.</p>
            <template #footer>
              <button
                class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
                @click="showModal4 = false"
              >
                Close
              </button>
            </template>
          </Modal>
        </div>
      </div>
      <div
        v-if="selectedPlanetValue === 3 || selectedPlanetValue === 4"
        class="md:w-1/2"
      >
        <div
          v-if="selectedPlanetValue === 3"
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
                  Planetary Terrain
                </p>
              </div>
              <div class="flex-1 flex justify-end">
                <InfoIcon
                  aria-label="Show terrain information"
                  @click="showModal5a = true"
                />
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex flex-col gap-2">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Terrain:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                planetTerrain
              }}</span>
            </div>
          </div>
          <Modal
            v-model:model-value="showModal5a"
            title="PLANETARY TERRAIN NOTES"
          >
            <p>
              Roll on this table for a single distinctive planetary terrain
              type. If using the Star System Generator (later) these results are
              only suitable for Terrestrial Planets; for Ice Planets, use the
              Ice Planet Terrain Table instead.
            </p>
            <p class="mb-0">See p.335-336 in Core Rulebook for more info.</p>
            <template #footer>
              <button
                class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
                @click="showModal5a = false"
              >
                Close
              </button>
            </template>
          </Modal>
        </div>
        <div
          v-if="selectedPlanetValue === 4"
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
                  Ice Planet Terrain
                </p>
              </div>
              <div class="flex-1 flex justify-end">
                <InfoIcon
                  aria-label="Show ice terrain information"
                  @click="showModal5b = true"
                />
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex flex-col gap-2">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
                >Terrain:</span
              >
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                planetIceTerrain
              }}</span>
            </div>
          </div>
          <Modal
            v-model:model-value="showModal5b"
            title="ICE PLANET TERRAIN NOTES"
          >
            <p>
              Roll on this table for a single distinctive planetary terrain
              type. If using the Star System Generator (later) these results are
              only suitable for Terrestrial Planets; for Ice Planets, use the
              Ice Planet Terrain Table instead.
            </p>
            <p class="mb-0">See p.335-336 in Core Rulebook for more info.</p>
            <template #footer>
              <button
                class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
                @click="showModal5b = false"
              >
                Close
              </button>
            </template>
          </Modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useData } from "../Data.vue";
import InfoIcon from "./InfoIcon.vue";

const emit = defineEmits(["dataGenerated"]);

// Shared Dice Roller provided by App.vue
const diceRoller = inject("diceRoller");

// Share mulitiple variable with App.vue
const sharedState = inject("sharedState");

// Function to update shared variables
const updateVariables = () => {
  sharedState.pgPlanetAtmosphereRoll = planetAtmosphereRoll.value;
  sharedState.pgPlanetSizeRoll = planetSizeRoll.value;
  sharedState.pgPlanetGeneratorTrigger = planetGeneratorTrigger.value;
};

// Modal
import Modal from "@/shared/components/Modal.vue";
const showModal1 = ref(false);
const showModal2 = ref(false);
const showModal3 = ref(false);
const showModal4 = ref(false);
const showModal5a = ref(false);
const showModal5b = ref(false);

// Objects from db.json
const {
  atmosphere,
  geosphere,
  icePlanetTerrain,
  planetSize,
  planetaryTerrain,
  temperature,
} = useData();
const selectedPlanetValue = ref(0);

const planetType = ref([
  { value: 1, type: "Gas Giant" },
  { value: 2, type: "Gas Giant Moon" },
  { value: 3, type: "Terrestrial Planet" },
  { value: 4, type: "Ice Planet" },
]);

const selectedPlanetType = computed(() => {
  const selectedItem = planetType.value.find(
    (option) => option.value === selectedPlanetValue.value
  );
  return selectedItem ? selectedItem.type : "";
});

// Handle changes in planet section when new planet type is selcted from dropdown
// Each object must be registered in Data.vue or they will throw a find error
function handlePlanetChange() {
  // PLANET SIZE
  // If Star Type is Ice Planet, then -2 modifier or Gas Moon Giant, then -4 modifier.
  planetSizeRoll.value = diceRoller.generate2D6Roll(
    selectedPlanetValue.value === 2
      ? -4
      : selectedPlanetValue.value === 4
      ? -2
      : 0
  );
  const selectedPlanet = planetSize.find(
    (planetDB) => planetDB.roll === planetSizeRoll.value
  );
  planetSizeSize.value = selectedPlanet.size;
  planetSizeAtmosphere.value = selectedPlanet.surface_gravity;
  planetSizeExample.value = selectedPlanet.examples;

  // PLANET ATMOSPHERE
  // If Planet size is 6 or less, then -6 modifier or if 7, then -2 modifier.
  planetAtmosphereRoll.value = diceRoller.generate2D6Roll(
    planetSizeRoll.value <= 6 ? -6 : planetSizeRoll.value === 7 ? -2 : 0
  );
  const selectedAtmosphere = atmosphere.find(
    (atmosphereDB) => atmosphereDB.roll === planetAtmosphereRoll.value
  );
  planetAtmosphereType.value = selectedAtmosphere.type;

  // PLANET TEMPERATURE
  // Apply modifiers based on atmosphere type per Core Rulebook p.334
  // Thin atmosphere: –4 | Dense atmosphere: +1 | Corrosive or Infiltrating: +6
  // For Ice Planets, temperature is automatically set to Frozen (roll 1-3)
  let tempModifier = 0;
  if (selectedPlanetValue.value === 4) {
    // Ice Planet - set temperature to Frozen (roll 1)
    planetTemperatureRoll.value = 1;
    const selectedTemperature = temperature.find((tempDB) => tempDB.roll === 1);
    planetTempTemperature.value = selectedTemperature.temperature_type;
    planetTempAverageTemp.value = selectedTemperature.average_temperature;
    planetTempDesc.value = selectedTemperature.Description;
  } else {
    // Terrestrial or Gas Giant Moon - roll for temperature
    if (planetAtmosphereRoll.value <= 3) {
      tempModifier = -4; // Thin atmosphere
    } else if (planetAtmosphereRoll.value === 9) {
      tempModifier = +1; // Dense atmosphere
    } else if (
      planetAtmosphereRoll.value === 10 ||
      planetAtmosphereRoll.value === 11
    ) {
      tempModifier = +6; // Corrosive or Infiltrating atmosphere
    }
    // Special atmosphere (12) and others (4-8) = no modifier
    planetTemperatureRoll.value = diceRoller.generate2D6Roll(tempModifier);
    const selectedTemperature = temperature.find(
      (tempDB) => tempDB.roll === planetTemperatureRoll.value
    );
    planetTempTemperature.value = selectedTemperature.temperature_type;
    planetTempAverageTemp.value = selectedTemperature.average_temperature;
    planetTempDesc.value = selectedTemperature.Description;
  }

  // PLANET GEOSPHERE
  // If Thin, Dense, Corrosive or Infiltrating, then -4 modifier. If Hot Temp (8-10), -2 modifier. If Burning temp (11-12), -4 modifier. If Frozen (1-3), -2 modifier. No atmosphere = Desert World.
  const geoAtmosphereCheck = [9, 10, 11];
  const geoTemperatureCheckFrozenHot = [1, 2, 3, 8, 9, 10]; // Frozen (1-3) + Hot (8-10)
  // Combine modifiers to calculate Geosphere
  let geosphereModifier = 0;
  geosphereModifier -=
    planetAtmosphereRoll.value <= 3 ||
    geoAtmosphereCheck.includes(planetAtmosphereRoll.value)
      ? 4
      : 0;
  geosphereModifier -= geoTemperatureCheckFrozenHot.includes(
    planetTemperatureRoll.value
  )
    ? 2
    : 0;
  // Burning temperature (rolls 11-12) gets -4 modifier (not double-applied)
  geosphereModifier -= planetTemperatureRoll.value >= 11 ? 4 : 0;
  planetGeosphereRoll.value = diceRoller.generate2D6Roll(geosphereModifier);
  const selectedGeosphere = geosphere.find(
    (tempDB) => tempDB.roll === planetGeosphereRoll.value
  );
  planetGeoType.value = selectedGeosphere.geosphere_type;
  planetGeoDesc.value = selectedGeosphere.description;

  // PLANETARY TERRAIN
  // If Desert World then -3 modifier, if Arid World then -2 modifier, if Wet World then +2 modifier, if Waterworld then +3 modifier, if Frozen Temperatures then -2 modifier
  if (selectedPlanetValue.value === 3) {
    let terrainModifier = 0;
    terrainModifier -= planetGeosphereRoll.value <= 4 ? 3 : 0;
    terrainModifier -=
      planetGeosphereRoll.value === 5 || planetGeosphereRoll.value === 6
        ? 2
        : 0;
    terrainModifier += planetGeosphereRoll.value === 11 ? 2 : 0;
    terrainModifier += planetGeosphereRoll.value === 12 ? 3 : 0;
    terrainModifier -= planetTemperatureRoll.value <= 3 ? 2 : 0;
    planetTerrainRoll.value = diceRoller.generateD66Roll(terrainModifier);
    const selectedTerrain = planetaryTerrain.find(
      (tempDB) => tempDB.roll === planetTerrainRoll.value
    );
    planetTerrain.value = selectedTerrain.terrain;
  } else if (selectedPlanetValue.value === 4) {
    planetIceTerrainRoll.value = diceRoller.generate2D6Roll();
    const selectedIceTerrain = icePlanetTerrain.find(
      (tempDB) => tempDB.roll === planetIceTerrainRoll.value
    );
    planetIceTerrain.value = selectedIceTerrain.feature;
  }

  if (selectedPlanetValue.value) {
    planetGeneratorTrigger.value = 1;
  }

  // UPDATE SHARED VARIABLES
  updateVariables();

  // Emit generated data for export/history
  emit("dataGenerated", {
    type: selectedPlanetType.value,
    size: planetSizeSize.value,
    surfaceGravity: planetSizeAtmosphere.value,
    examples: planetSizeExample.value,
    atmosphere: planetAtmosphereType.value,
    temperature: planetTempTemperature.value,
    averageTemperature: planetTempAverageTemp.value,
    temperatureDescription: planetTempDesc.value,
    geosphere: planetGeoType.value,
    geosphereDescription: planetGeoDesc.value,
    terrain: planetTerrain.value || planetIceTerrain.value || null,
  });
}

// Variables
const planetSizeRoll = ref(0);
const planetSizeSize = ref(null);
const planetSizeAtmosphere = ref(null);
const planetSizeExample = ref(null);
const planetAtmosphereRoll = ref(0);
const planetAtmosphereType = ref(null);
const planetTemperatureRoll = ref(0);
const planetTempTemperature = ref(null);
const planetTempAverageTemp = ref(null);
const planetTempDesc = ref(null);
const planetGeosphereRoll = ref(0);
const planetGeoType = ref(null);
const planetGeoDesc = ref(null);
const planetTerrainRoll = ref(0);
const planetTerrain = ref(null);
const planetIceTerrainRoll = ref(0);
const planetIceTerrain = ref(0);
let planetGeneratorTrigger = ref(0);
</script>
