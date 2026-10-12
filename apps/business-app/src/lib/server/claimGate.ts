import { db } from '$lib/server/db';
import { businessProfiles, leaddata, leaddataClaimrequests } from '@solar/db/schema';
import { and, countDistinct, eq, inArray, sql } from 'drizzle-orm';

/**
 * Claim counts for the 10-claim quality gate.
 *
 * `leaddata_claimrequests` is the claim history and the source of truth: one
 * row per claim, never deleted. The claimed copies in `leaddata` are the
 * business's workspace — it can hide ("delete") them — so they cannot be what
 * the gate counts, or hiding leads would lower the total.
 *
 * Counts are per account: the main profile and every branch naming it in
 * account_business_id, hidden branches included, so hiding a branch does not
 * drop its claims either.
 *
 * A claim is stale unless the business's copy of the lead is still visible and
 * has moved past "Claimed" (stage 0, status true). A hidden copy counts as
 * stale, so deleting untouched leads cannot improve the stale ratio.
 */
export async function getClaimCounts(
	businessId: number
): Promise<{ totalClaimed: number; staleClaimed: number }> {
	const accountRes = await db
		.select({ accountId: businessProfiles.accountBusinessId })
		.from(businessProfiles)
		.where(eq(businessProfiles.businessId, businessId))
		.limit(1);
	const accountId = accountRes[0]?.accountId ?? businessId;

	const profileRes = await db
		.select({ id: businessProfiles.businessId })
		.from(businessProfiles)
		.where(eq(businessProfiles.accountBusinessId, accountId));
	const ids = [...new Set([businessId, ...profileRes.map((r) => r.id)])];

	const claimWhere = and(
		inArray(leaddataClaimrequests.businessId, ids),
		eq(leaddataClaimrequests.isallotted, true)
	);

	const [totalRes, progressedRes] = await Promise.all([
		db
			.select({ count: countDistinct(leaddataClaimrequests.id) })
			.from(leaddataClaimrequests)
			.where(claimWhere),
		// The copy a claim produced is the category 2 row with the claim's
		// (lead, business) as (original_id, business_id); the UNIQUE on
		// (lead_id, business_id) makes that pairing one-to-one.
		db
			.select({ count: countDistinct(leaddataClaimrequests.id) })
			.from(leaddataClaimrequests)
			.innerJoin(
				leaddata,
				and(
					eq(leaddata.originalId, leaddataClaimrequests.leadId),
					eq(leaddata.businessId, leaddataClaimrequests.businessId),
					eq(leaddata.category, 2)
				)
			)
			.where(
				and(
					claimWhere,
					eq(leaddata.isvisible, true),
					// IS NOT TRUE so a null stage/status counts as progressed, as before.
					sql`(${leaddata.stage} = 0 AND ${leaddata.status}) IS NOT TRUE`
				)
			)
	]);

	const totalClaimed = totalRes[0]?.count ?? 0;
	const progressed = progressedRes[0]?.count ?? 0;
	return { totalClaimed, staleClaimed: totalClaimed - progressed };
}
