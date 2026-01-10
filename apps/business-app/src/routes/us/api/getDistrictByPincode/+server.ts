import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
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

		const pool = createPool({ connectionString: POSTGRES_URL });

		const result = await pool.query<{ district: string }>(
			'SELECT district FROM pincode_mapping WHERE pincode = $1',
			[pincode.trim()]
		);

		if (result.rows.length > 0) {
			return json({
				success: true,
				district: result.rows[0].district
			});
		} else {
			return json({
				success: false,
				error: 'District not found for this pincode'
			});
		}
	} catch (error) {
		console.error('Error fetching district by pincode:', error);
		return json({ success: false, error: 'Failed to fetch district' }, { status: 500 });
	}
};
