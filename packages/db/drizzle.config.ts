import { defineConfig } from 'drizzle-kit';

// Introspection-only config.
//
// The numbered SQL files in apps/main-app/src/lib/server/migrations/ remain the
// source of truth for schema changes. drizzle-kit is used for `pull` (read-only
// introspection into src/schema) and never for `generate` or `push` — running
// those would fork schema ownership away from the SQL migrations.

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
	throw new Error(
		'POSTGRES_URL is not set. Run with the main-app env, e.g.\n' +
			'  set -a && . apps/main-app/.env.local && set +a && npm run pull -w @solar/db'
	);
}

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/schema/index.ts',
	out: './src/schema',
	schemaFilter: ['public'],
	// Excluded:
	//  - *_bak_* / *_prebackfill: point-in-time backups, not application schema.
	//  - personal_website_blogs: has a tsvector column drizzle-kit cannot parse;
	//    it emits `unknown("search_vector")`, which does not compile. No app
	//    references this table. If it is ever needed, the fix is a customType
	//    for tsvector applied to a hand-maintained copy of that table.
	tablesFilter: ['*', '!*_bak_*', '!*_prebackfill', '!personal_website_blogs'],
	dbCredentials: { url: connectionString }
});
