// POST /api/submitDesignLead — "Claim introductory price" form on /solar-design.
// Public (no auth). Saves one row to design_leads.
import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { designLeads } from '@solar/db/schema';
import type { RequestHandler } from './$types';

const SOURCES = new Set(['fb', 'wa', 'search']);

/** Trimmed string capped at `max` chars, or '' if not a string. */
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export const POST: RequestHandler = async ({ request }) => {
	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ success: false, error: 'Invalid JSON' }, { status: 400 });
	}

	// Honeypot: bots fill the hidden "website" field. Pretend success.
	if (str(body.website, 200)) return json({ success: true });

	const name = str(body.name, 120);
	const company = str(body.company, 200);
	const phone = str(body.phone, 30).replace(/\D/g, '');
	const state = str(body.state, 80);

	if (!name || !company || !state || phone.length < 10 || phone.length > 15) {
		return json({ success: false, error: 'Missing or invalid fields' }, { status: 400 });
	}

	const kwp = Number(body.nextProjectKwp);
	const source = str(body.source, 20);

	try {
		await db.insert(designLeads).values({
			name,
			company,
			phone,
			state,
			nextProjectKwp: Number.isFinite(kwp) && kwp > 0 && kwp < 1e8 ? kwp.toFixed(2) : null,
			projectsPerMonth: str(body.projectsPerMonth, 40) || null,
			wantsSample: body.wantsSample === true,
			source: SOURCES.has(source) ? source : null,
			urlParams: str(body.urlParams, 1000) || null,
			referrer: str(body.referrer, 1000) || null,
			userAgent: request.headers.get('user-agent')?.slice(0, 500) ?? null
		});
		return json({ success: true });
	} catch (error) {
		console.error('Error inserting design lead:', error);
		return json({ success: false, error: 'Failed to submit' }, { status: 500 });
	}
};
