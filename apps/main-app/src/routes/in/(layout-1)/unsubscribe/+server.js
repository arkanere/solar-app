import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

// Handle POST request for unsubscription
export async function POST({ request }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Get the email from the request body
		const { email } = await request.json();

		// Validate email
		if (!email || typeof email !== 'string') {
			return json({ success: false, error: 'Valid email address is required' }, { status: 400 });
		}

		// Check if email is already unsubscribed
		const checkQuery = `
            SELECT email FROM unsubscribe
            WHERE email = $1
        `;
		const checkResult = await pool.query(checkQuery, [email]);

		// If email already exists in unsubscribe table, just return success
		if (checkResult.rows.length > 0) {
			return json({ success: true, message: 'Email already unsubscribed' });
		}

		// Insert email into unsubscribe table
		const insertQuery = `
            INSERT INTO unsubscribe (email)
            VALUES ($1)
            RETURNING id
        `;
		const result = await pool.query(insertQuery, [email]);

		// Respond with success and the inserted unsubscribe ID
		return json({
			success: true,
			id: result.rows[0].id,
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
