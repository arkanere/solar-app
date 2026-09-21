# README

The Next.js port of the marketing/directory site. Shares `@solar/db` and
`@solar/validation`; SvelteKit main-app and this app coexist in the workspace.

1. Keep all the routes as they are.
2. Keep most content as it is.
3. The design system and component library are the opportunity React/Next buys us.

Reasoning lives in the spec doc or the file header, never here. `git log` is the record.

## Principles

- Mobile-first sizing, semantic HTML.
- Spacing comes from the layout primitives, never by hand.
- CSS transitions via Tailwind. No JS animation libraries.
- Structured data is a first-class requirement.
- **No dark mode at all.** `:root { color-scheme: light; }`

## Stack

Next.js App Router, TypeScript strict, RSC by default — `'use client'` only at
interactive leaves. Tailwind 4 with daisyUI (`app/globals.css`),
`@tailwindcss/typography`, `lucide-react`. Free/MIT only. No Radix yet; it is the
plan for dialog/drawer and combobox when one is needed.

## State

**Built:** every surface — directory, editorial, projects, homepage, tools, legacy
redirects, lead forms, compliance pages, sitemaps. 1,412 of 1,413 advertised URLs,
40 of 47 page files (7 stubs), all 16 route handlers answering.

**Three routes are deliberately not ported**, which is why the handler count is 16
and not 19. `postRecentProject` and `updateRecentProject` are duplicates —
`business-app` owns both. `/api/cron/purge-old-leads` belongs to admin-app, in a
different repo: `~/Developer/solar/solar-app-internal`, queued in
`admin-app-nextjs/spec/README.md` under **What is left**.

**Cutover is blocked on two repointings, neither of them code here:**

- The monthly Cronicle job that POSTs `https://solarvipani.com/api/cron/purge-old-leads`.
  It is the six-month retention purge `privacy-policy` §6 promises, and **cutover 404s
  it silently** until admin-app hosts it.
- Whatever posts projects to main-app today — SvelteKit's `postRecentProject` has a
  JSON branch marked "Android App".

## Two rules that break the build

**Route Segment Config must be a literal in the route file.** `export const
revalidate = N` — never re-exported from a shared module, never an imported constant.
Next reads it by static analysis: a re-export warns on every build, an imported
constant fails it. `lib/editorial/routes.tsx` has the measurements.

**ISR needs `generateStaticParams` too.** `revalidate` alone does nothing on a route
with a dynamic segment — without the function Next renders it `ƒ` and re-queries the
database on every request. It returns `[]` in all 16 built dynamic routes, so nothing
is prerendered and each path caches on first visit. Returning real params is what
couples a ~1,380-page build to the database. Two consequences: 404s cache with the
same `s-maxage` and the key space is unbounded (parity with SvelteKit's `config.isr`);
and under Next 16's Cache Components an empty return is a build error.

## Where things are

| Doc | Covers |
| --- | --- |
| `routes.md` | Every route: 48 pages + 16 handlers. |
| `design-foundation.md` | Type, spacing, colour, radius, elevation, motion, imagery. Approve at `/specimen`; re-verify with `npm run check:contrast`. |
| `archetype.md` | Why there are four archetypes. `archetype/data.md` has the measurements. |
| `archetype/installer-profile.md` | Archetype 1 — 649 pages. |
| `archetype/geo-listing.md` | Archetype 2 — district page and city/size leaf, 957 pages. |
| `archetype/geo-index.md` | Archetype 3 — country and state hubs, 29 pages. |
| `archetype/editorial.md` | Archetype 4 — 7 pillars + 110 clusters. §2 holds the `seo_pages` measurements. |
| `archetype/home.md` | `/` alone — the one page whose source design contradicts the design system. |

Each archetype doc ends with a section on what actually shipped. Approve the page
designs at `/specimen/archetypes` (dev only).

Code worth knowing before editing. Every one of these has a header that says more:

- `lib/directory/data.ts` — the directory and projects seam. Every query, each with
  the trap it avoids above it (casing, correlated subqueries, composite keys).
- `lib/editorial/` — the editorial seam. `routes.tsx` is both routes written once
  with the pillar as a parameter; `body.ts` rewrites 885 moved body links.
- `lib/forms/`, `lib/server/business.ts` — the lead-forms seam.
  `components/forms/BusinessForm.tsx` is the one client leaf, shared by all three
  signup pages.
- `lib/tools/` — the calculators. `estimate.ts` holds the PM Surya Ghar slabs and the
  cost-per-kW ladder, because two pages quote them and two copies of a money figure drift.
- `lib/sitemap.ts` — the XML serializers and the URLs with no row. No database import;
  the queries stay in the two data seams, slug-only. Its header records the six
  families the port stopped advertising.
- `lib/countries/` — the per-country gate. Labels and features are data, never
  hardcoded. `moved-content.ts` lists the families that live at the root.
- `lib/metadata.ts` — the one metadata builder. It owns the tag set; each page owns
  its title and description.
- `lib/server/` — the server-only modules. Needs `BREVO_API_KEY` and
  `INTERNAL_API_SECRET` in `.env.local`; `USER_APP_URL` is optional.
- `lib/cloudinary-loader.ts` — the only place an image transform is written.
- `middleware.ts` — the legacy 301s, and the only rules that keep the query string.
  The four shims needing a geo lookup are route handlers instead; read
  `lib/redirects.ts` before adding a fifth.
- `components/layout/` — the layout primitives, and the two lint rules they unblocked:
  no `mx-auto` outside that folder, no numeric Tailwind spacing anywhere.
- `components/chrome/` — read `Chrome.tsx` first: it records why chrome is not in the
  root layout.

## Next steps

Four left, in order. Re-plan after the last one lands.

1. **The three stubs that no empty table blocks.** `/{cc}/unsubscribe`,
   `/{cc}/partners` and `/{cc}/business-listing` are 9-line stubs for no reason but
   ordering — unlike the other four, which wait on `authors` and `solar_products`.
   `/{cc}/unsubscribe` goes first and is the only one with a real consequence: this
   app sends mail through `lib/server/email.ts`, and an opt-out link that 404s after
   cutover costs a sending domain. Port each from its SvelteKit page, metadata included.

2. **A smoke harness.** One URL of each of the 76 route shapes, asserting 200, plus
   `x-nextjs-cache` on the 16 ISR shapes — the assertion that keeps ISR from silently
   regressing is a header check, not a timing heuristic. `NEXT_PRIVATE_DEBUG_CACHE=1`
   logs hits and misses. Add a shape in the same commit that adds a route. After 1, so
   it is written once against the full 76.

3. **Prove the data-blocked gates open.** Five of the entries below are a belief, not
   a test: the branch each empty table feeds has never run. Seed one row per table into
   a dev-only fixture, walk the gate, record the result. A verification pass, not a
   feature — no gate gets rewritten unless it is broken.

4. **Next 16 readiness.** Under Cache Components an empty `generateStaticParams` is a
   build error, and the same empty return leaves the ISR key space unbounded (worth a
   rate limit before a public cutover). One pass: they are the same 16 files.

Deliberately not in the list: the Meta Pixel and the two cutover repointings, the two
unreachable thank-you pages, the lead count, and the editorial metadata — see below.

## Open items

Decisions and known holes, not work items. Named, not numbered; a file header citing
"README open item N" is a stale hint, not an address.

- **The Meta Pixel is not ported** — a `PageView` on the two forms and a **`Lead`
  conversion** on the two confirmations. A third-party tracker needs a consent
  decision and a `next/script` strategy, and neither has been made. **The ad
  account's conversion reporting is blind until it lands** — a launch blocker.
- **Two confirmation pages, one reachable.** `BusinessForm` sends every signup to
  `/{cc}/thank-you-business`, so `/{cc}/partners/join/thank-you` is routed to by
  nothing and promises something different (48 hours vs a call). A content decision.
- **`/{cc}/thank-you` is not routed to from this app either.** `LeadForm` confirms in
  place; the page is reached from the confirmation email. Worth deciding deliberately.
- **`/about-us` adds 2,000 to the lead count it prints.** `LEADS_BEFORE_LEADDATA` in
  `lib/stats.ts`, carried across verbatim. Nothing in the database supports it. Either
  the business confirms it or it comes out — one line either way, ask before launch.
- **Editorial metadata is too long.** `meta_title` to 98 chars against Google's ~60,
  `meta_description` to 188 against ~155, on all 117 pages. A CMS pass over
  `seo_pages`; `lib/metadata.ts` should keep passing both through unaltered.
- **The deletion table is narrower than the schema that writes to it.**
  `dataRequestSchema` allows a 40-char phone; `data_deletion_requests` types it
  `varchar(20)`, so a 21-char phone is a 500 on `/api/submitDataDeletion`. Live
  SvelteKit has the same hole. The ceiling belongs to `@solar/validation`, which two
  other apps validate against — one line in `primitives.ts` or one migration.
- **Nothing tells the team a deletion request landed.** `submitDataAccess` mails a
  copy to admin@solarvipani.com; `submitDataDeletion` sends nothing, so the erasure
  queue is rows no app reads back. Close it when someone owns that queue.
- **main-app's own phone rule is still the old one.** Its real guard is its own copy
  in `src/lib/constants/formValidation.ts` (`/^\+?\d{10,16}$/`), so a 17-character
  phone is still a 500 there. Live SvelteKit, outside the port — one regex, whenever
  that app is next opened.
- **The installer specimen is out of date.** `/specimen/archetypes/installer` hides
  the boilerplate About; the shipped page renders it.

### Blocked on data, not code

All verified 2026-09-21. Each is an empty table, not a missing branch.

- **`state_subsidies`** — the state hub's subsidy callout is not built.
- **`solar_financing_banks`** — `/tools/emi-calculator`'s bank table is built and
  waiting; the section appears the day a row lands. The calculator is unaffected.
- **`solar_brands`** — the leaf route has no brand variant.
- **`solar_products`** — the three `/{pillar}/{brand}/{model}` routes are not built.
- **`authors`** — `/authors/{slug}` is not built, but `features.authors` is on for IN
  and the route is in `MOVED_TO_ROOT`, so the gate opens the moment a row lands.
- **`rscore` is 0 on all 643 rows**, so the installer sort falls back to its tiebreakers.
- **`CountryConfig.name` has no article**, so `/us/solar`'s `h1` reads "Solar
  installers across United States". Wants a field on the config — a shared-type change.
