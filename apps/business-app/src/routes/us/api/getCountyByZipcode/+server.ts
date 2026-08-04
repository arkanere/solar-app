import { db } from '$lib/server/db';
import { pincodeMapping } from '@solar/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json() as { pincode?: string };
		const { pincode } = body;

		if (!pincode || pincode.trim() === '') {
			return json({ success: false, error: 'Pincode is required' });
		}

		// Validate pincode format (6 digits)
		const pincodeRegex = /^\d{6}$/;
		if (!pincodeRegex.test(pincode.trim())) {
			return json({ success: false, error: 'Invalid pincode format. Must be 6 digits.' });
		}


		const rows = await db
			.select({ district: pincodeMapping.district })
			.from(pincodeMapping)
			.where(eq(pincodeMapping.pincode, pincode.trim()));

		if (rows.length > 0) {
			return json({
				success: true,
				county: rows[0].district
			});
		} else {
			return json({
				success: false,
				error: 'County not found for this zipcode'
			});
		}
	} catch (error) {
		console.error('Error fetching county by zipcode:', error);
		return json({ success: false, error: 'Failed to fetch county' }, { status: 500 });
	}
};
