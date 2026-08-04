import { db } from '$lib/server/db';
import { usLocations } from '@solar/db/schema';
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
			.selectDistinct({ county: usLocations.county })
			.from(usLocations)
			.where(eq(usLocations.state, state))
			.orderBy(asc(usLocations.county));

		const countiesData = rows.map((row) => row.county);

		const response = json({
			counties: countiesData,
			districts: countiesData, // Also include as 'districts' for backward compatibility
			timestamp: timestamp || Date.now()
		});

		// Add headers to prevent caching
		response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
		response.headers.set('Pragma', 'no-cache');
		response.headers.set('Expires', '0');

		return response;
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load counties' }, { status: 500 });
	}
};
