<script setup lang="ts">
/**
 * AlienRPGCombatTracker.vue
 * Session helper for ALIEN RPG combat: rounds, turn order, stress/health slots, and basic dice.
 * Does not embed rulebook tables — use the Core Rulebook for panic, crits, and weapon stats.
 */
import { onMounted, ref, watch } from 'vue';

const STORAGE_KEY = 'ttbg-alien-rpg-combat-v1';

/** UI prefs stored with combat state (survives refresh; kept when you end combat). */
type CombatPrefs = {
  initiativeHighFirst: boolean;
  snapToFirstOnNewRound: boolean;
  showNotes: boolean;
  showDicePanel: boolean;
  diceRollLog: boolean;
};

const defaultPrefs: CombatPrefs = {
  initiativeHighFirst: true,
  snapToFirstOnNewRound: true,
  showNotes: true,
  showDicePanel: true,
  diceRollLog: false,
};

type Combatant = {
  id: string;
  name: string;
  initiative: number | null;
  stress: number | null;
  health: number | null;
  notes: string;
};

function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  );
}

function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

const round = ref(1);
const combatants = ref<Combatant[]>([]);
const activeIndex = ref(0);
const lastRoll = ref('');
const rollHistory = ref<string[]>([]);
const prefs = ref<CombatPrefs>({ ...defaultPrefs });

function persist(): void {
  try {
    const idx =
      combatants.value.length === 0
        ? 0
        : Math.min(Math.max(0, activeIndex.value), combatants.value.length - 1);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        round: round.value,
        combatants: combatants.value,
        activeIndex: idx,
        prefs: prefs.value,
      })
    );
  } catch {
    /* private mode / quota */
  }
}

function load(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw) as {
      round?: number;
      combatants?: Combatant[];
      activeIndex?: number;
      prefs?: Partial<CombatPrefs>;
    };
    if (data.prefs && typeof data.prefs === 'object') {
      prefs.value = {
        ...defaultPrefs,
        ...data.prefs,
      };
    }
    if (typeof data.round === 'number' && data.round >= 1) round.value = data.round;
    if (Array.isArray(data.combatants)) {
      combatants.value = data.combatants.filter(
        (c) => c && typeof c.id === 'string' && typeof c.name === 'string'
      );
    }
    if (typeof data.activeIndex === 'number' && combatants.value.length > 0) {
      activeIndex.value = Math.min(Math.max(0, data.activeIndex), combatants.value.length - 1);
    } else {
      activeIndex.value = 0;
    }
  } catch {
    /* invalid */
  }
}

onMounted(() => {
  load();
});

watch([round, activeIndex, combatants, prefs], persist, { deep: true });

watch(
  () => prefs.value.diceRollLog,
  (on) => {
    if (!on) rollHistory.value = [];
  }
);

function addCombatant(): void {
  combatants.value.push({
    id: newId(),
    name: '',
    initiative: null,
    stress: null,
    health: null,
    notes: '',
  });
  if (combatants.value.length === 1) activeIndex.value = 0;
}

function removeCombatant(index: number): void {
  combatants.value.splice(index, 1);
  if (activeIndex.value >= combatants.value.length) {
    activeIndex.value = Math.max(0, combatants.value.length - 1);
  } else if (index < activeIndex.value) {
    activeIndex.value -= 1;
  }
}

function sortByInitiative(): void {
  const highFirst = prefs.value.initiativeHighFirst;
  combatants.value = [...combatants.value].sort((a, b) => {
    const ai = a.initiative ?? (highFirst ? -1e9 : 1e9);
    const bi = b.initiative ?? (highFirst ? -1e9 : 1e9);
    return highFirst ? bi - ai : ai - bi;
  });
  activeIndex.value = 0;
}

function nextTurn(): void {
  if (combatants.value.length === 0) return;
  activeIndex.value = (activeIndex.value + 1) % combatants.value.length;
}

function prevTurn(): void {
  if (combatants.value.length === 0) return;
  activeIndex.value = (activeIndex.value - 1 + combatants.value.length) % combatants.value.length;
}

function advanceRound(): void {
  round.value += 1;
  if (prefs.value.snapToFirstOnNewRound && combatants.value.length > 0) {
    activeIndex.value = 0;
  }
}

function rewindRound(): void {
  if (round.value <= 1) return;
  round.value -= 1;
}

function endCombat(): void {
  combatants.value = [];
  round.value = 1;
  activeIndex.value = 0;
  lastRoll.value = '';
  rollHistory.value = [];
  persist();
}

function moveUp(index: number): void {
  if (index <= 0) return;
  const next = [...combatants.value];
  const tmp = next[index - 1];
  next[index - 1] = next[index]!;
  next[index] = tmp!;
  combatants.value = next;
  if (activeIndex.value === index) activeIndex.value = index - 1;
  else if (activeIndex.value === index - 1) activeIndex.value = index;
}

function moveDown(index: number): void {
  if (index >= combatants.value.length - 1) return;
  moveUp(index + 1);
}

function setRoll(label: string, detail: string): void {
  const line = `${label}: ${detail}`;
  lastRoll.value = line;
  if (prefs.value.diceRollLog) {
    rollHistory.value = [line, ...rollHistory.value].slice(0, 30);
  }
}

function clearDiceOutput(): void {
  lastRoll.value = '';
  rollHistory.value = [];
}

function roll1d6(): void {
  setRoll('1D6', String(rollD6()));
}

function roll2d6(): void {
  const a = rollD6();
  const b = rollD6();
  setRoll('2D6', `${a} + ${b} = ${a + b}`);
}

function rollD66(): void {
  const a = rollD6();
  const b = rollD6();
  setRoll('D66', `${a}${b}`);
}

function rollD12(): void {
  const v = Math.floor(Math.random() * 12) + 1;
  setRoll('1D12', String(v));
}

function rollD3(): void {
  setRoll('D3', String(Math.floor(Math.random() * 3) + 1));
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Round + flow -->
    <div
      class="flex flex-col gap-4 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
    >
      <div class="flex flex-wrap items-baseline gap-3">
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Round</span
        >
        <span class="text-3xl leading-none font-extrabold text-[var(--color-brand-red-light)]">{{
          round
        }}</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 text-sm font-medium text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-40 [.light_&]:text-[var(--color-text-primary-light)]"
          :disabled="round <= 1"
          @click="rewindRound"
        >
          −1 round
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 text-sm font-medium text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          @click="advanceRound"
        >
          {{
            prefs.snapToFirstOnNewRound ? '+1 round (jump to first)' : '+1 round (keep active turn)'
          }}
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-brand-red)] bg-[var(--color-surface-600)] px-3 py-2 text-sm font-medium text-[var(--color-brand-red-light)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)]"
          @click="endCombat"
        >
          End combat
        </button>
      </div>
    </div>

    <!-- Options -->
    <details
      class="group rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4 [&_summary::-webkit-details-marker]:hidden"
    >
      <summary
        class="cursor-pointer list-none text-sm font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
      >
        <span class="inline-block transition-transform duration-150 group-open:rotate-90">▸</span>
        Options &amp; display
      </summary>
      <div
        class="mt-4 flex flex-col gap-3 border-t border-[var(--color-surface-600)] pt-4 [.light_&]:border-[var(--color-light-200)]"
      >
        <fieldset class="m-0 border-0 p-0">
          <legend
            class="mb-2 text-xs font-semibold tracking-wide text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            Initiative when sorting
          </legend>
          <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-6">
            <label
              class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              <input
                v-model="prefs.initiativeHighFirst"
                type="radio"
                :value="true"
                class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
              />
              High → low
            </label>
            <label
              class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              <input
                v-model="prefs.initiativeHighFirst"
                type="radio"
                :value="false"
                class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
              />
              Low → high
            </label>
          </div>
        </fieldset>

        <label
          class="flex cursor-pointer items-start gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <input
            v-model="prefs.snapToFirstOnNewRound"
            type="checkbox"
            class="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          <span>
            <span class="font-semibold">New round</span> jumps to the first combatant in the list
            (turn off to keep the same actor highlighted after +1 round).
          </span>
        </label>

        <label
          class="flex cursor-pointer items-start gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <input
            v-model="prefs.showNotes"
            type="checkbox"
            class="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          <span><span class="font-semibold">Notes</span> row under each combatant</span>
        </label>

        <label
          class="flex cursor-pointer items-start gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <input
            v-model="prefs.showDicePanel"
            type="checkbox"
            class="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          <span><span class="font-semibold">Quick dice</span> panel at the bottom</span>
        </label>

        <label
          class="flex cursor-pointer items-start gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <input
            v-model="prefs.diceRollLog"
            type="checkbox"
            class="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          <span
            ><span class="font-semibold">Dice log</span> — keep the last 30 rolls (newest first).
            Turning this off clears the log.</span
          >
        </label>
      </div>
    </details>

    <!-- Controls -->
    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <button
        type="button"
        class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90"
        @click="addCombatant"
      >
        Add combatant
      </button>
      <button
        type="button"
        class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-40 [.light_&]:text-[var(--color-text-primary-light)]"
        :disabled="combatants.length < 2"
        @click="sortByInitiative"
      >
        {{
          prefs.initiativeHighFirst
            ? 'Sort by initiative (high → low)'
            : 'Sort by initiative (low → high)'
        }}
      </button>
      <button
        type="button"
        class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-40 [.light_&]:text-[var(--color-text-primary-light)]"
        :disabled="combatants.length === 0"
        @click="prevTurn"
      >
        ← Previous turn
      </button>
      <button
        type="button"
        class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-40 [.light_&]:text-[var(--color-text-primary-light)]"
        :disabled="combatants.length === 0"
        @click="nextTurn"
      >
        Next turn →
      </button>
    </div>

    <!-- Combatants -->
    <div
      v-if="combatants.length === 0"
      class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-8 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <p class="m-0">
        No combatants yet. Add a row for each PC, NPC, or creature, then step through turns.
      </p>
    </div>

    <ul v-else class="m-0 flex list-none flex-col gap-3 p-0" aria-label="Combat turn order">
      <li
        v-for="(c, index) in combatants"
        :key="c.id"
        class="rounded-lg border p-4 transition-[border-color,box-shadow] duration-150"
        :class="
          index === activeIndex
            ? 'border-[var(--color-brand-primary)] bg-[var(--color-surface-700)] shadow-[0_0_0_1px_var(--color-brand-primary)]'
            : 'border-[var(--color-surface-600)] bg-[var(--color-surface-700)]'
        "
        :aria-current="index === activeIndex ? 'step' : false"
      >
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ index === activeIndex ? 'Active turn' : `Order #${index + 1}` }}</span
          >
          <div class="flex flex-wrap gap-1">
            <button
              type="button"
              class="cursor-pointer rounded border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-2 py-1 text-xs text-[var(--color-text-secondary-dark)] hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              :disabled="index === 0"
              title="Move up in order"
              @click="moveUp(index)"
            >
              Up
            </button>
            <button
              type="button"
              class="cursor-pointer rounded border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-2 py-1 text-xs text-[var(--color-text-secondary-dark)] hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              :disabled="index >= combatants.length - 1"
              title="Move down in order"
              @click="moveDown(index)"
            >
              Down
            </button>
            <button
              type="button"
              class="cursor-pointer rounded border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-2 py-1 text-xs text-[var(--color-brand-red-light)] hover:border-[var(--color-brand-red)]"
              @click="removeCombatant(index)"
            >
              Remove
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <div class="flex flex-col gap-1 lg:col-span-4">
            <label
              class="text-xs font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              :for="`name-${c.id}`"
              >Name</label
            >
            <input
              :id="`name-${c.id}`"
              v-model="c.name"
              type="text"
              class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 font-[inherit] text-base text-[var(--color-text-primary-dark)] outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
              placeholder="Cpl. Frost"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-col gap-1 lg:col-span-2">
            <label
              class="text-xs font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              :for="`init-${c.id}`"
              >Initiative</label
            >
            <input
              :id="`init-${c.id}`"
              v-model.number="c.initiative"
              type="number"
              class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 font-[inherit] text-base text-[var(--color-text-primary-dark)] outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
              placeholder="—"
            />
          </div>
          <div class="flex flex-col gap-1 lg:col-span-2">
            <label
              class="text-xs font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              :for="`hp-${c.id}`"
              >Health</label
            >
            <input
              :id="`hp-${c.id}`"
              v-model.number="c.health"
              type="number"
              min="0"
              class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 font-[inherit] text-base text-[var(--color-text-primary-dark)] outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
              placeholder="—"
            />
          </div>
          <div class="flex flex-col gap-1 lg:col-span-2">
            <label
              class="text-xs font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              :for="`stress-${c.id}`"
              >Stress</label
            >
            <input
              :id="`stress-${c.id}`"
              v-model.number="c.stress"
              type="number"
              min="0"
              class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 font-[inherit] text-base text-[var(--color-text-primary-dark)] outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
              placeholder="—"
            />
          </div>
          <div v-show="prefs.showNotes" class="flex flex-col gap-1 lg:col-span-12">
            <label
              class="text-xs font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              :for="`notes-${c.id}`"
              >Notes (conditions, ammo…)</label
            >
            <input
              :id="`notes-${c.id}`"
              v-model="c.notes"
              type="text"
              class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 font-[inherit] text-sm text-[var(--color-text-primary-dark)] outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
              placeholder="On fire, suppressed…"
              autocomplete="off"
            />
          </div>
        </div>
      </li>
    </ul>

    <!-- Dice -->
    <div
      v-show="prefs.showDicePanel"
      class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
    >
      <div class="mb-3 flex flex-wrap items-start justify-between gap-2">
        <h3
          class="m-0 text-sm font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          Quick dice
        </h3>
        <button
          v-if="lastRoll || rollHistory.length"
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-2 py-1 text-xs font-medium text-[var(--color-text-secondary-dark)] hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="clearDiceOutput"
        >
          Clear output
        </button>
      </div>
      <p
        class="m-0 mb-3 text-xs leading-relaxed text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
      >
        For panic outcomes, crits, and weapon dice, use Alien RPG or Alien RPG – Evolved Edition.
        This panel only rolls numbers.
      </p>
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 text-sm font-medium hover:border-[var(--color-brand-primary)]"
          @click="roll1d6"
        >
          1D6
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 text-sm font-medium hover:border-[var(--color-brand-primary)]"
          @click="roll2d6"
        >
          2D6
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 text-sm font-medium hover:border-[var(--color-brand-primary)]"
          @click="rollD66"
        >
          D66
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 text-sm font-medium hover:border-[var(--color-brand-primary)]"
          @click="rollD12"
        >
          1D12
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-2 text-sm font-medium hover:border-[var(--color-brand-primary)]"
          @click="rollD3"
        >
          D3
        </button>
      </div>
      <ul
        v-if="prefs.diceRollLog && rollHistory.length"
        class="mb-3 max-h-36 list-none overflow-y-auto rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-800)] p-2 pl-3 font-mono text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        aria-label="Dice roll history"
      >
        <li
          v-for="(line, i) in rollHistory"
          :key="i"
          class="border-b border-[var(--color-surface-600)] py-1 last:border-b-0"
        >
          {{ line }}
        </li>
      </ul>
      <p
        v-if="lastRoll"
        class="m-0 rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-800)] px-3 py-2 font-mono text-sm text-[var(--color-brand-red-light)]"
        aria-live="polite"
      >
        {{ prefs.diceRollLog && rollHistory.length ? 'Latest: ' : '' }}{{ lastRoll }}
      </p>
    </div>
  </div>
</template>
