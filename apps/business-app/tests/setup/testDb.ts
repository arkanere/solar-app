// Test stand-in for $lib/server/db (aliased in vitest.config.ts).
//
// The app's real db.ts builds its pool with @vercel/postgres, whose driver
// talks to Neon over a WebSocket proxy and cannot reach a plain local
// Postgres. Tests therefore hand the code under test a node-postgres pool
// instead. The surface the app uses is identical — `pool.query(text, params)`,
// `pool.connect()` returning a releasable client, and a Drizzle instance over
// the same pool — so nothing in the code under test is aware of the swap.
//
// The point of the swap is the *driver*, not the SQL: every statement still
// executes against a real Postgres.

import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@solar/db/schema';
import pg from 'pg';

export const TEST_POSTGRES_URL =
	process.env.TEST_POSTGRES_URL ?? 'postgres://solar:solar@localhost:5433/solar_test';

export const pool = new pg.Pool({ connectionString: TEST_POSTGRES_URL, max: 10 });

export const db = drizzle(pool, { schema });
