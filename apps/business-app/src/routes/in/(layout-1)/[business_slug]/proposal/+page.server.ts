import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const prerender = false;

interface Business {
	id: number;
	businessname: string;
	slug: string;
}

interface Proposal {
	id: number;
	customer_name: string;
	phone_number: string;
	address?: string;
	email?: string;
	system_capacity_kw?: number;
	panels_brand_model?: string;
	number_of_panels?: number;
	inverter_brand_model?: string;
	notes?: string;
	created_at: string;
	updated_at: string;
}

interface PageData {
	business?: Business;
	proposals?: Proposal[];
}

export const load: PageServerLoad<PageData> = async ({ params }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const businessSlug = params.business_slug;

	try {
		// First get the business information from slug
		const businessResult = await pool.query(
			`SELECT business_id AS id, businessname, slug FROM in_business_profiles WHERE slug = $1`,
			[businessSlug]
		);

		if (businessResult.rows.length === 0) {
			throw error(404, 'Business not found');
		}

		const business = businessResult.rows[0] as Business;

		// Get proposals filtered by business slug
		const proposalsResult = await pool.query(`
			SELECT
				id,
				customer_name,
				phone_number,
				address,
				email,
				system_capacity_kw,
				panels_brand_model,
				number_of_panels,
				inverter_brand_model,
				notes,
				created_at,
				updated_at
			FROM in_proposals
			WHERE business_slug = $1
			ORDER BY created_at DESC
		`, [businessSlug]);

		const proposals = proposalsResult.rows as Proposal[];

		return {
			business,
			proposals
		};
	} catch (err) {
		console.error('❌ Error loading proposals:', err);
		throw error(500, 'Failed to load proposals');
	}
};
