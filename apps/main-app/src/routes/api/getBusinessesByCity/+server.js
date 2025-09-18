// src/routes/api/getBusinessesByCity.js
import { createPool } from '@vercel/postgres';
import { json } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

// Utility function to normalize city names
function normalizeCityName(cityParam) {
	return cityParam
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export async function GET({ url }) {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const cityParam = url.searchParams.get('city');

	if (!cityParam) {
		return json({ error: 'City parameter is required' }, { status: 400 });
	}

	const normalizedCity = normalizeCityName(cityParam);

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
}
