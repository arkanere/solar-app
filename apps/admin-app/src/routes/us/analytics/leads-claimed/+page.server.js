export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// 1. Total leads (excluding category = 2, but including NULL category - same logic as lead-generation)
		const totalLeadsResult = await pool.query(
			'SELECT COUNT(*) as total FROM us_leaddata WHERE isvisible = true AND (category != 2 OR category IS NULL)'
		);

		// 2. Distribution of leads by claim count (0, 1, 2, 3, 4, 5 businesses)
		const claimDistributionResult = await pool.query(`
			SELECT 
				SUM(CASE WHEN claim_count = 0 OR claim_count IS NULL THEN 1 ELSE 0 END) as leads_claimed_by_0,
				SUM(CASE WHEN claim_count = 1 THEN 1 ELSE 0 END) as leads_claimed_by_1,
				SUM(CASE WHEN claim_count = 2 THEN 1 ELSE 0 END) as leads_claimed_by_2,
				SUM(CASE WHEN claim_count = 3 THEN 1 ELSE 0 END) as leads_claimed_by_3,
				SUM(CASE WHEN claim_count = 4 THEN 1 ELSE 0 END) as leads_claimed_by_4,
				SUM(CASE WHEN claim_count >= 5 THEN 1 ELSE 0 END) as leads_claimed_by_5_or_more
			FROM us_leaddata 
			WHERE isvisible = true 
			  AND (category != 2 OR category IS NULL)
		`);

		// Get actual leads for each claim category with claiming businesses (limited to 50 per category for performance)
		const leadsBy0ClaimsResult = await pool.query(`
			SELECT 
				l.id, l.name, l.phone, l.email, l.zipcode AS pin_code, l.county AS district, l.created_at, l.claim_count,
				ARRAY[]::TEXT[] as claiming_businesses
			FROM us_leaddata l
			WHERE l.isvisible = true 
			  AND (l.category != 2 OR l.category IS NULL)
			  AND (l.claim_count = 0 OR l.claim_count IS NULL)
			ORDER BY l.created_at DESC
			LIMIT 50
		`);

		const leadsBy1ClaimResult = await pool.query(`
			SELECT 
				l.id, l.name, l.phone, l.email, l.zipcode AS pin_code, l.county AS district, l.created_at, l.claim_count,
				COALESCE(
					ARRAY(
						SELECT b.businessname 
						FROM us_leaddata claimed 
						JOIN us_businesses b ON claimed.business_id = b.id 
						WHERE claimed.original_id = l.id AND claimed.category = 2
						ORDER BY b.businessname
					), 
					ARRAY[]::TEXT[]
				) as claiming_businesses
			FROM us_leaddata l
			WHERE l.isvisible = true 
			  AND (l.category != 2 OR l.category IS NULL)
			  AND l.claim_count = 1
			ORDER BY l.created_at DESC
			LIMIT 50
		`);

		const leadsBy2ClaimsResult = await pool.query(`
			SELECT 
				l.id, l.name, l.phone, l.email, l.zipcode AS pin_code, l.county AS district, l.created_at, l.claim_count,
				COALESCE(
					ARRAY(
						SELECT b.businessname 
						FROM us_leaddata claimed 
						JOIN us_businesses b ON claimed.business_id = b.id 
						WHERE claimed.original_id = l.id AND claimed.category = 2
						ORDER BY b.businessname
					), 
					ARRAY[]::TEXT[]
				) as claiming_businesses
			FROM us_leaddata l
			WHERE l.isvisible = true 
			  AND (l.category != 2 OR l.category IS NULL)
			  AND l.claim_count = 2
			ORDER BY l.created_at DESC
			LIMIT 50
		`);

		const leadsBy3ClaimsResult = await pool.query(`
			SELECT 
				l.id, l.name, l.phone, l.email, l.zipcode AS pin_code, l.county AS district, l.created_at, l.claim_count,
				COALESCE(
					ARRAY(
						SELECT b.businessname 
						FROM us_leaddata claimed 
						JOIN us_businesses b ON claimed.business_id = b.id 
						WHERE claimed.original_id = l.id AND claimed.category = 2
						ORDER BY b.businessname
					), 
					ARRAY[]::TEXT[]
				) as claiming_businesses
			FROM us_leaddata l
			WHERE l.isvisible = true 
			  AND (l.category != 2 OR l.category IS NULL)
			  AND l.claim_count = 3
			ORDER BY l.created_at DESC
			LIMIT 50
		`);

		const leadsBy4ClaimsResult = await pool.query(`
			SELECT 
				l.id, l.name, l.phone, l.email, l.zipcode AS pin_code, l.county AS district, l.created_at, l.claim_count,
				COALESCE(
					ARRAY(
						SELECT b.businessname 
						FROM us_leaddata claimed 
						JOIN us_businesses b ON claimed.business_id = b.id 
						WHERE claimed.original_id = l.id AND claimed.category = 2
						ORDER BY b.businessname
					), 
					ARRAY[]::TEXT[]
				) as claiming_businesses
			FROM us_leaddata l
			WHERE l.isvisible = true 
			  AND (l.category != 2 OR l.category IS NULL)
			  AND l.claim_count = 4
			ORDER BY l.created_at DESC
			LIMIT 50
		`);

		const leadsBy5OrMoreClaimsResult = await pool.query(`
			SELECT 
				l.id, l.name, l.phone, l.email, l.zipcode AS pin_code, l.county AS district, l.created_at, l.claim_count,
				COALESCE(
					ARRAY(
						SELECT b.businessname 
						FROM us_leaddata claimed 
						JOIN us_businesses b ON claimed.business_id = b.id 
						WHERE claimed.original_id = l.id AND claimed.category = 2
						ORDER BY b.businessname
					), 
					ARRAY[]::TEXT[]
				) as claiming_businesses
			FROM us_leaddata l
			WHERE l.isvisible = true 
			  AND (l.category != 2 OR l.category IS NULL)
			  AND l.claim_count >= 5
			ORDER BY l.created_at DESC
			LIMIT 50
		`);

		const distribution = claimDistributionResult.rows[0] || {
			leads_claimed_by_0: 0,
			leads_claimed_by_1: 0,
			leads_claimed_by_2: 0,
			leads_claimed_by_3: 0,
			leads_claimed_by_4: 0,
			leads_claimed_by_5_or_more: 0
		};

		return {
			analytics: {
				totalLeads: parseInt(totalLeadsResult.rows[0].total),
				claimDistribution: {
					zeroClaims: parseInt(distribution.leads_claimed_by_0) || 0,
					oneClaim: parseInt(distribution.leads_claimed_by_1) || 0,
					twoClaims: parseInt(distribution.leads_claimed_by_2) || 0,
					threeClaims: parseInt(distribution.leads_claimed_by_3) || 0,
					fourClaims: parseInt(distribution.leads_claimed_by_4) || 0,
					fiveOrMoreClaims: parseInt(distribution.leads_claimed_by_5_or_more) || 0
				},
				leadsByCategory: {
					zeroClaims: leadsBy0ClaimsResult.rows,
					oneClaim: leadsBy1ClaimResult.rows,
					twoClaims: leadsBy2ClaimsResult.rows,
					threeClaims: leadsBy3ClaimsResult.rows,
					fourClaims: leadsBy4ClaimsResult.rows,
					fiveOrMoreClaims: leadsBy5OrMoreClaimsResult.rows
				}
			}
		};
	} catch (error) {
		console.error('Leads claimed analytics query error:', error);
		return { 
			error: 'Failed to load leads claimed analytics data',
			analytics: {
				totalLeads: 0,
				claimDistribution: {
					zeroClaims: 0,
					oneClaim: 0,
					twoClaims: 0,
					threeClaims: 0,
					fourClaims: 0,
					fiveOrMoreClaims: 0
				},
				leadsByCategory: {
					zeroClaims: [],
					oneClaim: [],
					twoClaims: [],
					threeClaims: [],
					fourClaims: [],
					fiveOrMoreClaims: []
				}
			}
		};
	}
}