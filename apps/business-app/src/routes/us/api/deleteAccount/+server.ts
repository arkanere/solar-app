import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/us/auth/business';
import { syncBusinessToUnified, syncAccountToUnified } from '$lib/server/unifiedSync';
import type { RequestHandler } from './$types';
import { usBranches, usBusinesses } from '@solar/db/schema';
import { eq, inArray } from 'drizzle-orm';

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
		await db
			.update(usBusinesses)
			.set({ isvisible: false, loginPassword: null, magicLinkToken: null })
			.where(eq(usBusinesses.id, businessId));

		await db.update(usBranches).set({ isactive: false }).where(eq(usBranches.mainId, businessId));

		const hiddenBranches = await db
			.update(usBusinesses)
			.set({ isvisible: false })
			.where(
				inArray(
					usBusinesses.id,
					db
						.select({ branchId: usBranches.branchId })
						.from(usBranches)
						.where(eq(usBranches.mainId, businessId))
				)
			)
			.returning({ id: usBusinesses.id });

		for (const row of [{ id: businessId }, ...hiddenBranches]) {
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
