// src/routes/(layout-1)/about-us/+page.server.js

import type { PageServerLoad } from './$types';
export const config = {
	isr: {
		expiration: 60 * 60 * 24 * 7 // 7 days in seconds (604800 seconds)
	}
} as const;

export const load: PageServerLoad = async () => {
	// This page is mostly static content (about us information)
	// ISR will cache the static content for performance
	return {
		// Return empty object since the page is static
		// with no server-side data requirements
	};
}