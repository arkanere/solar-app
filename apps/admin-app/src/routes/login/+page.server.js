export const prerender = false;
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { env } from '$env/dynamic/private';

// Decode base64 hashes (stored as base64 to avoid $ symbol issues in .env files)
const hash1 = env.ADMIN_PASSWORD_HASH_1_BASE64
	? Buffer.from(env.ADMIN_PASSWORD_HASH_1_BASE64, 'base64').toString('utf-8')
	: '';
const hash2 = env.ADMIN_PASSWORD_HASH_2_BASE64
	? Buffer.from(env.ADMIN_PASSWORD_HASH_2_BASE64, 'base64').toString('utf-8')
	: '';

const validUsers = [
	{ email: env.ADMIN_EMAIL_1, passwordHash: hash1 },
	{ email: env.ADMIN_EMAIL_2, passwordHash: hash2 }
];

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		// Find user by email
		const user = validUsers.find((u) => u.email === email);

		if (!user) {
			return fail(401, { message: 'Invalid email or password' });
		}

		// Verify password using bcrypt
		const passwordMatch = await bcrypt.compare(password, user.passwordHash);

		if (!passwordMatch) {
			return fail(401, { message: 'Invalid email or password' });
		}

		// Set a session cookie with enhanced security
		cookies.set('session', email, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		throw redirect(302, '/');
	}
};
