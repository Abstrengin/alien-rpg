<script setup lang="ts">
/**
 * AlienRPGSpaceTravel.vue
 * FTL travel time calculator for the ALIEN RPG.
 *
 * Formula (from the original site's ftl-calculator.js):
 *   days  = ftlRating × parsecs
 *   tasks = Math.floor(days / 7)  — both pay periods and skill roll count
 */
import { ref, computed } from 'vue';

const ftlRating = ref<number | ''>('');
const parsecs = ref<number | ''>('');

const days = computed(() => {
  const r = Number(ftlRating.value);
  const p = Number(parsecs.value);
  if (!r || !p || r <= 0 || p <= 0) return null;
  return r * p;
});

const tasks = computed(() => {
  if (days.value === null) return null;
  return Math.floor(days.value / 7);
});

function reset() {
  ftlRating.value = '';
  parsecs.value = '';
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-[0.375rem]">
        <label
          for="ftl-rating"
          class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >FTL Rating</label
        >
        <input
          id="ftl-rating"
          v-model.number="ftlRating"
          type="number"
          class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          min="1"
          max="5"
          step="1"
          placeholder="e.g. 2"
          aria-describedby="ftl-hint"
        />
        <span
          id="ftl-hint"
          class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >The ship's FTL drive rating (typically 1–5)</span
        >
      </div>

      <div class="flex flex-col gap-[0.375rem]">
        <label
          for="parsec-count"
          class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >Distance (parsecs)</label
        >
        <input
          id="parsec-count"
          v-model.number="parsecs"
          type="number"
          class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          min="1"
          step="1"
          placeholder="e.g. 4"
        />
      </div>
    </div>

    <!-- Results -->
    <div
      v-if="days !== null"
      class="grid [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] gap-[0.875rem]"
    >
      <div
        class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Total Travel Time</span
        >
        <span class="text-[1.75rem] leading-none font-extrabold text-[var(--color-brand-red-light)]"
          >{{ days }}
          <span
            class="text-[0.9rem] font-medium text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >days</span
          ></span
        >
      </div>
      <div
        class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Pay Periods</span
        >
        <span class="text-[1.75rem] leading-none font-extrabold text-[var(--color-brand-red-light)]"
          >{{ tasks }}
          <span
            class="text-[0.9rem] font-medium text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >weeks</span
          ></span
        >
        <span
          class="mt-[0.125rem] text-[0.7rem] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >Crew pay due every 7 days</span
        >
      </div>
      <div
        class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Hypersleep Event Rolls</span
        >
        <span
          class="text-[1.75rem] leading-none font-extrabold text-[var(--color-brand-red-light)]"
          >{{ tasks }}</span
        >
        <span
          class="mt-[0.125rem] text-[0.7rem] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >One roll per week of travel</span
        >
      </div>

      <button
        type="button"
        class="col-[1/-1] cursor-pointer self-start rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-[0.8rem] text-[var(--color-text-secondary-dark)] transition-[border-color,color] duration-[120ms] ease-out hover:border-[var(--color-brand-primary)] hover:text-[var(--color-text-primary-dark)] [.light_&]:hover:text-[var(--color-text-primary-light)]"
        @click="reset"
      >
        Reset
      </button>
    </div>

    <div
      v-else
      class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-6 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <p>Enter an FTL rating and distance to calculate travel time.</p>
    </div>
  </div>
</template>
