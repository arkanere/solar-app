import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { inBusinessProfiles, leaddata, locations } from '@solar/db/schema';
import { and, asc, count, countDistinct, eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const districtSlug = params.district_slug.toLowerCase();

	// state/district are nullable columns the page uses as required strings —
	// restated non-null, matching the raw driver's `any`.
	const locationRows = await db
		.selectDistinct({
			state: sql<string>`${locations.state}`,
			district: sql<string>`${locations.district}`
		})
		.from(locations)
		.where(sql`LOWER(REPLACE(${locations.district}, ' ', '-')) = ${districtSlug}`)
		.limit(1);

	if (locationRows.length === 0) {
		error(404, 'District not found');
	}

	const { state, district } = locationRows[0];

	const [installerRows, leadRows, cityRows, nearbyRows] = await Promise.all([
		db
			.select({ count: count() })
			.from(inBusinessProfiles)
			.where(
				and(
					sql`LOWER(${inBusinessProfiles.district}) = LOWER(${district})`,
					eq(inBusinessProfiles.isvisible, true)
				)
			),
		db
			.select({ count: count() })
			.from(leaddata)
			.where(
				and(
					sql`LOWER(${leaddata.district}) = LOWER(${district})`,
					sql`${leaddata.createdAt} > NOW() - INTERVAL '30 days'`
				)
			),
		db
			.select({ count: countDistinct(locations.city) })
			.from(locations)
			.where(sql`LOWER(${locations.district}) = LOWER(${district})`),
		db
			.selectDistinct({
				district: sql<string>`${locations.district}`,
				slug: sql<string>`LOWER(REPLACE(${locations.district}, ' ', '-'))`,
				installer_count: sql<string>`(SELECT COUNT(*) FROM in_business_profiles b
				        WHERE LOWER(b.district) = LOWER(${locations.district}) AND b.isvisible = true)`
			})
			.from(locations)
			.where(
				and(
					sql`LOWER(${locations.state}) = LOWER(${state})`,
					sql`LOWER(${locations.district}) != LOWER(${district})`
				)
			)
			.orderBy(asc(locations.district))
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
