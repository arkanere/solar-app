import posthog from 'posthog-js';
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';

let initialized = false;

export function initPosthog() {
	if (initialized || typeof window === 'undefined') return;

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
	if (!initialized || typeof window === 'undefined') return;
	posthog.capture('$pageview', { $current_url: url });
}

export function capture(event: string, properties?: Record<string, unknown>) {
	if (!initialized || typeof window === 'undefined') return;
	posthog.capture(event, properties);
}
