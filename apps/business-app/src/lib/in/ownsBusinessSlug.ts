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
		 JOIN businesses main ON main.country_code = 'in' AND br.main_id = main.source_id
		 JOIN businesses branch ON branch.country_code = 'in' AND br.branch_id = branch.source_id
		 WHERE main.slug = $1 AND branch.slug = $2 AND br.isactive = true`,
		[sessionBusinessSlug, targetSlug]
	);

	return branchCheck.rows.length > 0;
}
