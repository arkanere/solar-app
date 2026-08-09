import { db } from '$lib/server/db';
import { svReferrers } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { addReferrerSchema, parseBody } from '@solar/validation';
import { SessionManager } from '$lib/auth/business';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session and authorization
		const sessionResult = SessionManager.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const parsed = await parseBody(request, addReferrerSchema);
		if (!parsed.ok) {
			return json({ success: false, error: parsed.error, fields: parsed.fields }, { status: 400 });
		}
		const { businessId, name, slug, email, phone, notes } = parsed.data;

		// Verify the logged-in business is adding referrer for themselves
		if (sessionResult.session.businessId !== businessId) {
			return json(
				{ success: false, error: 'Forbidden - You can only add referrers to your own business' },
				{ status: 403 }
			);
		}

		// Check if referrer with same phone already exists for this business
		const phoneMatches = await db
			.select({ id: svReferrers.id })
			.from(svReferrers)
			.where(and(eq(svReferrers.businessId, businessId), eq(svReferrers.phone, phone)));

		if (phoneMatches.length > 0) {
			return json(
				{ success: false, error: 'A referrer with this phone number already exists' },
				{ status: 400 }
			);
		}

		// Check if referrer with same slug already exists for this business
		const slugMatches = await db
			.select({ id: svReferrers.id })
			.from(svReferrers)
			.where(and(eq(svReferrers.businessId, businessId), eq(svReferrers.slug, slug)));

		if (slugMatches.length > 0) {
			return json(
				{
					success: false,
					error: 'A referrer with this slug already exists. Please choose a different slug.'
				},
				{ status: 400 }
			);
		}

		// Insert referrer into database. Keys are aliased back to snake_case so the
		// JSON response shape stays identical to the raw-SQL version.
		const [newReferrer] = await db
			.insert(svReferrers)
			.values({ businessId, name, slug, phone, email, notes })
			.returning({
				id: svReferrers.id,
				business_id: svReferrers.businessId,
				name: svReferrers.name,
				slug: svReferrers.slug,
				phone: svReferrers.phone,
				email: svReferrers.email,
				notes: svReferrers.notes,
				created_at: svReferrers.createdAt,
				updated_at: svReferrers.updatedAt
			});

		return json({
			success: true,
			message: 'Referrer added successfully',
			referrer: newReferrer
		});
	} catch (error) {
		console.error('Error adding referrer:', error);

		// Handle specific database errors
		if (
			error instanceof Error &&
			error.message.includes('relation "sv_referrers" does not exist')
		) {
			return json(
				{ success: false, error: 'Referrers table not found. Please contact administrator.' },
				{ status: 500 }
			);
		}

		return json({ success: false, error: 'Failed to add referrer' }, { status: 500 });
	}
};
