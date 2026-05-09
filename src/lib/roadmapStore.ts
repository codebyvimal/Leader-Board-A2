import { Section } from "@/lib/data";

const ROADMAP_KEY = "ascend:roadmap:v1";

export function loadRoadmapFromStorage(): Section[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ROADMAP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as Section[];
  } catch {
    return null;
  }
}

export function saveRoadmapToStorage(sections: Section[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ROADMAP_KEY, JSON.stringify(sections));
  } catch {
    // ignore
  }
}

export function clearRoadmapStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ROADMAP_KEY);
  } catch {
    // ignore
  }
}

