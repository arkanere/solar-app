import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Query to get the 10 latest verified businesses for US
		const latestBusinessesResult = await pool.query(
			`SELECT
        id,
        businessname,
        phonenumber,
        city,
        state,
        slug
      FROM us_businesses
      WHERE isvisible = true
      AND businessfilled = true
      ORDER BY id DESC
      LIMIT 10;`
		);

		const businesses = latestBusinessesResult.rows;

		// Return the businesses or an error message if none found
		if (businesses.length > 0) {
			return {
				businesses
			};
		} else {
			return { errorMessage: 'No verified businesses found.' };
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load businesses' };
	}
}
