import { pool, db } from '$lib/server/db';
import { branches, businesses1, inBusinessProfiles } from '@solar/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { parseBody, updateBusinessDetailsSchema } from '@solar/validation';
import { BusinessAuthService } from '$lib/in/auth/business';
import { syncBusinessToUnified } from '$lib/server/unifiedSync';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const parsed = await parseBody(request, updateBusinessDetailsSchema);
		if (!parsed.ok) {
			return json({ success: false, error: parsed.error, fields: parsed.fields }, { status: 400 });
		}
		const {
			businessname,
			address,
			phonenumber,
			whatsapp,
			email,
			website,
			description,
			instagram_id,
			google_maps_link,
			services,
			brands,
			business_slug // identifies the business to update
		} = parsed.data;

		// Verify the logged-in business owns the resource
		// Check if it's the main business being updated
		if (sessionResult.session.businessSlug === business_slug) {
			// Main business updating itself - allowed
		} else {
			// Check if the business_slug belongs to a branch of the logged-in business
			const [mainBusiness] = await db
				.select({ id: inBusinessProfiles.businessId })
				.from(inBusinessProfiles)
				.where(eq(inBusinessProfiles.slug, sessionResult.session.businessSlug))
				.limit(1);

			if (!mainBusiness) {
				return json({ success: false, error: 'Main business not found' }, { status: 404 });
			}

			// Check if business_slug is a branch of this main business
			const branchCheck = await db
				.select({ branchId: branches.branchId })
				.from(branches)
				.innerJoin(inBusinessProfiles, eq(branches.branchId, inBusinessProfiles.businessId))
				.where(
					and(
						eq(branches.mainId, mainBusiness.id),
						eq(inBusinessProfiles.slug, business_slug),
						eq(branches.isactive, true)
					)
				);

			if (branchCheck.length === 0) {
				return json(
					{
						success: false,
						error: 'Forbidden - You can only update your own business or branches'
					},
					{ status: 403 }
				);
			}
		}

		const values = {
			businessname,
			address,
			phonenumber,
			whatsapp,
			email,
			website,
			description,
			instagramId: instagram_id,
			googleMapsLink: google_maps_link,
			services,
			brands
		};

		// in_business_profiles is the source of truth for profile data
		const [updated] = await db
			.update(inBusinessProfiles)
			.set({ ...values, updatedAt: sql`NOW()` })
			.where(eq(inBusinessProfiles.slug, business_slug))
			.returning({ id: inBusinessProfiles.businessId });

		// TODO(remove after main-app/admin-app migrate to in_business_profiles):
		// dual-write so the marketplace and admin views stay fresh
		await db.update(businesses1).set(values).where(eq(businesses1.slug, business_slug));

		if (updated) {
			await syncBusinessToUnified(pool, 'in', updated.id);
			return json({
				success: true,
				id: updated.id
			});
		} else {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}
	} catch (error) {
		console.error('❌ Error updating business data:', error);
		return json({ success: false, error: 'Failed to update business' }, { status: 500 });
	}
};
