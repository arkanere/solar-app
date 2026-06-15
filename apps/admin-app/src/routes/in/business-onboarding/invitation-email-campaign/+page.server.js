import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export async function load({ url }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	const dateFrom = url.searchParams.get('from') || '';
	const dateTo = url.searchParams.get('to') || '';

	try {
		let conditions = ["db_table = 'masterlist_indian_businesses'"];
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

		const whereClause = 'WHERE ' + conditions.join(' AND ');

		const dailySummary = await pool.query(
			`SELECT
				DATE(sent_at) as date,
				COUNT(*) as emails_sent
			FROM installer_invitation_email_campaign_log
			${whereClause}
			GROUP BY DATE(sent_at)
			ORDER BY DATE(sent_at) DESC`,
			params
		);

		const recentEmails = await pool.query(
			`SELECT
				id, business_id, recipient_email, vendor_name,
				state, email_number, campaign_run_id, sent_at
			FROM installer_invitation_email_campaign_log
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
			FROM installer_invitation_email_campaign_log
			WHERE db_table = 'masterlist_indian_businesses'
		`);

		return {
			dailySummary: dailySummary.rows,
			recentEmails: recentEmails.rows,
			stats: stats.rows[0],
			filters: { dateFrom, dateTo }
		};
	} catch (error) {
		console.error('Error loading campaign data:', error);
		return {
			dailySummary: [],
			recentEmails: [],
			stats: {},
			filters: { dateFrom, dateTo },
			error: 'Failed to load campaign data'
		};
	}
}
