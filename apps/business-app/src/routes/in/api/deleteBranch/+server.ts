import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import { syncBusinessToUnified, syncAccountToUnified, syncInSplitTables } from '$lib/server/unifiedSync';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		const { branchId } = await request.json();

		if (!branchId) {
			return json(
				{ success: false, error: 'Branch ID is required' },
				{ status: 400 }
			);
		}

		// Verify this branch belongs to the logged-in business
		const verifyQuery = `
			SELECT br.id, br.main_id, br.branch_id
			FROM branches br
			WHERE br.branch_id = $1 AND br.main_id = $2 AND br.isactive = true
		`;

		const verifyResult = await pool.query(verifyQuery, [
			branchId,
			sessionResult.session.businessId
		]);

		if (verifyResult.rows.length === 0) {
			return json(
				{ success: false, error: 'Branch not found or not authorized' },
				{ status: 403 }
			);
		}

		// Soft-delete: deactivate the branch relationship and hide from listings
		await pool.query(
			`UPDATE branches SET isactive = false WHERE branch_id = $1 AND main_id = $2`,
			[branchId, sessionResult.session.businessId]
		);

		await pool.query(
			`UPDATE businesses_1 SET isvisible = false WHERE id = $1`,
			[branchId]
		);

		await syncInSplitTables(pool, branchId);
		await syncBusinessToUnified(pool, 'in', branchId);
		await syncAccountToUnified(pool, 'in', branchId);

		return json({ success: true, message: 'Branch deleted successfully' });
	} catch (error) {
		console.error('Error deleting branch:', error);
		return json(
			{ success: false, error: 'Failed to delete branch' },
			{ status: 500 }
		);
	} finally {
		await pool.end();
	}
};
