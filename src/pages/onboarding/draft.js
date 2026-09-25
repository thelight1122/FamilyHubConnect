// The onboarding wizard's answers, kept in this browser until setup finishes.
// Each step reads the draft, adds its part and saves it again.
export const ONBOARDING_FAMILY_DRAFT_KEY = 'fhc:onboarding-family-draft';

export function readDraft() {
  try {
    return JSON.parse(localStorage.getItem(ONBOARDING_FAMILY_DRAFT_KEY) ?? 'null');
  } catch {
    return null;
  }
}

export function saveDraft(patch) {
  const next = { ...(readDraft() ?? {}), ...patch };
  try {
    localStorage.setItem(ONBOARDING_FAMILY_DRAFT_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode); the wizard still works in memory.
  }
  return next;
}

export function clearDraft() {
  try {
    localStorage.removeItem(ONBOARDING_FAMILY_DRAFT_KEY);
  } catch {
    // Nothing to clear.
  }
}
