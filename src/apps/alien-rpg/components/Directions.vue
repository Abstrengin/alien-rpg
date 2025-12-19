<template>
  <div
    id="ae-directions"
    class="mb-4"
  >
    <div class="flex flex-wrap gap-3">
      <div class="w-full lg:mb-0">
        <button
          class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
          @click="showModalDir1 = true"
        >
          DIRECTIONS
        </button>
        <Modal
          v-model:model-value="showModalDir1"
          title="DIRECTIONS"
        >
          <p class="mb-3">
            Use the <strong>Alien RPG Star System Generator</strong> to quickly
            generate a star system, planet, or colony. You can get an initial
            roll by selecting an option from the dropdown. After the first
            selection, a button will appear and allow you to regenerate.
          </p>
          <p class="mb-3">
            Star Systems and Planets can be generated on their own. They do not
            require any modifiers outside of their ecosystem.
          </p>
          <p>
            Colonies require a planet in order to generate them. The colony
            generator has modifiers based on the planet that is generated. You
            must select a planet before you can generate a colony.
          </p>
          <p class="mb-3">
            You should have the core rulebook available. There are scenarios
            that require you to roll for additional hooks. For example, you can
            generate a colony size with this tool but you will need to roll dice
            to determine the population. You may generate a Start-Up with this
            tool but you need to roll 3D6 x 10 to get the population. I may
            include the ability to make the roll from the generator in the
            future.
          </p>
          <p class="mb-3">
            All modifiers are in place and calculate based on the rules in the
            core rulebook. Once you generate a entity, you are done. You do not
            need to make any adjustments.
          </p>
          <p class="mb-0">
            See p.330 in Core Rulebook for more info.
          </p>
          <template #footer>
            <button
              class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
              @click="showModalDir1 = false"
            >
              Close
            </button>
          </template>
        </Modal>
      </div>
      <div class="w-full">
        <button
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
          @click="$emit('resetGenerator')"
        >
          RESET GENERATOR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import Modal from "@/shared/components/Modal.vue";
const showModalDir1 = ref(false);

// Reset Generator
defineEmits(["resetGenerator"]);
</script>
