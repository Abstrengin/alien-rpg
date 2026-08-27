<script setup lang="ts">
/**
 * AlienRPGCreatureGenerator.vue
 * Creature generator for Alien RPG and Alien RPG – Evolved Edition (Free League Publishing).
 * Body plan, locomotion, natural weapon, and special ability descriptions are original TTBG content.
 */
import { ref } from 'vue';

function d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}
function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

// ─── Size table (creature creation framework) ─────────────────────────────────

interface SizeEntry {
  label: string;
  strength: number;
  description: string;
}

const SIZES: SizeEntry[] = [
  {
    label: 'Tiny',
    strength: 2,
    description: 'Small enough to hide inside standard equipment or ductwork.',
  },
  {
    label: 'Small',
    strength: 3,
    description: 'Roughly the size of a large dog; fast, hard to track.',
  },
  {
    label: 'Medium',
    strength: 4,
    description: 'Human-scale; moves through the same spaces the crew does.',
  },
  {
    label: 'Large',
    strength: 5,
    description: 'Noticeably bigger than a person; restricted by standard doorframes.',
  },
  {
    label: 'Huge',
    strength: 6,
    description: 'Requires open terrain or industrial spaces to move freely.',
  },
  {
    label: 'Colossal',
    strength: 7,
    description: 'Structures are obstacles, not barriers. Encounter from a distance if possible.',
  },
];

// ─── Armor (creature creation framework) ──────────────────────────────────

const ARMOR_DESCRIPTIONS: Record<number, string> = {
  0: 'No natural armor. Soft tissue, exposed.',
  1: 'Thin hide, chitin, or scales; minimal protection.',
  2: 'Thick hide or layered plates; takes a solid hit.',
  3: 'Dense plating or reinforced exoskeleton; small arms are marginal.',
  4: 'Heavy natural armor; most handheld weapons struggle to penetrate.',
  5: 'Exceptional protection, approaching the limits of organic biology.',
};

// ─── Body plans (original TTBG prompts) ───────────────────────────────────

interface BodyPlan {
  label: string;
  description: string;
}

const BODY_PLANS: BodyPlan[] = [
  {
    label: 'Humanoid',
    description:
      'Bilateral symmetry with upright stance, unsettlingly familiar in silhouette but wrong in every detail up close.',
  },
  {
    label: 'Beast',
    description:
      'Low-slung quadruped built for endurance or sudden short-burst speed across open terrain.',
  },
  {
    label: 'Insectoid',
    description:
      'Multi-limbed, segmented, with a chitinous shell that segments and flexes in ways that read as mechanical.',
  },
  {
    label: 'Serpentine',
    description:
      'Elongated, limbless or near-limbless; moves by compression and expansion through narrow spaces.',
  },
  {
    label: 'Aquatic',
    description:
      'Streamlined for fluid environments; on land it is slower but still dangerous and impossible to fully predict.',
  },
  {
    label: 'Formless',
    description:
      'No fixed body plan. Reshapes to fit the immediate environment; edges are always ambiguous.',
  },
  {
    label: 'Radial',
    description:
      'Symmetry radiates outward from a central mass; there is no obvious front or back to orient toward.',
  },
  {
    label: 'Colonial',
    description:
      'What the crew is seeing is not one organism. Many smaller units act as a coordinated whole.',
  },
  {
    label: 'Arboreal',
    description:
      'Built around a canopy or vertical environment; limbs and grips are optimized for overhead travel.',
  },
  {
    label: 'Avian',
    description:
      'Hollow-boned and feathered, scaled, or membranous, lightweight enough to be airborne for extended periods.',
  },
] as const;

// ─── Locomotion (original TTBG prompts) ───────────────────────────────────

interface LocomotionEntry {
  label: string;
  description: string;
}

const LOCOMOTION: LocomotionEntry[] = [
  {
    label: 'Walker',
    description: 'Upright or diagonal ground movement; tracks footsteps, leaves prints.',
  },
  {
    label: 'Crawler',
    description: 'Low to the ground; can traverse ceilings and walls without apparent difficulty.',
  },
  {
    label: 'Flyer',
    description: 'Airborne; approaches from angles ground-level perception does not expect.',
  },
  {
    label: 'Swimmer',
    description: 'Fully aquatic or semi-aquatic; any standing liquid is its domain.',
  },
  {
    label: 'Burrower',
    description: 'Moves through soil, insulation, or soft substrate; approaches from below.',
  },
  {
    label: 'Climber',
    description: 'Uses vertical surfaces freely; height advantages that seem safe are not.',
  },
  {
    label: 'Leaper',
    description: 'Covers distance in sudden explosive jumps; difficult to track between positions.',
  },
  {
    label: 'Phase Shifter',
    description:
      'Moves through materials that should be solid. Mechanisms unclear, effect definite.',
  },
] as const;

// ─── Natural attacks (original TTBG prompts) ──────────────────────────────

interface AttackEntry {
  label: string;
  description: string;
  damage: string;
}

const NATURAL_ATTACKS: AttackEntry[] = [
  {
    label: 'Claws',
    description: 'Raking limb strikes, fast and repeated, designed to open rather than crush.',
    damage: 'Damage 1',
  },
  {
    label: 'Bite',
    description:
      'Jaw or mandible strike; some variants inject paralytic compounds through the wound channel.',
    damage: 'Damage 2',
  },
  {
    label: 'Tail / Spine',
    description: 'Whipping strike or ballistic spine launch; effective at ranges that feel safe.',
    damage: 'Damage 1',
  },
  {
    label: 'Acid Spit',
    description: 'Projected corrosive fluid; destroys equipment and suits before it touches flesh.',
    damage: 'Damage 2, ignores Armor',
  },
  {
    label: 'Crush',
    description:
      'Constriction, pinning, or mass-based compression. Once grabbed, breaking free requires effort.',
    damage: 'Damage 3',
  },
  {
    label: 'Slam',
    description: 'Body-mass collision; knocks targets prone and clears ground in a radius.',
    damage: 'Damage 2, knockback',
  },
  {
    label: 'Sting',
    description: 'Precision puncture weapon, small wound, systemic effect delivered fast.',
    damage: 'Damage 1 + poison',
  },
  {
    label: 'Web / Snare',
    description:
      'Adhesive or filament-based restraint; immobilizes rather than immediately damages.',
    damage: 'Entangle (Agility roll to break free)',
  },
] as const;

// ─── Special abilities (original TTBG prompts) ────────────────────────────

const SPECIAL_ABILITIES = [
  {
    label: 'Acid Blood',
    description:
      'Causing damage to the creature exposes anyone in Close range to a corrosive splash. Armor and equipment take the hit first.',
  },
  {
    label: 'Camouflage',
    description:
      'The creature blends with its environment at rest or in slow movement. Detection requires an Observation roll with a penalty.',
  },
  {
    label: 'Pack Tactics',
    description:
      'Does not hunt alone. Lone sightings are misleading. Others are already in position.',
  },
  {
    label: 'Regeneration',
    description:
      'Recovers one point of Health at the start of each Round. Does not regenerate from fire or acid.',
  },
  {
    label: 'Ambush Predator',
    description:
      'Gets a free attack in the first Round of any encounter if the crew has not actively detected it. Initiative does not apply to this strike.',
  },
  {
    label: 'Terrifying',
    description:
      'Seeing this creature for the first time requires an immediate Panic Roll for any PC in Short range, regardless of their current Stress Level.',
  },
  {
    label: 'Paralyzing Toxin',
    description:
      'A successful attack delivers a fast-acting compound. The target loses one point of Agility per Round until treated.',
  },
  {
    label: 'Armored Carapace',
    description:
      'Immune to Damage 1 attacks. Small arms and personal weapons do not penetrate without a critical hit.',
  },
  {
    label: 'Echolocation / Sensory Web',
    description:
      'Vision is irrelevant to this creature. It tracks heat, vibration, or chemical signature instead. Darkness gives no advantage to the crew.',
  },
  {
    label: 'Parasite Host',
    description:
      'The creature carries a secondary organism (egg, larva, or spore). A successful attack may implant it without the target being aware.',
  },
  {
    label: 'Structural Damage',
    description:
      'Attacks are not aimed at people. The creature targets bulkheads, conduits, and equipment. The environment becomes the weapon.',
  },
  {
    label: 'Fast Mover',
    description:
      'Movement is double the normal rate. Closing distance or fleeing from it is never as straightforward as it looks.',
  },
  {
    label: 'Wall Walker',
    description:
      'Treats vertical and overhead surfaces the same as the floor. Height is not safety.',
  },
  {
    label: 'Hive Mind',
    description:
      'Individual units share awareness. Alerting one alerts all in the local group simultaneously.',
  },
  {
    label: 'Necrotic Wound',
    description:
      'Damage from this creature does not heal naturally. Medical treatment is required before any recovery roll.',
  },
  {
    label: 'Psychic Resonance',
    description:
      'Proximity to this creature causes stress without a visible trigger. PCs in Medium range add +1 to Stress each Round.',
  },
] as const;

// ─── Behavior prompts (original TTBG) ─────────────────────────────────────

const BEHAVIORS = [
  'Territorial: threat displays first, engages if the boundary is crossed again.',
  'Stalking: follows the group without engaging; waits for isolation.',
  'Pack hunter: holds off alone, signals others before committing.',
  'Opportunistic: attacks injured or separated targets, ignores healthy groups.',
  'Nest guardian: passive until something approaches a specific location.',
  'Curious: approaches cautiously; aggression is reactive, not initiating.',
  'Frenzied: no hesitation, no retreat; engages immediately and completely.',
  'Mimic: uses sounds or behavior patterns drawn from earlier victims.',
  'Siege mode: does not pursue; waits outside a safe zone until driven off or it gets in.',
  'Symbiotic: bound to another local organism or structure; protect one, you disturb both.',
] as const;

// ─── State ─────────────────────────────────────────────────────────────────

type CreatureResult = {
  size: SizeEntry;
  armor: number;
  bodyPlan: BodyPlan;
  locomotion: LocomotionEntry;
  attack: AttackEntry;
  specialAbility: (typeof SPECIAL_ABILITIES)[number];
  behavior: string | null;
};

const result = ref<CreatureResult | null>(null);
const includeBehavior = ref(true);

function generate(): void {
  const sizeRoll = d6() - 1; // 0–5 index
  result.value = {
    size: SIZES[sizeRoll]!,
    armor: d6() - 1, // 0–5
    bodyPlan: pick(BODY_PLANS),
    locomotion: pick(LOCOMOTION),
    attack: pick(NATURAL_ATTACKS),
    specialAbility: pick(SPECIAL_ABILITIES),
    behavior: includeBehavior.value ? pick(BEHAVIORS) : null,
  };
}

function clearResult(): void {
  result.value = null;
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
        Generate Creature
      </button>

      <label
        class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
      >
        <input
          v-model="includeBehavior"
          type="checkbox"
          class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
        />
        Include behavior pattern
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

    <!-- Result -->
    <div v-if="result" class="flex flex-col gap-4" aria-live="polite">
      <!-- Stat bar -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Size</span
          >
          <span
            class="text-[1.5rem] leading-none font-extrabold text-[var(--color-brand-red-light)]"
            >{{ result.size.label }}</span
          >
          <span
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ result.size.description }}</span
          >
        </div>
        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Strength</span
          >
          <span
            class="text-[1.5rem] leading-none font-extrabold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ result.size.strength }}</span
          >
          <span
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Base Strength score</span
          >
        </div>
        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Armor</span
          >
          <span
            class="text-[1.5rem] leading-none font-extrabold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ result.armor }}</span
          >
          <span
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ ARMOR_DESCRIPTIONS[result.armor] }}</span
          >
        </div>
        <div
          class="flex flex-col gap-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.05em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Movement</span
          >
          <span
            class="text-[1.5rem] leading-none font-extrabold text-[var(--color-brand-red-light)]"
            >{{ result.locomotion.label }}</span
          >
          <span
            class="mt-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ result.locomotion.description }}</span
          >
        </div>
      </div>

      <!-- Body plan + attack -->
      <div class="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-4">
        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Body Plan</span
          >
          <p
            class="m-0 text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ result.bodyPlan.label }}
          </p>
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ result.bodyPlan.description }}
          </p>
        </div>

        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Natural Attack</span
          >
          <p
            class="m-0 text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ result.attack.label }}
            <span
              class="ml-2 rounded bg-[var(--color-surface-600)] px-[0.4rem] py-[0.1rem] text-xs font-normal text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              {{ result.attack.damage }}
            </span>
          </p>
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ result.attack.description }}
          </p>
        </div>
      </div>

      <!-- Special ability -->
      <div class="flex flex-col gap-2 rounded-lg border border-red-800/50 bg-red-950/20 p-4">
        <span class="text-xs font-semibold tracking-[0.06em] text-red-400 uppercase"
          >Special Ability</span
        >
        <p
          class="m-0 text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ result.specialAbility.label }}
        </p>
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ result.specialAbility.description }}
        </p>
      </div>

      <!-- Behavior -->
      <div
        v-if="result.behavior"
        class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Behavior Pattern</span
        >
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ result.behavior }}
        </p>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-6 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <p class="m-0">
        Generate a creature for your planet. Get size, Strength, Armor, body plan, natural attack,
        and a special ability. Use results with the creature creation rules in your rulebook.
      </p>
    </div>
  </div>
</template>
