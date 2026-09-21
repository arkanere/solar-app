# README

The Next.js port of the marketing/directory site. In `solar-app/apps/main-app-nextjs`,
sharing `@solar/db` and `@solar/validation`. SvelteKit and Next coexist in the workspace.

1. Keep all the routes as it is!
2. Keep most content as it is!
3. Design system, component library is the major opportunity that we want to exploit with React/Nextjs ecosystem.

## Principles

- Mobile-first sizing, semantic HTML.
- Spacing comes from the layout primitives, never by hand.
- CSS transitions via Tailwind. No JS animation libraries.
- Structured data is a first-class requirement, not an afterthought.
- **No dark mode at all.** `:root { color-scheme: light; }`

## Stack

- Next.js App Router + TypeScript strict. RSC is the default — server components
  everywhere, `'use client'` only at interactive leaves.
- Tailwind 4, with daisyUI as a plugin (`app/globals.css`).
- `@tailwindcss/typography` (prose), `lucide-react` icons.
- Free / MIT only. No paid libraries.
- No Radix yet. It is the plan for dialog/drawer and combobox, when one is needed.

## State

Reasoning lives in the doc or the file header, never here; `git log` is the record.

**Built:** the directory surface, the editorial surface, the four static pages, the
projects surface, the homepage, the tools and the legacy redirects — 1,408 of the 1,413
advertised URLs. 30 of 47 page files; the other 17 are stubs. 13 of the 19 route
handlers answer 501. (`/{cc}/district/{district_slug}` stopped being a page when it
shipped: it always redirected, so it is a route handler now.)

## Where things are

| Doc | Covers |
| --- | --- |
| `routes.md` | Every route: 48 pages + 19 handlers. |
| `design-foundation.md` | Type, spacing, colour, radius, elevation, motion, imagery. Approve at `/specimen`; re-verify with `npm run check:contrast`. |
| `archetype.md` | Why there are four archetypes. `archetype/data.md` has the live measurements they are designed against. |
| `archetype/geo-listing.md` | Archetype 2 — district page and city/size leaf, 957 pages. |
| `archetype/installer-profile.md` | Archetype 1 — 649 pages, the largest. |
| `archetype/geo-index.md` | Archetype 3 — country and state hubs, 29 pages. §9 and §10 record what it decided and where it shipped differently from spec. |
| `archetype/editorial.md` | Archetype 4 — the 7 pillar landings and 110 cluster articles, 117 pages. Its own §2 holds the `seo_pages` measurements; `data.md` does not cover that table. §11 is what shipped. |
| `archetype/home.md` | Not an archetype — one page, `/`. §1 says why it gets a spec anyway: it is the only long-tail page whose source design contradicts the design system. §12 is what shipped. |

Approve the page designs at `/specimen/archetypes` (dev only).

Code worth knowing before editing:

- `lib/directory/data.ts` — the single data seam for the directory and projects
  surfaces. Every query lives here, each with the trap it avoids written above it
  (casing, correlated subqueries, composite keys).
- `components/layout/` — the layout primitives, and the two lint rules they unblocked:
  no `mx-auto` outside that folder, no numeric Tailwind spacing anywhere.
  `PageShell`'s `hero` slot is the one full-bleed exception, and `/` is its only
  caller — read the comment there before adding a second.
- `lib/countries/` — the per-country gate. Labels and features are data, never
  hardcoded. `moved-content.ts` is the list of families that live at the root.
- `lib/cloudinary-loader.ts` — the only place an image transform is written.
- `lib/server/` — the server-only modules: `db`, `leads`, `email` (Brevo),
  `magicLink` (mints customer sign-in tokens, IN-only), `leadConfirmation` (the email
  body, shared by `submitLead` and its own route). Needs `BREVO_API_KEY` and
  `INTERNAL_API_SECRET` in `.env.local`; `USER_APP_URL` is optional and defaults to
  production.
- `middleware.ts` — the legacy 301s, ported from SvelteKit's `hooks.server.ts`. They
  run before routing, which is why they are the rules that keep the query string. The
  four shims that need a geo lookup are route handlers instead and do not — read
  `lib/redirects.ts` before adding a fifth.
- `components/chrome/` — `SiteHeader`, `SiteFooter` and `Chrome`. Read Chrome.tsx first:
  it records why chrome is not in the root layout. `NavMenu` is the only client leaf.
- `lib/editorial/` — the editorial surface's seam. `data.ts` is the three queries,
  `routes.tsx` is both routes written once with the pillar as a parameter, and
  `body.ts` rewrites the 885 body links that point at a family which has since moved
  to the root. `components/editorial/ArticleBody.tsx` holds the table treatment, which
  is the design problem of that archetype.
- `lib/directory/projectRoutes.tsx` — the two project-list routes written once, the
  gallery and its pager. `components/directory/Pager.tsx` is the only pagination in
  the app.
- `lib/tools/` — the calculators' seam. `data.ts` is the three queries (the IN district
  tree, the visible-installer count, the financing banks), `estimate.ts` is the
  arithmetic — the PM Surya Ghar slabs and the cost-per-kW ladder live there because
  two of the three pages quote them and two copies of a published money figure drift.
  `components/tools/` is the shared furniture: `Panel`, `StatTile`, `BreakdownRow` and
  the two controls. The controls are native `<input type="range">` and `<select>`, not
  Radix — `Field.tsx` records why.
- `lib/metadata.ts` — the one metadata builder. It owns the tag set; each page owns its
  own title and description. Built pages call it; the stubs fall back to the root
  layout, which is also where `metadataBase` lives.

**Route Segment Config must be a literal in the route file.** `export const
revalidate = N`, never re-exported from a shared module and never an imported
constant: Next reads it by static analysis, so a re-export warns on every build and an
imported constant fails the build. `lib/editorial/routes.tsx` has the measurements.

**ISR needs `generateStaticParams` too.** `revalidate` alone does nothing on a route
with a dynamic segment — without the function Next renders it `ƒ` and re-queries the
database on every request. It returns `[]` in all 15 built dynamic routes: Next's
"all paths at runtime", so nothing is prerendered, the build stays database-free, and
each path caches on first visit. Returning real params instead is what couples a
~1,380-page build to the database. Two consequences: 404s cache with the same
`s-maxage` and the key space is unbounded (parity with SvelteKit's `config.isr`, worth
a rate limit if abused); and under Next 16's Cache Components an empty return is a
build error, so that upgrade reworks all 15 files.

## Next steps

Four left, in order. Re-plan after the last one lands.

1. **The lead forms.** `get-quotes`, `business-form` and `partners/join` (plus its
   `{district_slug}` variant), their three thank-you pages, and the four handlers
   behind them: `submitBusiness`, `sendBusinessSubmissionConfirmation`, `getCities`
   and `getLevel2s`. `lib/server/` already has `leads`, `email`, `leadConfirmation`
   and `internalAuth`, so this is the form UI, the validation wiring and the district
   tree the two selects need — `lib/tools/data.ts` already queries that tree, so read
   it before writing a second copy. **Phone length is a prerequisite, not a
   follow-up:** a 17-character phone is a 500 on the first real submission. Narrowing
   `@solar/validation`'s `phone` primitive is a cross-app change — agree it with
   main-app live before this step starts, or clamp at the Next boundary and record why.

2. **The remaining handlers.** `/data-access` and `/data-deletion` — both pages are
   built and both post to a 501, so they are the shortest path to two working pages —
   plus `submitDataAccess`, `submitDataDeletion`, `/api/stories`, `postRecentProject`,
   `updateRecentProject` and `/api/cron/purge-old-leads`. The three write routes are
   internal: they go through `lib/server/internalAuth.ts`, and the cron route needs its
   schedule decided as well as its body.

3. **Sitemaps and metadata.** The 3 sitemap handlers (`/sitemap.xml`,
   `/content-sitemap.xml`, `/{cc}/sitemap.xml`), which closes **robots.txt points at a
   501**. Then `pageMetadata` on every page that still falls back to the root layout.
   The 117 editorial pages are the exception: `lib/metadata.ts` passes `meta_title` and
   `meta_description` through unaltered and must keep doing so, so **editorial metadata
   is too long** stays a CMS pass and is not in this step's scope.

4. **A smoke harness.** One URL of each of the 76 route shapes, asserting 200, plus
   `x-nextjs-cache` on the 15 ISR shapes — Next sets it to `HIT`/`STALE`/`MISS`/
   `REVALIDATED`, so the assertion that keeps ISR from silently regressing is a header
   check, not a timing heuristic. `NEXT_PRIVATE_DEBUG_CACHE=1` logs hits and misses.
   Add a shape in the same commit that adds a route.

Not in these four, and deliberately: everything under **Blocked on data, not code**,
plus the specimen, lead-count and editorial-metadata items below. The lead count is a
one-line fix in `lib/stats.ts` either way, but it is a business decision — ask before
launch, not at the end.

## Open items

Named, not numbered. The numbers used to drift every time an item closed, and some
file headers still cite "README open item N" against a numbering that no longer
exists — treat any such number as a hint, not an address.

- **Phone length.** A phone of `+` plus 16 digits is a 500. `@solar/validation`'s
  `phone` primitive allows 17 characters; `leaddata.phone` is `varchar(16)`.
  Pre-existing and shared with main-app live, so narrowing the primitive is a
  cross-app change. Blocks next step 1.
- **`robots.txt` points at a 501.** `/sitemap.xml` is still a stub; next step 3 builds
  it. The declaration is correct for where the file is going, not for today.
- **The installer specimen is out of date.** `/specimen/archetypes/installer` still
  hides the boilerplate About; the shipped page renders it.
- **`/about-us` adds 2,000 to the lead count it prints.** `lib/stats.ts` carries the
  `+ 2000` from the SvelteKit loader across verbatim, named `LEADS_BEFORE_LEADDATA`.
  Nothing in the database supports it, so "3,269+ Leads Generated" is 1,269 real rows
  plus a number no one here can source. Either the business confirms it or it comes out.
- **Editorial metadata is too long.** `meta_title` runs to 98 characters against
  Google's ~60, `meta_description` to 188 against ~155 — on all 117 pillar and cluster
  pages. Content, not code: `lib/metadata.ts` passes both through unaltered and should
  keep doing so. The fix is a CMS pass over `seo_pages`. `archetype/editorial.md` §2.

### Blocked on data, not code

All verified 2026-09-21.

- **`state_subsidies` is empty** in every status, so the state hub's subsidy callout is
  not built — the gate can never open.
- **`solar_financing_banks` is empty**, so `/tools/emi-calculator`'s bank comparison
  never renders. The calculator itself is unaffected — it is arithmetic on the sliders —
  and the table is built and waiting, so the section appears the day a row lands.
- **`solar_brands` is empty**, so the leaf route has no brand variant.
- **`solar_products` is empty**, so the three product model routes
  (`/{pillar}/{brand}/{model}`) are not built.
- **`authors` is empty**, so `/authors/{slug}` is not built. `features.authors` is on
  for IN and the route is in `MOVED_TO_ROOT`, so the gate opens the moment a row lands.
- **`rscore` is 0 on all 643 rows**, so the installer sort falls back to its tiebreakers.
- **`CountryConfig.name` has no article**, so `/us/solar`'s `h1` reads "Solar installers
  across United States". Wants a field on the config, which is a shared-type change.
