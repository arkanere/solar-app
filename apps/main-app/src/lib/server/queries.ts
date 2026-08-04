import { db } from './db';
import { locations, inBusinessProfiles } from '@solar/db/schema';
import { and, asc, count, countDistinct, desc, eq, sql } from 'drizzle-orm';

export type TopDistrict = {
	name: string;
	state: string;
	stateSlug: string;
	districtSlug: string;
	installerCount: number;
};

export type DistrictWithInstallerCount = {
	state: string;
	district: string;
	slug: string;
	stateSlug: string;
	installerCount: number;
};

// Every IN district, each with its visible-installer count. Shared by the
// solar-calculator and subsidy-checker tools, which built this identically.
//
// The counts come from a second, grouped query rather than a join so that
// districts with no installers still appear — the tools list all of them.
export async function getDistrictsWithInstallerCounts(): Promise<DistrictWithInstallerCount[]> {
	const [districtRows, countRows] = await Promise.all([
		db
			.selectDistinct({ state: locations.state, district: locations.district })
			.from(locations)
			.orderBy(asc(locations.state), asc(locations.district)),
		db
			.select({
				state: sql<string>`LOWER(${inBusinessProfiles.state})`,
				district: sql<string>`LOWER(${inBusinessProfiles.district})`,
				cnt: count()
			})
			.from(inBusinessProfiles)
			.where(eq(inBusinessProfiles.isvisible, true))
			.groupBy(sql`LOWER(${inBusinessProfiles.state})`, sql`LOWER(${inBusinessProfiles.district})`)
	]);

	const countMap = new Map<string, number>();
	for (const r of countRows) {
		countMap.set(`${r.state}|${r.district}`, Number(r.cnt));
	}

	// locations.state / .district are nullable in the schema; the tools have
	// always dereferenced them as strings.
	return districtRows.map((r) => ({
		state: r.state!,
		district: r.district!,
		slug: r.district!.toLowerCase().replace(/\s+/g, '-'),
		stateSlug: r.state!.toLowerCase().replace(/\s+/g, '-'),
		installerCount: countMap.get(`${r.state!.toLowerCase()}|${r.district!.toLowerCase()}`) || 0
	}));
}

export async function getVisibleInstallerCount(): Promise<number> {
	const rows = await db
		.select({ total: count() })
		.from(inBusinessProfiles)
		.where(eq(inBusinessProfiles.isvisible, true));
	return rows[0]?.total ?? 0;
}

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
