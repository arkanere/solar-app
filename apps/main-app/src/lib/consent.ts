// Cookie / analytics consent (PII compliance plan, item 1).
//
// Choice is persisted in localStorage only — no DB row is kept for analytics
// consent at the current scale. Analytics scripts (PostHog, Hotjar, GA, Twitter,
// Facebook) must not fire until the visitor has explicitly accepted.

export const CONSENT_KEY = 'analytics_consent';

export type ConsentValue = 'accepted' | 'declined';

/** Returns the stored choice, or null if the visitor has not chosen yet. */
export function getConsent(): ConsentValue | null {
	if (typeof window === 'undefined') return null;
	const value = window.localStorage.getItem(CONSENT_KEY);
	return value === 'accepted' || value === 'declined' ? value : null;
}

export function setConsent(value: ConsentValue): void {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(CONSENT_KEY, value);
}

/** True only when the visitor has actively accepted analytics. */
export function hasAnalyticsConsent(): boolean {
	return getConsent() === 'accepted';
}
