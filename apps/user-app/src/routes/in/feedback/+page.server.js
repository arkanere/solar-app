export const prerender = false;
import { fail } from '@sveltejs/kit';
import { UserAuthService } from '$lib/auth/user/index.js';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const authService = new UserAuthService();
	const sessionResult = authService.validateSession(cookies);

	if (!sessionResult.success) {
		return { user: null, feedback: null };
	}

	const pool = createPool({ connectionString: POSTGRES_URL });
	let feedback = null;

	try {
		const result = await pool.query(
			`SELECT got_callback, got_quotation, recommendation_rating, suggestions
			FROM in_user_feedback
			WHERE user_id = $1`,
			[sessionResult.user.id]
		);
		if (result.rows.length > 0) {
			const row = result.rows[0];
			feedback = {
				gotCallback: row.got_callback,
				gotQuotation: row.got_quotation,
				recommendationRating: row.recommendation_rating,
				suggestions: row.suggestions
			};
		}
	} catch (err) {
		console.error('Error fetching user feedback:', err);
	}

	return { user: sessionResult.user, feedback };
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		const authService = new UserAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return fail(401, { error: 'Please sign in to share your feedback.' });
		}

		const formData = await request.formData();
		const gotCallback = formData.get('gotCallback');
		const gotQuotation = formData.get('gotQuotation');
		const rating = parseInt(formData.get('rating'), 10);
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

		const pool = createPool({ connectionString: POSTGRES_URL });

		try {
			await pool.query(
				`INSERT INTO in_user_feedback (user_id, got_callback, got_quotation, recommendation_rating, suggestions)
				VALUES ($1, $2, $3, $4, $5)
				ON CONFLICT (user_id) DO UPDATE SET
					got_callback = EXCLUDED.got_callback,
					got_quotation = EXCLUDED.got_quotation,
					recommendation_rating = EXCLUDED.recommendation_rating,
					suggestions = EXCLUDED.suggestions,
					updated_at = CURRENT_TIMESTAMP`,
				[
					sessionResult.user.id,
					gotCallback === 'yes',
					gotQuotation === 'yes',
					rating,
					suggestions || null
				]
			);
		} catch (err) {
			console.error('Error saving user feedback:', err);
			return fail(500, { error: 'Something went wrong while saving your feedback. Please try again.' });
		}

		return { success: true };
	}
};
