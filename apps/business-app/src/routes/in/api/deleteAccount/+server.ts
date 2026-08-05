import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { json } from '@sveltejs/kit';
import { SessionManager } from '$lib/auth/business';
import { syncBusinessToUnified, syncAccountToUnified, syncInSplitTables } from '$lib/server/unifiedSync';
import type { RequestHandler } from './$types';
import { branches, businesses1 } from '@solar/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const POST: RequestHandler = async ({ cookies }) => {

	try {
		// Validate session and authorization
		const sessionResult = SessionManager.validateSession(cookies);

		if (!sessionResult.success) {
			return json(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		// URLs no longer carry the country, so it comes from the acting
		// business. Writes below target that country's legacy tables.
		const country = await countryForSlug(sessionResult.session.businessSlug);
		if (!country) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}

		const businessId = sessionResult.session.businessId;

		// Soft-delete the account: hide the business, disable re-login by clearing
		// credentials, and deactivate/hide any branches it owns.
		await db
			.update(businesses1)
			.set({ isvisible: false, loginPassword: null, magicLinkToken: null })
			.where(eq(businesses1.id, businessId));

		await db.update(branches).set({ isactive: false }).where(eq(branches.mainId, businessId));

		const hiddenBranches = await db
			.update(businesses1)
			.set({ isvisible: false })
			.where(
				inArray(
					businesses1.id,
					db
						.select({ branchId: branches.branchId })
						.from(branches)
						.where(eq(branches.mainId, businessId))
				)
			)
			.returning({ id: businesses1.id });

		for (const row of [{ id: businessId }, ...hiddenBranches]) {
			await syncInSplitTables(db, row.id);
			await syncBusinessToUnified(db, country, row.id);
			await syncAccountToUnified(db, country, row.id);
		}

		// End the session
		SessionManager.clearSession(cookies);

		return json({ success: true, message: 'Account deleted successfully' });
	} catch (error) {
		console.error('❌ Error deleting account:', error);
		return json({ success: false, error: 'Failed to delete account' }, { status: 500 });
	}
};
