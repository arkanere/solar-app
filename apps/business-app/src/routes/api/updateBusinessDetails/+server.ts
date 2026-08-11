import { db } from '$lib/server/db';
import { businessProfiles } from '@solar/db/schema';
import { and, eq, ne, sql } from 'drizzle-orm';
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

		// Verify the logged-in business owns the resource, and resolve *which row*
		// the write targets. `slug` is not unique (next-steps.md item 1), so the
		// authorization branch has to hand down an id — matching the UPDATE on the
		// slug alone would write every row in a duplicate group.
		let targetBusinessId: number;

		if (sessionResult.session.businessSlug === business_slug) {
			// Main business updating itself. The session's businessId is
			// authoritative — login resolved it from the account's email, not from
			// the slug — so no lookup is needed or wanted here.
			targetBusinessId = sessionResult.session.businessId;
		} else {
			// Check if business_slug is an active branch of the logged-in business.
			// The account_business_id predicate is what disambiguates a duplicated
			// branch slug: only a profile that genuinely belongs to this business's
			// account can match. Since 078 that single column replaces the join to
			// `branches`, and its `isactive` is this profile's own `isvisible`.
			const [branchCheck] = await db
				.select({ branchId: businessProfiles.businessId })
				.from(businessProfiles)
				.where(
					and(
						eq(businessProfiles.accountBusinessId, sessionResult.session.businessId),
						ne(businessProfiles.businessId, sessionResult.session.businessId),
						eq(businessProfiles.slug, business_slug),
						eq(businessProfiles.isvisible, true)
					)
				)
				.limit(1);

			if (!branchCheck) {
				return json(
					{
						success: false,
						error: 'Forbidden - You can only update your own business or branches'
					},
					{ status: 403 }
				);
			}

			targetBusinessId = branchCheck.branchId;
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
		// Matched on the resolved business_id, never on the slug: business_id is
		// the primary key, so this writes exactly one row even while duplicate
		// slugs exist in live data.
		const [updated] = await db
			.update(businessProfiles)
			.set({ ...values, updatedAt: sql`NOW()` })
			.where(eq(businessProfiles.businessId, targetBusinessId))
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
