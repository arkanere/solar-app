import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: false }
};

export const load: PageServerLoad = async () => {
	const banksResult = await pool.query(
		`SELECT slug, name, interest_rate, max_amount, tenure
		 FROM solar_financing_banks
		 WHERE status = 'published'
		 ORDER BY name`
	);

	return {
		banks: banksResult.rows.map(
			(r: {
				slug: string;
				name: string;
				interest_rate: string;
				max_amount: string;
				tenure: string;
			}) => ({
				slug: r.slug,
				name: r.name,
				interestRate: r.interest_rate,
				maxAmount: r.max_amount,
				tenure: r.tenure
			})
		)
	};
};
