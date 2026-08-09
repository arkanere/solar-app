import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { geoLocations, businessProfiles, leaddata, projects } from '@solar/db/schema';
import { and, count, countDistinct, desc, eq } from 'drizzle-orm';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async () => {
	const [installerRows, projectRows, cityRows, leadRows, recentBusinesses] = await Promise.all([
		db
			.select({ count: count() })
			.from(businessProfiles)
			.where(eq(businessProfiles.isvisible, true)),
		db.select({ count: count() }).from(projects).where(eq(projects.isvisible, true)),
		db
			.select({ count: countDistinct(geoLocations.city) })
			.from(geoLocations)
			.where(eq(geoLocations.countryCode, 'in')),
		db.select({ count: count() }).from(leaddata),
		db
			.select({
				id: businessProfiles.businessId,
				businessname: businessProfiles.businessname,
				phonenumber: businessProfiles.phonenumber,
				city: businessProfiles.city,
				state: businessProfiles.state,
				slug: businessProfiles.slug
			})
			.from(businessProfiles)
			.where(
				and(eq(businessProfiles.isvisible, true), eq(businessProfiles.businessfilled, true))
			)
			.orderBy(desc(businessProfiles.businessId))
			.limit(9)
	]);

	return {
		installerCount: installerRows[0].count,
		projectsCompleted: projectRows[0].count,
		citiesServed: cityRows[0].count,
		leadsGenerated: leadRows[0].count + 2000,
		businesses: recentBusinesses
	};
};
