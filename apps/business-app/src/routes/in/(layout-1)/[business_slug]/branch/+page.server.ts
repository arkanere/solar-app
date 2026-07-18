import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

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
		// First, get the main business profile using the slug
		const mainBusinessQuery = `
      SELECT source_id AS id, slug, businessname, email, phonenumber, whatsapp,
        description, website, instagram_id, google_maps_link, address, pluscode,
        services, brands, tax_id AS gstn, level1 AS state, level2 AS district,
        city, postal_code AS pincode, rscore, tag, businessfilled, isvisible
      FROM businesses
      WHERE country_code = 'in' AND slug = $1
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
        b.address, b.pluscode, b.services, b.brands, b.tax_id AS gstn,
        b.level1 AS state, b.level2 AS district, b.city, b.postal_code AS pincode,
        b.rscore, b.tag, b.businessfilled, b.isvisible
      FROM branches br
      JOIN businesses b ON b.country_code = 'in' AND br.branch_id = b.source_id
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
	} catch (error) {
		console.error('❌ Error fetching branches:', error);
		return {
			errorMessage: 'Failed to load branches',
			branches: []
		};
	} finally {
		await pool.end();
	}
};
