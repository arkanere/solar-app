export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// 1. Total businesses (excluding branches, only visible businesses)
		const totalBusinessesResult = await pool.query(
			'SELECT COUNT(*) as total FROM businesses_1 WHERE isvisible = true AND (slug IS NULL OR slug NOT LIKE \'%-branch-%\')'
		);

		// 2. Number of businesses who have posted at least 1 project
		const businessesWithProjectsResult = await pool.query(`
			SELECT COUNT(DISTINCT b.slug) as count
			FROM businesses_1 b
			JOIN projects p ON b.slug = p.business_slug
			WHERE b.isvisible = true 
			  AND (b.slug IS NULL OR b.slug NOT LIKE '%-branch-%')
			  AND (p.isvisible = true OR p.isvisible IS NULL)
		`);

		// 4. Project count distribution (0, 1, 2, 3, 4, 5, 5+ projects)
		const projectDistributionResult = await pool.query(`
			WITH business_project_counts AS (
				SELECT 
					b.slug,
					COUNT(p.id) as project_count
				FROM businesses_1 b
				LEFT JOIN projects p ON b.slug = p.business_slug AND (p.isvisible = true OR p.isvisible IS NULL)
				WHERE b.isvisible = true 
				  AND (b.slug IS NULL OR b.slug NOT LIKE '%-branch-%')
				GROUP BY b.slug
			)
			SELECT 
				SUM(CASE WHEN project_count = 0 THEN 1 ELSE 0 END) as businesses_with_0_projects,
				SUM(CASE WHEN project_count = 1 THEN 1 ELSE 0 END) as businesses_with_1_project,
				SUM(CASE WHEN project_count = 2 THEN 1 ELSE 0 END) as businesses_with_2_projects,
				SUM(CASE WHEN project_count = 3 THEN 1 ELSE 0 END) as businesses_with_3_projects,
				SUM(CASE WHEN project_count = 4 THEN 1 ELSE 0 END) as businesses_with_4_projects,
				SUM(CASE WHEN project_count = 5 THEN 1 ELSE 0 END) as businesses_with_5_projects,
				SUM(CASE WHEN project_count > 5 THEN 1 ELSE 0 END) as businesses_with_more_than_5_projects
			FROM business_project_counts
		`);

		const totalBusinesses = parseInt(totalBusinessesResult.rows[0].total) || 0;
		const businessesWithProjects = parseInt(businessesWithProjectsResult.rows[0].count) || 0;
		
		// 3. Percentage of businesses who have posted at least one project
		const percentageWithProjects = totalBusinesses > 0 ? 
			((businessesWithProjects / totalBusinesses) * 100).toFixed(1) : 0;

		const distribution = projectDistributionResult.rows[0] || {
			businesses_with_0_projects: 0,
			businesses_with_1_project: 0,
			businesses_with_2_projects: 0,
			businesses_with_3_projects: 0,
			businesses_with_4_projects: 0,
			businesses_with_5_projects: 0,
			businesses_with_more_than_5_projects: 0
		};

		// 5. Get actual business lists for each project count category (limit to 50 per category for performance)
		const businessListsData = {};
		
		// Define project count categories
		const categories = [
			{ key: 'zeroProjects', condition: 'project_count = 0' },
			{ key: 'oneProject', condition: 'project_count = 1' },
			{ key: 'twoProjects', condition: 'project_count = 2' },
			{ key: 'threeProjects', condition: 'project_count = 3' },
			{ key: 'fourProjects', condition: 'project_count = 4' },
			{ key: 'fiveProjects', condition: 'project_count = 5' },
			{ key: 'moreThanFiveProjects', condition: 'project_count > 5' }
		];

		for (const category of categories) {
			const businessListResult = await pool.query(`
				WITH business_project_counts AS (
					SELECT 
						b.slug,
						b.businessname,
						b.district,
						b.state,
						b.created_at,
						COUNT(p.id) as project_count
					FROM businesses_1 b
					LEFT JOIN projects p ON b.slug = p.business_slug AND (p.isvisible = true OR p.isvisible IS NULL)
					WHERE b.isvisible = true 
					  AND (b.slug IS NULL OR b.slug NOT LIKE '%-branch-%')
					GROUP BY b.slug, b.businessname, b.district, b.state, b.created_at
				)
				SELECT slug, businessname, district, state, created_at, project_count
				FROM business_project_counts
				WHERE ${category.condition}
				ORDER BY created_at DESC
				LIMIT 50
			`);
			
			businessListsData[category.key] = businessListResult.rows;
		}

		return {
			analytics: {
				totalBusinesses,
				businessesWithProjects,
				percentageWithProjects: parseFloat(percentageWithProjects),
				projectDistribution: {
					zeroProjects: parseInt(distribution.businesses_with_0_projects) || 0,
					oneProject: parseInt(distribution.businesses_with_1_project) || 0,
					twoProjects: parseInt(distribution.businesses_with_2_projects) || 0,
					threeProjects: parseInt(distribution.businesses_with_3_projects) || 0,
					fourProjects: parseInt(distribution.businesses_with_4_projects) || 0,
					fiveProjects: parseInt(distribution.businesses_with_5_projects) || 0,
					moreThanFiveProjects: parseInt(distribution.businesses_with_more_than_5_projects) || 0
				},
				businessListsData
			}
		};
	} catch (error) {
		console.error('Recent projects analytics query error:', error);
		return { 
			error: 'Failed to load recent projects analytics data',
			analytics: {
				totalBusinesses: 0,
				businessesWithProjects: 0,
				percentageWithProjects: 0,
				projectDistribution: {
					zeroProjects: 0,
					oneProject: 0,
					twoProjects: 0,
					threeProjects: 0,
					fourProjects: 0,
					fiveProjects: 0,
					moreThanFiveProjects: 0
				},
				businessListsData: {}
			}
		};
	}
}