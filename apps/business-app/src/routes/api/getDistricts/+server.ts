import { db } from '$lib/server/db';
import { geoLocations } from '@solar/db/schema';
import { and, asc, eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

// Reads `geo_locations` (country_code + level1/level2/city) rather than
// `locations`, which holds India only — a US business got an empty list, so the
// branch form's cascade could never start. `country` defaults to 'in' so a
// caller that predates this keeps its old behaviour instead of going blank.

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as {
		state?: string;
		country?: string;
		timestamp?: number;
	};
	const { state, timestamp } = body;
	const country = body.country === 'us' ? 'us' : 'in';

	if (!state) {
		return json({ error: 'State not provided' }, { status: 400 });
	}

	try {
		const rows = await db
			.selectDistinct({ district: geoLocations.level2 })
			.from(geoLocations)
			.where(and(eq(geoLocations.countryCode, country), eq(geoLocations.level1, state)))
			.orderBy(asc(geoLocations.level2));

		const response = json({
			districts: rows.map((row) => row.district),
			timestamp: timestamp || Date.now()
		});

		// Add headers to prevent caching
		response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
		response.headers.set('Pragma', 'no-cache');
		response.headers.set('Expires', '0');

		return response;
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load districts' }, { status: 500 });
	}
};
