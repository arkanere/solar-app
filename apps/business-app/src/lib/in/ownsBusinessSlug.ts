import { db } from '$lib/server/db';
import { branches, businessProfiles } from '@solar/db/schema';
import { aliasedTable, and, eq } from 'drizzle-orm';

const main = aliasedTable(businessProfiles, 'main');
const branch = aliasedTable(businessProfiles, 'branch');

/**
 * True when `targetSlug` is the session's own business or one of its active
 * branches. Mirrors the ownership check in updateBusinessDetails so callers can
 * derive authorization from the session instead of trusting a request body.
 */
export async function ownsBusinessSlug(
	sessionBusinessSlug: string,
	targetSlug: string
): Promise<boolean> {
	if (sessionBusinessSlug === targetSlug) return true;

	const branchCheck = await db
		.select({ id: branches.id })
		.from(branches)
		.innerJoin(main, and(eq(main.countryCode, 'in'), eq(branches.mainId, main.businessId)))
		.innerJoin(branch, and(eq(branch.countryCode, 'in'), eq(branches.branchId, branch.businessId)))
		.where(
			and(
				eq(main.slug, sessionBusinessSlug),
				eq(branch.slug, targetSlug),
				eq(branches.isactive, true)
			)
		);

	return branchCheck.length > 0;
}
