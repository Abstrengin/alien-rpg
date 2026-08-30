<script setup lang="ts">
/**
 * AlienRPGCreatureGenerator.vue
 * Creature generator for the ALIEN RPG.
 *
 * The species roster reproduces the alien statblocks and signature attack tables
 * from the rulebooks, along with the Xenomorph combat rules and the broken
 * Xenomorph table. Published by Free League.
 * The custom creature builder is original TTBG content, built on the same chassis.
 */
import { ref, computed, watch } from 'vue';
import { useEdition } from '@/shared/edition';

function d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}
function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}
function range(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}
/** N distinct entries, in table order. */
function pickDistinct<T>(items: readonly T[], count: number): T[] {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

// ─── Signature attack tables ─────────────────────────────────────────────────

type AttackRow = { min: number; max: number; name: string; text: string };

const ATTACKS_EVOLVED: Record<string, readonly AttackRow[]> = {
  facehugger: [
    { min: 1, max: 2, name: 'Skittering Menace', text: 'The Facehugger has chosen its host! It skitters forward, single-minded and horrifyingly spider-like. The victim gains stress level +1 and must make an immediate panic roll. The next attack from the Facehugger will be against the same target with +1 to the D6 roll.' },
    { min: 3, max: 4, name: 'Tail Grapple', text: "The Facehugger leaps and catches its victim, its tail whipping violently. Roll another D6. 1-2: the victim's legs are caught and it falls down, making an immediate panic roll, unable to move until the Facehugger makes another action or is killed. 3-4: the victim's arm gets hopelessly tangled, dropping one weapon or item of the GM's choice, and must make an immediate panic roll. 5-6: the Facehugger wraps its tail around the victim's neck, choking it — immediate panic roll and a STAMINA roll or suffer 1 point of damage (armor has no effect). After any Tail Grapple, the next attack is against the same target with +2 to the D6 roll, if within range." },
    { min: 5, max: 5, name: 'Face Grapple', text: "The Facehugger leaps at its victim's face with horrifying speed. Roll for an attack with six base dice. It is possible to defend against the attack. If the attack hits, the target must make an immediate panic roll, and the Facehugger will perform The Final Embrace on the same target on its next turn." },
    { min: 6, max: 8, name: 'The Final Embrace', text: 'The Facehugger gets to its victim, its acid making short work of any helmet or respirator in the way (armor has no effect, except the APEsuit). Roll for the attack with eight base dice. It is possible to defend against the attack. If the attack hits, the poor victim is facehugged and immediately broken.' },
  ],
  chestburster: [
    { min: 1, max: 3, name: 'Escape', text: 'With a snarl, the Chestburster flees, moving two zones away, into the nearest vent, sewer or duct if possible. As soon as the PCs lose line of sight, the Chestburster has escaped. Stealth mode ensues as the Chestburster tries to hide and grow.' },
    { min: 4, max: 4, name: 'Terrorizing Hiss', text: 'The Chestburster jumps towards a target, flashing its razor-sharp teeth and hissing malevolently. The target must make an immediate panic roll. The Imp will instead mimic the actions of the target in an unsettling manner, with the same effect.' },
    { min: 5, max: 5, name: 'Leg Slash', text: "With a snarl the Chestburster slashes its target's leg, metallic teeth flashing in the light. Roll for the attack using six base dice, base damage 2, armor piercing. If the attack causes damage on a human, the victim immediately suffers an Impaled Thigh critical injury even if not broken." },
    { min: 6, max: 6, name: 'Throat Bite', text: 'The Chestburster squeals a high-pitched shriek and goes for the throat. Roll for the attack with eight base dice, base damage 1, armor piercing. If the attack causes damage, it triggers an immediate panic roll.' },
  ],
  stageIV: [
    { min: 1, max: 1, name: 'Hypnotizing Gaze', text: 'The Xenomorph, eyeless as it may seem, stares deeply into the soul of a victim at Short range. The victim is mesmerized by the dread beauty of such a beast, gets +1 stress level and must make an immediate panic roll.' },
    { min: 2, max: 2, name: 'Playing With Its Prey', text: "The Xeno attacks, but not to kill. The victim is knocked down and drops a weapon or other item of the GM's choice, but otherwise takes no damage. The Xenomorph stands over its prey, taunting them to run so the game can go on. The victim must make an immediate panic roll." },
    { min: 3, max: 3, name: 'Deadly Grab', text: "The beast launches through the air, grabbing its victim with its talons. It attacks with eight base dice, base damage 1. If it hits, the Xeno immediately drags the victim into an adjacent zone (free bonus move), dumping it on the floor. The victim drops a weapon or other item of the GM's choice and must make an immediate panic roll." },
    { min: 4, max: 4, name: 'Ready To Kill', text: "The Xenomorph grabs its victim with its talons, its inner jaws poised to strike. Roll for the attack with ten base dice. If it hits, the victim takes 1 point of damage and is grappled, and must win an opposed roll for CLOSE COMBAT against the Xeno's MOBILITY to break loose. All friendly characters in the same zone must make a panic roll. Unless the victim breaks free, the Xenomorph will use a Headbite attack on its next turn." },
    { min: 5, max: 5, name: 'Tail Spike', text: 'The Xenomorph impales the victim with its razor-sharp tail. Roll for the attack with ten base dice, base damage 2, armor piercing.' },
    { min: 6, max: 6, name: 'Headbite', text: 'The Xenomorph opens its outer jaws wide, and the deadly inner jaws lean out, gnashing in anticipation before snapping forwards. The attack has nine base dice, base damage 2, armor piercing. If it causes any damage on a human, it automatically kills the victim in one dreadful blow. However, should the GM wish it, the victim remains just alive enough for the Xenomorph to initiate the ovomorphing process.' },
  ],
  stageV: [
    { min: 1, max: 1, name: 'Call For Reinforcements', text: 'The Xenomorph pauses, hissing quietly but all the more threatening for that. It looks like it is thinking, or maybe giving silent orders to unseen companions. Then, another Xenomorph appears in an adjacent zone, ready to act in the next round. All PCs in sight of it get stress level +1.' },
    { min: 2, max: 2, name: 'Frenzy', text: 'The Xeno leaps at its enemies, sweeping its arms, legs and tail through their ranks. All targets in the zone are knocked prone, take 1 point of damage, and must make an immediate panic roll. The effect is automatic but the attack can be dodged with a successful MOBILITY roll, avoiding all effects.' },
    { min: 3, max: 3, name: 'Talon Attack', text: 'The Xenomorph launches into a wild attack with its large, clawed talons at its victim. Roll for the attack with twelve base dice, base damage 1, armor piercing.' },
    { min: 4, max: 4, name: 'Capture For The Hive', text: 'The Xenomorph attacks with its venom-spiked tail, with twelve base dice, base damage 1, armor piercing. If the attack causes any damage, just 1 point of damage is inflicted, and the paralyzing venom takes effect. The victim must make a STAMINA roll — the number of successes rolled is the number of rounds it can stay up, then it falls unconscious for one shift. The victim can be woken with a MEDICAL AID roll (full action) by another character, otherwise the Xeno captures the victim for the hive.' },
    { min: 5, max: 5, name: 'Tail Spike', text: 'The Xenomorph impales the victim with its razor-sharp tail. Roll for the attack with eleven base dice, base damage 2, armor piercing.' },
    { min: 6, max: 6, name: 'Headbite', text: 'The Xenomorph opens its outer jaws wide, and the deadly inner jaws lean out, gnashing in anticipation before snapping forwards. The attack has a strength of ten base dice, base damage 2, armor piercing. If it causes any damage on a human, it automatically kills the victim in one dreadful blow.' },
  ],
  stageVI: [
    { min: 1, max: 1, name: 'Call The Guard', text: 'The enormous Xenomorph lets out a shrill cry for help, calling D3 Sentries (for the Queen) or Soldiers (for the Praetorian or Charger) to its defense. They arrive in the following round, then draw initiative and can act.' },
    { min: 2, max: 2, name: 'Frenzy', text: 'The Xeno leaps at its enemies, sweeping its arms, legs and tail through their ranks. All targets in the zone are knocked prone, take 1 point of damage, and must make immediate panic rolls. The effect is automatic, but the attack can be dodged with a successful MOBILITY roll, avoiding all effects.' },
    { min: 3, max: 3, name: 'Beastly Bite', text: 'The Xenomorph takes a huge bite from its victim. The attack is rolled with ten base dice, base damage 1, armor piercing. If the attack causes any damage on a human, the victim is automatically broken.' },
    { min: 4, max: 4, name: 'Charge', text: 'Charger and Queen only (re-roll for a Praetorian). Roll for the attack with eight base dice, base damage 4 (2 for a Queen), armor piercing. The attack can be dodged, but not defended against.' },
    { min: 5, max: 5, name: 'Tail Spike', text: 'The Xenomorph impales the victim with its razor-sharp tail. Roll for the attack with twelve base dice, base damage 2, armor piercing.' },
    { min: 6, max: 6, name: 'Headbite', text: 'The Xenomorph opens its outer jaws wide, and the deadly inner jaws lean out, gnashing in anticipation before snapping forwards. The attack has a strength of eleven base dice, base damage 2, armor piercing. If it causes any damage on a human, it automatically kills the victim in one dreadful blow.' },
  ],
  bloodburster: [
    { min: 1, max: 3, name: 'Escape', text: 'With a snarl, the Bloodburster flees, moving two zones away in a single action, into the nearest air duct if possible. As soon as the PCs lose line of sight, combat ends and stealth mode ensues. After D6 stretches, the Bloodburster grows into a Juvenile Neomorph and starts stalking the PCs.' },
    { min: 4, max: 4, name: 'Terrifying Hiss', text: 'The Bloodburster jumps onto the victim, showing its razor-sharp teeth and hissing. The victim must make an immediate panic roll.' },
    { min: 5, max: 5, name: 'Leg Bite', text: "With a snarl, the Bloodburster bites the victim's leg. Roll for the attack using six base dice, base damage 2. If the attack causes damage, the victim immediately suffers an Impaled Thigh critical injury even if not broken." },
    { min: 6, max: 6, name: 'Throat Bite', text: "The Bloodburster bites the victim's throat. Roll for the attack with eight base dice, base damage 1, armor piercing. If the attack causes damage on a human, it triggers an immediate panic roll." },
  ],
  neomorph: [
    { min: 1, max: 1, name: 'Terrifying Hiss', text: 'The Neomorph leans in close to the victim (Adjacent range), showing its razor-sharp teeth and hissing. The victim must make an immediate panic roll.' },
    { min: 2, max: 2, name: 'Tail Slash', text: 'The Neomorph pivots, slashing its victim with its sharp tail. The victim is attacked using ten base dice, base damage 2.' },
    { min: 3, max: 3, name: 'Deadly Grab', text: 'The Neomorph jumps at its victim, grabbing it and dragging it away. Roll for the attack using eight base dice, base damage 1. If it hits, the Neomorph immediately drags the victim into an adjacent zone (free bonus move), dumping it on the floor. The victim drops a weapon or other item and must make an immediate panic roll.' },
    { min: 4, max: 4, name: 'Leaping Attack', text: 'The Neomorph jumps at the victim. Roll for the attack using eight base dice, base damage 1. If the attack is successful, the victim is thrown to the ground and must make an immediate panic roll, and the Neomorph immediately performs a free extra attack with ten base dice, base damage 2.' },
    { min: 5, max: 5, name: 'Tail Spike', text: 'The Neomorph impales the victim with its razor-sharp tail. Roll for the attack with ten base dice, base damage 2, armor piercing.' },
    { min: 6, max: 6, name: 'Throat Bite', text: "The Neomorph bites the victim's throat. Roll for the attack using eight base dice, base damage 1, armor piercing. If the attack causes damage on a human, it kills the victim outright." },
  ],
  harvester: [
    { min: 1, max: 1, name: 'Sonar Sweep', text: 'The Harvester takes in its surroundings by singing out a quick sonar pulse. Add +1 to the next roll on this table (to a maximum of 6). All PCs within Long range get stress level +1.' },
    { min: 2, max: 2, name: 'Sonar Pulse', text: 'The Harvester uses its sonar as a weapon. Everyone within Short range gets blasted by the ultra-sonic burst and must make a STAMINA roll (no action) or be stunned and lose their next turn.' },
    { min: 3, max: 3, name: 'Charge', text: 'The Harvester rushes the enemy it deems to be the biggest threat. It makes a manic charge against it and continues into the next zone. Roll for the attack with six base dice, base damage 3, armor piercing. The attack can be dodged, but not defended against.' },
    { min: 4, max: 4, name: 'Stampede', text: 'The Harvester goes berserk, like a bucking bronco, and flails around in a maddened frenzy. All targets in the zone suffer a crushing attack of eight base dice, base damage 2.' },
    { min: 5, max: 5, name: 'Burrowing Claws', text: 'The beast’s claws are almost as bad as its maw, and it leaps on a poor victim. It suffers an attack with ten base dice, base damage 2, armor piercing.' },
    { min: 6, max: 6, name: 'Pulverize', text: 'The victim is dragged into the beast’s dreadful meat-grinder of a mouth. Roll for the attack with eight base dice, base damage 2, armor piercing. If damage is inflicted, the victim dies, its body mercilessly minced.' },
  ],
  lionworm: [
    { min: 1, max: 1, name: 'Intimidating Display', text: 'The Lion Worm rears up, its golden cilia flowing in threatening patterns. But it is a bluff — the expert predator has seen a problem and is covering a tactical retreat. All PCs within Short range must make a panic roll. On its next turn the Lion Worm attempts to leave combat and stealth mode resumes. When it makes its next attack, it gets +1 to its roll on this table (to a maximum of 6).' },
    { min: 2, max: 2, name: 'Playing With Its Prey', text: "The Lion Worm attacks for fun, rather than to kill. Roll for the attack with eight base dice. If the attack hits, the target drops a weapon or other item of the GM's choice, but is otherwise unharmed. The Worm rears over them, wishing for its prey to run before it attacks again. The victim must make an immediate panic roll." },
    { min: 3, max: 3, name: 'Acrid Pheromones', text: 'The Lion Worm releases a huge dump of pheromones into the air. They are so pungent that anyone near the creature starts to cough, and all PCs within Short range must make a STAMINA roll (no action) or lose their next turn.' },
    { min: 4, max: 4, name: 'Feral Rage', text: 'The beast attacks, throwing everything at its victim, with ten base dice, base damage 2. If it causes any damage, its insatiable desire to kill allows it to immediately make a second attack, with the same effect.' },
    { min: 5, max: 5, name: 'Crippling Attack', text: 'The Lion Worm attacks to incapacitate its target, either to eat later or to get enough space to escape a bad situation. It makes an attack with eight base dice, base damage 1, armor piercing. If it does any damage, the victim is automatically broken.' },
    { min: 6, max: 6, name: 'Death Roll', text: "The Lion Worm goes full out for the kill, grasping its target and wrapping it in a vicious death roll. Roll for the attack with ten base dice, base damage 1, armor piercing. If the attack hits, the victim is grappled and must win an opposed roll for CLOSE COMBAT against the Lion Worm's MOBILITY to break loose. On its next turn the Lion Worm squeezes the victim, attacking with ten base dice, base damage 1 again. This continues until the victim is killed or breaks free." },
  ],
  scorpionid: [
    { min: 1, max: 1, name: 'Retreat', text: 'The Scorpionid is not stupid and will not fight unless there is a good reason to. On this occasion it decides to flee the fight as quickly as possible.' },
    { min: 2, max: 2, name: 'Pinned Down', text: 'The Scorpionid uses its powerful pincers to pin down its target. Roll for the attack using ten base dice, base damage 1. If the attack hits, the target drops a weapon or other item and must make an immediate panic roll.' },
    { min: 3, max: 3, name: 'Pincer Grab', text: "The creature tries to seize its victim in its enormous claws, quivering with the anticipation of a quick strike with its huge tail. Roll for the attack with eight base dice, base damage 1. If the attack hits, the victim is grappled and must win an opposed roll for CLOSE COMBAT against the Scorpionid's MOBILITY to break loose. If the Scorpionid retains its grasp, it will automatically make a Tail Strike against the victim on its next turn. Underwater, it also drags the victim deeper and one zone away from the group, causing them to suffer the effects of drowning." },
    { min: 4, max: 4, name: 'Flailing Strike', text: "The Scorpionid's pincer swipes at its target. Roll for the attack with eight base dice, base damage 1. If the attack hits, the Scorpionid flings the victim into the next zone, causing another point of damage." },
    { min: 5, max: 5, name: 'Tail Strike', text: 'The Scorpionid swings its terrible tail forward with deadly purpose. It attacks with ten base dice, base damage 1, armor piercing. If it inflicts any damage, it also poisons the victim with a deadly venom, counting as a disease with a virulence rating of −2.' },
    { min: 6, max: 6, name: 'Immobilize', text: "The Scorpionid wants to escape, but to do so it needs to take its attackers out of the fight. It lunges for its victim's legs with its huge claws, making an attack with eight base dice, base damage 2. If it does any damage, the victim immediately suffers an Impaled Thigh critical injury even if not broken." },
  ],
  swarm: [
    { min: 1, max: 1, name: 'Consume', text: "The Swarm consumes everything in its path, and this place is rich in food. The Swarm's Health is restored by 2 points, making it harder to drive off." },
    { min: 2, max: 2, name: 'Pheromones', text: "The Swarm is getting increasingly agitated and more and more pheromones are being released into the air. The Swarm's next roll on this table gets +1." },
    { min: 3, max: 3, name: 'Suffocating Swarm', text: "The swarming creatures are everywhere. They are in the victims' eyes, ears and mouths, and it is almost impossible to breathe. Everyone inside the Swarm area must make a STAMINA roll. Failure means the victim loses their next turn, and the Swarm will perform a Stripped To The Bone attack against one victim on its next turn." },
    { min: 4, max: 4, name: 'Desperate Hunger', text: "The Swarm is so hungry it will eat anything, and right now the polymers and compounds in the players' armor look good. Everyone within the Swarm wearing armor suffers an attack rolled with eight base dice, base damage 1. Any damage is immediately subtracted from the armor level. Those not wearing armor find their clothes have been shredded, but the attack does not inflict any damage." },
    { min: 5, max: 5, name: 'Feeding Frenzy', text: 'The Swarm is hungry and tries to eat anything it can envelope. All characters inside the Swarm suffer an attack rolled with six base dice, base damage 1, armor piercing.' },
    { min: 6, max: 6, name: 'Stripped To The Bone', text: 'The Swarm focuses on one target, and that victim takes an attack rolled with twelve base dice, base damage 1, armor piercing. If the attack inflicts any damage, the Swarm will automatically attack the target again on its next turn. This continues until an attack fails to inflict damage, the victim is stripped to the bone, rescued, or the Swarm is driven off.' },
  ],
};

const ATTACKS_CORE: Record<string, readonly AttackRow[]> = {
  facehugger: [
    { min: 1, max: 2, name: 'Skittering Menace', text: 'The Facehugger has chosen its host and they know it is coming for them! It skitters forward, single-minded and horrifyingly spider-like. The victim suffers +1 STRESS LEVEL and must make an immediate Panic Roll.' },
    { min: 3, max: 3, name: 'Tail Lash', text: 'The little monster comes for its target, lashing out with its wicked tail. It attacks with five Base Dice, Damage 1 (the Royal Facehugger uses six Base Dice, base Damage 2). Aside from any damage the victim gets +1 STRESS LEVEL.' },
    { min: 4, max: 4, name: 'Tail Grapple', text: "The Facehugger leaps and catches its victim from behind, its tail whipping violently. Roll a D6. 1-2: the target's legs are caught and they fall prone — make a Panic Roll. 3-4: the victim's arms get hopelessly tangled in the beast's tail — they cannot use any held items and must make a Panic Roll. 5-6: the Facehugger wraps its tail around the target's neck, choking them — they suffer the effects of DROWNING and must make a Panic Roll." },
    { min: 5, max: 5, name: 'Face Grapple', text: "The Facehugger leaps at its victim. Make an opposed roll with six Base Dice against the target's CLOSE COMBAT skill (not counting as an action for the victim). If the Facehugger wins, the target will suffer The Final Embrace on the Facehugger's next initiative. If the victim wins they throw the beast to the floor, but it is not finished with them yet and attacks the same target again on its next initiative." },
    { min: 6, max: 6, name: 'The Final Embrace', text: 'The Facehugger gets to its victim, its acid making short work of any helmet or respirator in the way. Roll for the attack with six Base Dice. If it gets one or more successes, the poor victim is facehugged and immediately Broken.' },
  ],
  chestburster: [
    { min: 1, max: 3, name: 'Escape', text: 'With a snarl the Chestburster flees, moving two zones away in one action, into the nearest vent, sewer or duct if possible. As soon as the PCs lose line of sight the Chestburster has escaped. Stealth mode ensues as the Chestburster tries to hide and grow.' },
    { min: 4, max: 4, name: 'Terrorizing Hiss', text: 'The Chestburster jumps towards a target, flashing its razor-sharp teeth and hissing malevolently. The target must make an immediate Panic Roll.' },
    { min: 5, max: 5, name: 'Leg Slash', text: "With a snarl the Chestburster slashes its target's leg, metallic teeth flashing in the light. Roll for the attack using six Base Dice, Damage 2. If the attack causes damage, it automatically inflicts critical injury #53 (even if the victim is not Broken), triggering an immediate Panic Roll." },
    { min: 6, max: 6, name: 'Throat Bite', text: 'The Chestburster squeals a high-pitched shriek and goes for the throat. Roll for the attack with eight Base Dice, Damage 1. If the attack causes damage, it immediately inflicts critical injury #61 (even if the victim is not Broken), triggering an immediate Panic Roll.' },
  ],
  stageIV: [
    { min: 1, max: 1, name: 'Hypnotizing Gaze', text: 'The Xenomorph, eyeless as it may seem, stares deeply into the soul of its victim. The victim is mesmerized by the dread beauty of such a beast, gets +1 STRESS LEVEL and must make an immediate Panic Roll.' },
    { min: 2, max: 2, name: 'Playing With Its Prey', text: 'The Xeno attacks, but not to kill. The target is knocked to the ground and drops all hand-held items, but otherwise takes no damage. The Xenomorph stands over them, taunting its prey to run so the game can go on. The victim gets +1 STRESS LEVEL and must make an immediate Panic Roll.' },
    { min: 3, max: 3, name: 'Deadly Grab', text: 'The beast launches through the air, grabbing its victim. It attacks with ten Base Dice, Damage 1. If it hits it immediately drags them into a neighboring zone, dumping them on the floor. The victim is prone, drops all hand-held items and must make an immediate Panic Roll.' },
    { min: 4, max: 4, name: 'Ready To Kill', text: 'The Xenomorph grabs its victim, its inner jaws poised to strike. Roll for the attack with ten Base Dice. If it hits, the victim counts as grabbed and needs to make an opposed CLOSE COMBAT roll against ten Base Dice to break loose. The victim and all friendly characters in the same zone must make Panic Rolls. Unless the victim breaks free, the Xenomorph will use a Headbite attack against them on its next initiative.' },
    { min: 5, max: 5, name: 'Capture For The Hive', text: 'The Xenomorph attacks with its venom-spiked tail, with ten Base Dice, Damage 1. If the attack causes any damage, the Xeno pulls its punch so only one point of damage is inflicted, and the paralyzing venom takes effect. The victim must make a STAMINA roll — the number of successes rolled is the number of Rounds they can stay up, then they fall unconscious for one Shift. The paralysis can be removed with a shot of adrenaline (a MEDICAL AID roll using a Medkit).' },
    { min: 6, max: 6, name: 'Headbite', text: 'The Xenomorph opens its outer jaws wide, and the deadly inner jaws lean out, gnashing in anticipation before snapping forwards. The attack has a strength of nine Base Dice, Damage 2. If it causes any damage it automatically inflicts critical injury #64, killing the victim in one dreadful blow. However, should the GM wish it, the victim remains just alive enough for the Xenomorph to initiate the ovomorphing process.' },
  ],
  stageV: [
    { min: 1, max: 1, name: 'Assessing The Threat', text: 'The Xenomorph pauses, hissing quietly but all the more threatening for that. It looks like it is thinking, or maybe giving silent orders to unseen companions. Everyone within MEDIUM range gets +1 STRESS LEVEL.' },
    { min: 2, max: 2, name: 'One For All', text: 'The Xeno leaps at the largest group of enemies and roars a challenge, sweeping its arms, legs and tail through their ranks. All targets within SHORT range must succeed at a MOBILITY roll or be knocked off their feet, taking one point of damage. All the targets must make immediate Panic Rolls.' },
    { min: 3, max: 3, name: 'All-Out Attack', text: 'The Xenomorph launches into a wild attack, throwing every claw, fang and its pointed tail at its victim. It attacks with twelve Base Dice, Damage 2, and the attack is armor piercing.' },
    { min: 4, max: 4, name: 'Capture For The Hive', text: 'The Xenomorph attacks with its venom-spiked tail, with twelve Base Dice, Damage 1. If the attack causes any damage, the Xeno pulls its punch so only one point of damage is inflicted, and the paralyzing venom takes effect. The victim must make a STAMINA roll — the number of successes rolled is the number of Rounds they can stay up, then they fall unconscious for one Shift. The paralysis can be removed with a shot of adrenaline, but otherwise the Xeno will capture them for the egg chamber.' },
    { min: 5, max: 5, name: 'Die For The Queen', text: 'The Xenomorph, desperate to protect its hive and Queen, leaps towards an enemy, eviscerating itself as it does so. Its acid blood showers everywhere: all targets within SHORT range of the Xeno suffer an immediate acid splash attack of twelve Base Dice. The Xeno dies, squealing.' },
    { min: 6, max: 6, name: 'Headbite', text: 'The Xenomorph opens its outer jaws wide, and the deadly inner jaws lean out, gnashing in anticipation before snapping forwards. The attack is rolled with ten Base Dice, Damage 2. If it causes any damage it automatically inflicts critical injury #64, killing the victim in one dreadful blow.' },
  ],
  stageVI: [
    { min: 1, max: 1, name: 'Call The Guard', text: 'The enormous Xenomorph lets out a shrill cry for help, calling D6 Sentries (for the Queen) or Soldiers (for the Praetorian or Charger) to its defense. They reach the zone the following Round, then draw initiative and can act.' },
    { min: 2, max: 2, name: 'Charge', text: 'Charger only (re-roll for a Praetorian or Queen). The target must make a MOBILITY roll (no action) or be crushed, being immediately Broken and suffering a random critical injury. Even if the victim makes the roll, they fall down and gain +1 STRESS LEVEL.' },
    { min: 3, max: 3, name: 'Beastly Bite', text: 'The Xenomorph takes a huge bite from its victim. The attack is rolled with ten Base Dice, Damage 1. If the attack causes any damage, it inflicts critical injury #61 even if the victim is not Broken, triggering a Panic Roll.' },
    { min: 4, max: 4, name: 'Crushing Blow', text: 'The Xenomorph brings its entire weight down on the poor victim, who must make a MOBILITY roll at −2 (no action) or be crushed, immediately suffering three critical injuries (roll three times on the critical injury table and apply all three results, regardless of whether the victim is Broken). The victim is knocked to the ground and must make an immediate Panic Roll.' },
    { min: 5, max: 5, name: 'Tail Spike', text: 'The tail impales the victim with terrible force. Roll for the attack using ten Base Dice (fourteen for a Queen), Damage 1. The attack is armor piercing. If the attack causes any damage it automatically triggers critical injury #66, killing them outright.' },
    { min: 6, max: 6, name: 'Headbite', text: 'The Xenomorph opens its mouth wide and the inner jaws lash out. The attack uses ten Base Dice, Damage 2. If it causes any damage the victim immediately suffers critical injury #64, killing them in one dreadful blow.' },
  ],
  bloodburster: [
    { min: 1, max: 3, name: 'Escape', text: 'With a snarl, the Bloodburster flees, moving two zones away in a single action, into the nearest air duct if possible. As soon as the PCs lose line of sight, combat ends and stealth mode ensues. After D6 Turns, the Bloodburster grows into a Juvenile Neomorph and starts stalking the PCs.' },
    { min: 4, max: 4, name: 'Terrifying Hiss', text: 'The Bloodburster jumps onto the victim, showing its razor-sharp teeth and hissing. The victim must make an immediate Panic Roll.' },
    { min: 5, max: 5, name: 'Leg Bite', text: "With a snarl, the Bloodburster bites the victim's leg. Roll for the attack using six Base Dice, Damage 2. If the attack causes damage, it automatically inflicts critical injury #53 (even if the victim is not Broken), triggering an immediate Panic Roll." },
    { min: 6, max: 6, name: 'Throat Bite', text: "The Bloodburster bites the victim's throat. Roll for the attack using eight Base Dice, Damage 1. If the attack causes damage, it automatically inflicts critical injury #61 (even if the victim is not Broken), triggering an immediate Panic Roll." },
  ],
  neomorph: [
    { min: 1, max: 1, name: 'Terrifying Hiss', text: 'The Neomorph leans in close to the victim, showing its razor-sharp teeth and hissing. The victim must make an immediate Panic Roll.' },
    { min: 2, max: 2, name: 'Tail Slash', text: 'The Neomorph pivots, slashing its victim with its sharp tail. The victim is attacked using ten Base Dice, Damage 2. The attack is armor piercing, halving any Armor Rating.' },
    { min: 3, max: 3, name: 'Deadly Grab', text: 'The Neomorph jumps at its victim, grabbing it and dragging it away. Roll for the attack using eight Base Dice, Damage 1. If it hits, the Neomorph immediately drags the victim into the next zone (MEDIUM range) before releasing it. The victim falls prone, drops any hand-held items, and must make an immediate Panic Roll.' },
    { min: 4, max: 4, name: 'Leaping Attack', text: 'The Neomorph jumps at the victim. Roll for the attack using eight Base Dice, Damage 1. If the attack is successful, the victim is thrown to the ground and must make an immediate Panic Roll, and the Neomorph immediately performs an extra attack with ten Base Dice, Damage 2 (does not count as an action). The extra attack cannot be blocked.' },
    { min: 5, max: 5, name: 'Throat Bite', text: "The Neomorph bites the victim's throat. Roll for the attack using eight Base Dice, Damage 1. If the attack causes damage, it automatically inflicts critical injury #61 (even if the victim is not Broken), triggering an immediate Panic Roll." },
    { min: 6, max: 6, name: 'Tail Spike', text: 'The Neomorph impales the victim with its razor-sharp tail. Roll for the attack using seven Base Dice, Damage 1. The attack is armor piercing, halving any Armor Rating. If the attack causes damage, it automatically triggers critical injury #66 (even if the victim is not Broken), killing the victim outright.' },
  ],
  harvester: [
    { min: 1, max: 1, name: 'Sonar Sweep', text: 'The Harvester takes in its surroundings by singing out a quick sonar pulse. Add one to the next roll on this table (for a maximum of 6). All PCs at up to LONG range are affected by the high-pitched squeal and get +1 STRESS LEVEL.' },
    { min: 2, max: 2, name: 'Sonar Pulse', text: 'The Harvester uses its sonar as a weapon. Everyone within SHORT range gets blasted by the ultra-sonic burst and must make a STAMINA roll (no action) or be stunned and lose their next action. Those who are not stunned must make a Panic Roll.' },
    { min: 3, max: 3, name: 'Charge', text: 'The cornered Harvester rushes the player who it deems to be the biggest threat. It makes a manic charge against them, and all those in that direction, as its charge crosses into the next zone. All targets must make a MOBILITY roll (no action) to get out of the way. Anyone who fails suffers an attack rolled with ten Base Dice, Damage 1, and is knocked prone.' },
    { min: 4, max: 4, name: 'Stampede', text: 'The Harvester goes berserk, like a bucking bronco, and flails around in a maddened frenzy. All targets within SHORT range suffer a crushing attack of six Base Dice, Damage 2, and are knocked prone if hit.' },
    { min: 5, max: 5, name: 'Burrowing Claws', text: 'The beast’s claws are almost as bad as its maw, and it leaps on a poor victim. They suffer an attack with ten Base Dice, Damage 2.' },
    { min: 6, max: 6, name: 'Pulverize', text: 'The victim is dragged into the beast’s dreadful meat-grinder of a mouth. They get to make a last-ditch opposed CLOSE COMBAT roll against eight Base Dice (no action) to dodge that dreadful fate. If they fail the roll they die. All who witness this receive +1 STRESS LEVEL and must make a Panic Roll.' },
  ],
  lionworm: [
    { min: 1, max: 1, name: 'Intimidating Display', text: 'The Lion Worm rears up, its golden cilia flowing in threatening patterns. But it is a bluff — the expert predator has seen a problem and is using an aggressive display to cover a tactical retreat (which it makes on its next action). All PCs within SHORT range must make a Panic Roll. When it retreats, stealth mode resumes with the Lion Worm still hunting the PCs. When it makes its next attack, it gets +1 to its roll on this table (to a maximum of 6).' },
    { min: 2, max: 2, name: 'Play With Its Prey', text: 'The Lion Worm attacks but for fun, rather than to kill. Roll for the attack with eight Base Dice. If the attack hits, the target is knocked to the ground and drops all hand-held items, but is otherwise unharmed. The Worm rears over them, wishing for its prey to run before it attacks again. The victim must make an immediate Panic Roll.' },
    { min: 3, max: 3, name: 'Acrid Pheromones', text: 'The Lion Worm releases a huge dump of pheromones into the air. They are so pungent that anyone near the creature starts to cough and all PCs within SHORT range must make a STAMINA roll. If unsuccessful they are stunned and lose their next slow action.' },
    { min: 4, max: 4, name: 'Feral Rage', text: 'The beast attacks, throwing everything at its victim, with ten Base Dice, Damage 2. If it causes any damage, its insatiable desire to kill allows it to immediately make a second attack as a free action, with the same number of Base Dice and Damage rating.' },
    { min: 5, max: 5, name: 'Crippling Attack', text: 'The Lion Worm attacks to incapacitate its target, either to eat later or get enough space to escape a bad situation. It goes for a crippling blow, making an attack with eight Base Dice, Damage 1. If it does any damage it automatically inflicts critical injury #56, even if the victim is not Broken.' },
    { min: 6, max: 6, name: 'Death Roll', text: 'The Lion Worm goes full out for the kill, grasping its target and wrapping it in a vicious death roll. Roll for the attack with ten Base Dice, Damage 1. If the attack hits, the victim is grappled as well as disorientated and loses their next slow action. On its next action, the Lion Worm will squeeze the victim, attacking with ten Base Dice, Damage 1 again.' },
  ],
  scorpionid: [
    { min: 1, max: 1, name: 'Retreat', text: 'The Scorpionid is not stupid and will not fight unless there is a good reason to. On this occasion it decides to flee the fight as quickly as possible.' },
    { min: 2, max: 2, name: 'Pinned Down', text: 'The Scorpionid uses its powerful pincers to pin down its target. Roll for the attack using ten Base Dice, Damage 1. If the attack hits, the target is knocked prone, drops any hand-held items and must make an immediate Panic Roll.' },
    { min: 3, max: 3, name: 'Pincer Grab', text: 'The creature tries to seize its victim in its enormous claws, quivering with the anticipation of a quick strike with its huge tail. Roll for the attack with eight Base Dice, Damage 1. If the attack hits, the victim is grappled and must make an opposed roll for CLOSE COMBAT against eight Base Dice to break loose. If the Scorpionid retains its grasp, it will automatically make a Tail Strike against the victim on its next initiative. Underwater it will drag the victim deeper and one zone away from the group, causing them to suffer the effects of drowning.' },
    { min: 4, max: 4, name: 'Flailing Strike', text: "The Scorpionid's pincer swipes at its target. Roll for the attack with eight Base Dice, Damage 1. If the attack hits, the Scorpionid flings the victim into the next zone, causing an immediate critical injury (regardless of whether the victim is Broken). The victim is left prone and drops any hand-held items." },
    { min: 5, max: 5, name: 'Tail Strike', text: 'The Scorpionid swings its terrible tail forward with deadly purpose. It attacks with ten Base Dice, Damage 1. If it inflicts any damage it poisons the victim with a deadly venom, counting as a disease with a Virulence rating of 9.' },
    { min: 6, max: 6, name: 'Immobilize', text: "The Scorpionid wants to escape, but to do so it needs to take its attackers out of the fight. It lunges for its victim's legs with its huge claws." },
  ],
  swarm: [
    { min: 1, max: 1, name: 'Consume', text: "The Swarm consumes everything in its path, and this place is rich in food. The Swarm's Health is restored by 2 points, making it harder to drive off." },
    { min: 2, max: 2, name: 'Pheromones', text: "The Swarm is getting increasingly agitated and more and more pheromones are being released into the air. The Swarm's next roll on this table gets +1. This effect is cumulative." },
    { min: 3, max: 3, name: 'Suffocating Swarm', text: "The swarming creatures are everywhere: the air is thick with them. They are in the victims' eyes, ears and mouths, and it is almost impossible to breathe. Everyone inside the Swarm area must make a STAMINA roll. Failure means the victim cannot act during the next Round, and the Swarm will perform a Stripped To The Bone attack against the victim as its next action." },
    { min: 4, max: 4, name: 'Desperate Hunger', text: "The Swarm is so hungry it will eat anything, and right now the polymers and compounds in the players' armor look good. Everyone within the Swarm wearing armor suffers an attack rolled with eight Base Dice, Damage 1. Any damage is immediately subtracted from the Armor Rating. Those not wearing armor find their clothes have been shredded, but the attack does not inflict any damage." },
    { min: 5, max: 5, name: 'Feeding Frenzy', text: 'The Swarm is hungry and tries to eat anything it can envelope. All characters inside the Swarm suffer an attack rolled with six Base Dice, Damage 1. Armor is halved (rounded down) as the creatures look for ways to slip past it.' },
    { min: 6, max: 6, name: 'Stripped To The Bone', text: 'The Swarm focuses on one target, and that victim takes an attack rolled with eight Base Dice, Damage 1. Armor is halved (rounded down). If the attack inflicts any damage the Swarm has ravaged the victim and they suffer a critical injury, even if not Broken. Each Round thereafter one of the Swarm’s actions is automatically to attack this target again. This continues until the victim is stripped to the bone, rescued, or the Swarm is driven off.' },
  ],
};

// ─── Species roster ──────────────────────────────────────────────────────────

type Group = 'Xenomorph XX121' | 'Neomorph' | 'Other extra-solar species';

type Species = {
  id: string;
  name: string;
  group: Group;
  stage: string;
  speed: string;
  health: string;
  skills: string | null;
  armor: string;
  acid: string | null;
  abilities: { name: string; text: string }[];
  attacks: string | null;
  attackNote?: string;
};

const SPECIES_EVOLVED: readonly Species[] = [
  { id: 'ovomorph', name: 'Ovomorph (Egg)', group: 'Xenomorph XX121', stage: 'Stage I', speed: '0', health: '2', skills: null, armor: '0', acid: '4', abilities: [], attacks: null, attackNote: 'An egg does not attack. It opens, and the Facehugger inside takes over.' },
  { id: 'queens-egg', name: "The Queen's Egg", group: 'Xenomorph XX121', stage: 'Stage I', speed: '0', health: '3', skills: null, armor: '1 (0 vs fire)', acid: '5', abilities: [], attacks: null, attackNote: 'An egg does not attack. It opens, and the Facehugger inside takes over.' },
  { id: 'facehugger', name: 'Facehugger', group: 'Xenomorph XX121', stage: 'Stage II', speed: '2', health: '2', skills: 'Mobility 8, Observation 7', armor: '1 (0 vs fire)', acid: '4', abilities: [], attacks: 'facehugger' },
  { id: 'praeto-facehugger', name: 'Praeto-Facehugger', group: 'Xenomorph XX121', stage: 'Stage II', speed: '2', health: '2', skills: 'Mobility 6, Observation 7', armor: '1 (0 vs fire)', acid: '4', abilities: [], attacks: 'facehugger' },
  { id: 'royal-facehugger', name: 'Royal Facehugger', group: 'Xenomorph XX121', stage: 'Stage II', speed: '2', health: '3', skills: 'Mobility 8, Observation 8', armor: '2 (1 vs fire)', acid: '5', abilities: [], attacks: 'facehugger' },
  { id: 'chestburster', name: 'Chestburster', group: 'Xenomorph XX121', stage: 'Stage III', speed: '2', health: '2', skills: 'Mobility 8, Observation 4', armor: '0', acid: '4', abilities: [], attacks: 'chestburster' },
  { id: 'bambi-burster', name: 'Bambi Burster', group: 'Xenomorph XX121', stage: 'Stage III', speed: '2', health: '2', skills: 'Mobility 10, Observation 4', armor: '0', acid: '4', abilities: [], attacks: 'chestburster' },
  { id: 'imp', name: 'Imp', group: 'Xenomorph XX121', stage: 'Stage III', speed: '2', health: '2', skills: 'Mobility 8, Observation 6', armor: '0', acid: '4', abilities: [{ name: 'Mimicry', text: 'On a Terrorizing Hiss result, the Imp instead mimics the actions of the target in an unsettling manner, with the same effect.' }], attacks: 'chestburster' },
  { id: 'queenburster', name: 'Queenburster', group: 'Xenomorph XX121', stage: 'Stage III', speed: '2', health: '3', skills: 'Mobility 8, Observation 8', armor: '1 (0 vs fire)', acid: '5', abilities: [], attacks: 'chestburster' },
  { id: 'drone', name: 'Drone', group: 'Xenomorph XX121', stage: 'Stage IV', speed: '2', health: '7', skills: 'Mobility 8, Observation 8', armor: '2 (1 vs fire)', acid: '8', abilities: [{ name: 'Silent Assassin', text: 'All OBSERVATION rolls to spot the Drone in stealth mode get −2 dice.' }], attacks: 'stageIV' },
  { id: 'scout', name: 'Scout', group: 'Xenomorph XX121', stage: 'Stage IV', speed: '2', health: '5', skills: 'Mobility 10, Observation 10', armor: '2 (1 vs fire)', acid: '8', abilities: [], attacks: 'stageIV' },
  { id: 'stalker', name: 'Stalker', group: 'Xenomorph XX121', stage: 'Stage IV', speed: '2', health: '9', skills: 'Mobility 9, Observation 6', armor: '2', acid: '8', abilities: [{ name: 'Feral Hunger', text: 'If the Stalker makes an attack that causes damage, it immediately makes another attack (eight base dice, base damage 1) against the same target as a free action.' }], attacks: 'stageIV' },
  { id: 'soldier', name: 'Soldier', group: 'Xenomorph XX121', stage: 'Stage V', speed: '2', health: '8', skills: 'Mobility 8, Observation 8', armor: '2 (1 vs fire)', acid: '10', abilities: [], attacks: 'stageV' },
  { id: 'worker', name: 'Worker', group: 'Xenomorph XX121', stage: 'Stage V', speed: '1', health: '4', skills: 'Mobility 4, Observation 4', armor: '1 (0 vs fire)', acid: '6', abilities: [], attacks: 'stageV' },
  { id: 'sentry', name: 'Sentry', group: 'Xenomorph XX121', stage: 'Stage V', speed: '2', health: '8', skills: 'Mobility 12, Observation 10', armor: '2 (1 vs fire)', acid: '10', abilities: [], attacks: 'stageV' },
  { id: 'praetorian', name: 'Praetorian', group: 'Xenomorph XX121', stage: 'Stage VI', speed: '2', health: '12', skills: 'Mobility 5, Observation 8', armor: '3 (1 vs fire)', acid: '10', abilities: [], attacks: 'stageVI' },
  { id: 'charger', name: 'Charger / Crusher', group: 'Xenomorph XX121', stage: 'Stage VI', speed: '1', health: '20', skills: 'Mobility 4, Observation 5', armor: '5 (3 vs fire) to the front, 3 (1 vs fire) elsewhere', acid: '10', abilities: [], attacks: 'stageVI' },
  { id: 'queen', name: 'Queen', group: 'Xenomorph XX121', stage: 'Stage VI', speed: '2', health: '18', skills: 'Mobility 6 (zero when attached to the egg cocoon), Observation 12', armor: '4 (2 vs fire)', acid: '10', abilities: [], attacks: 'stageVI' },
  { id: 'bloodburster', name: 'Neomorphic Bloodburster', group: 'Neomorph', stage: 'Stage III', speed: '3', health: '2', skills: 'Mobility 9, Observation 5', armor: '0', acid: null, abilities: [{ name: 'Sprint', text: 'If the Bloodburster moves instead of performing a signature attack, it can move an additional zone.' }], attacks: 'bloodburster' },
  { id: 'neophyte', name: 'Neophyte (Juvenile Neomorph)', group: 'Neomorph', stage: 'Stage IV', speed: '3', health: '4', skills: 'Mobility 10, Observation 6', armor: '1 (0 vs fire)', acid: null, abilities: [{ name: 'Sprint', text: 'If the juvenile Neomorph moves instead of performing a signature attack, it can move an additional zone.' }], attacks: 'neomorph' },
  { id: 'adult-neomorph', name: 'Adult Neomorph', group: 'Neomorph', stage: 'Stage V', speed: '2', health: '6', skills: 'Mobility 9, Observation 8', armor: '1 (0 vs fire)', acid: null, abilities: [{ name: 'Sprint', text: 'If the adult Neomorph moves instead of performing a signature attack, it can move an additional zone.' }], attacks: 'neomorph' },
  { id: 'harvester', name: 'Harvester', group: 'Other extra-solar species', stage: 'Mammalian omnivore', speed: '1', health: '15', skills: 'Mobility 4', armor: '5 (2 on the underbelly)', acid: null, abilities: [{ name: 'Hidden Behemoth', text: 'When at rest the Harvester often buries itself, erupting from the ground when disturbed.' }], attacks: 'harvester' },
  { id: 'harvester-juvenile', name: 'Harvester (juvenile)', group: 'Other extra-solar species', stage: 'Mammalian omnivore', speed: '1', health: '4', skills: 'Mobility 8', armor: '1', acid: null, abilities: [], attacks: 'harvester' },
  { id: 'lion-worm', name: 'Lion Worm', group: 'Other extra-solar species', stage: 'Invertebrate carnivore', speed: '2', health: '8', skills: 'Mobility 10, Observation 8', armor: '1', acid: null, abilities: [{ name: 'Ambush Predator', text: 'In its own territory the Lion Worm sets traps, pits and walls of vines. Its prey get −2 dice to OBSERVATION in stealth mode there.' }], attacks: 'lionworm' },
  { id: 'scorpionid-land', name: 'Tanakan Scorpionid (on land)', group: 'Other extra-solar species', stage: 'Arthropod carnivore', speed: '1', health: '5', skills: 'Mobility 6, Observation 6', armor: '1 (0 vs firearms)', acid: null, abilities: [], attacks: 'scorpionid' },
  { id: 'scorpionid-water', name: 'Tanakan Scorpionid (in water)', group: 'Other extra-solar species', stage: 'Arthropod carnivore', speed: '3', health: '5', skills: 'Mobility 10, Observation 10', armor: '1 (0 vs firearms)', acid: null, abilities: [{ name: 'Underwater Sprint', text: 'If it starts its turn in water, the Scorpionid can move an additional zone.' }], attacks: 'scorpionid' },
  { id: 'swarm', name: 'The Swarm', group: 'Other extra-solar species', stage: 'Insect omnivores', speed: '1 per zone', health: '5 per zone', skills: null, armor: 'Impervious to all attacks except fire, explosions and electricity', acid: null, abilities: [], attacks: 'swarm' },
];

const SPECIES_CORE: readonly Species[] = [
  { id: 'ovomorph', name: 'Ovomorph (Egg)', group: 'Xenomorph XX121', stage: 'Stage I', speed: '0', health: '2', skills: 'None', armor: '2 (0 vs fire)', acid: '4', abilities: [], attacks: null, attackNote: 'An egg does not attack. It opens, and the Facehugger inside takes over.' },
  { id: 'queens-egg', name: "The Queen's Egg", group: 'Xenomorph XX121', stage: 'Stage I', speed: '0', health: '3', skills: 'None', armor: '3 (1 vs fire)', acid: '5', abilities: [], attacks: null, attackNote: 'An egg does not attack. It opens, and the Facehugger inside takes over.' },
  { id: 'facehugger', name: 'Facehugger', group: 'Xenomorph XX121', stage: 'Stage II', speed: '2', health: '2', skills: 'Mobility 8, Observation 8', armor: '2 (0 vs fire)', acid: '4', abilities: [], attacks: 'facehugger' },
  { id: 'praeto-facehugger', name: 'Praeto-Facehugger', group: 'Xenomorph XX121', stage: 'Stage II', speed: '2', health: '2', skills: 'Mobility 6, Observation 8', armor: '2 (0 vs fire)', acid: '4', abilities: [], attacks: 'facehugger' },
  { id: 'royal-facehugger', name: 'Royal Facehugger', group: 'Xenomorph XX121', stage: 'Stage II', speed: '2', health: '3', skills: 'Mobility 8, Observation 10', armor: '4 (2 vs fire)', acid: '5', abilities: [], attacks: 'facehugger' },
  { id: 'chestburster', name: 'Chestburster', group: 'Xenomorph XX121', stage: 'Stage III', speed: '2', health: '2', skills: 'Mobility 8, Observation 6', armor: '2 (0 vs fire)', acid: '4', abilities: [], attacks: 'chestburster' },
  { id: 'bambi-burster', name: 'Bambi Burster', group: 'Xenomorph XX121', stage: 'Stage III', speed: '2', health: '2', skills: 'Mobility 10, Observation 6', armor: '2 (0 vs fire)', acid: '4', abilities: [], attacks: 'chestburster' },
  { id: 'imp', name: 'Imp', group: 'Xenomorph XX121', stage: 'Stage III', speed: '2', health: '2', skills: 'Mobility 8, Observation 8', armor: '0 (3 vs fire)', acid: '4', abilities: [], attacks: 'chestburster' },
  { id: 'queenburster', name: 'Queenburster', group: 'Xenomorph XX121', stage: 'Stage III', speed: '2', health: '3', skills: 'Mobility 8, Observation 6', armor: '4 (2 vs fire)', acid: '5', abilities: [], attacks: 'chestburster' },
  { id: 'stalker', name: 'Stalker', group: 'Xenomorph XX121', stage: 'Stage IV', speed: '2', health: '6', skills: 'Mobility 8, Observation 6', armor: '10 (5 vs fire)', acid: '8', abilities: [], attacks: 'stageIV' },
  { id: 'scout', name: 'Scout', group: 'Xenomorph XX121', stage: 'Stage IV', speed: '3', health: '5', skills: 'Mobility 8, Observation 10', armor: '8 (4 vs fire)', acid: '8', abilities: [], attacks: 'stageIV' },
  { id: 'drone', name: 'Drone', group: 'Xenomorph XX121', stage: 'Stage IV', speed: '2', health: '7', skills: 'Mobility 10, Observation 8', armor: '8 (4 vs fire)', acid: '8', abilities: [], attacks: 'stageIV' },
  { id: 'soldier', name: 'Soldier', group: 'Xenomorph XX121', stage: 'Stage V', speed: '2', health: '8', skills: 'Mobility 8, Observation 8', armor: '10 (5 vs fire)', acid: '10', abilities: [], attacks: 'stageV' },
  { id: 'worker', name: 'Worker', group: 'Xenomorph XX121', stage: 'Stage V', speed: '1', health: '4', skills: 'Mobility 4, Observation 4', armor: '5 (2 vs fire)', acid: '6', abilities: [], attacks: 'stageV' },
  { id: 'sentry', name: 'Sentry', group: 'Xenomorph XX121', stage: 'Stage V', speed: '3', health: '8', skills: 'Mobility 12, Observation 10', armor: '12 (5 vs fire)', acid: '10', abilities: [], attacks: 'stageV' },
  { id: 'praetorian', name: 'Praetorian', group: 'Xenomorph XX121', stage: 'Stage VI', speed: '2', health: '10', skills: 'Mobility 5, Observation 8', armor: '12 (5 vs fire)', acid: '10', abilities: [], attacks: 'stageVI' },
  { id: 'charger', name: 'Charger / Crusher', group: 'Xenomorph XX121', stage: 'Stage VI', speed: '1', health: '16', skills: 'Mobility 4, Observation 5', armor: '18 (6 vs fire)', acid: '10', abilities: [], attacks: 'stageVI' },
  { id: 'queen', name: 'Queen', group: 'Xenomorph XX121', stage: 'Stage VI', speed: '2', health: '14', skills: 'Mobility 8, Observation 12', armor: '14 (5 vs fire)', acid: '10', abilities: [], attacks: 'stageVI' },
  { id: 'bloodburster', name: 'Neomorphic Bloodburster', group: 'Neomorph', stage: 'Stage III', speed: '3', health: '2', skills: 'Mobility 9, Observation 6', armor: '3 (0 vs fire)', acid: null, abilities: [], attacks: 'bloodburster' },
  { id: 'neophyte', name: 'Neophyte (Juvenile Neomorph)', group: 'Neomorph', stage: 'Stage IV', speed: '3', health: '4', skills: 'Mobility 10, Observation 6', armor: '4 (2 vs fire)', acid: null, abilities: [{ name: 'Sprint', text: 'As a slow action, the Neomorph can sprint as if having used two run actions.' }], attacks: 'neomorph' },
  { id: 'adult-neomorph', name: 'Adult Neomorph', group: 'Neomorph', stage: 'Stage V', speed: '2', health: '6', skills: 'Mobility 9, Observation 8', armor: '6 (3 vs fire)', acid: null, abilities: [{ name: 'Sprint', text: 'As a slow action, the Neomorph can sprint as if having used two run actions.' }], attacks: 'neomorph' },
  { id: 'harvester', name: 'Harvester', group: 'Other extra-solar species', stage: 'Mammalian omnivore', speed: '1', health: '15', skills: 'Mobility 4', armor: '15 (5 on the underbelly)', acid: null, abilities: [], attacks: 'harvester' },
  { id: 'harvester-juvenile', name: 'Harvester (juvenile)', group: 'Other extra-solar species', stage: 'Mammalian omnivore', speed: '1', health: '4', skills: 'Mobility 8', armor: '4', acid: null, abilities: [], attacks: 'harvester' },
  { id: 'lion-worm', name: 'Lion Worm', group: 'Other extra-solar species', stage: 'Invertebrate carnivore', speed: '2', health: '8', skills: 'Mobility 12, Observation 8', armor: '4', acid: null, abilities: [{ name: 'Ambush Predator', text: "In its own territory the Lion Worm sets traps, pits and walls of vines. In stealth mode its prey get −2 to OBSERVATION due to the Worm's cunning instincts." }], attacks: 'lionworm' },
  { id: 'scorpionid-land', name: 'Tanakan Scorpionid (on land)', group: 'Other extra-solar species', stage: 'Arthropod carnivore', speed: '1', health: '5', skills: 'Mobility 6, Observation 6', armor: '6 (3 vs bullets)', acid: null, abilities: [], attacks: 'scorpionid' },
  { id: 'scorpionid-water', name: 'Tanakan Scorpionid (in water)', group: 'Other extra-solar species', stage: 'Arthropod carnivore', speed: '3', health: '5', skills: 'Mobility 10, Observation 10', armor: '6 (3 vs bullets)', acid: null, abilities: [], attacks: 'scorpionid' },
  { id: 'swarm', name: 'The Swarm', group: 'Other extra-solar species', stage: 'Insect omnivores', speed: '1 per zone', health: '5 per zone', skills: null, armor: 'Impervious to all attacks except fire, explosions and electricity', acid: null, abilities: [], attacks: 'swarm' },
];

// ─── Broken creature table ───────────────────────────────────────────────────

type BrokenRow = { min: number; max: number; name: string; text: string };

const BROKEN_EVOLVED: readonly BrokenRow[] = [
  { min: 1, max: 1, name: 'Rise Again', text: "The Xenomorph falls to the ground, seemingly dead, but it's a ruse. On its next turn, it regains 1 point of Health and rises, fueled by instinctive hatred." },
  { min: 2, max: 2, name: 'Wounded', text: 'The Xenomorph staggers, bleeding severely. It gets Speed −1 (to a minimum of 1), but regains 1 point of Health. Roll D6 at the start of each of its turns. On 1-3, it tries to escape.' },
  { min: 3, max: 3, name: 'Desperate Escape', text: 'The Xenomorph is severely wounded and cries out in alien fury. It regains 1 point of Health and tries to flee, immediately moving two zones outside of the normal turn order. If it fails to leave combat, it acts normally on subsequent turns.' },
  { min: 4, max: 4, name: 'Last Breath', text: 'The Xenomorph is mortally wounded and contorts wildly. On its next turn it will perform a signature attack, then the beast dies. If it is wounded again before then, it dies instantly.' },
  { min: 5, max: 6, name: 'Torn Apart', text: 'Instant death. The Xenomorph is torn apart or crushed amidst shrieks of rage.' },
];

const BROKEN_CORE: readonly BrokenRow[] = [
  { min: 1, max: 1, name: 'Rise Again', text: "The Xenomorph falls to the ground, seemingly dead, but it's a ruse. If it is attacked again, or on its next initiative, it regains one point of Health and rises, fueled by instinctive hatred." },
  { min: 2, max: 2, name: 'Wounded', text: 'The Xenomorph staggers, bleeding severely. It gets Speed −1 (down to a minimum of 1, losing the lowest initiative), but regains one point of Health. Roll a D6 at the start of each Round. On 1-3, it tries to escape.' },
  { min: 3, max: 3, name: 'Desperate Action', text: 'The Xenomorph is severely wounded and cries out in alien fury. It immediately gets to perform a fast and a slow action, outside of the normal turn order. Roll a D6: on 1-3 it tries to escape (if it succeeds it regains half its Health); on 4-6 it instantly attacks the closest opponent. If it fails to inflict any damage, the creature dies. If it succeeds, it regains one point of Health.' },
  { min: 4, max: 4, name: 'Last Breath', text: 'The Xenomorph is mortally wounded and contorts wildly. On its next initiative it will try to kill the nearest victim, then the beast dies. If it is wounded again before then, it dies instantly.' },
  { min: 5, max: 6, name: 'Torn Apart', text: 'Instant death. The Xenomorph is torn apart or crushed amidst shrieks of rage. Severely mutilated, it can only be Analyzed with OBSERVATION −2.' },
];

// ─── Facehugger swarm speed ──────────────────────────────────────────────────

const FACEHUGGER_SWARM = [
  { count: '1-2', speed: 2 },
  { count: '3-5', speed: 3 },
  { count: '6-10', speed: 4 },
  { count: '11-20', speed: 5 },
  { count: '21+', speed: 6 },
] as const;

// ─── Custom creature building blocks (original TTBG content) ─────────────────

const BODY_PLANS = [
  { label: 'Humanoid', description: 'Bilateral symmetry with upright stance, unsettlingly familiar in silhouette but wrong in every detail up close.' },
  { label: 'Beast', description: 'Low-slung quadruped built for endurance or sudden short-burst speed across open terrain.' },
  { label: 'Insectoid', description: 'Multi-limbed and segmented, with a chitinous shell that flexes in ways that read as mechanical.' },
  { label: 'Serpentine', description: 'Elongated, limbless or near-limbless; moves by compression and expansion through narrow spaces.' },
  { label: 'Aquatic', description: 'Streamlined for fluid environments. On land it is slower but still dangerous and impossible to fully predict.' },
  { label: 'Formless', description: 'No fixed body plan. Reshapes to fit the immediate environment; edges are always ambiguous.' },
  { label: 'Radial', description: 'Symmetry radiates outward from a central mass. There is no obvious front or back to orient toward.' },
  { label: 'Colonial', description: 'What the crew is seeing is not one organism. Many smaller units act as a coordinated whole.' },
  { label: 'Arboreal', description: 'Built around a canopy or vertical environment; limbs and grips are optimized for overhead travel.' },
  { label: 'Avian', description: 'Hollow-boned and feathered, scaled or membranous, lightweight enough to be airborne for extended periods.' },
] as const;

const LOCOMOTION = [
  { label: 'Walker', description: 'Upright or diagonal ground movement. It leaves tracks.' },
  { label: 'Crawler', description: 'Low to the ground, and traverses ceilings and walls without apparent difficulty.' },
  { label: 'Flyer', description: 'Airborne, approaching from angles ground-level perception does not expect.' },
  { label: 'Swimmer', description: 'Fully or semi-aquatic. Any standing liquid is its domain.' },
  { label: 'Burrower', description: 'Moves through soil, insulation or soft substrate, and approaches from below.' },
  { label: 'Climber', description: 'Uses vertical surfaces freely. Height advantages that seem safe are not.' },
  { label: 'Leaper', description: 'Covers distance in sudden explosive jumps, difficult to track between positions.' },
  { label: 'Phase Shifter', description: 'Moves through materials that should be solid. Mechanism unclear, effect definite.' },
] as const;

const BEHAVIORS = [
  'Territorial: threat displays first, engages if the boundary is crossed again.',
  'Stalking: follows the group without engaging, waiting for isolation.',
  'Pack hunter: holds off alone, signals others before committing.',
  'Opportunistic: attacks injured or separated targets, ignores healthy groups.',
  'Nest guardian: passive until something approaches a specific location.',
  'Curious: approaches cautiously. Aggression is reactive, not initiating.',
  'Frenzied: no hesitation, no retreat. Engages immediately and completely.',
  'Mimic: uses sounds or behavior patterns drawn from earlier victims.',
  'Siege mode: does not pursue. Waits outside a safe zone until driven off or it gets in.',
  'Symbiotic: bound to another local organism or structure. Disturb one, you disturb both.',
] as const;

const CUSTOM_ABILITIES = [
  { name: 'Camouflage', text: 'The creature blends with its environment at rest or in slow movement. OBSERVATION rolls to spot it get −2 dice.' },
  { name: 'Pack Tactics', text: 'It does not hunt alone. A lone sighting is misleading — the others are already in position.' },
  { name: 'Regeneration', text: 'It recovers one point of Health at the start of each of its turns. It does not regenerate from fire or acid damage.' },
  { name: 'Ambush Predator', text: 'It gets a free signature attack in the first round of any encounter if the crew has not actively detected it.' },
  { name: 'Terrifying', text: 'Seeing this creature for the first time forces an immediate panic roll for any PC at Short range, regardless of stress level.' },
  { name: 'Paralyzing Toxin', text: 'A successful attack delivers a fast-acting compound. The target loses one point of Agility per round until treated with a MEDICAL AID roll.' },
  { name: 'Sensory Web', text: 'Vision is irrelevant to this creature. It tracks heat, vibration or chemical signature instead, so darkness gives the crew no advantage.' },
  { name: 'Parasite Host', text: 'It carries a secondary organism — egg, larva or spore. A successful attack may implant it without the target being aware.' },
  { name: 'Structural Damage', text: 'Its attacks are not aimed at people. It targets bulkheads, conduits and equipment, and the environment becomes the weapon.' },
  { name: 'Wall Crawler', text: 'It treats vertical and overhead surfaces the same as the floor. Height is not safety.' },
  { name: 'Hive Mind', text: 'Individual units share awareness. Alerting one alerts every other in the local group at the same moment.' },
  { name: 'Necrotic Wound', text: 'Damage from this creature does not heal naturally. Treatment is required before any recovery roll.' },
  { name: 'Sprint', text: 'If it moves instead of performing a signature attack, it can move an additional zone.' },
] as const;

/** Signature attack templates, filled in with the creature's own dice and damage. */
const CUSTOM_ATTACK_TEMPLATES = [
  { name: 'Threat Display', build: () => 'The creature rears, flares or vocalizes, filling the zone with noise it did not make before. Every PC at Short range gets stress level +1 and must make an immediate panic roll. It does not close this turn.' },
  { name: 'Testing Strike', build: (dice: number) => `It commits to nothing, striking once to see what the crew does. Roll for the attack with ${dice} base dice. If it hits, the target drops a held item and is knocked prone, but takes no damage.` },
  { name: 'Raking Claws', build: (dice: number, dmg: number) => `It opens the target rather than crushing them, striking fast and repeatedly. Roll for the attack with ${dice} base dice, base damage ${dmg}, armor piercing.` },
  { name: 'Crushing Bite', build: (dice: number, dmg: number) => `Jaws or mandibles close on the nearest limb. Roll for the attack with ${dice} base dice, base damage ${dmg}. If it causes damage, the victim makes an immediate panic roll.` },
  { name: 'Lashing Tail', build: (dice: number, dmg: number) => `A whipping strike from a range that felt safe. Roll for the attack with ${dice} base dice, base damage ${dmg}, armor piercing.` },
  { name: 'Corrosive Spray', build: (dice: number, dmg: number) => `It projects a caustic fluid across the zone. Roll for the attack with ${dice} base dice, base damage ${dmg}. Armor has no effect, and any exposed suit or equipment is ruined first.` },
  { name: 'Drag Away', build: (dice: number, dmg: number) => `It seizes a victim and hauls them out of the light. Roll for the attack with ${dice} base dice, base damage ${dmg}. If it hits, it drags the victim into an adjacent zone as a free move. Everyone who sees it makes a panic roll.` },
  { name: 'Pinning Grapple', build: (dice: number) => `It bears the victim down and holds them there. Roll for the attack with ${dice} base dice. If it hits, the victim is grappled and must win an opposed CLOSE COMBAT roll against the creature's MOBILITY to break loose. Unless they break free, the creature's next attack against them hits automatically.` },
  { name: 'Body Slam', build: (dice: number, dmg: number) => `It throws its whole mass forward, clearing the ground in front of it. All targets in the zone suffer an attack of ${dice} base dice, base damage ${dmg}, and are knocked prone.` },
  { name: 'Venom Sting', build: (dice: number) => `A small puncture wound with a systemic effect. Roll for the attack with ${dice} base dice, base damage 1, armor piercing. If it causes damage, the victim makes a STAMINA roll — the number of successes is how many rounds they stay up before falling unconscious for one shift.` },
  { name: 'Snare', build: () => 'Adhesive filament or a coiling limb whips out. The target is entangled and cannot move or use held items until they win an opposed MOBILITY roll against the creature. They must make an immediate panic roll.' },
  { name: 'Killing Blow', build: (dice: number, dmg: number) => `It stops playing. Roll for the attack with ${dice} base dice, base damage ${dmg}, armor piercing. If it causes any damage on a human, the victim is immediately broken and suffers a critical injury.` },
] as const;

type Threat = 'minor' | 'standard' | 'apex';

const THREAT_LABEL: Record<Threat, string> = {
  minor: 'Minor',
  standard: 'Standard',
  apex: 'Apex',
};

// ─── State ───────────────────────────────────────────────────────────────────

type Mode = 'species' | 'custom';

type Statblock = {
  name: string;
  subtitle: string;
  speed: string;
  health: string;
  skills: string | null;
  armor: string;
  acid: string | null;
  abilities: { name: string; text: string }[];
  attacks: readonly AttackRow[] | null;
  attackNote: string | null;
  bodyPlan?: { label: string; description: string };
  locomotion?: { label: string; description: string };
  behavior?: string;
};

// Edition is chosen once in the sidebar and shared by every tool in the suite.
const edition = useEdition();
const mode = ref<Mode>('species');
const speciesChoice = ref('random');
const threat = ref<Threat>('standard');
const creature = ref<Statblock | null>(null);
const attackRoll = ref<{ die: number; row: AttackRow } | null>(null);
const brokenRoll = ref<BrokenRow | null>(null);
const copied = ref(false);

const roster = computed(() => (edition.value === 'evolved' ? SPECIES_EVOLVED : SPECIES_CORE));
const attackTables = computed(() =>
  edition.value === 'evolved' ? ATTACKS_EVOLVED : ATTACKS_CORE
);
const brokenTable = computed(() => (edition.value === 'evolved' ? BROKEN_EVOLVED : BROKEN_CORE));
const armorLabel = computed(() => (edition.value === 'evolved' ? 'Armor Level' : 'Armor Rating'));
const isSpeciesMode = computed(() => mode.value === 'species');

const groupedRoster = computed(() => {
  const groups: Group[] = ['Xenomorph XX121', 'Neomorph', 'Other extra-solar species'];
  return groups.map((group) => ({
    group,
    entries: roster.value.filter((s) => s.group === group),
  }));
});

// ─── Generation ──────────────────────────────────────────────────────────────

function buildSpecies(): Statblock {
  const species =
    speciesChoice.value === 'random'
      ? pick(roster.value)
      : (roster.value.find((s) => s.id === speciesChoice.value) ?? pick(roster.value));
  return {
    name: species.name,
    subtitle: `${species.group} · ${species.stage}`,
    speed: species.speed,
    health: species.health,
    skills: species.skills,
    armor: species.armor,
    acid: species.acid,
    abilities: species.abilities,
    attacks: species.attacks ? attackTables.value[species.attacks]! : null,
    attackNote: species.attackNote ?? null,
  };
}

/**
 * Custom creatures are built on the same chassis the book uses for its own aliens:
 * a Speed rating, Health, skills rolled as base dice only, an armor value, and a
 * D6 table of signature attacks.
 */
function buildCustom(): Statblock {
  const tier = threat.value;
  const speed = tier === 'minor' ? 1 : tier === 'standard' ? 2 : range(2, 3);
  const health = tier === 'minor' ? range(2, 4) : tier === 'standard' ? range(5, 8) : range(9, 15);
  const evolvedArmor = tier === 'minor' ? range(0, 1) : tier === 'standard' ? range(1, 2) : range(2, 4);
  const armorValue = edition.value === 'evolved' ? evolvedArmor : evolvedArmor * 3;
  const mobility = tier === 'minor' ? range(4, 6) : tier === 'standard' ? range(6, 9) : range(9, 12);
  const observation = tier === 'minor' ? range(4, 6) : tier === 'standard' ? range(6, 9) : range(8, 12);
  const dice = tier === 'minor' ? 6 : tier === 'standard' ? 8 : range(10, 12);
  const damage = tier === 'minor' ? 1 : tier === 'standard' ? 2 : range(2, 3);

  // Six distinct attacks, ordered so the table escalates from display to kill.
  const chosen = pickDistinct(CUSTOM_ATTACK_TEMPLATES, 6).sort(
    (a, b) => CUSTOM_ATTACK_TEMPLATES.indexOf(a) - CUSTOM_ATTACK_TEMPLATES.indexOf(b)
  );
  const attacks: AttackRow[] = chosen.map((template, i) => ({
    min: i + 1,
    max: i + 1,
    name: template.name,
    text: template.build(dice, damage),
  }));

  const bodyPlan = pick(BODY_PLANS);
  const locomotion = pick(LOCOMOTION);

  return {
    name: `${bodyPlan.label} ${locomotion.label.toLowerCase()}`,
    subtitle: `Custom creature · ${THREAT_LABEL[tier]} threat`,
    speed: String(speed),
    health: String(health),
    skills: `Mobility ${mobility}, Observation ${observation}`,
    armor: String(armorValue),
    acid: null,
    abilities: pickDistinct(CUSTOM_ABILITIES, tier === 'apex' ? 2 : 1).map((a) => ({ ...a })),
    attacks,
    attackNote: null,
    bodyPlan: { ...bodyPlan },
    locomotion: { ...locomotion },
    behavior: pick(BEHAVIORS),
  };
}

// The editions print different statblocks and attack tables, so stale output would mislead.
watch(edition, () => {
  creature.value = null;
  attackRoll.value = null;
  brokenRoll.value = null;
});

function generate(): void {
  creature.value = isSpeciesMode.value ? buildSpecies() : buildCustom();
  attackRoll.value = null;
  brokenRoll.value = null;
}

function rollAttack(): void {
  const table = creature.value?.attacks;
  if (!table) return;
  const die = d6();
  const row = table.find((r) => die >= r.min && die <= r.max) ?? table[table.length - 1]!;
  attackRoll.value = { die, row };
}

function rollBroken(): void {
  const die = d6();
  brokenRoll.value =
    brokenTable.value.find((r) => die >= r.min && die <= r.max) ??
    brokenTable.value[brokenTable.value.length - 1]!;
}

function clearOutput(): void {
  creature.value = null;
  attackRoll.value = null;
  brokenRoll.value = null;
}

const statblockText = computed(() => {
  const c = creature.value;
  if (!c) return '';
  const lines: string[] = [];
  lines.push(`${c.name.toUpperCase()} — ${c.subtitle}`);
  lines.push(`SPEED: ${c.speed}`);
  lines.push(`HEALTH: ${c.health}`);
  if (c.skills) lines.push(`SKILLS: ${c.skills}`);
  lines.push(`${armorLabel.value.toUpperCase()}: ${c.armor}`);
  if (c.acid) lines.push(`ACID SPLASH: ${c.acid}`);
  c.abilities.forEach((a) => lines.push(`${a.name.toUpperCase()}: ${a.text}`));
  if (c.bodyPlan) lines.push(`BODY PLAN: ${c.bodyPlan.label}. ${c.bodyPlan.description}`);
  if (c.locomotion) lines.push(`LOCOMOTION: ${c.locomotion.label}. ${c.locomotion.description}`);
  if (c.behavior) lines.push(`BEHAVIOR: ${c.behavior}`);
  if (c.attacks) {
    lines.push('');
    lines.push('SIGNATURE ATTACKS (D6)');
    c.attacks.forEach((row) => {
      const label = row.min === row.max ? String(row.min) : `${row.min}-${row.max}`;
      lines.push(`${label}. ${row.name}: ${row.text}`);
    });
  } else if (c.attackNote) {
    lines.push('');
    lines.push(c.attackNote);
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
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="flex flex-col gap-[0.375rem]">
          <label
            for="creature-mode"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Build</label
          >
          <select
            id="creature-mode"
            v-model="mode"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="species">Alien species (book statblock)</option>
            <option value="custom">Custom creature</option>
          </select>
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{
              isSpeciesMode
                ? `Pulls one of the ${roster.length} aliens from the book`
                : 'Builds a new alien on the same chassis'
            }}
          </span>
        </div>

        <div v-if="isSpeciesMode" class="flex flex-col gap-[0.375rem]">
          <label
            for="creature-species"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Species</label
          >
          <select
            id="creature-species"
            v-model="speciesChoice"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="random">Random</option>
            <optgroup v-for="g in groupedRoster" :key="g.group" :label="g.group">
              <option v-for="s in g.entries" :key="s.id" :value="s.id">{{ s.name }}</option>
            </optgroup>
          </select>
        </div>

        <div v-else class="flex flex-col gap-[0.375rem]">
          <label
            for="creature-threat"
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >Threat</label
          >
          <select
            id="creature-threat"
            v-model="threat"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-[0.875rem] py-[0.625rem] font-[inherit] text-base text-[var(--color-text-primary-dark)] transition-[border-color] duration-150 ease-out outline-none focus:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <option value="minor">Minor</option>
            <option value="standard">Standard</option>
            <option value="apex">Apex</option>
          </select>
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >Sets Speed, Health, armor and attack dice</span
          >
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90"
          @click="generate"
        >
          Generate creature
        </button>
        <button
          v-if="creature"
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="copyStatblock"
        >
          {{ copied ? 'Copied' : 'Copy statblock' }}
        </button>
        <button
          v-if="creature"
          type="button"
          class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
          @click="clearOutput"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Result -->
    <div v-if="creature" class="flex flex-col gap-4" aria-live="polite">
      <!-- Statblock -->
      <div
        class="flex flex-col gap-3 rounded-lg border border-[var(--color-brand-primary)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            class="text-lg font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ creature.name }}</span
          >
          <span
            class="text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
            >{{ creature.subtitle }}</span
          >
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            class="flex flex-col gap-1 rounded-md border border-[var(--color-surface-600)] bg-[var(--color-surface-600)] px-3 py-2"
          >
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Speed</span
            >
            <span
              class="text-xl font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{ creature.speed }}</span
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
              >{{ creature.health }}</span
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
              class="text-sm font-bold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
              >{{ creature.armor }}</span
            >
          </div>
          <div
            v-if="creature.acid"
            class="flex flex-col gap-1 rounded-md border border-[var(--color-surface-600)] bg-[var(--color-surface-600)] px-3 py-2"
          >
            <span
              class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
              >Acid Splash</span
            >
            <span
              class="text-xl font-bold text-[var(--color-brand-red-light)]"
              >{{ creature.acid }}</span
            >
          </div>
        </div>

        <p
          v-if="creature.skills"
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Skills</span
          >
          {{ creature.skills }}
        </p>

        <div v-for="ability in creature.abilities" :key="ability.name" class="flex flex-col gap-1">
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-brand-primary)] uppercase"
            >{{ ability.name }}</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ ability.text }}
          </p>
        </div>

        <p
          class="m-0 border-t border-[var(--color-surface-600)] pt-3 text-xs leading-[1.6] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          Skills are rolled as base dice equal to the skill level only, and are never pushed. The
          creature takes one turn per point of Speed each round, drawing one initiative card per
          point.
        </p>
      </div>

      <!-- Custom creature detail -->
      <div
        v-if="creature.bodyPlan"
        class="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] grid-cols-1 gap-4"
      >
        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Body plan · {{ creature.bodyPlan.label }}</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ creature.bodyPlan.description }}
          </p>
        </div>
        <div
          v-if="creature.locomotion"
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Locomotion · {{ creature.locomotion.label }}</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ creature.locomotion.description }}
          </p>
        </div>
        <div
          v-if="creature.behavior"
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Behavior</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ creature.behavior }}
          </p>
        </div>
      </div>

      <!-- Signature attacks -->
      <div
        v-if="creature.attacks"
        class="flex flex-col gap-3 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Signature attacks · D6</span
          >
          <div class="flex items-center gap-2">
            <span
              v-if="attackRoll"
              class="text-sm font-semibold text-[var(--color-brand-primary)]"
              >Rolled {{ attackRoll.die }} · {{ attackRoll.row.name }}</span
            >
            <button
              type="button"
              class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90"
              @click="rollAttack"
            >
              Roll attack
            </button>
          </div>
        </div>
        <div
          v-for="row in creature.attacks"
          :key="row.name"
          class="flex flex-col gap-1 rounded-md border p-3 transition-colors"
          :class="
            attackRoll && attackRoll.row.name === row.name
              ? 'border-[var(--color-brand-primary)] bg-[var(--color-surface-600)]'
              : 'border-transparent'
          "
        >
          <span
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <span
              class="mr-2 inline-flex h-6 min-w-6 items-center justify-center rounded border border-[var(--color-surface-500)] px-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >{{ row.min === row.max ? row.min : `${row.min}-${row.max}` }}</span
            >
            {{ row.name }}
          </span>
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{ row.text }}
          </p>
        </div>
      </div>

      <div
        v-else-if="creature.attackNote"
        class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-4 text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
      >
        <p class="m-0">{{ creature.attackNote }}</p>
      </div>

      <!-- Broken table -->
      <div
        class="flex flex-col gap-3 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >At zero Health · D6</span
          >
          <div class="flex items-center gap-2">
            <span v-if="brokenRoll" class="text-sm font-semibold text-[var(--color-brand-primary)]"
              >{{ brokenRoll.name }}</span
            >
            <button
              type="button"
              class="cursor-pointer rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary-dark)] transition-[border-color] duration-150 hover:border-[var(--color-brand-primary)] [.light_&]:text-[var(--color-text-secondary-light)]"
              @click="rollBroken"
            >
              Roll
            </button>
          </div>
        </div>
        <p
          class="m-0 text-xs leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          A Xenomorph reduced to zero Health is not broken the way a human is. Facehuggers and
          Chestbursters are simply destroyed.
        </p>
        <div
          v-for="row in brokenTable"
          :key="row.name"
          class="flex flex-col gap-1 rounded-md border p-3 transition-colors"
          :class="
            brokenRoll && brokenRoll.name === row.name
              ? 'border-[var(--color-brand-primary)] bg-[var(--color-surface-600)]'
              : 'border-transparent'
          "
        >
          <span
            class="text-sm font-semibold text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            <span
              class="mr-2 inline-flex h-6 min-w-6 items-center justify-center rounded border border-[var(--color-surface-500)] px-1 text-xs text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
              >{{ row.min === row.max ? row.min : `${row.min}-${row.max}` }}</span
            >
            {{ row.name }}
          </span>
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
          >
            {{ row.text }}
          </p>
        </div>
      </div>

      <!-- Facehugger swarm -->
      <div
        v-if="creature.name.includes('Facehugger')"
        class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Facehugger swarms</span
        >
        <p
          class="m-0 text-xs leading-[1.55] text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
        >
          Several Facehuggers in the same zone can share one Speed rating. Each one still has to be
          killed separately.
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="row in FACEHUGGER_SWARM"
            :key="row.count"
            class="rounded-md border border-[var(--color-surface-500)] bg-[var(--color-surface-600)] px-3 py-1 text-xs text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
            >{{ row.count }} → Speed {{ row.speed }}</span
          >
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-6 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <p class="m-0">
        Pull an alien straight from the book with its Speed, Health, skills, armor, acid splash and
        full D6 signature attack table, or build a new creature on the same chassis. Roll its attack
        table at the table, one D6 per strike, the way the rules intend.
      </p>
    </div>
  </div>
</template>
