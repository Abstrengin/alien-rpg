<template>
  <div
    id="footer"
    class="mt-4"
  >
    <div class="flex flex-wrap">
      <div class="flex-1">
        <div class="flex-1">
          <button
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full"
            @click="showModalFooter1 = true"
          >
            APP INFO
          </button>
          <Modal
            v-model:model-value="showModalFooter1"
            title="APP INFO"
          >
            <p>App Version: 1.0 Beta</p>
            <p>Alien RPG Core Rulebook Version: 1.0</p>
            <p class="mb-0">
              Please report bugs or feature requests
              <a
                href="https://www.tiesthatbindgaming.com/contact/"
                target="_blank"
              >here</a>.
            </p>
            <hr>
            <p class="mb-0">
              Copyright &copy; {{ currentYear }} Ties That Bind Gaming
            </p>
            <template #footer>
              <button
                class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
                @click="showModalFooter1 = false"
              >
                Close
              </button>
            </template>
          </Modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Modal from "./services/Modal.vue";
const showModalFooter1 = ref(false);

const currentYear = computed(() => new Date().getFullYear());
</script>
