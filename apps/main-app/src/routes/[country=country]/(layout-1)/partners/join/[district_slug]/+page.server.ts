import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { geoLocations, businessProfiles, leaddata } from '@solar/db/schema';
import { and, asc, count, countDistinct, eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const districtSlug = params.district_slug.toLowerCase();

	// geo_locations carries the precomputed slugs, so this is an exact indexed
	// lookup rather than the LOWER(REPLACE(...)) scan it replaces.
	const locationRows = await db
		.selectDistinct({ state: geoLocations.level1, district: geoLocations.level2 })
		.from(geoLocations)
		.where(and(eq(geoLocations.countryCode, 'in'), eq(geoLocations.level2Slug, districtSlug)))
		.limit(1);

	if (locationRows.length === 0) {
		error(404, 'District not found');
	}

	const { state, district } = locationRows[0];

	const [installerRows, leadRows, cityRows, nearbyRows] = await Promise.all([
		db
			.select({ count: count() })
			.from(businessProfiles)
			.where(
				and(
					sql`LOWER(${businessProfiles.level2}) = LOWER(${district})`,
					eq(businessProfiles.isvisible, true)
				)
			),
		db
			.select({ count: count() })
			.from(leaddata)
			.where(
				and(
					sql`LOWER(${leaddata.level2}) = LOWER(${district})`,
					sql`${leaddata.createdAt} > NOW() - INTERVAL '30 days'`
				)
			),
		db
			.select({ count: countDistinct(geoLocations.city) })
			.from(geoLocations)
			.where(
				and(
					eq(geoLocations.countryCode, 'in'),
					sql`LOWER(${geoLocations.level2}) = LOWER(${district})`
				)
			),
		db
			.selectDistinct({
				district: geoLocations.level2,
				slug: geoLocations.level2Slug,
				installer_count: sql<string>`(SELECT COUNT(*) FROM business_profiles b
				        WHERE LOWER(b.district) = LOWER(${geoLocations.level2}) AND b.isvisible = true)`
			})
			.from(geoLocations)
			.where(
				and(
					eq(geoLocations.countryCode, 'in'),
					sql`LOWER(${geoLocations.level1}) = LOWER(${state})`,
					sql`LOWER(${geoLocations.level2}) != LOWER(${district})`
				)
			)
			.orderBy(asc(geoLocations.level2))
			.limit(6)
	]);

	return {
		state,
		district,
		districtSlug,
		installerCount: installerRows[0].count,
		recentLeadCount: leadRows[0].count,
		cityCount: cityRows[0].count,
		nearbyDistricts: nearbyRows.map((r) => ({
			name: r.district,
			slug: r.slug,
			installerCount: parseInt(r.installer_count)
		}))
	};
};
