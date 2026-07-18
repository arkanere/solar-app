// Unified replacement for /in/api/getDistricts and /us/api/getCounties:
// returns the level2 areas (districts/counties) for a state.
import { json, type RequestHandler } from '@sveltejs/kit';
import { getCountry, isCountry } from '$lib/countries';
import { getLevel2sForLevel1 } from '$lib/server/geo';
import { toSlug } from '$lib/countries/urls';

export const GET: RequestHandler = async ({ params, url }) => {
	if (!params.country || !isCountry(params.country)) {
		return json({ error: 'Unknown country' }, { status: 404 });
	}
	const country = getCountry(params.country);

	const state = url.searchParams.get('state');
	if (!state) {
		return json({ error: 'state query parameter is required' }, { status: 400 });
	}

	const level2s = await getLevel2sForLevel1(country.code, toSlug(state));
	return json({
		level2s: level2s.map((l) => ({ name: l.level2, slug: l.level2Slug }))
	});
};
