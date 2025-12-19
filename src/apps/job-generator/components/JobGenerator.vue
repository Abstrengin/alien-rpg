<template>
  <div class="space-y-6">
    <!-- Framework Selection -->
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 pt-6 pb-6 border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Select Framework
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="framework in frameworks"
          :key="framework.id"
          :class="[
            'p-4 rounded-lg font-semibold transition-all duration-200 border-2',
            selectedFramework === framework.id
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400',
          ]"
          @click="selectFramework(framework.id)"
        >
          {{ framework.name }}
        </button>
      </div>
    </div>

    <!-- Generate Button -->
    <div
      v-if="selectedFramework"
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 pt-6 pb-6 border border-gray-200 dark:border-gray-700"
    >
      <button
        class="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors"
        @click="generateJob"
      >
        GENERATE JOB
      </button>
    </div>

    <!-- Generated Job -->
    <div
      v-if="generatedJob"
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 pt-6 pb-6 border border-gray-200 dark:border-gray-700 space-y-6"
    >
      <div>
        <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
          JOB TYPE
        </h3>
        <p class="text-lg font-semibold">
          {{ generatedJob.jobType }}
        </p>
        <p class="text-gray-600 dark:text-gray-400">
          Destination: {{ generatedJob.destination }}
        </p>
        <p class="text-gray-600 dark:text-gray-400">
          Base Reward: {{ generatedJob.baseReward }}k UA dollars
        </p>
      </div>

      <div v-if="generatedJob.employer">
        <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
          EMPLOYER / SPONSOR
        </h3>
        <p class="text-lg">
          {{ generatedJob.employer }}
        </p>
      </div>

      <div v-if="generatedJob.description">
        <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
          DESCRIPTION
        </h3>
        <p>{{ generatedJob.description }}</p>
      </div>

      <div v-if="generatedJob.objective">
        <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
          OBJECTIVE / LOCATION
        </h3>
        <p>{{ generatedJob.objective }}</p>
      </div>

      <div v-if="generatedJob.complication">
        <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
          COMPLICATION
        </h3>
        <p>{{ generatedJob.complication }}</p>
      </div>

      <div v-if="generatedJob.plotTwist">
        <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
          PLOT TWIST
        </h3>
        <p>{{ generatedJob.plotTwist }}</p>
      </div>

      <div v-if="generatedJob.reward">
        <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
          SUGGESTED REWARD
        </h3>
        <p>{{ generatedJob.reward }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const frameworks = [
  { id: "cargo", name: "Cargo Runs" },
  { id: "military", name: "Military Missions" },
  { id: "expeditions", name: "Expeditions" },
];

const selectedFramework = ref(null);
const generatedJob = ref(null);

const cargoData = {
  jobTypes: [
    { difficulty: "Routine", destination: "Within system", baseReward: 20 },
    { difficulty: "Routine", destination: "Within system", baseReward: 20 },
    { difficulty: "Routine", destination: "Nearby system", baseReward: 20 },
    { difficulty: "Easy", destination: "Nearby system", baseReward: 30 },
    { difficulty: "Easy", destination: "Nearby system", baseReward: 30 },
    { difficulty: "Easy", destination: "Nearby system", baseReward: 30 },
    { difficulty: "Normal", destination: "Nearby system", baseReward: 25 },
    { difficulty: "Normal", destination: "Nearby system", baseReward: 25 },
    { difficulty: "Normal", destination: "Faraway system", baseReward: 25 },
    { difficulty: "Normal", destination: "Faraway system", baseReward: 25 },
    { difficulty: "Difficult", destination: "Within system", baseReward: 50 },
    { difficulty: "Difficult", destination: "Nearby system", baseReward: 50 },
    { difficulty: "Difficult", destination: "Nearby system", baseReward: 50 },
    { difficulty: "Difficult", destination: "Faraway system", baseReward: 60 },
    { difficulty: "Difficult", destination: "Faraway system", baseReward: 60 },
  ],
  employers: [
    "Colony Representative",
    "Colonial Administration",
    "Mining Company",
    "Major Corporation",
    "Military Officer",
    "Shipping Corporation",
    "Finance Bank",
    "Wealthy Individual",
  ],
  goods: [
    "Industrial gases (propylene, acetylene, etc.)",
    "Metal ingots or pellets",
    "Colonists in stasis",
    "Timber from alien worlds",
    "Ice / Water",
    "Industrial chemicals",
    "Fertilizer",
    "Oil and petroleum by-products",
    "Foodstuff (grains, legumes, etc.)",
    "Ore (bauxite, galena, etc.)",
    "Medicinal goods and vaccines",
    "Technical parts",
    "Pressure suits",
    "Single oversized item",
    "Vehicles",
    "Weapons & armor",
    "Radioactive materials",
    "Colony construction materials",
    "Animal feed",
    "Livestock in stasis",
    "Wreckage / Salvage",
  ],
  destinations: [
    "Only Coordinates",
    "Hostile Forest/Jungle/Desert",
    "Mine",
    "Spaceport",
    "Asteroid/Moon",
    "Space Station",
    "Earth",
    "Young Colony",
    "Established Colony",
    "Starship",
    "Outpost",
  ],
  complications: [
    "Embargo/Quarantine - The destination is under quarantine or embargo",
    "Intermission - Ship drops from hyperspace early, crew is awakened",
    "Military - Military vessel conducts a search and customs check",
    "Delay - Lift-off or undocking is delayed",
    "Maintenance - Critical part requires replacement",
    "Waiting game - Problems at destination prevent cargo acceptance",
    "Cargo mishap - Cargo is moving, leaking, overheating, or catching fire",
    "Wreckage - A piece of wreckage is spotted on sensors",
  ],
  rewards: [
    "Discount on new cargo",
    "New, guaranteed contract",
    "Monetary reward",
    "Ship module/feature",
    "Faction contact",
    "Debt cancellation or credit granted",
  ],
};

const militaryData = {
  missions: [
    "Recon - Scout a location and gather intelligence",
    "Assault - Attack and hold an objective by force",
    "Defense - Defend a location/person/group and repel attacks",
    "Combat Patrol - Patrol an area looking for signs of the enemy",
    "Sabotage - Infiltrate and destroy a key asset",
    "Raid - Create chaos by attacking targets of opportunity",
    "Search and Rescue - Locate and rescue downed personnel",
    "Peace-Keeping - Quell riots and restore order",
    "Bug Hunt - Exterminate alien life threatening colonists",
    "Civil Evacuation - Rescue populations from crisis",
    "Space Assault - Capture or recapture a vessel by boarding",
    "Space Traffic Security - Conduct customs checks on civilian ships",
    "Snatch and Grab - Seize an item or person from behind enemy lines",
    "Investigation - Investigate a station not responding to communications",
  ],
  objectives: [
    "Established or young colony",
    "Isolated research station or military outpost",
    "Enemy starship or abandoned vessel",
    "Orbital space station or transfer station",
    "Wilderness location far from civilization",
    "Planetary war zone with fortifications",
    "Isolated spaceport far from any colony",
    "Scattered colonial homesteads",
    "Mine and refinery complex",
    "Prison complex",
    "Radar/Sensor site",
    "Impenetrable area (jungle, caverns, lava fields)",
  ],
  complications: [
    "Role Reversal - The bad guys are actually good guys",
    "Passengers - Marines must guard/protect enemy prisoners or civilians",
    "Observer - Team saddled with reporter/cameraman or senior officer",
    "Company Meddling - Corporate rep joins to protect company assets",
    "Civilian Advisor - Non-military advisor who may panic easily",
    "Captured - An NPC or PC is captured by hostile forces",
    "Gear Problems - Faulty gear (weapons, ammo, sensors, vehicles)",
    "Tough Resistance - Opponents far tougher than expected",
    "Trapped - Team discovers it is completely trapped",
    "Under Fire! - Mission location hit by air-strike or heavy weapons",
    "Glory Hound - Eager officer pushes squad into perilous situations",
    "Traps - Hidden dangers (mines, IEDs, booby traps)",
    "Restrictions - Tactical restrictions on actions and weapons",
    "Rookie Commander - Green, untested lieutenant in command",
  ],
  rewards: [
    "Faction Contact",
    "Ship Module",
    "New Gear",
    "New Weapon",
    "Monetary Reward",
    "Bronze or Silver Star",
  ],
};

const expeditionData = {
  missions: [
    "Salvage - Recover items from abandoned/destroyed ship or station",
    "Survey - Map a location and report with sensor data",
    "Mining - Conduct test-mining to determine viability",
    "Colony Assistance - Assist startup colony with gear/knowledge",
    "Prospecting - Command prospecting expedition or secure claim",
    "Data Collection - Find specific information for employer",
    "Courier - Deliver sensitive goods safely without delay",
    "Anomaly Exploration - Investigate unique phenomenon",
    "Rescue Expedition - Rescue group from attack or peril",
  ],
  targetAreas: [
    "Abandoned orbital station",
    "Rogue asteroid",
    "Abandoned mine",
    "Moon",
    "Asteroid belt",
    "Colonized world wilderness",
    "Terrestrial planet",
    "Abandoned colony",
    "Ice planet",
    "Wreckage of spacecraft",
    "Comet near star",
  ],
  complications: [
    "Natural Phenomenon - Severe natural event occurs",
    "Survey Blues - Target area difficult to locate or survey",
    "Presumed Missing - Permit inherited from vanished expedition",
    "Rival Expedition - Competing party with same goal",
    "Quarantine - Target area under quarantine or off-limits",
    "Deadly Treasure - Terrible objects exist in target area",
    "Surveillance - Expedition under surveillance by military/government",
  ],
  rewards: [
    "Funds for an expedition of their own",
    "Ship module",
    "Monetary reward",
    "Contract with a mining company",
    "Gear",
    "Knowledge to use or sell",
  ],
};

const plotTwists = [
  "Mayday - Distress signal received, crew must assist",
  "Bad Intel - Key mission information proves false",
  "Sabotage - Malfunction quickly revealed to be sabotage",
  "Secret Plot - NPCs have hidden agenda counter to players",
  "Murder - An NPC is suddenly murdered",
  "Flare Event - Stellar radiation causes power/comm blackouts",
  "Malfunction - Key mission component fails when needed",
  "Time Limit - Mission has deadline, lives depending on it",
  "Alien Outbreak - Xenomorph XX121 presence in area",
];

function selectFramework(frameworkId) {
  selectedFramework.value = frameworkId;
  generatedJob.value = null;
}

function rollDice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateJob() {
  const job = {};

  if (selectedFramework.value === "cargo") {
    const jobType = getRandomItem(cargoData.jobTypes);
    job.jobType = jobType.difficulty;
    job.destination = jobType.destination;

    job.baseReward = jobType.baseReward;

    job.employer = getRandomItem(cargoData.employers);
    job.description = `Cargo Run: Transport ${getRandomItem(cargoData.goods)}`;
    job.objective = getRandomItem(cargoData.destinations);
    job.complication = getRandomItem(cargoData.complications);
    job.reward = getRandomItem(cargoData.rewards);
  } else if (selectedFramework.value === "military") {
    job.jobType = getRandomItem(militaryData.missions);
    job.objective = getRandomItem(militaryData.objectives);
    job.complication = getRandomItem(militaryData.complications);
    job.baseReward = rollDice(20, 60);
    job.description = "Colonial Marines Mission";
    job.employer = "Colonial Administration / Military Command";
    job.reward = getRandomItem(militaryData.rewards);
  } else if (selectedFramework.value === "expeditions") {
    job.jobType = getRandomItem(expeditionData.missions);
    job.objective = getRandomItem(expeditionData.targetAreas);
    job.complication = getRandomItem(expeditionData.complications);
    job.baseReward = rollDice(20, 60);
    job.description = "Exploration Expedition";
    job.employer = getRandomItem([
      "Colonial Administration",
      "Scientist",
      "Group of Investors",
      "Corporate Representative",
      "Company Mining Rep",
      "Government Rep",
    ]);
    job.reward = getRandomItem(expeditionData.rewards);
  }

  job.plotTwist = getRandomItem(plotTwists);

  generatedJob.value = job;
}
</script>
