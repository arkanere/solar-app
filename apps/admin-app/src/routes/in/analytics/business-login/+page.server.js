export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Calculate date 15 days ago
		const now = new Date();
		const fifteenDaysAgo = new Date(now);
		fifteenDaysAgo.setDate(now.getDate() - 15);

		// 1. Total businesses (excluding branches, only visible businesses)
		const totalBusinessesResult = await pool.query(
			'SELECT COUNT(*) as total FROM businesses_1 WHERE isvisible = true AND (slug IS NULL OR slug NOT LIKE \'%-branch-%\')'
		);

		// 2. Number of businesses logged in last 15 days
		const businessesLoggedInLast15DaysResult = await pool.query(
			'SELECT COUNT(*) as count FROM businesses_1 WHERE isvisible = true AND (slug IS NULL OR slug NOT LIKE \'%-branch-%\') AND last_login >= $1',
			[fifteenDaysAgo.toISOString()]
		);

		const totalBusinesses = parseInt(totalBusinessesResult.rows[0].total) || 0;
		const businessesLoggedInLast15Days = parseInt(businessesLoggedInLast15DaysResult.rows[0].count) || 0;
		
		// 3. Percentage of businesses logged in last 15 days
		const percentageLoggedIn = totalBusinesses > 0 ? 
			((businessesLoggedInLast15Days / totalBusinesses) * 100).toFixed(1) : 0;

		return {
			analytics: {
				totalBusinesses,
				businessesLoggedInLast15Days,
				percentageLoggedIn: parseFloat(percentageLoggedIn)
			}
		};
	} catch (error) {
		console.error('Business login analytics query error:', error);
		return { 
			error: 'Failed to load business login analytics data',
			analytics: {
				totalBusinesses: 0,
				businessesLoggedInLast15Days: 0,
				percentageLoggedIn: 0
			}
		};
	}
}