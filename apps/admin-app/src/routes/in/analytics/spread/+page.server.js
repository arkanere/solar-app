export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// 1. Number of districts from where we have received leads
		// Join leaddata with pincode_mapping to get district information for leads
		const districtsWithLeadsResult = await pool.query(`
			SELECT COUNT(DISTINCT pm.district) as districts_with_leads
			FROM leaddata l
			JOIN pincode_mapping pm ON l.pin_code = pm.pincode
			WHERE l.isvisible = true 
			  AND (l.category != 2 OR l.category IS NULL)
			  AND pm.district IS NOT NULL 
			  AND pm.district != ''
			  AND (l.urlparams IS NULL OR l.urlparams NOT LIKE '/campaign/%')
		`);

		// 2. Of those districts with leads, number of districts where we have at least one business present
		const districtsWithBusinessesResult = await pool.query(`
			WITH lead_districts AS (
				SELECT DISTINCT pm.district
				FROM leaddata l
				JOIN pincode_mapping pm ON l.pin_code = pm.pincode
				WHERE l.isvisible = true 
				  AND (l.category != 2 OR l.category IS NULL)
				  AND pm.district IS NOT NULL 
				  AND pm.district != ''
				  AND (l.urlparams IS NULL OR l.urlparams NOT LIKE '/campaign/%')
			)
			SELECT COUNT(DISTINCT ld.district) as districts_with_businesses
			FROM lead_districts ld
			JOIN businesses_1 b ON LOWER(ld.district) = LOWER(b.district)
			WHERE b.isvisible = true
			  AND (b.slug IS NULL OR b.slug NOT LIKE '%-branch-%')
		`);

		// 4. Top 20 districts by lead count
		const top20DistrictsResult = await pool.query(`
			SELECT 
				pm.district,
				COUNT(*) as lead_count
			FROM leaddata l
			JOIN pincode_mapping pm ON l.pin_code = pm.pincode
			WHERE l.isvisible = true 
			  AND (l.category != 2 OR l.category IS NULL)
			  AND pm.district IS NOT NULL 
			  AND pm.district != ''
			  AND (l.urlparams IS NULL OR l.urlparams NOT LIKE '/campaign/%')
			GROUP BY pm.district
			ORDER BY lead_count DESC
			LIMIT 20
		`);

		// 5. Get actual leads for each of the top 20 districts (limit to 50 per district for performance)
		const districtLeadsData = {};
		for (const district of top20DistrictsResult.rows) {
			const leadsResult = await pool.query(`
				SELECT 
					l.id, l.name, l.phone, l.email, l.pin_code, l.created_at, l.type, l.comment, l.urlparams
				FROM leaddata l
				JOIN pincode_mapping pm ON l.pin_code = pm.pincode
				WHERE l.isvisible = true 
				  AND (l.category != 2 OR l.category IS NULL)
				  AND pm.district = $1
				  AND (l.urlparams IS NULL OR l.urlparams NOT LIKE '/campaign/%')
				ORDER BY l.created_at DESC
				LIMIT 50
			`, [district.district]);
			
			districtLeadsData[district.district] = leadsResult.rows;
		}

		const districtsWithLeads = parseInt(districtsWithLeadsResult.rows[0].districts_with_leads) || 0;
		const districtsWithBusinesses = parseInt(districtsWithBusinessesResult.rows[0].districts_with_businesses) || 0;
		
		// 3. Coverage percentage - what % of lead-generating districts have businesses
		const coveragePercentage = districtsWithLeads > 0 ? 
			((districtsWithBusinesses / districtsWithLeads) * 100).toFixed(1) : 0;

		return {
			analytics: {
				districtsWithLeads,
				districtsWithBusinesses,
				coveragePercentage: parseFloat(coveragePercentage),
				top20Districts: top20DistrictsResult.rows,
				districtLeadsData
			}
		};
	} catch (error) {
		console.error('Lead spread analytics query error:', error);
		return { 
			error: 'Failed to load lead spread analytics data',
			analytics: {
				districtsWithLeads: 0,
				districtsWithBusinesses: 0,
				coveragePercentage: 0,
				top20Districts: [],
				districtLeadsData: {}
			}
		};
	}
}