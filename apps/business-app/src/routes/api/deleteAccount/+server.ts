import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { json } from '@sveltejs/kit';
import { SessionManager } from '$lib/auth/business';
import type { RequestHandler } from './$types';
import { branches, businessAccounts, businessProfiles } from '@solar/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

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
		//
		// Since 062 this is two writes rather than one. `isvisible` is carried by
		// both halves of the split — business_profiles feeds the public listing
		// through sv_sync_business, business_accounts gates the auth layer
		// (TokenManager.ts:32) — and the credentials only exist on the account
		// side. Hiding one half and not the other leaves the account either
		// visible or still able to log in.
		await db
			.update(businessProfiles)
			.set({ isvisible: false })
			.where(eq(businessProfiles.businessId, businessId));

		await db
			.update(businessAccounts)
			.set({ isvisible: false, loginPassword: null, magicLinkToken: null })
			.where(
				and(
					eq(businessAccounts.sourceId, businessId),
					eq(businessAccounts.countryCode, country)
				)
			);

		await db.update(branches).set({ isactive: false }).where(eq(branches.mainId, businessId));

		const branchIds = db
			.select({ branchId: branches.branchId })
			.from(branches)
			.where(eq(branches.mainId, businessId));

		await db
			.update(businessProfiles)
			.set({ isvisible: false })
			.where(inArray(businessProfiles.businessId, branchIds));

		// Branches have no account row to hide since 075 — they share the main's,
		// which the update above already cleared. The fourth statement that used to
		// stand here blanked their duplicate credentials, and with the duplicates
		// gone it would match nothing.

		// No sync loop here any more. Both halves are stores since 062/064, so the
		// three updates above are the entire soft-delete; the loop existed only to
		// drive sv_sync_business over the business and each of its branches, and
		// `hiddenBranches` existed only to feed it.

		// End the session
		SessionManager.clearSession(cookies);

		return json({ success: true, message: 'Account deleted successfully' });
	} catch (error) {
		console.error('❌ Error deleting account:', error);
		return json({ success: false, error: 'Failed to delete account' }, { status: 500 });
	}
};
