import { ref } from "vue";

export function useExport() {
  const isCopying = ref(false);
  const copySuccess = ref(false);

  const copyToClipboard = async (text) => {
    try {
      isCopying.value = true;
      await navigator.clipboard.writeText(text);
      copySuccess.value = true;
      setTimeout(() => {
        copySuccess.value = false;
      }, 2000);
      return true;
    } catch (err) {
      console.error("Failed to copy:", err);
      return false;
    } finally {
      isCopying.value = false;
    }
  };

  const downloadAsJSON = (data, filename = "data.json") => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAsText = (text, filename = "data.txt") => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatForPrint = () => {
    window.print();
  };

  return {
    isCopying,
    copySuccess,
    copyToClipboard,
    downloadAsJSON,
    downloadAsText,
    formatForPrint,
  };
}
