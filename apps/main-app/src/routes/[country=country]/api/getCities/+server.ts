// Unified city lookup for a level2 area (district/county) within a state.
import { json, type RequestHandler } from '@sveltejs/kit';
import { getCountry, isCountry } from '$lib/countries';
import { getCitiesForLevel2 } from '$lib/server/geo';
import { toSlug } from '$lib/countries/urls';

export const GET: RequestHandler = async ({ params, url }) => {
	if (!params.country || !isCountry(params.country)) {
		return json({ error: 'Unknown country' }, { status: 404 });
	}
	const country = getCountry(params.country);

	const state = url.searchParams.get('state');
	const level2 = url.searchParams.get('level2') ?? url.searchParams.get('district') ?? url.searchParams.get('county');
	if (!state || !level2) {
		return json({ error: 'state and level2 query parameters are required' }, { status: 400 });
	}

	const cities = await getCitiesForLevel2(country.code, toSlug(state), toSlug(level2));
	return json({
		cities: cities.map((c) => ({ name: c.city, slug: c.citySlug }))
	});
};
