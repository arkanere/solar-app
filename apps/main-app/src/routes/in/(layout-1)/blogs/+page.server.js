import { redirect } from '@sveltejs/kit';

export async function load() {
	throw redirect(302, '/in/blogs/page/1');
}
