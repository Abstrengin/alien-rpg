<template>
  <div class="max-w-7xl mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About Alien RPG Tools</h2>

      <div class="space-y-4 text-base">
        <p>
          <strong>Alien RPG Tools</strong> is a suite of generators and calculators for the Alien
          RPG tabletop game by
          <a
            href="https://www.tiesthatbindgaming.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ties That Bind Gaming </a
          >. The same tools run on the Ties That Bind Gaming website; this app bundles them for
          offline desktop use and in-browser play.
        </p>

        <p>
          The generators are compatible with both the original
          <strong>Alien RPG</strong> and the <strong>Evolved Edition</strong>.
        </p>

        <div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Included Tools:</h3>
          <ul class="list-disc list-inside space-y-1">
            <li>
              <strong>Star System Generator</strong> - Complete star systems, planets, and colonies
            </li>
            <li>
              <strong>Space Travel Tool</strong> - FTL travel time, pay periods, and hypersleep
              event rolls
            </li>
            <li>
              <strong>Combat Tracker</strong> - Initiative, health, and status for every combatant
            </li>
            <li>
              <strong>Contract &amp; Cargo Generator</strong> - Freighter contracts, cargo, pay, and
              complications
            </li>
            <li>
              <strong>Stress &amp; Panic Tool</strong> - Stress rolls and Panic table resolution
            </li>
            <li><strong>NPC Generator</strong> - Careers, motivations, and hidden agendas</li>
            <li>
              <strong>Creature Generator</strong> - Original alien threats with attacks and
              abilities
            </li>
            <li><strong>Ship Generator</strong> - Ship class, condition, crew, and cargo</li>
            <li>
              <strong>Supply &amp; Salvage Generator</strong> - Supplies and salvage from derelicts
              and wrecks
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Version Information:
          </h3>
          <p>
            Version:
            <span class="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{{
              APP_VERSION
            }}</span>
          </p>
        </div>

        <div class="pt-4">
          <p>
            <a
              href="https://www.tiesthatbindgaming.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Visit Ties That Bind Gaming →
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 pb-8 text-gray-900 dark:text-gray-100">
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Diegetic Simulators</h2>

      <div class="space-y-4 text-base">
        <p>
          <strong>Diegetic Simulators</strong> gives your players terminals and databases they
          operate directly, at the table or remotely. Boot up a colony control station, a ship's
          computer, or a research archive and let the crew read logs, run diagnostics, lock doors,
          and trigger alarms as if they were really aboard.
        </p>

        <div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Good For Alien RPG:
          </h3>
          <ul class="list-disc list-inside space-y-1">
            <li>
              <strong>Ship &amp; station systems</strong> - Navigation, life support, comms, and
              power as interactive panels
            </li>
            <li>
              <strong>Facility control</strong> - Doors, alarms, and security protocols the players
              actually operate
            </li>
            <li>
              <strong>Databases &amp; logs</strong> - Personnel files, incident reports, and mission
              data to dig through
            </li>
            <li>
              <strong>Remote play</strong> - Everyone sees the same terminal state in real time
            </li>
          </ul>
        </div>

        <div class="pt-4">
          <p>
            <a
              href="https://diegeticsimulators.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Explore Diegetic Simulators →
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer / Copyright Section -->
  <div class="max-w-7xl mx-auto px-4 pb-8 text-gray-900 dark:text-gray-100">
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700"
    >
      <div class="dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          © 2026 Ties That Bind Gaming™. All rights reserved.
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          This is a fan-made tool for Alien RPG and is not officially affiliated with Free League
          Publishing.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { APP_VERSION } from "@/shared/version.js";
</script>
