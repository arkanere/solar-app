import { db } from '$lib/server/db';
import { locations } from '@solar/db/schema';
import { asc, eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';


export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json() as { district?: string };
	const { district } = body;

	if (!district) {
		return json({ error: 'State not provided' }, { status: 400 });
	}

	try {
		const rows = await db
			.selectDistinct({ city: locations.city })
			.from(locations)
			.where(eq(locations.district, district))
			.orderBy(asc(locations.city));

		return json({ cities: rows.map((row) => row.city) });
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load districts' }, { status: 500 });
	}
};
