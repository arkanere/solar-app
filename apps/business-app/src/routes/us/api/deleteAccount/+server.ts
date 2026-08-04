import { pool, db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/us/auth/business';
import { syncBusinessToUnified, syncAccountToUnified } from '$lib/server/unifiedSync';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		const businessId = sessionResult.session.businessId;

		// Soft-delete the account: hide the business, disable re-login by clearing
		// credentials, and deactivate/hide any branches it owns.
		await pool.query(
			`UPDATE us_businesses
			 SET isvisible = false, login_password = NULL, magic_link_token = NULL
			 WHERE id = $1`,
			[businessId]
		);

		await pool.query(`UPDATE us_branches SET isactive = false WHERE main_id = $1`, [businessId]);

		const hiddenBranches = await pool.query<{ id: number }>(
			`UPDATE us_businesses
			 SET isvisible = false
			 WHERE id IN (SELECT branch_id FROM us_branches WHERE main_id = $1)
			 RETURNING id`,
			[businessId]
		);

		for (const row of [{ id: businessId }, ...hiddenBranches.rows]) {
			await syncBusinessToUnified(db, 'us', row.id);
			await syncAccountToUnified(db, 'us', row.id);
		}

		// End the session
		authService.logout(cookies);

		return json({ success: true, message: 'Account deleted successfully' });
	} catch (error) {
		console.error('❌ Error deleting account:', error);
		return json({ success: false, error: 'Failed to delete account' }, { status: 500 });
	}
};
