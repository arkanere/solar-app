import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt'; // For hashing passwords

export async function POST({ request }) {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const { business_slug, token, newPassword } = await request.json();

	try {
		// Verify the token and check if it has expired
		const query = `
      SELECT reset_token, reset_token_expires
      FROM businesses_1
      WHERE slug = $1 AND reset_token = $2;
    `;
		const result = await pool.query(query, [business_slug, token]);

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Invalid or expired link.' }, { status: 400 });
		}

		const { reset_token_expires } = result.rows[0];

		if (new Date() > new Date(reset_token_expires)) {
			return json({ success: false, error: 'Link has expired' }, { status: 400 });
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update the password and clear the reset token
		const updateQuery = `
      UPDATE businesses_1
      SET login_password = $1, reset_token = NULL, reset_token_expires = NULL
      WHERE slug = $2;
    `;
		await pool.query(updateQuery, [hashedPassword, business_slug]);

		return json({ success: true });
	} catch (error) {
		console.error('Error resetting password:', error);
		return json({ success: false, error: 'Failed to reset password' }, { status: 500 });
	}
}
