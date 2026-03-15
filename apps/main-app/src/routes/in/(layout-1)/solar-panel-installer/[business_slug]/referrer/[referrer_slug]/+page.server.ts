import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const config = {
	isr: {
		expiration: 604800
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const businessSlug = params.business_slug;
	const referrerSlug = params.referrer_slug;

	try {
		const businessResult = await pool.query(
			`SELECT id, businessname, slug FROM businesses_1 WHERE slug = $1 AND isvisible = true`,
			[businessSlug]
		);

		if (businessResult.rows.length === 0) {
			error(404, { message: 'Business not found' });
		}

		const business = businessResult.rows[0];

		const referrerResult = await pool.query(
			`SELECT id, business_id, name, slug, phone, email, notes
			FROM in_referrers
			WHERE business_id = $1 AND slug = $2`,
			[business.id, referrerSlug]
		);

		if (referrerResult.rows.length === 0) {
			error(404, { message: 'Referrer not found' });
		}

		const referrer = referrerResult.rows[0];

		return {
			business,
			referrer,
			businessSlug,
			referrerSlug
		};
	} catch (error) {
		console.error('Database query error:', error);
		return {
			errorMessage: 'Failed to load page details',
			businessSlug,
			referrerSlug
		};
	}
};
