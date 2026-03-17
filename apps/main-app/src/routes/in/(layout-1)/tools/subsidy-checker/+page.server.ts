import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: 604800 }
};

export const load: PageServerLoad = async () => {
	const statsResult = await pool.query(
		`SELECT COUNT(*) as total_installers FROM businesses_1 WHERE isvisible = true`
	);

	return {
		totalInstallers: Number(statsResult.rows[0]?.total_installers || 0)
	};
};
