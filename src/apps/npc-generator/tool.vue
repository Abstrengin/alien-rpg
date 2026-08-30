<script setup lang="ts">
/**
 * AlienRPGNPCGenerator.vue
 * NPC generator for the ALIEN RPG.
 *
 * The canonical layer follows the rulebooks: the Creating NPCs guidance
 * (name, appearance, trait, goal; 14 attribute points, max 5; skill 2 = competent,
 * 3-5 = expert), the nine career tables, the typical-NPC rosters, and the
 * colony / industrial area encounter tables. Published by Free League.
 * The optional "table dressing" layer is original TTBG content.
 */
import { ref, computed } from 'vue';
import { useEdition } from '@/shared/edition';

// ─── Dice ────────────────────────────────────────────────────────────────────

function d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}
function sumDice(count: number): number {
  let total = 0;
  for (let i = 0; i < count; i += 1) total += d6();
  return total;
}
function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}
/** Two distinct entries, the way the career tables say to roll appearance and gear. */
function pickTwo<T>(items: readonly T[]): T[] {
  if (items.length <= 1) return [...items];
  const first = Math.floor(Math.random() * items.length);
  let second = Math.floor(Math.random() * (items.length - 1));
  if (second >= first) second += 1;
  return [items[first]!, items[second]!];
}

type Row = { min: number; max: number };
function lookup<T extends Row>(table: readonly T[], roll: number): T {
  return table.find((row) => roll >= row.min && roll <= row.max) ?? table[table.length - 1]!;
}

type Edition = 'evolved' | 'core';
type AttributeName = 'Strength' | 'Agility' | 'Wits' | 'Empathy';

// ─── Skills ──────────────────────────────────────────────────────────────────

const SKILLS_BY_ATTRIBUTE: Record<AttributeName, readonly string[]> = {
  Strength: ['Heavy Machinery', 'Stamina', 'Close Combat'],
  Agility: ['Mobility', 'Piloting', 'Ranged Combat'],
  Wits: ['Comtech', 'Observation', 'Survival'],
  Empathy: ['Command', 'Manipulation', 'Medical Aid'],
};

const ALL_SKILLS = Object.values(SKILLS_BY_ATTRIBUTE).flat();

// ─── Careers ─────────────────────────────────────────────────────────────────

type CareerEdition = {
  keySkills: readonly [string, string, string];
  talents: readonly string[];
  appearance: readonly string[];
  signature: readonly string[];
  gear: readonly string[];
  cashDice: number;
  cashMultiplier: number;
};

type Career = {
  id: string;
  name: string;
  keyAttribute: AttributeName;
  names: readonly string[];
  agendas: readonly string[];
  evolved: CareerEdition;
  core: CareerEdition;
};

const CAREERS: readonly Career[] = [
  {
    id: 'colonial-marine',
    name: 'Colonial Marine',
    keyAttribute: 'Strength',
    names: [
      'Marcus Mullaney',
      'Kimi Diem',
      'Nik Elson',
      'Tara Zanelli',
      'Vic Pasengrau',
      'Chrissy Lopez',
    ],
    agendas: [
      'You are a decorated hero. You need to defend your reputation, at all costs.',
      'You once helped cover up a war crime. No one must ever know.',
      'The death of your buddy has spooked you. Now you secretly fear combat and confrontation, and you need to overcome that fear.',
    ],
    evolved: {
      keySkills: ['Close Combat', 'Stamina', 'Ranged Combat'],
      talents: ['Banter', 'Overkill', 'Precise Shooter'],
      appearance: [
        'Crew cut',
        'Arm tattoo',
        'Scar',
        'Cold eyes',
        'Cocky grin',
        'Personalized body armor',
      ],
      signature: ['Bullet that you survived', "Lost friend's dog tags", 'Trophy from a defeated enemy'],
      gear: [
        'M41A Pulse Rifle',
        'M56A2 Smart Gun',
        'M314 Motion Tracker',
        'Two G2 Electroshock Grenades',
        'IRC MK.35 Pressure Suit',
        'M3 Personnel Armor',
      ],
      cashDice: 1,
      cashMultiplier: 100,
    },
    core: {
      keySkills: ['Close Combat', 'Stamina', 'Ranged Combat'],
      talents: ['Banter', 'Overkill', 'Past the Limit'],
      appearance: [
        'Crew cut',
        'Arm tattoo',
        'Scar',
        'Cold eyes',
        'Cocky grin',
        'Personalized body armor',
      ],
      signature: ['Bullet that you survived', "Lost friend's dog tags", 'Trophy from a defeated enemy'],
      gear: [
        'M41A Pulse Rifle',
        'M56A2 Smart Gun',
        'M314 Motion Tracker',
        'Two G2 Electroshock Grenades',
        'IRC MK.35 Pressure Suit',
        'M3 Personnel Armor',
        'Signal flare',
        'Deck of cards',
      ],
      cashDice: 1,
      cashMultiplier: 100,
    },
  },
  {
    id: 'colonial-marshal',
    name: 'Colonial Marshal',
    keyAttribute: 'Wits',
    names: [
      'Jack Kitani',
      'Akira Kano',
      'Barrell Klein',
      'Angela Harris',
      'Ivan Mankov',
      'Lee-Ann Jenkins',
    ],
    agendas: [
      'Your longtime partner betrayed you and defected to a crime syndicate. Get even.',
      'You dream of turning in the badge and settling down in peace. Work towards it.',
      'You did a bad thing in the past and it has come back to haunt you. You need to decide what you are made of.',
    ],
    evolved: {
      keySkills: ['Observation', 'Ranged Combat', 'Command'],
      talents: ['Authority', 'Investigator', 'Subdue'],
      appearance: [
        'Cigarette in mouth',
        'Impressive mustache',
        'Haggard and unshaven',
        'Graying hair',
        'Inquisitive gaze',
        'Old leather jacket',
      ],
      signature: ['Photo of a loved one', 'Dented flask with an inscription', 'Worn cap'],
      gear: [
        '.357 Magnum Revolver',
        'Armat Model 37A2 12-Gauge Pump-Action',
        'Hi-beam flashlight',
        'Personal medkit',
        'Stun baton',
        'D6 doses Neversleep pills',
      ],
      cashDice: 1,
      cashMultiplier: 200,
    },
    core: {
      keySkills: ['Observation', 'Ranged Combat', 'Manipulation'],
      talents: ['Authority', 'Investigator', 'Subdue'],
      appearance: [
        'Chewing a toothpick',
        'Cigarette in mouth',
        'Impressive mustache',
        'Worn cap',
        'Scar across face',
        'Graying hair',
        'Crew cut',
        'Inquisitive gaze',
        'Old leather jacket',
      ],
      signature: [
        'Photo of a loved one',
        'Dented flask with an inscription on the front',
        'News clipping of an unsolved case',
      ],
      gear: [
        '.357 Magnum Revolver',
        'Armat Model 37A2 12 gauge pump-action',
        'Binoculars',
        'Hi-beam flashlight',
        'Personal medkit',
        'Stun baton',
        'D6 doses Neversleep pills',
        'Hand radio',
      ],
      cashDice: 1,
      cashMultiplier: 100,
    },
  },
  {
    id: 'company-agent',
    name: 'Company Agent',
    keyAttribute: 'Wits',
    names: [
      'Conrad Schmidt',
      'Michiko Nogumi',
      'Alexander Balconi',
      'Sheridan Lamara',
      'Ryan Middlebrook',
      'Mercedes Prince',
    ],
    agendas: [
      'You are greedy for power and never miss an opportunity to get ahead.',
      'The Company is holding back information from you. What? And why?',
      'You are a nice guy, but the Company is blackmailing you to do its dirty work. Get even.',
    ],
    evolved: {
      keySkills: ['Comtech', 'Observation', 'Manipulation'],
      talents: ['Company Resources', 'Cunning', 'Personal Safety'],
      appearance: [
        'Icy glare',
        'Disarming smile',
        'Soft hands',
        'Expensive suit',
        'Elaborate hairstyle',
        'Monogrammed silk tie',
      ],
      signature: ['Personalized business card', 'Rolex watch', 'Gold-plated pen'],
      gear: [
        'Leather briefcase',
        'Comm unit',
        'Samani E-Series Watch',
        'Data transmitter card with corporate clearance level',
        'VP-70MA6 Service Pistol',
        'D6 doses Naproleve',
      ],
      cashDice: 1,
      cashMultiplier: 1000,
    },
    core: {
      keySkills: ['Comtech', 'Observation', 'Manipulation'],
      talents: ['Cunning', 'Personal Safety', 'Take Control'],
      appearance: [
        'Icy glare',
        'Disarming smile',
        'Expensive Rolex',
        'Unique signet ring',
        'Tanned',
        'Elaborate hairstyle',
        'Emotionless stare',
        'Monogrammed silk tie',
      ],
      signature: [
        'Letter of corporate authorization',
        'Divorce papers',
        'Employee of the Year award',
      ],
      gear: [
        'Leather briefcase',
        'Chrome briefcase',
        'Gold-plated pen',
        'Rolex watch',
        'Data transmitter card with corporate clearance level',
        'M4A3 Service Pistol',
        'D6 doses Neversleep',
        'D6 doses Naproleve',
      ],
      cashDice: 2,
      cashMultiplier: 100,
    },
  },
  {
    id: 'kid',
    name: 'Kid',
    keyAttribute: 'Agility',
    names: ['Chip Harrington', 'Meggie Wu', 'Hugo Turner', 'Maisie Kelly', 'Jakey Myers', 'Becca David'],
    agendas: [
      'You want to find an adult you can trust. Really trust.',
      'You have no family left. Make sure you never end up alone again.',
      'No one gives you anything to do, so explore, try things out, make your own entertainment.',
    ],
    evolved: {
      keySkills: ['Mobility', 'Survival', 'Observation'],
      talents: ['Hard to Catch', 'Lucky', 'Nimble'],
      appearance: [
        'Grubby and unkempt',
        'Trendy sneakers that light up',
        'T-shirt with band logo',
        'Ponytail',
        'Bored expression',
        'Baseball cap',
      ],
      signature: [
        'Lunchbox covered in stickers',
        'Favorite doll or action figure',
        'Bracelet made by older sibling',
      ],
      gear: [
        'Laser pointer',
        'Radio-controlled car',
        'Yo-yo',
        'Electronic handheld game',
        'Personal locator beacon',
        'Coloring pens',
      ],
      cashDice: 1,
      cashMultiplier: 10,
    },
    core: {
      keySkills: ['Mobility', 'Survival', 'Observation'],
      talents: ['Beneath Notice', 'Dodge', 'Nimble'],
      appearance: [
        'Grubby and unkempt',
        'Trendy sneakers that light up',
        'Denim jeans, torn at the knees',
        'T-shirt with band logo',
        'Cargo shorts',
        'Ponytail',
        'Bored expression',
        'Baseball cap',
      ],
      signature: [
        'Lunchbox covered in stickers',
        'Favorite doll or action figure',
        'Bracelet made by older sibling',
      ],
      gear: [
        'Fishing line',
        'Laser pointer',
        'Magnet',
        'Radio-controlled car',
        'Yo-yo',
        'Electronic handheld game',
        'Personal locator beacon',
        'Coloring pens',
      ],
      cashDice: 1,
      cashMultiplier: 1,
    },
  },
  {
    id: 'medic',
    name: 'Medic',
    keyAttribute: 'Empathy',
    names: [
      'Cho Hadfield',
      'Ana Kasnavik',
      'Ken Ibana',
      'Juno Blanchard',
      'Sullivan Ward',
      'Katie Aberly',
    ],
    agendas: [
      'You are addicted to a strong painkiller. Protect your stash, and your secret.',
      'You have some unusual (but classified) medical reports that the Company is looking for. Find out why they are so important.',
      "You've sworn an oath never to take a life, and you mean it.",
    ],
    evolved: {
      keySkills: ['Mobility', 'Observation', 'Medical Aid'],
      talents: ['Field Medic', 'Nurse', 'Surgeon'],
      appearance: [
        'Sympathetic smile',
        'Dark bags under eyes',
        'Calm and gentle voice',
        'Cold, unsympathetic stare',
        'Spectacles',
        'White coat (clean or stained)',
      ],
      signature: [
        'Framed medical certificate',
        'Letter from son or daughter',
        'Last psych evaluation: "All clear at last"',
      ],
      gear: [
        'Surgical kit',
        'IRC MK.50 Compression Suit',
        'D6 doses Naproleve',
        'D6 doses Neversleep',
        'Personal medkit',
        'Samani E-Series Watch',
      ],
      cashDice: 1,
      cashMultiplier: 200,
    },
    core: {
      keySkills: ['Mobility', 'Observation', 'Medical Aid'],
      talents: ['Calming Presence', 'Compassion', 'Field Surgeon'],
      appearance: [
        'Sympathetic smile',
        'Short, tidy hair',
        'Warm, caring eyes',
        'Dark bags under eyes',
        'Fidgeting hands',
        'Calm and gentle voice',
        'Cold, unsympathetic stare',
        'Spectacles',
        'White coat',
      ],
      signature: [
        'Framed medical certificate',
        'Letter from son or daughter',
        'Last psych evaluation: "All clear at last."',
      ],
      gear: [
        'Surgical kit',
        'IRC MK.50 compression suit',
        'D6 doses Naproleve',
        'D6 doses Neversleep',
        'Personal medkit',
        'D6 doses experimental X-Drugs',
        'Samani E-Series watch',
        'Hand radio',
      ],
      cashDice: 1,
      cashMultiplier: 100,
    },
  },
  {
    id: 'officer',
    name: 'Officer',
    keyAttribute: 'Empathy',
    names: [
      'Eugene Proctor',
      'Wendy Stern',
      'Oliver Bryant',
      'Julia Kwang',
      'Lloyd T. Darrington',
      'Camille Kirschner',
    ],
    agendas: [
      'You come from an officer family. You need to gain a promotion or an award, soon.',
      'You messed up in the past. Avoid taking the blame for any more mission screw-ups.',
      "Mistakes are deadly, so don't let anyone under your watch screw up. Make sure they understand why.",
    ],
    evolved: {
      keySkills: ['Ranged Combat', 'Command', 'Manipulation'],
      talents: ['Field Commander', 'Frontline Leader', 'Pull Rank'],
      appearance: [
        'Hair in a crew cut, or tied back',
        'Serious, intense expression',
        'Spotless uniform',
        'Stiff body posture',
        'Relaxed and soothing voice',
        'Impatiently taps a foot',
      ],
      signature: [
        "Ship's cat",
        'Letter of recommendation',
        'ICC Commercial Flight Officer license',
      ],
      gear: [
        'M4A3 Service Pistol',
        'Rexim RXF-M5 EVA Pistol',
        'Samani E-Series Watch',
        'M314 Motion Tracker',
        'IRC MK.50 Compression Suit',
        'Seegson P-DAT',
      ],
      cashDice: 1,
      cashMultiplier: 300,
    },
    core: {
      keySkills: ['Ranged Combat', 'Command', 'Manipulation'],
      talents: ['Field Commander', 'Influence', 'Pull Rank'],
      appearance: [
        'Hair in a crew cut, or tied back',
        'Serious, intense expression',
        'Spotless uniform',
        'Overworked and strung-out',
        'Stiff body posture',
        'Relaxed and soothing voice',
        'Jumpsuit with mission patch',
        'Impatiently taps a foot',
      ],
      signature: [
        "Ship's cat",
        'Letter of recommendation',
        'ICC Commercial Flight Officer license',
      ],
      gear: [
        'M4A3 Service Pistol',
        'Rexim RXF-M5 EVA Pistol',
        'Samani E-Series watch',
        'Binoculars',
        'M314 motion tracker',
        'IRC MK.50 compression suit',
        'Seegson P-DAT',
        'IFF transponder',
      ],
      cashDice: 2,
      cashMultiplier: 100,
    },
  },
  {
    id: 'pilot',
    name: 'Pilot',
    keyAttribute: 'Agility',
    names: [
      'Casper Edmonton',
      "Fiona O'Neill",
      'Sven Stackman',
      'Constance Navona',
      'Kiel Avari',
      'Igraine Turner',
    ],
    agendas: [
      "It's about pushing the limit. Taking a chance. Taking risks, so take a risk.",
      "You're stubborn and don't like to back down, even if your friends might get hurt.",
      "You're a loner, always happier when you can do a task without relying on others.",
    ],
    evolved: {
      keySkills: ['Piloting', 'Ranged Combat', 'Comtech'],
      talents: ['Full Throttle', 'Like the Back of Your Hand', 'Reckless'],
      appearance: [
        'Arrogant walk',
        'Steely blue eyes',
        'Multi-pocket flight suit',
        'Mirrored sunglasses',
        'Deadpan expression',
        'Chews gum',
      ],
      signature: ['Dashboard dancer', "Pilot's logbook", 'Pilot shades'],
      gear: [
        'M4A3 Service Pistol',
        'PR-PUT Uplink Terminal',
        'Hand radio',
        'Maintenance jack',
        'Seegson System Diagnostic Device',
        'IRC MK.50 Compression Suit',
      ],
      cashDice: 1,
      cashMultiplier: 200,
    },
    core: {
      keySkills: ['Mobility', 'Ranged Combat', 'Comtech'],
      talents: ['Full Throttle', 'Like the Back of Your Hand', 'Reckless'],
      appearance: [
        'Arrogant walk',
        'Steely blue eyes',
        'Multi-pocket flight suit',
        'Sunglasses',
        'Previous mission patches',
        'Deadpan expression',
        'Chews gum',
        'Skeptical look',
      ],
      signature: ['Dashboard dancer', "Pilot's logbook", 'Pilot shades'],
      gear: [
        'M4A3 service pistol',
        'PR-PUT uplink terminal',
        'Hand radio',
        'D6 flares',
        'Maintenance jack',
        'Seegson P-DAT',
        'Seegson system diagnostic device',
        'IRC MK.50 compression suit',
      ],
      cashDice: 1,
      cashMultiplier: 100,
    },
  },
  {
    id: 'roughneck',
    name: 'Roughneck',
    keyAttribute: 'Strength',
    names: [
      'Mac Masterton',
      'Sassy Diaz',
      'Kip Tranter',
      'Kat Longridge',
      'Charlie Stead',
      'Jayden Pace',
    ],
    agendas: [
      "You are a compulsive thrill-seeker. If there is a risk to take, you'll step up and try it.",
      "You once sacrificed your family for the job. Now you won't let your friends down, ever.",
      "Downtime matters. If you can grab a can of Aspen beer (or even Souta Dry, though only if you're desperate) and some time alone, you're happy.",
    ],
    evolved: {
      keySkills: ['Heavy Machinery', 'Stamina', 'Close Combat'],
      talents: ['Resilient', 'Steady Hands', 'True Grit'],
      appearance: [
        'Tattoos',
        'Loud laugh',
        'Bruised and calloused hands',
        'Eyes hidden behind safety goggles',
        'Filthy boots that clomp loudly when you walk',
        'Wild hair',
      ],
      signature: ['Tool belt', 'Photo of partner', 'Crucifix or other religious symbol'],
      gear: [
        'Cutting torch',
        'Watsumi DV-303 Bolt Gun',
        'D6 doses Hydr8tion',
        'Maintenance jack',
        'IRC MK.50 Compression Suit',
        'Hi-beam flashlight',
      ],
      cashDice: 1,
      cashMultiplier: 100,
    },
    core: {
      keySkills: ['Heavy Machinery', 'Stamina', 'Close Combat'],
      talents: ['Resilient', 'The Long Haul', 'True Grit'],
      appearance: [
        'Tattoos',
        'Scar',
        'Broken nose',
        'Mirthless eyes',
        'Smirking face',
        'Loud laugh',
        'Bruised and calloused hands',
        'Eyes hidden behind safety goggles',
        'Filthy boots that clomp loudly when you walk',
        'Wild hair',
      ],
      signature: ['Tool belt', 'Photo of partner', 'Crucifix or other religious symbol'],
      gear: [
        'Cutting torch',
        'Watsumi DV-303 bolt gun',
        'D6 doses Hydr8tion',
        'Maintenance jack',
        'Stash of hard liquor',
        'IRC MK.50 compression suit',
        'Hi-beam flashlight',
        'Seegson C-Series magnetic tape recorder',
      ],
      cashDice: 1,
      cashMultiplier: 100,
    },
  },
  {
    id: 'scientist',
    name: 'Scientist',
    keyAttribute: 'Wits',
    names: [
      'Viggo Kowalski',
      'Elena Sanchez',
      'Drew Lancaster',
      'Louise Mallory',
      'Travis Torrence',
      'Karima Yusef',
    ],
    agendas: [
      'Your last project was stolen from you. Now you keep many of your findings secret.',
      'You hate authority and go out of your way to be uncooperative if possible.',
      'You find it hard to delegate to others, even if it means taking on extra work.',
    ],
    evolved: {
      keySkills: ['Observation', 'Survival', 'Comtech'],
      talents: ['Analysis', 'Inquisitive', 'Xenomorphology'],
      appearance: [
        'Unkempt, untidy appearance',
        'Stained lab coat',
        'Nervous manner',
        'Thoughtful gaze',
        'Clears throat before speaking',
        'Bleary, overworked eyes',
      ],
      signature: ['Albert Einstein Award', 'Unfinished scientific paper', 'Blackmail letters'],
      gear: [
        'Digital video camera',
        'Seegson P-DAT',
        'Seegson System Diagnostic Device',
        'Personal Data Transmitter',
        'M314 Motion Tracker',
        'Personal medkit',
      ],
      cashDice: 1,
      cashMultiplier: 300,
    },
    core: {
      keySkills: ['Observation', 'Survival', 'Comtech'],
      talents: ['Analysis', 'Breakthrough', 'Inquisitive'],
      appearance: [
        'Unkempt, untidy appearance',
        'Stained lab coat',
        'Nervous manner',
        'Hands constantly shoved in pockets',
        'Tidy, well-trimmed hair',
        'Thoughtful gaze',
        'Clears throat before speaking',
        'Bleary, overworked eyes',
      ],
      signature: ['Albert Einstein Award', 'Unfinished scientific paper', 'Blackmail letters'],
      gear: [
        'Digital video camera',
        'Hand radio',
        'Seegson P-DAT',
        'Neuro visor',
        'Seegson System Diagnostic Device',
        'Personal Data Transmitter',
        'M314 motion tracker',
        'Personal medkit',
      ],
      cashDice: 1,
      cashMultiplier: 100,
    },
  },
];

const ALL_CANONICAL_NAMES = CAREERS.flatMap((career) => career.names);

// ─── Typical NPC rosters ─────────────────────────────────────────────────────

type Archetype = {
  name: string;
  strength: number;
  agility: number;
  wits: number;
  empathy: number;
  health: number;
  skills: string;
  talent: string | null;
  gear: string | null;
};

const ROSTER_EVOLVED: readonly Archetype[] = [
  { name: 'Android, covert', strength: 7, agility: 6, wits: 3, empathy: 1, health: 7, skills: 'Close Combat 3, Heavy Machinery 2, Ranged Combat 2, Comtech 2, Survival 1', talent: 'Cunning', gear: null },
  { name: 'Android, curious', strength: 4, agility: 3, wits: 7, empathy: 3, health: 4, skills: 'Stamina 2, Mobility 2, Comtech 3, Observation 3', talent: null, gear: null },
  { name: 'Android, refurbished', strength: 6, agility: 6, wits: 3, empathy: 2, health: 6, skills: 'Heavy Machinery 2, Piloting 4, Comtech 2, Observation 2', talent: 'Spaceship Mechanic', gear: null },
  { name: 'Asteroid miner', strength: 4, agility: 4, wits: 3, empathy: 3, health: 4, skills: 'Heavy Machinery 3, Stamina 2, Piloting 1, Observation 3, Survival 1', talent: 'EVA Specialist', gear: 'Survival suit, cutting torch, bolt gun' },
  { name: 'Colonial Marshal', strength: 4, agility: 4, wits: 4, empathy: 2, health: 4, skills: 'Close Combat 2, Mobility 1, Ranged Combat 3, Observation 2, Manipulation 1, Medical Aid 1', talent: 'Investigator', gear: 'Pump-action shotgun, handcuffs, flashlight' },
  { name: 'Colonist child', strength: 1, agility: 5, wits: 4, empathy: 4, health: 3, skills: 'Mobility 4, Observation 3, Survival 2, Manipulation 1', talent: 'Hard to Catch', gear: 'Toy or doll' },
  { name: 'Colony manager', strength: 2, agility: 4, wits: 3, empathy: 5, health: 3, skills: 'Heavy Machinery 1, Stamina 2, Comtech 1, Survival 1, Command 3, Manipulation 2', talent: null, gear: 'Penlight, motion tracker, Seegson P-DAT' },
  { name: 'Company bureaucrat', strength: 2, agility: 3, wits: 4, empathy: 5, health: 3, skills: 'Observation 3, Comtech 3, Manipulation 2, Medical Aid 2', talent: 'Personal Safety', gear: 'PDT, Seegson P-DAT' },
  { name: 'Comtech', strength: 2, agility: 3, wits: 5, empathy: 4, health: 3, skills: 'Piloting 2, Comtech 4, Observation 2', talent: 'Stoic', gear: 'Systems diagnostic device, electronic tools' },
  { name: 'Corporate executive', strength: 2, agility: 3, wits: 5, empathy: 4, health: 3, skills: 'Observation 3, Command 3, Manipulation 4', talent: 'Cunning', gear: 'Penlight, PDT, voice recorder, $2,000' },
  { name: 'Corporate killer', strength: 4, agility: 5, wits: 4, empathy: 1, health: 5, skills: 'Close Combat 3, Mobility 1, Ranged Combat 4, Observation 2', talent: 'Stealthy', gear: 'M42A Scope Rifle, combat knife, medkit' },
  { name: 'Cultist', strength: 4, agility: 3, wits: 2, empathy: 5, health: 4, skills: 'Close Combat 3, Ranged Combat 2, Observation 2, Manipulation 3', talent: null, gear: 'Knife, recreational drugs, .357 revolver' },
  { name: 'Homesteader', strength: 5, agility: 3, wits: 3, empathy: 3, health: 4, skills: 'Heavy Machinery 4, Stamina 2, Piloting 1, Comtech 2, Medical Aid 1', talent: null, gear: 'Armat Model 37A2 12 gauge pump-action shotgun, flashlight' },
  { name: 'ICC Inspector', strength: 3, agility: 3, wits: 5, empathy: 3, health: 3, skills: 'Comtech 2, Observation 4, Command 2, Manipulation 2', talent: 'Investigator', gear: 'Seegson P-DAT, voice recorder' },
  { name: 'Medical doctor', strength: 2, agility: 3, wits: 5, empathy: 4, health: 3, skills: 'Stamina 3, Mobility 2, Observation 3, Manipulation 3, Medical Aid 4', talent: 'Surgeon', gear: 'Medkit, surgical kit, four doses of Naproleve' },
  { name: 'Mercenary / soldier', strength: 5, agility: 4, wits: 3, empathy: 2, health: 5, skills: 'Close Combat 2, Stamina 2, Mobility 2, Ranged Combat 3, Survival 1', talent: 'Combat Veteran', gear: 'Medkit, M41A Pulse Rifle, four grenades' },
  { name: 'Mining wildcatter', strength: 5, agility: 3, wits: 3, empathy: 3, health: 5, skills: 'Close Combat 1, Heavy Machinery 3, Stamina 2, Comtech 1, Survival 3', talent: 'Hardened', gear: 'Seismic survey charge, Seegson P-DAT' },
  { name: 'Pilot', strength: 3, agility: 5, wits: 3, empathy: 3, health: 4, skills: 'Piloting 3, Ranged Combat 3, Comtech 2, Observation 1, Survival 1', talent: 'Full Throttle', gear: 'Service pistol, compression suit' },
  { name: 'Rogue scientist', strength: 3, agility: 4, wits: 5, empathy: 2, health: 4, skills: 'Mobility 1, Comtech 3, Observation 4, Survival 2', talent: 'Analysis', gear: 'Electrostatic pistol, system diagnostic device, electronic tools' },
  { name: 'Salvage expert', strength: 5, agility: 4, wits: 2, empathy: 5, health: 5, skills: 'Heavy Machinery 3, Stamina 2, Mobility 3, Survival 2', talent: 'Spaceship Mechanic', gear: 'Cutting torch, maintenance jack' },
  { name: 'Security guard', strength: 4, agility: 4, wits: 3, empathy: 3, health: 4, skills: 'Close Combat 2, Ranged Combat 2, Observation 3, Medical Aid 1', talent: null, gear: '.357 revolver, stun baton, medkit' },
  { name: "Ship's engineer", strength: 4, agility: 2, wits: 5, empathy: 3, health: 3, skills: 'Close Combat 1, Heavy Machinery 4, Stamina 3, Comtech 1, Observation 1', talent: 'Spaceship Mechanic', gear: 'Bolt gun, system diagnostic device' },
  { name: 'Smuggler', strength: 3, agility: 4, wits: 4, empathy: 3, health: 4, skills: 'Close Combat 3, Mobility 2, Piloting 1, Ranged Combat 2, Manipulation 2', talent: 'Stealthy', gear: 'Rexim EVA Pistol' },
  { name: 'Squad leader', strength: 5, agility: 3, wits: 3, empathy: 3, health: 4, skills: 'Close Combat 2, Stamina 2, Ranged Combat 3, Survival 1, Command 2', talent: 'Field Commander', gear: 'Medkit, M41A Pulse Rifle, Seegson P-DAT' },
  { name: 'Thug', strength: 4, agility: 5, wits: 3, empathy: 2, health: 5, skills: 'Close Combat 2, Stamina 2, Mobility 2, Ranged Combat 2, Survival 2', talent: null, gear: 'Knife' },
];

const ROSTER_CORE: readonly Archetype[] = [
  { name: 'Android, covert', strength: 8, agility: 8, wits: 3, empathy: 1, health: 8, skills: 'Close Combat 3, Ranged Combat 2, Survival 1, Comtech 2, Heavy Machinery 2', talent: 'Take Control', gear: null },
  { name: 'Android, curious', strength: 4, agility: 4, wits: 8, empathy: 4, health: 4, skills: 'Observation 3, Mobility 2, Comtech 3, Stamina 2', talent: 'Watchful', gear: null },
  { name: 'Android, refurbished', strength: 7, agility: 7, wits: 3, empathy: 3, health: 7, skills: 'Heavy Machinery 2, Comtech 2, Observation 2, Piloting 4', talent: 'Spaceship Mechanic', gear: null },
  { name: 'Colonial Marshal', strength: 4, agility: 4, wits: 4, empathy: 2, health: 4, skills: 'Mobility 1, Observation 2, Medical Aid 1, Close Combat 2, Manipulation 1, Ranged Combat 3', talent: 'Fast Reflexes', gear: 'Folding knife, Armat 12 gauge pump-action shotgun, M4A3 pistol, handcuffs, flashlight' },
  { name: 'Colony ops manager', strength: 2, agility: 4, wits: 3, empathy: 5, health: 2, skills: 'Stamina 2, Comtech 1, Command 3, Manipulation 2, Survival 1, Heavy Machinery 1', talent: 'Counselor', gear: null },
  { name: 'Corporate exec', strength: 2, agility: 3, wits: 5, empathy: 4, health: 2, skills: 'Command 3, Manipulation 4, Observation 3', talent: 'Take Control', gear: 'Penlight, Swiss army knife, bribe money ($2,000), personal data transmitter, voice recorder' },
  { name: 'Corporate killer', strength: 4, agility: 5, wits: 4, empathy: 1, health: 4, skills: 'Close Combat 3, Ranged Combat 4, Observation 2, Mobility 1', talent: 'Merciless', gear: 'M42A Scope Rifle, hunting knife, portable medkit, flashlight, garotte, gag, 10 tie-wraps, binoculars' },
  { name: 'Cultist', strength: 4, agility: 3, wits: 2, empathy: 5, health: 4, skills: 'Close Combat 3, Manipulation 3, Observation 2, Ranged Combat 2', talent: 'Hothead', gear: 'Two hunting knives, twelve doses of recreational drugs, .357 Magnum Revolver' },
  { name: 'ICC Inspector', strength: 3, agility: 3, wits: 5, empathy: 3, health: 3, skills: 'Observation 4, Comtech 2, Command 2, Manipulation 2', talent: 'Watchful', gear: "Seegson P-DAT, flashlight, digital camera, voice recorder, pens, clipboard, 'Do Not Cross' hazard tape, Seegson system diagnostic device" },
  { name: 'Medical doctor', strength: 2, agility: 3, wits: 4, empathy: 5, health: 2, skills: 'Observation 3, Medical Aid 4, Manipulation 3', talent: 'Field Surgeon', gear: 'Personal medkit, surgical kit, flashlight, four shots of Naproleve, hypodermic needles in case' },
  { name: 'Mercenary / soldier', strength: 5, agility: 4, wits: 3, empathy: 2, health: 5, skills: 'Close Combat 2, Stamina 2, Ranged Combat 3, Mobility 2, Survival 1', talent: 'Killer', gear: 'M4A3 pistol, personal medkit, flashlight, M4A1 Pulse Rifle, 4 grenades, combat knife' },
  { name: 'Mining wildcatter', strength: 5, agility: 3, wits: 3, empathy: 3, health: 5, skills: 'Stamina 2, Close Combat 1, Survival 3, Heavy Machinery 3, Comtech 1', talent: 'Merciless', gear: 'Geology testing kit, ropes and climbing equipment, flashlight, multi-tool, digital camera, sample container' },
  { name: 'Rogue scientist', strength: 3, agility: 4, wits: 5, empathy: 2, health: 3, skills: 'Observation 4, Survival 2, Comtech 3, Mobility 1', talent: 'Analysis', gear: 'Bio-testing kit, survival knife, pocket survival kit, digital camera, electronic repair kit, voice recorder, sample case' },
  { name: 'Salvage expert', strength: 5, agility: 4, wits: 3, empathy: 2, health: 5, skills: 'Heavy Machinery 3, Mobility 3, Stamina 2, Survival 2', talent: 'Spaceship Mechanic', gear: 'Rugged flashlight, multi-tool, mechanical cutting tool, maintenance jack' },
  { name: 'Pilot', strength: 3, agility: 5, wits: 3, empathy: 3, health: 3, skills: 'Piloting 3, Ranged Combat 3, Comtech 2, Observation 1, Survival 1', talent: 'Full Throttle', gear: 'M4A3 pistol, binoculars, flashlight, pilot logbook, nav charts' },
];

// ─── Encounter tables ────────────────────────────────────────────────────────

type EncounterRow = Row & { text: string };

const COLONY_ENCOUNTERS: readonly EncounterRow[] = [
  { min: 11, max: 11, text: 'Rowdy miners' },
  { min: 12, max: 12, text: 'Technicians making repairs' },
  { min: 13, max: 13, text: 'Exhausted workers arriving' },
  { min: 14, max: 14, text: 'Workers preparing to leave' },
  { min: 15, max: 15, text: 'Supplies being delivered' },
  { min: 16, max: 16, text: 'Colony workers off-duty' },
  { min: 21, max: 21, text: 'Family off-duty together' },
  { min: 22, max: 22, text: 'Medical crisis' },
  { min: 23, max: 23, text: 'Colony manager and deputy' },
  { min: 24, max: 24, text: 'Loud argument' },
  { min: 25, max: 25, text: 'Drunken revelers' },
  { min: 26, max: 26, text: 'Kids playing' },
  { min: 31, max: 31, text: 'Administrator making the rounds' },
  { min: 32, max: 32, text: 'Colonial Marshal conducting an investigation' },
  { min: 33, max: 33, text: 'Cocky shuttle pilot' },
  { min: 34, max: 34, text: 'Unhappy off-world official' },
  { min: 35, max: 35, text: 'Sly corporate representative' },
  { min: 36, max: 36, text: 'Harassed chief engineer' },
  { min: 41, max: 41, text: 'Scientists debating' },
  { min: 42, max: 42, text: 'Drug deal in progress' },
  { min: 43, max: 43, text: 'Overhear gossip' },
  { min: 44, max: 44, text: 'Colonist threatening another' },
  { min: 45, max: 45, text: 'Corporate investigator' },
  { min: 46, max: 46, text: 'Miners relaxing' },
  { min: 51, max: 51, text: 'Colony damage needing repair' },
  { min: 52, max: 52, text: 'Operations team having a discussion' },
  { min: 53, max: 53, text: 'Computer engineers at work' },
  { min: 54, max: 54, text: 'Unattended supplies' },
  { min: 55, max: 55, text: 'Maintenance crew' },
  { min: 56, max: 56, text: 'Marshal searching or arresting a suspect' },
  { min: 61, max: 61, text: 'Visitors from another colony' },
  { min: 62, max: 62, text: 'Security cordon' },
  { min: 63, max: 63, text: 'Mysterious scientist' },
  { min: 64, max: 64, text: 'Management meeting' },
  { min: 65, max: 65, text: 'Helpful android' },
  { min: 66, max: 66, text: 'Cleaning crew' },
  { min: 71, max: 71, text: 'Starship crew off-duty' },
  { min: 72, max: 72, text: 'Thugs' },
  { min: 73, max: 73, text: 'Security patrol' },
  { min: 74, max: 74, text: 'Colonial official with entourage' },
  { min: 75, max: 75, text: 'Accident in progress' },
  { min: 76, max: 76, text: 'Colonists on strike or protesting' },
];

const INDUSTRIAL_ENCOUNTERS: readonly EncounterRow[] = [
  { min: 11, max: 13, text: 'Auditor checking procedures' },
  { min: 14, max: 16, text: 'Huge argument between two managers' },
  { min: 21, max: 23, text: 'Android carrying out routine work' },
  { min: 24, max: 26, text: 'Workers rushing to a shift' },
  { min: 31, max: 33, text: 'Power loader coming through!' },
  { min: 34, max: 36, text: 'Repair team fixing crucial infrastructure' },
  { min: 41, max: 43, text: 'Manager touring with their assistant' },
  { min: 44, max: 46, text: 'Workers responding to an emergency' },
  { min: 51, max: 53, text: 'Incident. First aid is being carried out.' },
  { min: 54, max: 56, text: 'Workers waiting to go on shift' },
  { min: 61, max: 63, text: 'Security guard checking passes and IDs' },
  { min: 64, max: 66, text: 'Lone worker waiting for their manager' },
];

// ─── Table dressing (original TTBG content) ──────────────────────────────────

const TRAITS = [
  'Gives the impression of being helpful right up until you need something specific.',
  'Casually mentions impossible-sounding past assignments without making them sound like stories.',
  'Goes quiet in groups but cannot stop talking one-on-one.',
  'Asks questions that are too precise to be idle curiosity.',
  'Laughs at everything, including things that are not funny and things that are very bad.',
  'Never starts a disagreement but finishes every one they get pulled into.',
  'Will volunteer for the worst job on the list before anyone else can pass it to them.',
  'Radically practical. Emotional responses are something they schedule for after the problem is solved.',
  'Checks equipment twice, people once, and their own back never.',
  'The kind of calm that reads as either extremely competent or completely broken, and you cannot tell yet.',
  'Gets visibly uncomfortable when plans change and never says why.',
  'Trusts the person who speaks least in any given room.',
  "Gives detailed unsolicited opinions on food, sleep schedules, and other people's hydration.",
  "Takes notes on a physical pad and refuses to explain why they don't use a data slate.",
  'Makes decisions fast and then pretends to have thought them through.',
  'Holds eye contact just long enough to become a thing.',
  "Mentions the same event from their past in unrelated conversations and doesn't realize they're doing it.",
  "Completely unreadable when they're lying and completely obvious when they're telling the truth.",
] as const;

const GOALS = [
  'Paying off a debt that followed them from a colony that no longer exists.',
  'Looking for a sibling who went silent three work cycles ago. Last ping was this sector.',
  'Chasing a promotion that has been promised and revoked twice already.',
  'Genuinely believes the company is doing good work out here, and is not yet wrong.',
  'Scared to stop moving. Staying in one place means time to think.',
  'Wants enough credits to buy passage home and disappear into civilian life.',
  'Protecting someone else on the crew without that person knowing it.',
  'Collecting evidence of something, and not yet willing to say what.',
  "Fulfilling a dead crewmate's contract so the family still gets paid.",
  'Bored. This assignment beat sitting in a transit hub for another six months.',
  'Trying to prove something to people who are not watching anymore.',
  'Owes a favor to someone whose name they will not say out loud.',
  'Chasing a scientific lead that the company officially closed and buried.',
  'On a work-release arrangement. The alternative was worse.',
  'The last crew went silent. This person volunteered to find out why.',
  'Making enough to put one more cryo-payment down on land back on Earth.',
  'Following orders that contradict the briefing they were given three weeks ago.',
  'Believes this run will be the one that finally changes things. It always does.',
] as const;

const PRESENCE = [
  'Compact and efficient. Moves like they are always rationing energy.',
  'Taller than most doorframes were built for, with a permanent stoop from years of ducking.',
  'Sun-bleached from a posting closer to the star than they wanted.',
  'Hands that look older than the rest of them, work-worn and permanently callused.',
  'The kind of face that stays neutral so long you forget to read it.',
  "Keeps their kit so clean it stands out against everyone else's.",
  'Has answered the question about the scar so many times they have a short version.',
  'Always has a drink or a container of something in hand, and never seems to actually finish it.',
  'Moves quietly for someone their size. People notice when they stop noticing.',
  "Regulation everything. You cannot tell if it's discipline or hiding.",
  'Reading glasses perched on their head even when not reading anything.',
  "Looks like they have not slept since the last port. Probably hasn't.",
  'Thick-framed and broad-shouldered, built for a gravity they left behind.',
  'Company-issue clothes three sizes too large. Inherited them and never exchanged them.',
  'Every surface of their gear is labeled in handwriting too small to read standing up.',
  'They blink less than most people. Not dramatically, just enough to notice after a few minutes.',
  'Young enough to look wrong in this context but too competent to say so.',
  'Has a habit of standing slightly too close when they want your attention.',
] as const;

const HIDDEN_AGENDAS = [
  'Reporting to a company contact the rest of the crew has not been told about.',
  'Here to locate something specific, and it is not the official cargo.',
  'Has been told one of the crew is a liability. Has not been told what to do about it yet.',
  'Looking for an exit from the company that does not involve going through legal channels.',
  "Carrying a sealed order that only opens after a specific event. They don't know the trigger.",
  'The person they claimed to be died eighteen months ago. This identity is borrowed.',
  'Passed intelligence to an outside party before departure. Waiting to see if it catches up with them.',
  'Their contract has a clause they did not read. It was highlighted for someone else.',
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
  'Treats the PCs with professional respect, and is warm to exactly no one.',
  "Asks about the crew's individual skill sets in ways that feel like intake forms.",
  'Owes a favor to one PC specifically. Has not said which one or what for.',
  'Competed for a position one of the PCs currently holds. Lost. Shows up anyway.',
  'Is new to this kind of work and is watching the crew more than they should be.',
  'Has a habit of backing the crew in arguments with command without being asked to.',
  'Seems to know the ship better than the briefing should have allowed.',
  'Friendly to the crew as a whole, careful never to be alone with any one of them.',
  'Was on a previous run with a crew that did not make it back. Rarely comes up.',
] as const;

// ─── State ───────────────────────────────────────────────────────────────────

type Build = 'career' | 'archetype';
type Competence = 'green' | 'professional' | 'veteran' | 'expert';
type HookSource = 'none' | 'colony' | 'industrial';

const COMPETENCE_LABEL: Record<Competence, string> = {
  green: 'Green',
  professional: 'Professional',
  veteran: 'Veteran',
  expert: 'Expert',
};

// Skill levels follow the book's guidance: 2 is a fairly competent NPC, 3-5 an expert.
const COMPETENCE_LEVELS: Record<Competence, readonly [number, number, number]> = {
  green: [2, 1, 1],
  professional: [2, 2, 1],
  veteran: [3, 2, 2],
  expert: [4, 3, 3],
};

type Attributes = { Strength: number; Agility: number; Wits: number; Empathy: number };
type SkillEntry = { name: string; level: number };

type NPC = {
  build: Build;
  edition: Edition;
  name: string;
  role: string;
  attributes: Attributes;
  health: number;
  skills: SkillEntry[];
  talent: string | null;
  gear: string[];
  cash: number | null;
  cashBasis: string | null;
  keyAttribute: AttributeName | null;
  keySkills: readonly string[] | null;
  appearance: string[];
  trait: string;
  goal: string;
  goalIsCanonical: boolean;
  signature: string | null;
  hook: { roll: number; text: string; source: string } | null;
  dressing: { presence: string; hiddenAgenda: string; relationship: string } | null;
};

// Edition is chosen once in the sidebar and shared by every tool in the suite.
const edition = useEdition();
const build = ref<Build>('career');
const careerChoice = ref<string>('random');
const competence = ref<Competence>('professional');
const hookSource = ref<HookSource>('none');
const establishedColony = ref(false);
const includeDressing = ref(true);
const npc = ref<NPC | null>(null);
const copied = ref(false);

const isCareerBuild = computed(() => build.value === 'career');
const roster = computed(() => (edition.value === 'evolved' ? ROSTER_EVOLVED : ROSTER_CORE));

// ─── Generation ──────────────────────────────────────────────────────────────

/**
 * The book's guidance: a typical NPC has 14 attribute points, none above 5.
 * Everyone starts at 2, the key attribute gets a bump, and the rest is spread
 * with the key attribute twice as likely to catch a point.
 */
function rollAttributes(key: AttributeName): Attributes {
  const attributes: Attributes = { Strength: 2, Agility: 2, Wits: 2, Empathy: 2 };
  attributes[key] += 1;
  const names: AttributeName[] = ['Strength', 'Agility', 'Wits', 'Empathy'];
  let remaining = 5;
  let guard = 0;
  while (remaining > 0 && guard < 100) {
    guard += 1;
    const target = Math.random() < 0.4 ? key : pick(names);
    if (attributes[target] >= 5) continue;
    attributes[target] += 1;
    remaining -= 1;
  }
  return attributes;
}

function rollSkills(keySkills: readonly string[], level: Competence): SkillEntry[] {
  const levels = COMPETENCE_LEVELS[level];
  const shuffled = [...keySkills].sort(() => Math.random() - 0.5);
  const skills: SkillEntry[] = shuffled.map((name, i) => ({ name, level: levels[i]! }));
  // Veterans and experts have picked up something outside their lane.
  if (level === 'veteran' || level === 'expert') {
    const extras = ALL_SKILLS.filter((name) => !keySkills.includes(name));
    skills.push({ name: pick(extras), level: 1 });
  }
  return skills.sort((a, b) => b.level - a.level);
}

function rollHook(): NPC['hook'] {
  if (hookSource.value === 'none') return null;
  if (hookSource.value === 'industrial') {
    const roll = d6() * 10 + d6();
    return { roll, text: lookup(INDUSTRIAL_ENCOUNTERS, roll).text, source: 'Industrial area' };
  }
  // An established colony adds +1 to the tens digit, which opens the 71-76 rows.
  const tens = d6() + (establishedColony.value ? 1 : 0);
  const roll = tens * 10 + d6();
  return {
    roll,
    text: lookup(COLONY_ENCOUNTERS, roll).text,
    source: establishedColony.value ? 'Established colony' : 'Colony',
  };
}

function rollDressing(): NPC['dressing'] {
  if (!includeDressing.value) return null;
  return {
    presence: pick(PRESENCE),
    hiddenAgenda: pick(HIDDEN_AGENDAS),
    relationship: pick(CREW_RELATIONSHIPS),
  };
}

function buildCareerNPC(): NPC {
  const career =
    careerChoice.value === 'random'
      ? pick(CAREERS)
      : (CAREERS.find((c) => c.id === careerChoice.value) ?? pick(CAREERS));
  const data = edition.value === 'evolved' ? career.evolved : career.core;
  const attributes = rollAttributes(career.keyAttribute);
  const cashDiceTotal = sumDice(data.cashDice);
  return {
    build: 'career',
    edition: edition.value,
    name: pick(career.names),
    role: career.name,
    attributes,
    health: attributes.Strength,
    skills: rollSkills(data.keySkills, competence.value),
    talent: pick(data.talents),
    gear: pickTwo(data.gear),
    cash: cashDiceTotal * data.cashMultiplier,
    cashBasis: `${data.cashDice}D6 × ${data.cashMultiplier.toLocaleString('en-US')} (rolled ${cashDiceTotal})`,
    keyAttribute: career.keyAttribute,
    keySkills: data.keySkills,
    appearance: pickTwo(data.appearance),
    trait: pick(TRAITS),
    goal: pick(career.agendas),
    goalIsCanonical: true,
    signature: pick(data.signature),
    hook: rollHook(),
    dressing: rollDressing(),
  };
}

function buildArchetypeNPC(): NPC {
  const archetype = pick(roster.value);
  return {
    build: 'archetype',
    edition: edition.value,
    name: pick(ALL_CANONICAL_NAMES),
    role: archetype.name,
    attributes: {
      Strength: archetype.strength,
      Agility: archetype.agility,
      Wits: archetype.wits,
      Empathy: archetype.empathy,
    },
    health: archetype.health,
    skills: archetype.skills.split(', ').map((entry) => {
      const match = /^(.*)\s(\d+)$/.exec(entry);
      return { name: match?.[1] ?? entry, level: Number(match?.[2] ?? 0) };
    }),
    talent: archetype.talent,
    gear: archetype.gear ? [archetype.gear] : [],
    cash: null,
    cashBasis: null,
    keyAttribute: null,
    keySkills: null,
    appearance: [],
    trait: pick(TRAITS),
    goal: pick(GOALS),
    goalIsCanonical: false,
    signature: null,
    hook: rollHook(),
    dressing: rollDressing(),
  };
}

function generate(): void {
  npc.value = isCareerBuild.value ? buildCareerNPC() : buildArchetypeNPC();
}

// Individual rerolls keep an NPC you like and replace only the part that does not fit.
function rerollName(): void {
  if (!npc.value) return;
  const career = CAREERS.find((c) => c.name === npc.value!.role);
  npc.value.name = pick(career ? career.names : ALL_CANONICAL_NAMES);
}
function rerollAppearance(): void {
  if (!npc.value || npc.value.build !== 'career') return;
  const career = CAREERS.find((c) => c.name === npc.value!.role);
  if (!career) return;
  const data = npc.value.edition === 'evolved' ? career.evolved : career.core;
  npc.value.appearance = pickTwo(data.appearance);
}
function rerollTrait(): void {
  if (npc.value) npc.value.trait = pick(TRAITS);
}
function rerollGoal(): void {
  if (!npc.value) return;
  const career = CAREERS.find((c) => c.name === npc.value!.role);
  npc.value.goal = career ? pick(career.agendas) : pick(GOALS);
}
function rerollHook(): void {
  if (npc.value) npc.value.hook = rollHook();
}
function rerollDressing(): void {
  if (npc.value && npc.value.dressing) npc.value.dressing = rollDressing();
}

function clearOutput(): void {
  npc.value = null;
}

// ─── Export ──────────────────────────────────────────────────────────────────

const statblockText = computed(() => {
  const n = npc.value;
  if (!n) return '';
  const lines: string[] = [];
  lines.push(`${n.name.toUpperCase()} — ${n.role}`);
  lines.push(
    `STRENGTH ${n.attributes.Strength}, AGILITY ${n.attributes.Agility}, WITS ${n.attributes.Wits}, EMPATHY ${n.attributes.Empathy}`
  );
  lines.push(`HEALTH: ${n.health}`);
  lines.push(`SKILLS: ${n.skills.map((s) => `${s.name} ${s.level}`).join(', ')}`);
  lines.push(`TALENT: ${n.talent ?? '-'}`);
  lines.push(`GEAR: ${n.gear.length ? n.gear.join(', ') : '-'}`);
  if (n.cash !== null) lines.push(`CASH: $${n.cash.toLocaleString('en-US')} (${n.cashBasis})`);
  lines.push('');
  if (n.appearance.length) lines.push(`APPEARANCE: ${n.appearance.join('; ')}`);
  lines.push(`TRAIT: ${n.trait}`);
  lines.push(`GOAL: ${n.goal}`);
  if (n.signature) lines.push(`SIGNATURE ITEM: ${n.signature}`);
  if (n.hook) lines.push(`FIRST SEEN (${n.hook.source}, D66 ${n.hook.roll}): ${n.hook.text}`);
  if (n.dressing) {
    lines.push('');
    lines.push('TABLE DRESSING');
    lines.push(`- Presence: ${n.dressing.presence}`);
    lines.push(`- Hidden agenda: ${n.dressing.hiddenAgenda}`);
    lines.push(`- Crew relationship: ${n.dressing.relationship}`);
  }
  return lines.join('\n');
});

async function copyStatblock(): Promise<void> {
  try {
    await navigator.clipboard.writeText(statblockText.value);
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
            for="npc-build"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Build</label
          >
          <select
            id="npc-build"
            v-model="build"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="career">Career NPC (built from scratch)</option>
            <option value="archetype">Typical NPC (book statblock)</option>
          </select>
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{
              isCareerBuild
                ? 'Rolls the career tables and spreads 14 attribute points'
                : `Pulls one of the ${roster.length} ready-made NPCs`
            }}
          </span>
        </div>

        <div v-if="isCareerBuild" class="flex flex-col gap-[0.375rem]">
          <label
            for="npc-career"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Career</label
          >
          <select
            id="npc-career"
            v-model="careerChoice"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="random">Random</option>
            <option v-for="career in CAREERS" :key="career.id" :value="career.id">
              {{ career.name }}
            </option>
          </select>
        </div>

        <div v-if="isCareerBuild" class="flex flex-col gap-[0.375rem]">
          <label
            for="npc-competence"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Competence</label
          >
          <select
            id="npc-competence"
            v-model="competence"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="green">Green</option>
            <option value="professional">Professional</option>
            <option value="veteran">Veteran</option>
            <option value="expert">Expert</option>
          </select>
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Skill 2 is competent, 3 to 5 is an expert</span
          >
        </div>

        <div class="flex flex-col gap-[0.375rem]">
          <label
            for="npc-hook"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >First seen</label
          >
          <select
            id="npc-hook"
            v-model="hookSource"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="none">No encounter hook</option>
            <option value="colony">Colony encounter</option>
            <option value="industrial">Industrial area encounter</option>
          </select>
          <label
            v-if="hookSource === 'colony'"
            class="flex cursor-pointer items-center gap-2 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            <input
              v-model="establishedColony"
              type="checkbox"
              class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
            />
            Established colony (+1 to the tens digit)
          </label>
        </div>
      </div>

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
            v-model="includeDressing"
            type="checkbox"
            class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          />
          Table dressing
        </label>
        <button
          v-if="npc"
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="copyStatblock"
        >
          {{ copied ? 'Copied' : 'Copy statblock' }}
        </button>
        <button
          v-if="npc"
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="clearOutput"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Result -->
    <div v-if="npc" class="flex flex-col gap-4" aria-live="polite">
      <!-- Statblock -->
      <div
        class="flex flex-col gap-3 rounded-lg border border-[var(--color-brand-primary)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              class="text-lg font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{ npc.name }}</span
            >
            <span class="text-sm font-bold text-[var(--color-brand-primary)]">{{ npc.role }}</span>
            <span
              v-if="npc.build === 'career'"
              class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >{{ COMPETENCE_LABEL[competence] }}</span
            >
          </div>
          <button
            type="button"
            class="cursor-pointer rounded border border-[var(--color-surface-500)] px-2 py-[0.125rem] text-xs text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
            aria-label="Reroll name"
            @click="rerollName"
          >
            New name
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div
            v-for="(value, key) in npc.attributes"
            :key="key"
            class="flex flex-col gap-1 rounded-md border border-[var(--color-surface-600)] bg-[var(--color-surface-600)] px-3 py-2"
          >
            <span
              class="text-xs font-semibold tracking-[0.06em] uppercase"
              :class="
                npc.keyAttribute === key
                  ? 'text-[var(--color-brand-primary)]'
                  : 'text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]'
              "
              >{{ key }}</span
            >
            <span
              class="text-xl font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{ value }}</span
            >
          </div>
          <div
            class="flex flex-col gap-1 rounded-md border border-[var(--color-surface-600)] bg-[var(--color-surface-600)] px-3 py-2"
          >
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Health</span
            >
            <span
              class="text-xl font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{ npc.health }}</span
            >
          </div>
        </div>

        <dl class="flex flex-col gap-2">
          <div class="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <dt
              class="shrink-0 text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase sm:w-24 [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              Skills
            </dt>
            <dd
              class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              <span v-for="(skill, i) in npc.skills" :key="skill.name">
                <template v-if="i > 0">, </template>
                <span :class="npc.keySkills?.includes(skill.name) ? 'font-semibold' : ''"
                  >{{ skill.name }} {{ skill.level }}</span
                >
              </span>
            </dd>
          </div>
          <div class="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <dt
              class="shrink-0 text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase sm:w-24 [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              Talent
            </dt>
            <dd
              class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ npc.talent ?? 'None' }}
            </dd>
          </div>
          <div class="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <dt
              class="shrink-0 text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase sm:w-24 [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              Gear
            </dt>
            <dd
              class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ npc.gear.length ? npc.gear.join(', ') : 'None' }}
            </dd>
          </div>
          <div v-if="npc.cash !== null" class="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <dt
              class="shrink-0 text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase sm:w-24 [.light_&]:text-[var(--color-text-secondary-light)]"
            >
              Cash
            </dt>
            <dd
              class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              ${{ npc.cash.toLocaleString('en-US') }}
              <span
                class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
                >{{ npc.cashBasis }}</span
              >
            </dd>
          </div>
        </dl>
      </div>

      <!-- Name, appearance, trait, goal: the four things the book says you need -->
      <div
        class="grid [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))] grid-cols-1 gap-4"
      >
        <div
          v-if="npc.appearance.length"
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <div class="flex items-start justify-between gap-2">
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Appearance</span
            >
            <button
              type="button"
              class="cursor-pointer rounded border border-[var(--color-surface-500)] px-2 py-[0.125rem] text-xs text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              aria-label="Reroll appearance"
              @click="rerollAppearance"
            >
              Reroll
            </button>
          </div>
          <ul class="m-0 flex list-none flex-col gap-1 p-0">
            <li
              v-for="item in npc.appearance"
              :key="item"
              class="text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ item }}
            </li>
          </ul>
          <p
            v-if="npc.dressing"
            class="m-0 border-t border-[var(--color-surface-600)] pt-2 text-sm leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{ npc.dressing.presence }}
          </p>
        </div>

        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <div class="flex items-start justify-between gap-2">
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Trait</span
            >
            <button
              type="button"
              class="cursor-pointer rounded border border-[var(--color-surface-500)] px-2 py-[0.125rem] text-xs text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              aria-label="Reroll trait"
              @click="rerollTrait"
            >
              Reroll
            </button>
          </div>
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ npc.trait }}
          </p>
        </div>

        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <div class="flex items-start justify-between gap-2">
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >{{ npc.goalIsCanonical ? 'Goal · personal agenda' : 'Goal' }}</span
            >
            <button
              type="button"
              class="cursor-pointer rounded border border-[var(--color-surface-500)] px-2 py-[0.125rem] text-xs text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              aria-label="Reroll goal"
              @click="rerollGoal"
            >
              Reroll
            </button>
          </div>
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ npc.goal }}
          </p>
        </div>

        <div
          v-if="npc.signature"
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Signature item</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ npc.signature }}
          </p>
        </div>

        <div
          v-if="npc.hook"
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <div class="flex items-start justify-between gap-2">
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >First seen · D66 {{ npc.hook.roll }}</span
            >
            <button
              type="button"
              class="cursor-pointer rounded border border-[var(--color-surface-500)] px-2 py-[0.125rem] text-xs text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              aria-label="Reroll encounter hook"
              @click="rerollHook"
            >
              Reroll
            </button>
          </div>
          <p
            class="m-0 text-sm leading-[1.55] font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ npc.hook.text }}
          </p>
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{ npc.hook.source }}
          </p>
        </div>
      </div>

      <!-- Table dressing -->
      <div
        v-if="npc.dressing"
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
            @click="rerollDressing"
          >
            Reroll
          </button>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="flex flex-col gap-1 sm:col-span-2">
            <span class="text-xs font-semibold tracking-[0.06em] text-amber-400 uppercase"
              >Hidden agenda</span
            >
            <p
              class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ npc.dressing.hiddenAgenda }}
            </p>
          </div>
          <div class="flex flex-col gap-1 sm:col-span-2">
            <span
              class="text-xs font-semibold text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >Crew relationship</span
            >
            <p
              class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >
              {{ npc.dressing.relationship }}
            </p>
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
        Roll a table-ready NPC with the four things the rulebook says you need: name, appearance,
        trait and goal, plus a full statblock. Build one from the nine career tables, or pull a
        ready-made archetype from the book's typical NPC roster.
      </p>
    </div>
  </div>
</template>
