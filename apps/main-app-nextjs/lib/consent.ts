/**
 * Analytics consent. Stored in localStorage only, under the same key the
 * SvelteKit app uses, so a visitor's choice survives the cutover.
 *
 * Umami and CallSafe are not gated by this. GA and PostHog are.
 */
export const CONSENT_KEY = 'analytics_consent';

export type ConsentValue = 'accepted' | 'declined';

/** The stored choice, or null if the visitor has not chosen yet. */
export function getConsent(): ConsentValue | null {
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === 'accepted' || value === 'declined' ? value : null;
}

export function setConsent(value: ConsentValue): void {
  window.localStorage.setItem(CONSENT_KEY, value);
}
