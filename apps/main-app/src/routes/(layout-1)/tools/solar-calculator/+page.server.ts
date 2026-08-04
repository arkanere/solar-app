import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { stateSubsidies } from '@solar/db/schema';
import { asc, eq } from 'drizzle-orm';
import { getDistrictsWithInstallerCounts, getVisibleInstallerCount } from '$lib/server/queries';

export const config = {
	isr: { expiration: false }
};

export const load: PageServerLoad = async () => {
	const [districts, totalInstallers, subsidyRows] = await Promise.all([
		getDistrictsWithInstallerCounts(),
		getVisibleInstallerCount(),
		db
			.select({
				state_name: stateSubsidies.stateName,
				central_subsidy_rate: stateSubsidies.centralSubsidyRate,
				state_topup_rate: stateSubsidies.stateTopupRate
			})
			.from(stateSubsidies)
			.where(eq(stateSubsidies.status, 'published'))
			.orderBy(asc(stateSubsidies.stateName))
	]);

	return {
		districts,
		totalInstallers,
		subsidies: subsidyRows.map((r) => ({
			state: r.state_name,
			centralRate: r.central_subsidy_rate,
			stateTopup: r.state_topup_rate
		}))
	};
};
