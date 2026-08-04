import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { inBusinessProfiles, projects } from '@solar/db/schema';
import { count, eq } from 'drizzle-orm';

export const config = {
	isr: { expiration: false }
};

export const load: PageServerLoad = async () => {
	const [installerRows, projectRows] = await Promise.all([
		db
			.select({ count: count() })
			.from(inBusinessProfiles)
			.where(eq(inBusinessProfiles.isvisible, true)),
		db.select({ count: count() }).from(projects).where(eq(projects.isvisible, true))
	]);

	return {
		installerCount: installerRows[0].count,
		projectCount: projectRows[0].count
	};
};
