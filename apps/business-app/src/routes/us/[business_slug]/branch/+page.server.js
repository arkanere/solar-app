// src/routes/business/[business_slug]/branch/+page.server.js
export const prerender = false;
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function load({ params, locals, parent }) {
	const businessSlug = params.business_slug;

	// Get the parent layout data which contains authentication info
	const parentData = await parent();

	// The parent layout already handles authentication and redirects
	// We just need to check if we have the session data
	if (!parentData.business_session) {
		throw error(403, 'Not authorized');
	}

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// First, get the main business using the slug
		const mainBusinessQuery = `
      SELECT * FROM us_businesses
      WHERE slug = $1
    `;

		const mainBusinessResult = await pool.query(mainBusinessQuery, [businessSlug]);

		if (mainBusinessResult.rows.length === 0) {
			return {
				errorMessage: 'Business not found',
				branches: []
			};
		}

		const mainBusiness = mainBusinessResult.rows[0];
		const mainBusinessId = mainBusiness.id;

		// Get all branch offices linked to this main business
		const branchesQuery = `
      SELECT b.*
      FROM us_branches br
      JOIN us_businesses b ON br.branch_id = b.id
      WHERE br.main_id = $1 AND br.isactive = true
    `;

		const branchesResult = await pool.query(branchesQuery, [mainBusinessId]);
		const branches = branchesResult.rows;

		// Also include the main business in the response
		return {
			mainBusiness,
			branches: branches,
			businessSlug
		};
	} catch (error) {
		console.error('Error fetching branches:', error);
		return {
			errorMessage: 'Failed to load branches',
			branches: []
		};
	} finally {
		await pool.end();
	}
}
