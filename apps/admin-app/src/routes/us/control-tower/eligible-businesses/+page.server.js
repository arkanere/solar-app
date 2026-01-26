export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Get businesses where (non-exclusive available + claimed leads) > 0
		const businessesQuery = await pool.query(`
			SELECT DISTINCT 
				b.*,
				-- Non-exclusive available: category=1 leads in same district, not already claimed by this business, and claim_count <= 4
				COUNT(DISTINCT CASE 
					WHEN l.isvisible = true AND l.category = 1 AND l.district = b.district
					AND COALESCE(l.claim_count, 0) <= 4
					AND l.id NOT IN (
						SELECT DISTINCT original_id 
						FROM leaddata l2 
						WHERE l2.category = 2 AND l2.business_id = b.id AND l2.original_id IS NOT NULL
					)
					THEN l.id END
				) as non_exclusive_available_count,
				-- Non-exclusive claimed: category=2 leads claimed by this business
				COUNT(DISTINCT CASE 
					WHEN l.isvisible = true AND l.category = 2 AND l.business_id = b.id 
					THEN l.id END
				) as claimed_leads_count,
				COUNT(DISTINCT lcr.id) as total_claim_requests,
				COUNT(DISTINCT CASE WHEN lcr.isallotted = true THEN lcr.id END) as allotted_claims,
				COUNT(DISTINCT CASE WHEN lcr.isresolved = true THEN lcr.id END) as resolved_claims,
				ARRAY_AGG(DISTINCT l.district) FILTER (WHERE l.district IS NOT NULL AND l.isvisible = true) as lead_districts,
				MAX(CASE WHEN l.isvisible = true THEN l.created_at END) as latest_lead_date,
				MAX(lcr.created_at) as latest_claim_date
			FROM businesses_1 b
			LEFT JOIN leaddata l ON (
				(l.isvisible = true AND l.category = 1 AND l.district = b.district) OR
				(l.isvisible = true AND l.category = 2 AND l.business_id = b.id)
			)
			LEFT JOIN leaddata_claimrequests lcr ON lcr.business_id = b.id
			WHERE b.isvisible = true 
			AND (b.slug IS NULL OR b.slug NOT LIKE '%-branch-%')
			GROUP BY b.id, b.businessname, b.district, b.address, b.phonenumber, b.email,
					 b.created_at, b.businessfilled, b.isvisible, b.slug, b.state,
					 b.website, b.description, b.magic_link_token
			HAVING (
				-- Non-exclusive available + claimed leads > 0
				COUNT(DISTINCT CASE 
					WHEN l.isvisible = true AND l.category = 1 AND l.district = b.district
					AND COALESCE(l.claim_count, 0) <= 4
					AND l.id NOT IN (
						SELECT DISTINCT original_id 
						FROM leaddata l2 
						WHERE l2.category = 2 AND l2.business_id = b.id AND l2.original_id IS NOT NULL
					)
					THEN l.id END
				) +
				COUNT(DISTINCT CASE 
					WHEN l.isvisible = true AND l.category = 2 AND l.business_id = b.id 
					THEN l.id END
				) > 0
			)
			ORDER BY b.id DESC
		`);

		// Get total count of all businesses (same query as business analytics)
		const totalBusinessesQuery = await pool.query(`
			SELECT COUNT(*) as total 
			FROM businesses_1 
			WHERE isvisible = true AND (slug IS NULL OR slug NOT LIKE '%-branch-%')
		`);

		const businesses = businessesQuery.rows.map(business => ({
			...business,
			non_exclusive_available_count: parseInt(business.non_exclusive_available_count) || 0,
			claimed_leads_count: parseInt(business.claimed_leads_count) || 0,
			total_claim_requests: parseInt(business.total_claim_requests) || 0,
			allotted_claims: parseInt(business.allotted_claims) || 0,
			resolved_claims: parseInt(business.resolved_claims) || 0
		}));

		// Calculate statistics
		const totalCount = parseInt(totalBusinessesQuery.rows[0].total);
		const businessCount = businesses.length;
		
		// Calculate no engagement count (non-exclusive available > 0 AND claimed = 0)
		const noEngagementCount = businesses.filter(b =>
			(b.non_exclusive_available_count || 0) > 0 && (b.claimed_leads_count || 0) === 0
		).length;

		// Group by tier
		const tier1Count = businesses.filter(b => !b.businessfilled).length;
		const tier2Count = businesses.filter(b => b.businessfilled).length;

		return {
			businesses,
			totalCount,
			businessCount,
			noEngagementCount,
			tier1Count,
			tier2Count
		};
	} catch (error) {
		console.error('Database query error:', error);
		console.error('Error details:', error.message);
		console.error('Error stack:', error.stack);
		return {
			errorMessage: 'Failed to load eligible businesses data',
			businesses: [],
			totalCount: 0,
			businessCount: 0,
			noEngagementCount: 0,
			tier1Count: 0,
			tier2Count: 0
		};
	}
}