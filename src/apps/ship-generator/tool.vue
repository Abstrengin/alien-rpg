<script setup lang="ts">
/**
 * Ship generator for Alien RPG and Alien RPG - Evolved Edition (Free League Publishing).
 *
 * Grounded in the printed spacecraft rules rather than invented hull tiers:
 *   > Ship Classes table (Evolved p. 134: C/G/J/M/R/U/X; Core p. 170: C/G/M/R).
 *   > Internal Modules table (Evolved p. 136, Core p. 172) with printed sizes, capacities and prices.
 *   > Ship Upgrades table (Evolved p. 140, Core p. 178) with printed costs and purchase limits.
 *   > Offensive and defensive armaments (Evolved p. 138, Core p. 177).
 *   > The named ships of the setting (Evolved pp. 141-151, Core pp. 180-190) as printed statblocks.
 *   > Minor Component Damage D66 and Major Component Damage 2D6 (Evolved pp. 158-159, Core pp. 198-199).
 *
 * Quirk, history, and current-job prompts are original TTBG content, shared between editions.
 */
import { ref, computed, watch } from 'vue';
import { useEdition } from '@/shared/edition';

function d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}
function d66(): number {
  return d6() * 10 + d6();
}
function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}
function range(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}
function money(value: number): string {
  return `$${value.toLocaleString('en-US')}`;
}

type Size = 'I' | 'II' | 'III' | 'IV' | 'V';
const SIZE_ORDER: readonly Size[] = ['I', 'II', 'III', 'IV', 'V'];
function sizeIndex(size: Size): number {
  return SIZE_ORDER.indexOf(size);
}

// ─── Ship classes (Evolved p. 134 / Core p. 170) ─────────────────────────────

interface SlotRow {
  size: Size;
  count: number;
}

interface ShipClass {
  id: string;
  label: string;
  length: string;
  crew: string;
  crewMin: number;
  crewMax: number;
  /** Passenger complement, where the class table prints one (U and X). */
  passengers: number;
  ftl: number | null;
  signature: number;
  thrusters: number;
  hull: number;
  armorRating: number | null;
  hardpoints: readonly SlotRow[];
  modules: readonly SlotRow[];
  cost: number;
  note: string;
}

const CLASSES_EVOLVED: readonly ShipClass[] = [
  {
    id: 'C',
    label: 'C-Class',
    length: '15 m',
    crew: '1-2',
    crewMin: 1,
    crewMax: 2,
    passengers: 0,
    ftl: null,
    signature: -1,
    thrusters: 2,
    hull: 2,
    armorRating: null,
    hardpoints: [],
    modules: [
      { size: 'II', count: 2 },
      { size: 'I', count: 4 },
    ],
    cost: 2_000_000,
    note: 'Light intrasystem craft. The class table prints no FTL rating, though individual ships such as the Starcub carry a short-range drive.',
  },
  {
    id: 'G',
    label: 'G-Class',
    length: '50 m',
    crew: '3-6',
    crewMin: 3,
    crewMax: 6,
    passengers: 0,
    ftl: 20,
    signature: 0,
    thrusters: 1,
    hull: 5,
    armorRating: null,
    hardpoints: [
      { size: 'II', count: 1 },
      { size: 'I', count: 2 },
    ],
    modules: [
      { size: 'III', count: 3 },
      { size: 'II', count: 5 },
      { size: 'I', count: 7 },
    ],
    cost: 9_000_000,
    note: 'Light commercial hull. Cheap to run, slow between the stars, the workhorse of independent operators.',
  },
  {
    id: 'J',
    label: 'J-Class',
    length: '150 m',
    crew: '4-10',
    crewMin: 4,
    crewMax: 10,
    passengers: 0,
    ftl: 16,
    signature: 0,
    thrusters: 1,
    hull: 6,
    armorRating: null,
    hardpoints: [
      { size: 'II', count: 2 },
      { size: 'I', count: 3 },
    ],
    modules: [
      { size: 'III', count: 4 },
      { size: 'II', count: 6 },
      { size: 'I', count: 8 },
    ],
    cost: 20_000_000,
    note: 'Mid-weight commercial hull. New to the Evolved Edition class table; the Core Rulebook has no J-Class.',
  },
  {
    id: 'M',
    label: 'M-Class',
    length: '300 m',
    crew: '6-12',
    crewMin: 6,
    crewMax: 12,
    passengers: 0,
    ftl: 12,
    signature: 1,
    thrusters: 0,
    hull: 9,
    armorRating: null,
    hardpoints: [
      { size: 'III', count: 1 },
      { size: 'II', count: 2 },
    ],
    modules: [
      { size: 'IV', count: 4 },
      { size: 'III', count: 6 },
      { size: 'II', count: 8 },
    ],
    cost: 28_000_000,
    note: 'The sweet spot between cargo capacity and tolerable engine emissions. The workhorse of the UA and 3WE.',
  },
  {
    id: 'R',
    label: 'R-Class',
    length: '700 m',
    crew: '12-18',
    crewMin: 12,
    crewMax: 18,
    passengers: 0,
    ftl: 8,
    signature: 2,
    thrusters: -1,
    hull: 12,
    armorRating: null,
    hardpoints: [
      { size: 'III', count: 2 },
      { size: 'II', count: 4 },
    ],
    modules: [
      { size: 'V', count: 5 },
      { size: 'IV', count: 7 },
      { size: 'III', count: 9 },
    ],
    cost: 400_000_000,
    note: 'Heavy hull with a fast drive and a loud signature. Frigates and large military transports sit here.',
  },
  {
    id: 'U',
    label: 'U-Class',
    length: '1,200 m',
    crew: '15-20/2,000',
    crewMin: 15,
    crewMax: 20,
    passengers: 2000,
    ftl: 20,
    signature: 3,
    thrusters: -2,
    hull: 15,
    armorRating: null,
    hardpoints: [
      { size: 'III', count: 3 },
      { size: 'II', count: 6 },
    ],
    modules: [
      { size: 'V', count: 6 },
      { size: 'IV', count: 9 },
      { size: 'III', count: 12 },
    ],
    cost: 1_000_000_000,
    note: 'Crew of 15-20 running a ship carrying up to 2,000 souls. Slow, enormous, impossible to hide.',
  },
  {
    id: 'X',
    label: 'X-Class',
    length: '2,500 m',
    crew: '36-72/10,000',
    crewMin: 36,
    crewMax: 72,
    passengers: 10000,
    ftl: 24,
    signature: 5,
    thrusters: -3,
    hull: 20,
    armorRating: null,
    hardpoints: [
      { size: 'III', count: 5 },
      { size: 'I', count: 10 },
    ],
    modules: [
      { size: 'V', count: 8 },
      { size: 'IV', count: 12 },
      { size: 'III', count: 16 },
    ],
    cost: 4_000_000_000,
    note: 'The largest printed class. Its hardpoint row reads 5 x size III and 10 x size I, breaking the pattern of every other row in the table.',
  },
];

const CLASSES_CORE: readonly ShipClass[] = [
  {
    id: 'C',
    label: 'C-Class',
    length: '15 m',
    crew: '1-2',
    crewMin: 1,
    crewMax: 2,
    passengers: 0,
    ftl: null,
    signature: -1,
    thrusters: 2,
    hull: 2,
    armorRating: 4,
    hardpoints: [],
    modules: [
      { size: 'II', count: 2 },
      { size: 'I', count: 4 },
    ],
    cost: 2_000_000,
    note: 'Light intrasystem craft. The class table prints no FTL rating, though individual ships such as the Starcub carry a short-range drive.',
  },
  {
    id: 'G',
    label: 'G-Class',
    length: '50 m',
    crew: '3-6',
    crewMin: 3,
    crewMax: 6,
    passengers: 0,
    ftl: 20,
    signature: 0,
    thrusters: 1,
    hull: 5,
    armorRating: 5,
    hardpoints: [
      { size: 'II', count: 1 },
      { size: 'I', count: 2 },
    ],
    modules: [
      { size: 'III', count: 3 },
      { size: 'II', count: 5 },
      { size: 'I', count: 7 },
    ],
    cost: 9_000_000,
    note: 'Light commercial hull. Cheap to run, slow between the stars, the workhorse of independent operators.',
  },
  {
    id: 'M',
    label: 'M-Class',
    length: '300 m',
    crew: '7-10',
    crewMin: 7,
    crewMax: 10,
    passengers: 0,
    ftl: 12,
    signature: 1,
    thrusters: 0,
    hull: 9,
    armorRating: 6,
    hardpoints: [
      { size: 'III', count: 1 },
      { size: 'II', count: 2 },
    ],
    modules: [
      { size: 'IV', count: 4 },
      { size: 'III', count: 6 },
      { size: 'II', count: 8 },
    ],
    cost: 28_000_000,
    note: 'The sweet spot between cargo capacity and tolerable engine emissions. The workhorse of the UA and 3WE.',
  },
  {
    id: 'R',
    label: 'R-Class',
    length: '700 m',
    crew: '12-18',
    crewMin: 12,
    crewMax: 18,
    passengers: 0,
    ftl: 8,
    signature: 2,
    thrusters: -1,
    hull: 12,
    armorRating: 7,
    hardpoints: [
      { size: 'III', count: 2 },
      { size: 'II', count: 4 },
    ],
    modules: [
      { size: 'V', count: 5 },
      { size: 'IV', count: 7 },
      { size: 'III', count: 9 },
    ],
    cost: 400_000_000,
    note: 'Heavy hull with a fast drive and a loud signature. Frigates and large military transports sit here.',
  },
];

// ─── Internal modules (Evolved p. 136 / Core p. 172, identical in both) ───────

interface ModuleSpec {
  name: string;
  size: Size;
  capacity: string;
  cost: number | null;
}

const MODULES: readonly ModuleSpec[] = [
  { name: 'Artificial Intelligence', size: 'I', capacity: '', cost: null },
  { name: 'Air Scrubbers', size: 'I', capacity: 'Up to 10 people', cost: 50_000 },
  { name: 'Air Scrubbers', size: 'II', capacity: 'Up to 50 people', cost: 200_000 },
  { name: 'Air Scrubbers', size: 'III', capacity: 'Up to 500 people', cost: 1_200_000 },
  { name: 'Air Scrubbers', size: 'IV', capacity: 'Up to 2,500 people', cost: 3_000_000 },
  { name: 'Cargo Bay', size: 'I', capacity: '500 kg', cost: 10_000 },
  { name: 'Cargo Bay', size: 'II', capacity: '10 tons', cost: 25_000 },
  { name: 'Cargo Bay', size: 'III', capacity: '250 tons', cost: 100_000 },
  { name: 'Cargo Bay', size: 'IV', capacity: '5,000 tons', cost: 250_000 },
  { name: 'Cargo Bay', size: 'V', capacity: '100,000 tons', cost: 4_000_000 },
  { name: 'Corporate Suite', size: 'II', capacity: '', cost: 1_000_000 },
  { name: 'Cryo Deck', size: 'I', capacity: '1 person', cost: 50_000 },
  { name: 'Cryo Deck', size: 'II', capacity: 'Up to 10 people', cost: 200_000 },
  { name: 'Cryo Deck', size: 'III', capacity: 'Up to 50 people', cost: 2_000_000 },
  { name: 'Cryo Deck', size: 'IV', capacity: 'Up to 500 people', cost: 15_000_000 },
  { name: 'Cryo Deck', size: 'V', capacity: 'Up to 2,500 people', cost: 50_000_000 },
  { name: 'Docking Umbilical', size: 'II', capacity: '', cost: 300_000 },
  {
    name: 'Emergency Escape Vehicle',
    size: 'I',
    capacity: 'Class A Ejection Pod',
    cost: 100_000,
  },
  {
    name: 'Emergency Escape Vehicle',
    size: 'II',
    capacity: 'Class B EEV Type 20 Series',
    cost: 250_000,
  },
  {
    name: 'Emergency Escape Vehicle',
    size: 'II',
    capacity: 'Class C EEV Type 337 FTL',
    cost: 500_000,
  },
  {
    name: 'Emergency Escape Vehicle',
    size: 'III',
    capacity: 'Class D Lifeboat Module',
    cost: 1_500_000,
  },
  { name: 'Galley', size: 'I', capacity: '1 person', cost: 20_000 },
  { name: 'Galley', size: 'II', capacity: 'Up to 10 people', cost: 50_000 },
  { name: 'Galley', size: 'III', capacity: 'Up to 50 people', cost: 125_000 },
  { name: 'Galley', size: 'IV', capacity: 'Up to 500 people', cost: 500_000 },
  { name: 'Galley', size: 'V', capacity: 'Up to 2,500 people', cost: 3_000_000 },
  { name: 'Hangar', size: 'I', capacity: 'Class A Ship', cost: 100_000 },
  { name: 'Hangar', size: 'II', capacity: 'Class B Ship', cost: 250_000 },
  { name: 'Hangar', size: 'III', capacity: 'Class C-D Ship', cost: 400_000 },
  { name: 'Hangar', size: 'IV', capacity: 'Class E-G Ship', cost: 800_000 },
  { name: 'Hangar', size: 'V', capacity: 'Class H-M Ship', cost: 1_200_000 },
  { name: 'Medlab', size: 'II', capacity: '', cost: 250_000 },
  { name: 'Salvage Crane', size: 'III', capacity: '', cost: 100_000 },
  { name: 'Science Lab', size: 'III', capacity: '', cost: 750_000 },
  { name: 'Tractor Hitch', size: 'III', capacity: '', cost: 600_000 },
  { name: 'Vehicle Bay', size: 'I', capacity: 'ATV', cost: 75_000 },
  { name: 'Vehicle Bay', size: 'II', capacity: 'VTOL Gyrocar', cost: 150_000 },
  { name: 'Vehicle Bay', size: 'III', capacity: 'APC, Daihotai Tractor', cost: 250_000 },
  { name: 'Vehicle Bay', size: 'IV', capacity: '10 x APC', cost: 800_000 },
  { name: 'Vehicle Bay', size: 'V', capacity: '100 x APC', cost: 5_000_000 },
];

function moduleSpec(name: string, size: Size): ModuleSpec {
  return (
    MODULES.find((m) => m.name === name && m.size === size) ?? {
      name,
      size,
      capacity: '',
      cost: null,
    }
  );
}

// ─── Upgrades (Evolved p. 140 / Core p. 178) ─────────────────────────────────

interface UpgradeSpec {
  name: string;
  cost: number;
  max: number;
  effect: string;
  /** How the upgrade changes the generated statblock, per edition. */
  apply?: (stats: MutableStats, edition: 'core' | 'evolved') => void;
}

interface MutableStats {
  ftl: number | null;
  signature: number;
  thrusters: number;
  hull: number;
  armor: number;
}

const UPGRADES: readonly UpgradeSpec[] = [
  {
    name: 'Armored Bulkheads',
    cost: 2_000_000,
    max: 3,
    effect: 'Armor +1 per purchase',
    apply: (s) => {
      s.armor += 1;
    },
  },
  {
    name: 'Boosted Displacement Drives',
    cost: 1_400_000,
    max: 6,
    effect: 'FTL rating reduced 1 step per purchase',
    apply: (s) => {
      if (s.ftl !== null) s.ftl = Math.max(1, s.ftl - 1);
    },
  },
  {
    name: 'Enhanced Sensors',
    cost: 2_200_000,
    max: 2,
    effect: '+1 die to the Target Lock action',
  },
  {
    name: 'Overpowered Thrusters',
    cost: 1_500_000,
    max: 2,
    effect: 'Thrusters +1 per purchase',
    apply: (s) => {
      s.thrusters += 1;
    },
  },
  {
    name: 'Planetfall Capacity',
    cost: 1_800_000,
    max: 1,
    effect: 'Atmospheric entry and landing on any rock',
  },
  {
    name: 'Reinforced Frame',
    cost: 1_200_000,
    max: 3,
    effect: 'Hull +1 per purchase',
    apply: (s) => {
      s.hull += 1;
    },
  },
  {
    name: 'Stealth Technology',
    cost: 50_000_000,
    max: 2,
    effect: 'Signature reduced (2 steps in Evolved, 1 step per purchase in Core)',
    apply: (s, edition) => {
      s.signature -= edition === 'evolved' ? 2 : 1;
    },
  },
];

// ─── Armaments (Evolved p. 138 / Core p. 177, identical in both) ──────────────

interface ArmamentSpec {
  name: string;
  kind: 'offensive' | 'defensive';
  mod: string;
  damage: string;
  weaponRange: string;
  size: Size;
  cost: number;
  special: string;
}

const ARMAMENTS: readonly ArmamentSpec[] = [
  {
    name: 'Short Lance ASAT Missile',
    kind: 'offensive',
    mod: '+1',
    damage: '3',
    weaponRange: 'Long',
    size: 'II',
    cost: 12_000_000,
    special: 'Missile cost: $100,000',
  },
  {
    name: 'Long Lance ASAT Missile',
    kind: 'offensive',
    mod: '+1',
    damage: '4',
    weaponRange: 'Extreme',
    size: 'III',
    cost: 25_000_000,
    special: 'Missile cost: $400,000',
  },
  {
    name: 'Light Railgun Turret',
    kind: 'offensive',
    mod: '-',
    damage: '3',
    weaponRange: 'Short',
    size: 'I',
    cost: 1_500_000,
    special: 'Armor piercing',
  },
  {
    name: 'Medium Railgun Turret',
    kind: 'offensive',
    mod: '-',
    damage: '4',
    weaponRange: 'Short',
    size: 'II',
    cost: 8_500_000,
    special: 'Armor piercing',
  },
  {
    name: 'Heavy Railgun Turret',
    kind: 'offensive',
    mod: '-',
    damage: '5',
    weaponRange: 'Short',
    size: 'III',
    cost: 20_000_000,
    special: 'Armor piercing',
  },
  {
    name: '400MeV Particle Beam Weapon',
    kind: 'offensive',
    mod: '+2',
    damage: '4',
    weaponRange: 'Long',
    size: 'II',
    cost: 12_000_000,
    special: 'Damage reduced over range. Inflicts component damage only.',
  },
  {
    name: '800MeV Particle Beam Weapon',
    kind: 'offensive',
    mod: '+2',
    damage: '5',
    weaponRange: 'Extreme',
    size: 'III',
    cost: 30_000_000,
    special: 'Damage reduced over range. Inflicts component damage only.',
  },
  {
    name: 'Orbital Mines',
    kind: 'offensive',
    mod: '+2',
    damage: '2',
    weaponRange: 'Contact',
    size: 'II',
    cost: 10_000,
    special: '',
  },
  {
    name: 'Tactical Nuke',
    kind: 'offensive',
    mod: 'N/A',
    damage: 'N/A',
    weaponRange: 'Surface',
    size: 'III',
    cost: 50_000_000,
    special: 'Missile cost: $1,000,000',
  },
  {
    name: 'Sensor Decoys',
    kind: 'defensive',
    mod: '-',
    damage: '-',
    weaponRange: '-',
    size: 'I',
    cost: 1_200_000,
    special: '',
  },
  {
    name: 'Sensor Drones',
    kind: 'defensive',
    mod: '+1',
    damage: '-',
    weaponRange: '-',
    size: 'II',
    cost: 3_600_000,
    special: '',
  },
  {
    name: 'CIWS Laser Array',
    kind: 'defensive',
    mod: '+2',
    damage: '-',
    weaponRange: '-',
    size: 'III',
    cost: 45_000_000,
    special: '',
  },
];

// ─── Component damage (Evolved pp. 158-159 / Core pp. 198-199) ───────────────

interface DamageRow {
  min: number;
  max: number;
  name: string;
  effect: string;
  repair: string;
}

const MINOR_DAMAGE_EVOLVED: readonly DamageRow[] = [
  {
    min: 11,
    max: 11,
    name: 'A.I. Malfunction',
    effect: 'COMTECH roll required to access the ship A.I.',
    repair: 'COMTECH',
  },
  {
    min: 12,
    max: 12,
    name: 'Air Scrubbers Offline',
    effect: '-2 dice to all STAMINA rolls for one shift, then total air loss.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 13,
    max: 13,
    name: 'Airlock Malfunction',
    effect: 'Main airlock cannot be accessed.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 14,
    max: 15,
    name: 'Armament Malfunction',
    effect: '-2 modification to all attacks using a random armament.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 16,
    max: 16,
    name: 'Artificial Gravity Malfunction',
    effect: 'Zero gravity on the ship.',
    repair: 'HEAVY MACHINERY + COMTECH',
  },
  {
    min: 21,
    max: 21,
    name: 'AutoDoc Offline',
    effect: 'Medical facilities cannot be used.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 22,
    max: 23,
    name: 'Cargo Damage',
    effect: 'A random item kept in a cargo hold is destroyed.',
    repair: '-',
  },
  {
    min: 24,
    max: 24,
    name: 'Coffee Maker Malfunction',
    effect: 'The coffee maker in the galley cannot be used.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 25,
    max: 25,
    name: 'Comms Malfunction',
    effect: 'All external communications offline.',
    repair: 'COMTECH',
  },
  {
    min: 26,
    max: 31,
    name: 'Compartmental Decompression',
    effect: 'A random compartment of the ship suffers sudden decompression.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 32,
    max: 33,
    name: 'Crew Injury',
    effect: 'A random crew member is hurt. Roll the attack with six base dice, base damage 1.',
    repair: '-',
  },
  {
    min: 34,
    max: 34,
    name: 'Cryo Chambers Offline',
    effect: 'Cryo chambers cannot be used.',
    repair: 'HEAVY MACHINERY + COMTECH',
  },
  {
    min: 35,
    max: 35,
    name: 'Displacement Drive Malfunction',
    effect: 'FTL rating halved.',
    repair: 'HEAVY MACHINERY + COMTECH',
  },
  {
    min: 36,
    max: 36,
    name: 'Docking Station Damaged',
    effect: 'The ship cannot dock with other vessels.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 41,
    max: 41,
    name: 'Escape Pod Malfunction',
    effect: 'One EEV is disabled.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 42,
    max: 42,
    name: 'Hangar Damage',
    effect: "A random vessel in the ship's hangar is disabled.",
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 43,
    max: 44,
    name: 'Instrument Malfunction',
    effect: 'PILOTING, RANGED COMBAT, and COMTECH rolls on the ship get -1 dice.',
    repair: 'COMTECH',
  },
  {
    min: 45,
    max: 45,
    name: 'Intercoms Disabled',
    effect: 'All internal communications offline.',
    repair: 'COMTECH',
  },
  {
    min: 46,
    max: 46,
    name: 'Ladderway Damaged',
    effect: 'MOBILITY roll required to move between levels of the ship.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 51,
    max: 51,
    name: 'Life Support Offline',
    effect:
      'Everyone without a pressure suit rolls STAMINA each shift to avoid being fatigued by extreme heat or cold.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 52,
    max: 52,
    name: 'Navigation System Offline',
    effect: 'COMTECH roll with -2 dice is required to plot any FTL travel.',
    repair: 'COMTECH',
  },
  {
    min: 53,
    max: 54,
    name: 'Reactor Leak',
    effect: 'Weak radiation (1 rad/shift) in the reactor control area.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 55,
    max: 55,
    name: 'Refrigeration Unit Damaged',
    effect: 'All refrigerated foodstuffs on the ship are lost after one day.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 56,
    max: 61,
    name: 'Sensor Malfunction',
    effect: "All COMTECH rolls using the ship's sensors get -2 dice.",
    repair: 'COMTECH',
  },
  {
    min: 62,
    max: 64,
    name: 'Thruster Damage',
    effect: 'Reduces the Thrusters rating of the ship by 2.',
    repair: 'HEAVY MACHINERY',
  },
  {
    min: 65,
    max: 65,
    name: 'Transponder Offline',
    effect: "The ship's transponder stops working.",
    repair: 'COMTECH',
  },
  {
    min: 66,
    max: 66,
    name: 'Waste Disposal Malfunction',
    effect: 'Things are about to get very smelly.',
    repair: 'HEAVY MACHINERY',
  },
];

const MINOR_DAMAGE_CORE: readonly DamageRow[] = MINOR_DAMAGE_EVOLVED.map((row) => {
  if (row.min === 12)
    return {
      ...row,
      effect: '-2 modification to all STAMINA rolls for one Shift, then total air loss.',
    };
  if (row.min === 16)
    return { ...row, effect: 'Running action requires a MOBILITY roll.' };
  if (row.min === 32)
    return {
      ...row,
      effect:
        'A random crew member is hurt. Roll for the attack with six Base Dice. Each inflicts one point of damage.',
    };
  if (row.min === 41) return { ...row, effect: 'EEVs cannot be used.' };
  if (row.min === 43)
    return {
      ...row,
      effect: 'PILOTING, RANGED COMBAT, and COMTECH rolls on the ship get a -1 modification.',
    };
  if (row.min === 51)
    return {
      ...row,
      effect:
        'Everyone on the ship without a pressure suit becomes Freezing, forcing a STAMINA roll each Shift.',
    };
  if (row.min === 52)
    return {
      ...row,
      effect: 'COMTECH roll with a -2 modification is required to plot any FTL travel.',
    };
  if (row.min === 56)
    return {
      ...row,
      effect: "All COMTECH rolls using the ship's sensors get a -2 modification.",
    };
  if (row.min === 62)
    return { ...row, effect: 'Reduces the Thrusters rating of the ship two steps.' };
  return row;
});

const MAJOR_DAMAGE: readonly DamageRow[] = [
  { min: 2, max: 2, name: 'A.I. Offline', effect: 'The ship A.I. is offline.', repair: '3 x COMTECH' },
  {
    min: 3,
    max: 3,
    name: 'Escape Pods Heavily Damaged',
    effect: 'No EEVs can be used.',
    repair: 'HEAVY MACHINERY + COMTECH',
  },
  {
    min: 4,
    max: 4,
    name: 'Sensor Failure',
    effect: "The ship's sensors fail completely. Target Lock cannot be made.",
    repair: '2 x COMTECH',
  },
  {
    min: 5,
    max: 5,
    name: 'Displacement Drive Failure',
    effect: 'No FTL travel possible.',
    repair: 'HEAVY MACHINERY + 2 x COMTECH',
  },
  {
    min: 6,
    max: 6,
    name: 'Armament Damaged',
    effect: 'A random armament on the ship is unusable.',
    repair: 'HEAVY MACHINERY + COMTECH',
  },
  {
    min: 7,
    max: 7,
    name: 'Engine Failure',
    effect: 'The ship is dead in space. No movement phase actions can be performed.',
    repair: '2 x HEAVY MACHINERY + COMTECH',
  },
  {
    min: 8,
    max: 8,
    name: 'Critical Crew Injury',
    effect: 'A random crew member is Broken and suffers a random critical injury.',
    repair: '-',
  },
  {
    min: 9,
    max: 9,
    name: 'Bridge Exposed To Vacuum',
    effect:
      'The ship can no longer be controlled, and all personnel on the bridge suffer explosive decompression.',
    repair: '2 x HEAVY MACHINERY + COMTECH',
  },
  {
    min: 10,
    max: 10,
    name: 'Reactor Breach',
    effect:
      'The ship loses all propulsion. Strong radiation in the reactor control area, weak radiation in the rest of the ship.',
    repair: '2 x HEAVY MACHINERY + COMTECH',
  },
  { min: 11, max: 11, name: 'Chain Reaction', effect: 'Roll twice on this table.', repair: '-' },
  {
    min: 12,
    max: 12,
    name: 'Reactor Detonation',
    effect: 'Total loss of the ship and all crew.',
    repair: '-',
  },
];

function lookupDamage(rows: readonly DamageRow[], roll: number): DamageRow {
  return rows.find((row) => roll >= row.min && roll <= row.max) ?? rows[0]!;
}

// ─── Named ships of the setting ──────────────────────────────────────────────

interface NamedShip {
  id: string;
  name: string;
  subtitle: string;
  manufacturer: string;
  cost: number;
  crew: string;
  passengers?: string;
  ai: string;
  length: string;
  ftl: number;
  signature: number;
  thrusters: number;
  hull: number;
  armor: number;
  modules: readonly string[];
  upgrades: readonly string[];
  armaments: readonly string[];
  blurb: string;
  noteworthy?: string;
}

const NAMED_EVOLVED: readonly NamedShip[] = [
  {
    id: 'starcub',
    name: 'Starcub Shuttle',
    subtitle: 'C-Class Intrasystem Vessel',
    manufacturer: 'Lockmart',
    cost: 2_260_000,
    crew: '1',
    passengers: '3 (in cryosleep)',
    ai: 'None',
    length: '16 m',
    ftl: 15,
    signature: -1,
    thrusters: 2,
    hull: 2,
    armor: 0,
    modules: ['Air Scrubbers I', 'Cargo Bay I', 'Cryo Deck II'],
    upgrades: [],
    armaments: [],
    blurb:
      'An aging design that still sees use on the Frontier, often carried as an auxiliary craft aboard freighters. Capable of short FTL hops with a maximum range of 13 parsecs before refueling.',
    noteworthy:
      'The Narcissus was one of two Starcub shuttles attached to the USCSS Nostromo in 2122, and the one Warrant Officer Ripley used to escape the starfreighter. The second, the Salmacis, was damaged in a docking accident before Nostromo left Thedus.',
  },
  {
    id: 'mule',
    name: 'Model CM-93D Mule',
    subtitle: 'G-Class Commercial Ore Transport Vessel',
    manufacturer: 'Weyland-Yutani',
    cost: 13_325_000,
    crew: '3',
    ai: 'None',
    length: '30 m',
    ftl: 20,
    signature: 0,
    thrusters: 1,
    hull: 5,
    armor: 1,
    modules: ['Air Scrubbers I', 'Cargo Bay III', 'Cargo Bay II', 'Docking Umbilical II', 'Galley II'],
    upgrades: ['Armored Bulkheads', 'Planetfall Capacity'],
    armaments: [],
    blurb:
      "A small but sturdy ore carrier that lifts freshly mined ore from a world's surface to a waiting bulk carrier or refinery. Carries a detachable ore transport pod on heavy-duty clamps.",
  },
  {
    id: 'corvus',
    name: 'Model CM-90S Corvus',
    subtitle: 'G-Class Commercial Deep Space Salvage Vessel',
    manufacturer: 'Lockmart',
    cost: 18_350_000,
    crew: '6',
    ai: 'MU/TH/UR 6000',
    length: '54 m',
    ftl: 20,
    signature: 0,
    thrusters: 1,
    hull: 6,
    armor: 1,
    modules: [
      'Artificial Intelligence I',
      'Air Scrubbers II',
      'Cargo Bay III',
      'Cryo Deck II',
      'Docking Umbilical II',
      'EEV II',
      'Galley II',
      'Hangar III',
      'Salvage Crane III',
    ],
    upgrades: ['Armored Bulkheads', 'Planetfall Capacity', 'Reinforced Frame'],
    armaments: [],
    blurb:
      'Four overpowered multivector engines and an underslung bridge. Equipped with a tow crane rig for heavy lifting and towing disabled craft, plus a rear dorsal lifeboat that can run independently for three months.',
    noteworthy:
      'The USCSS Anesidora operated around the Tartarus Sector in the 2130s and was destroyed when Sevastopol station spiralled into KG-348. Captain Clara Odenkirk’s USCSS Katharos works out of Anchorpoint station, and is often first on the scene of any wreck.',
  },
  {
    id: 'bison-g',
    name: 'Model CM-88G Bison',
    subtitle: 'M-Class Commercial Starfreighter',
    manufacturer: 'Lockmart',
    cost: 38_300_000,
    crew: '7',
    ai: 'MU/TH/UR 6500',
    length: '334 m',
    ftl: 12,
    signature: 1,
    thrusters: 0,
    hull: 9,
    armor: 1,
    modules: [
      'Artificial Intelligence I',
      'Air Scrubbers II',
      'Cargo Bay IV x 4',
      'Cryo Deck II',
      'Docking Umbilical II',
      'EEV II x 2',
      'Galley II',
      'Medlab II',
    ],
    upgrades: ['Armored Bulkheads', 'Planetfall Capacity'],
    armaments: [],
    blurb:
      "A well-known vessel in the shipping lanes. Originally advertised as an interstellar cruiser, ICC regulations made the Bison's weight class and interior volume attractive for hauling freight instead.",
  },
  {
    id: 'bison-h',
    name: 'Model CM-88H Bison',
    subtitle: 'M-Class Commercial Towing Vehicle',
    manufacturer: 'Lockmart',
    cost: 45_500_000,
    crew: '7',
    ai: 'MU/TH/UR 7000',
    length: '334 m',
    ftl: 8,
    signature: 1,
    thrusters: 0,
    hull: 9,
    armor: 1,
    modules: [
      'Artificial Intelligence I',
      'Air Scrubbers II',
      'Cargo Bay IV x 2',
      'Cryo Deck II',
      'Docking Umbilical II',
      'EEV II x 2 (Starcub Shuttles)',
      'Galley II',
      'Medlab II',
      'Tractor Hitch III',
    ],
    upgrades: ['Armored Bulkheads', 'Boosted Displacement Drives x 4', 'Planetfall Capacity'],
    armaments: [],
    blurb:
      'The towing configuration of the Bison, with removable modular engine cores. So configured, the 88H can haul a refinery, ore processing plant, atmospheric processor, orbital station, or living modules.',
    noteworthy:
      'The infamous USCSS Nostromo was an 88B Bison in a towing configuration much like the H.',
  },
  {
    id: 'star-clipper',
    name: 'Model CYG-NS3 Star Clipper',
    subtitle: 'M-Class Commercial Transport Ship',
    manufacturer: 'Lockmart',
    cost: 62_475_000,
    crew: '6',
    passengers: '200 (in cryosleep)',
    ai: 'MU/TH/UR 6500',
    length: '300 m',
    ftl: 6,
    signature: 1,
    thrusters: 1,
    hull: 9,
    armor: 0,
    modules: [
      'Artificial Intelligence I',
      'Air Scrubbers III',
      'Cargo Bay III x 4',
      'Cryo Deck IV',
      'Docking Umbilical II',
      'EEV II x 4',
      'Galley III',
      'Medlab II',
    ],
    upgrades: ['Boosted Displacement Drives x 6', 'Planetfall Capacity', 'Overpowered Thrusters'],
    armaments: [],
    blurb:
      "A retired Lockmart design still in wide use, shuttling personnel and small loads across the Frontier. The cargo bay ceiling carries free-hanging stasis pod coupling racks for extra passengers.",
  },
  {
    id: 'conestoga',
    name: 'Conestoga-Class Frigate',
    subtitle: 'RRTT-3 Rapid Response Troop Transport',
    manufacturer: 'Weyland-Yutani',
    cost: 738_150_000,
    crew: '12',
    passengers: 'Troop capacity 90',
    ai: 'MU/TH/UR 9000',
    length: '731 m',
    ftl: 2,
    signature: 0,
    thrusters: 1,
    hull: 12,
    armor: 2,
    modules: [
      'Artificial Intelligence I',
      'Air Scrubbers IV',
      'Cargo Bay III',
      'Cryo Deck IV',
      'Docking Umbilical II',
      'EEV I x 20',
      'Galley IV',
      'Hangar IV',
      'Medlab II',
    ],
    upgrades: [
      'Armored Bulkheads x 2',
      'Boosted Displacement Drives x 6',
      'Enhanced Sensors',
      'Overpowered Thrusters x 2',
      'Stealth Technology',
    ],
    armaments: [
      'Long Lance ASAT Missiles (8 missiles)',
      'Heavy Railgun Turret',
      '800MeV Particle Beam Weapon',
      'Orbital Mines (60 mines)',
      'Tactical Nukes (20 missiles)',
      'CIWS Laser Array',
      'Sensor Drones',
      'Sensor Decoys',
    ],
    blurb:
      'The most common ship in use by the USCMC and Colonial Marshal Bureau, with a modular interior and numerous hardpoints. Its MU/TH/UR 9000 can run mission assignments without the crew, so long as it makes no planetfall.',
    noteworthy:
      'The USCMC troop transport USS Sulaco is the subject of frequent sightings and ghost stories. The W-Y medical frigate USCSS Patna, stripped of rail guns and missile pod, is XO Michael Bishop’s mobile headquarters on the Frontier.',
  },
];

const NAMED_CORE: readonly NamedShip[] = [
  {
    id: 'starcub',
    name: 'Starcub-Class Shuttle',
    subtitle: 'C-Class Intrasystem Vessel',
    manufacturer: 'Lockmart',
    cost: 2_300_000,
    crew: '1',
    passengers: '3 (in cryosleep)',
    ai: 'None',
    length: '16 m',
    ftl: 15,
    signature: -1,
    thrusters: 2,
    hull: 2,
    armor: 4,
    modules: ['Air Scrubbers I', 'Cargo Bay I', 'Cryo Deck II'],
    upgrades: [],
    armaments: [],
    blurb:
      'An aging design that still sees use on the Frontier, often carried as an auxiliary craft aboard freighters. Capable of short FTL hops with a maximum range of 13 parsecs before refueling.',
    noteworthy:
      'The Narcissus was one of two Starcub shuttles attached to the USCSS Nostromo in 2122, and the one Warrant Officer Ripley used to escape the starfreighter.',
  },
  {
    id: 'corvus',
    name: 'Model CM-90S Corvus',
    subtitle: 'G-Class Commercial Deep Space Salvage Vessel',
    manufacturer: 'Lockmart',
    cost: 17_000_000,
    crew: '6',
    ai: 'MU/TH/UR 6000',
    length: '54 m',
    ftl: 20,
    signature: 0,
    thrusters: 1,
    hull: 6,
    armor: 5,
    modules: [
      'Artificial Intelligence I',
      'Air Scrubbers II',
      'Cargo Bay III',
      'Cryo Deck II',
      'Docking Umbilical II',
      'EEV II',
      'Galley II',
      'Hangar III',
      'Salvage Crane III',
    ],
    upgrades: ['Reinforced Frame II'],
    armaments: [],
    blurb:
      'Four overpowered multivector engines and an underslung bridge. Equipped with a tow crane rig for heavy lifting and towing disabled craft, plus a rear dorsal lifeboat that can run independently for three months.',
    noteworthy:
      'The USCSS Anesidora operated around the Tartarus Sector in the 2130s and was destroyed when Sevastopol station spiralled into KG-348. Captain Clara Odenkirk’s USCSS Katharos works out of Anchorpoint station.',
  },
  {
    id: 'bison-g',
    name: 'Model CM-88G Bison',
    subtitle: 'M-Class Commercial Starfreighter',
    manufacturer: 'Lockmart',
    cost: 36_000_000,
    crew: '7',
    ai: 'MU/TH/UR 6500',
    length: '334 m',
    ftl: 12,
    signature: 1,
    thrusters: 0,
    hull: 9,
    armor: 6,
    modules: [
      'Artificial Intelligence I',
      'Air Scrubbers II',
      'Cargo Bay IV x 4',
      'Cryo Deck II',
      'Docking Umbilical II',
      'EEV II x 2',
      'Galley II',
      'Medlab II',
    ],
    upgrades: ['Planetfall Capacity'],
    armaments: [],
    blurb:
      "A well-known vessel in the shipping lanes. Originally advertised as an interstellar cruiser, ICC regulations made the Bison's weight class and interior volume attractive for hauling freight instead.",
  },
  {
    id: 'bison-h',
    name: 'Model CM-88H Bison',
    subtitle: 'M-Class Commercial Towing Vehicle',
    manufacturer: 'Lockmart',
    cost: 42_000_000,
    crew: '7',
    ai: 'MU/TH/UR 7000',
    length: '334 m',
    ftl: 8,
    signature: 1,
    thrusters: 0,
    hull: 9,
    armor: 6,
    modules: [
      'Artificial Intelligence I',
      'Air Scrubbers II',
      'Cargo Bay IV x 2',
      'Cryo Deck II',
      'Docking Umbilical II',
      'EEV II x 2 (Starcub Shuttles)',
      'Galley II',
      'Medlab II',
      'Tractor Hitch III',
    ],
    upgrades: ['Boosted Displacement Drives x 4', 'Planetfall Capacity'],
    armaments: [],
    blurb:
      'The towing configuration of the Bison, with removable modular engine cores. So configured, the 88H can haul a refinery, ore processing plant, atmospheric processor, orbital station, or living modules.',
    noteworthy:
      'The infamous USCSS Nostromo was an 88B Bison in a towing configuration much like the H. The Nostromo and the refinery module she towed were destroyed in the 2120s when her self-destruct was set by her third officer.',
  },
  {
    id: 'star-clipper',
    name: 'Model CYG-NS3 Star Clipper',
    subtitle: 'M-Class Commercial Transport Ship',
    manufacturer: 'Lockmart',
    cost: 37_000_000,
    crew: '6',
    passengers: '200 (in cryosleep)',
    ai: 'MU/TH/UR 6500',
    length: '300 m',
    ftl: 6,
    signature: 1,
    thrusters: 1,
    hull: 9,
    armor: 6,
    modules: [
      'Artificial Intelligence I',
      'Air Scrubbers III',
      'Cargo Bay III x 4',
      'Cryo Deck IV',
      'Docking Umbilical II',
      'EEV II x 4',
      'Galley III',
      'Medlab II',
    ],
    upgrades: ['Boosted Displacement Drives x 6', 'Planetfall Capacity', 'Overpowered Thrusters'],
    armaments: [],
    blurb:
      'A retired Lockmart design still in wide use, shuttling personnel and small loads across the Frontier. The cargo bay ceiling carries free-hanging stasis pod coupling racks for extra passengers.',
  },
  {
    id: 'conestoga',
    name: 'Conestoga-Class Frigate',
    subtitle: 'RRTT-3 Rapid Response Troop Transport',
    manufacturer: 'Weyland-Yutani',
    cost: 1_040_000_000,
    crew: '12 (or MU/TH/UR 9000 plus one Hyperdyne 341-B model android)',
    passengers: 'Troop capacity 90',
    ai: 'MU/TH/UR 9000',
    length: '731 m',
    ftl: 2,
    signature: 0,
    thrusters: 1,
    hull: 12,
    armor: 10,
    modules: [
      'Artificial Intelligence I',
      'Air Scrubbers IV',
      'Cargo Bay III',
      'Cryo Deck IV',
      'Docking Umbilical II',
      'EEV I x 20',
      'Galley IV',
      'Hangar IV',
      'Medlab II',
    ],
    upgrades: [
      'Boosted Displacement Drives',
      'Enhanced Sensors',
      'Overpowered Thrusters',
      'Stealth Technology',
    ],
    armaments: [
      'Long Lance ASAT Missiles (8 missiles)',
      'Heavy Railgun Turret',
      '800MeV Particle Beam Weapon',
      'Orbital Mines (60 mines)',
      'Tactical Nukes (20 missiles)',
      'CIWS Laser Array',
      'Sensor Drones',
      'Sensor Decoys',
    ],
    blurb:
      'The most common ship in use by the USCMC and Colonial Marshal Bureau, with a modular interior and numerous hardpoints for adding or removing weapons arrays.',
    noteworthy:
      'The USCMC troop transport USS Sulaco is the subject of frequent sightings and ghost stories on the Frontier.',
  },
];

// ─── Roles (curated, built from the canonical module list) ────────────────────

interface RoleProfile {
  id: string;
  label: string;
  /** Modules the role always wants, in priority order. */
  core: readonly string[];
  /** Modules used to spend whatever slots remain. */
  filler: readonly string[];
  /** How often the generator fits weapons when hardpoints exist. */
  armed: 'never' | 'sometimes' | 'always';
  summary: string;
}

const ROLES: readonly RoleProfile[] = [
  {
    id: 'freighter',
    label: 'Freight hauler',
    core: ['Cargo Bay', 'Cargo Bay', 'Docking Umbilical', 'Medlab'],
    filler: ['Cargo Bay'],
    armed: 'never',
    summary: 'Runs contracted cargo between colonies. Holds first, everything else second.',
  },
  {
    id: 'ore',
    label: 'Ore / bulk transport',
    core: ['Cargo Bay', 'Tractor Hitch', 'Docking Umbilical'],
    filler: ['Cargo Bay'],
    armed: 'never',
    summary: 'Lifts raw material to orbit or tows external modules that dwarf the ship itself.',
  },
  {
    id: 'salvage',
    label: 'Salvage vessel',
    core: ['Salvage Crane', 'Hangar', 'Cargo Bay', 'Docking Umbilical', 'Medlab'],
    filler: ['Cargo Bay'],
    armed: 'sometimes',
    summary: 'Works wrecks and derelicts. Dirty, lucrative, and occasionally fatal.',
  },
  {
    id: 'science',
    label: 'Science / survey',
    core: ['Science Lab', 'Medlab', 'Vehicle Bay', 'Docking Umbilical', 'Cargo Bay'],
    filler: ['Cargo Bay'],
    armed: 'sometimes',
    summary: 'Carries a lab, a ground vehicle and a corporate research contract nobody has read.',
  },
  {
    id: 'passenger',
    label: 'Passenger transport',
    core: ['Corporate Suite', 'Medlab', 'Docking Umbilical', 'Cargo Bay'],
    filler: ['Cargo Bay'],
    armed: 'never',
    summary: 'Moves people, most of them asleep, and their luggage.',
  },
  {
    id: 'military',
    label: 'Military / patrol',
    core: ['Hangar', 'Vehicle Bay', 'Medlab', 'Docking Umbilical', 'Cargo Bay'],
    filler: ['Vehicle Bay'],
    armed: 'always',
    summary: 'Armed, armored, and crewed by people who expect to use both.',
  },
  {
    id: 'marshal',
    label: 'Colonial marshal',
    core: ['Medlab', 'Hangar', 'Docking Umbilical', 'Vehicle Bay', 'Cargo Bay'],
    filler: ['Cargo Bay'],
    armed: 'always',
    summary: 'Law enforcement on a budget. One good gun and a lot of jurisdiction.',
  },
];

// ─── Condition (original TTBG, mapped onto the canonical damage tables) ───────

interface ConditionSpec {
  id: string;
  label: string;
  minorFaults: number;
  majorFaults: number;
  description: string;
}

const CONDITIONS: readonly ConditionSpec[] = [
  {
    id: 'new',
    label: 'New',
    minorFaults: 0,
    majorFaults: 0,
    description: 'Fresh off the yard. Everything works. Conspicuous; people notice.',
  },
  {
    id: 'good',
    label: 'Good',
    minorFaults: 0,
    majorFaults: 0,
    description: 'Well-maintained. Minor cosmetic wear. No surprises.',
  },
  {
    id: 'worn',
    label: 'Worn',
    minorFaults: 1,
    majorFaults: 0,
    description: 'Operational but tired. Patch jobs visible. One system needs watching.',
  },
  {
    id: 'damaged',
    label: 'Damaged',
    minorFaults: 2,
    majorFaults: 0,
    description: 'Something is wrong and not fully fixed. The crew knows which systems to avoid.',
  },
  {
    id: 'derelict',
    label: 'Derelict',
    minorFaults: 3,
    majorFaults: 1,
    description:
      'Barely holding together. Moving it is an adventure by itself. No one is going to lend you parts.',
  },
];

// ─── Ship quirks (original TTBG) ──────────────────────────────────────────────

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

// ─── Ship history (original TTBG) ─────────────────────────────────────────────

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

// ─── Current job context (original TTBG) ──────────────────────────────────────

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

// ─── Result types ─────────────────────────────────────────────────────────────

interface FittedModule {
  name: string;
  size: Size;
  slot: Size;
  capacity: string;
  /** Unit price. The book prints the A.I. price as "varies". */
  cost: number | null;
  count: number;
}

interface FittedUpgrade {
  name: string;
  count: number;
  cost: number;
  effect: string;
}

interface FittedArmament {
  name: string;
  slot: Size;
  detail: string;
  cost: number;
}

interface Fault {
  kind: 'minor' | 'major';
  roll: number;
  row: DamageRow;
}

interface GeneratedShip {
  kind: 'generated';
  edition: 'core' | 'evolved';
  shipClass: ShipClass;
  role: RoleProfile;
  condition: ConditionSpec;
  crewCount: number;
  freeSlots: number;
  stats: MutableStats;
  baseStats: MutableStats;
  modules: readonly FittedModule[];
  upgrades: readonly FittedUpgrade[];
  armaments: readonly FittedArmament[];
  totalCost: number;
  hasVariableCost: boolean;
  faults: readonly Fault[];
  quirk: string | null;
  history: string | null;
  currentJob: string | null;
}

interface BookShip {
  kind: 'book';
  edition: 'core' | 'evolved';
  ship: NamedShip;
  condition: ConditionSpec;
  faults: readonly Fault[];
  quirk: string | null;
  history: string | null;
  currentJob: string | null;
}

type ShipResult = GeneratedShip | BookShip;

// ─── State ────────────────────────────────────────────────────────────────────

// Edition is chosen once in the sidebar and shared by every tool in the suite.
const edition = useEdition();
const source = ref<'class' | 'book'>('class');
const classChoice = ref<string>('random');
const roleChoice = ref<string>('random');
const conditionChoice = ref<string>('random');
const bookChoice = ref<string>('random');
const includeQuirk = ref(true);
const includeHistory = ref(true);
const includeJob = ref(false);

const result = ref<ShipResult | null>(null);
const minorRoll = ref<{ roll: number; row: DamageRow } | null>(null);
const majorRoll = ref<{ roll: number; row: DamageRow } | null>(null);
const copied = ref(false);

const classes = computed(() => (edition.value === 'evolved' ? CLASSES_EVOLVED : CLASSES_CORE));
const namedShips = computed(() => (edition.value === 'evolved' ? NAMED_EVOLVED : NAMED_CORE));
const minorTable = computed(() =>
  edition.value === 'evolved' ? MINOR_DAMAGE_EVOLVED : MINOR_DAMAGE_CORE
);
const armorLabel = computed(() => (edition.value === 'evolved' ? 'Armor Level' : 'Armor Rating'));

// The two editions print different class tables, rosters and armor scales,
// so a stale result would be misleading.
watch(edition, () => {
  result.value = null;
  minorRoll.value = null;
  majorRoll.value = null;
  classChoice.value = 'random';
  bookChoice.value = 'random';
});

// ─── Loadout fitting ──────────────────────────────────────────────────────────

type SlotPool = Record<Size, number>;

function slotPool(rows: readonly SlotRow[]): SlotPool {
  const pool: SlotPool = { I: 0, II: 0, III: 0, IV: 0, V: 0 };
  for (const row of rows) pool[row.size] += row.count;
  return pool;
}

/**
 * A smaller module can be fitted into a slot for a bigger one, but never the
 * other way around. Take the smallest legal slot so the big ones stay free.
 */
function claimSlot(pool: SlotPool, size: Size): Size | null {
  for (let i = sizeIndex(size); i < SIZE_ORDER.length; i++) {
    const candidate = SIZE_ORDER[i]!;
    if (pool[candidate] > 0) {
      pool[candidate] -= 1;
      return candidate;
    }
  }
  return null;
}

function largestFreeSlot(pool: SlotPool): Size | null {
  for (let i = SIZE_ORDER.length - 1; i >= 0; i--) {
    const candidate = SIZE_ORDER[i]!;
    if (pool[candidate] > 0) return candidate;
  }
  return null;
}

/** The smallest printed size of a module that covers the given headcount. */
function sizeForPeople(name: string, people: number): Size {
  const options = MODULES.filter((m) => m.name === name);
  const thresholds: Record<string, number> = {
    I: 10,
    II: 50,
    III: 500,
    IV: 2500,
    V: 2500,
  };
  if (name === 'Cryo Deck') {
    thresholds.I = 1;
    thresholds.II = 10;
    thresholds.III = 50;
    thresholds.IV = 500;
    thresholds.V = 2500;
  }
  if (name === 'Galley') {
    thresholds.I = 1;
    thresholds.II = 10;
    thresholds.III = 50;
    thresholds.IV = 500;
    thresholds.V = 2500;
  }
  for (const option of options) {
    if (people <= (thresholds[option.size] ?? 0)) return option.size;
  }
  return options[options.length - 1]?.size ?? 'I';
}

function fit(pool: SlotPool, fitted: FittedModule[], name: string, size: Size): boolean {
  const slot = claimSlot(pool, size);
  if (!slot) return false;
  const spec = moduleSpec(name, size);
  const existing = fitted.find((m) => m.name === name && m.size === size && m.slot === slot);
  if (existing) {
    // The book's own statblocks collapse repeats, as in "Cargo Bay IV x 4".
    existing.count += 1;
    return true;
  }
  fitted.push({ name, size, slot, capacity: spec.capacity, cost: spec.cost, count: 1 });
  return true;
}

/** The headcount one module of the given name and size covers. */
const PEOPLE_CAPACITY: Record<string, Partial<Record<Size, number>>> = {
  'Air Scrubbers': { I: 10, II: 50, III: 500, IV: 2500 },
  'Cryo Deck': { I: 1, II: 10, III: 50, IV: 500, V: 2500 },
  Galley: { I: 1, II: 10, III: 50, IV: 500, V: 2500 },
};

function fitForPeople(
  pool: SlotPool,
  fitted: FittedModule[],
  name: string,
  people: number
): void {
  const size = sizeForPeople(name, people);
  const covers = PEOPLE_CAPACITY[name]?.[size] ?? people;
  const needed = Math.max(1, Math.ceil(people / covers));
  for (let i = 0; i < needed; i++) {
    if (!fit(pool, fitted, name, size)) return;
  }
}

function freeSlotCount(pool: SlotPool): number {
  return SIZE_ORDER.reduce((sum, size) => sum + pool[size], 0);
}

function buildLoadout(
  shipClass: ShipClass,
  role: RoleProfile,
  crewCount: number
): { modules: FittedModule[]; freeSlots: number } {
  const pool = slotPool(shipClass.modules);
  const fitted: FittedModule[] = [];

  // The U and X class rows print a passenger complement alongside the crew, and
  // life support has to cover everyone aboard, not just the people flying it.
  const aboard = crewCount + shipClass.passengers;

  // Every crewed hull needs air, a galley, and somewhere to sleep the long haul.
  // The largest printed module covers 2,500 people, so the biggest hulls need
  // several of each to cover everyone aboard.
  fitForPeople(pool, fitted, 'Air Scrubbers', aboard);
  fitForPeople(pool, fitted, 'Galley', aboard);
  if (shipClass.ftl !== null || Math.random() < 0.5) {
    fitForPeople(pool, fitted, 'Cryo Deck', aboard);
  }
  // Anything larger than a C-Class carries an A.I. and escape vehicles.
  if (shipClass.id !== 'C') {
    fit(pool, fitted, 'Artificial Intelligence', 'I');
    fit(pool, fitted, 'Emergency Escape Vehicle', pick(['I', 'II', 'II', 'III'] as const));
  }

  for (const name of role.core) {
    const sizes = MODULES.filter((m) => m.name === name).map((m) => m.size);
    // Cargo bays and vehicle bays scale with the hull, so take the biggest that fits.
    const preferred =
      sizes.length > 1 ? (largestFreeSlot(pool) ?? sizes[0]!) : sizes[0]!;
    const capped = sizes.includes(preferred) ? preferred : sizes[sizes.length - 1]!;
    fit(pool, fitted, name, capped);
  }

  // Spend some of what is left on the role's filler module. The book's own
  // ships leave most of their slots empty, so the generator does too.
  const fillerName = role.filler[0]!;
  const fillerSizes = MODULES.filter((m) => m.name === fillerName).map((m) => m.size);
  const remaining = freeSlotCount(pool);
  const toFill = Math.min(6, Math.round(remaining * (0.25 + Math.random() * 0.35)));
  for (let i = 0; i < toFill; i++) {
    const free = largestFreeSlot(pool);
    if (!free) break;
    const size = fillerSizes.includes(free) ? free : fillerSizes[fillerSizes.length - 1]!;
    if (!fit(pool, fitted, fillerName, size)) break;
  }

  return { modules: fitted, freeSlots: freeSlotCount(pool) };
}

function buildUpgrades(shipClass: ShipClass, role: RoleProfile): FittedUpgrade[] {
  const chosen: FittedUpgrade[] = [];
  const pool = UPGRADES.filter((u) => {
    // Stealth costs $50,000,000, more than most hulls. Only armed ships on the
    // heavy classes can plausibly carry it.
    if (u.name !== 'Stealth Technology') return true;
    return role.armed === 'always' && shipClass.cost >= 100_000_000;
  });
  const wanted = range(1, 3);
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, wanted);
  for (const upgrade of shuffled) {
    // Nobody buys a repeat that costs more than the hull it is bolted to.
    const affordable = Math.max(1, Math.floor(shipClass.cost / 2 / upgrade.cost));
    const count = upgrade.max === 1 ? 1 : range(1, Math.min(upgrade.max, 3, affordable));
    chosen.push({
      name: upgrade.name,
      count,
      cost: upgrade.cost * count,
      effect: upgrade.effect,
    });
  }
  // Planetfall is near-universal on the small hulls that actually land.
  if (shipClass.id === 'C' || shipClass.id === 'G') {
    if (!chosen.some((u) => u.name === 'Planetfall Capacity')) {
      chosen.push({
        name: 'Planetfall Capacity',
        count: 1,
        cost: 1_800_000,
        effect: 'Atmospheric entry and landing on any rock',
      });
    }
  }
  return chosen.sort((a, b) => a.name.localeCompare(b.name));
}

function buildArmaments(shipClass: ShipClass, role: RoleProfile): FittedArmament[] {
  if (role.armed === 'never' || shipClass.hardpoints.length === 0) return [];
  if (role.armed === 'sometimes' && Math.random() > 0.4) return [];

  const pool = slotPool(shipClass.hardpoints);
  const fitted: FittedArmament[] = [];
  const offensive = ARMAMENTS.filter((a) => a.kind === 'offensive' && a.name !== 'Tactical Nuke');
  const defensive = ARMAMENTS.filter((a) => a.kind === 'defensive');

  const wanted = role.armed === 'always' ? range(2, 3) : 1;
  for (let i = 0; i < wanted; i++) {
    const spec = pick(i === wanted - 1 ? defensive : offensive);
    const slot = claimSlot(pool, spec.size);
    if (!slot) continue;
    const detail =
      spec.kind === 'offensive'
        ? `Mod ${spec.mod} · Damage ${spec.damage} · ${spec.weaponRange} range${spec.special ? ` · ${spec.special}` : ''}`
        : `Mod ${spec.mod} · Countermeasure`;
    fitted.push({ name: spec.name, slot, detail, cost: spec.cost });
  }
  return fitted;
}

function rollFaults(condition: ConditionSpec): Fault[] {
  const faults: Fault[] = [];
  for (let i = 0; i < condition.minorFaults; i++) {
    const roll = d66();
    faults.push({ kind: 'minor', roll, row: lookupDamage(minorTable.value, roll) });
  }
  for (let i = 0; i < condition.majorFaults; i++) {
    const roll = d6() + d6();
    faults.push({ kind: 'major', roll, row: lookupDamage(MAJOR_DAMAGE, roll) });
  }
  return faults;
}

// ─── Generation ───────────────────────────────────────────────────────────────

function flavour() {
  return {
    quirk: includeQuirk.value ? pick(QUIRKS) : null,
    history: includeHistory.value ? pick(HISTORIES) : null,
    currentJob: includeJob.value ? pick(CURRENT_JOBS) : null,
  };
}

function chosenCondition(): ConditionSpec {
  if (conditionChoice.value === 'random') return pick(CONDITIONS);
  return CONDITIONS.find((c) => c.id === conditionChoice.value) ?? CONDITIONS[1]!;
}

function generate(): void {
  copied.value = false;
  minorRoll.value = null;
  majorRoll.value = null;
  const condition = chosenCondition();

  if (source.value === 'book') {
    const roster = namedShips.value;
    const ship =
      bookChoice.value === 'random'
        ? pick(roster)
        : (roster.find((s) => s.id === bookChoice.value) ?? pick(roster));
    result.value = {
      kind: 'book',
      edition: edition.value,
      ship,
      condition,
      faults: rollFaults(condition),
      ...flavour(),
    };
    return;
  }

  const shipClass =
    classChoice.value === 'random'
      ? pick(classes.value)
      : (classes.value.find((c) => c.id === classChoice.value) ?? pick(classes.value));
  const role =
    roleChoice.value === 'random'
      ? pick(ROLES)
      : (ROLES.find((r) => r.id === roleChoice.value) ?? pick(ROLES));

  const crewCount = range(shipClass.crewMin, shipClass.crewMax);
  const { modules, freeSlots } = buildLoadout(shipClass, role, crewCount);
  const upgrades = buildUpgrades(shipClass, role);
  const armaments = buildArmaments(shipClass, role);

  const baseStats: MutableStats = {
    ftl: shipClass.ftl,
    signature: shipClass.signature,
    thrusters: shipClass.thrusters,
    hull: shipClass.hull,
    // Evolved ships start at armor level 0 and buy bulkheads; Core classes
    // print an Armor Rating in the class table itself.
    armor: shipClass.armorRating ?? 0,
  };
  const stats: MutableStats = { ...baseStats };
  for (const fittedUpgrade of upgrades) {
    const spec = UPGRADES.find((u) => u.name === fittedUpgrade.name);
    if (!spec?.apply) continue;
    for (let i = 0; i < fittedUpgrade.count; i++) spec.apply(stats, edition.value);
  }

  const moduleCost = modules.reduce((sum, m) => sum + (m.cost ?? 0) * m.count, 0);
  const upgradeCost = upgrades.reduce((sum, u) => sum + u.cost, 0);
  const armamentCost = armaments.reduce((sum, a) => sum + a.cost, 0);

  result.value = {
    kind: 'generated',
    edition: edition.value,
    shipClass,
    role,
    condition,
    crewCount,
    freeSlots,
    stats,
    baseStats,
    modules,
    upgrades,
    armaments,
    totalCost: shipClass.cost + moduleCost + upgradeCost + armamentCost,
    hasVariableCost: modules.some((m) => m.cost === null),
    faults: rollFaults(condition),
    ...flavour(),
  };
}

function clearResult(): void {
  result.value = null;
  minorRoll.value = null;
  majorRoll.value = null;
  copied.value = false;
}

function rollMinor(): void {
  const roll = d66();
  minorRoll.value = { roll, row: lookupDamage(minorTable.value, roll) };
}

function rollMajor(): void {
  const roll = d6() + d6();
  majorRoll.value = { roll, row: lookupDamage(MAJOR_DAMAGE, roll) };
}

// ─── Display helpers ──────────────────────────────────────────────────────────

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function slotLabel(rows: readonly SlotRow[]): string {
  if (rows.length === 0) return 'None';
  return rows.map((r) => `${r.count} x size ${r.size}`).join(', ');
}

const statChanges = computed<string[]>(() => {
  const ship = result.value;
  if (!ship || ship.kind !== 'generated') return [];
  const changes: string[] = [];
  const { baseStats: base, stats } = ship;
  if (base.ftl !== null && stats.ftl !== null && base.ftl !== stats.ftl) {
    changes.push(`FTL ${base.ftl} to ${stats.ftl}`);
  }
  if (base.signature !== stats.signature) {
    changes.push(`Signature ${signed(base.signature)} to ${signed(stats.signature)}`);
  }
  if (base.thrusters !== stats.thrusters) {
    changes.push(`Thrusters ${signed(base.thrusters)} to ${signed(stats.thrusters)}`);
  }
  if (base.hull !== stats.hull) changes.push(`Hull ${base.hull} to ${stats.hull}`);
  if (base.armor !== stats.armor) {
    changes.push(`${armorLabel.value} ${base.armor} to ${stats.armor}`);
  }
  return changes;
});

const briefText = computed<string>(() => {
  const ship = result.value;
  if (!ship) return '';
  const lines: string[] = [];

  if (ship.kind === 'generated') {
    const { shipClass, stats } = ship;
    lines.push(`${shipClass.label} — ${ship.role.label}`);
    lines.push(
      `Length ${shipClass.length} · Crew ${ship.crewCount} (class range ${shipClass.crew})${
        shipClass.passengers
          ? ` · ${shipClass.passengers.toLocaleString('en-US')} passengers`
          : ''
      }`
    );
    lines.push(
      `FTL ${stats.ftl ?? '—'} · Signature ${signed(stats.signature)} · Thrusters ${signed(
        stats.thrusters
      )} · Hull ${stats.hull} · ${armorLabel.value} ${stats.armor}`
    );
    lines.push(`Hardpoints: ${slotLabel(shipClass.hardpoints)}`);
    lines.push('');
    lines.push('Internal modules:');
    for (const m of ship.modules) {
      lines.push(
        `  ${m.name} ${m.size}${m.count > 1 ? ` x ${m.count}` : ''}${
          m.capacity ? ` (${m.capacity})` : ''
        }`
      );
    }
    lines.push(`  ${ship.freeSlots} module slot${ship.freeSlots === 1 ? '' : 's'} still free`);
    if (ship.upgrades.length) {
      lines.push('');
      lines.push('Upgrades:');
      for (const u of ship.upgrades) {
        lines.push(`  ${u.name}${u.count > 1 ? ` x ${u.count}` : ''}`);
      }
    }
    if (ship.armaments.length) {
      lines.push('');
      lines.push('Armaments:');
      for (const a of ship.armaments) lines.push(`  ${a.name} (size ${a.slot} hardpoint)`);
    }
    lines.push('');
    lines.push(`Total cost: ${money(ship.totalCost)}${ship.hasVariableCost ? ' plus A.I.' : ''}`);
  } else {
    const s = ship.ship;
    lines.push(`${s.name} — ${s.subtitle}`);
    lines.push(`${s.manufacturer} · ${money(s.cost)}`);
    lines.push(
      `Crew ${s.crew}${s.passengers ? ` · ${s.passengers}` : ''} · A.I. ${s.ai} · Length ${s.length}`
    );
    lines.push(
      `FTL ${s.ftl} · Signature ${signed(s.signature)} · Thrusters ${signed(s.thrusters)} · Hull ${
        s.hull
      } · ${armorLabel.value} ${s.armor}`
    );
    lines.push('');
    lines.push('Internal modules:');
    for (const m of s.modules) lines.push(`  ${m}`);
    if (s.upgrades.length) {
      lines.push('');
      lines.push('Upgrades:');
      for (const u of s.upgrades) lines.push(`  ${u}`);
    }
    lines.push('');
    lines.push(`Armaments: ${s.armaments.length ? s.armaments.join(', ') : 'None'}`);
  }

  lines.push('');
  lines.push(`Condition: ${ship.condition.label}. ${ship.condition.description}`);
  for (const fault of ship.faults) {
    lines.push(
      `  ${fault.kind === 'minor' ? 'Minor' : 'Major'} (${fault.roll}) ${fault.row.name}: ${
        fault.row.effect
      } Repair: ${fault.row.repair}`
    );
  }
  if (ship.quirk) lines.push('', `Quirk: ${ship.quirk}`);
  if (ship.history) lines.push('', `History: ${ship.history}`);
  if (ship.currentJob) lines.push('', `Current job: ${ship.currentJob}`);

  return lines.join('\n');
});

async function copyBrief(): Promise<void> {
  try {
    await navigator.clipboard.writeText(briefText.value);
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
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex flex-col gap-[0.375rem]">
          <label
            for="ship-source"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Build</label
          >
          <select
            id="ship-source"
            v-model="source"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="class">Build from ship class</option>
            <option value="book">Ship from the books</option>
          </select>
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{
              source === 'class'
                ? `Fits a legal loadout into the ${classes.length}-class table`
                : `Pulls one of the ${namedShips.length} printed ships`
            }}
          </span>
        </div>

        <div v-if="source === 'class'" class="flex flex-col gap-[0.375rem]">
          <label
            for="ship-class"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Class</label
          >
          <select
            id="ship-class"
            v-model="classChoice"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="random">Random</option>
            <option v-for="c in classes" :key="c.id" :value="c.id">
              {{ c.label }} · {{ c.length }}
            </option>
          </select>
        </div>

        <div v-if="source === 'class'" class="flex flex-col gap-[0.375rem]">
          <label
            for="ship-role"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Role</label
          >
          <select
            id="ship-role"
            v-model="roleChoice"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="random">Random</option>
            <option v-for="r in ROLES" :key="r.id" :value="r.id">{{ r.label }}</option>
          </select>
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Decides which modules fill the slots</span
          >
        </div>

        <div v-if="source === 'book'" class="flex flex-col gap-[0.375rem]">
          <label
            for="ship-known"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Ship</label
          >
          <select
            id="ship-known"
            v-model="bookChoice"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="random">Random</option>
            <option v-for="s in namedShips" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>

        <div class="flex flex-col gap-[0.375rem]">
          <label
            for="ship-condition"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Condition</label
          >
          <select
            id="ship-condition"
            v-model="conditionChoice"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="random">Random</option>
            <option v-for="c in CONDITIONS" :key="c.id" :value="c.id">{{ c.label }}</option>
          </select>
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Worn or worse pre-rolls component damage</span
          >
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90"
          @click="generate"
        >
          Generate ship
        </button>

        <label
          class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <input
            v-model="includeQuirk"
            type="checkbox"
            class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          Quirk
        </label>

        <label
          class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <input
            v-model="includeHistory"
            type="checkbox"
            class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          History
        </label>

        <label
          class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <input
            v-model="includeJob"
            type="checkbox"
            class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          Current job
        </label>

        <button
          v-if="result"
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="copyBrief"
        >
          {{ copied ? 'Copied' : 'Copy statblock' }}
        </button>

        <button
          v-if="result"
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="clearResult"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Result -->
    <div v-if="result" class="flex flex-col gap-4" aria-live="polite">
      <!-- Statblock -->
      <div
        class="flex flex-col gap-3 rounded-lg border border-[var(--color-brand-primary)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            class="text-lg font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ result.kind === 'book' ? result.ship.name : result.shipClass.label }}</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ result.kind === 'book' ? result.ship.subtitle : result.role.label }}</span
          >
          <span
            class="ml-auto rounded-full border border-[var(--color-surface-500)] px-3 py-[0.15rem] text-xs font-semibold text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ result.condition.label }}</span
          >
        </div>

        <!-- Stat grid -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div
            class="flex flex-col gap-1 rounded-md border border-[var(--color-surface-600)] bg-[var(--color-surface-600)] px-3 py-2"
          >
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >FTL Rating</span
            >
            <span
              class="text-xl font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{
                result.kind === 'book'
                  ? result.ship.ftl
                  : (result.stats.ftl ?? '—')
              }}</span
            >
          </div>
          <div
            class="flex flex-col gap-1 rounded-md border border-[var(--color-surface-600)] bg-[var(--color-surface-600)] px-3 py-2"
          >
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Signature</span
            >
            <span
              class="text-xl font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{
                signed(result.kind === 'book' ? result.ship.signature : result.stats.signature)
              }}</span
            >
          </div>
          <div
            class="flex flex-col gap-1 rounded-md border border-[var(--color-surface-600)] bg-[var(--color-surface-600)] px-3 py-2"
          >
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Thrusters</span
            >
            <span
              class="text-xl font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{
                signed(result.kind === 'book' ? result.ship.thrusters : result.stats.thrusters)
              }}</span
            >
          </div>
          <div
            class="flex flex-col gap-1 rounded-md border border-[var(--color-surface-600)] bg-[var(--color-surface-600)] px-3 py-2"
          >
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Hull</span
            >
            <span
              class="text-xl font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{ result.kind === 'book' ? result.ship.hull : result.stats.hull }}</span
            >
          </div>
          <div
            class="flex flex-col gap-1 rounded-md border border-[var(--color-surface-600)] bg-[var(--color-surface-600)] px-3 py-2"
          >
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >{{ armorLabel }}</span
            >
            <span
              class="text-xl font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{ result.kind === 'book' ? result.ship.armor : result.stats.armor }}</span
            >
          </div>
        </div>

        <!-- Vitals line -->
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <template v-if="result.kind === 'book'">
            {{ result.ship.manufacturer }} · Length {{ result.ship.length }} · Crew
            {{ result.ship.crew }}<template v-if="result.ship.passengers">
              · {{ result.ship.passengers }}</template
            >
            · A.I. {{ result.ship.ai }} · {{ money(result.ship.cost) }}
          </template>
          <template v-else>
            Length {{ result.shipClass.length }} · Crew {{ result.crewCount }} (class range
            {{ result.shipClass.crew }})<template v-if="result.shipClass.passengers">
              · {{ result.shipClass.passengers.toLocaleString('en-US') }} passengers</template
            >
            · Hardpoints {{ slotLabel(result.shipClass.hardpoints) }}
          </template>
        </p>

        <p
          v-if="result.kind === 'generated' && statChanges.length"
          class="m-0 text-sm leading-[1.55] text-[var(--color-brand-primary)]"
        >
          Upgrades applied: {{ statChanges.join(' · ') }}
        </p>

        <p
          class="m-0 border-t border-[var(--color-surface-600)] pt-3 text-xs leading-[1.6] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          <template v-if="result.kind === 'generated'">{{ result.shipClass.note }}</template>
          <template v-else>{{ result.ship.blurb }}</template>
        </p>
      </div>

      <!-- Generated cost summary -->
      <div
        v-if="result.kind === 'generated'"
        class="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Total cost</span
        >
        <span class="text-xl font-bold text-[var(--color-brand-primary)]">{{
          money(result.totalCost)
        }}</span>
        <span
          class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          Hull {{ money(result.shipClass.cost) }} plus fitted modules, upgrades and
          armaments<template v-if="result.hasVariableCost">. The A.I. price is listed as
            "varies" in the book and is not counted</template
          >. A typical lease runs 2% of the total per year.
        </span>
      </div>

      <!-- Modules / upgrades / armaments -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Internal modules</span
          >
          <template v-if="result.kind === 'generated'">
            <div
              v-for="(m, i) in result.modules"
              :key="`${m.name}-${i}`"
              class="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-[var(--color-surface-600)] pb-1 last:border-0"
            >
              <span
                class="text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
                >{{ m.name }} {{ m.size }}<template v-if="m.count > 1"> x {{ m.count }}</template>
                <span
                  v-if="m.capacity"
                  class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                  >· {{ m.capacity }}</span
                >
              </span>
              <span
                class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                >{{ m.cost === null ? 'varies' : money(m.cost * m.count) }}</span
              >
            </div>
            <span
              class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >{{ result.freeSlots }} module slot{{ result.freeSlots === 1 ? '' : 's' }} still
              free</span
            >
          </template>
          <template v-else>
            <span
              v-for="m in result.ship.modules"
              :key="m"
              class="text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{ m }}</span
            >
          </template>
        </div>

        <div class="flex flex-col gap-4">
          <div
            class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
          >
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Upgrades</span
            >
            <template v-if="result.kind === 'generated'">
              <div
                v-for="u in result.upgrades"
                :key="u.name"
                class="flex flex-col gap-[0.1rem] border-b border-[var(--color-surface-600)] pb-1 last:border-0"
              >
                <span
                  class="text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
                  >{{ u.name }}<template v-if="u.count > 1"> x {{ u.count }}</template>
                  <span
                    class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                    >· {{ money(u.cost) }}</span
                  ></span
                >
                <span
                  class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                  >{{ u.effect }}</span
                >
              </div>
              <span
                v-if="!result.upgrades.length"
                class="text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                >None</span
              >
            </template>
            <template v-else>
              <span
                v-for="u in result.ship.upgrades"
                :key="u"
                class="text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
                >{{ u }}</span
              >
              <span
                v-if="!result.ship.upgrades.length"
                class="text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                >None</span
              >
            </template>
          </div>

          <div
            class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
          >
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Armaments</span
            >
            <template v-if="result.kind === 'generated'">
              <div
                v-for="a in result.armaments"
                :key="a.name"
                class="flex flex-col gap-[0.1rem] border-b border-[var(--color-surface-600)] pb-1 last:border-0"
              >
                <span
                  class="text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
                  >{{ a.name }}
                  <span
                    class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                    >· size {{ a.slot }} hardpoint · {{ money(a.cost) }}</span
                  ></span
                >
                <span
                  class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                  >{{ a.detail }}</span
                >
              </div>
              <span
                v-if="!result.armaments.length"
                class="text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                >None</span
              >
            </template>
            <template v-else>
              <span
                v-for="a in result.ship.armaments"
                :key="a"
                class="text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
                >{{ a }}</span
              >
              <span
                v-if="!result.ship.armaments.length"
                class="text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                >None</span
              >
            </template>
          </div>
        </div>
      </div>

      <!-- Condition and component damage -->
      <div
        class="flex flex-col gap-3 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Condition · {{ result.condition.label }}</span
          >
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90"
              @click="rollMinor"
            >
              Roll minor damage (D66)
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              @click="rollMajor"
            >
              Roll major damage (2D6)
            </button>
          </div>
        </div>

        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ result.condition.description }}
        </p>

        <div
          v-for="(fault, i) in result.faults"
          :key="`${fault.kind}-${i}`"
          class="flex flex-col gap-1 rounded-md border border-[var(--color-surface-600)] bg-[var(--color-surface-600)] p-3"
        >
          <span class="text-xs font-semibold tracking-[0.06em] text-[var(--color-brand-primary)] uppercase"
            >{{ fault.kind === 'minor' ? 'Minor' : 'Major' }} component damage · rolled
            {{ fault.roll }} · {{ fault.row.name }}</span
          >
          <span
            class="text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ fault.row.effect }}</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Repair roll: {{ fault.row.repair }}</span
          >
        </div>

        <div
          v-if="minorRoll"
          class="flex flex-col gap-1 rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-surface-600)] p-3"
        >
          <span class="text-xs font-semibold tracking-[0.06em] text-[var(--color-brand-primary)] uppercase"
            >Minor · rolled {{ minorRoll.roll }} · {{ minorRoll.row.name }}</span
          >
          <span
            class="text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ minorRoll.row.effect }}</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Repair roll: {{ minorRoll.row.repair }}</span
          >
        </div>

        <div
          v-if="majorRoll"
          class="flex flex-col gap-1 rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-surface-600)] p-3"
        >
          <span class="text-xs font-semibold tracking-[0.06em] text-[var(--color-brand-primary)] uppercase"
            >Major · rolled {{ majorRoll.roll }} · {{ majorRoll.row.name }}</span
          >
          <span
            class="text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ majorRoll.row.effect }}</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Repair roll: {{ majorRoll.row.repair }}</span
          >
        </div>

        <p
          class="m-0 border-t border-[var(--color-surface-600)] pt-3 text-xs leading-[1.6] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          An attack that inflicts 1 or more damage but less than half the Hull rating causes minor
          component damage. Half the Hull rating or more, but less than the full rating, causes major
          component damage. Damage equal to or above the Hull rating destroys the ship outright. Each
          HEAVY MACHINERY repair roll consumes a mechanical spare part, each COMTECH roll an
          electronic one.
        </p>
      </div>

      <!-- Noteworthy ships -->
      <div
        v-if="result.kind === 'book' && result.ship.noteworthy"
        class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Noteworthy ships</span
        >
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ result.ship.noteworthy }}
        </p>
      </div>

      <!-- Role summary -->
      <div
        v-if="result.kind === 'generated'"
        class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Role · {{ result.role.label }}</span
        >
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ result.role.summary }}
        </p>
      </div>

      <!-- Quirk / History / Current job (shared between editions) -->
      <div
        v-if="result.quirk || result.history || result.currentJob"
        class="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] grid-cols-1 gap-4"
      >
        <div
          v-if="result.quirk"
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Quirk</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ result.quirk }}
          </p>
        </div>
        <div
          v-if="result.history"
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
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
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Current job</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ result.currentJob }}
          </p>
        </div>
      </div>

      <!-- Source note -->
      <p
        class="m-0 text-xs leading-[1.6] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
      >
        <template v-if="edition === 'evolved'">
          Ship classes, modules, upgrades, armaments and component damage from the Evolved Edition,
          chapter 7. Armor is an Armor Level bought through Armored Bulkheads. Quirk, history and
          job prompts are original and work with either edition.
        </template>
        <template v-else>
          Ship classes, modules, upgrades, armaments and component damage from the Core Rulebook,
          chapter 7. Armor is an Armor Rating printed in the class table itself. Quirk, history and
          job prompts are original and work with either edition.
        </template>
      </p>
    </div>
  </div>
</template>
