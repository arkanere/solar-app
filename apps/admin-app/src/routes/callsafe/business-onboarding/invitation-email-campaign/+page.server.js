import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export async function load({ url }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	const dateFrom = url.searchParams.get('from') || '';
	const dateTo = url.searchParams.get('to') || '';
	const country = url.searchParams.get('country') || 'all';

	try {
		let conditions = [];
		let params = [];
		let paramIndex = 1;

		if (dateFrom) {
			conditions.push(`sent_at >= $${paramIndex}::date`);
			params.push(dateFrom);
			paramIndex++;
		}
		if (dateTo) {
			conditions.push(`sent_at < ($${paramIndex}::date + INTERVAL '1 day')`);
			params.push(dateTo);
			paramIndex++;
		}
		if (country !== 'all') {
			conditions.push(`country = $${paramIndex}`);
			params.push(country);
			paramIndex++;
		}

		const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

		const dailySummary = await pool.query(
			`SELECT
				DATE(sent_at) as date,
				country,
				COUNT(*) as emails_sent
			FROM callsafe_email_campaign_log
			${whereClause}
			GROUP BY DATE(sent_at), country
			ORDER BY DATE(sent_at) DESC`,
			params
		);

		const recentEmails = await pool.query(
			`SELECT
				id, business_id, recipient_email, website,
				country, email_number, campaign_run_id, sent_at
			FROM callsafe_email_campaign_log
			${whereClause}
			ORDER BY sent_at DESC
			LIMIT 200`,
			params
		);

		const stats = await pool.query(`
			SELECT
				COUNT(*) as total_sent,
				COUNT(DISTINCT recipient_email) as unique_recipients,
				COUNT(DISTINCT campaign_run_id) as total_runs,
				COUNT(DISTINCT DATE(sent_at)) as active_days,
				MIN(sent_at) as first_sent,
				MAX(sent_at) as last_sent
			FROM callsafe_email_campaign_log
		`);

		const countryStats = await pool.query(`
			SELECT
				country,
				COUNT(*) as total_sent,
				COUNT(DISTINCT recipient_email) as unique_recipients
			FROM callsafe_email_campaign_log
			GROUP BY country
		`);

		return {
			dailySummary: dailySummary.rows,
			recentEmails: recentEmails.rows,
			stats: stats.rows[0],
			countryStats: countryStats.rows,
			filters: { dateFrom, dateTo, country }
		};
	} catch (error) {
		console.error('Error loading CallSafe campaign data:', error);
		return {
			dailySummary: [],
			recentEmails: [],
			stats: {},
			countryStats: [],
			filters: { dateFrom, dateTo, country },
			error: 'Failed to load campaign data'
		};
	}
}
