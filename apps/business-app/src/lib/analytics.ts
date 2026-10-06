/**
 * PostHog. Client-only. Ported from main-app-nextjs/lib/analytics.ts, without
 * the consent gate — the business app covers tracking in its policy document.
 *
 * posthog-js is ~195KB, so it is a dynamic import: no first paint pays for it.
 */
import type { PostHog } from 'posthog-js';
import { env } from '$env/dynamic/public';

let posthog: PostHog | null = null;
let loaded = false;

export function loadAnalytics() {
	if (loaded) return;
	loaded = true;
	void loadPosthog();
}

/** A PostHog custom event. A no-op until PostHog has loaded. */
export function capture(event: string, properties?: Record<string, unknown>) {
	posthog?.capture(event, properties);
}

/** PostHog pageview. A no-op until PostHog has loaded. */
export function capturePageview() {
	posthog?.capture('$pageview', { $current_url: window.location.href });
}

async function loadPosthog() {
	const key = env.PUBLIC_POSTHOG_KEY;
	if (!key) return;
	const ph = (await import('posthog-js')).default;
	ph.init(key, {
		api_host: 'https://us.i.posthog.com',
		capture_pageview: false, // manual — the root layout sends one per navigation
		capture_pageleave: true,
		session_recording: {
			maskAllInputs: false,
			maskInputOptions: { password: true }
		},
		autocapture: true,
		person_profiles: 'identified_only'
	});
	posthog = ph;
	capturePageview();
}
