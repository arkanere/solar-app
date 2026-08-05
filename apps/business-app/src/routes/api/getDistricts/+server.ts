import { db } from '$lib/server/db';
import { locations } from '@solar/db/schema';
import { asc, eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';


export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json() as { state?: string; timestamp?: number };
	const { state, timestamp } = body;

	if (!state) {
		return json({ error: 'State not provided' }, { status: 400 });
	}

	try {
		const rows = await db
			.selectDistinct({ district: locations.district })
			.from(locations)
			.where(eq(locations.state, state))
			.orderBy(asc(locations.district));

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
