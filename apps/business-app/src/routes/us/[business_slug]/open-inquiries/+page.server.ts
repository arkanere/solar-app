import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const prerender = false;

interface Business {
	id: number;
	businessname: string;
}

interface Lead {
	id: number;
	name: string;
	county: string;
	pin_code: string;
	created_at: string;
	claim_count: number;
	sv_comment_for_businesses?: string;
	state: string;
}

interface PageData {
	business?: Business;
	business_id?: number;
	leads?: Lead[];
}

export const load: PageServerLoad<PageData> = async ({ params }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const businessSlug = params.business_slug;

	try {
		// First get the business information from slug
		const businessResult = await pool.query(
			`SELECT source_id AS id, businessname FROM businesses WHERE country_code = 'us' AND slug = $1`,
			[businessSlug]
		);

		if (businessResult.rows.length === 0) {
			throw error(404, 'Business not found');
		}

		const business = businessResult.rows[0] as Business;
		const businessId = business.id;

		// Get Non-Exclusive-Available-to-Claim leads with state information
		// Only show leads that are at least 10 days old and within the last 90 days
		const leadsResult = await pool.query(`
			SELECT DISTINCT
				l.source_id AS id,
				l.name,
				l.level2 AS county,
				l.postal_code AS pin_code,
				l.created_at,
				l.claim_count,
				l.sv_comment_for_businesses,
				COALESCE(loc.level1, 'Unknown') as state
			FROM leads l
			LEFT JOIN geo_locations loc ON loc.country_code = 'us' AND loc.level2 = l.level2
			WHERE l.country_code = 'us' AND l.category = 1
			AND l.claim_count <= 4
			AND l.isvisible = true
			AND l.created_at <= NOW() - INTERVAL '10 days'
			AND l.created_at >= NOW() - INTERVAL '90 days'
			ORDER BY l.created_at DESC
		`);

		const leads = leadsResult.rows as Lead[];

		return {
			business,
			business_id: businessId,
			leads
		};
	} catch (err) {
		console.error('❌ Error loading open inquiries:', err);
		throw error(500, 'Failed to load open inquiries');
	}
};
