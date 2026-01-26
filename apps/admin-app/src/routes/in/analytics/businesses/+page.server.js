export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Get current date and calculate date ranges
		const now = new Date();
		const thirtyDaysAgo = new Date(now);
		thirtyDaysAgo.setDate(now.getDate() - 30);
		
		const sevenDaysAgo = new Date(now);
		sevenDaysAgo.setDate(now.getDate() - 7);

		// 1. Total businesses registered (only visible businesses, excluding branches)
		const totalBusinessesResult = await pool.query(
			'SELECT COUNT(*) as total FROM businesses_1 WHERE isvisible = true AND (slug IS NULL OR slug NOT LIKE \'%-branch-%\')'
		);
		
		// 2. Businesses registered last 30 days (excluding branches)
		const last30DaysResult = await pool.query(
			'SELECT COUNT(*) as count FROM businesses_1 WHERE isvisible = true AND (slug IS NULL OR slug NOT LIKE \'%-branch-%\') AND created_at >= $1',
			[thirtyDaysAgo.toISOString()]
		);

		// 3. Businesses registered in last 4 weeks, week by week
		const weeklyResults = [];
		for (let i = 0; i < 4; i++) {
			const weekStart = new Date(now);
			weekStart.setDate(now.getDate() - (7 * (i + 1)));
			const weekEnd = new Date(weekStart);
			weekEnd.setDate(weekStart.getDate() + 7);
			
			const weekResult = await pool.query(
				'SELECT COUNT(*) as count FROM businesses_1 WHERE isvisible = true AND (slug IS NULL OR slug NOT LIKE \'%-branch-%\') AND created_at >= $1 AND created_at < $2',
				[weekStart.toISOString(), weekEnd.toISOString()]
			);
			
			weeklyResults.push({
				week: `Week ${4-i}`,
				weekStart: weekStart.toISOString().split('T')[0],
				weekEnd: weekEnd.toISOString().split('T')[0],
				count: parseInt(weekResult.rows[0].count)
			});
		}


		// Additional metrics
		const todayStart = new Date(now);
		todayStart.setHours(0, 0, 0, 0);
		const todayResult = await pool.query(
			'SELECT COUNT(*) as count FROM businesses_1 WHERE isvisible = true AND (slug IS NULL OR slug NOT LIKE \'%-branch-%\') AND created_at >= $1',
			[todayStart.toISOString()]
		);

		// Business status breakdown (excluding branches)
		const statusBreakdown = await pool.query(`
			SELECT
				COUNT(*) FILTER (WHERE businessfilled = false) as tier1_count,
				COUNT(*) FILTER (WHERE businessfilled = true) as tier2_count,
				COUNT(*) FILTER (WHERE isvisible = false) as hidden_count
			FROM businesses_1
			WHERE (slug IS NULL OR slug NOT LIKE '%-branch-%')
		`);


		return {
			analytics: {
				totalBusinesses: parseInt(totalBusinessesResult.rows[0].total),
				last30Days: parseInt(last30DaysResult.rows[0].count),
				today: parseInt(todayResult.rows[0].count),
				weeklyBreakdown: weeklyResults.reverse(), // Show most recent week first
				statusBreakdown: statusBreakdown.rows[0]
			}
		};
	} catch (error) {
		console.error('Business analytics query error:', error);
		return { 
			error: 'Failed to load business analytics data',
			analytics: {
				totalBusinesses: 0,
				last30Days: 0,
				today: 0,
				weeklyBreakdown: [],
				statusBreakdown: {
					tier1_count: 0,
					tier2_count: 0,
					hidden_count: 0
				}
			}
		};
	}
}