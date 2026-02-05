// src/routes/(layout-1)/solar-panel-installer-directory/+page.server.js

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// This page doesn't need server-side data loading
	return {
		// Return empty object since the page is mostly static
		// with client-side data fetching
	};
}
