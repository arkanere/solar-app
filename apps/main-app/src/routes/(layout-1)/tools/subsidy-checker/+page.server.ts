import type { PageServerLoad } from './$types';
import { getDistrictsWithInstallerCounts, getVisibleInstallerCount } from '$lib/server/queries';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async () => {
	const [districts, totalInstallers] = await Promise.all([
		getDistrictsWithInstallerCounts(),
		getVisibleInstallerCount()
	]);

	return {
		districts,
		totalInstallers
	};
};
