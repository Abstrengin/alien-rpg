<template>
  <div class="space-y-6">
    <!-- Encounter Type Selection -->
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 pt-6 pb-6 border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Select Encounter Type
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="type in encounterTypes"
          :key="type.id"
          :class="[
            'p-4 rounded-lg font-semibold transition-all duration-200 border-2',
            selectedType === type.id
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400',
          ]"
          @click="selectEncounterType(type.id)"
        >
          {{ type.name }}
        </button>
      </div>
    </div>

    <!-- Generate Button -->
    <div
      v-if="selectedType"
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 pt-6 pb-6 border border-gray-200 dark:border-gray-700"
    >
      <button
        class="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors"
        @click="generateEncounter"
      >
        GENERATE ENCOUNTER
      </button>
    </div>

    <!-- Generated Encounter -->
    <div
      v-if="generatedEncounter"
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 pt-6 pb-6 border border-gray-200 dark:border-gray-700 space-y-6"
    >
      <!-- Star System Encounter -->
      <div v-if="selectedType === 'star-system'">
        <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">
          STAR SYSTEM ENCOUNTER
        </h3>

        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              System Location
            </label>
            <select
              v-model="systemLocation"
              class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="standard">
                Standard System
              </option>
              <option value="outer-rim">
                Outer Rim / Frontier (-3 modifier)
              </option>
              <option value="uncharted">
                Uncharted Space (-5 modifier)
              </option>
            </select>
          </div>

          <div v-if="generatedEncounter.encounter">
            <h4 class="font-semibold text-lg mb-2">
              {{ generatedEncounter.encounter }}
            </h4>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ generatedEncounter.description }}
            </p>
          </div>

          <div v-if="generatedEncounter.reaction">
            <h4 class="font-bold text-cyan-600 dark:text-cyan-400 mb-2">
              SHIP REACTION
            </h4>
            <p>{{ generatedEncounter.reaction }}</p>
          </div>
        </div>
      </div>

      <!-- Surface Encounter -->
      <div v-if="selectedType === 'surface'">
        <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">
          SURFACE ENCOUNTER
        </h3>

        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              World Type
            </label>
            <select
              v-model="worldType"
              class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="uninhabited">
                Uninhabited World
              </option>
              <option value="colonized">
                Colonized World
              </option>
            </select>
          </div>

          <div v-if="generatedEncounter.encounter">
            <h4 class="font-semibold text-lg mb-2">
              {{ generatedEncounter.encounter }}
            </h4>
            <p class="text-gray-600 dark:text-gray-400 mb-2">
              {{ generatedEncounter.description }}
            </p>
            <p
              v-if="generatedEncounter.hazard"
              class="text-sm text-red-600 dark:text-red-400 font-semibold"
            >
              ⚠️ {{ generatedEncounter.hazard }}
            </p>
          </div>
        </div>
      </div>

      <!-- Colony Encounter -->
      <div v-if="selectedType === 'colony'">
        <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">
          COLONY ENCOUNTER
        </h3>

        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Colony Status
            </label>
            <select
              v-model="colonyStatus"
              class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="young">
                Young Colony
              </option>
              <option value="established">
                Established Colony (+1 modifier)
              </option>
            </select>
          </div>

          <div v-if="generatedEncounter.encounter">
            <h4 class="font-semibold text-lg">
              {{ generatedEncounter.encounter }}
            </h4>
            <p
              v-if="generatedEncounter.description"
              class="text-gray-600 dark:text-gray-400 mt-2"
            >
              {{ generatedEncounter.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const encounterTypes = [
  { id: "star-system", name: "Star System Encounters" },
  { id: "surface", name: "Surface Encounters" },
  { id: "colony", name: "Colony Encounters" },
];

const selectedType = ref(null);
const generatedEncounter = ref(null);
const systemLocation = ref("standard");
const worldType = ref("uninhabited");
const colonyStatus = ref("young");

const starSystemEncounters = [
  { name: "Research Vessel", desc: "Scientific research expedition" },
  { name: "Asteroid Drill Ship", desc: "Mining operation in asteroid field" },
  { name: "Small Survey Ship", desc: "Mapping expedition" },
  { name: "Colony Supply Vessel", desc: "Bringing supplies to colonists" },
  { name: "Military Recon Craft", desc: "Military surveillance mission" },
  { name: "Private Executive Transport", desc: "Corporate transport" },
  { name: "Hypersleep Transport", desc: "Long-term colony transport" },
  { name: "Light Shuttle", desc: "Short-range shuttle craft" },
  { name: "Bulk Freighter", desc: "Heavy cargo vessel" },
  { name: "Liquefied Gas Transport", desc: "Fuel or chemical transport" },
  { name: "Tugship Towing A Platform", desc: "Towing a space platform" },
  { name: "Container Ship", desc: "Containerized cargo transport" },
  { name: "Military Missile Cruiser", desc: "Armed military vessel" },
  { name: "Tugship Not Currently Towing", desc: "Independent tugship" },
  { name: "Heavy Shuttle", desc: "Large cargo shuttle" },
  { name: "Fast Courier Vessel", desc: "High-speed messenger ship" },
  { name: "Modular Cargo Transport", desc: "Flexible cargo configuration" },
  { name: "Large Space-Station", desc: "Orbital station" },
  { name: "Light Tugship", desc: "Small towing vessel" },
  { name: "In-System Shuttle", desc: "Local planetary shuttle" },
  { name: "Petroleum Carrier", desc: "Oil and fuel transport" },
  { name: "Salvage Ship", desc: "Wreckage recovery vessel" },
  { name: "Military Patrol Craft", desc: "Military patrol and security" },
  { name: "Emergency Response Vessel", desc: "Search and rescue ship" },
  { name: "Communications Relay Station", desc: "Communications hub" },
  { name: "Military Dropship In Orbit", desc: "Military assault transport" },
  { name: "Customs Cutter", desc: "Trade regulation enforcement" },
  { name: "Military Assault Ship", desc: "Armed assault transport" },
  { name: "Corporate Space-Station", desc: "Corporate orbital facility" },
  { name: "Private Security Cutter", desc: "Private security vessel" },
  { name: "Mobile Construction Rig", desc: "Space construction platform" },
];

const shipReactions = [
  "Unusual - May be on unusual trajectory, registered as missing, or refuse to respond",
  "Dismissive - Will decline to provide information or assistance if asked",
  "Radio Silence - Ignores your signals, but polite if you contact them",
  "Friendly - May pass on information or advice if relevant",
  "Assistance - May request information or ask for assistance/spare parts",
  "Familiar Vessel - A ship you know, perhaps with familiar crew",
];

const surfaceEncounters = {
  uninhabited: [
    {
      name: "Temperature Swing",
      desc: "Dramatic temperature change - on cold worlds drop occurs, on hot worlds they rise",
      hazard: "Exposure risk - take protective measures",
    },
    {
      name: "Unstable Ground",
      desc: "Ice, soft sand, swamp or other tricky terrain",
      hazard: "Movement hazard - slows progress and risks equipment damage",
    },
    {
      name: "Diversion",
      desc: "Escarpment, canyon or other feature forces undesirable direction",
      hazard: "Navigation challenge - adds D6 hours to journey",
    },
    {
      name: "Cross Ravine/River",
      desc: "A ravine or river blocking passage",
      hazard: "Crossing takes D6 hours and requires careful navigation",
    },
    {
      name: "Rough Terrain",
      desc: "Rocky ground or thick vegetation slows travel",
      hazard: "Travel speed reduced to half for D6 hours",
    },
    {
      name: "None",
      desc: "Fortunately, no significant obstacles today",
      hazard: null,
    },
  ],
  colonized: [
    {
      name: "Wildcatters",
      desc: "Prospectors in a single tractor searching for resources",
      hazard: null,
    },
    {
      name: "Mining Operation",
      desc: "Temporary drilling or mining operation in progress",
      hazard: null,
    },
    {
      name: "Lone Colonist",
      desc: "A single colonist on foot or in a vehicle",
      hazard: null,
    },
    {
      name: "Scientists",
      desc: "Scientists studying natural phenomena, plant-life or geology",
      hazard: null,
    },
    {
      name: "Abandoned Kit",
      desc: "Useless, valuable or wrecked equipment found abandoned",
      hazard: null,
    },
    {
      name: "Explorers",
      desc: "Explorers in a vehicle mapping the local area",
      hazard: null,
    },
  ],
};

const colonyEncounters = [
  "Rowdy miners - Off-duty miners causing a commotion",
  "Technicians making repairs - Technical crew at work",
  "Exhausted workers arriving - Workers returning from duty",
  "Workers preparing to leave - Crew prepping for departure",
  "Supplies being delivered - Cargo shipment arriving",
  "Colony workers off-duty - Workers on break",
  "Family off-duty together - Family group relaxing",
  "Medical crisis - Emergency medical situation",
  "Colony manager and deputy - Management in discussion",
  "Loud argument - Two groups in heated disagreement",
  "Drunken revelers - Colonists celebrating",
  "Kids playing - Children at play",
  "Administrator making the rounds - Official inspection",
  "Marshal conducting an investigation - Law enforcement activity",
  "Cocky shuttle pilot - Arrogant flight crew member",
  "Unhappy off-world official - Visiting official in bad mood",
  "Colonist threatening each other - Escalating conflict",
  "Corporate investigator - Corporate rep investigating something",
  "Miners relaxing - Off-duty miners at rest",
  "Colony damage needing repair - Visible damage and repairs needed",
  "Operations team having a discussion - Staff meeting",
  "Computer engineers at work - Tech team debugging systems",
  "Unattended supplies - Cargo left unguarded",
  "Maintenance crew - Repair and maintenance team",
  "Marshal searching or arresting a suspect - Law enforcement action",
  "Visitors from another colony - Colonists from neighboring settlement",
  "Sly corporate representative - Suspicious corporate agent",
  "Harassed chief engineer - Stressed engineering lead",
  "Scientists debating - Researchers in discussion",
  "Drug deal in progress - Illegal transaction occurring",
  "Overhear gossip - Interesting rumors and hearsay",
  "Security cordon - Restricted area under guard",
  "Mysterious scientist - Unusual researcher",
  "Management meeting - Corporate discussion",
  "Helpful android - Friendly AI assistant",
  "Cleaning crew - Maintenance staff",
  "Starship crew off-duty - Visiting spacers",
  "Thugs - Dangerous individuals",
  "Security patrol - Routine patrol",
  "Colonial official with entourage - Important official and staff",
  "Accident in progress - Emergency situation unfolding",
  "Colonists on strike or protesting - Labor action",
];

function selectEncounterType(typeId) {
  selectedType.value = typeId;
  generatedEncounter.value = null;
}

function rollDice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateEncounter() {
  const encounter = {};

  if (selectedType.value === "star-system") {
    // Roll D66 (two D6s: one for tens, one for ones)
    const tensDigit = rollDice(1, 6);
    const onesDigit = rollDice(1, 6);
    const d66Roll = tensDigit * 10 + onesDigit;

    const modifiers = {
      standard: 0,
      "outer-rim": -3,
      uncharted: -5,
    };
    const modifier = modifiers[systemLocation.value];
    const adjustedRoll = Math.max(0, d66Roll + modifier * 10);

    if (adjustedRoll <= 10) {
      encounter.encounter = "No Encounter";
      encounter.description =
        "Space is empty today. No ships detected on sensors.";
    } else {
      const ship = getRandomItem(starSystemEncounters);
      encounter.encounter = ship.name;
      encounter.description = ship.desc;
      encounter.reaction = getRandomItem(shipReactions);
    }
  } else if (selectedType.value === "surface") {
    const roll = rollDice(3, 18);

    let selectedEncounter;
    if (worldType.value === "uninhabited") {
      if (roll >= 3 && roll <= 5) {
        selectedEncounter = surfaceEncounters.uninhabited[0]; // Temperature
      } else if (roll === 6 || roll === 7) {
        selectedEncounter = surfaceEncounters.uninhabited[1]; // Unstable
      } else if (roll === 8) {
        selectedEncounter = surfaceEncounters.uninhabited[2]; // Diversion
      } else if (roll === 9) {
        selectedEncounter = surfaceEncounters.uninhabited[3]; // Ravine
      } else if (roll === 10 || roll === 11) {
        selectedEncounter = surfaceEncounters.uninhabited[4]; // Rough
      } else {
        selectedEncounter = surfaceEncounters.uninhabited[5]; // None
      }
    } else {
      // Colonized world
      if (roll >= 3 && roll <= 5) {
        selectedEncounter = surfaceEncounters.colonized[0]; // Temperature
      } else if (roll === 6 || roll === 7) {
        selectedEncounter = surfaceEncounters.colonized[1]; // Unstable
      } else if (roll === 8) {
        selectedEncounter = surfaceEncounters.colonized[2]; // Diversion
      } else if (roll === 9) {
        selectedEncounter = surfaceEncounters.colonized[3]; // Ravine
      } else if (roll === 10 || roll === 11) {
        selectedEncounter = surfaceEncounters.colonized[4]; // Rough
      } else if (roll >= 12 && roll <= 14) {
        selectedEncounter = {
          name: "Wildcatters",
          desc: "Prospectors in a single tractor searching for resources",
          hazard: null,
        };
      } else if (roll === 15) {
        selectedEncounter = {
          name: "Mining Operation",
          desc: "Temporary drilling or mining operation in progress",
          hazard: null,
        };
      } else if (roll === 16) {
        selectedEncounter = {
          name: "Scientists",
          desc: "Scientists studying natural phenomena, plant-life or geology",
          hazard: null,
        };
      } else {
        selectedEncounter = surfaceEncounters.colonized[5]; // None
      }
    }

    encounter.encounter = selectedEncounter.name;
    encounter.description = selectedEncounter.desc;
    if (selectedEncounter.hazard) {
      encounter.hazard = selectedEncounter.hazard;
    }
  } else if (selectedType.value === "colony") {
    // Roll D66 for colony encounters
    const tensDigit = rollDice(1, 6);
    const onesDigit = rollDice(1, 6);

    // Apply +1 modifier to tens digit if established colony
    const modifier = colonyStatus.value === "established" ? 1 : 0;
    const adjustedTens = Math.min(7, tensDigit + modifier);
    const adjustedRoll = adjustedTens * 10 + onesDigit;

    // Select encounter based on roll
    const encounterIndex = Math.min(
      adjustedRoll - 11,
      colonyEncounters.length - 1
    );
    const selectedIndex = Math.max(0, encounterIndex);

    encounter.encounter = colonyEncounters[selectedIndex];
  }

  generatedEncounter.value = encounter;
}
</script>
