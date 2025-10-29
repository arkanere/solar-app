export const prerender = false;
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import {
	ADMIN_EMAIL_1,
	ADMIN_PASSWORD_HASH_1,
	ADMIN_EMAIL_2,
	ADMIN_PASSWORD_HASH_2
} from '$env/static/private';

const validUsers = [
	{ email: ADMIN_EMAIL_1, passwordHash: ADMIN_PASSWORD_HASH_1 },
	{ email: ADMIN_EMAIL_2, passwordHash: ADMIN_PASSWORD_HASH_2 }
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
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		throw redirect(302, '/');
	}
};
