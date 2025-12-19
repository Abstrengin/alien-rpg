<template>
  <div class="text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <!-- Header Section -->
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 pt-6 mb-8 border border-gray-200 dark:border-gray-700"
    >
      <div
        class="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-gray-300 dark:border-gray-700"
      >
        <div class="flex-1">
          <h2 class="mb-0 text-2xl font-bold text-gray-900 dark:text-white">
            Space Travel Calculator
          </h2>
        </div>
      </div>

      <!-- Form Section -->
      <form
        id="ae-ftl-calculator"
        ref="aeFtlCalculator"
        class="space-y-6 pb-6"
      >
        <fieldset class="space-y-4">
          <div>
            <label
              for="ae-ftl-rating"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              What is the ship's <strong>FTL Rating</strong>?
            </label>
            <div class="flex gap-2">
              <button
                type="button"
                class="px-4 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold rounded-lg transition-colors"
                @click="
                  ftlRating = Math.max(0, ftlRating - 1);
                  calculateTotals();
                "
              >
                −
              </button>
              <input
                id="ae-ftl-rating"
                v-model.number="ftlRating"
                type="number"
                name="ae-ftl-rating"
                class="block flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 font-medium text-center"
                min="0"
                placeholder="0"
                @input="calculateTotals"
              >
              <button
                type="button"
                class="px-4 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold rounded-lg transition-colors"
                @click="
                  ftlRating++;
                  calculateTotals();
                "
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label
              for="ae-parsecs"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              How many <strong>Parsecs</strong> has the ship traveled?
            </label>
            <div class="flex gap-2">
              <button
                type="button"
                class="px-4 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold rounded-lg transition-colors"
                @click="
                  parsecs = Math.max(0, parsecs - 1);
                  calculateTotals();
                "
              >
                −
              </button>
              <input
                id="ae-parsecs"
                v-model.number="parsecs"
                type="number"
                name="ae-parsecs"
                class="block flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 font-medium text-center"
                min="0"
                placeholder="0"
                @input="calculateTotals"
              >
              <button
                type="button"
                class="px-4 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold rounded-lg transition-colors"
                @click="
                  parsecs++;
                  calculateTotals();
                "
              >
                +
              </button>
            </div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 italic">
            Note: You can overcharge the engines to travel faster. Core
            Rulebook: Page 167.
          </p>
        </fieldset>
      </form>
    </div>

    <!-- Results Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      <!-- Travel Card -->
      <div
        class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200 flex flex-col"
      >
        <div
          class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
        >
          <p
            class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
          >
            Travel
          </p>
        </div>
        <div class="px-5 py-4 flex-grow">
          <div v-if="calculateTravel > 0">
            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{
              calculateTravel
            }}</span>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              total days of travel
            </p>
          </div>
          <div
            v-else
            class="text-gray-500 dark:text-gray-400 italic"
          >
            Please enter FTL Rating and Parsecs Traveled
          </div>
        </div>
        <div
          class="border-t border-gray-200 dark:border-gray-700 px-5 py-3 bg-gray-50 dark:bg-gray-800"
        >
          <p class="text-xs text-gray-500 dark:text-gray-500 italic mb-0">
            Core Rulebook: Page 167
          </p>
        </div>
      </div>

      <!-- Paycheck Card -->
      <div
        class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200 flex flex-col"
      >
        <div
          class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
        >
          <p
            class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
          >
            Paycheck
          </p>
        </div>
        <div class="px-5 py-4 flex-grow">
          <div
            v-if="calculatePaycheck <= 0"
            class="text-gray-500 dark:text-gray-400 italic"
          >
            No Paychecks so far
          </div>
          <div v-else-if="calculatePaycheck == 1">
            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{
              calculatePaycheck
            }}</span>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              paycheck for players
            </p>
          </div>
          <div v-else>
            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{
              calculatePaycheck
            }}</span>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              paychecks for players
            </p>
          </div>
        </div>
        <div
          class="border-t border-gray-200 dark:border-gray-700 px-5 py-3 bg-gray-50 dark:bg-gray-800"
        >
          <p class="text-xs text-gray-500 dark:text-gray-500 italic mb-0">
            Core Rulebook: Pages 161-162
          </p>
        </div>
      </div>

      <!-- Ship Maintenance Card -->
      <div
        class="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 h-full shadow hover:shadow-md transition-shadow duration-200 flex flex-col"
      >
        <div
          class="border-b border-blue-100 dark:border-gray-700 px-5 py-4 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-transparent"
        >
          <p
            class="mb-0 text-sm font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wide"
          >
            Ship Maintenance
          </p>
        </div>
        <div class="px-5 py-4 flex-grow">
          <div v-if="calculateShipMaintenance">
            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{
              calculateShipMaintenance
            }}</span>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Comtech and Heavy Machinery Rolls needed to check for ship damage.
            </p>
          </div>
          <div
            v-else
            class="text-gray-500 dark:text-gray-400 italic"
          >
            No Ship Maintenance needed
          </div>
        </div>
        <div
          class="border-t border-gray-200 dark:border-gray-700 px-5 py-3 bg-gray-50 dark:bg-gray-800"
        >
          <p class="text-xs text-gray-500 dark:text-gray-500 italic mb-0">
            Core Rulebook: Page 179
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";

const ftlRating = ref(0);
const parsecs = ref(0);
const aeFtlCalculator = ref(null);

const calculateTravel = computed(() => {
  return Math.floor(ftlRating.value * parsecs.value);
});

const calculatePaycheck = computed(() => {
  return Math.floor(calculateTravel.value / 7);
});

const calculateShipMaintenance = computed(() => {
  return Math.floor(calculateTravel.value / 7);
});

const calculateTotals = () => {
  // Computed properties auto-update
};
</script>
