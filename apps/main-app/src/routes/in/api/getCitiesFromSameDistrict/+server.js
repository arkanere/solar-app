import { createPool } from '@vercel/postgres';
import { json } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
	// Extract the city from the request body
	const { city } = await request.json();

	if (!city) {
		return json({ error: 'City not provided' }, { status: 400 });
	}

	try {
		// Query to find the district of the provided city
		const districtResult = await pool.query(
			`
      SELECT district
      FROM locations
      WHERE city = $1
      LIMIT 1
      `,
			[city]
		);

		// Check if the city exists in the database
		if (districtResult.rows.length === 0) {
			return json({ error: 'City not found' }, { status: 404 });
		}

		const district = districtResult.rows[0].district;

		// Query to find all cities in the same district
		const citiesResult = await pool.query(
			`
      SELECT DISTINCT city
      FROM locations
      WHERE district = $1
      ORDER BY city ASC
      `,
			[district]
		);

		// Return the list of cities along with the district
		return json({
			district,
			cities: citiesResult.rows.map((row) => row.city)
		});
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load cities and district' }, { status: 500 });
	}
}
