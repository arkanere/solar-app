import type { PostHog } from 'posthog-js';
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';
import { hasAnalyticsConsent } from '$lib/consent';

// posthog-js (~195KB) is dynamically imported so it splits into its own chunk
// and never lands in the layout's hydration bundle — keeping the main thread
// free during initial load. It is fetched lazily when initPosthog() runs.
let posthog: PostHog | null = null;
let initialized = false;

export async function initPosthog() {
	if (initialized || typeof window === 'undefined') return;

	// Hard gate: never initialise PostHog without explicit analytics consent.
	if (!hasAnalyticsConsent()) return;

	posthog = (await import('posthog-js')).default;
	posthog.init(PUBLIC_POSTHOG_KEY, {
		api_host: 'https://us.i.posthog.com',
		capture_pageview: false, // manual — handled via afterNavigate
		capture_pageleave: true,
		session_recording: {
			maskAllInputs: false,
			maskInputOptions: { password: true }
		},
		autocapture: true,
		person_profiles: 'identified_only',
		// Bot filtering
		bootstrap: {}
	});

	initialized = true;
}

export function capturePageview(url: string) {
	if (!initialized || !posthog || typeof window === 'undefined') return;
	posthog.capture('$pageview', { $current_url: url });
}

export function capture(event: string, properties?: Record<string, unknown>) {
	if (!initialized || !posthog || typeof window === 'undefined') return;
	posthog.capture(event, properties);
}
