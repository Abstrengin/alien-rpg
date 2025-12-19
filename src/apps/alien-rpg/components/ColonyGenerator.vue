<template>
  <div
    id="colony-generator"
    class="mb-8"
  >
    <div
      class="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-gray-300 dark:border-gray-700"
    >
      <div class="flex-1">
        <h2 class="mb-0 text-2xl font-bold text-gray-900 dark:text-white">
          Generate A Colony
        </h2>
      </div>
      <div>
        <InfoIcon
          aria-label="Show colony generation information"
          @click="showModalc1 = true"
        />
      </div>
    </div>
    <div>
      <div class="flex flex-wrap gap-3 mb-6">
        <div class="w-full">
          <button
            class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            :disabled="!disableButton"
            @click="colonyRollD6"
          >
            <span v-if="sharedState.pgPlanetGeneratorTrigger === 0">GENERATE A PLANET FIRST</span>
            <span v-else>Roll D6{{ ": " + rollD6Result }}</span>
          </button>
        </div>
        <div class="w-full">
          <button
            class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            :disabled="!disableButton"
            @click="handleColonyGen"
          >
            <span v-if="sharedState.pgPlanetGeneratorTrigger === 0">GENERATE A PLANET FIRST</span>
            <span v-else>GENERATE
              <span v-if="colonyGeneratorTrigger === 1">NEW</span> COLONY</span>
          </button>
        </div>
      </div>
      <div
        v-if="colonyGeneratorTrigger === 1"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
      >
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
                  Colony Size
                </p>
              </div>
              <div class="flex-1 flex justify-end">
                <InfoIcon
                  aria-label="Show colony size information"
                  @click="showModal6 = true"
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
              >Size:</span>
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                colonySizeSize
              }}</span>
            </div>
            <div
              class="flex justify-between items-start pb-2 border-b border-gray-100"
            >
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
              >Population:</span>
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                colonySizePopulation
              }}</span>
            </div>
            <div class="flex flex-col gap-2">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
              >Missions:</span>
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                colonySizeMissions
              }}</span>
            </div>
          </div>
        </div>
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
          >
            <p
              class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
            >
              Mission Type
            </p>
          </div>
          <div class="px-5 py-4 flex items-center justify-between">
            <span class="font-semibold text-gray-700 dark:text-gray-300 text-sm">Type:</span>
            <span class="text-gray-900 dark:text-gray-100 font-medium">{{
              colonyMissionType
            }}</span>
          </div>
        </div>
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
                  Orbit
                </p>
              </div>
              <div class="flex-1 flex justify-end">
                <InfoIcon
                  aria-label="Show orbit information"
                  @click="showModal7 = true"
                />
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex flex-col gap-2">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
              >In Orbit:</span>
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                orbitInOrbit
              }}</span>
            </div>
          </div>
        </div>
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
                  Factions
                </p>
              </div>
              <div class="flex-1 flex justify-end">
                <InfoIcon
                  aria-label="Show faction information"
                  @click="showModal8 = true"
                />
              </div>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div class="flex flex-col gap-2">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
              >Count:</span>
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                numberOfFactionsTotal
              }}</span>
            </div>
          </div>
        </div>
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
          >
            <p
              class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
            >
              Colony Factions
            </p>
          </div>
          <div class="px-5 py-4 flex items-center justify-between">
            <span class="font-semibold text-gray-700 dark:text-gray-300 text-sm">Type:</span>
            <span class="text-gray-900 dark:text-gray-100 font-medium">{{
              colonyFactionsDesc
            }}</span>
          </div>
        </div>
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
          >
            <p
              class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
            >
              Allegiance
            </p>
          </div>
          <div class="px-5 py-4 space-y-2">
            <div
              class="flex justify-between items-start pb-2 border-b border-gray-100"
            >
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
              >ICSC:</span>
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                colonyAllegianceIndependant
              }}</span>
            </div>
            <div class="flex flex-col gap-2">
              <span
                class="font-semibold text-gray-700 dark:text-gray-300 text-sm"
              >USA/AJA:</span>
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{
                colonyAllegianceAmerican
              }}</span>
            </div>
          </div>
        </div>
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200"
        >
          <div
            class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
          >
            <p
              class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
            >
              Scenario Hooks
            </p>
          </div>
          <div class="px-5 py-4 flex flex-col gap-2">
            <span class="font-semibold text-gray-700 dark:text-gray-300 text-sm">Hook:</span>
            <span class="text-gray-900 dark:text-gray-100 font-medium">{{
              scenarioHooksHooks
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-model:model-value="showModalc1"
      title="GENERATE A COLONY NOTES"
    >
      <p>
        The buttons to generate a colony will become available once you genearte
        a planet. Colonies are dependant on Planet modifiers.
      </p>
      <p class="mb-0">
        A button to simulate a D6 die roll has been provided to help with hooks
        that require die rolls. The button will become available once a planet
        has been generated.
      </p>
      <template #footer>
        <button
          class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
          @click="showModalc1 = false"
        >
          Close
        </button>
      </template>
    </Modal>
    <Modal
      v-model:model-value="showModal6"
      title="COLONY SIZE NOTES"
    >
      <p>
        Colonial habitation on the Outer Rim and the Frontier is generally
        limited to small settlements with only one or two missions. These
        colonies have sponsors they are dependent upon. Roll first for the size
        of the colony and then for its missions. Roll initially for Colony Size
        and then roll a number of times on the Colony Mission Table as
        determined by Colony Size. If the GM is creating an unexplored and
        uninhabited planet, do not use the following tables. Some inhabited
        planets have been colonized by more than one power. The GM can either
        decide this is the case or roll 2D6, with 10 indicating two competing
        colonies on the same world.
      </p>
      <p class="mb-0">
        See p.336 in Core Rulebook for more info.
      </p>
      <template #footer>
        <button
          class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
          @click="showModal6 = false"
        >
          Close
        </button>
      </template>
    </Modal>
    <Modal
      v-model:model-value="showModal7"
      title="ORBIT NOTES"
    >
      <p>
        A colonized world will have objects of interest in orbit. If the planet
        is unexplored and uninhabited then simply roll D3–1 for the number of
        moons.
      </p>
      <p class="mb-0">
        See p.337 in Core Rulebook for more info.
      </p>
      <template #footer>
        <button
          class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
          @click="showModal7 = false"
        >
          Close
        </button>
      </template>
    </Modal>
    <Modal
      v-model:model-value="showModal8"
      title="FACTION NOTES"
    >
      <p>
        No colony and no human society is truly harmonious—there are schisms,
        groups, and factions, pushing and pulling for control. These factions
        can create tension and can have a dramatic effect on any situation that
        may occur at the colony. First roll for the number of factions, then
        roll for the nature of those factions.
      </p>
      <p>
        A colony may owe an overall allegiance to a corporation or nation,
        depending on its location. In the Union of Progressive Peoples, the
        allegiance of a colony is always to the UPP itself. In the Independent
        Core System Colonies (ICSC), although colonies are technically
        independent, in reality each is heavily dominated by a corporation with
        interests there. Colonies within the American and the Anglo-Japanese
        Arms have strong allegiances either to the governing power in that part
        of space, or to a corporation with strong business interests on the
        planet. For colonies outside of the UPP, roll randomly for an
        allegiance, choose one, or create your own.
      </p>
      <p class="mb-0">
        See p.337-338 in Core Rulebook for more info.
      </p>
      <template #footer>
        <button
          class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
          @click="showModal8 = false"
        >
          Close
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import { useData } from "../Data.vue";
import InfoIcon from "./InfoIcon.vue";
import Modal from "@/shared/components/Modal.vue";

// Shared Dice Roller provided by App.vue
const diceRoller = inject("diceRoller");

// Inject the shared state
const sharedState = inject("sharedState");

// Objects from db.json
const {
  colonyAllegiance,
  colonyFactions,
  colonyMission,
  colonySize,
  numberOfFactions,
  orbit,
  scenarioHooks,
} = useData();

const showModalc1 = ref(false);
const showModal6 = ref(false);
const showModal7 = ref(false);
const showModal8 = ref(false);

// Disable GENERATE COLONY button until a planet is generated
const disableButton = computed(() => {
  return sharedState.pgPlanetGeneratorTrigger === 1;
});

// Roll D6 die and display the result
const rollD6Result = ref(0);
const colonyRollD6 = () => {
  rollD6Result.value = diceRoller.rollD6();
};

// GENERATE COLONY
function handleColonyGen() {
  // COLONY SIZE
  const colonySizeAtmosphereCheckOne = [4, 5, 6];
  const colonySizeAtmosphereCheckTwo = [10, 11];
  let colonySizeMod = 0;
  colonySizeMod += colonySizeAtmosphereCheckOne.includes(
    sharedState.pgPlanetAtmosphereRoll
  )
    ? 1
    : 0;
  colonySizeMod -= colonySizeAtmosphereCheckTwo.includes(
    sharedState.pgPlanetAtmosphereRoll
  )
    ? 2
    : 0;
  colonySizeMod -= sharedState.pgPlanetAtmosphereRoll <= 5 ? 3 : 0;
  colonySizeRoll.value = diceRoller.generate2D6Roll(colonySizeMod);
  const selectedColonySize = colonySize.find(
    (temp) => temp.roll === colonySizeRoll.value
  );
  colonySizeSize.value = selectedColonySize.size;
  colonySizePopulation.value = selectedColonySize.population;
  colonySizeMissions.value = selectedColonySize.missions;

  // COLONY MISSION
  const colonyMissionAtmosphereCheckOne = [7, 8, 10, 11];
  const colonyMissionAtmosphereCheckTwo = [4, 5, 6];
  let colonyMissionMod = 0;
  colonyMissionMod -= colonyMissionAtmosphereCheckOne.includes(
    sharedState.pgPlanetAtmosphereRoll
  )
    ? 6
    : 0;
  colonyMissionMod -= colonySizeRoll.value <= 7 ? 1 : 0;
  colonyMissionMod += colonyMissionAtmosphereCheckTwo.includes(
    sharedState.pgPlanetAtmosphereRoll
  )
    ? 1
    : 0;
  colonyMissionMod += colonySizeRoll.value >= 11 ? 4 : 0;
  colonyMissionRoll.value = diceRoller.generate2D6Roll(colonyMissionMod);
  const selectedColonyMission = colonyMission.find(
    (temp) => temp.roll === colonyMissionRoll.value
  );
  colonyMissionType.value = selectedColonyMission.type;

  // ORBIT
  const orbitCheckOne = [8, 9, 10];
  orbitRoll.value = diceRoller.generate2D6Roll(
    orbitCheckOne.includes(colonyMissionRoll.value)
      ? 1
      : colonyMissionRoll.value >= 11
      ? 2
      : 0
  );
  const selectedOrbit = orbit.find((temp) => temp.roll === orbitRoll.value);
  orbitInOrbit.value = selectedOrbit.in_orbit;

  // NUMBER OF FACTIONS
  numberOfFactionsRoll.value = diceRoller.rollD6();
  const selectedNumberOfFactions = numberOfFactions.find(
    (temp) => temp.roll === numberOfFactionsRoll.value
  );
  numberOfFactionsTotal.value = selectedNumberOfFactions.number_of_factions;

  // COLONY FACTIONS
  colonyFactionsRoll.value = diceRoller.rollD6();
  const selectedColonyFactions = colonyFactions.find(
    (temp) => temp.roll === colonyFactionsRoll.value
  );
  colonyFactionsDesc.value = selectedColonyFactions.colony_factions;

  // COLONY ALLEGIANCE
  colonyAllegianceRoll.value = diceRoller.generate3D6Roll();
  const selectedColonyAllegiance = colonyAllegiance.find(
    (temp) => temp.roll === colonyAllegianceRoll.value
  );
  colonyAllegianceIndependant.value =
    selectedColonyAllegiance.independant_core_system_colonies;
  colonyAllegianceAmerican.value =
    selectedColonyAllegiance.american_or_anglo_japanese_arm;

  // SCENARIO HOOKS
  scenarioHooksRoll.value = diceRoller.generateD66Roll();
  const selectedScenarioHooks = scenarioHooks.find(
    (temp) => temp.roll === scenarioHooksRoll.value
  );
  scenarioHooksHooks.value = selectedScenarioHooks.hook;

  colonyGeneratorTrigger.value = 1;
}

// Variables
const colonySizeRoll = ref(0);
const colonySizeSize = ref(0);
const colonySizePopulation = ref(0);
const colonySizeMissions = ref(0);
const colonyMissionRoll = ref(0);
const colonyMissionType = ref(null);
const orbitRoll = ref(0);
const orbitInOrbit = ref(null);
const numberOfFactionsRoll = ref(0);
const numberOfFactionsTotal = ref(null);
const colonyFactionsRoll = ref(0);
const colonyFactionsDesc = ref(null);
const colonyAllegianceRoll = ref(0);
const colonyAllegianceIndependant = ref(null);
const colonyAllegianceAmerican = ref(null);
const scenarioHooksRoll = ref(0);
const scenarioHooksHooks = ref(null);
let colonyGeneratorTrigger = ref(0);
</script>
