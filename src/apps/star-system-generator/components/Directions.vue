<template>
  <div
    id="ae-directions"
    class="space-y-2"
  >
    <button
      class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full font-semibold"
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
        generate a star system, planet, or colony. You can get an initial roll
        by selecting an option from the dropdown. After the first selection, a
        button will appear and allow you to regenerate.
      </p>
      <p class="mb-3">
        Star Systems and Planets can be generated on their own. They do not
        require any modifiers outside of their ecosystem.
      </p>
      <p>
        Colonies require a planet in order to generate them. The colony
        generator has modifiers based on the planet that is generated. You must
        select a planet before you can generate a colony.
      </p>
      <p class="mb-3">
        You should have the core rulebook available. There are scenarios that
        require you to roll for additional hooks. For example, you can generate
        a colony size with this tool but you will need to roll dice to determine
        the population. You may generate a Start-Up with this tool but you need
        to roll 3D6 x 10 to get the population. I may include the ability to
        make the roll from the generator in the future.
      </p>
      <p class="mb-3">
        All modifiers are in place and calculate based on the rules in the core
        rulebook. Once you generate a entity, you are done. You do not need to
        make any adjustments.
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
    <button
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold"
      @click="showModalAppInfo = true"
    >
      APP INFO
    </button>
    <Modal
      v-model:model-value="showModalAppInfo"
      title="ABOUT THIS TOOL"
    >
      <p class="mb-3">
        <strong>Alien RPG Star System Generator</strong> is part of the Alien
        RPG Tools suite provided by
        <a
          href="https://www.tiesthatbindgaming.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Ties That Bind Gaming
        </a>
        .
      </p>
      <p class="mb-3">
        This tool helps you quickly generate complete star systems, planets, and
        colonies for use in your Alien RPG campaigns. All generation follows the
        rules and tables from the Alien RPG Core Rulebook.
      </p>
      <p class="mb-3">
        <strong>Version:</strong> 1.0.0
      </p>
      <p class="mb-0">
        For more tools and resources, visit
        <a
          href="https://www.tiesthatbindgaming.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Ties That Bind Gaming
        </a>
        .
      </p>
      <template #footer>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          @click="showModalAppInfo = false"
        >
          Close
        </button>
      </template>
    </Modal>
    <button
      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full font-semibold"
      @click="$emit('resetGenerator')"
    >
      RESET
    </button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import Modal from "@/shared/components/Modal.vue";
const showModalDir1 = ref(false);
const showModalAppInfo = ref(false);

// Reset Generator
defineEmits(["resetGenerator"]);
</script>
