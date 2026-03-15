import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export async function load({ url }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	const state = url.searchParams.get('state') || '';
	const search = url.searchParams.get('search') || '';
	const emailStatus = url.searchParams.get('email_status') || 'all';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 50;
	const offset = (page - 1) * perPage;

	try {
		let conditions = [];
		let params = [];
		let paramIndex = 1;

		if (state) {
			conditions.push(`state = $${paramIndex}`);
			params.push(state);
			paramIndex++;
		}
		if (search) {
			conditions.push(`(vendor_name ILIKE $${paramIndex} OR recipient_email ILIKE $${paramIndex})`);
			params.push(`%${search}%`);
			paramIndex++;
		}
		if (emailStatus === 'sent') {
			conditions.push('number_of_emails_sent > 0');
		} else if (emailStatus === 'unsent') {
			conditions.push('number_of_emails_sent = 0');
		} else if (emailStatus === 'unsubscribed') {
			conditions.push('unsubscribe = 1');
		} else if (emailStatus === 'verified') {
			conditions.push('verified = 1');
		}

		const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

		const countResult = await pool.query(
			`SELECT COUNT(*) as total FROM masterlist_usa_businesses ${whereClause}`,
			params
		);
		const total = parseInt(countResult.rows[0].total);

		const businesses = await pool.query(
			`SELECT id, state, vendor_name, recipient_email, contact_person, mobile_number,
				county, website, google_maps_url,
				verified, unsubscribe, earlier_date, number_of_emails_sent, created_at, updated_at
			FROM masterlist_usa_businesses
			${whereClause}
			ORDER BY created_at DESC
			LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
			[...params, perPage, offset]
		);

		const states = await pool.query(
			`SELECT DISTINCT state FROM masterlist_usa_businesses WHERE state IS NOT NULL ORDER BY state`
		);

		const stats = await pool.query(`
			SELECT
				COUNT(*) as total,
				COUNT(*) FILTER (WHERE number_of_emails_sent > 0) as emailed,
				COUNT(*) FILTER (WHERE number_of_emails_sent = 0) as not_emailed,
				COUNT(*) FILTER (WHERE unsubscribe = 1) as unsubscribed,
				COUNT(*) FILTER (WHERE verified = 1) as verified
			FROM masterlist_usa_businesses
		`);

		return {
			businesses: businesses.rows,
			states: states.rows.map(r => r.state),
			stats: stats.rows[0],
			total,
			page,
			perPage,
			totalPages: Math.ceil(total / perPage),
			filters: { state, search, emailStatus }
		};
	} catch (error) {
		console.error('Error loading USA businesses:', error);
		return {
			businesses: [],
			states: [],
			stats: {},
			total: 0,
			page: 1,
			perPage,
			totalPages: 0,
			filters: { state, search, emailStatus },
			error: 'Failed to load businesses'
		};
	}
}
