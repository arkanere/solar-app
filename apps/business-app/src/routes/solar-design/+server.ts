/**
 * /solar-design — public marketing landing page.
 *
 * Served as plain HTML (no Svelte, no layout, no auth). Media lives in
 * static/solar-design-assets/ with content-hashed names (cached forever).
 * The page HTML is cached on Vercel's CDN.
 */
import { env } from '$env/dynamic/public';
import page from './page.html?raw';
import type { RequestHandler } from './$types';

const html = page.replace('%POSTHOG_KEY%', env.PUBLIC_POSTHOG_KEY ?? '');

export const GET: RequestHandler = () =>
	new Response(html, {
		headers: {
			'content-type': 'text/html; charset=utf-8',
			'cache-control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800'
		}
	});
