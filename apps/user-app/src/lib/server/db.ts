import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { createDb } from '@solar/db';

// Single module-scoped pool, reused across warm invocations. Before this file
// existed, every handler in this app called createPool() in its own body — a
// fresh Pool per request, no reuse (the same problem the 2026-08-04 fix removed
// from business-app).
//
// Deliberately NOT exported, matching main-app and business-app (Drizzle
// migration, Phase 10): every query in this app goes through `db`. If you find
// yourself wanting the raw pool, you are probably about to write raw SQL — use
// the `sql` template escape hatch on `db` instead, which still parameterises.
const pool = createPool({ connectionString: POSTGRES_URL });

export const db = createDb(pool);
