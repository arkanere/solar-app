import { json, type RequestHandler } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';

interface GenerateUserMagicLinkRequest {
	email: string;
	name?: string;
}

const pool = createPool({ connectionString: POSTGRES_URL });

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, name }: GenerateUserMagicLinkRequest = await request.json();

		if (!email) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		// Generate magic link token (permanent until used)
		const magicLinkToken = uuidv4();
		console.log('Generated token:', magicLinkToken);

		// Check if user exists, if not create them
		const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
		const existingUserResult = await pool.query(existingUserQuery, [email]);

		let userId: number;
		if (existingUserResult.rows.length > 0) {
			// Update existing user
			userId = existingUserResult.rows[0].id;
			console.log('Updating existing user with ID:', userId);
			const updateResult = await pool.query(
				'UPDATE users SET magic_link_token = $1, name = COALESCE($2, name) WHERE id = $3',
				[magicLinkToken, name || null, userId]
			);
			console.log('Update result:', updateResult);
		} else {
			// Create new user
			console.log('Creating new user');
			const newUserResult = await pool.query(
				'INSERT INTO users (email, name, magic_link_token) VALUES ($1, $2, $3) RETURNING id',
				[email, name || null, magicLinkToken]
			);
			userId = newUserResult.rows[0].id;
			console.log('New user created with ID:', userId);
		}

		// Generate magic link URL
		const baseUrl = request.headers.get('origin') || 'https://solarvipani.com';
		const magicLinkUrl = `${baseUrl}/user/signin-link/${magicLinkToken}`;

		return json({
			success: true,
			magicLinkUrl,
			message: 'Magic link generated successfully (permanent until used)'
		});

	} catch (error) {
		console.error('Error generating user magic link:', error);
		return json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
