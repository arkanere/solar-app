import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: {
		expiration: 1296000
	}
};

// Per-country legacy tables, per §3.4 of docs/migration-plan-delete-us.md: no
// data migration and no table switch here — de-countrying these reads belongs
// to the write cutover in docs/country-scalable-architecture.md.
//
// The level2 column (`district` in IN, `county` in US) is deliberately NOT
// selected: the installer cards render only businessname/city/state/phone/slug,
// and the IN query's unused `district` was the one thing that made this page's
// serialized payload differ across the merge. Both branches now return the
// same shape without needing an alias.
const QUERY_BY_COUNTRY: Record<string, string> = {
	us: `SELECT
        id,
        businessname,
        phonenumber,
        city,
        state,
        slug
      FROM us_businesses
      WHERE isvisible = true
      AND businessfilled = true
      ORDER BY id DESC
      LIMIT 10;`,
	in: `SELECT
        business_id AS id,
        businessname,
        phonenumber,
        city,
        state,
        slug
      FROM in_business_profiles
      WHERE isvisible = true
      AND businessfilled = true
      ORDER BY business_id DESC
      LIMIT 10;`
};

export const load: PageServerLoad = async ({ params }) => {
	try {
		const latestBusinessesResult = await pool.query(QUERY_BY_COUNTRY[params.country]);

		const businesses = latestBusinessesResult.rows;

		if (businesses.length > 0) {
			return { businesses };
		} else {
			return { errorMessage: 'No verified businesses found.' };
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load businesses' };
	}
};
