export const prerender = false;
import { fail, redirect } from '@sveltejs/kit';

const validUsers = [
	{ email: 'admin@example.com', password: '@rB921' },
	{ email: 'admin1@example.com', password: '#rB921' }
];

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = validUsers.find((u) => u.email === email && u.password === password);

		if (!user) {
			return fail(401, { message: 'Invalid email or password' });
		}

		// Set a session cookie
		cookies.set('session', email, {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7 // 7 day
		});

		throw redirect(302, '/admin');
	}
};
