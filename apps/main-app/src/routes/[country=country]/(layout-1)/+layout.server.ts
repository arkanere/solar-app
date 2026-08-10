import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessProfiles, leads } from '@solar/db/schema';
import { and, count, eq } from 'drizzle-orm';
import { getCountry } from '$lib/countries';

export const load: LayoutServerLoad = async ({ params }) => {
	const country = getCountry(params.country);

	const [installerRows, leadRows] = await Promise.all([
		db
			.select({ count: count() })
			.from(businessProfiles)
			.where(and(eq(businessProfiles.countryCode, country.code), eq(businessProfiles.isvisible, true))),
		db.select({ count: count() }).from(leads).where(eq(leads.countryCode, country.code))
	]);

	return {
		country,
		aboutStats: {
			installerCount: installerRows[0].count,
			leadsGenerated: leadRows[0].count + 2000
		}
	};
};
