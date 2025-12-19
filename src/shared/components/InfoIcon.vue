<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="currentColor"
    class="inline-block text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors duration-200"
    viewBox="0 0 16 16"
    tabindex="0"
    role="button"
    :aria-label="ariaLabel"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <path
      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
    />
    <path
      d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
    />
  </svg>
</template>

<script setup>
defineProps({
  ariaLabel: {
    type: String,
    default: "Show information",
  },
});

defineEmits(["click"]);
</script>
