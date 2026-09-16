/**
 * The Drizzle handle for this app.
 *
 * Same arrangement as apps/main-app/src/lib/server/db.ts: one module-scoped
 * @vercel/postgres pool, reused across warm invocations, wrapped by
 * `createDb` from @solar/db. The only difference is where the connection
 * string comes from — SvelteKit's `$env/static/private` does not exist here,
 * so it is read from `process.env` at module load.
 *
 * The pool is deliberately NOT exported. Every query in this app goes through
 * `db`; CLAUDE.md's rule is that there is no raw SQL left anywhere, and the
 * `sql` template on `db` is the escape hatch for the awkward cases.
 */
import { createPool } from '@vercel/postgres';
import { createDb } from '@solar/db';

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error('POSTGRES_URL is not set — copy it into .env.local');
}

const pool = createPool({ connectionString });

export const db = createDb(pool);
