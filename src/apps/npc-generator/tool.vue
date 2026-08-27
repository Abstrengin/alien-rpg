<script setup lang="ts">
/**
 * AlienRPGNPCGenerator.vue
 * Original NPC prompt generator for the ALIEN RPG (Free League Publishing).
 * Careers match the core archetypes from the rulebook; all other prompts are
 * original TTBG content — not reproduced from published tables.
 */
import { ref } from 'vue';

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

// ─── Careers (Core Rulebook archetypes) ────────────────────────────────────

const CAREERS = [
  'Colonial Marine',
  'Company Agent',
  'Roughneck',
  'Colonial Marshal',
  'Scientist',
  'Medic',
  'Pilot',
  'Kid',
  'Executive',
  'Engineer',
  'Salvager',
  'Colonist',
  'Mercenary',
  'Corporate Lawyer',
  'Survey Tech',
  'Communications Officer',
  'Terraforming Technician',
  'Synthetic',
] as const;

// ─── Original TTBG prompts ─────────────────────────────────────────────────

const MOTIVATIONS = [
  'Paying off a debt that followed them from a colony that no longer exists.',
  'Looking for a sibling who went silent three work cycles ago — last ping was this sector.',
  'Chasing a promotion that has been promised and revoked twice already.',
  'Genuinely believes the company is doing good work out here and is not yet wrong.',
  'Scared to stop moving; staying in one place means time to think.',
  'Wants enough credits to buy passage home and disappear into civilian life.',
  'Protecting someone else on the crew without that person knowing it.',
  'Collecting evidence of something — not yet willing to say what.',
  "Fulfilling a dead crewmate's contract so the family still gets paid.",
  'Bored. This assignment beat sitting in a transit hub for another six months.',
  'Trying to prove something to people who are not watching anymore.',
  'Owes a favor to someone whose name they will not say out loud.',
  'Chasing a scientific lead that the company officially closed and buried.',
  'On a work-release arrangement; the alternative was worse.',
  'The last crew went silent. This person volunteered to find out why.',
  'Making enough to put one more cryo-payment down on land back on Earth.',
  'Following orders that contradict the briefing they were given three weeks ago.',
  'Believes this run will be the one that finally changes things. It always does.',
] as const;

const PHYSICAL_DESCRIPTIONS = [
  'Compact and efficient — moves like they are always rationing energy.',
  'Taller than most doorframes were built for; permanent stoop from years of ducking.',
  'Shaved head, sun-bleached from a posting closer to the star than they wanted.',
  'Hands that look older than the rest of them — work-worn and permanently callused.',
  'The kind of face that stays neutral so long you forget to read it.',
  "Keeps their kit so clean it stands out against everyone else's.",
  'A scar runs jaw to ear — they have answered the question about it so many times they have a short version.',
  'Always has a drink or a container of something in hand; never seems to actually finish it.',
  'Moves quietly for someone their size — people notice when they stop noticing.',
  "Regulation everything: posture, haircut, uniform. You cannot tell if it's discipline or hiding.",
  'Reading glasses perched on their head even when not reading anything.',
  "Looks like they have not slept since the last port. Probably hasn't.",
  'Thick-framed, broad-shouldered; built for a gravity they left behind.',
  'Company-issue clothes three sizes too large — inherited them and never exchanged.',
  'Every surface of their gear is labeled in handwriting that is too small to read standing up.',
  'They blink less than most people. Not dramatically — just enough to notice after a few minutes.',
  'Young enough to look wrong in this context but too competent to say so.',
  'Has a habit of standing slightly too close when they want your attention.',
] as const;

const PERSONALITY_TRAITS = [
  'Gives the impression of being helpful right up until you need something specific.',
  'Casually mentions impossible-sounding past assignments without making them sound like stories.',
  'Goes quiet in groups but cannot stop talking one-on-one.',
  'Asks questions that are too precise to be idle curiosity.',
  'Laughs at everything, including things that are not funny and things that are very bad.',
  'Never starts a disagreement but finishes every one they get pulled into.',
  'Will volunteer for the worst job on the list before anyone else can pass it to them.',
  'Radically practical — emotional responses are something they schedule for after the problem is solved.',
  'Checks equipment twice, people once, and their own back never.',
  'The kind of calm that reads as either extremely competent or completely broken — you cannot tell yet.',
  'Gets visibly uncomfortable when plans change and never says why.',
  'Trusts the person who speaks least in any given room.',
  "Gives detailed unsolicited opinions on food, sleep schedules, and other people's hydration.",
  "Takes notes on a physical pad — refuses to explain why they don't use a data slate.",
  'Makes decisions fast and then pretends to have thought them through.',
  'Holds eye contact just long enough to become a thing.',
  "Mentions the same event from their past in unrelated conversations; doesn't realize they're doing it.",
  "Completely unreadable when they're lying and completely obvious when they're telling the truth.",
] as const;

const HIDDEN_AGENDAS = [
  'Reporting to a company contact the rest of the crew has not been told about.',
  'Here to locate something specific — not the official cargo.',
  'Has been told one of the crew is a liability. Has not been told what to do about it yet.',
  'Looking for an exit from the company that does not involve going through legal channels.',
  "Carrying a sealed order that only opens after a specific event. They don't know the trigger.",
  'The person they claimed to be died eighteen months ago. This identity is borrowed.',
  'Passed intelligence to an outside party before departure. Waiting to see if it catches up with them.',
  'Their contract has a clause they did not read — it was highlighted for someone else.',
  'Was told to keep the crew away from a specific location, without being told the reason.',
  "Owes the ship's owner a debt that is not on any manifest.",
  'Has evidence of a previous incident aboard this same vessel.',
  'Was selected for this crew specifically. Does not know why. That is the thing that worries them.',
  'Running a secondary survey that is not in the briefing documents.',
  "Holds a dead crew member's access credentials and has not reported this to anyone.",
  'Has a personal stake in the destination that predates the company contract by years.',
] as const;

const CREW_RELATIONSHIPS = [
  'Has worked with one of the PCs before. That run ended badly. Neither has brought it up.',
  "Knows something about the crew's last assignment that does not match what they were told.",
  'Was referred by someone the crew trusts. That person cannot currently be reached.',
  'Treats the PCs with professional respect; warm to exactly no one.',
  "Asks about the crew's individual skill sets in ways that feel like intake forms.",
  'Owes a favor to one PC specifically. Has not said which one or what for.',
  'Competed for a position one of the PCs currently holds. Lost. Shows up anyway.',
  'Is new to this kind of work and is watching the crew more than they should be.',
  'Has a habit of backing the crew in arguments with command without being asked to.',
  'Seems to know the ship better than the briefing should have allowed.',
  'Friendly to the crew as a whole, careful never to be alone with any one of them.',
  'Was on a previous run with a crew that did not make it back. Rarely comes up.',
] as const;

// ─── State ─────────────────────────────────────────────────────────────────

type NPCBundle = {
  career: string;
  motivation: string;
  appearance: string;
  personality: string;
  agenda: string | null;
  relationship: string | null;
};

const bundle = ref<NPCBundle | null>(null);
const includeAgenda = ref(true);
const includeRelationship = ref(true);

function generate(): void {
  bundle.value = {
    career: pick(CAREERS),
    motivation: pick(MOTIVATIONS),
    appearance: pick(PHYSICAL_DESCRIPTIONS),
    personality: pick(PERSONALITY_TRAITS),
    agenda: includeAgenda.value ? pick(HIDDEN_AGENDAS) : null,
    relationship: includeRelationship.value ? pick(CREW_RELATIONSHIPS) : null,
  };
}

function clearOutput(): void {
  bundle.value = null;
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Controls -->
    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <button
        type="button"
        class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90"
        @click="generate"
      >
        Generate NPC
      </button>

      <label
        class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
      >
        <input
          v-model="includeAgenda"
          type="checkbox"
          class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
        />
        Include hidden agenda
      </label>

      <label
        class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
      >
        <input
          v-model="includeRelationship"
          type="checkbox"
          class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
        />
        Include crew relationship
      </label>

      <button
        v-if="bundle"
        type="button"
        class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
        @click="clearOutput"
      >
        Clear
      </button>
    </div>

    <!-- Result -->
    <div v-if="bundle" class="flex flex-col gap-4" aria-live="polite">
      <!-- Career badge -->
      <div
        class="inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-brand-primary)] bg-[var(--color-surface-700)] px-4 py-[0.4rem]"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Career</span
        >
        <span class="text-sm font-bold text-[var(--color-brand-primary)]">{{ bundle.career }}</span>
      </div>

      <!-- Main cards grid -->
      <div class="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-4">
        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Motivation</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ bundle.motivation }}
          </p>
        </div>

        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Appearance</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ bundle.appearance }}
          </p>
        </div>

        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Personality</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ bundle.personality }}
          </p>
        </div>
      </div>

      <!-- Optional: hidden agenda -->
      <div
        v-if="bundle.agenda"
        class="flex flex-col gap-2 rounded-lg border border-amber-700/60 bg-amber-950/20 p-4"
      >
        <span class="text-xs font-semibold tracking-[0.06em] text-amber-400 uppercase"
          >Hidden Agenda</span
        >
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ bundle.agenda }}
        </p>
      </div>

      <!-- Optional: crew relationship -->
      <div
        v-if="bundle.relationship"
        class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Crew Relationship</span
        >
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ bundle.relationship }}
        </p>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-6 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <p class="m-0">
        Generate a quick NPC — career, motivation, appearance, personality, and optional hidden
        agenda and crew relationship.
      </p>
    </div>
  </div>
</template>
