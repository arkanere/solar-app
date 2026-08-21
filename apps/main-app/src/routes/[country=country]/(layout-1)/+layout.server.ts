import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessAccounts, leaddata } from '@solar/db/schema';
import { count, eq } from 'drizzle-orm';
import { getCountry } from '$lib/countries';

// Both counts are platform-wide totals, not per-country. They were scoped to
// params.country until 2026-08-21, which made /us advertise its own 6
// installers and 4 leads as if that were the whole platform. The other two
// readers of these numbers — routes/(layout-1)/+layout.server.ts and
// partners/+page.server.ts — were already counting platform-wide, so scoping
// here was also what made the three disagree.
//
// The installer count is one row per *business*: business_accounts.is_active.
// It used to count business_profiles, which is one row per location — 6,710
// rows across 6,507 accounts — so a multi-branch installer was counted once
// per branch and the headline read 646 instead of 470.
//
// `country` is still resolved and returned: everything else under this layout
// is country-specific, only these two headline stats are not.
export const load: LayoutServerLoad = async ({ params }) => {
	const country = getCountry(params.country);

	const [installerRows, leadRows] = await Promise.all([
		db
			.select({ count: count() })
			.from(businessAccounts)
			.where(eq(businessAccounts.isActive, true)),
		db.select({ count: count() }).from(leaddata)
	]);

	return {
		country,
		aboutStats: {
			installerCount: installerRows[0].count,
			leadsGenerated: leadRows[0].count + 2000
		}
	};
};
