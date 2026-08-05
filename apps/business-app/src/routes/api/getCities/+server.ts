import { db } from '$lib/server/db';
import { geoLocations } from '@solar/db/schema';
import { and, asc, eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

// Reads `geo_locations` for the same reason getDistricts does. `state` is now
// required rather than optional context: US county names repeat across states
// ("Washington" is in 31 of them on live), so a county-only lookup offered a
// California business cities from 30 other states.

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as {
		district?: string;
		state?: string;
		country?: string;
	};
	const { district, state } = body;
	const country = body.country === 'us' ? 'us' : 'in';

	if (!district || !state) {
		return json({ error: 'State and district are both required' }, { status: 400 });
	}

	try {
		const rows = await db
			.selectDistinct({ city: geoLocations.city })
			.from(geoLocations)
			.where(
				and(
					eq(geoLocations.countryCode, country),
					eq(geoLocations.level1, state),
					eq(geoLocations.level2, district)
				)
			)
			.orderBy(asc(geoLocations.city));

		return json({ cities: rows.map((row) => row.city) });
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load cities' }, { status: 500 });
	}
};
