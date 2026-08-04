import { db } from '$lib/server/db';
import {
	businesses1,
	inBusinessAccounts,
	inBusinessProfiles,
	usBusinesses
} from '@solar/db/schema';
import { eq, sql } from 'drizzle-orm';
import { json, type RequestHandler } from '@sveltejs/kit';
import { parseBody, submitBusinessSchema } from '@solar/validation';
import { syncBusinessToUnified, syncAccountToUnified } from '$lib/server/unifiedSync';
import { isCountry } from '$lib/countries';

// US writes a single legacy table (us_businesses) where IN writes three. Both
// table sets stay exactly as they were: de-countrying these writes belongs to
// the write cutover in docs/country-scalable-architecture.md, not to this
// migration (plan §3.4).
//
// NOTE on `isvisible`: the raw INSERTs passed the number 0 for these boolean
// columns, which Postgres coerced to false on the way in. Drizzle types them
// as booleans, so they are written as `false` — same stored value.
async function insertUsBusiness(b: {
	businessName: string;
	address: string;
	plusCode: string | null;
	phoneNumber: string;
	whatsappNumber: string | null;
	email: string;
	login_email: string;
	website: string | null;
	ein: string | null;
	state: string;
	county: string;
	city: string;
}): Promise<number> {
	const inserted = await db
		.insert(usBusinesses)
		.values({
			rscore: 0,
			isvisible: false,
			businessfilled: false,
			pluscode: b.plusCode || null,
			phonenumber: b.phoneNumber,
			whatsapp: b.whatsappNumber || null,
			email: b.email || null,
			loginEmail: b.login_email,
			website: b.website || null,
			ein: b.ein || null,
			state: b.state,
			county: b.county,
			city: b.city,
			tag: 'blank',
			slug: null,
			notes: null,
			businessname: b.businessName,
			address: b.address
		})
		.returning({ id: usBusinesses.id });

	const businessId = inserted[0].id;

	// Idempotent with the us_businesses sync triggers (043/046); keeps the
	// unified tables fresh once those triggers drop (phase 2.4). 'us' is tied to
	// the table written above, exactly as 'in' is on the IN path below.
	await syncBusinessToUnified(db, 'us', businessId);
	await syncAccountToUnified(db, 'us', businessId);

	return businessId;
}

async function sendConfirmation(
	fetch: typeof globalThis.fetch,
	country: string,
	id: number,
	body: Record<string, unknown>
): Promise<void> {
	await fetch(`/${country}/api/sendBusinessSubmissionConfirmation`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id, ...body })
	});
}

export const POST: RequestHandler = async ({ request, fetch, params }) => {
	// No layout runs for a +server.ts, so the country is validated here.
	if (!params.country || !isCountry(params.country)) {
		return json({ error: 'Unknown country' }, { status: 404 });
	}

	const country = params.country;

	try {
		const parsed = await parseBody(request, submitBusinessSchema(country));
		if (!parsed.ok) {
			return json({ success: false, error: parsed.error, fields: parsed.fields }, { status: 400 });
		}
		const {
			businessName,
			address,
			plusCode,
			phoneNumber,
			whatsappNumber,
			email,
			login_email,
			website,
			gstn,
			state,
			city
		} = parsed.data;

		// The form keys level2 by the country's own noun; the schema guarantees
		// the matching one is present. Reading the wrong key drops the value
		// silently, which is the trap stage 15c of the /in plan documented.
		const level2 = (country === 'in' ? parsed.data.district : parsed.data.county) as string;

		if (country === 'us') {
			const businessId = await insertUsBusiness({
				businessName,
				address,
				plusCode,
				phoneNumber,
				whatsappNumber,
				email,
				login_email,
				website,
				ein: gstn,
				state,
				county: level2,
				city
			});
			await sendConfirmation(fetch, country, businessId, {
				businessName,
				address,
				plusCode,
				phoneNumber,
				whatsappNumber,
				email,
				login_email,
				website,
				gstn,
				state,
				county: level2,
				city
			});
			return json({ success: true, id: businessId });
		}

		const district = level2;

		// Check for duplicate GSTN. IN-only: US does not collect a tax id on
		// signup, so every US row would collide on an empty value.
		const duplicates = await db
			.select({ business_id: inBusinessProfiles.businessId })
			.from(inBusinessProfiles)
			.where(eq(inBusinessProfiles.gstn, gstn as string));

		if (duplicates.length > 0) {
			return json(
				{
					success: false,
					error:
						'A business with this GSTN already exists. Please check your GSTN or contact support if you believe this is an error.'
				},
				{ status: 400 }
			);
		}

		// Set default values for non-form fields
		const rscore = 0;
		const isvisible = false;
		const tag = 'blank';
		const slug = null;
		const notes = null;

		// TODO(remove after admin-app migrates; needs id-minting moved to
		// in_business_profiles): businesses_1 still mints the business id and keeps
		// the legacy table fresh for admin-app. The explicit upserts below are the
		// forward-facing writes; the sync triggers on businesses_1 upsert the same
		// values, so both paths are idempotent.
		const inserted = await db
			.insert(businesses1)
			.values({
				rscore,
				isvisible,
				pluscode: plusCode || null,
				phonenumber: phoneNumber,
				whatsapp: whatsappNumber || null,
				email: email || null,
				loginEmail: login_email,
				website: website || null,
				gstn: gstn || null,
				state,
				district,
				tag,
				slug,
				notes,
				city,
				businessname: businessName,
				address
			})
			.returning({ id: businesses1.id });

		const businessId = inserted[0].id;

		// Forward-facing writes: the new tables are the source of truth for the
		// /in side. ON CONFLICT keeps them idempotent against the businesses_1
		// sync triggers, which upsert the same rows.
		const profileValues = {
			businessId,
			rscore,
			isvisible,
			pluscode: plusCode || null,
			phonenumber: phoneNumber,
			whatsapp: whatsappNumber || null,
			email: email || null,
			website: website || null,
			gstn: gstn || null,
			state,
			district,
			tag,
			slug,
			notes,
			city,
			businessname: businessName,
			address
		};

		await db
			.insert(inBusinessProfiles)
			.values(profileValues)
			.onConflictDoUpdate({
				target: inBusinessProfiles.businessId,
				set: { ...profileValues, updatedAt: sql`NOW()` }
			});

		const accountValues = { businessId, loginEmail: login_email || null, isvisible };

		await db
			.insert(inBusinessAccounts)
			.values(accountValues)
			.onConflictDoUpdate({
				target: inBusinessAccounts.businessId,
				set: { ...accountValues, updatedAt: sql`NOW()` }
			});

		// Idempotent with the businesses_1/in_business_profiles sync triggers;
		// keeps the unified tables fresh once those triggers drop (phase 2.4).
		//
		// 'in' is tied to the tables written above and must NOT become
		// params.country: every INSERT on this path targets the IN-only legacy
		// tables (businesses_1, in_business_profiles, in_business_accounts), so
		// the synced row is an IN row whatever prefix the request arrived on. A
		// US request never reaches here — it returned from the us_businesses
		// branch above.
		await syncBusinessToUnified(db, 'in', businessId);
		await syncAccountToUnified(db, 'in', businessId);

		await sendConfirmation(fetch, country, businessId, {
			businessName,
			address,
			plusCode,
			phoneNumber,
			whatsappNumber,
			email,
			login_email,
			website,
			gstn,
			state,
			district,
			city
		});

		return json({ success: true, id: businessId });
	} catch (error) {
		console.error('Error inserting business data:', error);
		return json({ success: false, error: 'Failed to submit business' }, { status: 500 });
	}
};
