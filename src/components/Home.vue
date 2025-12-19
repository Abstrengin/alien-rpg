<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Alien RPG Tools
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
        A comprehensive suite of generators and calculators for the Alien RPG
        tabletop game
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <!-- Encounters Card -->
      <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
      >
        <div class="mb-4">
          <div class="text-4xl mb-3">⚔️</div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Encounters
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Generate tactical encounters, environmental hazards, and ship
          encounters for your campaigns. Perfect for creating challenging
          scenarios that keep your players on their toes.
        </p>
        <button
          @click="$emit('navigate', 'encounters')"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Open Encounters →
        </button>
      </div>

      <!-- Jobs Card -->
      <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
      >
        <div class="mb-4">
          <div class="text-4xl mb-3">💼</div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Jobs
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Create engaging job opportunities for your crew. Generate cargo runs,
          military missions, and exploration expeditions with unique objectives
          and complications.
        </p>
        <button
          @click="$emit('navigate', 'job-generator')"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Open Jobs →
        </button>
      </div>

      <!-- Space Travel Card -->
      <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
      >
        <div class="mb-4">
          <div class="text-4xl mb-3">🚀</div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Space Travel
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Calculate travel times, crew paychecks, and maintenance schedules for
          your starship. Keep track of fuel consumption and operational costs
          across the galaxy.
        </p>
        <button
          @click="$emit('navigate', 'space-travel')"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Open Space Travel →
        </button>
      </div>

      <!-- Star Systems Card -->
      <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
      >
        <div class="mb-4">
          <div class="text-4xl mb-3">🌌</div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Star Systems
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Generate complete star systems, planets, and colonies. Create detailed
          worlds with unique characteristics and settlement details for your
          explorations.
        </p>
        <button
          @click="$emit('navigate', 'alien-rpg')"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Open Star Systems →
        </button>
      </div>
    </div>

    <!-- Features Section -->
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Features
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">✨</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Fast Generation
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Quickly generate content for your sessions without delays
            </p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">🎲</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Rules-Based
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Follows official Alien RPG mechanics and rules
            </p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">🌓</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Dark Mode Support
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Easy on the eyes with full dark mode support
            </p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">💾</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Local Storage
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              All data stored locally - no account needed
            </p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">📱</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Responsive Design
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Works seamlessly on desktop and mobile
            </p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="text-2xl mt-1">⚙️</div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Desktop App
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Available as a native desktop application
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Terminal Simulator Section -->
    <div
      class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700 mt-12"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <!-- Text Content -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Also Check Out: Alien RPG Terminal Simulator
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Beyond our tools and generators, Ties That Bind Gaming offers a
            <strong>Terminal Simulator</strong> - an authentic interface tool
            designed to complement Alien RPG campaigns. Create immersive colony
            control stations, spaceship controls, information hubs, and
            emergency systems that make your players feel like they're truly
            commanding real installations in the cold depths of space.
          </p>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Perfect for adding atmosphere to your sessions with realistic
            terminal interfaces, system controls, and interactive elements.
          </p>
          <a
            href="https://terminal.tiesthatbindgaming.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Visit Terminal Simulator →
          </a>
        </div>

        <!-- Image -->
        <div class="flex justify-center lg:justify-end">
          <img
            :src="terminalSimulatorImage"
            alt="Alien RPG Terminal Simulator Interface"
            class="rounded-lg shadow-md w-full h-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import terminalSimulatorImage from "../../public/terminal-simulator.webp";

defineEmits(["navigate"]);
</script>
