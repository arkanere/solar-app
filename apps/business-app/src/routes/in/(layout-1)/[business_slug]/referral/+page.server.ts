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

interface Referrer {
	id: number;
	business_id: number;
	name: string;
	slug: string;
	phone?: string;
	email?: string;
	notes?: string;
	created_at: string;
	updated_at: string;
}

interface PageData {
	business?: Business;
	referrers?: Referrer[];
	error?: string;
}

export const load: PageServerLoad<PageData> = async ({ params, parent }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const businessSlug = params.business_slug;

	try {
		// Get the parent layout data which contains authentication info
		const parentData = await parent();

		// Check if we have the session data
		if (!parentData.business_session) {
			throw error(403, 'Not authorized');
		}

		// First get the business information from slug
		const businessResult = await pool.query(
			`SELECT source_id AS id, businessname, slug FROM businesses WHERE country_code = 'in' AND slug = $1`,
			[businessSlug]
		);

		if (businessResult.rows.length === 0) {
			throw error(404, 'Business not found');
		}

		const business = businessResult.rows[0] as Business;

		// Get all referrers for this business from in_referrers table
		const referrersResult = await pool.query(
			`
			SELECT
				id,
				business_id,
				name,
				slug,
				phone,
				email,
				notes,
				created_at,
				updated_at
			FROM in_referrers
			WHERE business_id = $1
			ORDER BY created_at DESC
		`,
			[business.id]
		);

		const referrers = (referrersResult.rows || []) as Referrer[];

		return {
			business,
			referrers
		};
	} catch (err) {
		// If table doesn't exist yet, return empty referrers with a warning
		if (err instanceof Error && err.message.includes('relation "in_referrers" does not exist')) {
			console.warn('Referrers table does not exist yet. Please run the SQL schema.');

			// Still try to get business info
			try {
				const businessResult = await pool.query(
					`SELECT source_id AS id, businessname, slug FROM businesses WHERE country_code = 'in' AND slug = $1`,
					[businessSlug]
				);

				return {
					business: businessResult.rows[0] as Business || undefined,
					referrers: [],
					error: 'Referrers table not created. Please contact administrator.'
				};
			} catch (e) {
				console.error('❌ Error loading business:', e);
				throw error(500, 'Failed to load business information');
			}
		}

		// Re-throw SvelteKit errors
		if (err instanceof Error && (err as unknown as { status?: number }).status) {
			throw err;
		}

		console.error('❌ Error loading referrers:', err);
		throw error(500, 'Failed to load referrers');
	} finally {
		await pool.end();
	}
};
