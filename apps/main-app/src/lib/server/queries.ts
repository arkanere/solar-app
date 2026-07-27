import { db } from './db';
import { locations, inBusinessProfiles } from '@solar/db/schema';
import { and, countDistinct, desc, eq, sql } from 'drizzle-orm';

export type TopDistrict = {
	name: string;
	state: string;
	stateSlug: string;
	districtSlug: string;
	installerCount: number;
};

export async function getTopDistricts(limit = 5): Promise<TopDistrict[]> {
	const installerCount = countDistinct(inBusinessProfiles.businessId);

	const rows = await db
		.select({
			district: locations.district,
			state: locations.state,
			installerCount
		})
		.from(locations)
		.innerJoin(
			inBusinessProfiles,
			and(
				sql`lower(${inBusinessProfiles.district}) = lower(${locations.district})`,
				eq(inBusinessProfiles.isvisible, true)
			)
		)
		.groupBy(locations.district, locations.state)
		.orderBy(desc(installerCount))
		.limit(limit);

	// locations.district / .state are nullable in the schema, but the join and
	// GROUP BY only ever produce rows where both are set.
	return rows.map((r) => ({
		name: r.district!,
		state: r.state!,
		stateSlug: r.state!.toLowerCase().replace(/\s+/g, '-'),
		districtSlug: r.district!.toLowerCase().replace(/\s+/g, '-'),
		installerCount: r.installerCount
	}));
}
