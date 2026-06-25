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
		 JOIN businesses_1 main ON br.main_id = main.id
		 JOIN businesses_1 branch ON br.branch_id = branch.id
		 WHERE main.slug = $1 AND branch.slug = $2 AND br.isactive = true`,
		[sessionBusinessSlug, targetSlug]
	);

	return branchCheck.rows.length > 0;
}
