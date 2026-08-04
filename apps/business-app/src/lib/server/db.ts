import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

// Single module-scoped pool, reused across warm invocations. Mirrors
// apps/main-app/src/lib/server/db.ts. Import this instead of calling
// createPool() in handlers.
export const pool = createPool({ connectionString: POSTGRES_URL });
