// src/routes/solar-panel-installer/[business_slug]/+page.server.js


export const config = {
	isr: {
		expiration: 604800 // 7 days
	}
};

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const slug = params.business_slug; // Updated the param name to business_slug

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Query the database for the business with the matching slug
		const result = await pool.query(
			`SELECT businessname,description, phonenumber, email, website,
      slug, address, district,
      state, city, tag, rscore, businessfilled, tier3, services, instagram_id, google_maps_link 
      FROM businesses_1 WHERE slug = $1 and isvisible = true`,
			[slug]
		);

		if (result.rows.length > 0) {
			// Return the business data if found
			return { business: result.rows[0] };
		} else {
			// Return an error if no business is found
			return { errorMessage: `No business found` };
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load business details' };
	}
}
