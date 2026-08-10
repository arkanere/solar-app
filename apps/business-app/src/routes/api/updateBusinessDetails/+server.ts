import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { branches, businessProfiles } from '@solar/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { parseBody, updateBusinessDetailsSchema } from '@solar/validation';
import { SessionManager } from '$lib/auth/business';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session and authorization
		const sessionResult = SessionManager.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		// URLs no longer carry the country, so it comes from the acting
		// business. Writes below target that country's legacy tables.
		const country = await countryForSlug(sessionResult.session.businessSlug);
		if (!country) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
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
				.select({ id: businessProfiles.businessId })
				.from(businessProfiles)
				.where(eq(businessProfiles.slug, sessionResult.session.businessSlug))
				.limit(1);

			if (!mainBusiness) {
				return json({ success: false, error: 'Main business not found' }, { status: 404 });
			}

			// Check if business_slug is a branch of this main business
			const branchCheck = await db
				.select({ branchId: branches.branchId })
				.from(branches)
				.innerJoin(businessProfiles, eq(branches.branchId, businessProfiles.businessId))
				.where(
					and(
						eq(branches.mainId, mainBusiness.id),
						eq(businessProfiles.slug, business_slug),
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

		// business_profiles is the source of truth for profile data. The
		// businesses_1 dual-write that stood below this went with migration 062 —
		// it was TODO-tagged for "after main-app/admin-app migrate", and both have.
		//
		// NOTE: this still updates by slug with no id filter, which is the
		// remaining wrong-tenant path in next-steps.md item 1 — one business
		// saving its profile overwrites a slug-twin's row. Dropping the second
		// write halves the blast radius but does not fix it; the session carries
		// the authoritative businessId and this should select on it.
		const [updated] = await db
			.update(businessProfiles)
			.set({ ...values, updatedAt: sql`NOW()` })
			.where(eq(businessProfiles.slug, business_slug))
			.returning({ id: businessProfiles.businessId });

		if (updated) {
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
