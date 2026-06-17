export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const now = new Date();
		// Unclaimed leads where at least one verified business exists in the same district
		const baseWhere = `l.isvisible = true AND l.status = true AND (l.category != 2 OR l.category IS NULL)
			AND NOT EXISTS (
				SELECT 1 FROM leaddata c WHERE c.original_id = l.id AND c.category = 2
			)
			AND EXISTS (
				SELECT 1 FROM businesses_1 b WHERE b.district = l.district AND b.isvisible = true
			)`;

		const fifteenDaysAgo = new Date(now);
		fifteenDaysAgo.setDate(now.getDate() - 15);

		const thirtyDaysAgo = new Date(now);
		thirtyDaysAgo.setDate(now.getDate() - 30);

		const ninetyDaysAgo = new Date(now);
		ninetyDaysAgo.setDate(now.getDate() - 90);

		const [last90Result, last30Result, last15Result] = await Promise.all([
			pool.query(
				`SELECT COUNT(*) as count FROM leaddata l WHERE ${baseWhere} AND l.created_at >= $1`,
				[ninetyDaysAgo.toISOString()]
			),
			pool.query(
				`SELECT COUNT(*) as count FROM leaddata l WHERE ${baseWhere} AND l.created_at >= $1`,
				[thirtyDaysAgo.toISOString()]
			),
			pool.query(
				`SELECT COUNT(*) as count FROM leaddata l WHERE ${baseWhere} AND l.created_at >= $1`,
				[fifteenDaysAgo.toISOString()]
			)
		]);

		const last90Count = parseInt(last90Result.rows[0].count);
		const last30Count = parseInt(last30Result.rows[0].count);
		const last15Count = parseInt(last15Result.rows[0].count);

		const sixMonthsAgo = new Date(now);
		sixMonthsAgo.setDate(now.getDate() - 180);

		const dailyCountsResult = await pool.query(
			`SELECT DATE(l.created_at) as day, COUNT(*) as count
			 FROM leaddata l
			 WHERE ${baseWhere} AND l.created_at >= $1
			 GROUP BY DATE(l.created_at)
			 ORDER BY day`,
			[sixMonthsAgo.toISOString()]
		);

		const dailyCounts = new Map();
		for (const row of dailyCountsResult.rows) {
			dailyCounts.set(row.day.toISOString().split('T')[0], parseInt(row.count));
		}

		const trendData = [];
		for (let weeksAgo = 12; weeksAgo >= 0; weeksAgo--) {
			const refDate = new Date(now);
			refDate.setDate(now.getDate() - weeksAgo * 7);
			const refDateStr = refDate.toISOString().split('T')[0];

			const sumForPeriod = (days) => {
				let total = 0;
				for (let d = 0; d < days; d++) {
					const date = new Date(refDate);
					date.setDate(refDate.getDate() - d);
					const key = date.toISOString().split('T')[0];
					total += dailyCounts.get(key) || 0;
				}
				return total;
			};

			trendData.push({
				date: refDateStr,
				avg90: parseFloat((sumForPeriod(90) / 90).toFixed(1)),
				avg30: parseFloat((sumForPeriod(30) / 30).toFixed(1)),
				avg15: parseFloat((sumForPeriod(15) / 15).toFixed(1))
			});
		}

		return {
			analytics: {
				avgDaily90: (last90Count / 90).toFixed(1),
				avgDaily30: (last30Count / 30).toFixed(1),
				avgDaily15: (last15Count / 15).toFixed(1),
				trendData
			}
		};
	} catch (error) {
		console.error('Has-business analytics query error:', error);
		return {
			error: 'Failed to load analytics data',
			analytics: {
				avgDaily90: '0',
				avgDaily30: '0',
				avgDaily15: '0',
				trendData: []
			}
		};
	}
}
