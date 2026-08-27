<script setup lang="ts">
/**
 * AlienRPGShipGenerator.vue
 * Ship generator for Alien RPG and Alien RPG – Evolved Edition (Free League Publishing).
 * Core uses the Core Rulebook spacecraft framework (Chapter 9: hull class, Hull Integrity, FTL Rating, Ship Points).
 * Evolved Edition uses hull-class data derived from the named ships in that book (pages 128–141): Hull, FTL Rating,
 * Signature, Thrusters, and Armor Level. No explicit class-stat table extracts from the source PDF as text, so these
 * ranges are built from the seven ship stat blocks actually printed in the book.
 * Quirk, history, and current-job prompts are original TTBG content, shared between editions.
 */
import { ref } from 'vue';

function d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}
function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}
function rollRange([min, max]: [number, number]): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// ─── Hull classes: Core Rulebook (spacecraft framework) ────────────────────

interface HullClassCore {
  class: string;
  tier: number;
  hullIntegrity: number;
  shipPoints: number;
  ftlRatingRange: [number, number];
  crewRange: string;
  cargoTons: string;
  description: string;
  examples: string;
}

const HULL_CLASSES_CORE: HullClassCore[] = [
  {
    class: 'Personal Transport',
    tier: 1,
    hullIntegrity: 2,
    shipPoints: 4,
    ftlRatingRange: [1, 3],
    crewRange: '1–4',
    cargoTons: '1–5',
    description:
      'Compact, owner-operated craft. Holds a small crew with minimal cargo. Built for speed and low profile.',
    examples: 'Scout runabout, personal courier, modified shuttle',
  },
  {
    class: 'Light Freighter',
    tier: 2,
    hullIntegrity: 3,
    shipPoints: 6,
    ftlRatingRange: [1, 4],
    crewRange: '2–6',
    cargoTons: '10–50',
    description:
      'The working backbone of independent space trade. Enough cargo to turn a profit; small enough to stay nimble.',
    examples: 'Tramp freighter, charter hauler, survey ship',
  },
  {
    class: 'Medium Transport',
    tier: 3,
    hullIntegrity: 4,
    shipPoints: 8,
    ftlRatingRange: [1, 4],
    crewRange: '4–12',
    cargoTons: '100–500',
    description:
      'Mid-tier commercial vessel. Runs regular routes between established systems. Enough crew to fill a manifest.',
    examples: 'Colonial transport, military supply ship, science vessel',
  },
  {
    class: 'Heavy Freighter',
    tier: 4,
    hullIntegrity: 6,
    shipPoints: 10,
    ftlRatingRange: [2, 4],
    crewRange: '6–20',
    cargoTons: '1,000–10,000',
    description:
      'Built for volume, not speed. Takes the bulk contracts that smaller ships cannot handle. Moving it is a commitment.',
    examples: 'Bulk ore hauler, cattle freighter, industrial supply ship',
  },
  {
    class: 'Patrol / Escort',
    tier: 3,
    hullIntegrity: 5,
    shipPoints: 8,
    ftlRatingRange: [2, 5],
    crewRange: '4–15',
    cargoTons: '10–30',
    description:
      'Fast, armed, and built to keep up with or deter trouble. Used by military, corporate security, and colonial marshals.',
    examples: 'Patrol craft, escort corvette, colonial marshal ship',
  },
  {
    class: 'Colony Ship',
    tier: 5,
    hullIntegrity: 8,
    shipPoints: 14,
    ftlRatingRange: [2, 3],
    crewRange: '20–200+',
    cargoTons: '50,000+',
    description:
      'Designed to carry entire populations to new settlements. Cryo units, supplies, and equipment for a world from scratch.',
    examples: 'Colony transport, generation ship, terraforming vessel',
  },
];

// ─── Hull classes: Evolved Edition (derived from named ships, pp. 128–141) ─

interface HullClassEvolved {
  class: string;
  subtitle: string;
  hullRange: [number, number];
  ftlRange: [number, number];
  signature: number;
  thrusters: number;
  armorLevelRange: [number, number];
  crewRange: string;
  description: string;
  examples: string;
}

const HULL_CLASSES_EVOLVED: HullClassEvolved[] = [
  {
    class: 'C-Class',
    subtitle: 'Light Intrasystem Vessel',
    hullRange: [1, 3],
    ftlRange: [13, 18],
    signature: -1,
    thrusters: 2,
    armorLevelRange: [0, 0],
    crewRange: '1–2',
    description:
      'Small short-range craft built for in-system hops, not interstellar runs. Cheap, fast, and easy to miss on sensors.',
    examples: 'Scout shuttle, courier runabout, orbital tender',
  },
  {
    class: 'G-Class',
    subtitle: 'Light Commercial Vessel',
    hullRange: [5, 6],
    ftlRange: [18, 22],
    signature: 0,
    thrusters: 1,
    armorLevelRange: [1, 1],
    crewRange: '3–6',
    description:
      'Workhorse commercial hull for ore runs, salvage contracts, and light hauling. Slow FTL but durable enough for the job.',
    examples: 'Ore transport, salvage tug, light cargo hauler',
  },
  {
    class: 'M-Class',
    subtitle: 'Heavy Commercial Vessel',
    hullRange: [8, 10],
    ftlRange: [5, 14],
    signature: 1,
    thrusters: 1,
    armorLevelRange: [0, 1],
    crewRange: '6–7',
    description:
      'Large interstellar starfreighter. Bigger crew, deep cargo holds, and an FTL drive fast enough for long-haul company contracts.',
    examples: 'Starfreighter, towing vessel, deep-space transport',
  },
  {
    class: 'Military / Patrol',
    subtitle: 'Combat or Escort Vessel',
    hullRange: [10, 14],
    ftlRange: [1, 4],
    signature: 0,
    thrusters: 1,
    armorLevelRange: [2, 3],
    crewRange: '10–20',
    description:
      'Armed and armored vessel built for troop transport, escort duty, or direct engagement. Hard to sneak past and harder to bring down.',
    examples: 'Troop transport frigate, escort corvette, colonial marshal cutter',
  },
];

// ─── Condition (original TTBG, shared between editions) ───────────────────

interface ConditionEntry {
  label: string;
  hullMod: number;
  description: string;
}

const CONDITIONS: ConditionEntry[] = [
  {
    label: 'New',
    hullMod: 1,
    description: 'Fresh off the yard. Everything works. Conspicuous; people notice.',
  },
  {
    label: 'Good',
    hullMod: 0,
    description: 'Well-maintained. Minor cosmetic wear. No surprises.',
  },
  {
    label: 'Worn',
    hullMod: 0,
    description: 'Operational but tired. Patch jobs visible. One or two systems need watching.',
  },
  {
    label: 'Damaged',
    hullMod: -1,
    description: 'Something is wrong and not fully fixed. The crew knows which systems to avoid.',
  },
  {
    label: 'Derelict',
    hullMod: -2,
    description:
      'Barely holding together. Moving it is an adventure by itself. No one is going to lend you parts.',
  },
] as const;

// ─── Ship quirks (original TTBG) ──────────────────────────────────────────

const QUIRKS = [
  'The AI assistant responds in clipped military diction regardless of what role it is supposed to fill.',
  'One cargo hold has been permanently sealed from the inside. The logs say it was empty when it was closed.',
  'The ship ran under a different registry until eighteen months ago. The old name is still faintly visible under the paint on the port side.',
  'Life support fluctuates slightly in the forward crew quarters, never enough to be dangerous but always enough to notice.',
  'The navigation system works perfectly but takes twice as long as it should to confirm jump calculations.',
  'There is a crew bunk that is always slightly warmer than the others. No one sleeps there by choice.',
  'Emergency lighting triggers randomly at 0300 regardless of current alerts or power status.',
  'The cargo manifest system is out of sync with physical storage by exactly four items. They are never the same four items.',
  'The ship has an unofficial callsign the crew uses. The company does not know it exists.',
  'One of the external cameras has been angled to avoid a specific section of the hull. No work order exists for the adjustment.',
  'The engines produce a harmonic at a particular thrust level. Engineers say it is fine. Everyone else has learned to sleep through it.',
  'The most recent hull inspection passed with no findings. The previous owner signed it. The previous owner is no longer reachable.',
  'The ship has a reputation in one specific port. Not necessarily bad. Just a reputation.',
  'The emergency transponder was replaced recently. The replacement is not the same model as the original spec.',
  'One airlock takes three confirmation presses instead of two to cycle. Nobody knows when that changed.',
] as const;

// ─── Ship history (original TTBG) ─────────────────────────────────────────

const HISTORIES = [
  'Originally commissioned for a military contract that was cancelled before delivery. Sold through a salvage auction.',
  'Was involved in an incident that is in the public record but redacted down to a date and a hull registration.',
  'Changed hands four times in six years, always through a broker, never owner-to-owner.',
  'Completed a long-haul colonial run that took longer than the original schedule. The deviation was never formally explained.',
  'Was flagged for inspection twice in the same calendar year. Both inspections were cleared. Both were conducted by the same inspector.',
  'Held by a single family for two generations before corporate acquisition. Some personal modifications were never removed.',
  'Used as a company asset for a classified survey operation. Survey results are not on file anywhere the current crew can access.',
  'Was reported overdue at its last scheduled port. Arrived twenty-two days late. The delay is listed as "navigational" in the log.',
  'Was the sister ship to a vessel that was lost with all hands. They share the same hull design. People at certain ports notice.',
  'Served as a medical transport for three years. The surgical bay was converted to cargo space. The conversion was thorough but not complete.',
  'Has a set of coordinates hard-coded into a secondary navigation memory that no one has been able to delete.',
  'Was in drydock for an unusually long period. The repair manifest lists standard maintenance. The time does not match the work.',
] as const;

// ─── Current job context (original TTBG) ──────────────────────────────────

const CURRENT_JOBS = [
  'Contracted for a routine freight run. Origin and destination confirmed; nothing about the manifest is unusual until you actually look at it.',
  "On charter to a private client who has not boarded yet. The advance is paid. The client's name does not pull any public records.",
  'Survey assignment in a system that was flagged low-priority eighteen months ago and then flagged again by a different department last week.',
  'Running a resupply loop to a station that has been progressively cutting its order volume for three cycles.',
  'Medical evacuation tasking. Passenger count listed, crew manifest not. Departure window is six hours.',
  'Repossession job. The vessel being collected belongs to someone who knows it is coming.',
  'Returning from a run with a cargo hold that is lighter than it left. The paperwork says delivery completed. No one at the destination recalls signing.',
  'Standing by at a company staging point. No assignment yet. The waiting has been going on longer than it should.',
  'Escort contract for a vessel the crew has never seen and has not been given a visual description of.',
  'Salvage assessment of a derelict that was reported by a ship that has since departed the sector.',
] as const;

// ─── State ─────────────────────────────────────────────────────────────────

type ShipResultCore = {
  edition: 'core';
  hull: HullClassCore;
  condition: ConditionEntry;
  ftlRating: number;
  adjustedHullIntegrity: number;
  quirk: string | null;
  history: string | null;
  currentJob: string | null;
};

type ShipResultEvolved = {
  edition: 'evolved';
  hull: HullClassEvolved;
  condition: ConditionEntry;
  hullValue: number;
  adjustedHullValue: number;
  ftlRating: number;
  armorLevel: number;
  quirk: string | null;
  history: string | null;
  currentJob: string | null;
};

type ShipResult = ShipResultCore | ShipResultEvolved;

const edition = ref<'core' | 'evolved'>('core');
const result = ref<ShipResult | null>(null);
const includeQuirk = ref(true);
const includeHistory = ref(true);
const includeJob = ref(false);

function switchEdition(ed: 'core' | 'evolved'): void {
  edition.value = ed;
  result.value = null;
}

function generate(): void {
  const condition = pick(CONDITIONS);
  const quirk = includeQuirk.value ? pick(QUIRKS) : null;
  const history = includeHistory.value ? pick(HISTORIES) : null;
  const currentJob = includeJob.value ? pick(CURRENT_JOBS) : null;

  if (edition.value === 'core') {
    const hull = pick(HULL_CLASSES_CORE);
    const ftlRating = rollRange(hull.ftlRatingRange);
    const adjustedHullIntegrity = Math.max(1, hull.hullIntegrity + condition.hullMod);

    result.value = {
      edition: 'core',
      hull,
      condition,
      ftlRating,
      adjustedHullIntegrity,
      quirk,
      history,
      currentJob,
    };
  } else {
    const hull = pick(HULL_CLASSES_EVOLVED);
    const hullValue = rollRange(hull.hullRange);
    const adjustedHullValue = Math.max(1, hullValue + condition.hullMod);
    const ftlRating = rollRange(hull.ftlRange);
    const armorLevel = rollRange(hull.armorLevelRange);

    result.value = {
      edition: 'evolved',
      hull,
      condition,
      hullValue,
      adjustedHullValue,
      ftlRating,
      armorLevel,
      quirk,
      history,
      currentJob,
    };
  }
}

function clearResult(): void {
  result.value = null;
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Edition toggle -->
    <div class="flex flex-col gap-2">
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          class="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md px-4 text-sm font-semibold transition-[background,color,border-color] duration-150"
          :class="
            edition === 'core'
              ? 'bg-[var(--color-brand-primary)] text-[#0d1117]'
              : 'border border-[var(--color-surface-500)] text-[var(--color-text-secondary-dark)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-secondary-light)] [.light_&]:hover:text-[var(--color-text-primary-light)]'
          "
          @click="switchEdition('core')"
        >
          Alien RPG
        </button>
        <button
          type="button"
          class="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md px-4 text-sm font-semibold transition-[background,color,border-color] duration-150"
          :class="
            edition === 'evolved'
              ? 'bg-[var(--color-brand-primary)] text-[#0d1117]'
              : 'border border-[var(--color-surface-500)] text-[var(--color-text-secondary-dark)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-secondary-light)] [.light_&]:hover:text-[var(--color-text-primary-light)]'
          "
          @click="switchEdition('evolved')"
        >
          Alien RPG – Evolved Edition
        </button>
      </div>
    </div>

    <hr class="border-[var(--color-surface-600)] [.light_&]:border-[var(--color-light-200)]" />

    <!-- Controls -->
    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <button
        type="button"
        class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90"
        @click="generate"
      >
        Generate Ship
      </button>

      <label
        class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
      >
        <input
          v-model="includeQuirk"
          type="checkbox"
          class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
        />
        Include quirk
      </label>

      <label
        class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
      >
        <input
          v-model="includeHistory"
          type="checkbox"
          class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
        />
        Include history
      </label>

      <label
        class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
      >
        <input
          v-model="includeJob"
          type="checkbox"
          class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
        />
        Include current job
      </label>

      <button
        v-if="result"
        type="button"
        class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
        @click="clearResult"
      >
        Clear
      </button>
    </div>

    <!-- Result: Core Rulebook -->
    <div v-if="result && result.edition === 'core'" class="flex flex-col gap-4" aria-live="polite">
      <!-- Hull class badge -->
      <div
        class="inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-brand-primary)] bg-[var(--color-surface-700)] px-4 py-[0.4rem]"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Hull Class</span
        >
        <span class="text-sm font-bold text-[var(--color-brand-primary)]">{{
          result.hull.class
        }}</span>
        <span
          class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >· {{ result.condition.label }}</span
        >
      </div>

      <!-- Stat bar -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Hull Integrity</span
          >
          <span
            class="text-[1.75rem] leading-none font-extrabold text-[var(--color-brand-red-light)]"
            >{{ result.adjustedHullIntegrity }}</span
          >
          <span
            v-if="result.condition.hullMod !== 0"
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            Base {{ result.hull.hullIntegrity }} {{ result.condition.hullMod > 0 ? '+' : ''
            }}{{ result.condition.hullMod }} ({{ result.condition.label }})
          </span>
        </div>

        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >FTL Rating</span
          >
          <span
            class="text-[1.75rem] leading-none font-extrabold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ result.ftlRating }}</span
          >
          <span
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Range for this class: {{ result.hull.ftlRatingRange[0] }}–{{
              result.hull.ftlRatingRange[1]
            }}</span
          >
        </div>

        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Ship Points</span
          >
          <span
            class="text-[1.75rem] leading-none font-extrabold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ result.hull.shipPoints }}</span
          >
          <span
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Available for modifications</span
          >
        </div>

        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Crew / Cargo</span
          >
          <span
            class="text-[1.1rem] leading-[1.3] font-extrabold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ result.hull.crewRange }}</span
          >
          <span
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ result.hull.cargoTons }} tons cargo</span
          >
        </div>
      </div>

      <!-- Hull description -->
      <div
        class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Description</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ result.hull.examples }}</span
          >
        </div>
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ result.hull.description }} {{ result.condition.description }}
        </p>
      </div>
    </div>

    <!-- Result: Evolved Edition -->
    <div
      v-else-if="result && result.edition === 'evolved'"
      class="flex flex-col gap-4"
      aria-live="polite"
    >
      <!-- Hull class badge -->
      <div
        class="inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-brand-primary)] bg-[var(--color-surface-700)] px-4 py-[0.4rem]"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Hull Class</span
        >
        <span class="text-sm font-bold text-[var(--color-brand-primary)]">{{
          result.hull.class
        }}</span>
        <span
          class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >· {{ result.condition.label }}</span
        >
      </div>

      <!-- Stat bar -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Hull</span
          >
          <span
            class="text-[1.75rem] leading-none font-extrabold text-[var(--color-brand-red-light)]"
            >{{ result.adjustedHullValue }}</span
          >
          <span
            v-if="result.condition.hullMod !== 0"
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            Base {{ result.hullValue }} {{ result.condition.hullMod > 0 ? '+' : ''
            }}{{ result.condition.hullMod }} ({{ result.condition.label }})
          </span>
        </div>

        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >FTL Rating</span
          >
          <span
            class="text-[1.75rem] leading-none font-extrabold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ result.ftlRating }}</span
          >
          <span
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Lower is faster. Days per parsec, class range {{ result.hull.ftlRange[0] }}–{{
              result.hull.ftlRange[1]
            }}</span
          >
        </div>

        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Signature</span
          >
          <span
            class="text-[1.75rem] leading-none font-extrabold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ result.hull.signature > 0 ? '+' : '' }}{{ result.hull.signature }}</span
          >
          <span
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Modifier for enemy sensor lock</span
          >
        </div>

        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Crew / Armor Level</span
          >
          <span
            class="text-[1.1rem] leading-[1.3] font-extrabold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ result.hull.crewRange }}</span
          >
          <span
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Armor Level {{ result.armorLevel }}</span
          >
        </div>
      </div>

      <!-- Hull description -->
      <div
        class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Description</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ result.hull.subtitle }} · Thrusters {{ result.hull.thrusters > 0 ? '+' : ''
            }}{{ result.hull.thrusters }} · {{ result.hull.examples }}</span
          >
        </div>
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ result.hull.description }} {{ result.condition.description }}
        </p>
      </div>
    </div>

    <!-- Quirk / History / Current Job (shared between editions) -->
    <template v-if="result">
      <div
        v-if="result.quirk"
        class="flex flex-col gap-2 rounded-lg border border-amber-700/60 bg-amber-950/20 p-4"
      >
        <span class="text-xs font-semibold tracking-[0.06em] text-amber-400 uppercase"
          >Ship Quirk</span
        >
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ result.quirk }}
        </p>
      </div>

      <div
        v-if="result.history"
        class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >History</span
        >
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ result.history }}
        </p>
      </div>

      <div
        v-if="result.currentJob"
        class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Current Job</span
        >
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ result.currentJob }}
        </p>
      </div>
    </template>

    <!-- Empty state -->
    <div
      v-if="!result"
      class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-6 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <p v-if="edition === 'core'" class="m-0">
        Generate a ship: hull class, Hull Integrity, FTL rating, Ship Points, crew and cargo
        capacity, optional quirk, history, and current job. Mechanical values follow the Alien RPG
        Core Rulebook Chapter 9. Narrative prompts work with any edition.
      </p>
      <p v-else class="m-0">
        Generate a ship: hull class, Hull, FTL Rating, Signature, Armor Level, crew capacity,
        optional quirk, history, and current job. Mechanical values follow the Alien RPG – Evolved
        Edition spacecraft rules, where a lower FTL Rating means a faster ship. Narrative prompts
        work with any edition.
      </p>
    </div>
  </div>
</template>
