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

		// 1. Total leads generated (excluding category = 2, but including NULL category)
		const totalLeadsResult = await pool.query(
			'SELECT COUNT(*) as total FROM leaddata WHERE isvisible = true AND (category != 2 OR category IS NULL)'
		);
		
		// 2. Leads generated last 30 days (excluding category = 2, but including NULL category)
		const last30DaysResult = await pool.query(
			'SELECT COUNT(*) as count FROM leaddata WHERE isvisible = true AND (category != 2 OR category IS NULL) AND created_at >= $1',
			[thirtyDaysAgo.toISOString()]
		);

		// 3. Leads generated in last 4 weeks, week by week (excluding category = 2)
		const weeklyResults = [];
		for (let i = 0; i < 4; i++) {
			const weekStart = new Date(now);
			weekStart.setDate(now.getDate() - (7 * (i + 1)));
			const weekEnd = new Date(weekStart);
			weekEnd.setDate(weekStart.getDate() + 7);
			
			const weekResult = await pool.query(
				'SELECT COUNT(*) as count FROM leaddata WHERE isvisible = true AND (category != 2 OR category IS NULL) AND created_at >= $1 AND created_at < $2',
				[weekStart.toISOString(), weekEnd.toISOString()]
			);
			
			weeklyResults.push({
				week: `Week ${4-i}`,
				weekStart: weekStart.toISOString().split('T')[0],
				weekEnd: weekEnd.toISOString().split('T')[0],
				count: parseInt(weekResult.rows[0].count)
			});
		}

		// 4. Leads generated last 7 days, day by day (excluding category = 2)
		const dailyResults = [];
		for (let i = 6; i >= 0; i--) {
			const day = new Date(now);
			day.setDate(now.getDate() - i);
			const dayStart = new Date(day);
			dayStart.setHours(0, 0, 0, 0);
			const dayEnd = new Date(day);
			dayEnd.setHours(23, 59, 59, 999);
			
			const dayResult = await pool.query(
				'SELECT COUNT(*) as count FROM leaddata WHERE isvisible = true AND (category != 2 OR category IS NULL) AND created_at >= $1 AND created_at <= $2',
				[dayStart.toISOString(), dayEnd.toISOString()]
			);
			
			dailyResults.push({
				date: day.toISOString().split('T')[0],
				dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
				count: parseInt(dayResult.rows[0].count)
			});
		}

		// Additional metrics (excluding category = 2)
		const todayStart = new Date(now);
		todayStart.setHours(0, 0, 0, 0);
		const todayResult = await pool.query(
			'SELECT COUNT(*) as count FROM leaddata WHERE isvisible = true AND (category != 2 OR category IS NULL) AND created_at >= $1',
			[todayStart.toISOString()]
		);

		return {
			analytics: {
				totalLeads: parseInt(totalLeadsResult.rows[0].total),
				last30Days: parseInt(last30DaysResult.rows[0].count),
				today: parseInt(todayResult.rows[0].count),
				weeklyBreakdown: weeklyResults.reverse(), // Show most recent week first
				dailyBreakdown: dailyResults
			}
		};
	} catch (error) {
		console.error('Analytics query error:', error);
		return { 
			error: 'Failed to load analytics data',
			analytics: {
				totalLeads: 0,
				last30Days: 0,
				today: 0,
				weeklyBreakdown: [],
				dailyBreakdown: []
			}
		};
	}
}