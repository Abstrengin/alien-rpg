<script setup lang="ts">
/**
 * AlienRPGContractCargo.vue
 * Original freight-contract prompts for space-trucker style ALIEN RPG prep.
 * Not copied from published tables; adjust payouts and terms at your table.
 */
import { ref } from 'vue';

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

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

const CARGO_CLASSES = [
  'Pressurized bulk ore, moisture readings must stay inside a narrow band or the lot is voided.',
  'Refrigerated organics labeled priority; temperature logs must upload hourly to an audit bot.',
  'Sealed witness crates, chain-of-custody biometrics, no mid-route opens without a notarized remote.',
  'Dormant server racks, vibration-sensitive, insured only if mounted on factory-original gel feet.',
  'Live aquaculture pods, oxygen draw spikes expected; crew told not to ask about the hum.',
  'Certified "empty" return containers that rattle; manifest insists negative mass is a rounding error.',
  'Hazard-marked solvents in triple-walled drums; paperwork lists three mutually exclusive UN analogues.',
  'Luxury habitat modules for executives who want windows facing the wrong side of the orbit.',
  'Archival film spools, light-sensitive, humidity alarms tied to a payout clawback you did not notice.',
  'Industrial printers and feedstock; end user is listed as "TBD colony, provisional government."',
  'Cryo-stasis passengers listed as "high-value biological assets" with no further elaboration.',
  'Satellite repair pallets; includes a crate marked "spares" that is welded shut from the inside.',
  'Terraforming catalyst, granular, static-prone; grounding straps required in every hold.',
  'Judicial evidence bins, one-time codes, delivery only to a rotating drop coordinate.',
  'Heavy machinery for a construction site that does not officially exist on any chart yet.',
  'Pharmaceutical cold chain, redundant backups, and a rider about "ambient moral hazard."',
  'Art pieces for a private collector; shock sensors armed, insurance void if you use grav assist.',
  'Water reclamation skids for a station that already reported surplus last quarter.',
  'Radioisotope markers for survey beacons; shielding checks at every jump, no exceptions.',
  'Bulk textiles stamped "humanitarian aid" with a customs flag that only clears at one port.',
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
  'Sleep shift logs must match MU-style timestamps or the entire run is classified as "non-compliant transit."',
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

const PAYOUT_BANDS = [
  'Barebones stipend tier: covers fuel if nothing breaks; hazard line items are "aspirational."',
  'Standard freight band: respectable if you hit every window; one slip erases the performance kicker.',
  'Premium bracket on paper, but half is tied to a discretionary "corporate citizenship" score.',
  'Flat fee that looked generous until you noticed it is in pre-inflation colonial scrip.',
  'High headline rate with a long clawback list; net is middling unless you are very lucky.',
  'Union-scale pay package if you are credentialed; otherwise you get contractor crumbs and a hat.',
  'Two-tier: cash now small, "success shares" later that vest only if the colony hits population targets.',
  'Hazard multiplier applies only if you file before docking and after the scary part is already over.',
  'Generous daily rate while underway, zero lay days covered, demurrage eats you alive at destination.',
  'Black-market cash, no receipts, no insurance, and a friendly warning about asking questions.',
  'Science grant funding: slow reimbursement, picky receipts, but legitimate if you love paperwork.',
  'Military chit: good for parts and priority refuel, weak on actual credits in civilian ports.',
] as const;

type ContractBundle = {
  employerTone: string;
  cargoClass: string;
  deadline: string;
  finePrint: string;
  payout: string | null;
};

const bundle = ref<ContractBundle | null>(null);
const includePayout = ref(true);

function generate(): void {
  bundle.value = {
    employerTone: pick(EMPLOYER_TONES),
    cargoClass: pick(CARGO_CLASSES),
    deadline: pick(DEADLINE_PRESSURES),
    finePrint: pick(FINE_PRINT),
    payout: includePayout.value ? pick(PAYOUT_BANDS) : null,
  };
}

function clearOutput(): void {
  bundle.value = null;
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <button
        type="button"
        class="cursor-pointer rounded-md border border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-900)] transition-opacity hover:opacity-90"
        @click="generate"
      >
        Generate contract
      </button>
      <label
        class="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
      >
        <input
          v-model="includePayout"
          type="checkbox"
          class="h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
        />
        Include payout band
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

    <div v-if="bundle" class="flex flex-col gap-4" aria-live="polite">
      <!-- Auto-fill works for four equal cards; payout is separate so we never mix col-span with auto-fill. -->
      <div
        class="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] grid-cols-1 gap-4"
      >
        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Employer tone</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ bundle.employerTone }}
          </p>
        </div>
        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Cargo class</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ bundle.cargoClass }}
          </p>
        </div>
        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Deadline pressure</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ bundle.deadline }}
          </p>
        </div>
        <div
          class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
        >
          <span
            class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
            >Fine print</span
          >
          <p
            class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
          >
            {{ bundle.finePrint }}
          </p>
        </div>
      </div>
      <div
        v-if="bundle.payout"
        class="flex flex-col gap-2 rounded-lg border border-[var(--color-surface-600)] bg-[var(--color-surface-700)] p-4"
      >
        <span
          class="text-xs font-semibold tracking-[0.06em] text-[var(--color-text-secondary-dark)] uppercase [.light_&]:text-[var(--color-text-secondary-light)]"
          >Payout band</span
        >
        <p
          class="m-0 text-sm leading-[1.55] text-[var(--color-text-primary-dark)] [.light_&]:text-[var(--color-text-primary-light)]"
        >
          {{ bundle.payout }}
        </p>
      </div>
    </div>

    <div
      v-else
      class="rounded-lg border border-dashed border-[var(--color-surface-500)] bg-[var(--color-surface-700)] p-6 text-center text-sm text-[var(--color-text-secondary-dark)] [.light_&]:text-[var(--color-text-secondary-light)]"
    >
      <p class="m-0">
        Roll a freight hook: employer voice, cargo type, deadline squeeze, contract nasties, and
        optional pay band. Pair it with a destination from your
        <a
          href="/tabletop-rpg/alien-rpg/alien-rpg-star-system-generator/"
          class="font-semibold text-[var(--color-brand-primary)] no-underline hover:underline"
          >Star System Generator</a
        >, then run numbers in the
        <a
          href="/tabletop-rpg/alien-rpg/alien-rpg-space-travel-tool/"
          class="font-semibold text-[var(--color-brand-primary)] no-underline hover:underline"
          >Space Travel Tool</a
        >.
      </p>
    </div>
  </div>
</template>
