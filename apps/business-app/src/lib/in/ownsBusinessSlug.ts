import type { Pool } from '@vercel/postgres';

/**
 * True when `targetSlug` is the session's own business or one of its active
 * branches. Mirrors the ownership check in updateBusinessDetails so callers can
 * derive authorization from the session instead of trusting a request body.
 */
export async function ownsBusinessSlug(
	pool: Pool,
	sessionBusinessSlug: string,
	targetSlug: string
): Promise<boolean> {
	if (sessionBusinessSlug === targetSlug) return true;

	const branchCheck = await pool.query(
		`SELECT 1
		 FROM branches br
		 JOIN in_business_profiles main ON br.main_id = main.business_id
		 JOIN in_business_profiles branch ON br.branch_id = branch.business_id
		 WHERE main.slug = $1 AND branch.slug = $2 AND br.isactive = true`,
		[sessionBusinessSlug, targetSlug]
	);

	return branchCheck.rows.length > 0;
}
