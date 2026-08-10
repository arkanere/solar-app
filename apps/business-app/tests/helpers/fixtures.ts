// Row builders for the integration suite.
//
// Deliberately thin: each helper inserts one row with the minimum a test needs
// and returns its id. No factory framework, no implicit relationships — a test
// that depends on a branch existing says so by calling createBranch().
//
// Everything writes through the raw pool rather than Drizzle. Fixtures are
// arrange-phase scaffolding, and the suite exists to catch Drizzle conversion
// mistakes; building the world with the same query layer under test would let a
// symmetrical mistake hide itself.

import { pool } from '../setup/testDb';

export async function resetDatabase(): Promise<void> {
	// TRUNCATE ... CASCADE over the tables the suite writes. Faster than
	// re-running migrations per test, and RESTART IDENTITY keeps ids small.
	// leaddata.business_id stopped being smallint with 066, but
	// leaddata_claimrequests.business_id still is, so a long-running sequence
	// would eventually overflow it.
	// businesses_1 left this list with 062 and `businesses` with 064 — the first
	// is an archive nothing writes, the second is gone. RESTART IDENTITY still
	// has to reach business_profiles.business_id, which inherited
	// businesses_1_id_seq and is where every business id now comes from.
	await pool.query(`
		TRUNCATE TABLE
			leaddata_claimrequests, leaddata, leads,
			branches, business_profiles, business_accounts,
			legal_acceptances, legal_policies,
			projects, project_management, pincode_mapping,
			rate_limits, in_user, geo_locations
		RESTART IDENTITY CASCADE
	`);
}

/**
 * Insert a geo_locations row — the country-scalable location reference the
 * branch form's district/city dropdowns read. `countries` is seeded by the
 * baseline, so the country_code FK is already satisfied for 'in' and 'us'.
 */
export async function createGeoLocation(
	countryCode: 'in' | 'us',
	level1: string,
	level2: string,
	city: string
): Promise<void> {
	const slug = (value: string) =>
		value
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');

	await pool.query(
		`INSERT INTO geo_locations
		   (country_code, level1, level2, city, level1_slug, level2_slug, city_slug)
		 VALUES ($1,$2,$3,$4,$5,$6,$7)
		 ON CONFLICT DO NOTHING`,
		[countryCode, level1, level2, city, slug(level1), slug(level2), slug(city)]
	);
}

export interface BusinessOptions {
	businessname?: string;
	slug?: string;
	loginEmail?: string;
	loginPassword?: string | null;
	district?: string | null;
	state?: string | null;
	city?: string | null;
	isvisible?: boolean;
	description?: string | null;
	googleMapsLink?: string | null;
	brands?: number[] | null;
	lastLogin?: string | null;
}

let businessSeq = 0;

/**
 * Insert a business the same way the app does since migration 062: a
 * business_profiles row (which mints the id off businesses_1_id_seq) plus the
 * business_accounts row carrying its credentials. Returns the business id.
 * There is nothing to project since 064 — these two rows are the whole business.
 *
 * The account row is not optional scaffolding — the auth layer reads
 * business_accounts for passwords, magic-link tokens and last_login, and it is
 * no longer projected from anywhere. A fixture without one produces a business
 * that cannot log in.
 */
export async function createBusiness(options: BusinessOptions = {}): Promise<number> {
	businessSeq += 1;
	const slug = options.slug ?? `test-business-${businessSeq}`;
	const {
		businessname = `Test Business ${businessSeq}`,
		loginEmail = `${slug}@example.test`,
		loginPassword = null,
		district = 'Pune',
		state = 'Maharashtra',
		city = 'Pune',
		isvisible = true,
		description = 'Solar panel installer',
		googleMapsLink = null,
		brands = null,
		lastLogin = null
	} = options;

	const { rows } = await pool.query<{ business_id: number }>(
		`INSERT INTO business_profiles
		   (businessname, slug, level2, level1, city,
		    isvisible, description, google_maps_link, brands)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
		 RETURNING business_id`,
		[businessname, slug, district, state, city, isvisible, description, googleMapsLink, brands]
	);
	const id = rows[0].business_id;

	await pool.query(
		`INSERT INTO business_accounts
		   (country_code, source_id, login_email, login_password, isvisible, last_login)
		 VALUES ('in',$1,$2,$3,$4,$5)`,
		[id, loginEmail, loginPassword, isvisible, lastLogin]
	);

	return id;
}

export interface UsBusinessOptions {
	businessname?: string;
	slug?: string;
	loginEmail?: string;
	email?: string | null;
	phonenumber?: string | null;
	state?: string | null;
	county?: string | null;
	city?: string | null;
	isvisible?: boolean;
}

/**
 * Insert a US business and project it into the unified tables, the same way
 * createBusiness() does for the IN side.
 *
 * Since migration 054 this writes one set of tables for both countries, on the
 * IN structure, discriminated by country_code — and since 062 that set is
 * business_profiles + business_accounts. The `county`/`zipcode` option names
 * are kept because that is what the US callers say, but they map to the IN
 * columns (`district`, `pincode`).
 *
 * The account row is what makes the business able to log in; without it the
 * fixture builds a listing-only business, which is almost never what a test wants.
 */
export async function createUsBusiness(options: UsBusinessOptions = {}): Promise<number> {
	businessSeq += 1;
	const slug = options.slug ?? `test-us-business-${businessSeq}`;
	const {
		businessname = `Test US Business ${businessSeq}`,
		loginEmail = `${slug}@example.test`,
		email = `contact-${slug}@example.test`,
		phonenumber = '+1-555-0100',
		state = 'California',
		county = 'Alameda',
		city = 'Oakland',
		isvisible = true
	} = options;

	const { rows } = await pool.query<{ business_id: number }>(
		`INSERT INTO business_profiles
		   (country_code, businessname, slug, email, phonenumber, level1,
		    level2, city, isvisible)
		 VALUES ('us',$1,$2,$3,$4,$5,$6,$7,$8)
		 RETURNING business_id`,
		[businessname, slug, email, phonenumber, state, county, city, isvisible]
	);
	const id = rows[0].business_id;

	await pool.query(
		`INSERT INTO business_accounts
		   (country_code, source_id, login_email, isvisible)
		 VALUES ('us',$1,$2,$3)`,
		[id, loginEmail, isvisible]
	);

	return id;
}

export interface UsLeadOptions {
	name?: string;
	phone?: string;
	email?: string | null;
	zipcode?: string;
	county?: string | null;
	/** Maps to `leaddata.level1` — named `state` since 054, renamed by 066. */
	state?: string | null;
	category?: number | null;
	isvisible?: boolean;
	claimCount?: number;
	businessId?: number | null;
	urlparams?: string | null;
}

/**
 * Insert a US lead and sync it to `leads`. Returns the leaddata id.
 *
 * Writes `leaddata` with country_code = 'us' since 054; the `zipcode`/`county`
 * options map to the country-neutral columns `postal_code`/`level2` (066).
 *
 * `state` defaults to null because that is what every US write path produces:
 * level1/level2 are resolved from `pincode_mapping`, which is IN-only, so
 * insertLead() skips the lookup for US and both other leaddata writers set
 * `level2` alone. 055's header records the same for live data. Pass it
 * explicitly to reach the category-1 read, which filters on level1 — and see
 * the note in next-steps.md, because no live US lead can match that filter.
 */
export async function createUsLead(options: UsLeadOptions = {}): Promise<number> {
	leadSeq += 1;
	const {
		name = `Test US Customer ${leadSeq}`,
		phone = `20255500${String(leadSeq).padStart(2, '0')}`,
		email = `us-customer${leadSeq}@example.test`,
		zipcode = '94601',
		county = 'Alameda',
		state = null,
		category = null,
		isvisible = true,
		claimCount = 0,
		businessId = null,
		urlparams = null
	} = options;

	const { rows } = await pool.query<{ id: number }>(
		`INSERT INTO leaddata
		   (country_code, name, phone, email, postal_code, level2, level1, category,
		    isvisible, claim_count, business_id, urlparams)
		 VALUES ('us',$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
		 RETURNING id`,
		[
			name,
			phone,
			email,
			zipcode,
			county,
			state,
			category,
			isvisible,
			claimCount,
			businessId,
			urlparams
		]
	);
	const id = rows[0].id;
	await pool.query('SELECT sv_sync_lead($1, $2)', ['us', id]);
	return id;
}

export async function createBranch(mainId: number, branchId: number, isactive = true): Promise<void> {
	await pool.query('INSERT INTO branches (main_id, branch_id, isactive) VALUES ($1, $2, $3)', [
		mainId,
		branchId,
		isactive
	]);
}

export interface LeadOptions {
	name?: string;
	phone?: string;
	email?: string | null;
	pinCode?: string;
	district?: string | null;
	state?: string | null;
	category?: number | null;
	stage?: number;
	status?: boolean;
	isvisible?: boolean;
	claimCount?: number;
	businessId?: number | null;
	createdAt?: string | null;
}

let leadSeq = 0;

/** Insert a leaddata row and sync it to `leads`. Returns the leaddata id. */
export async function createLead(options: LeadOptions = {}): Promise<number> {
	leadSeq += 1;
	const {
		name = `Test Customer ${leadSeq}`,
		phone = `90000000${String(leadSeq).padStart(2, '0')}`,
		email = `customer${leadSeq}@example.test`,
		pinCode = '411001',
		district = 'Pune',
		state = 'Maharashtra',
		category = null,
		stage = 0,
		status = true,
		isvisible = true,
		claimCount = 0,
		businessId = null,
		createdAt = null
	} = options;

	const { rows } = await pool.query<{ id: number }>(
		`INSERT INTO leaddata
		   (name, phone, email, postal_code, level2, level1, category, stage, status,
		    isvisible, claim_count, business_id, created_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, COALESCE($13::timestamptz, NOW()))
		 RETURNING id`,
		[
			name,
			phone,
			email,
			pinCode,
			district,
			state,
			category,
			stage,
			status,
			isvisible,
			claimCount,
			businessId,
			createdAt
		]
	);
	const id = rows[0].id;
	await pool.query('SELECT sv_sync_lead($1, $2)', ['in', id]);
	return id;
}

export async function createPincodeMapping(
	pincode: string,
	district: string,
	state: string | null = 'Maharashtra'
): Promise<void> {
	await pool.query('INSERT INTO pincode_mapping (pincode, district, state) VALUES ($1, $2, $3)', [
		pincode,
		district,
		state
	]);
}

export async function createProject(
	businessSlug: string,
	options: { createdAt?: string; isvisible?: boolean; title?: string } = {}
): Promise<void> {
	const { createdAt, isvisible = true, title = 'Test Project' } = options;
	await pool.query(
		`INSERT INTO projects (title, pincode, project_date, business_slug, isvisible, created_at)
		 VALUES ($1, '411001', CURRENT_DATE, $2, $3, COALESCE($4::timestamptz, NOW()))`,
		[title, businessSlug, isvisible, createdAt ?? null]
	);
}

/**
 * Put a lead into the project-management pipeline. `leadId` is the leaddata id
 * the create* helpers return, which is what project_management.lead_id keys on.
 */
export async function createProjectManagement(leadId: number, stage = 1): Promise<void> {
	await pool.query('INSERT INTO project_management (lead_id, stage) VALUES ($1, $2)', [
		leadId,
		stage
	]);
}

/**
 * Seed the lead-data-handling policy and, unless told otherwise, an acceptance
 * for `businessId`. claimLead refuses to run without a current acceptance, so
 * most lead-pipeline tests need this.
 */
export async function seedLeadDataPolicy(
	businessId: number | null,
	options: { acceptedAt?: string; skipAcceptance?: boolean; country?: 'in' | 'us' } = {}
): Promise<number> {
	const { rows } = await pool.query<{ id: number }>(
		`INSERT INTO legal_policies (type, version, summary, effective_at)
		 VALUES ('lead_data_handling', 'v1', 'Test policy', NOW() - INTERVAL '1 day')
		 ON CONFLICT (type, version) DO UPDATE SET summary = EXCLUDED.summary
		 RETURNING id`
	);
	const policyId = rows[0].id;

	if (businessId !== null && !options.skipAcceptance) {
		await pool.query(
			`INSERT INTO legal_acceptances (business_id, country_code, policy_id, accepted_at)
			 VALUES ($1, $2, $3, COALESCE($4::timestamptz, NOW()))`,
			[businessId, options.country ?? 'in', policyId, options.acceptedAt ?? null]
		);
	}

	return policyId;
}
