export const prerender = false;
import { fail } from '@sveltejs/kit';
import { UserAuthService } from '$lib/auth/user';
import { eq, sql } from 'drizzle-orm';
import { schema } from '@solar/db';
import { db } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

/** The saved feedback row, in the camelCase shape the page renders. */
interface Feedback {
	gotCallback: boolean;
	gotQuotation: boolean;
	recommendationRating: number;
	suggestions: string | null;
}

export const load: PageServerLoad = async ({ cookies }) => {
	const authService = new UserAuthService();
	const sessionResult = authService.validateSession(cookies);

	if (!sessionResult.success) {
		return { user: null, feedback: null as Feedback | null };
	}

	let feedback: Feedback | null = null;

	try {
		const rows = await db
			.select({
				gotCallback: schema.svUserFeedback.gotCallback,
				gotQuotation: schema.svUserFeedback.gotQuotation,
				recommendationRating: schema.svUserFeedback.recommendationRating,
				suggestions: schema.svUserFeedback.suggestions
			})
			.from(schema.svUserFeedback)
			.where(eq(schema.svUserFeedback.userId, sessionResult.user.id));
		if (rows.length > 0) {
			feedback = rows[0];
		}
	} catch (err) {
		console.error('Error fetching user feedback:', err);
	}

	return { user: sessionResult.user, feedback };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const authService = new UserAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return fail(401, { error: 'Please sign in to share your feedback.' });
		}

		const formData = await request.formData();
		const gotCallback = formData.get('gotCallback');
		const gotQuotation = formData.get('gotQuotation');
		const rating = parseInt(String(formData.get('rating') ?? ''), 10);
		const suggestions = (formData.get('suggestions') || '').toString().trim().slice(0, 2000);

		if (gotCallback !== 'yes' && gotCallback !== 'no') {
			return fail(400, { error: 'Please answer whether you got a callback from the installer.' });
		}
		if (gotQuotation !== 'yes' && gotQuotation !== 'no') {
			return fail(400, { error: 'Please answer whether you got a quotation from the installer.' });
		}
		if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
			return fail(400, { error: 'Please select a star rating between 1 and 5.' });
		}

		const values = {
			userId: sessionResult.user.id,
			gotCallback: gotCallback === 'yes',
			gotQuotation: gotQuotation === 'yes',
			recommendationRating: rating,
			suggestions: suggestions || null
		};

		try {
			await db
				.insert(schema.svUserFeedback)
				.values(values)
				.onConflictDoUpdate({
					target: schema.svUserFeedback.userId,
					set: {
						gotCallback: values.gotCallback,
						gotQuotation: values.gotQuotation,
						recommendationRating: values.recommendationRating,
						suggestions: values.suggestions,
						// `sql` escape hatch: keeps the updated_at clock on the database,
						// as the raw ON CONFLICT clause did.
						updatedAt: sql`CURRENT_TIMESTAMP`
					}
				});
		} catch (err) {
			console.error('Error saving user feedback:', err);
			return fail(500, { error: 'Something went wrong while saving your feedback. Please try again.' });
		}

		return { success: true };
	}
};
