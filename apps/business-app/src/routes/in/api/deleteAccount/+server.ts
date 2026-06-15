import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

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
			`UPDATE businesses_1
			 SET isvisible = false, login_password = NULL, magic_link_token = NULL
			 WHERE id = $1`,
			[businessId]
		);

		await pool.query(`UPDATE branches SET isactive = false WHERE main_id = $1`, [businessId]);

		await pool.query(
			`UPDATE businesses_1
			 SET isvisible = false
			 WHERE id IN (SELECT branch_id FROM branches WHERE main_id = $1)`,
			[businessId]
		);

		// End the session
		authService.logout(cookies);

		return json({ success: true, message: 'Account deleted successfully' });
	} catch (error) {
		console.error('❌ Error deleting account:', error);
		return json({ success: false, error: 'Failed to delete account' }, { status: 500 });
	} finally {
		await pool.end();
	}
};
