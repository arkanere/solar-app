// Builds the integration test database's schema.
//
// Two steps:
//
//   1. tests/schema/000-baseline.sql — every table, constraint and index,
//      generated from packages/db/src/schema (see scripts/generate-test-baseline.mjs).
//      A baseline is unavoidable: 36 of the 55 tables, including leaddata,
//      businesses_1, branches, business_profiles and leaddata_claimrequests,
//      predate the migrations convention and have no CREATE TABLE anywhere in
//      the repo.
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
// can be replayed, which is what the list below is — plus 061, which is there
// for the specific reason spelled out at REWIND_TO_PRE_061.
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
	// sv_sync_lead / sv_sync_business / sv_sync_account — called explicitly by
	// the write endpoints under test, via $lib/server/unifiedSync.
	'047-unified-sync-functions.sql',
	// sv_sync_in_split — businesses_1 -> in_business_profiles/in_business_accounts.
	'050-split-sync-functions.sql',
	// Unites the per-country legacy tables under a country_code discriminator.
	// Replayable here despite being a data migration: the ALTERs are IF NOT
	// EXISTS (the regenerated baseline already has the columns), the indexes are
	// IF NOT EXISTS, the INSERT ... SELECT copies from empty us_* tables, and the
	// setval() calls are no-ops on empty sequences. What it is actually here for
	// is its CREATE OR REPLACE of sv_sync_in_split, which 050's version predates
	// — that one does not carry country_code through to in_business_profiles.
	'054-unite-country-legacy-tables.sql',
	// Repoints sv_sync_business/_account/_lead at the united tables. Must be
	// applied for the suite to mirror production: the app writes businesses_1 /
	// leaddata with a country_code, and 047's two-arm functions still read us_*
	// for the 'us' arm, so without this every US fixture syncs nothing.
	'055-repoint-sync-fns-to-united-tables.sql',
	// in_business_profiles -> business_profiles. Renames the table back to the
	// name the baseline already uses (see REWIND below) and puts the three
	// function bodies that name it onto the new one.
	'061-rename-in-business-profiles.sql',
	// businesses_1 -> businesses_1_archive, and business_accounts stops being a
	// projection. Here for the same reason 061 is: the four files above are
	// history and address businesses_1 by name in executable DDL — 054 alone has
	// six such statements (ALTER TABLE, CREATE INDEX, INSERT ... SELECT, setval)
	// — so they need the table under its old name, and this renames it forward
	// again exactly as it does on live. It also drops sv_sync_account and
	// sv_sync_in_split, which 047/050/055 recreate above; without it the test
	// database keeps two functions production no longer has, both reading a
	// table that no longer exists under that name.
	'062-archive-businesses-1.sql'
];

// 061 renamed in_business_profiles to business_profiles, so the generated
// baseline creates the new name — but the three files above are *history* and
// predate that rename, and 054 does a bare `ALTER TABLE in_business_profiles`
// and `CREATE INDEX ... ON in_business_profiles` that would fail outright
// against it. A to_regclass(...) guard is no help here: the table exists, under
// a different name.
//
// So wind the names back to what the history expects, replay it unedited, and
// let 061 — the real migration, appended to the list above — rename them
// forward again exactly as it does on live. The index and constraint names have
// to move too, or 054's `CREATE INDEX IF NOT EXISTS in_business_profiles_country_idx`
// finds no such name and creates a second index that 061 then collides with.
//
// 062 needs the same treatment for the same reason, and it is folded in here:
// the baseline now creates businesses_1_archive, while 054 addresses
// businesses_1 by name in six executable statements. Renaming it back is not
// enough on its own — 062 also moved businesses_1_id_seq's ownership to
// business_profiles.business_id and gave that column the DEFAULT, so the
// baseline emits both. Dropping the default is what puts the id back under
// businesses_1's own numbering, which is where 054's
// `setval('businesses_1_id_seq', max(id) FROM businesses_1)` expects to find it.
//
// The sequence's OWNED BY is deliberately not wound back. It is invisible to
// every statement replayed below — it only decides what a DROP TABLE takes with
// it, and nothing here drops either table.
const REWIND_TO_PRE_061 = `
	ALTER TABLE business_profiles RENAME TO in_business_profiles;
	ALTER INDEX business_profiles_slug_idx RENAME TO in_business_profiles_slug_idx;
	ALTER INDEX business_profiles_country_idx RENAME TO in_business_profiles_country_idx;
	ALTER TABLE in_business_profiles
	  RENAME CONSTRAINT business_profiles_business_id_key TO in_business_profiles_business_id_key;
	ALTER TABLE in_business_profiles ALTER COLUMN business_id DROP DEFAULT;
	ALTER TABLE businesses_1_archive RENAME TO businesses_1;
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
		await apply('rewind to pre-061/062 table names', REWIND_TO_PRE_061);

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
