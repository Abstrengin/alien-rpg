<script setup lang="ts">
/**
 * AlienRPGSalvageGenerator.vue
 * Supply & Salvage Generator for the ALIEN RPG.
 *
 * The item catalogue reproduces the gear tables from the rulebooks (weight, cost,
 * effect, and air/power supply ratings), and the supply roll panel follows the
 * Consumables rules. Published by Free League.
 * Location types, condition tiers and site detail are original TTBG content.
 */
import { ref, computed } from 'vue';
import { useEdition } from '@/shared/edition';

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}
function d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

type Edition = 'evolved' | 'core';

// ─── Gear catalogue ──────────────────────────────────────────────────────────

type Category =
  | 'Pistols'
  | 'Rifles'
  | 'Heavy weapons'
  | 'Close combat'
  | 'Suits & armor'
  | 'Data storage'
  | 'Diagnostics & display'
  | 'Vision devices'
  | 'Tools'
  | 'Medical supplies'
  | 'Pharmaceuticals'
  | 'Food & drink';

type Item = {
  name: string;
  category: Category;
  /** Encumbrance in item slots. 0 is a tiny item, null cannot be carried at all. */
  weight: number | null;
  weightLabel: string;
  /** Numeric value used for the haul total. Null where the book prints a range or "varies". */
  value: number | null;
  costLabel: string;
  effect: string;
  air?: number;
  power?: number;
  /** Firearms can be reloaded; the book prices a reload at 5% of the weapon. */
  firearm?: boolean;
  onlyIn?: Edition;
  /** Values the Evolved Edition prints differently. */
  evolved?: Partial<Pick<Item, 'value' | 'costLabel' | 'effect' | 'power'>>;
};

const CATALOGUE: readonly Item[] = [
  // Pistols
  { name: 'M4A3 Service Pistol', category: 'Pistols', weight: 0.5, weightLabel: '½', value: 200, costLabel: '$200', effect: 'Bonus +2, damage 1, Medium range', firearm: true },
  { name: '.357 Magnum Revolver', category: 'Pistols', weight: 1, weightLabel: '1', value: 300, costLabel: '$300', effect: 'Bonus +1, damage 2, Medium range', firearm: true },
  { name: 'Rexim RXF-M5 EVA Pistol', category: 'Pistols', weight: 0.5, weightLabel: '½', value: 400, costLabel: '$400', effect: 'Bonus +1, damage 1, Medium range, armor piercing', firearm: true },
  { name: 'Watatsumi DV-303 Bolt Gun', category: 'Pistols', weight: 1, weightLabel: '1', value: 400, costLabel: '$400', effect: 'Damage 3, Short range, armor piercing, single-shot', firearm: true },
  { name: 'Weyland ES-4 Electrostatic Pistol', category: 'Pistols', weight: 0.5, weightLabel: '½', value: 1000, costLabel: '$1,000', effect: 'Bonus +1, damage 1 (stun), armor piercing', firearm: true, onlyIn: 'evolved' },

  // Rifles
  { name: 'Armat M41A Pulse Rifle', category: 'Rifles', weight: 1, weightLabel: '1', value: 800, costLabel: '$800', effect: 'Bonus +1, damage 2, Long range, armor piercing, full auto', firearm: true },
  { name: 'AK-4047 Pulse Assault Rifle', category: 'Rifles', weight: 1, weightLabel: '1', value: 500, costLabel: '$500', effect: 'Damage 2, Long range, full auto', firearm: true },
  { name: 'M42A Scope Rifle', category: 'Rifles', weight: 1, weightLabel: '1', value: 1000, costLabel: '$1,000', effect: 'Bonus +2, damage 2, Extreme range, armor piercing', firearm: true },
  { name: 'Armat Model 37A2 12 Gauge Pump Action', category: 'Rifles', weight: 1, weightLabel: '1', value: 500, costLabel: '$500', effect: 'Bonus +2, damage 3, Short range, armor doubled', firearm: true },
  { name: 'SpaceSub ASSO-400 Harpoon Grappling Gun', category: 'Rifles', weight: 1, weightLabel: '1', value: 300, costLabel: '$300', effect: 'Damage 1, Medium range, armor doubled, single-shot', firearm: true },
  { name: 'Armat XM99A Phased Plasma Pulse Rifle', category: 'Rifles', weight: 2, weightLabel: '2', value: 20000, costLabel: '$20,000', effect: 'Damage 4, Extreme range, armor piercing', power: 5, firearm: true },

  // Heavy weapons
  { name: 'Armat U1 Grenade Launcher', category: 'Heavy weapons', weight: 0.5, weightLabel: '½', value: 600, costLabel: '$600', effect: 'Bonus +1, Blast 9, Long range, takes other grenade types', firearm: true },
  { name: 'Armat M41AE2 Heavy Pulse Rifle', category: 'Heavy weapons', weight: 2, weightLabel: '2', value: 1500, costLabel: '$1,500', effect: 'Bonus +1, damage 3, Extreme range, armor piercing, full auto', firearm: true },
  { name: 'M56A2 Smart Gun', category: 'Heavy weapons', weight: 3, weightLabel: '3', value: 6000, costLabel: '$6,000', effect: 'Bonus +3, damage 3, Long range, armor piercing, full auto', firearm: true },
  { name: 'M240 Incinerator Unit', category: 'Heavy weapons', weight: 1, weightLabel: '1', value: 500, costLabel: '$500', effect: 'Damage 2, Medium range, sets the target on fire (Intensity 9)', firearm: true },
  { name: 'UA 571-C Sentry Gun', category: 'Heavy weapons', weight: null, weightLabel: '—', value: 12000, costLabel: '$12,000', effect: 'Bonus +2, damage 4, Extreme range, fires with RANGED COMBAT 8. Too heavy to carry.' },
  { name: 'G2 Electroshock Grenade', category: 'Heavy weapons', weight: 0.5, weightLabel: '½', value: 400, costLabel: '$400', effect: 'Stun effect (−2), Medium range when thrown' },

  // Close combat
  { name: 'Blunt instrument', category: 'Close combat', weight: 1, weightLabel: '1', value: null, costLabel: 'No value', effect: 'Bonus +1, damage 1' },
  { name: 'Knife', category: 'Close combat', weight: 0.5, weightLabel: '½', value: 50, costLabel: '$50', effect: 'Damage 2' },
  { name: 'Stun Baton', category: 'Close combat', weight: 0.5, weightLabel: '½', value: 80, costLabel: '$80', effect: 'Bonus +1, damage 1, stun effect', power: 5, evolved: { power: 2 } },
  { name: 'Mechanical Cutting Torch', category: 'Close combat', weight: 1, weightLabel: '1', value: 300, costLabel: '$300', effect: 'Damage 3, armor piercing. Doubles as a tool (HEAVY MACHINERY +2).', power: 5, evolved: { power: 3 } },

  // Suits & armor
  { name: 'M3 Personnel Armor', category: 'Suits & armor', weight: 1, weightLabel: '1', value: 1200, costLabel: '$1,200', effect: 'Armor Rating 6. Built-in comm unit and PDT.', evolved: { effect: 'Armor Level 2. Built-in comm unit and PDT.' } },
  { name: 'IRC Mk.50 Compression Suit', category: 'Suits & armor', weight: 1, weightLabel: '1', value: 15000, costLabel: '$15,000', effect: 'Armor Rating 2, vacuum protection, MOBILITY −1', air: 5, evolved: { value: 4000, costLabel: '$4,000', effect: 'Vacuum protection, comm unit, head light, MOBILITY −1' } },
  { name: 'IRC Mk.35 Pressure Suit', category: 'Suits & armor', weight: 2, weightLabel: '2', value: 2000, costLabel: '$2,000', effect: 'Armor Rating 5, vacuum protection, MOBILITY −2', air: 4, evolved: { effect: 'Armor Level 1, vacuum protection, MOBILITY −2' } },
  { name: 'Eco All-World Survival Suit', category: 'Suits & armor', weight: 2, weightLabel: '2', value: 30000, costLabel: '$30,000', effect: 'Armor Rating 4, EVA hardsuit with its own thrusters', air: 6, evolved: { effect: 'Armor Level 2, vacuum protection, comm unit, head light, MOBILITY +2 in zero-G' } },
  { name: 'Weyland-Yutani APEsuit', category: 'Suits & armor', weight: 1, weightLabel: '1', value: 5000, costLabel: '$5,000', effect: 'Armor Rating 3, SURVIVAL +3, impervious to caustic substances', air: 4, evolved: { effect: 'Armor Level 1 (3 against acid), SURVIVAL +2, protects the wearer against facehugs' } },
  { name: 'Kevlar Riot Vest', category: 'Suits & armor', weight: 0.5, weightLabel: '½', value: 600, costLabel: '$600', effect: 'Armor Level 1. Standard for colonial law enforcement and security.', onlyIn: 'evolved' },
  { name: 'P-5000 Power Loader', category: 'Suits & armor', weight: null, weightLabel: '—', value: 50000, costLabel: '$50,000', effect: 'Armor Rating 3, HEAVY MACHINERY and CLOSE COMBAT +3. Needs HEAVY MACHINERY 2 to operate.' },

  // Data storage
  { name: 'Long-Data Disc', category: 'Data storage', weight: 0, weightLabel: 'Tiny', value: 30, costLabel: '$30', effect: 'Holds up to 10 zettabytes of data' },
  { name: 'Magnetic Tape', category: 'Data storage', weight: 0, weightLabel: 'Tiny', value: 5, costLabel: '$5', effect: 'Holds up to 120 terabytes. Produces no detectable wave signal.' },

  // Diagnostics & display
  { name: 'Computer Terminal', category: 'Diagnostics & display', weight: null, weightLabel: '—', value: null, costLabel: 'Varies', effect: 'Access and process data (COMTECH roll)' },
  { name: 'PR-PUT Uplink Terminal', category: 'Diagnostics & display', weight: 1, weightLabel: '1', value: 9000, costLabel: '$9,000', effect: 'Remote control a spacecraft (COMTECH roll)' },
  { name: 'Seegson C-Series Magnetic Tape Recorder', category: 'Diagnostics & display', weight: 0.5, weightLabel: '½', value: null, costLabel: '$50–$100', effect: 'Record and play music (MANIPULATION +1)' },
  { name: 'Samani E-Series Watch', category: 'Diagnostics & display', weight: 0, weightLabel: 'Tiny', value: 50, costLabel: '$50', effect: 'Tracks time, oxygen and pressure levels (SURVIVAL +1)' },
  { name: 'Personal Data Transmitter', category: 'Diagnostics & display', weight: 0, weightLabel: 'Tiny', value: 100, costLabel: '$100', effect: 'Monitors location and vitals' },
  { name: 'IFF Transponder', category: 'Diagnostics & display', weight: 0, weightLabel: 'Tiny', value: 250, costLabel: '$250', effect: 'Prevents Sentry Gun friendly fire' },
  { name: 'Data Transmitter Cards', category: 'Diagnostics & display', weight: 0, weightLabel: 'Tiny', value: 50, costLabel: '$50', effect: 'Transfer of audiovisual data' },
  { name: 'Seegson P-DAT', category: 'Diagnostics & display', weight: 0.5, weightLabel: '½', value: 500, costLabel: '$500', effect: 'Coordinate info for field teams' },
  { name: 'Seegson System Diagnostic Device', category: 'Diagnostics & display', weight: 1, weightLabel: '1', value: 300, costLabel: '$300', effect: 'Troubleshoot computer systems (COMTECH +2)' },
  { name: 'HoloTab', category: 'Diagnostics & display', weight: null, weightLabel: '—', value: 100000, costLabel: '$100,000', effect: 'Strategic analysis platform (COMMAND +2)' },
  { name: 'Modular Computing Device', category: 'Diagnostics & display', weight: null, weightLabel: '—', value: 8000, costLabel: '$8,000', effect: 'Full audiovisual holographic projector' },

  // Vision devices
  { name: 'Optical Scope', category: 'Vision devices', weight: 0, weightLabel: 'Tiny', value: 60, costLabel: '$60', effect: 'Increases a weapon range one category, aimed shots only' },
  { name: 'Hi-beam Flashlight', category: 'Vision devices', weight: 0.5, weightLabel: '½', value: 45, costLabel: '$45', effect: 'Removes the effect of darkness in a zone' },
  { name: 'Binoculars', category: 'Vision devices', weight: 0.5, weightLabel: '½', value: 100, costLabel: '$100', effect: 'OBSERVATION +2 at Long range or more' },
  { name: 'M314 Motion Tracker', category: 'Vision devices', weight: 1, weightLabel: '1', value: 1200, costLabel: '$1,200', effect: 'Detects movement, Long range indoors', power: 5 },
  { name: 'M316 Motion Tracker', category: 'Vision devices', weight: 0, weightLabel: 'Tiny', value: 3000, costLabel: '$3,000', effect: 'Detects movement, Medium range indoors', power: 5 },
  { name: 'Head-Mounted Sight', category: 'Vision devices', weight: 0.5, weightLabel: '½', value: 200, costLabel: '$200', effect: 'Remote control of a Sentry Gun' },
  { name: 'Neuro Visor', category: 'Vision devices', weight: 1, weightLabel: '1', value: 10000, costLabel: '$10,000', effect: 'Monitor and interface with a hypersleeping subject' },
  { name: '"Pups" Mapping Device', category: 'Vision devices', weight: 1, weightLabel: '1', value: 50000, costLabel: '$50,000 each', effect: 'Scans one zone per round' },
  { name: 'Seegson Microview-2000SE', category: 'Vision devices', weight: null, weightLabel: '—', value: null, costLabel: '$25,000 per deck', effect: 'Location tracking' },

  // Tools
  { name: 'Maintenance Jack', category: 'Tools', weight: 1, weightLabel: '1', value: 150, costLabel: '$150', effect: 'HEAVY MACHINERY +1. Opens unpowered airlocks and diverts power.' },
  { name: 'Electronic Tools', category: 'Tools', weight: 0.5, weightLabel: '½', value: 250, costLabel: '$250', effect: 'COMTECH +1 in relevant situations' },
  { name: 'Power Cell', category: 'Tools', weight: 0.5, weightLabel: '½', value: 30, costLabel: '$30', effect: 'Restores an item to full power supply', onlyIn: 'evolved' },

  // Medical supplies
  { name: 'Personal Medkit', category: 'Medical supplies', weight: 0.25, weightLabel: '¼', value: 50, costLabel: '$50', effect: 'MEDICAL AID +2 for first aid. Single use.' },
  { name: 'Surgical Kit', category: 'Medical supplies', weight: 0.5, weightLabel: '½', value: null, costLabel: '$25–$200', effect: 'MEDICAL AID +1 to prevent death. Base damage 2 as a weapon.', evolved: { value: 200, costLabel: '$200', effect: 'MEDICAL AID +2 for first aid and surgery on critical injuries. Base damage 2 as a weapon.' } },
  { name: 'AutoDoc', category: 'Medical supplies', weight: null, weightLabel: '—', value: 500000, costLabel: '$500,000', effect: 'Automated treatment, MEDICAL AID 6. Cannot perform complicated surgery.', evolved: { effect: 'Automated treatment, MEDICAL AID 8. Cannot treat critical injuries needing surgery.' } },
  { name: 'Pauling MedPod', category: 'Medical supplies', weight: null, weightLabel: '—', value: 2000000, costLabel: '$2,000,000', effect: 'Autonomous surgical unit, MEDICAL AID 10 (cannot push)', evolved: { effect: 'Autonomous surgical unit, MEDICAL AID 12 (cannot push)' } },

  // Pharmaceuticals
  { name: 'Neversleep pills (one dose)', category: 'Pharmaceuticals', weight: 0, weightLabel: 'Tiny', value: 2, costLabel: '$2', effect: 'Stress level +1, removes the need for sleep for a day. No stress relief that day.' },
  { name: 'Hydr8tion (one dose)', category: 'Pharmaceuticals', weight: 0, weightLabel: 'Tiny', value: 5, costLabel: '$5', effect: 'Eliminates the fatigue from hypersleep. No side effects.' },
  { name: 'Naproleve (one dose)', category: 'Pharmaceuticals', weight: 0, weightLabel: 'Tiny', value: 20, costLabel: '$20', effect: 'Reduces stress level to zero. A second dose in the same shift gives −1 to all skill rolls.' },
  { name: 'Recreational drugs', category: 'Pharmaceuticals', weight: 0, weightLabel: 'Tiny', value: null, costLabel: '$5–$60,000', effect: 'Typically stress level +1 or −1, with a hangover penalty on repeat doses' },
  { name: 'X-Drugs', category: 'Pharmaceuticals', weight: 0, weightLabel: 'Tiny', value: null, costLabel: 'Varies', effect: 'Boost strength, endurance and the senses. Prolonged use causes hallucinations, seizures, psychosis, stroke.' },

  // Food & drink
  { name: 'Prefab meal', category: 'Food & drink', weight: 0.25, weightLabel: '¼', value: 10, costLabel: '$10', effect: 'Food Supply +1', evolved: { effect: 'Satisfies food needs for one day' } },
  { name: 'Water bottle', category: 'Food & drink', weight: 0.25, weightLabel: '¼', value: null, costLabel: '$2–$100', effect: 'Water Supply +1', evolved: { effect: 'Satisfies water needs for one day' } },
  { name: '"Bug juice" protein drink', category: 'Food & drink', weight: 0.25, weightLabel: '¼', value: 5, costLabel: '$5', effect: 'Food and Water Supply +1' },
  { name: 'Carbonated beverage', category: 'Food & drink', weight: 0.25, weightLabel: '¼', value: 2, costLabel: '$2', effect: 'Water Supply +1' },
  { name: 'Candy bar', category: 'Food & drink', weight: 0.25, weightLabel: '¼', value: 15, costLabel: '$15', effect: 'Satisfies food needs for one day', onlyIn: 'evolved' },
  { name: 'Colony specialty meal', category: 'Food & drink', weight: 0.25, weightLabel: '¼', value: null, costLabel: '$20–$300', effect: 'Satisfies food needs for one day, stress level −1', onlyIn: 'evolved' },
  { name: 'Aspen beer (or worse)', category: 'Food & drink', weight: 0.25, weightLabel: '¼', value: null, costLabel: 'Varies', effect: 'Watered down and tastes like piss, but it gets the job done', onlyIn: 'evolved' },
];

// ─── Locations ───────────────────────────────────────────────────────────────

type LocationDef = {
  name: string;
  categories: readonly Category[];
  detail: readonly string[];
};

const LOCATIONS: readonly LocationDef[] = [
  {
    name: 'Personal Locker',
    categories: ['Pharmaceuticals', 'Food & drink', 'Data storage', 'Diagnostics & display', 'Close combat', 'Pistols'],
    detail: [
      'The name stencil has been scratched off and redone twice.',
      'Someone taped a photo inside the door. The face has been cut out.',
      'A shift roster is pinned inside, with the last four weeks crossed through.',
      'It was already open. The lock plate is bent outward, not inward.',
    ],
  },
  {
    name: 'Crew Quarters',
    categories: ['Food & drink', 'Pharmaceuticals', 'Data storage', 'Diagnostics & display', 'Vision devices', 'Close combat'],
    detail: [
      'The bunk is made. Nobody makes a bunk before an emergency.',
      'Two mattresses have been dragged into one corner, away from the vent.',
      'A tape recorder is still running, hours into silence.',
      'Someone has written a countdown on the bulkhead in grease pencil.',
    ],
  },
  {
    name: 'Cargo Bay',
    categories: ['Tools', 'Food & drink', 'Suits & armor', 'Diagnostics & display'],
    detail: [
      'Half the pallets are strapped for a burn that never happened.',
      'The manifest on the wall does not match the crate count. It is short by two.',
      'A power loader sits mid-lift, still gripping nothing.',
      'Cargo netting has been cut, not unclipped.',
    ],
  },
  {
    name: 'Medical Bay',
    categories: ['Medical supplies', 'Pharmaceuticals', 'Diagnostics & display'],
    detail: [
      'The autodoc is mid-cycle with no patient in it.',
      'Restraint straps on the table are cut through from the inside.',
      'Someone logged the same vitals every hour for two days, then stopped.',
      'The sharps bin is overflowing. Nobody emptied it.',
    ],
  },
  {
    name: 'Armory',
    categories: ['Pistols', 'Rifles', 'Heavy weapons', 'Close combat', 'Suits & armor'],
    detail: [
      'The rack log shows three weapons signed out and none signed back.',
      'The door was secured from the inside.',
      'Spent casings on the floor, but no scoring on the walls.',
      'Someone stacked crates against the door and then moved them again.',
    ],
  },
  {
    name: 'Engineering Storage',
    categories: ['Tools', 'Diagnostics & display', 'Vision devices', 'Suits & armor'],
    detail: [
      'A maintenance schedule board is filled in three weeks ahead in the same hand.',
      'The coolant smell is stronger in here than the readouts admit.',
      'Someone has removed every ladder from the compartment.',
      'A junction panel is open with the tools still inside it.',
    ],
  },
  {
    name: 'Abandoned Habitat',
    categories: ['Food & drink', 'Pharmaceuticals', 'Tools', 'Data storage', 'Vision devices'],
    detail: [
      'The heating still runs. The atmosphere plant is still ticking over.',
      'Dust lies evenly except on one chair.',
      'Every internal door has been left open and wedged.',
      'The colony log ends mid-sentence, in the middle of a supply requisition.',
    ],
  },
  {
    name: 'Derelict Ship',
    categories: ['Tools', 'Suits & armor', 'Diagnostics & display', 'Data storage', 'Vision devices', 'Close combat'],
    detail: [
      'The distress beacon is on a repeating loop with no voice on it.',
      'Hypersleep pods are open. All of them. From the inside.',
      "MU/TH/UR answers, but only about the weather at a colony that isn't here.",
      'The reactor is at idle. Someone throttled it back deliberately.',
    ],
  },
  {
    name: 'Emergency Cache',
    categories: ['Food & drink', 'Medical supplies', 'Vision devices', 'Suits & armor', 'Pharmaceuticals'],
    detail: [
      'The seal is intact and the inspection date is eleven years past.',
      'Someone has already been here and put everything back neatly.',
      'The inventory card lists two items that are not in the box.',
      'It is bolted down harder than a cache this cheap deserves.',
    ],
  },
  {
    name: 'Corporate Supply Drop',
    categories: ['Diagnostics & display', 'Data storage', 'Medical supplies', 'Pharmaceuticals', 'Tools', 'Vision devices'],
    detail: [
      'Marked with a project code and no destination.',
      'The drop was logged to a colony that closed two years ago.',
      'Everything is company-new and nothing is company-branded.',
      'A clause on the packing slip forbids opening it. It is already open.',
    ],
  },
];

// ─── Conditions ──────────────────────────────────────────────────────────────

type ConditionDef = {
  name: string;
  detail: string;
  /** Supply ratings on anything found are reduced by this much. */
  supplyPenalty: number;
  /** Suggested resale multiplier applied to the haul value. */
  valueMultiplier: number;
  /** Looted sites have already been stripped of the good stuff. */
  valueCeiling: number | null;
  min: number;
  max: number;
};

const CONDITIONS: readonly ConditionDef[] = [
  { name: 'Intact', detail: 'Everything present and serviceable. Supply ratings are as printed.', supplyPenalty: 0, valueMultiplier: 1, valueCeiling: null, min: 4, max: 6 },
  { name: 'Worn', detail: 'Functional but visibly aged. Knock one off every supply rating.', supplyPenalty: 1, valueMultiplier: 0.75, valueCeiling: null, min: 3, max: 5 },
  { name: 'Damaged', detail: 'Significant deterioration. Knock two off every supply rating, and check each item before trusting it.', supplyPenalty: 2, valueMultiplier: 0.5, valueCeiling: null, min: 2, max: 4 },
  { name: 'Looted', detail: 'Someone got here first and took anything worth carrying. Only the overlooked remains.', supplyPenalty: 0, valueMultiplier: 1, valueCeiling: 5000, min: 1, max: 3 },
  { name: 'Sealed', detail: 'Airtight or locked, so the contents are preserved. Whoever sealed it had a reason.', supplyPenalty: 0, valueMultiplier: 1, valueCeiling: null, min: 4, max: 6 },
];

// ─── Consumables reference ───────────────────────────────────────────────────

const CONSUMABLES: Record<Edition, readonly { name: string; interval: string }[]> = {
  evolved: [
    { name: 'Air', interval: 'After every stretch, and after strenuous activity like combat or a MOBILITY roll.' },
    { name: 'Ammo', interval: 'After firing your weapon.' },
    { name: 'Power', interval: 'After each use, or as the item description indicates.' },
  ],
  core: [
    { name: 'Air', interval: 'Every Turn, and after every strenuous activity like combat or a MOBILITY roll.' },
    { name: 'Water', interval: 'Once per day, and after every strenuous activity like combat or a MOBILITY roll.' },
    { name: 'Food', interval: 'Once per day.' },
    { name: 'Power', interval: 'Situational, depending on the gear used.' },
  ],
};

/** Average number of supply rolls needed to run a rating down to zero. */
const ROLLS_TO_ZERO: Record<number, number> = { 1: 6, 2: 9, 3: 11, 4: 13, 5: 14, 6: 15 };

// ─── State ───────────────────────────────────────────────────────────────────

type FoundItem = Item & { air?: number; power?: number; reload: number | null };

type Haul = {
  location: string;
  condition: ConditionDef;
  detail: string | null;
  items: FoundItem[];
  totalWeight: number;
  strengthNeeded: number;
  totalValue: number;
  variableCount: number;
  uncarriable: number;
};

// Edition is chosen once in the sidebar and shared by every tool in the suite.
const edition = useEdition();
const locationName = ref('Cargo Bay');
const conditionName = ref('Intact');
const randomiseLocation = ref(false);
const randomiseCondition = ref(false);
const includeDetail = ref(true);
const haul = ref<Haul | null>(null);
const copied = ref(false);

// Supply roll panel
const supplyRating = ref(5);
const lastSupplyRoll = ref<{ dice: number[]; lost: number; before: number; after: number } | null>(
  null
);

const availableItems = computed(() =>
  CATALOGUE.filter((item) => !item.onlyIn || item.onlyIn === edition.value)
);

/** Applies the Evolved Edition's printed values where they differ from the Core Rulebook. */
function resolve(item: Item): Item {
  if (edition.value !== 'evolved' || !item.evolved) return item;
  return { ...item, ...item.evolved };
}

function generate(): void {
  const location = randomiseLocation.value
    ? pick(LOCATIONS)
    : (LOCATIONS.find((l) => l.name === locationName.value) ?? LOCATIONS[0]!);
  const condition = randomiseCondition.value
    ? pick(CONDITIONS)
    : (CONDITIONS.find((c) => c.name === conditionName.value) ?? CONDITIONS[0]!);

  const pool = availableItems.value
    .map(resolve)
    .filter((item) => location.categories.includes(item.category))
    .filter((item) => condition.valueCeiling === null || (item.value ?? 0) <= condition.valueCeiling);

  const count = Math.min(pool.length, condition.min + Math.floor(Math.random() * (condition.max - condition.min + 1)));
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.max(1, count));

  const items: FoundItem[] = shuffled.map((item) => ({
    ...item,
    air: item.air === undefined ? undefined : Math.max(0, item.air - condition.supplyPenalty),
    power: item.power === undefined ? undefined : Math.max(0, item.power - condition.supplyPenalty),
    // The rulebook prices a full reload at about 5% of the weapon itself.
    reload: item.firearm && item.value !== null ? Math.round(item.value * 0.05) : null,
  }));

  const totalWeight = items.reduce((sum, item) => sum + (item.weight ?? 0), 0);
  const rawValue = items.reduce((sum, item) => sum + (item.value ?? 0), 0);

  haul.value = {
    location: location.name,
    condition,
    detail: includeDetail.value ? pick(location.detail) : null,
    items,
    totalWeight,
    strengthNeeded: Math.ceil(totalWeight / 2),
    totalValue: Math.round(rawValue * condition.valueMultiplier),
    variableCount: items.filter((item) => item.value === null).length,
    uncarriable: items.filter((item) => item.weight === null).length,
  };

  if (randomiseLocation.value) locationName.value = location.name;
  if (randomiseCondition.value) conditionName.value = condition.name;
}

function clearOutput(): void {
  haul.value = null;
}

function rollSupply(): void {
  const before = supplyRating.value;
  if (before < 1) return;
  // Roll stress dice equal to the current rating, to a maximum of six.
  const dice = Array.from({ length: Math.min(6, before) }, () => d6());
  const lost = dice.filter((die) => die === 1).length;
  const after = Math.max(0, before - lost);
  lastSupplyRoll.value = { dice, lost, before, after };
  supplyRating.value = after;
}

function resetSupply(): void {
  supplyRating.value = 5;
  lastSupplyRoll.value = null;
}

const haulText = computed(() => {
  const h = haul.value;
  if (!h) return '';
  const lines: string[] = [];
  lines.push(`${h.location.toUpperCase()} — ${h.condition.name}`);
  lines.push(h.condition.detail);
  lines.push('');
  h.items.forEach((item) => {
    const bits = [`Weight ${item.weightLabel}`, item.costLabel];
    if (item.air !== undefined) bits.push(`Air ${item.air}`);
    if (item.power !== undefined) bits.push(`Power ${item.power}`);
    if (item.reload !== null) bits.push(`Reload $${item.reload.toLocaleString('en-US')}`);
    lines.push(`- ${item.name} [${item.category}] (${bits.join(', ')})`);
    lines.push(`  ${item.effect}`);
  });
  lines.push('');
  lines.push(
    `HAUL: ${h.items.length} item${h.items.length === 1 ? '' : 's'}, ${h.totalWeight} slot${h.totalWeight === 1 ? '' : 's'} of encumbrance (Strength ${h.strengthNeeded} to carry it all)`
  );
  lines.push(
    `VALUE: $${h.totalValue.toLocaleString('en-US')}${h.condition.valueMultiplier !== 1 ? ` (${h.condition.name.toLowerCase()}, ×${h.condition.valueMultiplier})` : ''}`
  );
  if (h.detail) {
    lines.push('');
    lines.push(`SITE DETAIL: ${h.detail}`);
  }
  return lines.join('\n');
});

async function copyHaul(): Promise<void> {
  try {
    await navigator.clipboard.writeText(haulText.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Controls -->
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="flex flex-col gap-[0.375rem]">
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
                class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
              />
              <span
                class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                >Randomise</span
              >
            </label>
          </div>
          <select
            id="salvage-location"
            v-model="locationName"
            :disabled="randomiseLocation"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-50 [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option v-for="loc in LOCATIONS" :key="loc.name" :value="loc.name">
              {{ loc.name }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-[0.375rem]">
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
                class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
              />
              <span
                class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                >Randomise</span
              >
            </label>
          </div>
          <select
            id="salvage-condition"
            v-model="conditionName"
            :disabled="randomiseCondition"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-50 [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option v-for="cond in CONDITIONS" :key="cond.name" :value="cond.name">
              {{ cond.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90"
          @click="generate"
        >
          Search location
        </button>
        <label
          class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <input
            v-model="includeDetail"
            type="checkbox"
            class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          Site detail
        </label>
        <button
          v-if="haul"
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="copyHaul"
        >
          {{ copied ? 'Copied' : 'Copy haul' }}
        </button>
        <button
          v-if="haul"
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="clearOutput"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Result -->
    <div v-if="haul" class="flex flex-col gap-4" aria-live="polite">
      <!-- Haul summary -->
      <div
        class="flex flex-col gap-3 rounded-lg border border-[var(--color-brand-primary)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            class="text-lg font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ haul.location }}</span
          >
          <span
            class="rounded-full border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-[0.2rem] text-xs font-semibold"
            :class="{
              'text-green-400': haul.condition.name === 'Intact' || haul.condition.name === 'Sealed',
              'text-yellow-400': haul.condition.name === 'Worn',
              'text-orange-400': haul.condition.name === 'Damaged',
              'text-red-400': haul.condition.name === 'Looted',
            }"
            >{{ haul.condition.name }}</span
          >
        </div>
        <p
          class="m-0 text-xs leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          {{ haul.condition.detail }}
        </p>
        <dl class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="flex flex-col gap-1">
            <dt
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              Items found
            </dt>
            <dd
              class="m-0 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ haul.items.length }}
            </dd>
          </div>
          <div class="flex flex-col gap-1">
            <dt
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              Encumbrance
            </dt>
            <dd
              class="m-0 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ haul.totalWeight }} slot{{ haul.totalWeight === 1 ? '' : 's' }}
              <span
                class="block text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >
                Strength {{ haul.strengthNeeded }} to carry it all<template
                  v-if="haul.uncarriable"
                >
                  · {{ haul.uncarriable }} item{{ haul.uncarriable === 1 ? '' : 's' }} too heavy to
                  carry</template
                >
              </span>
            </dd>
          </div>
          <div class="flex flex-col gap-1">
            <dt
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              Salvage value
            </dt>
            <dd
              class="m-0 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              ${{ haul.totalValue.toLocaleString('en-US') }}
              <span
                class="block text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >
                <template v-if="haul.condition.valueMultiplier !== 1"
                  >list price × {{ haul.condition.valueMultiplier }}</template
                >
                <template v-else>at list price</template>
                <template v-if="haul.variableCount">
                  · {{ haul.variableCount }} priced by the GM</template
                >
              </span>
            </dd>
          </div>
        </dl>
        <p
          v-if="haul.detail"
          class="m-0 border-t border-[var(--color-surface-600)] pt-3 text-sm leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          {{ haul.detail }}
        </p>
      </div>

      <!-- Items -->
      <div class="flex flex-col gap-[0.35rem]">
        <div
          v-for="item in haul.items"
          :key="item.name"
          class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] px-4 py-3"
        >
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{ item.name }}</span
            >
            <span
              class="rounded-full border border-[var(--color-surface-500)] px-2 py-[0.1rem] text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >{{ item.category }}</span
            >
          </div>
          <p
            class="m-0 mt-[0.3rem] text-xs leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{ item.effect }}
          </p>
          <div class="mt-[0.4rem] flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span
              class="text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >Weight
              <strong
                class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
                >{{ item.weightLabel }}</strong
              ></span
            >
            <span
              class="text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >Cost
              <strong
                class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
                >{{ item.costLabel }}</strong
              ></span
            >
            <span v-if="item.air !== undefined" class="text-[var(--color-brand-primary)]"
              >Air supply <strong class="font-semibold">{{ item.air }}</strong></span
            >
            <span v-if="item.power !== undefined" class="text-[var(--color-brand-primary)]"
              >Power supply <strong class="font-semibold">{{ item.power }}</strong></span
            >
            <span
              v-if="item.reload !== null"
              class="text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >Reload
              <strong
                class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
                >${{ item.reload.toLocaleString('en-US') }}</strong
              ></span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-6 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <p class="m-0">
        Pick a location and a condition, then search it. Everything the crew turns up comes from the
        rulebook gear tables, with its printed weight, cost, effect and supply ratings, totalled into
        a haul value and an encumbrance figure.
      </p>
    </div>

    <!-- Supply roll panel -->
    <div
      class="flex flex-col gap-4 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Supply roll</span
        >
        <span
          class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >Roll stress dice equal to the rating, max six. Every 1 costs a point.</span
        >
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-[0.375rem]">
          <label
            for="supply-rating"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Current rating</label
          >
          <input
            id="supply-rating"
            v-model.number="supplyRating"
            type="number"
            min="0"
            max="6"
            step="1"
            class="w-24 rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          />
        </div>
        <button
          type="button"
          :disabled="supplyRating < 1"
          class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          @click="rollSupply"
        >
          Roll supply
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="resetSupply"
        >
          Reset
        </button>
        <span
          v-if="supplyRating >= 1"
          class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >About {{ ROLLS_TO_ZERO[supplyRating] }} rolls to run dry from here</span
        >
        <span v-else class="text-xs font-semibold text-red-400"
          >Empty. You are entering a world of hurt.</span
        >
      </div>

      <div v-if="lastSupplyRoll" class="flex flex-wrap items-center gap-2" aria-live="polite">
        <span
          v-for="(die, i) in lastSupplyRoll.dice"
          :key="i"
          class="flex h-8 w-8 items-center justify-center rounded-md border text-sm font-bold"
          :class="
            die === 1
              ? 'border-red-500 bg-red-950/40 text-red-400'
              : 'border-[var(--color-surface-500)] bg-[var(--color-surface-600)] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]'
          "
          >{{ die }}</span
        >
        <span
          class="text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ lastSupplyRoll.lost }} lost · {{ lastSupplyRoll.before }} →
          {{ lastSupplyRoll.after }}
        </span>
      </div>

      <div class="border-t border-[var(--color-surface-600)] pt-3">
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Consumables tracked this edition</span
        >
        <dl class="mt-2 flex flex-col gap-2">
          <div
            v-for="consumable in CONSUMABLES[edition]"
            :key="consumable.name"
            class="flex flex-col gap-1 sm:flex-row sm:gap-2"
          >
            <dt
              class="shrink-0 text-xs font-semibold tracking-[0.06em] text-[var(--color-brand-primary)] uppercase sm:w-20"
            >
              {{ consumable.name }}
            </dt>
            <dd
              class="m-0 text-xs leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              {{ consumable.interval }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
