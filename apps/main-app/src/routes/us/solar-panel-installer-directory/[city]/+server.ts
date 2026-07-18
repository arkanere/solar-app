// 301 shim for legacy US city directory URLs: /us/solar-panel-installer-
// directory/anaheim-ca (or bare city slug) -> /us/solar/{state}/{county}/{city}.
// Needs a geo_locations lookup because the old URL never carried the county.
import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getStateName } from '$lib/countries/us-states';
import { findCity } from '$lib/server/geo';
import { toSlug } from '$lib/countries/urls';

export const GET: RequestHandler = async ({ params }) => {
	const cityParam = (params.city ?? '').toLowerCase();
	if (!cityParam) error(404, 'Invalid city URL');

	const lastHyphenIndex = cityParam.lastIndexOf('-');
	if (lastHyphenIndex !== -1 && cityParam.length - lastHyphenIndex - 1 <= 2) {
		const cityPart = cityParam.substring(0, lastHyphenIndex);
		const stateName = getStateName(cityParam.substring(lastHyphenIndex + 1));
		if (stateName) {
			const resolved = await findCity('us', cityPart, toSlug(stateName));
			if (resolved) {
				redirect(
					301,
					`/us/solar/${resolved.level1Slug}/${resolved.level2Slug}/${resolved.citySlug}`
				);
			}
		}
	}

	// No (valid) state suffix — first match on the bare city slug.
	const fallback = await findCity('us', cityParam);
	if (fallback) {
		redirect(
			301,
			`/us/solar/${fallback.level1Slug}/${fallback.level2Slug}/${fallback.citySlug}`
		);
	}

	error(404, 'City not found');
};
