// src/routes/(layout-1)/terms-of-use/+page.server.js

export const config = {
	isr: {
		expiration: 60 * 60 * 24 * 7 // 7 days in seconds (604800 seconds)
	}
};

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// This page is static legal content (terms of use)
	// ISR will cache the static content for performance
	return {
		// Return empty object since the page is static
		// with no server-side data requirements
	};
}