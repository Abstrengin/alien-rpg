import { ref, onMounted } from "vue";

export function useUpdater() {
  const updateAvailable = ref(false);
  const updateProgress = ref(0);
  const isElectron = ref(false);

  onMounted(() => {
    isElectron.value =
      typeof window !== "undefined" && window.electron?.isElectron === true;

    if (!isElectron.value) {
      return;
    }

    if (window.electron?.on) {
      window.electron.on("update-available", () => {
        updateAvailable.value = true;
      });

      window.electron.on("update-progress", (progress) => {
        updateProgress.value = progress;
      });

      window.electron.on("update-downloaded", () => {
        updateAvailable.value = false;
      });
    }
  });

  const installUpdate = () => {
    if (window.electron?.installUpdate) {
      window.electron.installUpdate();
    }
  };

  return {
    isElectron,
    updateAvailable,
    updateProgress,
    installUpdate,
  };
}
