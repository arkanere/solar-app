import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: {
		expiration: 1296000
	}
};

export const load: PageServerLoad = async () => {
	try {
		const latestBusinessesResult = await pool.query(
			`SELECT
        id,
        businessname,
        phonenumber,
        city,
        state,
        district,
        slug
      FROM businesses_1
      WHERE isvisible = true
      AND businessfilled = true
      ORDER BY id DESC
      LIMIT 10;`
		);

		const businesses = latestBusinessesResult.rows;

		if (businesses.length > 0) {
			return { businesses };
		} else {
			return { errorMessage: 'No verified businesses found.' };
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load businesses' };
	}
}
