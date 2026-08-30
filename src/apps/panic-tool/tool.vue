<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useEdition } from '@/shared/edition';
import { useMounted } from '@/shared/composables/useMounted';

const isMounted = useMounted();

function d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

// ─── Types ──────────────────────────────────────────────────────────────────

type Severity = 'safe' | 'low' | 'mid' | 'high' | 'critical';

interface PanicRow {
  min: number;
  max: number;
  label: string;
  title: string;
  effect: string;
  recovery: string | null;
  cascade: boolean;
  severity: Severity;
}

// ─── Core Rulebook Panic Table (p. 104) ────────────────────────────────────

const PANIC_TABLE_CORE: PanicRow[] = [
  {
    min: -Infinity,
    max: 6,
    label: '≤6',
    title: 'Keeping It Together',
    severity: 'safe',
    effect: 'You hold it together for now. Your Stress Level increases by 1.',
    recovery: null,
    cascade: false,
  },
  {
    min: 7,
    max: 7,
    label: '7',
    title: 'Nervous Twitch',
    severity: 'low',
    effect:
      'You flinch and twitch at every sound. Lose 1 point of Agility for the rest of the Act.',
    recovery: 'Effect ends at the end of the current Act.',
    cascade: false,
  },
  {
    min: 8,
    max: 8,
    label: '8',
    title: 'Tremble',
    severity: 'low',
    effect: 'Your hands shake uncontrollably. Lose 1 point of Strength for the rest of the Act.',
    recovery: 'Effect ends at the end of the current Act.',
    cascade: false,
  },
  {
    min: 9,
    max: 9,
    label: '9',
    title: 'Drop Item',
    severity: 'low',
    effect: 'You drop whatever you are holding — weapon, tool, whatever is in your hands.',
    recovery: 'Pick it up on a future action.',
    cascade: false,
  },
  {
    min: 10,
    max: 10,
    label: '10',
    title: 'Freeze',
    severity: 'mid',
    effect: 'You are frozen by fear. You cannot perform any actions this Round.',
    recovery: 'Effect ends at the start of your next turn.',
    cascade: false,
  },
  {
    min: 11,
    max: 11,
    label: '11',
    title: 'Seek Cover',
    severity: 'mid',
    effect:
      'You run for the nearest cover and huddle there. You cannot perform any actions until another character makes a successful Manipulation roll against you.',
    recovery: 'Another character must succeed at a Manipulation roll to end this effect.',
    cascade: false,
  },
  {
    min: 12,
    max: 12,
    label: '12',
    title: 'Scream',
    severity: 'high',
    effect:
      'You scream in terror. You cannot perform any actions this Round. Each other PC in Short range must make an immediate Panic Roll.',
    recovery: 'Effect ends at the start of your next turn.',
    cascade: true,
  },
  {
    min: 13,
    max: 13,
    label: '13',
    title: 'Flee',
    severity: 'high',
    effect:
      'You flee from the source of fear as fast as you can. You cannot perform any other action this Round. Each other PC in Short range must make an immediate Panic Roll.',
    recovery: 'Effect ends at the end of the Round.',
    cascade: true,
  },
  {
    min: 14,
    max: 14,
    label: '14',
    title: 'Attack',
    severity: 'critical',
    effect:
      'In your panic, you attack the nearest friendly character using whatever you have at hand.',
    recovery: null,
    cascade: false,
  },
  {
    min: 15,
    max: Infinity,
    label: '15+',
    title: 'Catatonic',
    severity: 'critical',
    effect:
      'You collapse, whimpering and shaking, completely unable to act. Each other PC in Short range must make an immediate Panic Roll.',
    recovery: 'Another character must succeed at a Manipulation roll to end this effect.',
    cascade: true,
  },
];

// ─── Evolved Edition Panic Table (p. 76–77) ────────────────────────────────
// Formula: D6 + Stress − Resolve

const PANIC_TABLE_EVOLVED: PanicRow[] = [
  {
    min: -Infinity,
    max: 0,
    label: '≤0',
    title: 'Keeping Cool',
    severity: 'safe',
    effect: 'No effect.',
    recovery: null,
    cascade: false,
  },
  {
    min: 1,
    max: 1,
    label: '1',
    title: 'Spooked',
    severity: 'low',
    effect: 'Your stress level increases by 1.',
    recovery: null,
    cascade: false,
  },
  {
    min: 2,
    max: 2,
    label: '2',
    title: 'Noisy',
    severity: 'low',
    effect: 'Any enemies nearby are automatically alerted to your presence.',
    recovery: null,
    cascade: false,
  },
  {
    min: 3,
    max: 3,
    label: '3',
    title: 'Twitchy',
    severity: 'low',
    effect: "Make an immediate supply roll for air, ammo, or power (GM's discretion).",
    recovery: null,
    cascade: false,
  },
  {
    min: 4,
    max: 4,
    label: '4',
    title: 'Lose Item',
    severity: 'mid',
    effect:
      "You lose a weapon or other important item (GM's discretion). In combat, a quick action lets you pick it up.",
    recovery: null,
    cascade: false,
  },
  {
    min: 5,
    max: 5,
    label: '5',
    title: 'Paranoid',
    severity: 'mid',
    effect: 'You cannot give or receive help on skill rolls until your panic stops.',
    recovery: 'Effect ends when your panic stops.',
    cascade: false,
  },
  {
    min: 6,
    max: 6,
    label: '6',
    title: 'Hesitant',
    severity: 'mid',
    effect: 'You automatically get the #10 initiative card in combat until your panic stops.',
    recovery: 'Effect ends when your panic stops.',
    cascade: false,
  },
  {
    min: 7,
    max: 7,
    label: '7',
    title: 'Freeze',
    severity: 'high',
    effect:
      'You are frozen by fear. Lose your next turn and cannot perform any interrupt actions before then.',
    recovery: null,
    cascade: false,
  },
  {
    min: 8,
    max: 8,
    label: '8',
    title: 'Seek Cover',
    severity: 'high',
    effect:
      'Interrupt action: you immediately seek full cover in the zone. Stress −1. Lose your next turn. If the zone has no cover, you Scream instead.',
    recovery: null,
    cascade: false,
  },
  {
    min: 9,
    max: 9,
    label: '9',
    title: 'Scream',
    severity: 'critical',
    effect:
      'Lose your next turn. Stress −1. Every friendly PC in the zone must make an immediate panic roll.',
    recovery: 'Effect ends at the start of your next turn.',
    cascade: true,
  },
  {
    min: 10,
    max: 10,
    label: '10',
    title: 'Flee',
    severity: 'critical',
    effect:
      'Interrupt action: move to an adjacent zone away from danger. Stress −1. All friendly PCs remaining in the starting zone get Stress +1. You must keep moving away until you feel safe. If you cannot move: Catatonic instead.',
    recovery: 'Keep moving away from danger until you feel safe.',
    cascade: false,
  },
  {
    min: 11,
    max: 11,
    label: '11',
    title: 'Frenzy',
    severity: 'critical',
    effect:
      "Immediately attack the nearest person or creature with whatever you have at hand. Every friendly PC in the zone must make an immediate panic roll. You won't stop until broken.",
    recovery:
      'Another character must make a COMMAND roll (full action in combat) to end the effect, or you are broken, or one stretch passes.',
    cascade: true,
  },
  {
    min: 12,
    max: Infinity,
    label: '12+',
    title: 'Catatonic',
    severity: 'critical',
    effect: 'You collapse to the floor and cannot move until your panic stops.',
    recovery:
      'Another character must make a COMMAND roll (full action in combat) to end the effect, or you are broken, or one stretch passes.',
    cascade: false,
  },
];

// ─── Severity styles ────────────────────────────────────────────────────────

const REACH_BG: Record<Severity, string> = {
  safe: 'bg-[var(--color-surface-700)] [.light_&]:bg-[var(--color-light-50)]',
  low: 'bg-yellow-950/30 [.light_&]:bg-yellow-50',
  mid: 'bg-orange-950/30 [.light_&]:bg-orange-50',
  high: 'bg-red-950/30 [.light_&]:bg-red-50',
  critical: 'bg-red-950/50 [.light_&]:bg-red-100',
};
const REACH_BORDER: Record<Severity, string> = {
  safe: 'border-[var(--color-surface-600)] [.light_&]:border-[var(--color-light-200)]',
  low: 'border-yellow-700/50 [.light_&]:border-yellow-300',
  mid: 'border-orange-600/50 [.light_&]:border-orange-300',
  high: 'border-red-700/50 [.light_&]:border-red-300',
  critical: 'border-red-600/70 [.light_&]:border-red-400',
};
const REACH_TITLE: Record<Severity, string> = {
  safe: 'text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]',
  low: 'text-yellow-300 [.light_&]:text-yellow-700',
  mid: 'text-orange-300 [.light_&]:text-orange-700',
  high: 'text-red-300 [.light_&]:text-red-700',
  critical: 'text-red-200 [.light_&]:text-red-800',
};
const ACTIVE_BG: Record<Severity, string> = {
  safe: 'bg-[var(--color-surface-600)] [.light_&]:bg-[var(--color-light-100)]',
  low: 'bg-yellow-900/50 [.light_&]:bg-yellow-100',
  mid: 'bg-orange-900/50 [.light_&]:bg-orange-100',
  high: 'bg-red-900/50 [.light_&]:bg-red-100',
  critical: 'bg-red-900/70 [.light_&]:bg-red-200',
};
const ACTIVE_BORDER: Record<Severity, string> = {
  safe: 'border-[var(--color-surface-400)] [.light_&]:border-[var(--color-light-300)]',
  low: 'border-yellow-500 [.light_&]:border-yellow-500',
  mid: 'border-orange-500 [.light_&]:border-orange-500',
  high: 'border-red-500 [.light_&]:border-red-500',
  critical: 'border-red-400 [.light_&]:border-red-600',
};

// ─── Danger summary ────────────────────────────────────────────────────────

interface DangerSummary {
  label: string;
  color: string;
}

const SECONDARY_COLOR =
  'text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]';

function buildDangerSummary(stress: number, res: number, isEvolved: boolean): DangerSummary {
  const maxT = stress + 6 - res;
  if (isEvolved) {
    if (maxT <= 0) return { label: 'No panic risk', color: SECONDARY_COLOR };
    if (maxT <= 3)
      return { label: 'Minor panic possible', color: 'text-yellow-400 [.light_&]:text-yellow-700' };
    if (maxT <= 6)
      return { label: 'Moderate panic risk', color: 'text-orange-400 [.light_&]:text-orange-700' };
    if (maxT <= 8)
      return {
        label: 'High panic risk — cascades possible',
        color: 'text-red-400 [.light_&]:text-red-700',
      };
    return {
      label: 'Extreme panic risk — cascades likely',
      color: 'text-red-300 [.light_&]:text-red-800',
    };
  } else {
    if (maxT <= 6) return { label: 'No panic risk', color: SECONDARY_COLOR };
    if (maxT <= 9)
      return { label: 'Minor panic possible', color: 'text-yellow-400 [.light_&]:text-yellow-700' };
    if (maxT <= 11)
      return { label: 'Moderate panic risk', color: 'text-orange-400 [.light_&]:text-orange-700' };
    if (maxT <= 13)
      return {
        label: 'High panic risk — cascades possible',
        color: 'text-red-400 [.light_&]:text-red-700',
      };
    return {
      label: 'Extreme panic risk — cascades likely',
      color: 'text-red-300 [.light_&]:text-red-800',
    };
  }
}

// ─── State ──────────────────────────────────────────────────────────────────

type RollResult = {
  diceRoll: number;
  stressLevel: number;
  resolveValue: number;
  total: number;
  row: PanicRow;
};

// Edition is chosen once in the sidebar and shared by every tool in the suite.
const edition = useEdition();
const stressLevel = ref<number | ''>(3);
const resolveValue = ref<number | ''>(0);
const lastRoll = ref<RollResult | null>(null);
const activeModal = ref<'stress' | 'resolve' | null>(null);

// The editions use different panic tables, so a stale result would be misleading.
watch(edition, () => {
  lastRoll.value = null;
});

const activeTable = computed(() =>
  edition.value === 'core' ? PANIC_TABLE_CORE : PANIC_TABLE_EVOLVED
);

const effectiveResolve = computed(() =>
  edition.value === 'evolved' ? Number(resolveValue.value) || 0 : 0
);

function getRow(total: number): PanicRow {
  const table = activeTable.value;
  return table.find((r) => total >= r.min && total <= r.max) ?? table[0]!;
}

function isReachable(row: PanicRow, stress: number, res: number): boolean {
  const minT = stress + 1 - res;
  const maxT = stress + 6 - res;
  return row.max >= minT && row.min <= maxT;
}

const danger = computed<DangerSummary | null>(() => {
  const s = Number(stressLevel.value);
  return s >= 1 ? buildDangerSummary(s, effectiveResolve.value, edition.value === 'evolved') : null;
});

const minPossibleTotal = computed(() => {
  const s = Number(stressLevel.value);
  return s >= 1 ? s + 1 - effectiveResolve.value : null;
});
const maxPossibleTotal = computed(() => {
  const s = Number(stressLevel.value);
  return s >= 1 ? s + 6 - effectiveResolve.value : null;
});

function rollPanic(): void {
  const stress = Number(stressLevel.value);
  if (!stress || stress < 1) return;
  const res = effectiveResolve.value;
  const diceRoll = d6();
  const total = diceRoll + stress - res;
  lastRoll.value = { diceRoll, stressLevel: stress, resolveValue: res, total, row: getRow(total) };
}

function clearRoll(): void {
  lastRoll.value = null;
}

function isActiveResult(row: PanicRow): boolean {
  if (!lastRoll.value) return false;
  const t = lastRoll.value.total;
  return t >= row.min && t <= row.max;
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- ── Controls ── -->
    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div class="flex flex-col gap-[0.375rem]">
        <div class="flex items-center gap-1.5">
          <label
            for="panic-stress"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Stress Level</label
          >
          <button
            type="button"
            class="cursor-pointer text-[var(--color-text-secondary-dark)] opacity-60 transition-opacity duration-150 hover:opacity-100 [.light_&]:text-[var(--color-text-secondary-light)]"
            aria-label="Stress Level info"
            @click="activeModal = 'stress'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path
                d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
              />
            </svg>
          </button>
        </div>
        <input
          id="panic-stress"
          v-model.number="stressLevel"
          type="number"
          min="1"
          max="10"
          step="1"
          placeholder="e.g. 3"
          class="w-28 rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-2 font-[inherit] text-sm text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:border-[var(--color-light-300)] [.light_&]:bg-white [.light_&]:text-[var(--color-text-primary-light)]"
          @input="clearRoll"
        />
      </div>

      <!-- Resolve input — Evolved only -->
      <div v-if="edition === 'evolved'" class="flex flex-col gap-[0.375rem]">
        <div class="flex items-center gap-1.5">
          <label
            for="panic-resolve"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Resolve</label
          >
          <button
            type="button"
            class="cursor-pointer text-[var(--color-text-secondary-dark)] opacity-60 transition-opacity duration-150 hover:opacity-100 [.light_&]:text-[var(--color-text-secondary-light)]"
            aria-label="Resolve info"
            @click="activeModal = 'resolve'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path
                d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
              />
            </svg>
          </button>
        </div>
        <input
          id="panic-resolve"
          v-model.number="resolveValue"
          type="number"
          min="0"
          max="5"
          step="1"
          placeholder="e.g. 2"
          class="w-28 rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-2 font-[inherit] text-sm text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:border-[var(--color-light-300)] [.light_&]:bg-white [.light_&]:text-[var(--color-text-primary-light)]"
          @input="clearRoll"
        />
      </div>

      <button
        type="button"
        class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="!stressLevel || Number(stressLevel) < 1"
        @click="rollPanic"
      >
        <template v-if="edition === 'evolved'">Roll Panic (D6 + Stress − Resolve)</template>
        <template v-else>Roll Panic (D6 + Stress)</template>
      </button>

      <button
        v-if="lastRoll"
        type="button"
        class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:border-[var(--color-light-300)] [.light_&]:bg-[var(--color-light-100)] [.light_&]:text-[var(--color-text-secondary-light)]"
        @click="clearRoll"
      >
        Clear roll
      </button>
    </div>

    <!-- ── Danger badge + dice breakdown ── -->
    <div v-if="stressLevel && Number(stressLevel) >= 1" class="flex flex-wrap items-center gap-3">
      <div
        v-if="danger"
        class="flex items-center gap-2 rounded-full border border-[var(--color-surface-500)] bg-[var(--color-surface-700)] px-4 py-[0.4rem] [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
      >
        <span class="text-sm font-semibold" :class="danger.color">{{ danger.label }}</span>
        <span
          v-if="!lastRoll"
          class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >(totals {{ minPossibleTotal }}–{{ maxPossibleTotal }})</span
        >
      </div>

      <!-- Dice breakdown (post-roll) -->
      <div v-if="lastRoll" class="flex flex-wrap items-center gap-2">
        <div
          class="flex items-center gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] px-3 py-[0.4rem] [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >D6</span
          >
          <span class="text-base font-extrabold text-[var(--color-brand-red-light)]">{{
            lastRoll.diceRoll
          }}</span>
        </div>
        <span
          class="text-sm font-bold text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >+</span
        >
        <div
          class="flex items-center gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] px-3 py-[0.4rem] [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Stress</span
          >
          <span
            class="text-base font-extrabold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ lastRoll.stressLevel }}</span
          >
        </div>
        <template v-if="edition === 'evolved'">
          <span
            class="text-sm font-bold text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >−</span
          >
          <div
            class="flex items-center gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] px-3 py-[0.4rem] [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
          >
            <span
              class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Resolve</span
            >
            <span
              class="text-base font-extrabold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{ lastRoll.resolveValue }}</span
            >
          </div>
        </template>
        <span
          class="text-sm font-bold text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >=</span
        >
        <div
          class="flex items-center gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] px-3 py-[0.4rem] [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Total</span
          >
          <span class="text-base font-extrabold text-[var(--color-brand-red-light)]">{{
            lastRoll.total
          }}</span>
        </div>
      </div>
    </div>

    <!-- ── Panic Table ── -->
    <div
      v-if="stressLevel && Number(stressLevel) >= 1"
      class="flex flex-col gap-[0.35rem]"
      aria-live="polite"
    >
      <p
        v-if="!lastRoll"
        class="m-0 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
      >
        Highlighted rows are reachable at Stress {{ stressLevel
        }}<template v-if="edition === 'evolved' && effectiveResolve > 0"
          >, Resolve {{ effectiveResolve }}</template
        >. Dimmed rows cannot occur on this character's next roll.
      </p>

      <div
        v-for="row in activeTable"
        :key="row.label"
        :class="[
          'rounded-lg border-2 p-3 transition-all duration-150',
          isActiveResult(row)
            ? [ACTIVE_BG[row.severity], ACTIVE_BORDER[row.severity], 'shadow-lg']
            : isReachable(row, Number(stressLevel), effectiveResolve)
              ? [REACH_BG[row.severity], REACH_BORDER[row.severity], 'opacity-100']
              : 'border-[var(--color-surface-700)] bg-[var(--color-surface-800)] opacity-25 [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-100)]',
        ]"
      >
        <div class="flex flex-wrap items-start gap-x-3 gap-y-[0.15rem]">
          <span
            class="w-8 shrink-0 text-center text-xs font-bold tabular-nums"
            :class="
              isActiveResult(row) || isReachable(row, Number(stressLevel), effectiveResolve)
                ? REACH_TITLE[row.severity]
                : 'text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]'
            "
            >{{ row.label }}</span
          >

          <span
            class="text-sm font-semibold"
            :class="
              isActiveResult(row) || isReachable(row, Number(stressLevel), effectiveResolve)
                ? REACH_TITLE[row.severity]
                : 'text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]'
            "
          >
            {{ row.title }}
            <span
              v-if="isActiveResult(row)"
              class="ml-1 rounded bg-[var(--color-surface-600)] px-[0.4rem] py-[0.1rem] text-[0.65rem] font-bold tracking-wide text-[var(--color-text-secondary-dark)] uppercase [.light_&]:bg-[var(--color-light-200)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >rolled</span
            >
          </span>

          <span
            v-if="row.cascade && isReachable(row, Number(stressLevel), effectiveResolve)"
            class="rounded bg-red-900/60 px-[0.35rem] py-[0.1rem] text-[0.65rem] font-semibold tracking-wide text-red-300 uppercase [.light_&]:bg-red-100 [.light_&]:text-red-700"
            >Cascade</span
          >
        </div>

        <p
          v-if="isActiveResult(row) || isReachable(row, Number(stressLevel), effectiveResolve)"
          class="m-0 mt-[0.2rem] pl-11 text-xs leading-[1.5] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          {{ row.effect }}
        </p>
        <p
          v-if="isActiveResult(row) && row.recovery"
          class="m-0 mt-[0.25rem] pl-11 text-xs leading-[1.5] text-[var(--color-text-secondary-dark)] italic [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          Recovery: {{ row.recovery }}
        </p>
      </div>
    </div>

    <!-- ── Cascade warning (post-roll) ── -->
    <div
      v-if="lastRoll && lastRoll.row.cascade"
      class="flex items-start gap-3 rounded-lg border border-red-700 bg-red-950/30 p-4 [.light_&]:border-red-300 [.light_&]:bg-red-50"
      role="alert"
    >
      <span class="mt-[0.05rem] shrink-0 text-red-400 [.light_&]:text-red-600">⚠</span>
      <p class="m-0 text-sm leading-[1.5] font-semibold text-red-300 [.light_&]:text-red-700">
        <template v-if="edition === 'evolved'">
          Cascade — Every friendly PC in the zone must make an immediate panic roll at their own
          current Stress Level.
        </template>
        <template v-else>
          Cascade — Each other PC in Short range must make an immediate Panic Roll at their own
          current Stress Level.
        </template>
      </p>
    </div>

    <!-- Evolved Flee stress-spread warning (not a cascade, but spreads stress) -->
    <div
      v-if="lastRoll && edition === 'evolved' && lastRoll.row.title === 'Flee'"
      class="flex items-start gap-3 rounded-lg border border-yellow-700 bg-yellow-950/30 p-4 [.light_&]:border-yellow-400 [.light_&]:bg-yellow-50"
      role="alert"
    >
      <span class="mt-[0.05rem] shrink-0 text-yellow-400 [.light_&]:text-yellow-600">⚠</span>
      <p class="m-0 text-sm leading-[1.5] font-semibold text-yellow-300 [.light_&]:text-yellow-700">
        Stress spread — All friendly PCs remaining in your starting zone get Stress +1.
      </p>
    </div>

    <!-- ── Empty state ── -->
    <div
      v-if="!stressLevel || Number(stressLevel) < 1"
      class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-6 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:border-[var(--color-light-300)] [.light_&]:bg-[var(--color-light-50)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <p class="m-0">
        Enter a Stress Level to see the reachable Panic Table range — then roll to resolve.
      </p>
    </div>
  </div>

  <!-- ── Info modals ── -->
  <Teleport v-if="isMounted" to="body">
    <div
      v-if="activeModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      @click.self="activeModal = null"
    >
      <div
        class="w-full max-w-sm rounded-xl border border-[var(--color-surface-500)] bg-[var(--color-surface-800)] p-6 shadow-xl [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-white [.light_&]:shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
      >
        <div class="mb-3 flex items-center justify-between">
          <h3
            class="m-0 text-base font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <template v-if="activeModal === 'stress'">Stress Level</template>
            <template v-else>Resolve</template>
          </h3>
          <button
            type="button"
            class="cursor-pointer text-lg leading-none text-[var(--color-text-secondary-dark)] hover:text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-secondary-light)] [.light_&]:hover:text-[var(--color-text-primary-light)]"
            aria-label="Close"
            @click="activeModal = null"
          >
            ×
          </button>
        </div>
        <p
          class="m-0 text-sm leading-[1.6] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          <template v-if="activeModal === 'stress'">Current stress level (1–10)</template>
          <template v-else>Resolve attribute (0–5)</template>
        </p>
      </div>
    </div>
  </Teleport>
</template>
