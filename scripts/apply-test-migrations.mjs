// Builds the integration test database's schema.
//
// Two steps:
//
//   1. tests/schema/000-baseline.sql — every table, constraint and index,
//      generated from packages/db/src/schema (see scripts/generate-test-baseline.mjs).
//      A baseline is unavoidable: most of the tables — including leaddata,
//      branches, business_profiles and leaddata_claimrequests — predate the
//      migrations convention and have no CREATE TABLE anywhere in the repo.
//
//   2. POST_BASELINE_MIGRATIONS — the few migration files that add what an
//      introspected schema cannot express: the sv_sync_* stored functions the
//      app calls directly, and the seed rows other tables have foreign keys to.
//
// Why not simply replay all the numbered migrations on top of the baseline:
// they encode *history*, while the baseline is the *final state*. 039 creates
// business_profiles and 040 renames it to in_business_profiles — against a
// baseline that has the table under whichever name it currently carries, one of
// those two steps always fails. The same applies to every ALTER/DROP that
// assumes an earlier shape. Only files that are pure final-state declarations
// can be replayed, which is what the list below is — plus the renames and drops
// (061-067) that are there for the reasons spelled out at REWIND.
//
// Each file is sent as a single simple-protocol query, which is what lets the
// BEGIN/COMMIT the files already contain work as written.
//
// Usage: node scripts/apply-test-migrations.mjs <connection-string>

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const MIGRATIONS_DIR = join(ROOT, 'apps/main-app/src/lib/server/migrations');
const BASELINE = join(ROOT, 'tests/schema/000-baseline.sql');

// Ordered. Each entry is idempotent over the baseline — CREATE TABLE IF NOT
// EXISTS, CREATE OR REPLACE FUNCTION, INSERT ... ON CONFLICT DO NOTHING — and
// contains no rename, no drop and no trigger.
const POST_BASELINE_MIGRATIONS = [
	// sv_slugify(), plus the countries seed ('in', 'us'). business_accounts,
	// businesses and leads all carry a country_code foreign key to it, so
	// without this seed no fixture can insert a business.
	'042-countries-and-geo.sql',
	// sv_sync_lead / sv_sync_business / sv_sync_account. Only sv_sync_lead
	// survives to the end state — 062 drops the account one and 064 the business
	// one — but this is where all three are declared, so it stays.
	'047-unified-sync-functions.sql',
	// sv_sync_in_split — businesses_1 -> in_business_profiles/in_business_accounts.
	// Dropped again by 062; here so that drop has something to drop.
	'050-split-sync-functions.sql',
	// 054 used to sit here. It came off the list with 065: the one thing it was
	// here for was its CREATE OR REPLACE of sv_sync_in_split (050's version
	// predates country_code), and 062 drops that function outright — so 054 now
	// contributes nothing to the final state. Everything else in it was already
	// inert here: the ALTERs are IF NOT EXISTS against columns the baseline
	// has, the US-row copies are behind a to_regclass guard since 056, and the
	// setvals are no-ops on empty sequences. Keeping it would mean carrying four
	// executable statements against `businesses_1`, a table 065 drops.
	// Repoints sv_sync_business/_account/_lead at the united tables. Must be
	// applied for the suite to mirror production: the app writes businesses_1 /
	// leaddata with a country_code, and 047's two-arm functions still read us_*
	// for the 'us' arm, so without this every US fixture syncs nothing.
	'055-repoint-sync-fns-to-united-tables.sql',
	// in_business_profiles -> business_profiles. Renames the table back to the
	// name the baseline already uses (see REWIND below) and puts the three
	// function bodies that name it onto the new one.
	'061-rename-in-business-profiles.sql',
	// business_accounts stops being a projection. Needed for its DROP FUNCTIONs —
	// sv_sync_account and sv_sync_in_split, which 047/050/055 recreate above;
	// without this the test database keeps two functions production does not
	// have. Also reassigns businesses_1_id_seq and sets the business_id DEFAULT,
	// which the rewind below undoes so this can redo it. Its one remaining
	// businesses_1 statement — the rename to _archive — is to_regclass-guarded in
	// the file itself, since 065 means neither name exists here any more.
	'062-archive-businesses-1.sql',
	// The country-neutral column names on business_profiles, plus the composite
	// indexes and the countries FK. After everything that addresses the old names
	// (055 and 061's sv_sync_business bodies), because this is what renames them
	// forward, exactly as on live.
	'063-country-neutral-profile-columns.sql',
	// 066 sat here for exactly one commit. Its only contribution was putting
	// sv_sync_lead back onto leaddata's renamed columns, and 067 below drops that
	// function outright — so like 054 before it, it now contributes nothing to
	// the final state and carrying it would mean replaying renames that need a
	// rewind for no gain. Its rewind went with it.
	// Drops `businesses` and sv_sync_business. Last, and unlike 061/062/063 it
	// needs no rewind: nothing here is a rename, so the baseline simply stops
	// creating the table once regenerated. It still has to be replayed rather
	// than left to the baseline, because 047/055/061/063 above all recreate
	// sv_sync_business — without this the test database keeps a function
	// production no longer has, writing a table it no longer has either.
	'064-drop-businesses.sql',
	// Drops businesses_1_archive. Like 064 it needs no rewind — nothing in it is
	// a rename — and it is a no-op here because the regenerated baseline already
	// stops creating the table. It stays on the list so the replay ends exactly
	// where production does rather than relying on that.
	'065-drop-businesses-1-archive.sql',
	// Drops `leads` and sv_sync_lead, the last projection and the last sv_sync_*
	// function. Like 064 it needs no rewind — nothing in it is a rename — and the
	// DROP TABLE is a no-op here because the regenerated baseline already stops
	// creating `leads`. It has to be replayed rather than left to the baseline
	// because 047 and 055 above both recreate sv_sync_lead; without this the test
	// database keeps a function production no longer has, writing a table it no
	// longer has either. Exactly 064's situation.
	'067-drop-leads.sql',
	// Drops the last four sync_unified_* trigger functions. Not a no-op here:
	// 047 above CREATE OR REPLACEs all six, and 062 removes only the account
	// pair, so without this the test database keeps four functions production
	// does not have. No rewind and no guard — DROP FUNCTION IF EXISTS is already
	// self-skipping and nothing in the file is a rename.
	'068-drop-sync-unified-orphans.sql'
];

// The baseline is the *end state*; the files above are *history*. Where a
// replayed file addresses a name the end state no longer has, one of two things
// fixes it, and picking the wrong one wastes an afternoon:
//
//   a rename  -> wind the name back here, replay unedited, and let the real
//                migration rename it forward again. A to_regclass guard is no
//                help, because the object exists — under a different name.
//   a drop    -> a to_regclass guard in the migration itself, which is a no-op
//                on live and self-skipping here. See 062's table rename, which
//                became a drop's problem once 065 removed the archive.
//
// Three renames need winding back, and the order matters:
//
//   063  renamed business_profiles' four India-shaped columns and replaced its
//        two bare indexes with composites. Undone FIRST — the index renames for
//        061 have nothing to rename until this half is back, and 055 and 061
//        both address gstn/state/district/pincode by name. The countries FK goes
//        too, or replaying 063 fails on a duplicate constraint name.
//   061  renamed in_business_profiles to business_profiles. Its index and
//        constraint names move with it.
//   062  gave business_profiles.business_id the sequence DEFAULT. Dropped here
//        so 062 can set it again; the sequence's OWNED BY is deliberately NOT
//        wound back, since it only decides what a DROP TABLE takes with it and
//        nothing replayed here drops that table.
//
// postal_code's type is deliberately not wound back to char(6): nothing here
// reads the type, and 063's widening is a no-op against varchar(10).
const REWIND_TO_PRE_061_062_063 = `
	ALTER TABLE business_profiles RENAME COLUMN tax_id      TO gstn;
	ALTER TABLE business_profiles RENAME COLUMN level1      TO state;
	ALTER TABLE business_profiles RENAME COLUMN level2      TO district;
	ALTER TABLE business_profiles RENAME COLUMN postal_code TO pincode;
	ALTER TABLE business_profiles DROP CONSTRAINT business_profiles_country_code_fkey;
	DROP INDEX business_profiles_geo_idx;
	DROP INDEX business_profiles_country_slug_idx;
	CREATE INDEX business_profiles_country_idx ON business_profiles USING btree (country_code);
	CREATE INDEX business_profiles_slug_idx ON business_profiles USING btree (slug);

	ALTER TABLE business_profiles RENAME TO in_business_profiles;
	ALTER INDEX business_profiles_slug_idx RENAME TO in_business_profiles_slug_idx;
	ALTER INDEX business_profiles_country_idx RENAME TO in_business_profiles_country_idx;
	ALTER TABLE in_business_profiles
	  RENAME CONSTRAINT business_profiles_business_id_key TO in_business_profiles_business_id_key;
	ALTER TABLE in_business_profiles ALTER COLUMN business_id DROP DEFAULT;
`;

// The baseline cannot create businesses_1_id_seq for itself, so it is made here
// first — this is the one thing that has to run BEFORE the baseline rather than
// after it.
//
// Why the baseline can't: the sequence used to be businesses_1.id's `serial`,
// which an introspected schema round-trips fine. 062 reassigned it to
// business_profiles.business_id, so `drizzle-kit pull` now types business_id as
// `serial` (emitting a *different* sequence, business_profiles_business_id_seq)
// and businesses_1_archive.id as a plain integer carrying a bare
// `DEFAULT nextval('businesses_1_id_seq')`. Nothing then declares the sequence
// that default names, and the baseline fails on its own CREATE TABLE with
// `relation "businesses_1_id_seq" does not exist` — before a single test runs.
//
// A generated baseline cannot express "this column's default points at a
// sequence another table owns", so this gap is structural rather than a bug in
// the generator, and it will persist for as long as the archive table does.
// Creating the sequence up front costs nothing and keeps the baseline honest:
// 062 (replayed last) still does the real ALTER SEQUENCE ... OWNED BY, so the
// end state matches live.
const PRE_BASELINE_SEQUENCES = `
	CREATE SEQUENCE IF NOT EXISTS businesses_1_id_seq;
`;

// The trigger-installing migrations (043/045/046) are deliberately not applied:
// 049 and 051 drop every one of those triggers again, so the production end
// state has none, and the app does its projection with explicit sv_sync_* calls.
// Installing them here would double-write and diverge from production.

export async function applyMigrations(connectionString, { log = () => {} } = {}) {
	const client = new pg.Client({ connectionString });
	await client.connect();
	try {
		const apply = async (label, sql) => {
			try {
				await client.query(sql);
			} catch (error) {
				// Name the file — a bare Postgres error is useless on its own.
				throw new Error(`${label} failed: ${error.message}`, { cause: error });
			}
			log(`  applied ${label}`);
		};

		await apply('pre-baseline sequences', PRE_BASELINE_SEQUENCES);
		await apply('tests/schema/000-baseline.sql', await readFile(BASELINE, 'utf8'));
		await apply('rewind to pre-061/062/063 names', REWIND_TO_PRE_061_062_063);

		for (const file of POST_BASELINE_MIGRATIONS) {
			await apply(file, await readFile(join(MIGRATIONS_DIR, file), 'utf8'));
		}

		return POST_BASELINE_MIGRATIONS.length + 3;
	} finally {
		await client.end();
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const connectionString = process.argv[2] ?? process.env.TEST_POSTGRES_URL;
	if (!connectionString) {
		console.error('Usage: node scripts/apply-test-migrations.mjs <connection-string>');
		process.exit(1);
	}
	const count = await applyMigrations(connectionString, { log: console.log });
	console.log(`Applied ${count} files.`);
}
