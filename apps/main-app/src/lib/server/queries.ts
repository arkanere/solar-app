import { pool } from './db';

export type TopDistrict = {
	name: string;
	state: string;
	stateSlug: string;
	districtSlug: string;
	installerCount: number;
};

export async function getTopDistricts(limit = 5): Promise<TopDistrict[]> {
	const result = await pool.query(
		`SELECT l.district, l.state,
		        COUNT(DISTINCT b.business_id) as installer_count
		 FROM locations l
		 JOIN in_business_profiles b ON LOWER(b.district) = LOWER(l.district) AND b.isvisible = true
		 GROUP BY l.district, l.state
		 ORDER BY installer_count DESC
		 LIMIT $1`,
		[limit]
	);

	return result.rows.map((r: { district: string; state: string; installer_count: string }) => ({
		name: r.district,
		state: r.state,
		stateSlug: r.state.toLowerCase().replace(/\s+/g, '-'),
		districtSlug: r.district.toLowerCase().replace(/\s+/g, '-'),
		installerCount: parseInt(r.installer_count)
	}));
}
