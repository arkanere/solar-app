import { pool, db } from '$lib/server/db';
import { usBusinesses } from '@solar/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { parseBody, usUpdateBusinessDetailsSchema } from '@solar/validation';
import { BusinessAuthService } from '$lib/us/auth/business';
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

		const parsed = await parseBody(request, usUpdateBusinessDetailsSchema);
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
			business_slug // identifies the business to update
		} = parsed.data;

		// Verify the logged-in business owns the resource
		if (sessionResult.session.businessSlug !== business_slug) {
			return json(
				{ success: false, error: 'Forbidden - You can only update your own business' },
				{ status: 403 }
			);
		}

		const [updated] = await db
			.update(usBusinesses)
			.set({
				businessname,
				address,
				phonenumber,
				whatsapp,
				email,
				website,
				description,
				instagramId: instagram_id,
				googleMapsLink: google_maps_link
			})
			.where(eq(usBusinesses.slug, business_slug))
			.returning({ id: usBusinesses.id });

		if (updated) {
			await syncBusinessToUnified(db, 'us', updated.id);
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
