<script setup lang="ts">
/**
 * AlienRPGSalvageGenerator.vue
 * Supply & Salvage Generator for Alien RPG and Alien RPG – Evolved Edition (Free League Publishing).
 *
 * Randomises what a crew finds when searching a location.
 * Location types and item prompts are original TTBG content.
 */
import { ref, computed } from 'vue';

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}
function d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}
function d3(): number {
  return Math.ceil(Math.random() * 3);
}

// ─── Location types ────────────────────────────────────────────────────────

const LOCATION_TYPES = [
  'Personal Locker',
  'Crew Quarters',
  'Cargo Bay',
  'Medical Bay',
  'Armory',
  'Engineering Storage',
  'Abandoned Habitat',
  'Derelict Ship',
  'Emergency Cache',
  'Corporate Supply Drop',
] as const;

type LocationType = (typeof LOCATION_TYPES)[number];

// ─── Condition ─────────────────────────────────────────────────────────────

const CONDITIONS = ['Intact', 'Worn', 'Damaged', 'Looted', 'Sealed'] as const;
type Condition = (typeof CONDITIONS)[number];

const CONDITION_DETAIL: Record<Condition, string> = {
  Intact: 'Everything present. Supplies are usable as-is.',
  Worn: 'Functional but visibly aged. Consumables may be reduced by half.',
  Damaged: 'Significant deterioration. Some items non-functional; check each one.',
  Looted: 'Someone got here first. Only overlooked or hidden items remain.',
  Sealed: 'Airtight or locked. Contents are preserved, and whoever sealed it had a reason.',
};

// ─── Item pools per location ───────────────────────────────────────────────

interface ItemEntry {
  name: string;
  detail: string;
  rarity: 'common' | 'uncommon' | 'rare';
}

const POOL: Record<LocationType, ItemEntry[]> = {
  'Personal Locker': [
    {
      name: 'Personal medkit',
      detail: 'Bandages, antiseptic, one stimpack. Well-used.',
      rarity: 'common',
    },
    {
      name: 'Work clothes (spare set)',
      detail: 'Company-branded jumpsuit or civilian clothes, folded.',
      rarity: 'common',
    },
    {
      name: 'Data pad',
      detail: 'Personal notes, messages, and photos. Battery may be low.',
      rarity: 'common',
    },
    {
      name: 'Ration bars (×D6)',
      detail: 'High-calorie, vacuum-sealed. Unpleasant but edible.',
      rarity: 'common',
    },
    {
      name: 'Folding knife',
      detail: 'A tool as much as a weapon. Blade still sharp.',
      rarity: 'common',
    },
    {
      name: 'Personal firearm',
      detail: 'Compact sidearm with one partial magazine. No holster.',
      rarity: 'uncommon',
    },
    {
      name: 'Cash scrip / trade chips',
      detail: 'Small denominations. Enough to buy a round or two.',
      rarity: 'uncommon',
    },
    {
      name: 'Contraband',
      detail:
        "Something the owner didn't want found. Could be narcotics, a banned device, or someone else's property.",
      rarity: 'uncommon',
    },
    {
      name: 'Encrypted data chip',
      detail: 'No label. Small enough to have been hidden deliberately.',
      rarity: 'rare',
    },
    {
      name: 'Personal sidearm + spare mag',
      detail: "Registered. The owner's name is etched on the grip.",
      rarity: 'rare',
    },
  ],

  'Crew Quarters': [
    { name: 'Ration pack (×D6)', detail: 'Standard issue meals, vacuum-sealed.', rarity: 'common' },
    {
      name: 'Sleeping kit',
      detail: 'Compact bedroll, thermal sheet. Smells lived-in.',
      rarity: 'common',
    },
    {
      name: 'Multi-tool',
      detail: 'Twelve functions, most of them useful. One blade is snapped.',
      rarity: 'common',
    },
    {
      name: 'Stim injector (×D3)',
      detail: 'Single-use stimulants. Sharp focus, rough comedown.',
      rarity: 'common',
    },
    { name: 'Personal medkit', detail: 'Bandages, antiseptic, two stimpacks.', rarity: 'common' },
    {
      name: 'Alcohol ration',
      detail: 'Sealed flask. Company-approved quantity.',
      rarity: 'uncommon',
    },
    {
      name: 'Binoculars (compact)',
      detail: 'Short-range optical zoom. Battery-powered night mode.',
      rarity: 'uncommon',
    },
    {
      name: 'Crew manifest fragment',
      detail: 'Partial printout. Names, cabin assignments, shift rotations.',
      rarity: 'uncommon',
    },
    {
      name: 'Hidden stash',
      detail: 'Behind a panel or under a mattress. Roll again for contents.',
      rarity: 'rare',
    },
    {
      name: 'Emergency beacon',
      detail: 'Handheld distress transmitter. Battery full.',
      rarity: 'rare',
    },
  ],

  'Cargo Bay': [
    {
      name: 'Sealed cargo crates (×D3)',
      detail: 'Contents unknown without opening. Manifested or unmarked.',
      rarity: 'common',
    },
    {
      name: 'Industrial hand tools',
      detail: 'Pry bars, bolt cutters, impact driver.',
      rarity: 'common',
    },
    {
      name: 'Packing material',
      detail: 'Foam, strapping, thermal wrap. Could insulate or conceal something.',
      rarity: 'common',
    },
    {
      name: 'Freight loader battery',
      detail: 'Heavy power cell for cargo equipment. Partially charged.',
      rarity: 'common',
    },
    {
      name: 'Contaminated crate',
      detail: 'Bio-hazard tape. Whatever is inside is dead. Or was.',
      rarity: 'uncommon',
    },
    {
      name: 'Fuel cell (partial)',
      detail: 'One standard fuel cell at roughly 40% capacity.',
      rarity: 'uncommon',
    },
    {
      name: 'Spare EVA suit (folded)',
      detail: 'Intact but unserviced. Seals should be tested before use.',
      rarity: 'uncommon',
    },
    {
      name: 'Locked container',
      detail: 'Combination or key lock. No label. Weighs more than it should.',
      rarity: 'uncommon',
    },
    {
      name: "Smuggler's void-space cache",
      detail: 'Hidden behind a false wall. Contents highly variable, and illegal.',
      rarity: 'rare',
    },
    {
      name: 'Weapons crate (sealed)',
      detail: 'Military packaging. Contents match what conflicts were happening nearby.',
      rarity: 'rare',
    },
  ],

  'Medical Bay': [
    {
      name: 'Medkit (full)',
      detail: 'Comprehensive kit: bandages, antiseptic, suture strips, two stimpacks.',
      rarity: 'common',
    },
    {
      name: 'Stimpacks (×D6)',
      detail: 'Single-use auto-injectors. Standard military grade.',
      rarity: 'common',
    },
    {
      name: 'Painkillers',
      detail: 'Oral tablets, blister pack. Dulls pain; impairs fine motor control at high dose.',
      rarity: 'common',
    },
    {
      name: 'Surgical tools',
      detail: 'Clamps, scalpels, retractors. Sterile-packaged.',
      rarity: 'common',
    },
    {
      name: 'IV fluids (saline)',
      detail: 'Two bags. Used for stabilisation and hydration.',
      rarity: 'common',
    },
    {
      name: 'Sedatives',
      detail: 'Injectable. Enough for a full surgical dose or several smaller ones.',
      rarity: 'uncommon',
    },
    {
      name: 'Diagnostic scanner (hand-held)',
      detail: 'Reads vitals, flags trauma, flags contamination. Battery at 60%.',
      rarity: 'uncommon',
    },
    {
      name: 'Anti-toxin injectors (×D3)',
      detail: 'Broad-spectrum. Not tailored for xenobiological agents.',
      rarity: 'uncommon',
    },
    {
      name: 'Cryo-stasis drug kit',
      detail: 'Induces temporary stasis. For emergency medical evacuation.',
      rarity: 'rare',
    },
    {
      name: 'Experimental compound',
      detail: 'Unlabelled vial. Company watermark on the case. No trial data attached.',
      rarity: 'rare',
    },
  ],

  Armory: [
    {
      name: 'Shotgun shells (×D6×3)',
      detail: 'Standard buckshot. Stored in a dry case.',
      rarity: 'common',
    },
    {
      name: 'Pistol magazines (×D3)',
      detail: 'Standard caliber, loaded. Fits most sidearms.',
      rarity: 'common',
    },
    {
      name: 'Combat knife',
      detail: 'Fixed-blade, military pattern. Sheath included.',
      rarity: 'common',
    },
    {
      name: 'Riot shield',
      detail: 'Polycarbonate, full torso coverage. Scratched but solid.',
      rarity: 'common',
    },
    { name: 'Stun baton', detail: 'Non-lethal, rechargeable. Full charge.', rarity: 'common' },
    {
      name: 'Shotgun',
      detail: 'Pump-action, six-round capacity. Sling attached.',
      rarity: 'uncommon',
    },
    {
      name: 'Assault rifle + magazine',
      detail: 'Military pattern. One full magazine, no spare.',
      rarity: 'uncommon',
    },
    {
      name: 'Flamethrower (partial tank)',
      detail: 'Functional. Tank is at roughly half capacity. Handle with care.',
      rarity: 'uncommon',
    },
    {
      name: 'M41A Pulse Rifle',
      detail: 'USCMC pattern. Full magazine, one spare. Grenade launcher empty.',
      rarity: 'rare',
    },
    {
      name: 'Smart gun rig',
      detail: 'Body-mounted tracking system and belt-fed weapon. Heavy. Requires training.',
      rarity: 'rare',
    },
  ],

  'Engineering Storage': [
    {
      name: 'Repair tools (full set)',
      detail: 'Wrenches, calibration tools, soldering kit. Industrial grade.',
      rarity: 'common',
    },
    {
      name: 'Duct tape (×2 rolls)',
      detail: 'Emergency-grade. Rated for vacuum environments.',
      rarity: 'common',
    },
    {
      name: 'Welding torch (fuel partial)',
      detail: 'Cuts and seals. Tank at roughly half capacity.',
      rarity: 'common',
    },
    {
      name: 'Spare fuses and circuit boards',
      detail: 'A mix of ratings. Enough for basic electrical repairs.',
      rarity: 'common',
    },
    {
      name: 'Hydraulic sealant',
      detail: 'Two tubes. Used for patching pipes and pressure seals.',
      rarity: 'common',
    },
    {
      name: 'Power cell (full)',
      detail: 'Standard equipment battery. Compatible with most gear.',
      rarity: 'uncommon',
    },
    {
      name: 'Cutting torch',
      detail: 'Plasma-edge cutter. Breaches most doors and bulkheads.',
      rarity: 'uncommon',
    },
    {
      name: 'Atmospheric sensor',
      detail: 'Detects breathable air, toxins, and pressure. Battery 80%.',
      rarity: 'uncommon',
    },
    {
      name: 'EMP device',
      detail: 'Compact electromagnetic pulse emitter. Single use. Illegal on most stations.',
      rarity: 'rare',
    },
    {
      name: 'Reactor bypass module',
      detail: 'Used to override safety interlocks. Has the look of something custom-built.',
      rarity: 'rare',
    },
  ],

  'Abandoned Habitat': [
    {
      name: 'Emergency ration packs (×D6)',
      detail: 'Long-shelf-life survival rations. Taste of cardboard and regret.',
      rarity: 'common',
    },
    {
      name: 'Water purification tablets',
      detail: 'One foil strip. Enough for a few litres.',
      rarity: 'common',
    },
    {
      name: 'Survival blanket',
      detail: 'Mylar thermal wrap. Compact. Still sealed.',
      rarity: 'common',
    },
    {
      name: 'Personal effects',
      detail: "A previous occupant's belongings: photos, letters, trinkets. No value. All context.",
      rarity: 'common',
    },
    {
      name: 'First aid kit (depleted)',
      detail: 'Most supplies used. Bandages remain. One stimpack taped inside the lid.',
      rarity: 'common',
    },
    {
      name: 'Portable radio transmitter',
      detail: 'Short-range only. Battery drained. Could be recharged.',
      rarity: 'uncommon',
    },
    {
      name: 'Log recorder',
      detail: 'The last entries explain something about why this place is abandoned.',
      rarity: 'uncommon',
    },
    {
      name: 'Improvised weapon',
      detail: 'A makeshift blade or club. Someone needed it badly enough to build it.',
      rarity: 'uncommon',
    },
    {
      name: 'Sealed airlock supply cache',
      detail: "Pre-positioned emergency kit. Whoever placed it didn't come back for it.",
      rarity: 'rare',
    },
    {
      name: 'Distress beacon (active)',
      detail: "Signal has been broadcasting for an unknown duration. Someone hasn't responded yet.",
      rarity: 'rare',
    },
  ],

  'Derelict Ship': [
    {
      name: 'Ship tools (partial set)',
      detail: 'Loose tools in a bay locker. Enough for basic repairs.',
      rarity: 'common',
    },
    {
      name: 'Emergency rations (×D6)',
      detail: 'Survival packs from the emergency locker. Shelf life unknown.',
      rarity: 'common',
    },
    {
      name: 'EVA suit (damaged)',
      detail: 'Suit integrity compromised. Seals cracked. Usable in atmosphere; risky in vacuum.',
      rarity: 'common',
    },
    {
      name: 'Navigation data chip',
      detail: 'Last logged route still intact. Where was this ship going?',
      rarity: 'common',
    },
    {
      name: 'Fuel cells (partial, ×D3)',
      detail: 'Various charge levels. Some drained entirely. Salvageable.',
      rarity: 'common',
    },
    {
      name: 'Personal firearm (crew)',
      detail: 'Found near the remains. One magazine, partially spent.',
      rarity: 'uncommon',
    },
    {
      name: 'Ship log terminal',
      detail: 'Final entries accessible. The last crew had time to record what happened.',
      rarity: 'uncommon',
    },
    {
      name: 'Cryopod (occupied, sealed)',
      detail: 'One pod still running on emergency power. Occupant unknown.',
      rarity: 'uncommon',
    },
    {
      name: 'Black box recorder',
      detail: 'Hardened flight recorder. Everything is in here. So is the liability.',
      rarity: 'rare',
    },
    {
      name: 'Classified cargo manifest',
      detail: 'What was declared, and what was actually aboard, are very different things.',
      rarity: 'rare',
    },
  ],

  'Emergency Cache': [
    {
      name: 'Emergency medkit',
      detail: 'Vacuum-sealed. Full supplies: bandages, antiseptic, four stimpacks.',
      rarity: 'common',
    },
    {
      name: 'Emergency rations (×D6×2)',
      detail: 'Long-shelf-life packs. Marked with a red cross and a date.',
      rarity: 'common',
    },
    {
      name: 'Water ration pouches (×D6)',
      detail: 'Sealed sterile water. Enough for several days.',
      rarity: 'common',
    },
    { name: 'Flashlight (×2)', detail: 'High-output LED. Batteries full.', rarity: 'common' },
    {
      name: 'Survival blankets (×D3)',
      detail: 'Mylar thermal wraps. Compact and effective.',
      rarity: 'common',
    },
    {
      name: 'Signal flares (×4)',
      detail: 'Atmospheric only. Burns bright orange for 90 seconds.',
      rarity: 'uncommon',
    },
    {
      name: 'Emergency beacon',
      detail: 'Distress transmitter. Press and hold to activate. Long-range.',
      rarity: 'uncommon',
    },
    {
      name: 'Compact firearm + ammo',
      detail: 'Standard cache sidearm. Two magazines. For emergencies.',
      rarity: 'uncommon',
    },
    {
      name: 'Escape pod activation key',
      detail: 'Magnetic key with serial number. One assigned pod. Where is it docked?',
      rarity: 'rare',
    },
    {
      name: 'Sealed orders envelope',
      detail:
        "Instructions from a chain of command that may no longer exist. Someone's contingency plan.",
      rarity: 'rare',
    },
  ],

  'Corporate Supply Drop': [
    {
      name: 'Ration cases (×D6 cases)',
      detail: 'Branded packaging. Contents meet the minimum caloric standard.',
      rarity: 'common',
    },
    {
      name: 'Standard medkits (×D3)',
      detail: 'Corporate-issue. Functional but not stocked for trauma care.',
      rarity: 'common',
    },
    {
      name: 'Company-issue work gear',
      detail: 'Helmets, gloves, high-vis vests. PPE checked to box-ticking standard.',
      rarity: 'common',
    },
    {
      name: 'Communications handset (×D3)',
      detail: 'Short-range radios. Pre-set to a company channel.',
      rarity: 'common',
    },
    {
      name: 'Survey equipment',
      detail: 'Ground-coring drill, sample containers, atmospheric probe.',
      rarity: 'common',
    },
    {
      name: 'Company-issued sidearms (×D3)',
      detail: 'Standard security pistols with two magazines each. Serialised.',
      rarity: 'uncommon',
    },
    {
      name: 'Power generator (portable)',
      detail: 'Fuel-cell generator. Enough to run a forward outpost for 72 hours.',
      rarity: 'uncommon',
    },
    {
      name: 'Research specimens (sealed)',
      detail: 'Biohazard-marked containers. The field notes are missing.',
      rarity: 'uncommon',
    },
    {
      name: 'Encrypted company terminal',
      detail:
        "Requires credentials. Someone in the company's chain of command has the access codes.",
      rarity: 'rare',
    },
    {
      name: 'Classified cargo (no manifest)',
      detail: 'Marked only with a project code. No description. No assigned recipient listed.',
      rarity: 'rare',
    },
  ],
};

// ─── Rarity config ─────────────────────────────────────────────────────────

const RARITY_LABEL: Record<ItemEntry['rarity'], string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
};

const RARITY_COLOR: Record<ItemEntry['rarity'], string> = {
  common:
    'text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]',
  uncommon: 'text-yellow-400',
  rare: 'text-[var(--color-brand-red-light)]',
};

const RARITY_DOT: Record<ItemEntry['rarity'], string> = {
  common: 'bg-[var(--color-surface-400)]',
  uncommon: 'bg-yellow-400',
  rare: 'bg-[var(--color-brand-red-light)]',
};

// ─── Item count by condition ───────────────────────────────────────────────

function itemCountForCondition(condition: Condition): number {
  switch (condition) {
    case 'Intact':
      return 3 + d3(); // 4–6
    case 'Worn':
      return 2 + d3(); // 3–5
    case 'Damaged':
      return 1 + d3(); // 2–4
    case 'Looted':
      return d3(); // 1–3
    case 'Sealed':
      return 3 + d3(); // 4–6
  }
}

// ─── Weight rare items for Intact/Sealed, exclude for Looted ──────────────

function weightedPick(pool: ItemEntry[], condition: Condition): ItemEntry {
  let filtered = pool;
  if (condition === 'Looted') {
    // Rare items were taken first; bias heavily toward uncommon/common
    filtered = pool.filter((i) => i.rarity !== 'rare' || Math.random() < 0.15);
    if (!filtered.length) filtered = pool;
  }
  return pick(filtered);
}

// ─── State ─────────────────────────────────────────────────────────────────

interface SalvageResult {
  location: LocationType;
  condition: Condition;
  conditionDetail: string;
  items: ItemEntry[];
}

const locationType = ref<LocationType>('Cargo Bay');
const condition = ref<Condition>('Intact');
const randomiseLocation = ref(false);
const randomiseCondition = ref(false);
const result = ref<SalvageResult | null>(null);

function generate(): void {
  const loc = randomiseLocation.value
    ? pick(LOCATION_TYPES as unknown as LocationType[])
    : locationType.value;
  const cond = randomiseCondition.value
    ? pick(CONDITIONS as unknown as Condition[])
    : condition.value;

  const pool = POOL[loc];
  const count = itemCountForCondition(cond);

  // Pick without replacement
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const picked: ItemEntry[] = [];
  const used = new Set<string>();

  for (const item of shuffled) {
    if (picked.length >= count) break;
    const key = item.name;
    if (used.has(key)) continue;
    // Apply looted weighting
    if (cond === 'Looted' && item.rarity === 'rare' && Math.random() > 0.15) continue;
    used.add(key);
    picked.push(item);
  }
  // Fallback if looted filter removed too many
  if (!picked.length) picked.push(pick(pool));

  result.value = {
    location: loc,
    condition: cond,
    conditionDetail: CONDITION_DETAIL[cond],
    items: picked,
  };

  // Sync selectors if randomised
  if (randomiseLocation.value) locationType.value = loc;
  if (randomiseCondition.value) condition.value = cond;
}

const resultItemCount = computed(() => result.value?.items.length ?? 0);
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- ── Controls ── -->
    <div class="flex flex-col gap-5">
      <!-- Row 1: Location + Condition -->
      <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <!-- Location -->
        <div class="flex min-w-[200px] flex-1 flex-col gap-[0.375rem]">
          <div class="flex items-center justify-between gap-2">
            <label
              for="salvage-location"
              class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >Location</label
            >
            <label class="flex cursor-pointer items-center gap-[0.35rem]">
              <input
                v-model="randomiseLocation"
                type="checkbox"
                class="accent-[var(--color-brand-primary)]"
              />
              <span
                class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                >Randomise</span
              >
            </label>
          </div>
          <select
            id="salvage-location"
            v-model="locationType"
            :disabled="randomiseLocation"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-sm text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-50 [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option v-for="loc in LOCATION_TYPES" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>

        <!-- Condition -->
        <div class="flex min-w-[160px] flex-1 flex-col gap-[0.375rem]">
          <div class="flex items-center justify-between gap-2">
            <label
              for="salvage-condition"
              class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >Condition</label
            >
            <label class="flex cursor-pointer items-center gap-[0.35rem]">
              <input
                v-model="randomiseCondition"
                type="checkbox"
                class="accent-[var(--color-brand-primary)]"
              />
              <span
                class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                >Randomise</span
              >
            </label>
          </div>
          <select
            id="salvage-condition"
            v-model="condition"
            :disabled="randomiseCondition"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-sm text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-50 [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option v-for="cond in CONDITIONS" :key="cond" :value="cond">{{ cond }}</option>
          </select>
        </div>
      </div>

      <!-- Row 2: Generate button -->
      <button
        type="button"
        class="w-fit cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90"
        @click="generate"
      >
        Search Location
      </button>
    </div>

    <!-- ── Result ── -->
    <div v-if="result" class="flex flex-col gap-4" aria-live="polite">
      <!-- Location + condition header -->
      <div
        class="flex flex-col gap-[0.25rem] rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] px-4 py-3"
      >
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            class="text-base font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ result.location }}</span
          >
          <span
            class="rounded-full border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-[0.2rem] text-xs font-semibold"
            :class="{
              'text-green-400': result.condition === 'Intact' || result.condition === 'Sealed',
              'text-yellow-400': result.condition === 'Worn',
              'text-orange-400': result.condition === 'Damaged',
              'text-red-400': result.condition === 'Looted',
            }"
            >{{ result.condition }}</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ resultItemCount }} item{{ resultItemCount !== 1 ? 's' : '' }} found</span
          >
        </div>
        <p
          class="m-0 text-xs leading-[1.5] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          {{ result.conditionDetail }}
        </p>
      </div>

      <!-- Items list -->
      <div class="flex flex-col gap-[0.35rem]">
        <div
          v-for="item in result.items"
          :key="item.name"
          class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] px-4 py-3"
        >
          <div class="flex flex-wrap items-start gap-x-2 gap-y-1">
            <!-- Rarity dot -->
            <span
              class="mt-[0.35rem] h-[0.45rem] w-[0.45rem] shrink-0 rounded-full"
              :class="RARITY_DOT[item.rarity]"
              :title="RARITY_LABEL[item.rarity]"
            ></span>

            <!-- Item name -->
            <span
              class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{ item.name }}</span
            >

            <!-- Rarity label -->
            <span class="text-xs font-medium" :class="RARITY_COLOR[item.rarity]">{{
              RARITY_LABEL[item.rarity]
            }}</span>
          </div>
          <p
            class="m-0 mt-[0.2rem] pl-[1.1rem] text-xs leading-[1.5] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{ item.detail }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── Empty state ── -->
    <div
      v-else
      class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-6 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <p class="m-0">
        Choose a location and condition, then hit <strong>Search Location</strong> to see what the
        crew finds.
      </p>
    </div>
  </div>
</template>
