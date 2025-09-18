// src/routes/(layout-1)/data-deletion/+page.server.js

export const config = {
	isr: {
		expiration: 60 * 60 * 24 * 7 // 7 days in seconds (604800 seconds)
	}
};

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// This page is static legal content (data deletion policy)
	// ISR will cache the static content for performance
	return {
		// Return empty object since the page is static
		// with no server-side data requirements
	};
}