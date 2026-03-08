import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 604800 }
};

export const load: PageServerLoad = async ({ params }) => {
	const districtSlug = params.district_slug.toLowerCase();

	const locationResult = await pool.query(
		`SELECT DISTINCT state, district FROM locations
		 WHERE LOWER(REPLACE(district, ' ', '-')) = $1
		 LIMIT 1`,
		[districtSlug]
	);

	if (locationResult.rows.length === 0) {
		error(404, 'District not found');
	}

	const { state, district } = locationResult.rows[0];

	const [installerResult, leadResult, cityResult, nearbyResult] = await Promise.all([
		pool.query(
			`SELECT COUNT(*) as count FROM businesses_1 WHERE LOWER(district) = LOWER($1) AND isvisible = true`,
			[district]
		),
		pool.query(
			`SELECT COUNT(*) as count FROM LeadData WHERE LOWER(district) = LOWER($1) AND created_at > NOW() - INTERVAL '30 days'`,
			[district]
		),
		pool.query(`SELECT COUNT(DISTINCT city) as count FROM locations WHERE LOWER(district) = LOWER($1)`, [
			district
		]),
		pool.query(
			`SELECT DISTINCT l.district,
			        LOWER(REPLACE(l.district, ' ', '-')) as slug,
			        (SELECT COUNT(*) FROM businesses_1 b WHERE LOWER(b.district) = LOWER(l.district) AND b.isvisible = true) as installer_count
			 FROM locations l
			 WHERE LOWER(l.state) = LOWER($1) AND LOWER(l.district) != LOWER($2)
			 ORDER BY l.district ASC
			 LIMIT 6`,
			[state, district]
		)
	]);

	return {
		state,
		district,
		districtSlug,
		installerCount: parseInt(installerResult.rows[0].count, 10),
		recentLeadCount: parseInt(leadResult.rows[0].count, 10),
		cityCount: parseInt(cityResult.rows[0].count, 10),
		nearbyDistricts: nearbyResult.rows.map(
			(r: { district: string; slug: string; installer_count: string }) => ({
				name: r.district,
				slug: r.slug,
				installerCount: parseInt(r.installer_count)
			})
		)
	};
};
