export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// 1. Total number of districts from locations table
		const totalDistrictsResult = await pool.query(
			'SELECT COUNT(DISTINCT district) as total FROM locations WHERE district IS NOT NULL AND district != \'\''
		);

		// 2. Number of districts where there is at least 1 business
		const coveredDistrictsResult = await pool.query(`
			SELECT COUNT(DISTINCT b.district) as covered
			FROM businesses_1 b
			WHERE b.isvisible = true 
			  AND b.district IS NOT NULL 
			  AND b.district != ''
			  AND (b.slug IS NULL OR b.slug NOT LIKE '%-branch-%')
		`);

		// 3. State-wise coverage breakdown
		const statewiseCoverageResult = await pool.query(`
			WITH state_districts AS (
				SELECT 
					state,
					COUNT(DISTINCT district) as total_districts
				FROM locations 
				WHERE state IS NOT NULL AND state != ''
				  AND district IS NOT NULL AND district != ''
				GROUP BY state
			),
			covered_districts AS (
				SELECT 
					b.state,
					COUNT(DISTINCT b.district) as covered_districts
				FROM businesses_1 b
				WHERE b.isvisible = true 
				  AND b.state IS NOT NULL AND b.state != ''
				  AND b.district IS NOT NULL AND b.district != ''
				  AND (b.slug IS NULL OR b.slug NOT LIKE '%-branch-%')
				GROUP BY b.state
			)
			SELECT 
				sd.state,
				sd.total_districts,
				COALESCE(cd.covered_districts, 0) as covered_districts,
				CASE 
					WHEN sd.total_districts > 0 
					THEN ROUND((COALESCE(cd.covered_districts, 0)::decimal / sd.total_districts::decimal) * 100, 1)
					ELSE 0 
				END as coverage_percentage
			FROM state_districts sd
			LEFT JOIN covered_districts cd ON sd.state = cd.state
			ORDER BY coverage_percentage DESC, sd.state ASC
		`);

		// 4. Get details of covered vs uncovered districts for a few sample states
		const districtDetailsResult = await pool.query(`
			WITH all_districts AS (
				SELECT DISTINCT state, district
				FROM locations 
				WHERE state IS NOT NULL AND state != ''
				  AND district IS NOT NULL AND district != ''
			),
			business_districts AS (
				SELECT DISTINCT b.state, b.district
				FROM businesses_1 b
				WHERE b.isvisible = true 
				  AND b.state IS NOT NULL AND b.state != ''
				  AND b.district IS NOT NULL AND b.district != ''
				  AND (b.slug IS NULL OR b.slug NOT LIKE '%-branch-%')
			)
			SELECT 
				ad.state,
				ad.district,
				CASE WHEN bd.district IS NOT NULL THEN true ELSE false END as has_business
			FROM all_districts ad
			LEFT JOIN business_districts bd ON ad.state = bd.state AND ad.district = bd.district
			ORDER BY ad.state, ad.district
		`);

		const totalDistricts = parseInt(totalDistrictsResult.rows[0].total);
		const coveredDistricts = parseInt(coveredDistrictsResult.rows[0].covered);
		const coveragePercentage = totalDistricts > 0 ? ((coveredDistricts / totalDistricts) * 100).toFixed(1) : 0;

		return {
			analytics: {
				totalDistricts,
				coveredDistricts,
				coveragePercentage: parseFloat(coveragePercentage),
				statewiseCoverage: statewiseCoverageResult.rows,
				districtDetails: districtDetailsResult.rows
			}
		};
	} catch (error) {
		console.error('Coverage analytics query error:', error);
		return { 
			error: 'Failed to load coverage analytics data',
			analytics: {
				totalDistricts: 0,
				coveredDistricts: 0,
				coveragePercentage: 0,
				statewiseCoverage: [],
				districtDetails: []
			}
		};
	}
}