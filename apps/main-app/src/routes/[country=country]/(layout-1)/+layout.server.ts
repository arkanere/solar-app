import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles, leaddata } from '@solar/db/schema';
import { accountOfProfile, businessInCountry } from '$lib/server/businessCountry';
import { and, count, eq } from 'drizzle-orm';
import { getCountry } from '$lib/countries';

export const load: LayoutServerLoad = async ({ params }) => {
	const country = getCountry(params.country);

	const [installerRows, leadRows] = await Promise.all([
		db
			.select({ count: count() })
			.from(businessProfiles)
			.innerJoin(businessAccounts, accountOfProfile)
			.where(and(businessInCountry(country.code), eq(businessProfiles.isvisible, true))),
		db.select({ count: count() }).from(leaddata).where(eq(leaddata.countryCode, country.code))
	]);

	return {
		country,
		aboutStats: {
			installerCount: installerRows[0].count,
			leadsGenerated: leadRows[0].count + 2000
		}
	};
};
