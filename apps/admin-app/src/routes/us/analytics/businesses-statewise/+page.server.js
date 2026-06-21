export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const selectedState = url.searchParams.get('state') || '';

	try {
		let businesses = [];
		let totalCount = 0;
		let stateAnalytics = null;

		// If a state is selected, fetch businesses and analytics for that state
		if (selectedState) {
			// Get businesses in the selected state (visible only, excluding branches)
			const businessesResult = await pool.query(
				`SELECT id, businessname, county AS district, address, phonenumber, email,
						created_at, businessfilled, tier3, isvisible, slug, magic_link_token
				 FROM us_businesses
				 WHERE state = $1 AND isvisible = true
				 AND (slug IS NULL OR slug NOT LIKE '%-branch-%')
				 ORDER BY created_at DESC`,
				[selectedState]
			);

			businesses = businessesResult.rows;
			totalCount = businesses.length;

			// Get analytics for this state
			const now = new Date();
			const thirtyDaysAgo = new Date(now);
			thirtyDaysAgo.setDate(now.getDate() - 30);

			const todayStart = new Date(now);
			todayStart.setHours(0, 0, 0, 0);

			// Count businesses registered in last 30 days
			const last30DaysResult = await pool.query(
				`SELECT COUNT(*) as count FROM us_businesses 
				 WHERE state = $1 AND isvisible = true 
				 AND (slug IS NULL OR slug NOT LIKE '%-branch-%')
				 AND created_at >= $2`,
				[selectedState, thirtyDaysAgo.toISOString()]
			);

			// Count businesses registered today
			const todayResult = await pool.query(
				`SELECT COUNT(*) as count FROM us_businesses 
				 WHERE state = $1 AND isvisible = true 
				 AND (slug IS NULL OR slug NOT LIKE '%-branch-%')
				 AND created_at >= $2`,
				[selectedState, todayStart.toISOString()]
			);

			// Business status breakdown for this state
			const statusBreakdown = await pool.query(`
				SELECT
					COUNT(*) FILTER (WHERE businessfilled = false) as tier1_count,
					COUNT(*) FILTER (WHERE businessfilled = true) as tier2_count
				FROM us_businesses
				WHERE state = $1 AND isvisible = true
				AND (slug IS NULL OR slug NOT LIKE '%-branch-%')
			`, [selectedState]);

			// District breakdown for this state
			const districtBreakdown = await pool.query(`
				SELECT county AS district, COUNT(*) as count
				FROM us_businesses
				WHERE state = $1 AND isvisible = true
				AND (slug IS NULL OR slug NOT LIKE '%-branch-%')
				GROUP BY county
				ORDER BY count DESC
			`, [selectedState]);

			stateAnalytics = {
				totalBusinesses: totalCount,
				last30Days: parseInt(last30DaysResult.rows[0].count),
				today: parseInt(todayResult.rows[0].count),
				statusBreakdown: statusBreakdown.rows[0],
				districtBreakdown: districtBreakdown.rows
			};
		}

		return {
			selectedState,
			businesses,
			totalCount,
			stateAnalytics
		};
	} catch (error) {
		console.error('State-wise businesses query error:', error);
		return { 
			error: 'Failed to load state-wise business data',
			selectedState,
			businesses: [],
			totalCount: 0,
			stateAnalytics: null
		};
	}
}