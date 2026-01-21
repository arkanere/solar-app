// src/routes/(layout-1)/data-deletion/+page.server.js

import type { PageServerLoad } from './$types';
export const config = {
	isr: {
		expiration: 60 * 60 * 24 * 7 // 7 days in seconds (604800 seconds)
	}
};

export const load: PageServerLoad = async () => {
	// This page is static legal content (data deletion policy)
	// ISR will cache the static content for performance
	return {
		user: null
	};
}