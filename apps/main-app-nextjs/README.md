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

## Next steps

Three left, in order. Re-plan after the last one lands.

> **Step 1, the redirects, is done.** The legacy 301s landed in
> `middleware.ts` and the four shims answer real redirects, all 2026-09-21. Verified
> against `next build && next start`. Note `/us/` now takes two hops — Next normalizes
> the trailing slash with its own 308 before middleware runs, where SvelteKit reached
> `/` in one. That is Next's behaviour on every URL, not something these rules added.
>
> **Step 5, ISR, is done** — taken ahead of steps 2–4 because it shapes the data
> seams they build on. `export async function generateStaticParams() { return []; }`
> in the 15 dynamic route files, 2026-09-21. That is the whole change; no data-seam
> code moved.
>
> **The README used to say `generateStaticParams` "couples the build to the
> database". That was wrong, and it is why this sat open.** The function may return
> an empty array — Next's documented "all paths at runtime" — which prerenders
> nothing at build time and caches each path on first visit. Empty is not a
> degenerate case: the docs say you *must* return `[]` (or set
> `dynamic = 'force-static'`) to get ISR on paths at runtime, and a route with no
> `generateStaticParams` at all is dynamically rendered. So the build stays
> database-free **and** the responses are cached. There was never a trade to make.
>
> `unstable_cache` around the two data seams — the option this README recommended
> for a month — was tried first and reverted the same day. With real ISR the origin
> renders a URL once per revalidate window, so caching the query underneath buys
> almost nothing and adds a second TTL to keep in sync with `revalidate`.
>
> **The old step 1, the long tail, is done.** `/` shipped 2026-09-21 against `archetype/home.md`
> (§12 records what changed); `/tools` and the 3 calculators shipped 2026-09-21. They got
> no spec: unlike the homepage the copy, the routes and the arithmetic were all settled,
> so the only open questions were the controls and the component split, and both are
> recorded in the file headers. Everything else this step once listed is blocked on
> empty tables rather than on code — see below.

The old step 1 was one item; it is four here, because its parts do not share a
blocker. Redirects need no database, the forms need Brevo and a live `leaddata`
write, and the leftover handlers need neither. Splitting them means the SEO work can
land while the form work is still in review.

1. ~~**Redirects and the legacy shims.**~~ Done 2026-09-21. The rules live in
   `middleware.ts`, the three US/IN geo lookups they could not do there are exported
   from `lib/directory/data.ts`, and `lib/redirects.ts` holds the 301 and the 404 the
   four shims share.

2. **The lead forms.** `get-quotes`, `business-form` and `partners/join` (plus its
   `{district_slug}` variant), their three thank-you pages, and the four handlers
   behind them: `submitBusiness`, `sendBusinessSubmissionConfirmation`, `getCities`
   and `getLevel2s`. `lib/server/` already has `leads`, `email`, `leadConfirmation`
   and `internalAuth`, so this is the form UI, the validation wiring and the district
   tree the two selects need — `lib/tools/data.ts` already queries that tree, so read
   it before writing a second copy. **Open item 1 is a prerequisite, not a follow-up:**
   a 17-character phone is a 500 on the first real submission. Narrowing
   `@solar/validation`'s `phone` primitive is a cross-app change — agree it with
   main-app live before this step starts, or clamp at the Next boundary and record why.

3. **The remaining handlers.** `/data-access` and `/data-deletion` — both pages are
   built and both post to a 501, so they are the shortest path to two working pages —
   plus `submitDataAccess`, `submitDataDeletion`, `/api/stories`, `postRecentProject`,
   `updateRecentProject` and `/api/cron/purge-old-leads`. The three write routes are
   internal: they go through `lib/server/internalAuth.ts`, and the cron route needs its
   schedule decided as well as its body.

4. **Sitemaps and metadata.** The 3 sitemap handlers (`/sitemap.xml`,
   `/content-sitemap.xml`, `/{cc}/sitemap.xml`), which closes open item 2 — `robots.txt`
   points at a 501 today. Then `pageMetadata` on every page that still falls back to the
   root layout. The 117 editorial pages are the exception: `lib/metadata.ts` passes
   `meta_title` and `meta_description` through unaltered and must keep doing so, so open
   item 6 stays a CMS pass and is not in this step's scope.

5. ~~**ISR.**~~ Done 2026-09-21, ahead of steps 2–4. See open item 5.

   **Still open: the smoke harness.** One URL of each of the 76 route shapes,
   asserting 200, plus `x-nextjs-cache` on the 15 ISR shapes — Next sets that header
   to `HIT`/`STALE`/`MISS`/`REVALIDATED`, so the assertion that keeps ISR from
   silently regressing is a header check, not a timing heuristic.
   `NEXT_PRIVATE_DEBUG_CACHE=1` logs hits and misses if the harness needs to debug.
   Add a shape to the harness in the same commit that adds a route.

Not in these five, and deliberately: everything under **Blocked on data, not code**,
and open items 3, 4 and 6. Open item 4 (`/about-us` printing a lead count 2,000 higher
than the database supports) is a one-line fix in `lib/stats.ts` either way, but it is a
business decision — ask before launch, not at the end.

## Open items

1. **A phone number of `+` plus 16 digits is a 500.** `@solar/validation`'s `phone`
   primitive allows 17 characters; `leaddata.phone` is `varchar(16)`. Pre-existing and
   shared with main-app live, so narrowing the primitive is a cross-app change.
2. **`robots.txt` points at a 501.** `/sitemap.xml` is still a stub; step 2 builds it.
   The declaration is correct for where the file is going, not for today.
3. **The installer specimen is out of date.** `/specimen/archetypes/installer` still
   hides the boilerplate About; the shipped page renders it.
4. **`/about-us` adds 2,000 to the lead count it prints.** `lib/stats.ts` carries the
   `+ 2000` from the SvelteKit loader across verbatim, named `LEADS_BEFORE_LEADDATA`.
   Nothing in the database supports it, so "3,269+ Leads Generated" is 1,269 real rows
   plus a number no one here can source. Either the business confirms it or it comes out.
5. ~~**ISR is not running on 49 of the 76 routes.**~~ **Fixed 2026-09-21.** The 15
   built dynamic routes each export `generateStaticParams` returning `[]`. They are
   `●` in the build output and serve `s-maxage` with `x-nextjs-cache: HIT`. The
   other 34 `ƒ` routes are the unbuilt stubs and the route handlers; each gets ISR
   with the same two lines when it is built.

   Measured against `next build && next start`, replacing the table this item used
   to carry:

   | URL | before | after |
   | --- | --- | --- |
   | `/in/solar/maharashtra/pune` | `private, no-cache, no-store` | `s-maxage=1296000, swr=30240000`, HIT, 5ms |
   | `/rooftop-solar/cost` | `private, no-cache, no-store` | `s-maxage=1296000, swr=30240000`, HIT |
   | `/in/recent-solar-installation-projects` | `private, no-cache, no-store` | `s-maxage=86400, swr=31449600`, HIT |

   Three things worth knowing, all verified the same day:

   - **Middleware still runs.** Next's docs warn that middleware is skipped for
     on-demand ISR requests, which matters here because `middleware.ts` holds every
     legacy 301. It is skipped only for the internal regeneration fetch, not for the
     inbound request: `/in/rooftop-solar/cost`, `/solar-pumps/kusum-scheme`,
     `/us/state/solar-panel-installers-in-california`, `/in/blogs/*`, `/business/*`
     and `/in` all still 301, and the two that land on an ISR route follow through
     to 200.
   - **404s are cached too, and the key space is unbounded.** `/in/installer/does-not-exist`
     returns 404 with the same `s-maxage`. Spraying junk slugs fills the cache.
     SvelteKit's `config.isr` had the identical exposure, so this is parity, not a
     regression — but it is now worth a rate limit if it is ever abused.
   - **This is a Next 15 shape.** Under Next 16's Cache Components an empty
     `generateStaticParams` is a build error, and `revalidate`, `dynamicParams` and
     `dynamic` are removed entirely. Cache Components is opt-in, so a plain 16
     upgrade is safe; enabling it is a rework of all 15 files and wants
     `ISR with Cache Components` read first.

6. **Every editorial `meta_title` and `meta_description` is too long.** `meta_title`
   runs to 98 characters against Google's ~60, `meta_description` to 188 against ~155 —
   on all 117 pillar and cluster pages. Content, not code: `lib/metadata.ts` passes both
   through unaltered and should keep doing so. The fix is a CMS pass over `seo_pages`.
   `archetype/editorial.md` §2.

> Several file headers cite "README open item N" against an older numbering and no
> longer line up. Treat the number as a hint, not an address.

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
