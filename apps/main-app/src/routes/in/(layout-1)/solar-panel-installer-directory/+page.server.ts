// src/routes/(layout-1)/solar-panel-installer-directory/+page.server.js

import type { PageServerLoad } from './$types';
export const config = {
	isr: {
		expiration: 60 * 60 * 24 * 7 // 7 days in seconds (604800 seconds)
	}
};

export const load: PageServerLoad = async () => {
	// This page doesn't need server-side data loading
	// but ISR will cache the static content for performance
	return {
		// Return empty object since the page is mostly static
		// with client-side data fetching
		user: null
	};
}