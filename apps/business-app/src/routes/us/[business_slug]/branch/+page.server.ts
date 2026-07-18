import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { US_BUSINESS_COLUMNS } from '$lib/server/unifiedRead';

export const prerender = false;

interface Business {
	id: number;
	slug: string;
	[key: string]: unknown;
}

interface PageData {
	mainBusiness?: Business;
	branches?: Business[];
	businessSlug?: string;
	errorMessage?: string;
}

export const load: PageServerLoad<PageData> = async ({ params, parent }) => {
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
		// First, get the main business using the slug (unified table: profile
		// columns only, so credentials can never reach page data)
		const mainBusinessQuery = `
      SELECT ${US_BUSINESS_COLUMNS} FROM businesses
      WHERE country_code = 'us' AND slug = $1
    `;

		const mainBusinessResult = await pool.query(mainBusinessQuery, [businessSlug]);

		if (mainBusinessResult.rows.length === 0) {
			return {
				errorMessage: 'Business not found',
				branches: []
			};
		}

		const mainBusiness = mainBusinessResult.rows[0] as Business;
		const mainBusinessId = mainBusiness.id;

		// Get all branch offices linked to this main business
		const branchesQuery = `
      SELECT b.source_id AS id, b.slug, b.businessname, b.email, b.phonenumber,
             b.whatsapp, b.description, b.website, b.instagram_id, b.google_maps_link,
             b.address, b.pluscode, b.services, b.tax_id AS ein, b.level1 AS state,
             b.level2 AS county, b.city, b.postal_code AS zipcode, b.rscore, b.tag,
             b.notes, b.businessfilled, b.tier3, b.isvisible, b.created_at
      FROM us_branches br
      JOIN businesses b ON b.country_code = 'us' AND br.branch_id = b.source_id
      WHERE br.main_id = $1 AND br.isactive = true
    `;

		const branchesResult = await pool.query(branchesQuery, [mainBusinessId]);
		const branches = branchesResult.rows as Business[];

		// Also include the main business in the response
		return {
			mainBusiness,
			branches,
			businessSlug
		};
	} catch (err) {
		console.error('❌ Error fetching branches:', err);
		return {
			errorMessage: 'Failed to load branches',
			branches: []
		};
	} finally {
		await pool.end();
	}
};
