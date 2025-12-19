<template>
  <div
    class="export-controls flex flex-wrap justify-between items-center gap-4"
  >
    <!-- Title/Link -->
    <div class="text-gray-600 dark:text-gray-400 hidden sm:block">
      <a
        href="https://www.tiesthatbindgaming.com"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
      >
        Alien RPG Tools
      </a>
    </div>

    <!-- Right side controls -->
    <div class="flex flex-wrap gap-2 items-center">
      <!-- Export buttons -->
      <div v-if="hasData" class="flex flex-wrap gap-2">
        <button
          class="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
          :disabled="isCopying"
          @click="handleCopy"
        >
          {{ copySuccess ? "Copied!" : "Copy" }}
        </button>
        <button
          class="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
          @click="handleDownloadJSON"
        >
          JSON
        </button>
        <button
          class="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
          @click="handleDownloadText"
        >
          Text
        </button>
        <button
          class="px-3 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
          @click="handlePrint"
        >
          Print
        </button>
      </div>

      <!-- Dark mode toggle -->
      <button
        class="px-4 py-2.5 text-sm bg-gray-400 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded transition-colors"
        @click="toggleDarkMode"
      >
        {{ isDarkMode ? "🌙" : "☀️" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useExport } from "@/shared/composables/useExport";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const isDarkMode = ref(true);

const {
  isCopying,
  copySuccess,
  copyToClipboard,
  downloadAsJSON,
  downloadAsText,
  formatForPrint,
} = useExport();

const hasData = computed(() => {
  return Object.keys(props.data).length > 0;
});

onMounted(() => {
  const savedTheme = localStorage.getItem("theme-preference");
  isDarkMode.value = savedTheme !== "light";
});

const toggleDarkMode = () => {
  const html = document.documentElement;
  isDarkMode.value = !isDarkMode.value;

  if (isDarkMode.value) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  const backgroundColor = isDarkMode.value ? "#030712" : "#ffffff";
  document.documentElement.style.backgroundColor = backgroundColor;
  document.body.style.backgroundColor = backgroundColor;

  localStorage.setItem("theme-preference", isDarkMode.value ? "dark" : "light");
};

const formatDataAsText = (data) => {
  let text = "=== ALIEN RPG TOOLS ===\n\n";
  text += `Generated: ${new Date().toLocaleString()}\n`;
  return text + JSON.stringify(data, null, 2);
};

const handleCopy = async () => {
  const text = formatDataAsText(props.data);
  await copyToClipboard(text);
};

const handleDownloadJSON = () => {
  const filename = `data-${Date.now()}.json`;
  downloadAsJSON(props.data, filename);
};

const handleDownloadText = () => {
  const text = formatDataAsText(props.data);
  const filename = `data-${Date.now()}.txt`;
  downloadAsText(text, filename);
};

const handlePrint = () => {
  formatForPrint();
};
</script>
