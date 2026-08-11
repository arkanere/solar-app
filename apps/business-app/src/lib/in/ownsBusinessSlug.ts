import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { aliasedTable, and, eq, ne } from 'drizzle-orm';

const main = aliasedTable(businessProfiles, 'main');
const branch = aliasedTable(businessProfiles, 'branch');

/**
 * True when `targetSlug` is the session's own business or one of its active
 * branches. Mirrors the ownership check in updateBusinessDetails so callers can
 * derive authorization from the session instead of trusting a request body.
 *
 * Since 078 a branch is a profile that names another profile's business_id in
 * `account_business_id` — the `branches` table it used to join is gone, and its
 * `isactive` is now the branch profile's own `isvisible`. Country comes from the
 * account both profiles share (079), which is the same row `account_business_id`
 * already points at, so this costs one join rather than two.
 */
export async function ownsBusinessSlug(
	sessionBusinessSlug: string,
	targetSlug: string
): Promise<boolean> {
	if (sessionBusinessSlug === targetSlug) return true;

	const branchCheck = await db
		.select({ businessId: branch.businessId })
		.from(branch)
		.innerJoin(main, eq(branch.accountBusinessId, main.businessId))
		.innerJoin(businessAccounts, eq(businessAccounts.sourceId, main.businessId))
		.where(
			and(
				eq(businessAccounts.countryCode, 'in'),
				eq(main.slug, sessionBusinessSlug),
				eq(branch.slug, targetSlug),
				// A main names itself, so without this a business would own its own
				// slug through the branch arm as well as the equality above.
				ne(branch.businessId, main.businessId),
				eq(branch.isvisible, true)
			)
		);

	return branchCheck.length > 0;
}
