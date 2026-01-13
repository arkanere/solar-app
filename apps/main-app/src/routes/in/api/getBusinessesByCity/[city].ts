import { createPool } from '@vercel/postgres';
import { json, type RequestHandler } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

interface CityParams {
	city: string;
}

interface Business {
	id: number;
	city: string;
	[key: string]: unknown;
}

// Utility function to normalize city names
function normalizeCityName(cityParam: string): string {
	return cityParam
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export const GET: RequestHandler = async ({ params }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const { city } = params as unknown as CityParams;

	if (!city) {
		return json({ error: 'City parameter is required' }, { status: 400 });
	}

	const normalizedCity = normalizeCityName(city);

	try {
		const result = await pool.query('SELECT * FROM Businesses WHERE city = $1', [normalizedCity]);

		if (result.rows.length === 0) {
			return json({ message: `No businesses found in ${normalizedCity}` }, { status: 404 });
		}

		return json(result.rows);
	} catch (error) {
		console.error('Error fetching businesses:', error);
		return json({ error: 'Failed to fetch businesses' }, { status: 500 });
	}
};
