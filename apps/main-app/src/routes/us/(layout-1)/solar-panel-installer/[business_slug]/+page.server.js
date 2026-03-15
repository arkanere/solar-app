export const config = {
	isr: {
		expiration: 604800 // 7 days
	}
};

import { error } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const businessSlug = params.business_slug;

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Query to get business by slug
		const businessResult = await pool.query(
			`SELECT
				businessname,
				description,
				phonenumber,
				slug,
				address,
				pluscode,
				state,
				city,
				tag,
				rscore,
				businessfilled,
				tier3,
				services,
				county,
				isvisible
			FROM us_businesses
			WHERE slug = $1
			LIMIT 1`,
			[businessSlug]
		);

		if (businessResult.rows.length === 0) {
			error(404, { message: `Business "${businessSlug}" not found` });
		}

		const business = businessResult.rows[0];

		if (!business.isvisible) {
			error(404, { message: `This business listing is not currently available` });
		}

		return {
			business,
			errorMessage: null
		};
	} catch (error) {
		console.error('Database query error:', error);
		return {
			business: null,
			errorMessage: 'Failed to load business data'
		};
	}
}
