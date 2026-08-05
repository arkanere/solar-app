// Builds the integration test database's schema.
//
// Two steps:
//
//   1. tests/schema/000-baseline.sql — every table, constraint and index,
//      generated from packages/db/src/schema (see scripts/generate-test-baseline.mjs).
//      A baseline is unavoidable: 36 of the 55 tables, including leaddata,
//      businesses_1, branches, in_business_profiles and leaddata_claimrequests,
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
// baseline that already has in_business_profiles, the rename fails. The same
// applies to every ALTER/DROP that assumes an earlier shape. Only files that are
// pure final-state declarations can be replayed, which is what the list below is.
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
	'055-repoint-sync-fns-to-united-tables.sql'
];

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

		await apply('tests/schema/000-baseline.sql', await readFile(BASELINE, 'utf8'));

		for (const file of POST_BASELINE_MIGRATIONS) {
			await apply(file, await readFile(join(MIGRATIONS_DIR, file), 'utf8'));
		}

		return POST_BASELINE_MIGRATIONS.length + 1;
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
