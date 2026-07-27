import { drizzle } from 'drizzle-orm/vercel-postgres';
import type { VercelPgClient } from 'drizzle-orm/vercel-postgres/session';
import * as schema from './schema';

// Drizzle wraps a connection the app already owns rather than opening its own.
// Each app keeps its existing @vercel/postgres pool and its own env handling
// ($env/static/private is SvelteKit-only and not available here), so Drizzle
// queries and the remaining raw pool.query() calls share one pool during the
// migration.
//
// `client` accepts a pool *or* a checked-out pool client. Passing a client is
// what lets a Drizzle query run inside a transaction that raw SQL opened with
// BEGIN — both talk to the same connection.
export function createDb(client: VercelPgClient) {
	return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDb>;
