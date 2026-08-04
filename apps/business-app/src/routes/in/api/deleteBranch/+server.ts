import { pool, db } from '$lib/server/db';
import { branches, businesses1 } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import { syncBusinessToUnified, syncAccountToUnified, syncInSplitTables } from '$lib/server/unifiedSync';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {

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
		const existingBranch = await db
			.select({ id: branches.id, mainId: branches.mainId, branchId: branches.branchId })
			.from(branches)
			.where(
				and(
					eq(branches.branchId, branchId),
					eq(branches.mainId, sessionResult.session.businessId),
					eq(branches.isactive, true)
				)
			);

		if (existingBranch.length === 0) {
			return json(
				{ success: false, error: 'Branch not found or not authorized' },
				{ status: 403 }
			);
		}

		// Soft-delete: deactivate the branch relationship and hide from listings
		await db
			.update(branches)
			.set({ isactive: false })
			.where(
				and(
					eq(branches.branchId, branchId),
					eq(branches.mainId, sessionResult.session.businessId)
				)
			);

		await db.update(businesses1).set({ isvisible: false }).where(eq(businesses1.id, branchId));

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
	}
};
