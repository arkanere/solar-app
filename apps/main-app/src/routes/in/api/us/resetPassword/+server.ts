import { createPool, type VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

interface ResetPasswordRequest {
	business_slug: string;
	token: string;
	newPassword: string;
}

interface BusinessTokenResult {
	reset_token_expires: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });
	const { business_slug, token, newPassword } = await request.json() as ResetPasswordRequest;

	try {
		const query = `
      SELECT reset_token, reset_token_expires
      FROM us_businesses
      WHERE slug = $1 AND reset_token = $2;
    `;
		const result = await pool.query<BusinessTokenResult>(query, [business_slug, token]);

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Invalid or expired link.' }, { status: 400 });
		}

		const { reset_token_expires } = result.rows[0];

		if (new Date() > new Date(reset_token_expires)) {
			return json({ success: false, error: 'Link has expired' }, { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		const updateQuery = `
      UPDATE us_businesses
      SET login_password = $1, reset_token = NULL, reset_token_expires = NULL
      WHERE slug = $2;
    `;
		await pool.query(updateQuery, [hashedPassword, business_slug]);

		return json({ success: true });
	} catch (error) {
		console.error('Error resetting password:', error);
		return json({ success: false, error: 'Failed to reset password' }, { status: 500 });
	}
};
