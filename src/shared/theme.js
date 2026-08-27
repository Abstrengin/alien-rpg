/**
 * Shared theme helpers.
 *
 * The app is dark by default. Light mode adds the `light` class to <html>
 * (which drives both Tailwind's `dark:`/absence and the ported tool
 * components' own `.light &` selectors) and removes `dark`.
 */

export function isElectron() {
  const hasElectronAPI =
    typeof window !== "undefined" && window.electron?.isElectron === true;
  const hasElectronProcess =
    typeof process !== "undefined" && process.versions?.electron;
  return Boolean(hasElectronAPI || hasElectronProcess);
}

export function applyThemeClass(mode) {
  const html = document.documentElement;
  if (mode === "light") {
    html.classList.add("light");
    html.classList.remove("dark");
  } else {
    html.classList.add("dark");
    html.classList.remove("light");
  }
  const bg = mode === "light" ? "#ffffff" : "#030712";
  document.documentElement.style.backgroundColor = bg;
  document.body.style.backgroundColor = bg;
}

export function currentThemeMode() {
  return localStorage.getItem("theme-preference") === "light" ? "light" : "dark";
}

export function initTheme() {
  const saved = localStorage.getItem("theme-preference");
  const mode = saved === "light" ? "light" : "dark";
  if (!saved) localStorage.setItem("theme-preference", "dark");
  applyThemeClass(mode);
  return mode;
}
