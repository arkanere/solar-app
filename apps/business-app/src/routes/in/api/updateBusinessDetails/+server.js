import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business/index.js';

export async function POST({ request, cookies }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const data = await request.json();
		const {
			businessname,
			address,
			phonenumber,
			whatsapp,
			email,
			website,
			description,
			instagram_id,
			google_maps_link,
			business_slug // Assuming you're passing business_slug to identify the business to update
		} = data;

		// Verify the logged-in business owns the resource
		if (sessionResult.session.businessSlug !== business_slug) {
			return json(
				{ success: false, error: 'Forbidden - You can only update your own business' },
				{ status: 403 }
			);
		}

		// Update query for the businesses_1 table
		const updateQuery = `
      UPDATE businesses_1
      SET businessname = $1, address = $2, phonenumber = $3, whatsapp = $4, email = $5, website = $6, description = $7, instagram_id = $8, google_maps_link = $9
      WHERE slug = $10
      RETURNING id
    `;

		const result = await pool.query(updateQuery, [
			businessname,
			address,
			phonenumber,
			whatsapp,
			email,
			website,
			description,
			instagram_id,
			google_maps_link,
			business_slug
		]);

		if (result.rows.length > 0) {
			return json({ success: true, id: result.rows[0].id });
		} else {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}
	} catch (error) {
		console.error('Error updating business data:', error);
		return json({ success: false, error: 'Failed to update business' }, { status: 500 });
	}
}
