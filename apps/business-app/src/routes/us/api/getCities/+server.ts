import { db } from '$lib/server/db';
import { usLocations } from '@solar/db/schema';
import { asc, sql } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';


export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json() as { county?: string; district?: string };
	const { county, district } = body;
	const countyValue = county || district;

	if (!countyValue) {
		return json({ error: 'County/District not provided' }, { status: 400 });
	}

	try {
		const rows = await db
			.selectDistinct({ city: usLocations.city })
			.from(usLocations)
			.where(sql`LOWER(${usLocations.county}) = LOWER(${countyValue})`)
			.orderBy(asc(usLocations.city));

		return json({ cities: rows.map((row) => row.city) });
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load cities' }, { status: 500 });
	}
};
