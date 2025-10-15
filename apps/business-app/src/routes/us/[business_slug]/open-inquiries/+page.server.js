import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const businessSlug = params.business_slug;

	try {
		// First get the business information from slug
		const businessResult = await pool.query('SELECT id, businessname FROM businesses_1 WHERE slug = $1', [businessSlug]);

		if (businessResult.rows.length === 0) {
			throw error(404, 'Business not found');
		}

		const business = businessResult.rows[0];
		const businessId = business.id;

		// Get Non-Exclusive-Available-to-Claim leads with state information
		const leadsResult = await pool.query(`
			SELECT DISTINCT
				l.id,
				l.name,
				l.district,
				l.pin_code,
				l.created_at,
				l.claim_count,
				l.sv_comment_for_businesses,
				COALESCE(loc.state, 'Unknown') as state
			FROM leaddata l
			LEFT JOIN locations loc ON l.district = loc.district
			WHERE l.category = 1 
			AND l.claim_count <= 4 
			AND l.isvisible = true 
			ORDER BY l.created_at DESC
		`);

		const leads = leadsResult.rows;

		return {
			business: business,
			business_id: businessId,
			leads: leads
		};

	} catch (err) {
		console.error('Error loading open inquiries:', err);
		throw error(500, 'Failed to load open inquiries');
	}
}