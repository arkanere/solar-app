// Minimal stand-ins for the parts of a SvelteKit RequestEvent that the route
// handlers under test actually touch: `request.json()`, `cookies`, and (for
// submitLead) `fetch`.
//
// The session cookie is produced by the real SessionManager rather than by
// stubbing out BusinessAuthService. That keeps the authorization branches in
// these handlers — 401 on no session, 403 on a mismatched business_id — under
// test instead of mocked away.

import type { Cookies } from '@sveltejs/kit';
import { SessionManager } from '$lib/auth/business/SessionManager';

export function createCookies(initial: Record<string, string> = {}): Cookies {
	const store = new Map<string, string>(Object.entries(initial));

	return {
		get: (name: string) => store.get(name),
		getAll: () => [...store].map(([name, value]) => ({ name, value })),
		set: (name: string, value: string) => {
			store.set(name, value);
		},
		delete: (name: string) => {
			store.delete(name);
		},
		serialize: (name: string, value: string) => `${name}=${value}`
	} as unknown as Cookies;
}

/** Cookies carrying a valid signed session for the given business. */
export function createSessionCookies(business: {
	id: number;
	slug: string;
	businessname: string;
}): Cookies {
	const cookies = createCookies();
	const session = SessionManager.createSession(
		{
			id: business.id,
			slug: business.slug,
			businessname: business.businessname,
			login_email: `${business.slug}@example.test`,
			isvisible: true
		},
		'password'
	);
	SessionManager.setSessionCookie(cookies, session);
	return cookies;
}

export function jsonRequest(body: unknown): Request {
	return new Request('http://localhost/test', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
}

/** A `fetch` that records calls and never touches the network. */
export function recordingFetch(): typeof fetch & { calls: Array<{ url: string; body: unknown }> } {
	const calls: Array<{ url: string; body: unknown }> = [];
	const fn = (async (url: string | URL | Request, init?: RequestInit) => {
		calls.push({
			url: String(url),
			body: init?.body ? JSON.parse(init.body as string) : null
		});
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}) as unknown as typeof fetch & { calls: typeof calls };
	fn.calls = calls;
	return fn;
}
