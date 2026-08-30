<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="text-center mb-12 space-y-3">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Alien RPG Tools</h1>
      <p class="text-xl text-gray-600 dark:text-gray-300">
        A suite of generators and calculators for the Alien RPG tabletop game
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Compatible with both the original Alien RPG and the Evolved Edition
      </p>
      <p class="text-gray-600 dark:text-gray-400">
        By
        <a
          href="https://www.tiesthatbindgaming.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          Ties That Bind Gaming
        </a>
      </p>
    </div>

    <!-- Tools Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <div
        v-for="tool in tools"
        :key="tool.id"
        class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow flex flex-col"
      >
        <div class="mb-4">
          <div class="text-4xl mb-3">
            {{ tool.icon }}
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {{ tool.name }}
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-6 flex-1">
          {{ tool.description }}
        </p>
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          @click="$emit('navigate', tool.id)"
        >
          Open {{ tool.name }} →
        </button>
      </div>
    </div>

    <!-- Features Section -->
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">✨</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Fast Generation</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Quickly generate content for your sessions without delays
            </p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">🎲</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Rules-Based</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Follows official Alien RPG mechanics and rules
            </p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">🌓</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Dark Mode Support</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Easy on the eyes with full dark mode support
            </p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">💾</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">No Account Needed</h3>
            <p class="text-gray-600 dark:text-gray-400">Everything runs locally in the app</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">📱</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Responsive Design</h3>
            <p class="text-gray-600 dark:text-gray-400">Works seamlessly on desktop and mobile</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">⚙️</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Desktop &amp; Browser</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Available as a native desktop app and playable in the browser
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Diegetic Simulators Section -->
    <div
      class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700 mt-12"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <!-- Text Content -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Also Check Out: Diegetic Simulators
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            <strong>Diegetic Simulators</strong> gives your players terminals and databases they
            operate directly, at the table or remotely. Boot up a colony control station, a ship's
            computer, or a research archive and let the crew read logs, run diagnostics, lock doors,
            and trigger alarms as if they were really there.
          </p>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Perfect for adding atmosphere and hands-on immersion to your Alien RPG sessions.
          </p>
          <a
            href="https://diegeticsimulators.com"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Visit Diegetic Simulators →
          </a>
        </div>

        <!-- Image -->
        <div class="flex justify-center lg:justify-end">
          <img
            :src="diegeticSimulatorsImage"
            alt="Diegetic Simulators interface"
            class="rounded-lg shadow-md w-full h-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import diegeticSimulatorsImage from "../../public/diegetic-simulators.webp";

defineEmits(["navigate"]);

const tools = [
  {
    id: "star-system-generator",
    name: "Star System Generator",
    icon: "🌌",
    description:
      "Generate complete star systems, planets, and colonies with rules-based detail for your explorations.",
  },
  {
    id: "space-travel-tool",
    name: "Space Travel Tool",
    icon: "🚀",
    description:
      "Calculate FTL travel time, crew pay periods, and hypersleep event rolls from a ship's FTL rating and distance.",
  },
  {
    id: "combat-tracker",
    name: "Combat Tracker",
    icon: "⚔️",
    description:
      "Track initiative order, health, and status effects for every combatant in a fight.",
  },
  {
    id: "contract-cargo-generator",
    name: "Contract & Cargo Generator",
    icon: "📦",
    description:
      "Roll a full space trucker job: employer, cargo, destination, pay, complications and a plot twist.",
  },
  {
    id: "panic-tool",
    name: "Stress & Panic Tool",
    icon: "😰",
    description:
      "Roll stress dice and resolve Panic results for the crew, following the Alien RPG panic table.",
  },
  {
    id: "npc-generator",
    name: "NPC Generator",
    icon: "🧑‍🚀",
    description:
      "Roll a table-ready NPC: full statblock plus name, appearance, trait and goal from the career tables.",
  },
  {
    id: "creature-generator",
    name: "Creature Generator",
    icon: "👽",
    description:
      "Pull an alien statblock with its D6 signature attack table, or build a new creature on the same chassis.",
  },
  {
    id: "ship-generator",
    name: "Ship Generator",
    icon: "🛸",
    description:
      "Build a ship from the class table with a legal module loadout and costs, or pull a named ship from the books.",
  },
  {
    id: "supply-salvage-generator",
    name: "Supply & Salvage Generator",
    icon: "🔧",
    description:
      "Search a wreck for real gear: weight, cost, supply ratings, haul value, plus a supply roll panel.",
  },
];
</script>
