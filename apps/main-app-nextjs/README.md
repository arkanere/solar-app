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
redirects, lead forms, compliance pages, sitemaps, the email opt-out, the two
installer-acquisition pages. 1,412 of 1,413 advertised URLs, 43 of 47 page files
(4 stubs), all 17 route handlers answering.

**Three routes are deliberately not ported**, which is why the handler count is 17
and not 20 — the seventeenth is `/api/unsubscribe`, new at that URL because the old
one had a country prefix it never used. `postRecentProject` and `updateRecentProject` are duplicates —
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
database on every request. **There are 24 such routes, not the 16 this section used to
claim**; all 24 also export `revalidate`.

The 24 split by what their dynamic segment is, and the two halves want opposite things:

- **10 are `[country]` and nothing else.** The registry enumerates the set with no
  query, so they return real params — `countryParams` in `lib/countries/index.ts`.
  15 prerendered URLs, `●` in the build output with each URL under it.
- **14 have a second, data-driven segment.** These still return `[]`, which is what
  couples a ~1,380-page build to the database if changed. Two consequences while they
  stay empty: 404s cache with the same `s-maxage` and the key space is unbounded
  (parity with SvelteKit's `config.isr`); and under Next 16's Cache Components an empty
  return is a build error.

**Real params make the build need the database.** With everything empty the build
opened no connection at all. The 10 country-only pages read data seams in their bodies
— `sitemap.xml` reads five — so the build now renders them for real. That is the same
kind of coupling the 14 are held back from, at 15 renders instead of 1,380.

## Where things are

| Doc | Covers |
| --- | --- |
| `routes.md` | Every route: 48 pages + 16 handlers. |
| `design-foundation.md` | Type, spacing, colour, radius, elevation, motion, imagery. Approve at `/specimen`; re-verify with `npm run check:contrast`. |
| `scripts/smoke.mjs` | The 89 route shapes and the sample URL of each. `npm run smoke`. |
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
  hardcoded. `moved-content.ts` lists the families that live at the root — including
  `unsubscribe`, the one entry reached from an email rather than from a link on the
  site, which is why that 301 keeping its query string matters.
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

One left, and it is half done. Re-plan after it lands.

1. ~~**The two stubs that no empty table blocks.**~~ — **done 2026-09-21.**
   `/{cc}/partners` and `/{cc}/business-listing` are ported, metadata included.

   **This entry was wrong about US, and the fix shaped both pages.** It said both
   301 for US. Only `/{cc}/partners` does — and it 301s *to* `/{cc}/business-listing`
   (`middleware.ts`), which makes business-listing the US acquisition page and is why
   `routes.md` counts it 1 IN + 1 US. So partners is IN-shaped with no country fork,
   and business-listing carries the whole fork the SvelteKit page carried: benefits,
   FAQs, hero CTA, closing CTA, video, social proof.

   Two standalone pages, not one shared component set. They overlap on about two
   thirds of their sections, but every benefit, FAQ and heading differs, so a shared
   component would take a config object per section. The one genuinely shared thing
   is the installer grid's query — `listRecentBusinesses` in `lib/directory/data.ts`,
   which is also where SvelteKit's latent bug is fixed: the partners loader had no
   country predicate, so it was entitled to return US rows on an Indian page.

   Three deliberate departures from the SvelteKit originals, each in a file header:

   - **the "500+ businesses / 5,000+ cities" band is counted live**, like `/about-us`.
     Those two figures were never true; the real ones are 476 and 359 today.
   - **`youtube-nocookie.com`, not `youtube.com`** for the "See How It Works" embed.
     Same video, no profiling cookie on view.
   - **the FAQPage JSON-LD is built from the array each page renders.** SvelteKit
     shipped the US question set on both countries and its own comment says so.

   ~~`/{cc}/unsubscribe`~~ — **done 2026-09-21, and it moved to `/unsubscribe`.**
   Nothing on that page or in its table is country-specific, so it went to the
   country-less root like the compliance pages; `'unsubscribe'` is in `MOVED_TO_ROOT`
   and the 301 keeps the `?unsubscribe=` query the mailed link carries. Its POST is
   `/api/unsubscribe`, at the root for the same reason.

2. ~~**A smoke harness.**~~ — **done 2026-09-22.** `npm run smoke`, one URL of every
   route shape, asserting the status each is supposed to answer with. **89 shapes, not
   the 76 this entry estimated**: the count left out the 13 `middleware.ts` rules, and
   a redirect that stops firing is exactly the silent regression worth catching, so
   each one is a line. Add a shape in the same commit that adds a route.

   **This entry was wrong about the header, and the target is production.** It named
   `x-nextjs-cache`; that is what `next start` emits, and the deploy is on Vercel,
   which emits `x-vercel-cache` and strips `s-maxage` from the response so
   cache-control cannot be read instead. The harness accepts either header. It defaults
   to `https://solar-app-main-app-nextjs.vercel.app`; `BASE_URL=…` points it anywhere,
   and `NEXT_PRIVATE_DEBUG_CACHE=1` is still the way to see hits and misses locally.

   Two things the first working version got wrong, both measured against production
   and both in the file header:

   - **presence of the cache header proves nothing** — a cold ISR page answers `MISS`
     exactly like a dynamic one. The discriminator is the *second* request. And that
     second request has to be retried: Vercel's cache write is not visible immediately,
     so 16 of the 48 cached shapes failed a cold run before the backoff went in.
   - **a transport retry is not optional.** Roughly one request in a few hundred fails
     outright at this concurrency, which was enough to put two or three false failures
     in a clean run. Network errors are retried; unexpected statuses never are.

   **It never POSTs.** The default target is production, where a POST to
   `/api/submitLead` writes a lead. The eight write endpoints are checked with a GET
   asserting 405, which proves the handler is mounted and exercises none of it.

   Verified by seeding four faults — a wrong status, a deleted row in a sample URL, a
   redirect pointing elsewhere, and a dynamic route tagged ISR — and confirming each
   one fails the run.

3. **Next 16 readiness.** Under Cache Components an empty `generateStaticParams` is a
   build error, and the same empty return leaves the ISR key space unbounded (worth a
   rate limit before a public cutover).

   **This entry was wrong about the count, and the files are not one pass.** It said 16
   files; there are 24, and they do not want the same fix. The 10 whose only dynamic
   segment is `[country]` are **done 2026-09-22** — `countryParams` in
   `lib/countries/index.ts`, real params, 15 prerendered URLs, build clean. Four of
   them are IN only because `middleware.ts` 301s `/us/get-quotes` and `/us/partners/*`;
   there is no feature flag behind that rule, so those four write the literal and cite
   it. `recent-solar-installation-projects` is IN only from `features.projects`.

   **The remaining 14 are the decision, and it is a deploy decision, not a code one.**
   Each has a second segment that comes from a table, so real params is what prerenders
   ~1,380 pages and makes every deploy wait on the database. Staying empty is a Next 16
   build error. Decide the deploy shape — full prerender, or a top-N slice with the
   tail left to on-demand ISR — before writing any of them.

   Verified by `npm run smoke` against a local `next start`, before and after: 46
   failures both times, the identical set. They are local-vs-Vercel artifacts — every
   dynamic-segment route is uncached under `next start`, untouched ones included — so
   the harness is measuring nothing here. **Its real target is production**, per its
   own header.

Deliberately not in the list: the Meta Pixel and the two cutover repointings, the two
unreachable thank-you pages, the lead count, and the editorial metadata — see below.

## Open items

Decisions and known holes, not work items. Named, not numbered; a file header citing
"README open item N" is a stale hint, not an address.

- **The Meta Pixel is not ported** — a `PageView` on the two forms and on
  `/{cc}/partners` and `/{cc}/business-listing`, and a **`Lead` conversion** on the
  two confirmations. A third-party tracker needs a consent decision and a
  `next/script` strategy, and neither has been made. **The ad account's conversion
  reporting is blind until it lands** — a launch blocker. The same decision is why
  the one third-party embed that *was* kept, the "See How It Works" video on those
  two pages, points at `youtube-nocookie.com`.
- **Two confirmation pages, one reachable.** `BusinessForm` sends every signup to
  `/{cc}/thank-you-business`, so `/{cc}/partners/join/thank-you` is routed to by
  nothing and promises something different (48 hours vs a call). A content decision.
- **`/{cc}/thank-you` is not routed to from this app either.** `LeadForm` confirms in
  place; the page is reached from the confirmation email. Worth deciding deliberately.
- **`/us/business-listing` prints an Indian phone number.** `+91 8983066701` in the
  contact card and in the page's `Organization` markup, carried across verbatim from
  the SvelteKit US page, which had the same. There is no US number to put there. It
  belongs on `CountryConfig` the day one exists — a shared-type change, like
  `CountryConfig.name` below.
- **`/{cc}/partners` and `/about-us` both add 2,000 to the lead count they print.**
  `LEADS_BEFORE_LEADDATA` in `lib/stats.ts`, carried across verbatim. Nothing in the
  database supports it. Either the business confirms it or it comes out — one line
  either way, and it now moves two pages. Ask before launch.
- **Editorial metadata is too long.** `meta_title` to 98 chars against Google's ~60,
  `meta_description` to 188 against ~155, on all 117 pages. A CMS pass over
  `seo_pages`; `lib/metadata.ts` should keep passing both through unaltered.
- **The deletion table is narrower than the schema that writes to it.**
  `dataRequestSchema` allows a 40-char phone; `data_deletion_requests` types it
  `varchar(20)`, so a 21-char phone is a 500 on `/api/submitDataDeletion`. Live
  SvelteKit has the same hole. The ceiling belongs to `@solar/validation`, which two
  other apps validate against — one line in `primitives.ts` or one migration.
- **Nothing suppresses mail to an unsubscribed address.** `/unsubscribe` records the
  row and no sender in this app reads `unsubscribe` back; the suppression happens in
  Brevo. Live SvelteKit is identical, so this is carried across rather than
  introduced — but the table is a record of intent, not an enforcement point. The
  same table also has no unique index on `email`, so its check-then-insert can
  duplicate under two simultaneous clicks; harmless, since the list is consumed as a
  set, and the right fix is one migration.

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
