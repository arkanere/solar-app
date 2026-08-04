import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { createDb } from '@solar/db';

// Single module-scoped pool, reused across warm invocations. Mirrors
// apps/main-app/src/lib/server/db.ts. Import this instead of calling
// createPool() in handlers.
export const pool = createPool({ connectionString: POSTGRES_URL });

// Drizzle wraps the same pool, so converted and not-yet-converted queries share
// one connection pool (and can share a transaction). `pool` stays exported for
// the raw SQL that hasn't been migrated.
export const db = createDb(pool);
