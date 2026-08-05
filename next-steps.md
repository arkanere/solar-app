# Next Steps

> This file tracks **open work only**. The chronological record of the Drizzle migration, the
> TypeScript conversion and the follow-up list was removed on 2026-08-05 once every phase was done;
> it is in git history if you need it.

## Where things stand — 2026-08-05

**The Drizzle migration is finished and so is every follow-up it generated.** All three apps
(`main-app`, `business-app`, `user-app`) are TypeScript, on Svelte 5 runes, and query exclusively
through Drizzle. No app exports a raw `pool`, and no hand-written SQL exists anywhere outside
`apps/business-app/tests`. Conventions and the recurring `drizzle-kit pull` gotchas live in
**CLAUDE.md** — read that before touching queries or the schema.

### Baselines

`npm run check` is on svelte-check v4, which prints **machine format** to a non-TTY: grep
`COMPLETED n FILES x ERRORS`, *not* `found x errors`. A change passes if the count does not rise.

| app | errors | warnings | notes |
| --- | --- | --- | --- |
| main-app | 10 | 1 | pre-existing, UI components |
| business-app | 61 | 0 | `.svelte` only — see the caveat below |
| user-app | 0 | 2 | clean; warnings are a11y + unused CSS |

`npm test -w solarvipani-business` — **111 tests**, all passing.

**Also run `npm run build -w <app>`** when you touch imports. `check` cannot see server code
reaching a browser bundle, and that is a hard build failure — it left business-app undeployable for
an unknown stretch before it was caught on 2026-08-05.

### Running the tests

**Docker is not installed on this machine**, so `docker compose -f docker-compose.test.yml up -d`
does not work. Build a throwaway cluster from the EDB binaries instead:

```sh
export PATH=/System/Volumes/Data/Library/PostgreSQL/16/bin:$PATH
initdb -D pgdata -U solar --auth=trust
pg_ctl -D pgdata -o "-p 5544 -k /tmp" -l pg.log start
psql -h localhost -p 5544 -U solar -d postgres \
  -c "create database solar_test;" -c "alter role solar with password 'solar' superuser;"

export TEST_POSTGRES_URL="postgres://solar:solar@localhost:5544/solar_test"
npm test -w solarvipani-business
```

The suite rebuilds its schema per run, so a fresh empty database is fine. Port 5433 answers but is
the EDB install, which has no `solar` role — do not point the suite at it.

### Live database

`apps/main-app/.env.local` holds the credentials. Use **`POSTGRES_URL_NON_POOLING`** for DDL and for
`npm run pull -w @solar/db`. **Never pull from a test cluster** — its baseline omits three
`loc_key(...)` expression indexes, so a pull from there silently drops them.

All migrations through **053** are applied to live.

### What is actually open

Three things, none urgent:

1. **`business-app`'s `check` covers far less than it looks.** Its script is
   `svelte-check --no-tsconfig --ignore "src/lib/components/ui"`, so **none of its `.ts` files are
   type-checked** — only `.svelte`. Verified by planting a deliberate type error in
   `lib/server/passwordReset.ts` and watching it pass. Long-standing (present since at least
   Phase 5.5), and it is why 61 is not comparable to main-app's 10. Worth dropping the flag, but it
   will raise the count, so give it its own commit.
2. **4 dependabot advisories** (3 high, 1 moderate) that GitHub reports on every push.
3. **`/us` looks up counties in the Indian pincode table.** `getCountyByZipcode` and both `/us`
   recent-project endpoints resolve a US zipcode against `pincode_mapping` and validate it as 6
   digits. `us_locations` has the real county data. The pattern predates the Drizzle migration and
   was deliberately left alone during it (noted under Phase 5, 2026-08-04) — it is the one item from
   the old record that was never closed.

The pre-existing UI-component errors that make up the three baselines are known and untouched.

### Landmines worth knowing before you start

- **`packages/db/src/schema/schema.ts` and `relations.ts` are generated** by
  `npm run pull -w @solar/db`. Do not hand-edit them. `index.ts` and `embeddings.ts` in the same
  directory **are** hand-maintained — `embeddings.ts` exists because `schemaFilter: ['public']`
  hides that Postgres schema from introspection.
- **`postpull.mjs` corrects two things drizzle-kit gets wrong**, including composite foreign keys,
  whose two sides come out mis-paired and produce DDL Postgres rejects. Add an entry there for any
  new composite FK.
- **Check `withTimezone` before writing a timestamp.** A plain `timestamp` column is read back in
  the process's local zone, so writing `.toISOString()` shifts it by the UTC offset.
- **Every bug fixed gets a test that reproduces it first.** That rule caught a dead `/us` endpoint
  and a timezone bug on 2026-08-05 alone.

