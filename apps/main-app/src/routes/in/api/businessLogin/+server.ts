import { json, type RequestHandler } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';
import { createPool } from '@vercel/postgres';
import type { VercelPool } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import type { BusinessLoginRequest } from '$lib/types/api';

interface BusinessRow {
	slug: string;
	login_email: string;
	login_password: string;
	businessname: string;
}

const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password }: BusinessLoginRequest = await request.json();

		// Validate input
		if (!email || !password) {
			return json(
				{
					success: false,
					message: 'Email and password are required'
				},
				{ status: 400 }
			);
		}

		// Query the database for the business with the given email
		const client = await pool.connect();
		let business: BusinessRow;

		try {
			// Get only main office (excluding branch offices) and only visible businesses
			const result = await client.query<BusinessRow>(
				'SELECT slug, login_email, login_password, businessname FROM businesses_1 WHERE login_email = $1 AND slug NOT LIKE \'%-branch-%\' AND isvisible = TRUE LIMIT 1',
				[email]
			);

			// Check if the business was found
			if (result.rows.length === 0) {
				return json(
					{
						success: false,
						message: 'Invalid email or password'
					},
					{ status: 401 }
				);
			}

			business = result.rows[0];

			// Compare the provided password with the hashed password stored in the database
			const passwordMatch = await bcrypt.compare(password, business.login_password);

			// If password doesn't match
			if (!passwordMatch) {
				return json(
					{
						success: false,
						message: 'Invalid email or password'
					},
					{ status: 401 }
				);
			}
		} catch (error) {
			console.error('Database query error:', error);
			return json(
				{
					success: false,
					message: 'Internal server error'
				},
				{ status: 500 }
			);
		} finally {
			client.release();
		}

		// Return success response with business slug and name
		return json({
			success: true,
			message: 'Login successful',
			business_slug: business.slug,
			business_name: business.businessname,
			session_token: 'temp_session_' + Date.now() // Generate a temporary session token
		});
	} catch (error) {
		console.error('Login API error:', error);
		return json(
			{
				success: false,
				message: 'Invalid request format'
			},
			{ status: 400 }
		);
	}
};
