# CLAUDE.md

Ask, don't assume. If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements.

Simplest solution first. Always implement the simplest thing that could work. Do not add abstractions or flexibility that weren't explicitly requested.

Don't touch unrelated code. If a file or function is not directly part of the current task, do not modify it, even if you think it could be improved.

Flag uncertainty explicitly. If you are not confident about an approach or technical detail, say so before proceeding. Confidence without certainty causes more damage than admitting a gap.

I'm always open to ideas on better ways to do things. Please don't hesitate to suggest a better way, or one that has long lasting impact over a tactical change. (as a few examples)"

Always respond in simple technical english.


## Git

Commit straight to `main` and push. Don't create a branch and don't open a pull request
unless I ask for one — solo maintainer, no review step to wait on.

## Database queries

All queries use Drizzle (`db` from `$lib/server/db`). **All three apps are fully migrated** — none of
them exports a raw `pool` any more, so there is no way to write `pool.query` in app code. The `sql`
template escape hatch is allowed for genuinely awkward queries (`LOWER(a) = LOWER(b)`, window
functions, `NOW() - INTERVAL`, `DESC NULLS LAST`); note each use in the
commit message. It still parameterises — never interpolate a value into a query string.

`user-app` was the last holdout and converted 2026-08-05, after its TypeScript conversion earlier the
same day. It has no test suite.

There is **no hand-written SQL left anywhere outside tests**, including the two
`apps/main-app/scripts/chatbot-related/*` offline scripts (converted 2026-08-05; they run via `tsx`,
because `@solar/db`'s extensionless internal imports do not resolve under bare Node ESM).

Two schema files are **hand-maintained and not generated**, so `pull` will not touch them:
`packages/db/src/schema/index.ts` (the barrel) and `packages/db/src/schema/embeddings.ts` (the
`embeddings` Postgres schema, which `schemaFilter: ['public']` excludes from introspection).

Two things `drizzle-kit pull` does that regularly bite:
- `jsonb` columns are typed `unknown` and timestamps `mode: 'string'`. Restate a shape with
  ``sql<T>`${table.col}` `` (renders as the bare column, so the SQL is unchanged); don't annotate
  `schema.ts`, which is generated and will be overwritten.
- Nullability is real. Many components declare columns non-null that the schema allows to be NULL —
  the old driver's `any` hid it. Prefer restating the existing contract over widening components.

- **Composite foreign keys come out mis-paired.** `columns` is emitted in the local table's column
  order but `foreignColumns` in the referenced table's, and `foreignKey()` pairs them positionally.
  `postpull.mjs` corrects this, keyed by constraint name — if you add a composite FK, add it there
  too, checking `pg_get_constraintdef` for the real order. Left alone it emits DDL Postgres
  rejects, which breaks the test baseline rather than failing quietly.

A third thing that has now bitten twice, and is not a `pull` artifact:
- **Check `withTimezone` before writing a timestamp.** `timestamptz` columns take
  `date.toISOString()`; a plain `timestamp` column does not — node-postgres reads a naive column
  back in the process's local zone, so an ISO (UTC) string comes back shifted by the offset. Write
  those local-naive. This silently expired every password-reset link before a test caught it.

## Baselines

`npm run check` is on **svelte-check v4**, which prints machine format when stdout is not a TTY —
grep `COMPLETED n FILES x ERRORS`, not `found x errors`. A change passes if the count does not rise:

| app | errors | warnings |
| --- | --- | --- |
| main-app | 9 | 1 |
| business-app | 32 | 0 |
| user-app | 0 | 0 |

**business-app's check now covers everything.** `--no-tsconfig --ignore "src/lib/components/ui"` was
dropped on 2026-08-05, so its `.ts` files are type-checked for the first time and the run went from
44 files to 5269. That surfaced 35 pre-existing errors (14 in `src/lib/components/ui`, 9 in
`.svelte`, 12 in `.ts`); 2 were fixed the same day, leaving 33.

Note `--ignore` is only valid alongside `--no-tsconfig`, so the two flags come as a pair. Moving the
ignore into `tsconfig.json`'s `exclude` does not work either — `exclude` only filters `include`, and
files reached through imports stay in the program and are still checked.

Run `npm run build -w <app>` too when touching imports: `check` will not catch server code reaching
a component, which is a hard build failure (see the `$lib/compliance` barrel, fixed 2026-08-05).

## Tests

Integration tests live in `apps/business-app/tests/` and run against real Postgres, never a mocked
pool. Start it with `docker compose -f docker-compose.test.yml up -d`, then
`npm test -w solarvipani-business`. See `tests/README.md` — in particular the reason the test schema
needs a generated baseline, and the fact that it must be regenerated after any schema change.

Coverage is deliberately narrow: the lead pipeline, auth (including the forgot-password /
reset-password round trip) and the compliance gate, on both countries. Don't add tests for trivial
lookups or UI components. Every bug fixed from now on gets a test that reproduces it first — that
rule has now paid for itself twice in one session, catching a dead /us endpoint and a timezone bug
that would have expired every password-reset link.

**No Docker on the current dev machine.** The suite runs against a throwaway cluster built from the
EDB binaries instead; the recipe is in next-steps.md under Phase 6 (port 5544, then export
`TEST_POSTGRES_URL`).

**Never regenerate the schema by pulling from a test cluster** — the baseline does not create three
`loc_key(...)` expression indexes, so a pull from there silently drops them. Pull from live only
(`apps/main-app/.env.local` has `POSTGRES_URL_NON_POOLING`, which is the one to use for DDL).

## Design

Each app has its own `src/app.css` with a full token layer — there is no shared UI package. The
tokens are good; drift comes from using them without rules, so two docs carry those rules. **Read
the one for the app you are touching before writing markup:**

**All three apps share one brand hue as of 2026-08-23: Solar Orange `#FF6600`.** business-app was
Tailwind's `blue-500` default and user-app a hand-rolled `#0056b3`; both were accidental, not a
deliberate marketing-vs-product split. Two consequences worth knowing before you write markup:
orange is *light*, so text on `bg-accent` is the near-black `text-accent-foreground`, never white
(2.94:1); and orange lettering on a light surface needs `text-accent-strong` / `text-primary-strong`
(`#B84900`), because plain `text-accent` is 2.77:1 there. `--accent-strong` resolves back to
`--accent` in dark mode, so the one class is right in both themes.

There are now **three** copies of the token layer, kept in sync by hand — a deliberate call to defer
extracting a shared file. Change a brand token in one app and change it in all three.

- `docs/main-app-design-conventions.md` — the public marketing site. Pages use `PageShell` +
  `PageHeader` from `$lib/components/layout/`; orange headings are correct; **never write `dark:`**
  (the tokens already flip, and authoring the two themes separately is what made them drift);
  never put body copy on `bg-accent` (2.53:1 in dark — use `bg-accent-muted`).
- `docs/business-app-design-conventions.md` — the logged-in dashboard. Different rules on purpose:
  there colour means "you can interact with this", so headings are `text-foreground`, not accent.
- `docs/user-app-design-conventions.md` — the customer-facing tracker. It *follows* the
  business-app doc (it is a product surface, not marketing) and only records where user-app
  differs, so read both.

Don't port rules between the marketing doc and the other two.

`user-app` was converted to Tailwind utilities on 2026-08-23 and now has a small local UI kit in
`src/lib/components/ui/` (`AppShell`, `Card`, `Badge`, `Button`, `Field`, `Alert`, `EmptyState`) —
hand-written, no shadcn and no `bits-ui`/`tailwind-merge`, so the `class` prop appends rather than
merges. Three things to know before writing markup there:

- Its token layer came from **main-app**, so business-app's `--accent-strong` does not exist —
  write `text-primary-strong`. `text-accent-strong` renders as nothing, silently.
- The scoped `<style>` blocks and the two leaked `:root` alias blocks are gone from `/in`,
  `/in/thank-you`, `/in/feedback` and `BillUpload`. `src/routes/+page.svelte` (region picker) and
  `signin-link/[token]` are still on bespoke scoped CSS.
- Tailwind v4's `@theme` z-index namespace is `--z-index-*`, not `--z-*`, so `z-sticky` and
  friends generate nothing. `AppShell` sets `style="z-index: var(--z-sticky)"` instead. The same
  trap applies in business-app's `Sidebar.svelte` (`z-sidebar`).

## About Solar-app

This is a open source project.
