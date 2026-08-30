<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEdition } from '@/shared/edition';

// ─── Dice ────────────────────────────────────────────────────────────────────

function d6() {
  return Math.floor(Math.random() * 6) + 1;
}
function d12() {
  return Math.floor(Math.random() * 12) + 1;
}
function d3() {
  return Math.floor(Math.random() * 3) + 1;
}
function d66() {
  return d6() * 10 + d6();
}
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// ─── Shared tables ────────────────────────────────────────────────────────────

const STAR_TYPES = [
  {
    id: 1,
    type: 'Giant',
    description: 'Huge, bright, and cool star in a late stage of evolution',
    brightnessClass: 'Type III',
  },
  {
    id: 2,
    type: 'Subgiant',
    description: 'A large, bright star, exhausting its fuel',
    brightnessClass: 'Type IV',
  },
  {
    id: 3,
    type: 'Main Sequence',
    description: 'Small but incredibly common type of star',
    brightnessClass: 'Type V',
  },
  {
    id: 4,
    type: 'White Dwarf',
    description: 'A dead, burnt-out star, tiny and super-dense',
    brightnessClass: 'Type DA',
  },
  {
    id: 5,
    type: 'Red Dwarf',
    description: 'A red main sequence star, small and cool. Very common star',
    brightnessClass: 'Type MV',
  },
  {
    id: 6,
    type: 'White Main Sequence',
    description: 'White main sequence stars that burn hot and brightly',
    brightnessClass: 'Type A0V',
  },
];

const GAS_GIANT_FEATURES = [
  'Storms',
  'Single super storm',
  'Rings',
  'High winds',
  'Intense radiation fields',
  'Small gas giant',
];

const ASTEROID_BELT_FEATURES = [
  'Bright and highly visible',
  'High orbital inclination',
  'Dust belt',
  'Contains several large dwarf planets',
  'Very wide, covering several orbits',
  'Intensely mineral-rich asteroids',
];

const COLONY_FACTIONS = [
  { roll: 1, text: 'Newcomers' },
  { roll: 2, text: 'Corporate representatives' },
  { roll: 3, text: 'Scientists' },
  { roll: 4, text: 'Workers' },
  { roll: 5, text: 'Security / military' },
  { roll: 6, text: 'Colonial leadership' },
];

// ─── Core Rulebook tables ─────────────────────────────────────────────────────

const PLANET_SIZES_CORE = [
  { size: 'Dwarf', gravity: '0.2g', examples: 'Pluto, Ceres, Chiron' },
  { size: 'Small', gravity: '0.4g', examples: 'Mercury, Moon' },
  { size: 'Medium-Small', gravity: '0.6g', examples: 'Mars, Titan' },
  { size: 'Medium', gravity: '1.0g', examples: 'Earth, Venus' },
  { size: 'Large', gravity: '1.5g', examples: 'Super-Earth' },
  { size: 'Very Large', gravity: '2.0g', examples: 'Ice giant' },
];

const ATM_MOD_CORE = [-2, -1, 0, 0, 1, 2];

interface AtmoEntry {
  type: string;
  modifier: number;
}
const ATMOSPHERES_CORE: AtmoEntry[] = [
  // index 0: ≤0 fallback (Thin)
  { type: 'Thin', modifier: -2 },
  { type: 'Breathable', modifier: 2 },
  { type: 'Breathable', modifier: 2 },
  { type: 'Tainted', modifier: 0 },
  { type: 'Tainted', modifier: 0 },
  { type: 'Toxic', modifier: -2 },
  { type: 'Toxic', modifier: -2 },
  { type: 'Corrosive', modifier: -4 },
];

const TEMPERATURES_CORE = [
  // index 0: ≤0 fallback (Frozen)
  { temp: 'Frozen', avg: '–50°C or less', desc: 'Titan, Pluto, Enceladus' },
  { temp: 'Cold', avg: '–30°C to –10°C', desc: 'Arctic-like conditions' },
  { temp: 'Cold', avg: '–30°C to –10°C', desc: 'Arctic-like conditions' },
  { temp: 'Temperate', avg: '–10°C to 30°C', desc: 'Earth-like temperatures' },
  { temp: 'Temperate', avg: '–10°C to 30°C', desc: 'Earth-like temperatures' },
  { temp: 'Warm', avg: '30°C to 60°C', desc: 'Hot desert-like climate' },
  { temp: 'Warm', avg: '30°C to 60°C', desc: 'Hot desert-like climate' },
  { temp: 'Hot', avg: '60°C to 150°C', desc: 'Extreme heat zones' },
  { temp: 'Inferno', avg: '150°C or more', desc: 'Hellish surface conditions' },
];

const GEOSPHERES_CORE = [
  { type: 'Dead', desc: 'No geological activity. No tectonic movement.' },
  { type: 'Dead', desc: 'No geological activity. No tectonic movement.' },
  { type: 'Slug', desc: 'Very slow movement. Rare earthquakes.' },
  { type: 'Slug', desc: 'Very slow movement. Rare earthquakes.' },
  { type: 'Stable', desc: 'Low geological activity. Occasional quakes.' },
  { type: 'Stable', desc: 'Low geological activity. Occasional quakes.' },
  { type: 'Active', desc: 'Moderate activity. Frequent earthquakes, some volcanism.' },
  { type: 'Active', desc: 'Moderate activity. Frequent earthquakes, some volcanism.' },
  { type: 'Volatile', desc: 'High activity. Major quakes, active volcanoes.' },
  { type: 'Volatile', desc: 'High activity. Major quakes, active volcanoes.' },
  { type: 'Extreme', desc: 'Extreme geological activity. Constant eruptions.' },
  { type: 'Extreme', desc: 'Extreme geological activity. Constant eruptions.' },
];

const TERRAINS_CORE = [
  'Barren, rocky landscape',
  'Barren, rocky landscape',
  'Sandy deserts and dunes',
  'Varied — plains, hills, valleys',
  'Varied — with some water bodies',
  'Dense vegetation — forests and jungles',
];

const ICE_TERRAINS_CORE = [
  'Ice Plains',
  'Ice Canyons',
  'Glaciers',
  'Frozen Ocean',
  'Ice Mountains',
  'Snow Fields',
  'Underground Ice Caves',
  'Ice Craters',
  'Methane Lakes',
  'Gas Vents',
  'Crystal Forests',
  'GM Decides',
];

const ORBITAL_FEATURES_CORE = [
  'Artificial ring system',
  'Artificial ring system',
  'Debris field',
  'Debris field',
  'Small moons (1D3)',
  'Small moons (1D3)',
  'Medium moon',
  'Medium moon',
  'Large moon',
  'Large moon',
  'Nothing of note',
  'Nothing of note',
];

const COLONY_MISSION_TABLE_CORE = [
  { roll: 2, type: 'Terraforming' },
  { roll: 3, type: 'Research' },
  { roll: 4, type: 'Survey and prospecting' },
  { roll: 5, type: 'Prison / secluded / exile' },
  { roll: 6, type: 'Mining and refining' },
  { roll: 7, type: 'Mineral drilling' },
  { roll: 8, type: 'Communications relay' },
  { roll: 9, type: 'Military' },
  { roll: 10, type: 'Cattle ranching / logging' },
  { roll: 11, type: 'Corporate HQ' },
  { roll: 12, type: 'Government HQ' },
];

const COLONY_SIZE_TABLE_CORE = [
  { min: 2, max: 7, size: 'Start-up', population: '3D6 x 10', missionSlots: '1' },
  { min: 8, max: 10, size: 'Young', population: '3D6 x 100', missionSlots: 'D3 - 1' },
  { min: 11, max: 12, size: 'Established', population: '2D6 x 1,000', missionSlots: 'D3' },
];

const NUMBER_OF_FACTIONS_CORE = [
  { roll: 1, text: 'One dominant faction' },
  { roll: 2, text: 'Two balanced factions' },
  { roll: 3, text: 'Two competing factions' },
  { roll: 4, text: 'One dominant, one weak faction' },
  { roll: 5, text: 'Three competing factions' },
  { roll: 6, text: 'D6 factions, comparative strengths by D6 each' },
];

const COLONY_ORBIT_TABLE_CORE = [
  { roll: 2, text: 'Little (perhaps wreckage) or nothing' },
  { roll: 3, text: 'Little (perhaps wreckage) or nothing' },
  { roll: 4, text: 'Little (perhaps wreckage) or nothing' },
  { roll: 5, text: 'Ring' },
  { roll: 6, text: 'Abandoned or repurposed satellite / station' },
  { roll: 7, text: 'D3 moons' },
  { roll: 8, text: 'D3 moons' },
  { roll: 9, text: 'Survey station' },
  { roll: 10, text: 'Several survey and communications satellites' },
  { roll: 11, text: 'Transfer station' },
  { roll: 12, text: 'Roll D6 times' },
];

const COLONY_ALLEGIANCE_CORE = [
  { roll: 3, independent: 'Kelland Mining', american: 'Kelland Mining' },
  { roll: 4, independent: 'Kelland Mining', american: 'Kelland Mining' },
  { roll: 5, independent: 'GeoFund Investor', american: 'Gustafsson Enterprise' },
  { roll: 6, independent: 'Gustafsson Enterprise', american: 'GeoFund Investor' },
  { roll: 7, independent: 'Seegson', american: 'Lasalle Bionational' },
  { roll: 8, independent: 'No allegiance (Independent)', american: 'Weyland-Yutani' },
  { roll: 9, independent: 'Jingti Long Corporation', american: 'Government representative' },
  { roll: 10, independent: 'Jingti Long Corporation', american: 'Government representative' },
  { roll: 11, independent: 'Jingti Long Corporation', american: 'Government representative' },
  { roll: 12, independent: 'Chigusa Corporation', american: 'Weyland-Yutani' },
  { roll: 13, independent: 'Lasalle Bionational', american: 'Seegson' },
  { roll: 14, independent: 'Seegson', american: 'Jingti Long Corporation' },
  { roll: 15, independent: 'Lorenz SysTech', american: 'Chigusa Corporation' },
  { roll: 16, independent: 'Gemini Exoplanet', american: 'Gemini Exoplanet' },
  { roll: 17, independent: 'Farside Mining', american: 'Farside Mining' },
  { roll: 18, independent: 'Farside Mining', american: 'Farside Mining' },
];

const SCENARIO_HOOKS_CORE = new Map<number, string>([
  [11, 'Pilfering and thefts force security to search rooms and lockers'],
  [12, 'Incidents of sabotage are increasing; security suspects an organized campaign'],
  [13, 'Colonial administration is investigating the colony for illegal practices'],
  [14, "Colonists report sighting a 'monster' on the surface"],
  [15, 'Petty crime, thefts, and sabotage are rife'],
  [16, 'Equipment failure has caused rationing. Tempers are frayed.'],
  [21, 'A ship arrived carrying a parasite that will soon spread through the colony'],
  [22, 'Stolen goods are on offer - cheap'],
  [23, 'An old friend or flame is unexpectedly at the colony'],
  [24, 'An old enemy or rival is unexpectedly at the colony'],
  [25, 'A minor dignitary is visiting with several aides or guards'],
  [26, 'Part of the colony is temporarily off-limits, no reason given'],
  [31, 'Sudden restrictions on free movement unless bypassed'],
  [32, 'An emergency has vital supplies being shipped in from a nearby colony'],
  [33, 'A local crisis is about to hit (storm, quake, riot, fire)'],
  [34, 'Solar flare period will cut communications for one shift'],
  [35, 'Spies from a neighboring colony have been discovered and arrested'],
  [36, 'Operations manager and deputy are in conflict, and sides are forming'],
  [41, 'The PCs are invited to a formal dinner, meeting, or party'],
  [42, 'The local colonists are not what they seem'],
  [43, 'A military ship is in orbit and searching for someone or something'],
  [44, 'A rival colony or corporation is about to carry out sabotage'],
  [45, 'The spaceport is currently quarantined'],
  [46, 'Security situation at the colony is deteriorating'],
  [51, 'Asteroid miners on leave are causing trouble'],
  [52, 'A mystery ship arrives at the spaceport'],
  [53, 'Civil unrest is about to break out'],
  [54, 'Colonists are trapped and need rescue far from the settlement'],
  [55, 'Authorities have locked down the colony after a riot'],
  [56, 'A religious leader is whipping up discontent'],
  [61, 'The PCs are harassed by angry locals for unclear reasons'],
  [62, 'An overland expedition is forming and the PCs are invited'],
  [63, 'An important official is murdered and a search is underway'],
  [64, 'Several colonists have gone missing and a search is underway'],
  [65, 'A lifeboat crashes with an interesting individual aboard'],
  [66, 'The sponsor keeps ordering remote-area expeditions for unclear reasons'],
]);

// ─── Evolved Edition tables ───────────────────────────────────────────────────

const PLANET_SIZES_EVOLVED = [
  {
    min: -99,
    max: 2,
    size: '<1,000 km',
    gravity: 'Almost 0-G',
    examples: 'Ceres and other asteroids',
    diameterKm: 999,
  },
  { min: 3, max: 4, size: '2,000 km', gravity: '0.1G', examples: 'Iapetus', diameterKm: 2000 },
  { min: 5, max: 6, size: '4,000 km', gravity: '0.2G', examples: 'Luna, Europa', diameterKm: 4000 },
  { min: 7, max: 7, size: '7,000 km', gravity: '0.5G', examples: 'Mars', diameterKm: 7000 },
  { min: 8, max: 8, size: '10,000 km', gravity: '0.7G', examples: '', diameterKm: 10000 },
  {
    min: 9,
    max: 10,
    size: '12,500 km',
    gravity: '1.0G',
    examples: 'Earth, Venus',
    diameterKm: 12500,
  },
  { min: 11, max: 11, size: '15,000 km', gravity: '1.3G', examples: '', diameterKm: 15000 },
  {
    min: 12,
    max: 99,
    size: '20,000 km',
    gravity: '2G',
    examples: 'Super-Earth',
    diameterKm: 20000,
  },
];

const ATMOSPHERES_EVOLVED = [
  { min: -99, max: 3, type: 'Thin' },
  { min: 4, max: 6, type: 'Breathable' },
  { min: 7, max: 8, type: 'Toxic' },
  { min: 9, max: 9, type: 'Dense' },
  { min: 10, max: 10, type: 'Corrosive' },
  { min: 11, max: 11, type: 'Infiltrating' },
  { min: 12, max: 99, type: 'Special' },
];

const TEMPERATURES_EVOLVED = [
  { min: -99, max: 3, temp: 'Frozen', avg: '−50°C or less', desc: 'Titan, Pluto, Enceladus' },
  { min: 4, max: 5, temp: 'Cold', avg: '−50 to 0°C', desc: 'Alaska or Antarctica in winter' },
  { min: 6, max: 7, temp: 'Temperate', avg: '0 to 30°C', desc: 'Boston or Paris' },
  { min: 8, max: 10, temp: 'Hot', avg: '31 to 80°C', desc: 'Mojave or Sahara Deserts' },
  { min: 11, max: 99, temp: 'Burning', avg: '80°C or more', desc: 'Mercury, Venus' },
];

const GEOSPHERES_EVOLVED = [
  { min: -99, max: 4, type: 'Desert World', desc: 'No surface water' },
  { min: 5, max: 6, type: 'Arid World', desc: 'Global deserts, some lakes and small seas' },
  { min: 7, max: 8, type: 'Dry Temperate', desc: "Oceans cover 30–40% of world's surface" },
  { min: 9, max: 10, type: 'Wet Temperate', desc: "Oceans cover 60–70% of world's surface" },
  { min: 11, max: 11, type: 'Wet World', desc: 'Global oceans with some islands and archipelagos' },
  { min: 12, max: 99, type: 'Water World', desc: 'No dry land' },
];

// D66 terrestrial terrain table for Evolved Edition
const TERRAINS_EVOLVED = new Map<number, string>([
  [11, 'Huge impact crater'],
  [12, 'Plains of silicon glass'],
  [13, 'Disturbing wind-cut rock formations'],
  [14, 'Permanent global dust-storm'],
  [15, 'Eerily colored dust plains'],
  [16, 'Active volcanic lava fields'],
  [21, 'Extensive salt flats'],
  [22, 'Dust-laden, permanent sunset sky'],
  [23, 'Ancient, blackened lava plains'],
  [24, 'Thermal springs and steam vents'],
  [25, 'Tall, gravel-strewn mountains'],
  [26, 'Howling winds that never stop'],
  [31, 'Daily fog banks roll in'],
  [32, 'Deep and wide rift valleys'],
  [33, 'Bizarrely eroded, wind-cut badlands'],
  [34, 'Steep-sided river gorges cut into soft rocks'],
  [35, 'Huge moon dominates day/night sky'],
  [36, 'World-spanning super canyon'],
  [41, 'Impressive river of great length'],
  [42, 'Oddly colored forests of alien vegetation'],
  [43, 'Mountains cut by sky-blue lakes'],
  [44, 'Sweeping plains of elephant grass'],
  [45, 'Highly toxic, but beautiful, plant-life'],
  [46, 'Small, bright, incredibly fast moons in orbit'],
  [51, 'Vast and complex river delta'],
  [52, 'Immense series of waterfalls'],
  [53, 'Endless mudflats with twisting waterways'],
  [54, 'Impressive coastline of fjords and cliffs'],
  [55, 'Volcanoes, active & widespread'],
  [56, 'Impenetrable jungle'],
  [61, 'Dangerous tides – fast and loud'],
  [62, 'Vast, permanent super storm'],
  [63, 'Toxic sea creatures floating with the currents'],
  [64, 'Volcanic island chains'],
  [65, 'Permanently overcast with unrelenting rainfall'],
  [66, 'Mildly acidic oceans and rainfall'],
]);

// D12 ice terrain (roll 1 not in book, fallback used; entries 2–12 per table)
const ICE_TERRAINS_EVOLVED = [
  'GM Decides',
  'Huge impact crater',
  'Geysers spew water into low orbit from long fissures',
  'Deep fissures leading to a subsurface ocean',
  'Dramatically colored blue-green ice fissures',
  'Huge and active cryovolcano',
  'Vast range of ice mountains',
  'World-spanning super canyon',
  'Disturbing, wind-cut ice formations',
  'Black, dust-covered ice plains',
  'Impressive ice escarpment of great length',
  'Extensive dune-fields of methane sand grains',
];

const ORBITAL_COMPONENTS_EVOLVED = [
  { max: 4, text: 'Nothing' },
  { max: 5, text: 'Ring' },
  { max: 6, text: 'Abandoned or repurposed satellite or space station' },
  { max: 8, text: 'D3 moons' },
  { max: 9, text: 'Survey station' },
  { max: 10, text: 'Communications satellites' },
  { max: 11, text: 'Transfer station' },
  { max: 99, text: 'Roll D6 times' },
];

const COLONY_SIZE_TABLE_EVOLVED = [
  { max: 7, size: 'Start-Up', population: '3D6 × 10', missionSlots: '1' },
  { max: 10, size: 'Young', population: '3D6 × 100', missionSlots: 'D3−1' },
  { max: 99, size: 'Established', population: '2D6 × 1,000', missionSlots: 'D3' },
];

const COLONY_MISSION_TABLE_EVOLVED = [
  { max: 2, type: 'Terraforming' },
  { max: 3, type: 'Research' },
  { max: 4, type: 'Surveying and prospecting' },
  { max: 5, type: 'Prison or exile' },
  { max: 6, type: 'Mining and refining' },
  { max: 7, type: 'Mineral drilling' },
  { max: 8, type: 'Communications relay' },
  { max: 9, type: 'Military' },
  { max: 10, type: 'Cattle ranching/logging' },
  { max: 11, type: 'Corporate HQ' },
  { max: 99, type: 'Government HQ' },
];

const COLONY_ALLEGIANCE_EVOLVED = [
  { min: 3, max: 4, independent: 'Kelland Mining', american: 'Kelland Mining' },
  { min: 5, max: 5, independent: 'GeoFund Investor', american: 'GeoFund Investor' },
  { min: 6, max: 6, independent: 'Gustafsson Enterprise', american: 'Gustafsson Enterprise' },
  { min: 7, max: 8, independent: 'Seegson', american: 'Weyland-Yutani' },
  { min: 9, max: 9, independent: 'No allegiance (independent)', american: 'Seegson' },
  {
    min: 10,
    max: 12,
    independent: 'Jĭngtì Lóng Corporation',
    american: 'Government representative',
  },
  { min: 13, max: 13, independent: 'Chigusa Corporation', american: 'Chigusa Corporation' },
  { min: 14, max: 14, independent: 'Lasalle Bionational', american: 'Lasalle Bionational' },
  { min: 15, max: 15, independent: 'Lorenz SysTech', american: 'Jĭngtì Lóng Corporation' },
  { min: 16, max: 16, independent: 'Gemini Exoplanet', american: 'Gemini Exoplanet' },
  { min: 17, max: 18, independent: 'Farside Mining', american: 'Farside Mining' },
];

const CAMPAIGN_HOOKS_EVOLVED = new Map<number, string>([
  [11, 'Pilfering and thefts force security to search rooms and lockers'],
  [12, 'Incidents of sabotage are increasing; security suspects an organized campaign'],
  [13, 'Colonial administration is investigating the colony for illegal practices'],
  [14, "Colonists returning to base report sighting a 'monster' on the surface"],
  [15, 'Petty crime, thefts, and sabotage are rife'],
  [16, 'Equipment failure has caused rationing. Tempers are frayed.'],
  [21, 'A ship arrived carrying a parasite that will soon spread through the colony'],
  [22, 'Stolen goods are on offer – cheap!'],
  [23, 'An old friend or flame is unexpectedly at the colony'],
  [24, 'An old enemy or rival is unexpectedly at the colony'],
  [25, 'A minor dignitary is visiting with several aides or guards'],
  [26, 'Part of the colony is temporarily off-limits, no reason given'],
  [31, 'Sudden restrictions on free movement unless bypassed'],
  [32, 'An emergency has vital supplies being shipped in from a nearby colony'],
  [33, 'A local crisis is about to hit (storm, quake, riot, fire)'],
  [34, 'Period of solar flare – will cut communications for 2D6 hours (2D6 days if star type MV)'],
  [35, 'Spies from a neighboring colony have been discovered and arrested'],
  [36, 'Operations manager and deputy are in conflict, and sides are forming'],
  [41, 'The PCs are invited to a formal dinner, meeting, or party'],
  [42, 'The local colonists are not what they seem'],
  [43, 'A military ship is in orbit and the landing party is searching for someone/something'],
  [44, 'A rival colony or corporation is about to carry out sabotage'],
  [45, 'The spaceport is currently quarantined'],
  [46, 'Security situation at the colony.'],
  [51, 'Asteroid miners on leave are causing trouble'],
  [52, 'A mystery ship arrives at the spaceport'],
  [53, 'Civil unrest is about to break out'],
  [54, 'Colonists are trapped and need rescue far from the settlement'],
  [55, 'Authorities have locked down the colony after a riot'],
  [56, 'A religious leader is whipping up discontent'],
  [
    61,
    'PCs will be harassed by angry locals. Why the anger? And why directed at off-world personnel?',
  ],
  [62, 'An overland expedition is forming and the PCs are invited'],
  [63, 'An important colonial official is murdered, only an hour after you arrive'],
  [64, 'Several colonists have gone missing – a search is underway'],
  [65, 'A lifeboat crashes with an interesting individual aboard'],
  [
    66,
    "The corporation or government paying for the colony keeps ordering teams out to search remote areas – but won't say what they are searching for",
  ],
]);

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface PlanetResult {
  sizeEntry: { size: string; gravity: string; examples: string };
  sizeRoll: number;
  atmoEntry: AtmoEntry;
  atmoRoll: number;
  tempEntry: { temp: string; avg: string; desc: string };
  tempRoll: number;
  geoEntry: { type: string; desc: string };
  geoRoll: number;
  terrain: string;
  terrainRoll: number;
  isIcePlanet: boolean;
  diameterKm?: number;
}

interface ColonyResult {
  size: { size: string; population: string; missionSlots: string };
  sizeRoll: number;
  missionType: string;
  missionRoll: number;
  orbit: string;
  orbitRoll: number;
  factionCount: string;
  factionCountRoll: number;
  factions: string;
  factionsRoll: number;
  allegianceIndependent: string;
  allegianceAmerican: string;
  allegianceRoll: number;
  scenarioHook: string;
  scenarioRoll: number;
}

interface OrbitalResult {
  feature: string;
}

interface StarSystemResult {
  star: (typeof STAR_TYPES)[number];
  gasGiants: number;
  terrestrialPlanets: number;
  icePlanets: number;
  asteroidBelts: number;
  gasGiantMoons: number;
  gasGiantFeature: string | null;
  asteroidBeltFeature: string | null;
}

// ─── State ────────────────────────────────────────────────────────────────────

// Edition is chosen once in the sidebar and shared by every tool in the suite.
const edition = useEdition();
const planetContext = ref<'terrestrial' | 'ice' | 'moon'>('terrestrial');
const planet = ref<PlanetResult | null>(null);
const colony = ref<ColonyResult | null>(null);
const orbital = ref<OrbitalResult | null>(null);
const starSystem = ref<StarSystemResult | null>(null);
const selectedStarTypeId = ref<number>(3);

// The editions use different tables, so stale results would be misleading.
watch(edition, () => {
  planet.value = null;
  colony.value = null;
  orbital.value = null;
  starSystem.value = null;
  planetContext.value = 'terrestrial';
});

// ─── Core generation ──────────────────────────────────────────────────────────

function generatePlanet() {
  const sizeRoll = d6();
  const sizeIdx = sizeRoll - 1;
  const sizeEntry = PLANET_SIZES_CORE[sizeIdx];
  const atmMod = ATM_MOD_CORE[sizeIdx];

  const atmoRollRaw = d6() + atmMod;
  const atmoIdx = Math.min(Math.max(atmoRollRaw, 0), 7);
  const atmoEntry = ATMOSPHERES_CORE[atmoIdx];

  const tempRollRaw = d6() + atmoEntry.modifier;
  const tempIdx = Math.min(Math.max(tempRollRaw, 0), 8);
  const tempEntry = TEMPERATURES_CORE[tempIdx];

  const geoRoll = d12();
  const geoEntry = GEOSPHERES_CORE[geoRoll - 1];

  const isIcePlanet = tempEntry.temp === 'Frozen';
  let terrain: string;
  let terrainRoll: number;

  if (isIcePlanet) {
    terrainRoll = d12();
    terrain = ICE_TERRAINS_CORE[Math.min(terrainRoll - 1, 11)];
  } else {
    terrainRoll = d6();
    terrain = TERRAINS_CORE[terrainRoll - 1] ?? 'GM Decides';
  }

  planet.value = {
    sizeEntry: { size: sizeEntry.size, gravity: sizeEntry.gravity, examples: sizeEntry.examples },
    sizeRoll,
    atmoEntry,
    atmoRoll: atmoRollRaw,
    tempEntry: { temp: tempEntry.temp, avg: tempEntry.avg, desc: tempEntry.desc },
    tempRoll: tempRollRaw,
    geoEntry: { type: geoEntry.type, desc: geoEntry.desc },
    geoRoll,
    terrain,
    terrainRoll,
    isIcePlanet,
  };
}

function generateStarSystem() {
  const star = STAR_TYPES.find((e) => e.id === selectedStarTypeId.value) ?? STAR_TYPES[2];

  const gasGiants = clamp(d6() + (star.id === 2 ? -2 : star.id === 4 ? -5 : -1), 0, 12);
  const terrestrialPlanets = clamp(d6() + ([4, 5].includes(star.id) ? -3 : 0), 0, 12);
  const icePlanets = clamp(d6() + ([1, 2, 3].includes(star.id) ? 0 : 1), 0, 12);
  const asteroidBelts = clamp(d6() + ([2, 4].includes(star.id) ? -5 : -3), 0, 12);

  starSystem.value = {
    star,
    gasGiants,
    terrestrialPlanets,
    icePlanets,
    asteroidBelts,
    gasGiantMoons: d6() + 4,
    gasGiantFeature: gasGiants > 0 ? GAS_GIANT_FEATURES[d6() - 1] : null,
    asteroidBeltFeature: asteroidBelts > 0 ? ASTEROID_BELT_FEATURES[d6() - 1] : null,
  };
}

function generateColony() {
  if (!planet.value) return;

  const colonyAtmosphereRoll =
    planet.value.atmoEntry.type === 'Thin'
      ? 3
      : planet.value.atmoEntry.type === 'Breathable'
        ? planet.value.atmoRoll <= 1
          ? 5
          : 6
        : planet.value.atmoEntry.type === 'Tainted'
          ? 9
          : planet.value.atmoEntry.type === 'Toxic'
            ? planet.value.atmoRoll <= 5
              ? 7
              : 8
            : 10;

  let colonySizeMod = 0;
  colonySizeMod += [4, 5, 6].includes(colonyAtmosphereRoll) ? 1 : 0;
  colonySizeMod -= [10, 11].includes(colonyAtmosphereRoll) ? 2 : 0;
  colonySizeMod -= colonyAtmosphereRoll <= 5 ? 3 : 0;

  const sizeRoll = clamp(d6() + d6() + colonySizeMod, 2, 12);
  const colonySizeEntry =
    COLONY_SIZE_TABLE_CORE.find((e) => sizeRoll >= e.min && sizeRoll <= e.max) ??
    COLONY_SIZE_TABLE_CORE[0];

  let colonyMissionMod = 0;
  colonyMissionMod -= [7, 8, 10, 11].includes(colonyAtmosphereRoll) ? 6 : 0;
  if (sizeRoll <= 7) colonyMissionMod -= 1;
  colonyMissionMod += [4, 5, 6].includes(colonyAtmosphereRoll) ? 1 : 0;
  if (sizeRoll >= 11) colonyMissionMod += 4;

  const missionRoll = clamp(d6() + d6() + colonyMissionMod, 2, 12);
  const missionType =
    COLONY_MISSION_TABLE_CORE.find((e) => e.roll === missionRoll)?.type ?? 'Mining and refining';

  const orbitMod = [8, 9, 10].includes(missionRoll) ? 1 : missionRoll >= 11 ? 2 : 0;
  const orbitRoll = clamp(d6() + d6() + orbitMod, 2, 12);
  const orbit =
    COLONY_ORBIT_TABLE_CORE.find((e) => e.roll === orbitRoll)?.text ??
    'Little (perhaps wreckage) or nothing';

  const factionCountRoll = d6();
  const factionCount =
    NUMBER_OF_FACTIONS_CORE.find((e) => e.roll === factionCountRoll)?.text ??
    'One dominant faction';

  const factionsRoll = d6();
  const factions = COLONY_FACTIONS.find((e) => e.roll === factionsRoll)?.text ?? 'Workers';

  const allegianceRoll = d6() + d6() + d6();
  const allegiance =
    COLONY_ALLEGIANCE_CORE.find((e) => e.roll === allegianceRoll) ?? COLONY_ALLEGIANCE_CORE[0];

  const scenarioRoll = d66();
  const scenarioHook =
    SCENARIO_HOOKS_CORE.get(scenarioRoll) ?? 'Unusual colonial tensions are escalating.';

  colony.value = {
    size: {
      size: colonySizeEntry.size,
      population: colonySizeEntry.population,
      missionSlots: colonySizeEntry.missionSlots,
    },
    sizeRoll,
    missionType,
    missionRoll,
    orbit,
    orbitRoll,
    factionCount,
    factionCountRoll,
    factions,
    factionsRoll,
    allegianceIndependent: allegiance.independent,
    allegianceAmerican: allegiance.american,
    allegianceRoll,
    scenarioHook,
    scenarioRoll,
  };
}

function generateOrbital() {
  const roll = d12();
  orbital.value = { feature: ORBITAL_FEATURES_CORE[roll - 1] };
}

// ─── Evolved Edition helpers ──────────────────────────────────────────────────

function getEvolvedTempMod(atmoType: string): number {
  if (atmoType === 'Thin') return -4;
  if (atmoType === 'Dense') return -1;
  if (atmoType === 'Corrosive' || atmoType === 'Infiltrating') return 6;
  return 0;
}

function getEvolvedGeoMod(atmoType: string, tempType: string): number {
  let mod = 0;
  if (['Thin', 'Dense', 'Corrosive', 'Infiltrating'].includes(atmoType)) mod -= 4;
  if (tempType === 'Hot') mod -= 2;
  if (tempType === 'Burning') mod -= 4;
  if (tempType === 'Frozen') mod -= 2;
  return mod;
}

// ─── Evolved Edition generation ───────────────────────────────────────────────

function generatePlanetEvolved() {
  // 1. Size (D12 + context modifier)
  const contextMod = planetContext.value === 'ice' ? -2 : planetContext.value === 'moon' ? -4 : 0;
  const sizeRollRaw = d12() + contextMod;
  const sizeEntry =
    PLANET_SIZES_EVOLVED.find((e) => sizeRollRaw >= e.min && sizeRollRaw <= e.max) ??
    PLANET_SIZES_EVOLVED[0];

  // Atmosphere size modifier based on diameter
  let atmoMod = 0;
  if (sizeEntry.diameterKm <= 4000) atmoMod = -2;
  else if (sizeEntry.diameterKm <= 7000) atmoMod = -4;

  // 2. Atmosphere (D12 + size modifier)
  const atmoRollRaw = d12() + atmoMod;
  const atmoEntry =
    ATMOSPHERES_EVOLVED.find((e) => atmoRollRaw >= e.min && atmoRollRaw <= e.max) ??
    ATMOSPHERES_EVOLVED[0];

  // 3. Temperature (D12 + atmosphere modifier; Ice Planet context locks to Frozen)
  let tempEntry: (typeof TEMPERATURES_EVOLVED)[number];
  let tempRollRaw: number;

  if (planetContext.value === 'ice') {
    tempEntry = TEMPERATURES_EVOLVED[0]; // Frozen
    tempRollRaw = 0;
  } else {
    const tempMod = getEvolvedTempMod(atmoEntry.type);
    tempRollRaw = d12() + tempMod;
    tempEntry =
      TEMPERATURES_EVOLVED.find((e) => tempRollRaw >= e.min && tempRollRaw <= e.max) ??
      TEMPERATURES_EVOLVED[0];
  }

  const isIcePlanet = tempEntry.temp === 'Frozen';

  // 4. Geosphere / Land-Water Ratio (D12 + modifiers)
  const geoMod = getEvolvedGeoMod(atmoEntry.type, tempEntry.temp);
  const geoRollRaw = d12() + geoMod;
  const geoEntry =
    GEOSPHERES_EVOLVED.find((e) => geoRollRaw >= e.min && geoRollRaw <= e.max) ??
    GEOSPHERES_EVOLVED[0];

  // 5. Terrain
  let terrain: string;
  let terrainRoll: number;

  if (isIcePlanet) {
    terrainRoll = d12();
    terrain = ICE_TERRAINS_EVOLVED[terrainRoll - 1] ?? 'GM Decides';
  } else {
    terrainRoll = d66();
    terrain = TERRAINS_EVOLVED.get(terrainRoll) ?? 'GM Decides';
  }

  planet.value = {
    sizeEntry: { size: sizeEntry.size, gravity: sizeEntry.gravity, examples: sizeEntry.examples },
    sizeRoll: sizeRollRaw,
    atmoEntry: { type: atmoEntry.type, modifier: 0 },
    atmoRoll: atmoRollRaw,
    tempEntry: { temp: tempEntry.temp, avg: tempEntry.avg, desc: tempEntry.desc },
    tempRoll: tempRollRaw,
    geoEntry: { type: geoEntry.type, desc: geoEntry.desc },
    geoRoll: geoRollRaw,
    terrain,
    terrainRoll,
    isIcePlanet,
    diameterKm: sizeEntry.diameterKm,
  };
}

function generateStarSystemEvolved() {
  const star = STAR_TYPES.find((e) => e.id === selectedStarTypeId.value) ?? STAR_TYPES[2];

  // Gas Giants: D6−1, additional −1 if Subgiant, −4 if White Dwarf
  let gasGiantMod = -1;
  if (star.id === 2) gasGiantMod -= 1;
  if (star.id === 4) gasGiantMod -= 4;

  // Terrestrial Planets: D6, −3 if Red Dwarf or White Dwarf
  let terrestrialMod = 0;
  if (star.id === 4 || star.id === 5) terrestrialMod = -3;

  // Ice Planets: D6+1, −1 if Giant, Subgiant, or White Main Sequence
  let iceMod = 1;
  if ([1, 2, 6].includes(star.id)) iceMod -= 1;

  // Asteroid Belts: D6−3, additional −2 if White Dwarf or Subgiant
  let asteroidMod = -3;
  if (star.id === 2 || star.id === 4) asteroidMod -= 2;

  const gasGiants = clamp(d6() + gasGiantMod, 0, 12);
  const terrestrialPlanets = clamp(d6() + terrestrialMod, 0, 12);
  const icePlanets = clamp(d6() + iceMod, 0, 12);
  const asteroidBelts = clamp(d6() + asteroidMod, 0, 12);

  starSystem.value = {
    star,
    gasGiants,
    terrestrialPlanets,
    icePlanets,
    asteroidBelts,
    gasGiantMoons: d6() + 4,
    gasGiantFeature: gasGiants > 0 ? GAS_GIANT_FEATURES[d6() - 1] : null,
    asteroidBeltFeature: asteroidBelts > 0 ? ASTEROID_BELT_FEATURES[d6() - 1] : null,
  };
}

function generateColonyEvolved() {
  if (!planet.value) return;

  const atmoType = planet.value.atmoEntry.type;
  const diameterKm = planet.value.diameterKm ?? 99999;
  const isSmallPlanet = diameterKm <= 4000;

  // Colony size (D12 + modifiers)
  let colonySizeMod = 0;
  if (atmoType === 'Breathable') colonySizeMod += 1;
  if (atmoType === 'Corrosive' || atmoType === 'Infiltrating') colonySizeMod -= 2;
  if (isSmallPlanet) colonySizeMod -= 3;

  const sizeRoll = d12() + colonySizeMod;
  const colonySizeEntry =
    COLONY_SIZE_TABLE_EVOLVED.find((e) => sizeRoll <= e.max) ??
    COLONY_SIZE_TABLE_EVOLVED[COLONY_SIZE_TABLE_EVOLVED.length - 1];

  // Colony mission (D12 + modifiers)
  let colonyMissionMod = 0;
  if (['Toxic', 'Corrosive', 'Infiltrating'].includes(atmoType)) colonyMissionMod += 1;
  if (colonySizeEntry.size === 'Start-Up') colonyMissionMod -= 1;
  if (atmoType === 'Breathable') colonyMissionMod += 1;
  if (colonySizeEntry.size === 'Established') colonyMissionMod += 4;

  const missionRoll = d12() + colonyMissionMod;
  const missionType =
    COLONY_MISSION_TABLE_EVOLVED.find((e) => missionRoll <= e.max)?.type ?? 'Government HQ';

  // Orbital (D12 + colony size modifier)
  const orbitMod =
    colonySizeEntry.size === 'Young' ? 1 : colonySizeEntry.size === 'Established' ? 2 : 0;
  const orbitRoll = d12() + orbitMod;
  const orbit = ORBITAL_COMPONENTS_EVOLVED.find((e) => orbitRoll <= e.max)?.text ?? 'Roll D6 times';

  // Factions (D3 count, D6 type)
  const factionCountRoll = d3();
  const factionCount =
    factionCountRoll === 1
      ? 'One faction'
      : factionCountRoll === 2
        ? 'Two factions'
        : 'Three factions';

  const factionsRoll = d6();
  const factions = COLONY_FACTIONS.find((e) => e.roll === factionsRoll)?.text ?? 'Workers';

  // Allegiance (3D6, min/max range lookup)
  const allegianceRoll = d6() + d6() + d6();
  const allegiance =
    COLONY_ALLEGIANCE_EVOLVED.find((e) => allegianceRoll >= e.min && allegianceRoll <= e.max) ??
    COLONY_ALLEGIANCE_EVOLVED[0];

  // Campaign hook (D66)
  const scenarioRoll = d66();
  const scenarioHook =
    CAMPAIGN_HOOKS_EVOLVED.get(scenarioRoll) ?? 'Unusual colonial tensions are escalating.';

  colony.value = {
    size: {
      size: colonySizeEntry.size,
      population: colonySizeEntry.population,
      missionSlots: colonySizeEntry.missionSlots,
    },
    sizeRoll,
    missionType,
    missionRoll,
    orbit,
    orbitRoll,
    factionCount,
    factionCountRoll,
    factions,
    factionsRoll,
    allegianceIndependent: allegiance.independent,
    allegianceAmerican: allegiance.american,
    allegianceRoll,
    scenarioHook,
    scenarioRoll,
  };
}

function generateOrbitalEvolved() {
  const roll = d12();
  const entry = ORBITAL_COMPONENTS_EVOLVED.find((e) => roll <= e.max);
  orbital.value = { feature: entry?.text ?? 'Nothing' };
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────

function handleGeneratePlanet() {
  if (edition.value === 'core') generatePlanet();
  else generatePlanetEvolved();
}

function handleGenerateStarSystem() {
  if (edition.value === 'core') generateStarSystem();
  else generateStarSystemEvolved();
}

function handleGenerateColony() {
  if (edition.value === 'core') generateColony();
  else generateColonyEvolved();
}

function handleGenerateOrbital() {
  if (edition.value === 'core') generateOrbital();
  else generateOrbitalEvolved();
}

// ─── Reset ────────────────────────────────────────────────────────────────────

function resetStarSystem() {
  starSystem.value = null;
}

function resetPlanet() {
  planet.value = null;
  colony.value = null;
  orbital.value = null;
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Star System controls -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
      <button
        type="button"
        class="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-[var(--color-brand-primary)] px-4 text-sm font-semibold text-[#0d1117] transition-opacity duration-150 hover:opacity-90 sm:shrink-0"
        @click="handleGenerateStarSystem"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          width="16"
          height="16"
        >
          <path
            d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
          />
        </svg>
        Generate Star System
      </button>
      <select
        v-model.number="selectedStarTypeId"
        class="min-w-0 rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-sm text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] sm:flex-1 [.light_&]:text-[var(--color-text-primary-light)]"
        aria-label="Select star type"
      >
        <option v-for="entry in STAR_TYPES" :key="entry.id" :value="entry.id">
          {{ entry.type }}
        </option>
      </select>
      <button
        type="button"
        class="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-[var(--color-surface-500)] px-4 text-sm font-semibold text-[var(--color-text-secondary-dark)] transition-[border-color,color] duration-150 hover:border-[var(--color-brand-primary)] hover:text-[var(--color-text-primary-dark)] sm:shrink-0 [.light_&]:text-[var(--color-text-secondary-light)] [.light_&]:hover:text-[var(--color-text-primary-light)]"
        aria-label="Reset star system"
        @click="resetStarSystem"
      >
        Reset
      </button>
    </div>

    <div v-if="starSystem" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div
        class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4 lg:col-span-3 [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
      >
        <h3
          class="m-0 mb-3 text-xs font-bold tracking-[0.08em] text-[var(--color-brand-primary)] uppercase"
        >
          Star Type
        </h3>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Type</span
          >
          <span class="font-semibold text-[var(--color-brand-primary)]">{{
            starSystem.star.type
          }}</span>
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Brightness Class</span
          >
          <span
            class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ starSystem.star.brightnessClass }}</span
          >
        </div>
        <div class="flex justify-between py-[0.3rem] text-sm">
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Description</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ starSystem.star.description }}</span
          >
        </div>
      </div>

      <div
        class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4 [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
      >
        <h3
          class="m-0 mb-3 text-xs font-bold tracking-[0.08em] text-[var(--color-brand-primary)] uppercase"
        >
          System Bodies
        </h3>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Gas Giants</span
          >
          <span
            class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ starSystem.gasGiants }}</span
          >
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Terrestrial Planets</span
          >
          <span
            class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ starSystem.terrestrialPlanets }}</span
          >
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Ice Planets</span
          >
          <span
            class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ starSystem.icePlanets }}</span
          >
        </div>
        <div class="flex justify-between py-[0.3rem] text-sm">
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Asteroid Belts</span
          >
          <span
            class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ starSystem.asteroidBelts }}</span
          >
        </div>
      </div>

      <div
        v-if="starSystem.gasGiants > 0"
        class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4 [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
      >
        <h3
          class="m-0 mb-3 text-xs font-bold tracking-[0.08em] text-[var(--color-brand-primary)] uppercase"
        >
          Gas Giant Details
        </h3>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Moons</span
          >
          <span
            class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ starSystem.gasGiantMoons }}</span
          >
        </div>
        <div class="flex justify-between py-[0.3rem] text-sm">
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Feature</span
          >
          <span class="font-semibold text-[var(--color-brand-primary)]">{{
            starSystem.gasGiantFeature
          }}</span>
        </div>
      </div>

      <div
        v-if="starSystem.asteroidBelts > 0"
        class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4 [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
      >
        <h3
          class="m-0 mb-3 text-xs font-bold tracking-[0.08em] text-[var(--color-brand-primary)] uppercase"
        >
          Asteroid Belt Details
        </h3>
        <div class="flex justify-between py-[0.3rem] text-sm">
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Feature</span
          >
          <span class="font-semibold text-[var(--color-brand-primary)]">{{
            starSystem.asteroidBeltFeature
          }}</span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[var(--color-surface-500)] p-8 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
        width="40"
        height="40"
      >
        <circle cx="12" cy="12" r="10" />
        <path
          d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        />
      </svg>
      <p>Click <strong>Generate Star System</strong> to create a random star system profile.</p>
    </div>

    <!-- Action bar -->
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          class="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[var(--color-brand-primary)] px-4 text-sm font-semibold text-[#0d1117] transition-opacity duration-150 hover:opacity-90 sm:w-auto"
          @click="handleGeneratePlanet"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            width="16"
            height="16"
          >
            <path
              d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
            />
          </svg>
          Generate Planet
        </button>

        <template v-if="planet">
          <button
            type="button"
            class="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 text-sm font-semibold text-[var(--color-text-primary-dark)] transition-[border-color,background] duration-150 hover:border-[var(--color-brand-primary)] sm:w-auto [.light_&]:text-[var(--color-text-primary-light)]"
            @click="handleGenerateOrbital"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              width="16"
              height="16"
            >
              <path
                d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
              />
            </svg>
            Roll Orbital
          </button>
          <button
            type="button"
            class="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 text-sm font-semibold text-[var(--color-text-primary-dark)] transition-[border-color,background] duration-150 hover:border-[var(--color-brand-primary)] sm:w-auto [.light_&]:text-[var(--color-text-primary-light)]"
            @click="handleGenerateColony"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              width="16"
              height="16"
            >
              <path
                d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
              />
            </svg>
            Add Colony
          </button>
          <button
            type="button"
            class="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[var(--color-surface-500)] px-4 text-sm text-[var(--color-text-secondary-dark)] transition-[border-color,color] duration-150 hover:border-[var(--color-brand-primary)] hover:text-[var(--color-text-primary-dark)] sm:w-auto [.light_&]:text-[var(--color-text-secondary-light)] [.light_&]:hover:text-[var(--color-text-primary-light)]"
            aria-label="Reset planet, colony, and orbital"
            @click="resetPlanet"
          >
            Reset
          </button>
        </template>
      </div>

      <select
        v-if="edition === 'evolved'"
        v-model="planetContext"
        class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-sm text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
        aria-label="Planet context"
      >
        <option value="terrestrial">Terrestrial</option>
        <option value="ice">Ice Planet</option>
        <option value="moon">Gas Giant Moon</option>
      </select>
    </div>

    <!-- Planet Results -->
    <div v-if="planet" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Planet Size -->
      <div
        class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4 [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
      >
        <h3
          class="m-0 mb-3 text-xs font-bold tracking-[0.08em] text-[var(--color-brand-primary)] uppercase"
        >
          Planet Size
        </h3>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ edition === 'evolved' ? 'Diameter' : 'Size' }}</span
          >
          <span class="font-semibold text-[var(--color-brand-primary)]">{{
            planet.sizeEntry.size
          }}</span>
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Surface Gravity</span
          >
          <span
            class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ planet.sizeEntry.gravity }}</span
          >
        </div>
        <div
          v-if="planet.sizeEntry.examples"
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Examples</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ planet.sizeEntry.examples }}</span
          >
        </div>
        <div
          class="mt-2 text-[0.65rem] font-bold tracking-[0.08em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          Roll: {{ planet.sizeRoll }}
        </div>
      </div>

      <!-- Atmosphere -->
      <div
        class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4 [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
      >
        <h3
          class="m-0 mb-3 text-xs font-bold tracking-[0.08em] text-[var(--color-brand-primary)] uppercase"
        >
          Atmosphere
        </h3>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Type</span
          >
          <span class="font-semibold text-[var(--color-brand-primary)]">{{
            planet.atmoEntry.type
          }}</span>
        </div>
        <div
          class="mt-2 text-[0.65rem] font-bold tracking-[0.08em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          Roll: {{ planet.atmoRoll }}
        </div>
      </div>

      <!-- Temperature -->
      <div
        class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4 [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
      >
        <h3
          class="m-0 mb-3 text-xs font-bold tracking-[0.08em] text-[var(--color-brand-primary)] uppercase"
        >
          Temperature
        </h3>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Type</span
          >
          <span class="font-semibold text-[var(--color-brand-primary)]">{{
            planet.tempEntry.temp
          }}</span>
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ edition === 'evolved' ? 'Range' : 'Average' }}</span
          >
          <span
            class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ planet.tempEntry.avg }}</span
          >
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ edition === 'evolved' ? 'Examples' : 'Description' }}</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ planet.tempEntry.desc }}</span
          >
        </div>
        <div
          class="mt-2 text-[0.65rem] font-bold tracking-[0.08em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          <template v-if="edition === 'evolved' && planetContext === 'ice'">
            Context: Ice Planet (locked)
          </template>
          <template v-else>Roll: {{ planet.tempRoll }}</template>
        </div>
      </div>

      <!-- Geosphere -->
      <div
        class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4 [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
      >
        <h3
          class="m-0 mb-3 text-xs font-bold tracking-[0.08em] text-[var(--color-brand-primary)] uppercase"
        >
          {{ edition === 'evolved' ? 'Land/Water Ratio' : 'Geosphere' }}
        </h3>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Type</span
          >
          <span class="font-semibold text-[var(--color-brand-primary)]">{{
            planet.geoEntry.type
          }}</span>
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Description</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ planet.geoEntry.desc }}</span
          >
        </div>
        <div
          class="mt-2 text-[0.65rem] font-bold tracking-[0.08em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          Roll: {{ planet.geoRoll }}
        </div>
      </div>

      <!-- Terrain -->
      <div
        class="rounded-lg border p-4 [.light_&]:bg-[var(--color-light-50)]"
        :class="
          planet.isIcePlanet
            ? 'border-[#2a4a6a] bg-[#0d1a2a]'
            : 'border-[var(--color-surface-600)] bg-[var(--color-surface-700)] [.light_&]:border-[var(--color-light-200)]'
        "
      >
        <h3
          class="m-0 mb-3 text-xs font-bold tracking-[0.08em] text-[var(--color-brand-primary)] uppercase"
        >
          {{ planet.isIcePlanet ? 'Ice Planet Terrain' : 'Terrain' }}
        </h3>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Type</span
          >
          <span class="font-semibold text-[var(--color-brand-primary)]">{{ planet.terrain }}</span>
        </div>
        <div
          class="mt-2 text-[0.65rem] font-bold tracking-[0.08em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          Roll: {{ planet.terrainRoll }}
        </div>
      </div>

      <!-- Orbital (if generated) -->
      <div
        v-if="orbital"
        class="rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4 [.light_&]:border-[var(--color-light-200)] [.light_&]:bg-[var(--color-light-50)]"
      >
        <h3
          class="m-0 mb-3 text-xs font-bold tracking-[0.08em] text-[var(--color-brand-primary)] uppercase"
        >
          Orbital Features
        </h3>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Feature</span
          >
          <span class="font-semibold text-[var(--color-brand-primary)]">{{ orbital.feature }}</span>
        </div>
      </div>
    </div>

    <!-- Colony Results -->
    <div v-if="planet && colony" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div
        class="rounded-lg border border-[var(--color-brand-primary)] bg-[var(--color-surface-700)] p-4 sm:col-span-2 lg:col-span-3 [.light_&]:bg-[var(--color-light-50)]"
      >
        <h3
          class="m-0 mb-3 text-xs font-bold tracking-[0.08em] text-[var(--color-brand-primary)] uppercase"
        >
          Colony
        </h3>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Size</span
          >
          <span class="font-semibold text-[var(--color-brand-primary)]">{{
            colony.size.size
          }}</span>
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Population</span
          >
          <span
            class="font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ colony.size.population }}</span
          >
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Mission Slots</span
          >
          <span
            class="text-xs font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ colony.size.missionSlots }}</span
          >
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Mission</span
          >
          <span class="text-xs font-semibold text-[var(--color-brand-primary)]">{{
            colony.missionType
          }}</span>
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >In Orbit</span
          >
          <span
            class="text-xs font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ colony.orbit }}</span
          >
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Faction Balance</span
          >
          <span
            class="text-xs font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ colony.factionCount }}</span
          >
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Faction Type</span
          >
          <span
            class="text-xs font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ colony.factions }}</span
          >
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Allegiance (Independent)</span
          >
          <span
            class="text-xs font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ colony.allegianceIndependent }}</span
          >
        </div>
        <div
          class="flex justify-between border-b border-[var(--color-surface-600)] py-[0.3rem] text-sm last:border-b-0 [.light_&]:border-[var(--color-light-200)]"
        >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Allegiance (American/Anglo-Japanese)</span
          >
          <span
            class="text-xs font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ colony.allegianceAmerican }}</span
          >
        </div>
        <div class="flex justify-between py-[0.3rem] text-sm">
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ edition === 'evolved' ? 'Campaign Hook' : 'Scenario Hook' }}</span
          >
          <span class="text-xs font-semibold text-[var(--color-brand-primary)]">{{
            colony.scenarioHook
          }}</span>
        </div>
        <div
          class="mt-2 text-[0.65rem] font-bold tracking-[0.08em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          Rolls: size {{ colony.sizeRoll }}, mission {{ colony.missionRoll }}, orbit
          {{ colony.orbitRoll }}, faction count {{ colony.factionCountRoll }}, factions
          {{ colony.factionsRoll }}, allegiance {{ colony.allegianceRoll }}, hook
          {{ colony.scenarioRoll }}
        </div>
      </div>
    </div>

    <div
      v-if="!planet"
      class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[var(--color-surface-500)] p-8 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
        width="40"
        height="40"
      >
        <circle cx="12" cy="12" r="10" />
        <path
          d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        />
      </svg>
      <p>Click <strong>Generate Planet</strong> to create a random star system planet.</p>
    </div>
  </div>
</template>
