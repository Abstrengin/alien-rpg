/**
 * App-wide edition setting.
 *
 * Every tool that prints edition-specific tables reads this one ref, so the
 * choice is made once in the sidebar and every generator follows it. The value
 * is a module-level ref rather than a per-component one, which is what makes it
 * shared, and it is mirrored to localStorage so it survives a restart.
 */
import { ref, watch } from "vue";

export type Edition = "core" | "evolved";

const STORAGE_KEY = "alien-rpg-edition";

function readStored(): Edition {
  try {
    return localStorage.getItem(STORAGE_KEY) === "core" ? "core" : "evolved";
  } catch {
    // Private-mode browsers can throw on storage access; fall back to default.
    return "evolved";
  }
}

const edition = ref<Edition>(readStored());

watch(edition, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Persistence is a convenience, not a requirement.
  }
});

export function useEdition() {
  return edition;
}

export const EDITION_LABELS: Record<Edition, string> = {
  evolved: "Evolved Edition",
  core: "Core Rulebook (1st ed.)",
};
