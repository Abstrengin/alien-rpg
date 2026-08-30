<script setup lang="ts">
/**
 * AlienRPGContractCargo.vue
 * Cargo-run job generator for the space trucker campaign frame.
 *
 * The canonical layer follows the Job Generator / Cargo Runs tables in
 * ALIEN RPG (Core Rulebook, ch. 12) and ALIEN RPG - Evolved Edition (Campaign Play),
 * published by Free League. The optional "table dressing" layer is original TTBG content.
 */
import { ref, computed } from 'vue';
import { useEdition } from '@/shared/edition';

// ─── Dice ────────────────────────────────────────────────────────────────────

function d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}
function d3(): number {
  return Math.floor(Math.random() * 3) + 1;
}
function d66(): number {
  return d6() * 10 + d6();
}
function sumDice(count: number): number {
  let total = 0;
  for (let i = 0; i < count; i += 1) total += d6();
  return total;
}
function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

type Row = { min: number; max: number };

function lookup<T extends Row>(table: readonly T[], roll: number): T {
  return table.find((row) => roll >= row.min && roll <= row.max) ?? table[table.length - 1]!;
}
function rollOn<T extends Row>(table: readonly T[]): { roll: number; row: T } {
  const roll = d66();
  return { roll, row: lookup(table, roll) };
}
function rollD6On<T extends Row>(table: readonly T[]): { roll: number; row: T } {
  const roll = d6();
  return { roll, row: lookup(table, roll) };
}

type Edition = 'evolved' | 'core';

// ─── Employer ────────────────────────────────────────────────────────────────

const MINING_CORPS = [
  { min: 1, max: 2, name: 'Chigusa Corporation' },
  { min: 3, max: 3, name: 'Weyland-Yutani' },
  { min: 4, max: 4, name: 'Gorham Mining' },
  { min: 5, max: 5, name: 'Kelland Mining' },
  { min: 6, max: 6, name: 'Farside Mining' },
] as const;

const MAJOR_CORPS = [
  { min: 11, max: 13, name: 'Alphatech' },
  { min: 14, max: 16, name: 'Chigusa Corporation' },
  { min: 21, max: 23, name: 'Gemba' },
  { min: 24, max: 26, name: 'Jingti Long Corporation' },
  { min: 31, max: 33, name: 'Lorenz SysTech' },
  { min: 34, max: 36, name: 'Lockmart' },
  { min: 41, max: 43, name: 'Seegson' },
  { min: 44, max: 46, name: 'Lasalle Bionational' },
  { min: 51, max: 53, name: 'Gemini Exoplanet' },
  { min: 54, max: 66, name: 'Weyland-Yutani' },
] as const;

type EmployerRow = Row & { name: string; sub?: 'mining' | 'major' };

const EMPLOYERS_EVOLVED: readonly EmployerRow[] = [
  { min: 11, max: 16, name: 'Colony representative' },
  { min: 21, max: 24, name: 'Colonial Administration' },
  { min: 25, max: 36, name: 'Mining representative', sub: 'mining' },
  { min: 41, max: 43, name: 'Shipping corporation' },
  { min: 44, max: 46, name: 'USCMC colonel or other military officer' },
  { min: 51, max: 52, name: 'Wealthy individual' },
  { min: 53, max: 56, name: 'Geofund (or other group of investors)' },
  { min: 61, max: 66, name: 'Major corporation', sub: 'major' },
];

const EMPLOYERS_CORE: readonly EmployerRow[] = [
  { min: 11, max: 16, name: 'Colony representative' },
  { min: 21, max: 24, name: 'Colonial Administration' },
  { min: 25, max: 35, name: 'Mining company', sub: 'mining' },
  { min: 36, max: 46, name: 'Major corporation', sub: 'major' },
  { min: 51, max: 53, name: 'Military officer' },
  { min: 54, max: 56, name: 'Shipping corporation' },
  { min: 61, max: 63, name: 'Finance bank' },
  { min: 64, max: 66, name: 'Wealthy individual' },
];

// ─── Cargo ───────────────────────────────────────────────────────────────────

const GOODS = [
  {
    min: 11,
    max: 12,
    name: 'Industrial gases',
    desc: 'Propylene, acetylene, propane, ethyl-formate, chlorofluorocarbon, ammonia, carbon monoxide, ethylene oxide, hydrogen chloride, sulfur dioxide, sulfur hexafluoride.',
  },
  {
    min: 13,
    max: 14,
    name: 'Metal ingots or pellets',
    desc: 'Gold, platinum, palladium, silver, tungsten, copper, iron, etc.',
  },
  {
    min: 15,
    max: 16,
    name: 'Colonists',
    desc: 'Humans in stasis, ready to begin a colonization project.',
  },
  { min: 21, max: 21, name: 'Timber', desc: 'Exotic alien tree products destined for Earth.' },
  {
    min: 22,
    max: 22,
    name: 'Ice / water',
    desc: 'Water, water ice or some other rare frozen solution.',
  },
  {
    min: 23,
    max: 23,
    name: 'Industrial chemicals',
    desc: 'Aluminum chloride, aluminum sulfate, calcium acetate, monosodium phosphate, ferric sulphate, sodium hydroxide, hydrochloric acid, sodium aluminate, polyaluminum chloride, ferrous chloride, borate, potassium acetate, etc.',
  },
  {
    min: 24,
    max: 24,
    name: 'Fertilizer',
    desc: 'Multi-nutrient fertilizer compounds made up of nitrogen, potassium and/or phosphate.',
  },
  { min: 25, max: 26, name: 'Oil', desc: 'Crude oil, or liquid petroleum by-products.' },
  {
    min: 31,
    max: 32,
    name: 'Foodstuff',
    desc: 'Bulk foods such as chickpeas, soybeans and other legumes, grains (corn, barley, rice, wheat) or refined versions thereof.',
  },
  {
    min: 33,
    max: 36,
    name: 'Ore',
    desc: 'Bauxite (aluminum), galena (lead), pentlandite (nickel), gold-quartz, cassiterite (tin), malachite (copper), magnetite (iron), platinum-bearing sand, trimonite (tungsten).',
  },
  {
    min: 41,
    max: 41,
    name: 'Medicinal goods',
    desc: 'Vaccines, medicines, disinfectants, surgical gear, scanning machines, hospital beds.',
  },
  {
    min: 42,
    max: 43,
    name: 'Technical parts',
    desc: 'Different makes and types, for suits, refineries, vehicles, power stations, hospitals, prospecting gear, factories, atmospheric processors, weaponry or life support systems.',
  },
  {
    min: 44,
    max: 45,
    name: 'Starship technical parts',
    desc: 'Modules, features, parts for or from dismantled ships.',
  },
  { min: 46, max: 46, name: 'Pressure suits', desc: 'Space suits for delivery to the colonies.' },
  {
    min: 51,
    max: 51,
    name: 'Single oversized item',
    desc: 'Wind turbines, power station generator, space station hull frame, solar panel assembly, drilling machinery, ore processing mill or furnace.',
  },
  {
    min: 52,
    max: 52,
    name: 'Vehicles',
    desc: 'Diggers, tractors, quad-tracks, all-terrain vehicles, power loaders.',
  },
  {
    min: 53,
    max: 54,
    name: 'Weapons & armor',
    desc: 'Firearms, ammunition and armor for the colonies or remote stations.',
  },
  {
    min: 55,
    max: 56,
    name: 'Radioactives',
    desc: 'Processed uranium cakes or uranium dioxide powder, or fusion plant fuel pellets such as deuterium, tritium, protium or helium-3.',
  },
  {
    min: 61,
    max: 62,
    name: 'Colony construction',
    desc: 'Beams, modules, airlocks, outer shells, roofing material, etc.',
  },
  {
    min: 63,
    max: 63,
    name: 'Animal feed',
    desc: 'Feed concentrates containing grains, high-protein oil meals and byproducts of sugar beet and sugarcane processing.',
  },
  {
    min: 64,
    max: 65,
    name: 'Livestock / animals',
    desc: 'Cattle in stasis, ready for rearing on an off-world colony.',
  },
  {
    min: 66,
    max: 66,
    name: 'Wreckage / salvage',
    desc: 'Shuttle, or escape/cargo pod requiring investigation and study.',
  },
] as const;

// ─── Destination ─────────────────────────────────────────────────────────────

const STARSHIP_TYPES = [
  { min: 1, max: 1, name: 'M-Class Starfreighter' },
  { min: 2, max: 2, name: 'G-Class Deep Space Salvage Vessel' },
  { min: 3, max: 3, name: 'M-Class Commercial Towing Vehicle' },
  { min: 4, max: 4, name: 'M-Class Commercial Transport Ship' },
  { min: 5, max: 6, name: 'Other type of vessel' },
] as const;

type DestinationRow = Row & { name: string; desc: string; ship?: boolean };

const DESTINATIONS: readonly DestinationRow[] = [
  { min: 11, max: 13, name: 'Only coordinates', desc: 'Coordinates for an area in deep space.' },
  {
    min: 14,
    max: 16,
    name: 'Hostile forest / jungle / desert',
    desc: 'Landing site is planet-side wilderness, far from human habitation, or on an uninhabited world.',
  },
  { min: 21, max: 26, name: 'Mine', desc: 'A mining facility, far from a colony or starport.' },
  {
    min: 31,
    max: 33,
    name: 'Spaceport',
    desc: 'Spaceport on an asteroid or moon, or a landing field near a larger settlement.',
  },
  {
    min: 34,
    max: 36,
    name: 'Asteroid / moon',
    desc: 'The surface of an asteroid or a smaller moon. Vacuum or dangerous atmosphere.',
  },
  { min: 41, max: 43, name: 'Space station', desc: 'An orbiting space station.' },
  {
    min: 44,
    max: 46,
    name: 'Earth, Gateway Station',
    desc: 'The busy hub of all interstellar traffic and commerce.',
  },
  {
    min: 51,
    max: 53,
    name: 'Young colony',
    desc: 'A small colony with only a few hundred inhabitants.',
  },
  {
    min: 54,
    max: 56,
    name: 'Established colony',
    desc: 'A busy colony with several thousand people and a thriving, local industry.',
  },
  {
    min: 61,
    max: 63,
    name: 'Starship',
    desc: 'A starship in orbit, awaiting your arrival.',
    ship: true,
  },
  {
    min: 64,
    max: 66,
    name: 'Outpost',
    desc: 'A small outpost, usually planet side. An outpost is commonly just a single complex with a specific function: corporate, military or scientific.',
  },
];

// ─── Complications ───────────────────────────────────────────────────────────

type TextRow = Row & { name: string; desc: string; evolved?: string };

const COMPLICATIONS: readonly TextRow[] = [
  {
    min: 11,
    max: 13,
    name: 'Embargo / quarantine',
    desc: 'The destination is placed under quarantine or an embargo.',
    evolved: 'The destination is placed under ICC quarantine or an embargo.',
  },
  {
    min: 14,
    max: 16,
    name: 'Intermission',
    desc: "The ship's computer brings the ship out of hyperspace early, and then wakes the crew. What's the story?",
    evolved:
      "MU/TH/UR brings the ship out of hyperspace early, and then wakes the crew. What's the story?",
  },
  {
    min: 21,
    max: 26,
    name: 'Military',
    desc: 'A military starship sends over a small search party for a "routine" ICC and customs check. Should the PCs be worried?',
    evolved:
      'A Conestoga frigate, or other military ship, sends over a small search party for a "routine" security check. Should the PCs be worried?',
  },
  {
    min: 31,
    max: 33,
    name: 'Delay',
    desc: 'There is a delay in lift-off or undocking. Perhaps fuel for the reaction drives or coolant cannot be pumped aboard, or there may be a strike, an administrative hold-up, or loading equipment may have broken down.',
  },
  {
    min: 34,
    max: 43,
    name: 'Maintenance',
    desc: "A critical part (drive pump, plasma coil, coolant pump, water recycler, gravity compensator control unit, sensor gimbal motor, etc.) requires replacement before it fails, requiring most of the crew's participation.",
  },
  {
    min: 44,
    max: 53,
    name: 'Waiting game',
    desc: "Problems at the destination mean they aren't ready to accept the cargo. Can the crew help speed things along?",
  },
  {
    min: 54,
    max: 56,
    name: 'Cargo mishap',
    desc: 'There is a serious problem with the cargo, either moving, leaking, over-heating or catching fire.',
  },
  {
    min: 61,
    max: 66,
    name: 'Wreckage',
    desc: 'A small piece of wreckage is spotted on the sensor scope: a cargo container, escape pod, frozen corpse, part of a starship, etc.',
    evolved:
      'A small piece of wreckage is spotted on the sensor scope: a cargo container, EEV, frozen corpse, part of a starship, etc.',
  },
];

// ─── Plot twists ─────────────────────────────────────────────────────────────

const PLOT_TWISTS: readonly TextRow[] = [
  {
    min: 11,
    max: 15,
    name: 'Mayday',
    desc: 'Before (or after) the starship is in hyperspace, the crew receive a distress signal and are obliged by law to assist. Alternatively, the call may come whilst on-planet.',
  },
  {
    min: 16,
    max: 22,
    name: 'Bad intel',
    desc: 'Key mission information will prove false or very misleading.',
  },
  {
    min: 23,
    max: 25,
    name: 'Sabotage',
    desc: 'A serious malfunction or crisis (fire, etc.) quickly turns out to be sabotage, but who is the saboteur?',
    evolved:
      'MU/TH/UR malfunctions: there is a fire, or an explosive decompression. It soon turns out to be sabotage, but who is the saboteur?',
  },
  {
    min: 26,
    max: 35,
    name: 'Secret plot',
    desc: 'NPCs or PCs in the game have another agenda that runs counter to that of the players, and they are busy working on it.',
  },
  { min: 36, max: 43, name: 'Murder', desc: 'An NPC is suddenly murdered. Who did it? Why?' },
  {
    min: 44,
    max: 46,
    name: 'Flare event',
    desc: 'A burst of stellar radiation reaches the PCs location from a red dwarf flare star, a distant neutron star or other phenomenon. This could cause power interruptions, or at the very least complete communications blackouts.',
  },
  {
    min: 51,
    max: 55,
    name: 'Malfunction',
    desc: 'A key component to the mission fails when needed: an airlock or drive, a demolitions charge or diamond cutting drill. What now?',
  },
  {
    min: 56,
    max: 64,
    name: 'Time limit',
    desc: 'The mission has a deadline. Lives, perhaps their own, are depending on it.',
  },
  {
    min: 65,
    max: 66,
    name: 'Xenomorph outbreak',
    desc: 'At the heart of this scenario is the presence of the Xenomorph XX121. It may be one egg or dozens, or the massacred remains of an unfortunate group of humans with a Xenomorph warrior still on the prowl. Good luck...',
  },
];

// ─── Bonus rewards ───────────────────────────────────────────────────────────

const BONUS_REWARDS = [
  { min: 11, max: 13, name: 'Discount on new cargo' },
  { min: 14, max: 16, name: 'New, guaranteed contract' },
  { min: 21, max: 46, name: 'Additional financial bonus' },
  { min: 51, max: 53, name: 'Ship module or feature' },
  { min: 54, max: 56, name: 'Faction contact' },
  { min: 61, max: 66, name: 'Debt cancellation (or credit granted)' },
] as const;

// ─── Job type (Core Rulebook) ────────────────────────────────────────────────

type JobTypeRow = Row & {
  type: string;
  range: 'Within system' | 'Nearby system' | 'Faraway system';
  complications: number;
  flat: number;
  dice: number;
  extra: number;
};

const JOB_TYPES: readonly JobTypeRow[] = [
  { min: 11, max: 12, type: 'Routine', range: 'Within system', complications: 0, flat: 20, dice: 1, extra: 0 },
  { min: 13, max: 15, type: 'Routine', range: 'Within system', complications: 1, flat: 20, dice: 1, extra: 0 },
  { min: 16, max: 23, type: 'Routine', range: 'Within system', complications: 1, flat: 30, dice: 1, extra: 0 },
  { min: 24, max: 25, type: 'Easy', range: 'Within system', complications: 0, flat: 20, dice: 2, extra: 0 },
  { min: 26, max: 31, type: 'Easy', range: 'Nearby system', complications: 1, flat: 20, dice: 2, extra: 1 },
  { min: 32, max: 33, type: 'Easy', range: 'Nearby system', complications: 1, flat: 25, dice: 2, extra: 1 },
  { min: 34, max: 45, type: 'Normal', range: 'Nearby system', complications: 1, flat: 30, dice: 3, extra: 0 },
  { min: 46, max: 51, type: 'Normal', range: 'Nearby system', complications: 1, flat: 30, dice: 3, extra: 1 },
  { min: 52, max: 53, type: 'Normal', range: 'Nearby system', complications: 1, flat: 40, dice: 3, extra: 1 },
  { min: 54, max: 54, type: 'Normal', range: 'Faraway system', complications: 1, flat: 50, dice: 4, extra: 0 },
  { min: 55, max: 55, type: 'Normal', range: 'Faraway system', complications: 1, flat: 50, dice: 4, extra: 1 },
  { min: 56, max: 61, type: 'Difficult', range: 'Within system', complications: 2, flat: 60, dice: 4, extra: 1 },
  { min: 62, max: 63, type: 'Difficult', range: 'Nearby system', complications: 2, flat: 50, dice: 4, extra: 0 },
  { min: 64, max: 64, type: 'Difficult', range: 'Nearby system', complications: 2, flat: 50, dice: 4, extra: 1 },
  { min: 65, max: 65, type: 'Difficult', range: 'Faraway system', complications: 2, flat: 50, dice: 5, extra: 1 },
  { min: 66, max: 66, type: 'Difficult', range: 'Faraway system', complications: 3, flat: 50, dice: 5, extra: 2 },
];

// ─── Table dressing (original TTBG content) ──────────────────────────────────

const EMPLOYER_TONES = [
  'Ice-cold corporate legalese; every sentence ends with a waiver you supposedly accepted by docking.',
  'Overly chipper subcontractor who calls the crew "family" while CCing legal on every message.',
  'Colonial board voice: polite, exhausted, and quietly implying this run saves children you will never meet.',
  'Military dispatch: timestamps, grid references, no humor, assumes you already know the codewords.',
  'Union hall dispatcher: fair rates on paper, passionate footnotes about solidarity and overtime.',
  'Black-market middleman: compliments your ship, never signs their name, routes payment through three hops.',
  'Insurance-adjacent logistics firm: obsessed with seals, manifests, and photos of every latch.',
  'Scientific consortium: cargo is "routine samples" with seventeen pages of handling footnotes.',
  'Freelance broker who sounds like they are smoking on the line and definitely is not insured.',
  'Automated charter system with a glitchy voice pack that mispronounces your hull designation.',
  'Regional freight cooperative: transparent pricing, slow replies, and a casserole recipe in the footer.',
  'Colonial security subcontract: half the brief is redacted; the other half contradicts the first half.',
  'Mining consortium desk: gravel in their tone, bonuses tied to "discretionary performance metrics."',
  'Medical logistics shell company: sterile wording, aggressive NDA, and a calm reminder about biosecurity.',
  'Old spacer outfit: slang and star fixes, handshake energy, still slips a liability clause in slot three.',
] as const;

const HANDLING_NOTES = [
  'Moisture readings must stay inside a narrow band or the whole lot is voided on arrival.',
  'Temperature logs upload hourly to an audit bot; a single gap triggers a manual inspection.',
  'Chain-of-custody biometrics. No mid-route opens without a notarized remote authorization.',
  'Vibration-sensitive. Insured only if mounted on factory-original gel feet.',
  'Oxygen draw spikes are expected. Crew are told not to ask about the hum.',
  'Manifest lists the containers as empty. They rattle. Negative mass is called a rounding error.',
  'Triple-walled drums; paperwork lists three mutually exclusive hazard classifications.',
  'Light-sensitive. Humidity alarms are tied to a payout clawback nobody pointed out.',
  'End user is listed as "TBD colony, provisional government."',
  'One crate marked "spares" is welded shut from the inside.',
  'Granular and static-prone. Grounding straps required in every hold.',
  'One-time access codes; delivery only to a rotating drop coordinate.',
  'Shock sensors armed. Insurance is void if you use a gravity assist.',
  'Shielding checks at every jump, no exceptions, logged by the receiving port.',
  'Customs flag on the paperwork only clears at one specific port.',
] as const;

const DEADLINE_PRESSURES = [
  'Hard window: arrive within 36 hours of the stated ETA or the berth is forfeited to a competitor.',
  'Soft promise that becomes hard the moment a rival ship enters the same lane on public trackers.',
  'Festival docking blackout; if you miss the slot, you wait two weeks in a holding pattern at fuel cost.',
  'Contract says "best effort" but the bonus ladder evaporates after the first missed checkpoint.',
  'Cargo begins off-gassing after day nine; after day twelve the insurer walks away entirely.',
  'Parent company earnings call in seventy-two hours; PR needs the delivery photo before then.',
  'Colonial charter vote ends at midnight station time; your manifest is the tie-breaker exhibit.',
  'Union strike vote triggers if freight is late; you are not union, but you will pay the congestion.',
  'Solar flare window closes; comms blackout after that means no proof of delivery, no pay.',
  'Wedding of two minor heirs aboard the receiving station; late freight means public embarrassment fees.',
  'Lease on your temporary import license ticks down hourly after first planetfall ping.',
  'Perishable hype: cargo is tied to a product launch; delays become social-media liability for the carrier.',
  'Black-market buyer only meets during a comet shadow event that lasts six hours once a month.',
  'Dock workers walk at end of shift; if you are not unloaded by then, you pay double stevedoring.',
  'Jump corridor maintenance starts in four days; detours add nine parsecs you were not budgeted for.',
] as const;

const FINE_PRINT = [
  'Clause 14b: any unscheduled hull scan authorizes the employer to renegotiate hazard pay downward.',
  'If customs opens a seal, you cover fines unless you can prove sabotage by a named third party.',
  'Routing changes within five parsecs are "incidental"; fuel is on you unless the change exceeds twelve.',
  'Cargo value is assessed at destination by an appraiser on the employer payroll.',
  'Sleep shift logs must match MU/TH/UR timestamps or the entire run is classified as "non-compliant transit."',
  'Secondary receiver may refuse delivery for "ambient morale concerns" with no further definition.',
  'You warrant that no crew member has pending litigation in any jurisdiction the employer operates.',
  'Insurance rider voids if the ship AI converses with port traffic control more than forty lines per hour.',
  'Late fees compound hourly after grace, but early arrival earns only a thank-you note, not a rebate.',
  'Employer may substitute an equivalent receiver without notice if "market conditions warrant."',
  'Biometric crew roster must be filed before departure; last-minute hires forfeit bonus tiers.',
  'Any distress call not logged on the employer channel counts as a breach of exclusive comms.',
  'Cargo photos required at every jump; missing a photo resets the on-time clock.',
  'If the manifest weight drifts by more than two percent, you absorb disposal costs at bulk rates.',
  'Quiet clause: you may not discuss the route, the cargo class, or the smell in public channels.',
  'Dock damage attributed to your thrust wash is deducted from pay even if the berth was mis-marked.',
  'Employer may withhold ten percent in escrow until a thirty-day "integrity review" clears.',
  'You agree to random hold inspections by partners you have never heard of and never will again.',
  'Fuel surcharge calculations use a proprietary index updated only after you have locked the bid.',
  'Return leg is optional in the PDF you signed; the summary email said otherwise.',
] as const;

const PAYMENT_CATCHES = [
  'Half on loading, half on signed receipt. The receipt requires a signature nobody is authorized to give.',
  'Hazard line items are listed as "aspirational" and are settled at the employer\'s discretion.',
  'Headline rate is respectable; one missed window erases the performance kicker entirely.',
  'A third is tied to a discretionary "corporate citizenship" score assessed after delivery.',
  'Paid in pre-inflation colonial scrip, redeemable at face value only on the issuing world.',
  'Long clawback list attached. Net lands well under the headline unless the run is clean.',
  'Union scale if you are credentialed. Otherwise it is contractor rates and a company hat.',
  'Cash now is small; the rest is "success shares" that vest if the colony hits population targets.',
  'Hazard multiplier applies only if filed before docking, which is after the scary part is over.',
  'Generous daily rate underway, zero lay days covered, and demurrage at the far end eats the margin.',
  'No receipts, no insurance, and a friendly warning about asking questions.',
  'Science grant funding: slow reimbursement, picky receipts, entirely legitimate if you love paperwork.',
  'Military chit: good for parts and priority refuel, weak on actual credits in civilian ports.',
] as const;

// ─── State ───────────────────────────────────────────────────────────────────

type Employer = { roll: number; name: string; detail: string | null };
type Cargo = { roll: number; name: string; desc: string };
type Destination = { roll: number; name: string; desc: string; ship: string | null };
type Complication = { roll: number; name: string; desc: string };
type Twist = { roll: number; name: string; desc: string };
type Reward = { roll: number; name: string };
type Flavor = {
  tone: string;
  handling: string;
  deadline: string;
  finePrint: string;
  paymentCatch: string;
};

type Job = {
  edition: Edition;
  jobTypeRoll: number | null;
  difficultyLabel: string;
  complicationCount: number;
  parsecs: number;
  distanceLabel: string;
  payment: number;
  paymentBasis: string;
  employer: Employer;
  cargo: Cargo;
  destination: Destination;
  complications: Complication[];
  twist: Twist | null;
  rewards: Reward[];
  flavor: Flavor | null;
};

// Edition is chosen once in the sidebar and shared by every tool in the suite.
const edition = useEdition();
const crewSize = ref(4);
const bonusRewardCount = ref(0);
const includeTwist = ref(true);
const includeFlavor = ref(true);
const job = ref<Job | null>(null);
const copied = ref(false);

const isEvolved = computed(() => edition.value === 'evolved');

// Payment ladder for the MANIPULATION negotiation: +20% of base per extra success.
const negotiationLadder = computed(() => {
  if (!job.value) return [];
  const base = job.value.payment;
  return [1, 2, 3].map((successes) => ({
    successes,
    amount: Math.round(base * (1 + 0.2 * successes)),
  }));
});

// ─── Rolling ─────────────────────────────────────────────────────────────────

function rollEmployer(ed: Edition): Employer {
  const table = ed === 'evolved' ? EMPLOYERS_EVOLVED : EMPLOYERS_CORE;
  const { roll, row } = rollOn(table);
  let detail: string | null = null;
  if (row.sub === 'mining') {
    const sub = rollD6On(MINING_CORPS);
    detail = `${sub.row.name} (D6 ${sub.roll})`;
  } else if (row.sub === 'major') {
    const sub = rollOn(MAJOR_CORPS);
    detail = `${sub.row.name} (D66 ${sub.roll})`;
  }
  return { roll, name: row.name, detail };
}

function rollCargo(): Cargo {
  const { roll, row } = rollOn(GOODS);
  return { roll, name: row.name, desc: row.desc };
}

function rollDestination(ed: Edition): Destination {
  const { roll, row } = rollOn(DESTINATIONS);
  let ship: string | null = null;
  if (row.ship && ed === 'evolved') {
    const sub = rollD6On(STARSHIP_TYPES);
    ship = `${sub.row.name} (D6 ${sub.roll})`;
  }
  const name = ed === 'core' && row.name === 'Earth, Gateway Station' ? 'Earth' : row.name;
  return { roll, name, desc: row.desc, ship };
}

function describe(row: TextRow, ed: Edition): string {
  return ed === 'evolved' && row.evolved ? row.evolved : row.desc;
}

function rollComplications(count: number, ed: Edition): Complication[] {
  const results: Complication[] = [];
  let guard = 0;
  while (results.length < count && guard < 40) {
    guard += 1;
    const { roll, row } = rollOn(COMPLICATIONS);
    // Two identical complications add nothing at the table, so reroll duplicates.
    if (results.some((existing) => existing.name === row.name)) continue;
    results.push({ roll, name: row.name, desc: describe(row, ed) });
  }
  return results;
}

function rollTwist(ed: Edition): Twist {
  const { roll, row } = rollOn(PLOT_TWISTS);
  return { roll, name: row.name, desc: describe(row, ed) };
}

function rollRewards(count: number): Reward[] {
  return Array.from({ length: count }, () => {
    const { roll, row } = rollOn(BONUS_REWARDS);
    const name =
      edition.value === 'core' && row.name === 'Additional financial bonus'
        ? 'Monetary reward'
        : row.name;
    return { roll, name };
  });
}

function rollFlavor(): Flavor {
  return {
    tone: pick(EMPLOYER_TONES),
    handling: pick(HANDLING_NOTES),
    deadline: pick(DEADLINE_PRESSURES),
    finePrint: pick(FINE_PRINT),
    paymentCatch: pick(PAYMENT_CATCHES),
  };
}

function parsecsForRange(range: JobTypeRow['range']): number {
  if (range === 'Within system') return 0;
  if (range === 'Nearby system') return d6() <= 3 ? 1 : 2;
  return d3() + 2;
}

function generate(): void {
  const ed = edition.value;
  const crew = Math.max(1, Math.min(8, Math.round(crewSize.value || 1)));
  const extra = Math.max(0, Math.min(3, Math.round(bonusRewardCount.value || 0)));

  let jobTypeRoll: number | null = null;
  let difficultyLabel: string;
  let complicationCount: number;
  let parsecs: number;
  let distanceLabel: string;
  let payment: number;
  let paymentBasis: string;
  let rewardRolls = extra;

  if (ed === 'evolved') {
    parsecs = d6() - 1;
    const difficulty = d3();
    difficultyLabel = ['Routine', 'Standard', 'Difficult'][difficulty - 1]!;
    complicationCount = difficulty;
    distanceLabel =
      parsecs === 0 ? 'Same star system' : `${parsecs} parsec${parsecs === 1 ? '' : 's'} away`;
    payment = (parsecs + difficulty) * crew * 1000;
    paymentBasis = `(${parsecs} distance + ${difficulty} difficulty) × ${crew} PC${crew === 1 ? '' : 's'} × $1,000`;
  } else {
    const rolled = rollOn(JOB_TYPES);
    jobTypeRoll = rolled.roll;
    const row = rolled.row;
    difficultyLabel = row.type;
    complicationCount = row.complications;
    parsecs = parsecsForRange(row.range);
    distanceLabel =
      row.range === 'Within system'
        ? 'Within system'
        : `${row.range} · ${parsecs} parsec${parsecs === 1 ? '' : 's'}`;
    const dice = sumDice(row.dice);
    payment = (row.flat + dice) * 1000;
    paymentBasis = `${row.flat}+${row.dice}D6 thousand (rolled ${dice})`;
    rewardRolls += row.extra;
  }

  job.value = {
    edition: ed,
    jobTypeRoll,
    difficultyLabel,
    complicationCount,
    parsecs,
    distanceLabel,
    payment,
    paymentBasis,
    employer: rollEmployer(ed),
    cargo: rollCargo(),
    destination: rollDestination(ed),
    complications: rollComplications(complicationCount, ed),
    twist: includeTwist.value ? rollTwist(ed) : null,
    rewards: rollRewards(rewardRolls),
    flavor: includeFlavor.value ? rollFlavor() : null,
  };
}

// Individual rerolls let a GM keep a brief they like and replace only the part that does not fit.
function rerollEmployer(): void {
  if (job.value) job.value.employer = rollEmployer(job.value.edition);
}
function rerollCargo(): void {
  if (job.value) job.value.cargo = rollCargo();
}
function rerollDestination(): void {
  if (job.value) job.value.destination = rollDestination(job.value.edition);
}
function rerollComplications(): void {
  if (job.value)
    job.value.complications = rollComplications(job.value.complicationCount, job.value.edition);
}
function rerollTwist(): void {
  if (job.value) job.value.twist = rollTwist(job.value.edition);
}
function rerollFlavor(): void {
  if (job.value) job.value.flavor = rollFlavor();
}

function clearOutput(): void {
  job.value = null;
}

// ─── Export ──────────────────────────────────────────────────────────────────

const briefText = computed(() => {
  const j = job.value;
  if (!j) return '';
  const lines: string[] = [];
  lines.push('CARGO RUN - JOB BRIEF');
  lines.push(
    `${j.difficultyLabel} job · ${j.distanceLabel} · ${j.complicationCount} complication${j.complicationCount === 1 ? '' : 's'}`
  );
  if (j.jobTypeRoll) lines.push(`Job type: D66 ${j.jobTypeRoll}`);
  lines.push(`Base payment: $${j.payment.toLocaleString('en-US')} (${j.paymentBasis})`);
  lines.push('');
  lines.push(
    `EMPLOYER (D66 ${j.employer.roll}): ${j.employer.name}${j.employer.detail ? ` - ${j.employer.detail}` : ''}`
  );
  lines.push(`CARGO (D66 ${j.cargo.roll}): ${j.cargo.name}`);
  lines.push(`  ${j.cargo.desc}`);
  lines.push(
    `DESTINATION (D66 ${j.destination.roll}): ${j.destination.name}${j.destination.ship ? ` - ${j.destination.ship}` : ''}`
  );
  lines.push(`  ${j.destination.desc}`);
  if (j.complications.length) {
    lines.push('');
    lines.push('COMPLICATIONS');
    j.complications.forEach((c) => {
      lines.push(`- (D66 ${c.roll}) ${c.name}: ${c.desc}`);
    });
  }
  if (j.twist) {
    lines.push('');
    lines.push(`PLOT TWIST (D66 ${j.twist.roll}): ${j.twist.name}`);
    lines.push(`  ${j.twist.desc}`);
  }
  if (j.rewards.length) {
    lines.push('');
    lines.push('BONUS REWARDS');
    j.rewards.forEach((r) => lines.push(`- (D66 ${r.roll}) ${r.name}`));
  }
  if (j.flavor) {
    lines.push('');
    lines.push('TABLE DRESSING');
    lines.push(`- Employer tone: ${j.flavor.tone}`);
    lines.push(`- Handling note: ${j.flavor.handling}`);
    lines.push(`- Deadline pressure: ${j.flavor.deadline}`);
    lines.push(`- Fine print: ${j.flavor.finePrint}`);
    lines.push(`- Payment catch: ${j.flavor.paymentCatch}`);
  }
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
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-if="isEvolved" class="flex flex-col gap-[0.375rem]">
          <label
            for="cc-crew"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Crew size (PCs)</label
          >
          <input
            id="cc-crew"
            v-model.number="crewSize"
            type="number"
            min="1"
            max="8"
            step="1"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          />
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Base pay is multiplied by the number of PCs</span
          >
        </div>

        <div class="flex flex-col gap-[0.375rem]">
          <label
            for="cc-bonus"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Bonus reward rolls</label
          >
          <input
            id="cc-bonus"
            v-model.number="bonusRewardCount"
            type="number"
            min="0"
            max="3"
            step="1"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          />
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >One per success the crew spends instead of haggling for cash</span
          >
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90"
          @click="generate"
        >
          Generate job
        </button>
        <label
          class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <input
            v-model="includeTwist"
            type="checkbox"
            class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          Plot twist
        </label>
        <label
          class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <input
            v-model="includeFlavor"
            type="checkbox"
            class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          Table dressing
        </label>
        <button
          v-if="job"
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="copyBrief"
        >
          {{ copied ? 'Copied' : 'Copy brief' }}
        </button>
        <button
          v-if="job"
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="clearOutput"
        >
          Clear
        </button>
      </div>
    </div>

    <div v-if="job" class="flex flex-col gap-4" aria-live="polite">
      <!-- Job header -->
      <div
        class="flex flex-col gap-3 rounded-lg border border-[var(--color-brand-primary)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            class="text-lg font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ job.difficultyLabel }} cargo run</span
          >
          <span
            v-if="job.jobTypeRoll"
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >D66 {{ job.jobTypeRoll }}</span
          >
        </div>
        <dl class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="flex flex-col gap-1">
            <dt
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              Distance
            </dt>
            <dd
              class="m-0 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ job.distanceLabel }}
            </dd>
          </div>
          <div class="flex flex-col gap-1">
            <dt
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              Complications
            </dt>
            <dd
              class="m-0 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ job.complicationCount }}
            </dd>
          </div>
          <div class="flex flex-col gap-1">
            <dt
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              Base payment
            </dt>
            <dd
              class="m-0 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              ${{ job.payment.toLocaleString('en-US') }}
              <span
                class="block text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                >{{ job.paymentBasis }}</span
              >
            </dd>
          </div>
        </dl>
        <p
          class="m-0 border-t border-[var(--color-surface-600)] pt-3 text-xs leading-[1.6] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          <strong>Negotiation:</strong> a successful MANIPULATION roll raises the offer by 20% per
          extra success, or the crew can spend successes on bonus rewards instead.
          <span v-for="(step, i) in negotiationLadder" :key="step.successes">
            <template v-if="i > 0"> · </template>+{{ step.successes }} success<template
              v-if="step.successes > 1"
              >es</template
            >: ${{ step.amount.toLocaleString('en-US') }}</span
          >
        </p>
      </div>

      <!-- Canonical results -->
      <div
        class="grid [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))] grid-cols-1 gap-4"
      >
        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <div class="flex items-start justify-between gap-2">
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Employer · D66 {{ job.employer.roll }}</span
            >
            <button
              type="button"
              class="cursor-pointer rounded border border-[var(--color-surface-500)] px-2 py-[0.125rem] text-xs text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              aria-label="Reroll employer"
              @click="rerollEmployer"
            >
              Reroll
            </button>
          </div>
          <p
            class="m-0 text-sm leading-[1.55] font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ job.employer.name }}
          </p>
          <p
            v-if="job.employer.detail"
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{ job.employer.detail }}
          </p>
        </div>

        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <div class="flex items-start justify-between gap-2">
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Cargo · D66 {{ job.cargo.roll }}</span
            >
            <button
              type="button"
              class="cursor-pointer rounded border border-[var(--color-surface-500)] px-2 py-[0.125rem] text-xs text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              aria-label="Reroll cargo"
              @click="rerollCargo"
            >
              Reroll
            </button>
          </div>
          <p
            class="m-0 text-sm leading-[1.55] font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ job.cargo.name }}
          </p>
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{ job.cargo.desc }}
          </p>
        </div>

        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <div class="flex items-start justify-between gap-2">
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Destination · D66 {{ job.destination.roll }}</span
            >
            <button
              type="button"
              class="cursor-pointer rounded border border-[var(--color-surface-500)] px-2 py-[0.125rem] text-xs text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              aria-label="Reroll destination"
              @click="rerollDestination"
            >
              Reroll
            </button>
          </div>
          <p
            class="m-0 text-sm leading-[1.55] font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ job.destination.name }}
          </p>
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{ job.destination.desc }}
          </p>
          <p
            v-if="job.destination.ship"
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            Vessel: {{ job.destination.ship }}
          </p>
        </div>

        <div
          v-if="job.twist"
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <div class="flex items-start justify-between gap-2">
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Plot twist · D66 {{ job.twist.roll }}</span
            >
            <button
              type="button"
              class="cursor-pointer rounded border border-[var(--color-surface-500)] px-2 py-[0.125rem] text-xs text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              aria-label="Reroll plot twist"
              @click="rerollTwist"
            >
              Reroll
            </button>
          </div>
          <p
            class="m-0 text-sm leading-[1.55] font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ job.twist.name }}
          </p>
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{ job.twist.desc }}
          </p>
        </div>
      </div>

      <!-- Complications -->
      <div
        v-if="job.complications.length"
        class="flex flex-col gap-3 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex items-start justify-between gap-2">
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Complications</span
          >
          <button
            type="button"
            class="cursor-pointer rounded border border-[var(--color-surface-500)] px-2 py-[0.125rem] text-xs text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
            aria-label="Reroll complications"
            @click="rerollComplications"
          >
            Reroll
          </button>
        </div>
        <div v-for="item in job.complications" :key="item.name" class="flex flex-col gap-1">
          <p
            class="m-0 text-sm leading-[1.55] font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ item.name }}
            <span
              class="font-normal text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >· D66 {{ item.roll }}</span
            >
          </p>
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{ item.desc }}
          </p>
        </div>
      </div>

      <!-- Bonus rewards -->
      <div
        v-if="job.rewards.length"
        class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Bonus rewards</span
        >
        <ul class="m-0 flex list-none flex-col gap-1 p-0">
          <li
            v-for="(reward, i) in job.rewards"
            :key="`${reward.roll}-${i}`"
            class="text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ reward.name }}
            <span
              class="text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >· D66 {{ reward.roll }}</span
            >
          </li>
        </ul>
      </div>

      <!-- Table dressing -->
      <div
        v-if="job.flavor"
        class="flex flex-col gap-3 rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex items-start justify-between gap-2">
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Table dressing</span
          >
          <button
            type="button"
            class="cursor-pointer rounded border border-[var(--color-surface-500)] px-2 py-[0.125rem] text-xs text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
            aria-label="Reroll table dressing"
            @click="rerollFlavor"
          >
            Reroll
          </button>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="flex flex-col gap-1">
            <span
              class="text-xs font-semibold text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >Employer tone</span
            >
            <p
              class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ job.flavor.tone }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <span
              class="text-xs font-semibold text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >Handling note</span
            >
            <p
              class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ job.flavor.handling }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <span
              class="text-xs font-semibold text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >Deadline pressure</span
            >
            <p
              class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ job.flavor.deadline }}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <span
              class="text-xs font-semibold text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >Fine print</span
            >
            <p
              class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ job.flavor.finePrint }}
            </p>
          </div>
          <div class="flex flex-col gap-1 sm:col-span-2">
            <span
              class="text-xs font-semibold text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >Payment catch</span
            >
            <p
              class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ job.flavor.paymentCatch }}
            </p>
          </div>
        </div>
      </div>

      <p
        class="m-0 text-xs leading-[1.6] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
      >
        Flesh out the destination with the
        <a
          href="/tabletop-rpg/alien-rpg/alien-rpg-star-system-generator/"
          class="font-semibold text-[var(--color-brand-primary)] no-underline hover:underline"
          >Star System Generator</a
        >, then feed <strong>{{ job.parsecs }}</strong> parsec{{ job.parsecs === 1 ? '' : 's' }} into
        the
        <a
          href="/tabletop-rpg/alien-rpg/alien-rpg-space-travel-tool/"
          class="font-semibold text-[var(--color-brand-primary)] no-underline hover:underline"
          >Space Travel Tool</a
        >
        for transit time and pay periods.
      </p>
    </div>

    <div
      v-else
      class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-6 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <p class="m-0">
        Roll a complete space trucker job: employer, cargo manifest, destination, distance,
        difficulty, base payment, complications and an optional plot twist. Follows the Job
        Generator and Cargo Runs tables from the Core Rulebook and the Evolved Edition.
      </p>
    </div>
  </div>
</template>
