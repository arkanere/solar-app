import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { solarFinancingBanks } from '@solar/db/schema';
import { asc, eq, sql } from 'drizzle-orm';

export const config = {
	isr: { expiration: false }
};

export const load: PageServerLoad = async () => {
	const bankRows = await db
		.select({
			slug: solarFinancingBanks.slug,
			name: solarFinancingBanks.name,
			// Nullable columns the page arithmetic treats as required strings —
			// restated, matching the raw driver's `any`.
			interestRate: sql<string>`${solarFinancingBanks.interestRate}`,
			maxAmount: sql<string>`${solarFinancingBanks.maxAmount}`,
			tenure: sql<string>`${solarFinancingBanks.tenure}`
		})
		.from(solarFinancingBanks)
		.where(eq(solarFinancingBanks.status, 'published'))
		.orderBy(asc(solarFinancingBanks.name));

	return {
		banks: bankRows
	};
};
