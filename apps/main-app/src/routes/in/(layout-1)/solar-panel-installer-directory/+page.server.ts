import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: {
		expiration: 60 * 60 * 24 * 7
	}
};

export const load: PageServerLoad = async () => {
	const { rows } = await pool.sql`
		SELECT LOWER(state) as state, COUNT(*) as count
		FROM businesses_1
		WHERE isvisible = true
		GROUP BY LOWER(state)
	`;

	const installerCounts: Record<string, number> = {};
	for (const row of rows) {
		installerCounts[row.state] = Number(row.count);
	}

	return {
		installerCounts
	};
}
