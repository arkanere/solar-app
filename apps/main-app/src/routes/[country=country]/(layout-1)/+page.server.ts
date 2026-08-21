import type { PageServerLoad } from './$types';

export const config = {
	isr: {
		expiration: 1296000
	}
};

// The home is one static, country-less page (see +page.svelte), so there is
// nothing to load. This used to query `projects` for the recent-projects grid
// behind a `features.projects` gate; both went with that section on 2026-08-22.
// The loader stays only to carry the ISR config above.
export const load: PageServerLoad = async () => {
	return {};
};
