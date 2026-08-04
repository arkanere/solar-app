import { db } from '$lib/server/db';
import { unsubscribe } from '@solar/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { isCountry } from '$lib/countries';

// Handle POST request for unsubscription
export async function POST({ request, params }) {
	// No layout runs for a +server.js, so this endpoint validates the country
	// itself. The matcher already restricts [country=country], but this keeps the
	// guard local to the file that needs it.
	if (!params.country || !isCountry(params.country)) {
		return json({ success: false, error: 'Unknown country' }, { status: 404 });
	}

	try {
		// Get the email from the request body
		const { email } = await request.json();

		// Validate email
		if (!email || typeof email !== 'string') {
			return json({ success: false, error: 'Valid email address is required' }, { status: 400 });
		}

		// Check if email is already unsubscribed
		const existing = await db
			.select({ email: unsubscribe.email })
			.from(unsubscribe)
			.where(eq(unsubscribe.email, email));

		// If email already exists in unsubscribe table, just return success
		if (existing.length > 0) {
			return json({ success: true, message: 'Email already unsubscribed' });
		}

		// Insert email into unsubscribe table
		const inserted = await db
			.insert(unsubscribe)
			.values({ email })
			.returning({ id: unsubscribe.id });

		// Respond with success and the inserted unsubscribe ID
		return json({
			success: true,
			id: inserted[0].id,
			message: 'Successfully unsubscribed'
		});
	} catch (error) {
		// Log and return error response if there's an issue
		console.error('Error processing unsubscribe request:', error);
		return json(
			{
				success: false,
				error: 'Failed to process unsubscription request'
			},
			{ status: 500 }
		);
	}
}
