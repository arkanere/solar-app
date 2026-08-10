import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import { json, type RequestHandler } from '@sveltejs/kit';
import { parseBody, submitBusinessSchema } from '@solar/validation';
import { syncBusinessToUnified } from '$lib/server/unifiedSync';
import { isCountry } from '$lib/countries';

// Since migration 054 both countries write the same legacy tables, keyed by
// country_code, so the separate insertUsBusiness() path is gone. The US column
// renames it used to apply (ein/county/zipcode) no longer exist — 054 copied
// the US rows into the IN columns, so gstn/district/pincode are the only names.
//
// This must ship together with 055, which repoints sv_sync_*('us', …) at these
// tables. A writer here without that migration writes rows the sync cannot see.
//
// NOTE on `isvisible`: the raw INSERTs passed the number 0 for these boolean
// columns, which Postgres coerced to false on the way in. Drizzle types them
// as booleans, so they are written as `false` — same stored value.

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

		const district = level2;

		// Check for duplicate GSTN. IN-only: US does not collect a tax id on
		// signup, so every US row would collide on an empty value. Now that both
		// countries share business_profiles this also has to be scoped by
		// country, or an IN signup could collide with a US row's NULL/empty gstn.
		if (country === 'in') {
			const duplicates = await db
				.select({ business_id: businessProfiles.businessId })
				.from(businessProfiles)
				.where(
					and(
						eq(businessProfiles.countryCode, country),
						eq(businessProfiles.gstn, gstn as string)
					)
				);

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
		}

		// Set default values for non-form fields
		const rscore = 0;
		const isvisible = false;
		const tag = 'blank';
		const slug = null;
		const notes = null;

		// `businessfilled` DEFAULTED TO TRUE on businesses_1, and the IN path has
		// always relied on that default while the old us_businesses insert set it
		// to false explicitly. business-listing filters on this column, so the two
		// countries must keep their existing values rather than converge on one.
		// business_profiles has no default, so it is passed explicitly now.
		const businessfilled = country === 'in';

		// Since 062 business_profiles mints the id itself: businesses_1_id_seq was
		// reassigned to business_id and set as its DEFAULT, so ids stay continuous
		// with every id ever issued and (country_code, source_id) identity holds.
		// The businesses_1 insert that used to stand here — purely to mint that id
		// and to stage login_email for sv_sync_account — is gone with the table.
		const inserted = await db
			.insert(businessProfiles)
			.values({
				countryCode: country,
				rscore,
				isvisible,
				businessfilled,
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
			})
			.returning({ businessId: businessProfiles.businessId });

		const businessId = inserted[0].businessId;

		// The account half. sv_sync_account used to write this row by reading
		// login_email back out of businesses_1; with that table archived, the only
		// place the address can come from is here. Skipping it would create a
		// business that cannot log in and cannot be sent a magic link — the auth
		// layer reads business_accounts throughout (PasswordManager.ts:25).
		//
		// No ON CONFLICT: business_id is freshly minted above, so a conflict on
		// (country_code, source_id) would mean the sequence handed out a live id
		// and should fail loudly rather than overwrite an existing account.
		await db.insert(businessAccounts).values({
			countryCode: country,
			sourceId: businessId,
			loginEmail: login_email,
			isvisible
		});

		// `businesses` is still a projection (063 drops it), and it sources from
		// business_profiles, written above. The account sync that stood beside
		// this call is gone — business_accounts is a store now.
		//
		// This passes the request's country rather than the literal 'in'. The old
		// comment here said it must NOT — correct at the time, because every
		// INSERT on this path hit the IN-only tables and a US request returned
		// earlier. Since 054 those same tables hold both countries and the rows
		// written above carry country_code, so the sync must match them.
		await syncBusinessToUnified(db, country, businessId);

		// The confirmation body keys level2 by the country's own noun, mirroring
		// the form: the US path sent `county` and the IN path `district`. The
		// table consolidation does not change what the email template reads.
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
			...(country === 'in' ? { district } : { county: level2 }),
			city
		});

		return json({ success: true, id: businessId });
	} catch (error) {
		console.error('Error inserting business data:', error);
		return json({ success: false, error: 'Failed to submit business' }, { status: 500 });
	}
};
