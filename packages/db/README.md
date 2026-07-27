# @solar/db

Drizzle schema and client for the shared Postgres database. Consumed by the apps as a
workspace dependency (`"@solar/db": "*"`).

## The rule

**The database is the source of truth. This package is generated from it.**

Schema changes are still made the way they always were: a new numbered SQL file in
`apps/main-app/src/lib/server/migrations/`, applied to the database. Afterwards you
re-generate this package:

```sh
set -a && . apps/main-app/.env.local && set +a   # provides POSTGRES_URL
npm run pull -w @solar/db
```

`drizzle-kit generate` and `drizzle-kit push` are **never** run. Running them would fork
schema ownership away from the SQL migrations, which carry content rows (the programmatic
SEO pages) as well as DDL and are meant to be reviewed in git.

`src/schema/schema.ts` and `src/schema/relations.ts` are generated — do not hand-edit them,
the next pull overwrites both. `scripts/postpull.mjs` tidies the output afterwards; see the
comments there for what and why.

### Not in the generated schema

- `*_bak_*` / `*_prebackfill` — point-in-time backups, not application schema.
- `personal_website_blogs` — has a `tsvector` column drizzle-kit cannot parse (it emits a
  `unknown(...)` call that does not compile). No app references this table.

Both exclusions live in `drizzle.config.ts`.

## Usage

Each app builds its own Drizzle instance over the pool it already owns, so Drizzle queries
and remaining raw `pool.query()` calls share one pool:

```ts
// apps/main-app/src/lib/server/db.ts
export const pool = createPool({ connectionString: POSTGRES_URL });
export const db = createDb(pool);
```

```ts
import { db } from './db';
import { locations } from '@solar/db/schema';
import { eq } from 'drizzle-orm';

const rows = await db.select().from(locations).where(eq(locations.state, 'Kerala'));
```

### Mixing with an existing transaction

`createDb` accepts a checked-out pool client as well as a pool. That is what lets Drizzle
statements run inside a transaction that raw SQL opened with `BEGIN` — both talk to the
same connection. `apps/main-app/src/lib/server/leads.ts` does this, because the transaction
also calls `sv_sync_lead()` through the raw-SQL `syncLeadToUnified` helper.

```ts
const client = await pool.connect();
const tx = createDb(client);
await client.query('BEGIN');
// ... tx.insert(...) and client.query(...) are in the same transaction
await client.query('COMMIT');
```

## Adding an app

Add `"@solar/db": "*"` and `"drizzle-orm"` to the app's `package.json`, and add
`ssr: { noExternal: ['@solar/db'] }` to its `vite.config.js` — this package ships
TypeScript source, so it must be bundled rather than externalized into the serverless
output. For the same reason it cannot be imported by plain `node` scripts without a
TypeScript loader.
