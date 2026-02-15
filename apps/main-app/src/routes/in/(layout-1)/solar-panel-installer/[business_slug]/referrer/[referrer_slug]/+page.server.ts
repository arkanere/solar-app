// src/routes/in/(layout-1)/solar-panel-installer/[business_slug]/referrer/[referrer_slug]/+page.server.ts

import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export const config = {
	isr: {
		expiration: 604800 // 7 days
	}
};

const pool = createPool({ connectionString: POSTGRES_URL });

export const load: PageServerLoad = async ({ params }) => {
	const businessSlug = params.business_slug;
	const referrerSlug = params.referrer_slug;

	try {
		// Get business information
		const businessResult = await pool.query(
			`SELECT id, businessname, slug FROM businesses_1 WHERE slug = $1 AND isvisible = true`,
			[businessSlug]
		);

		if (businessResult.rows.length === 0) {
			return {
				errorMessage: 'Business not found',
				businessSlug,
				referrerSlug
			};
		}

		const business = businessResult.rows[0];

		// Get referrer information
		const referrerResult = await pool.query(
			`SELECT id, business_id, name, slug, phone, email, notes
			FROM in_referrers
			WHERE business_id = $1 AND slug = $2`,
			[business.id, referrerSlug]
		);

		if (referrerResult.rows.length === 0) {
			return {
				errorMessage: 'Referrer not found',
				business,
				businessSlug,
				referrerSlug
			};
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
