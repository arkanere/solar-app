import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import type { RequestHandler } from './$types';

interface UpdateBusinessDetailsRequest {
	businessname: string;
	address: string;
	phonenumber: string;
	whatsapp: string;
	email: string;
	website: string;
	description: string;
	instagram_id: string;
	google_maps_link: string;
	services: number[];
	brands: number[];
	business_slug: string;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		const data = (await request.json()) as UpdateBusinessDetailsRequest;
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
			services,
			brands,
			business_slug // Assuming you're passing business_slug to identify the business to update
		} = data;

		// Verify the logged-in business owns the resource
		// Check if it's the main business being updated
		if (sessionResult.session.businessSlug === business_slug) {
			// Main business updating itself - allowed
		} else {
			// Check if the business_slug belongs to a branch of the logged-in business
			const mainBusinessQuery = await pool.query(
				'SELECT id FROM businesses_1 WHERE slug = $1',
				[sessionResult.session.businessSlug]
			);

			if (mainBusinessQuery.rows.length === 0) {
				return json(
					{ success: false, error: 'Main business not found' },
					{ status: 404 }
				);
			}

			const mainBusinessId = mainBusinessQuery.rows[0].id;

			// Check if business_slug is a branch of this main business
			const branchCheckQuery = await pool.query(
				`SELECT br.branch_id
				 FROM branches br
				 JOIN businesses_1 b ON br.branch_id = b.id
				 WHERE br.main_id = $1 AND b.slug = $2 AND br.isactive = true`,
				[mainBusinessId, business_slug]
			);

			if (branchCheckQuery.rows.length === 0) {
				return json(
					{ success: false, error: 'Forbidden - You can only update your own business or branches' },
					{ status: 403 }
				);
			}
		}

		// Update query for the businesses_1 table
		const updateQuery = `
      UPDATE businesses_1
      SET businessname = $1, address = $2, phonenumber = $3, whatsapp = $4, email = $5, website = $6, description = $7, instagram_id = $8, google_maps_link = $9, services = $10, brands = $11
      WHERE slug = $12
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
			services,
			brands,
			business_slug
		]);

		if (result.rows.length > 0) {
			return json({
				success: true,
				id: result.rows[0].id as number
			});
		} else {
			return json(
				{ success: false, error: 'Business not found' },
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error('❌ Error updating business data:', error);
		return json(
			{ success: false, error: 'Failed to update business' },
			{ status: 500 }
		);
	}
};
