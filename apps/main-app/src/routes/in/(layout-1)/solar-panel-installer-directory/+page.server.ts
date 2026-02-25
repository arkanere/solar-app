// src/routes/(layout-1)/solar-panel-installer-directory/+page.server.js

import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export const config = {
	isr: {
		expiration: 60 * 60 * 24 * 7 // 7 days in seconds (604800 seconds)
	}
};

export const load: PageServerLoad = async () => {
	const pool = createPool({ connectionString: POSTGRES_URL });

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
		installerCounts,
		user: null
	};
}