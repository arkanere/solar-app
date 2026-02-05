// src/routes/(layout-1)/about-us/+page.server.js

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// This page is mostly static content (about us information)
	return {
		// Return empty object since the page is static
		// with no server-side data requirements
	};
}
