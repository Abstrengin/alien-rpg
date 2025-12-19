// MyModal.vue
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 overflow-auto bg-black/50"
      tabindex="-1"
      @click.self="closeModal"
    >
      <div
        class="relative w-auto mx-auto my-auto max-w-2xl"
        :style="{ maxWidth: width }"
      >
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <div
            class="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center"
          >
            <h5 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h5>
            <button
              type="button"
              class="bg-transparent border-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none cursor-pointer"
              aria-label="Close"
              @click="closeModal"
            >
              ×
            </button>
          </div>
          <div class="px-6 py-4 text-gray-900 dark:text-gray-100">
            <slot />
          </div>
          <div
            v-if="$slots.footer"
            class="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-2"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isOpen"
      class="fixed inset-0 z-30 bg-black/50"
    />
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: "Modal Title",
  },
  width: {
    type: String,
    default: "500px",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue;
  }
);

watch(isOpen, (newValue) => {
  emit("update:modelValue", newValue);
  if (newValue) {
    document.body.classList.add("modal-open");
  } else {
    document.body.classList.remove("modal-open");
  }
});

const closeModal = () => {
  emit("update:modelValue", false);
};

onUnmounted(() => {
  document.body.classList.remove("modal-open");
});
</script>
