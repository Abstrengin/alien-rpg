<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      @click.self="$emit('update:modelValue', false)"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h2>
        </div>
        <div
          class="px-6 py-4 text-gray-700 dark:text-gray-300 max-h-96 overflow-y-auto"
        >
          <slot />
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <slot name="footer">
            <button
              class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded w-full"
              @click="$emit('update:modelValue', false)"
            >
              Close
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Modal",
  },
});

defineEmits(["update:modelValue"]);
</script>
