import { db } from '$lib/server/db';
import { businessProfiles, leaddata, leaddataClaimrequests } from '@solar/db/schema';
import { and, asc, countDistinct, eq, inArray, ne, sql } from 'drizzle-orm';

/** Claimed leads an account gets before the quality gate applies. */
export const CLAIM_GATE_MIN_CLAIMS = 3;

/**
 * Claim counts for the claim quality gate.
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
 * A claim is stale while the business's copy of the lead is at "Claimed"
 * (stage 0, status true). Hidden ("deleted") copies count by the stage they
 * were hidden at: deleting an untouched lead keeps it stale, and deleting an
 * updated lead does not make it stale again.
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
					// IS NOT TRUE so a null stage/status counts as progressed, as before.
					sql`(${leaddata.stage} = 0 AND ${leaddata.status}) IS NOT TRUE`
				)
			)
	]);

	const totalClaimed = totalRes[0]?.count ?? 0;
	const progressed = progressedRes[0]?.count ?? 0;
	return { totalClaimed, staleClaimed: totalClaimed - progressed };
}

/**
 * The oldest lead still at "Claimed" that the business can open in its CRM,
 * for the claim gate's "Update lead" button. Uses the CRM's own scope: the
 * business plus its visible branches, visible category 2 copies only.
 */
export async function getOldestStaleLeadId(businessId: number): Promise<number | null> {
	const branchRes = await db
		.select({ id: businessProfiles.businessId })
		.from(businessProfiles)
		.where(
			and(
				eq(businessProfiles.accountBusinessId, businessId),
				ne(businessProfiles.businessId, businessId),
				eq(businessProfiles.isvisible, true)
			)
		);
	const ids = [businessId, ...branchRes.map((r) => r.id)];

	const res = await db
		.select({ id: leaddata.id })
		.from(leaddata)
		.where(
			and(
				inArray(leaddata.businessId, ids),
				eq(leaddata.category, 2),
				eq(leaddata.isvisible, true),
				eq(leaddata.stage, 0),
				eq(leaddata.status, true)
			)
		)
		.orderBy(asc(leaddata.id))
		.limit(1);
	return res[0]?.id ?? null;
}
