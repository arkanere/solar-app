import { abbrToState } from '$lib/us/stateAbbreviations.js';

// Enable prerendering for this page
export const prerender = true;

// Generate entries for all state pages
export function entries() {
	// Get all state names from the abbrToState mapping
	const states = Object.values(abbrToState);

	// Generate state_slug for each state (lowercase with hyphens)
	return states.map((state) => ({
		state_slug: `solar-panel-installers-in-${state.toLowerCase().replace(/\s+/g, '-')}`
	}));
}
