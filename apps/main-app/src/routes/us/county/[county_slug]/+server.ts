// 301 shim for legacy US county URLs: /us/county/orange-ca (or bare
// /us/county/orange) -> /us/solar/{state}/{county}. Suffixed slugs resolve
// via the abbreviation map; suffix-less legacy slugs fall back to a
// geo_locations lookup.
import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getStateName } from '$lib/countries/us-states';
import { findLevel1ForLevel2, resolveLevel2 } from '$lib/server/geo';
import { toSlug } from '$lib/countries/urls';

export const GET: RequestHandler = async ({ params }) => {
	const countySlug = (params.county_slug ?? '').toLowerCase();
	if (!countySlug) error(404, 'Invalid county URL');

	const lastHyphenIndex = countySlug.lastIndexOf('-');
	if (lastHyphenIndex !== -1 && countySlug.length - lastHyphenIndex - 1 <= 2) {
		const countyPart = countySlug.substring(0, lastHyphenIndex);
		const stateName = getStateName(countySlug.substring(lastHyphenIndex + 1));
		if (stateName) {
			const resolved = await resolveLevel2('us', toSlug(stateName), countyPart);
			if (resolved) {
				redirect(301, `/us/solar/${resolved.level1Slug}/${resolved.level2Slug}`);
			}
		}
	}

	// No (valid) state suffix — locate the county by slug alone.
	const fallback = await findLevel1ForLevel2('us', countySlug);
	if (fallback) {
		redirect(301, `/us/solar/${fallback.level1Slug}/${fallback.level2Slug}`);
	}

	error(404, 'County not found');
};
