import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { createDb } from '@solar/db';

// Single module-scoped pool, reused across warm invocations.
//
// Deliberately NOT exported (Drizzle migration, Phase 10): every query in this
// app goes through `db`, and nothing outside this file needs the raw pool. If
// you find yourself wanting it, you are probably about to write raw SQL — use
// the `sql` template escape hatch on `db` instead, which still parameterises.
const pool = createPool({ connectionString: POSTGRES_URL });

export const db = createDb(pool);
