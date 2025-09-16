export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// 1. Total number of branches (businesses with slug containing '-branch-')
		const totalBranchesResult = await pool.query(
			'SELECT COUNT(*) as total FROM businesses_1 WHERE slug LIKE \'%-branch-%\''
		);

		// 2. Total number of main businesses that have branches
		// Extract main business slug by splitting on '-branch-' pattern
		const businessesWithBranchesResult = await pool.query(`
			SELECT COUNT(DISTINCT split_part(slug, '-branch-', 1)) as total
			FROM businesses_1 
			WHERE slug LIKE '%-branch-%'
			  AND slug IS NOT NULL
			  AND split_part(slug, '-branch-', 1) != ''
		`);

		// 3. Breakdown of businesses by number of branches (1, 2, 3, 4, more than 4)
		const branchBreakdownResult = await pool.query(`
			WITH branch_counts AS (
				SELECT 
					split_part(slug, '-branch-', 1) as main_business_slug,
					COUNT(*) as branch_count
				FROM businesses_1 
				WHERE slug LIKE '%-branch-%'
				  AND slug IS NOT NULL
				  AND split_part(slug, '-branch-', 1) != ''
				GROUP BY split_part(slug, '-branch-', 1)
			)
			SELECT 
				SUM(CASE WHEN branch_count = 1 THEN 1 ELSE 0 END) as businesses_with_1_branch,
				SUM(CASE WHEN branch_count = 2 THEN 1 ELSE 0 END) as businesses_with_2_branches,
				SUM(CASE WHEN branch_count = 3 THEN 1 ELSE 0 END) as businesses_with_3_branches,
				SUM(CASE WHEN branch_count = 4 THEN 1 ELSE 0 END) as businesses_with_4_branches,
				SUM(CASE WHEN branch_count > 4 THEN 1 ELSE 0 END) as businesses_with_more_than_4_branches
			FROM branch_counts
		`);

		// Get some example businesses with branches for verification (optional, not used in frontend)
		const exampleBranchesResult = await pool.query(`
			SELECT 
				split_part(slug, '-branch-', 1) as main_business_slug,
				COUNT(*) as branch_count,
				array_agg(businessname ORDER BY businessname) as branch_names
			FROM businesses_1 
			WHERE slug LIKE '%-branch-%'
			  AND slug IS NOT NULL
			  AND split_part(slug, '-branch-', 1) != ''
			GROUP BY split_part(slug, '-branch-', 1)
			ORDER BY branch_count DESC
			LIMIT 10
		`);

		const breakdown = branchBreakdownResult.rows[0] || {
			businesses_with_1_branch: 0,
			businesses_with_2_branches: 0,
			businesses_with_3_branches: 0,
			businesses_with_4_branches: 0,
			businesses_with_more_than_4_branches: 0
		};

		return {
			analytics: {
				totalBranches: parseInt(totalBranchesResult.rows[0].total),
				businessesWithBranches: parseInt(businessesWithBranchesResult.rows[0].total),
				branchBreakdown: {
					oneBranch: parseInt(breakdown.businesses_with_1_branch) || 0,
					twoBranches: parseInt(breakdown.businesses_with_2_branches) || 0,
					threeBranches: parseInt(breakdown.businesses_with_3_branches) || 0,
					fourBranches: parseInt(breakdown.businesses_with_4_branches) || 0,
					moreThanFour: parseInt(breakdown.businesses_with_more_than_4_branches) || 0
				},
				exampleBranches: exampleBranchesResult.rows
			}
		};
	} catch (error) {
		console.error('Business branches analytics query error:', error);
		return { 
			error: 'Failed to load business branches analytics data',
			analytics: {
				totalBranches: 0,
				businessesWithBranches: 0,
				branchBreakdown: {
					oneBranch: 0,
					twoBranches: 0,
					threeBranches: 0,
					fourBranches: 0,
					moreThanFour: 0
				},
				exampleBranches: []
			}
		};
	}
}