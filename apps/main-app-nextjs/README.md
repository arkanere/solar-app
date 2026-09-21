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
projects surface and the homepage — 1,404 of the 1,413 advertised URLs. 27 of 48 page
files; the other 21 are stubs. 16 of the 19 route handlers answer 501.

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
- `lib/countries/` — the per-country gate. Labels and features are data, never
  hardcoded. `moved-content.ts` is the list of families that live at the root.
- `lib/cloudinary-loader.ts` — the only place an image transform is written.
- `lib/server/` — the server-only modules: `db`, `leads`, `email` (Brevo),
  `magicLink` (mints customer sign-in tokens, IN-only), `leadConfirmation` (the email
  body, shared by `submitLead` and its own route). Needs `BREVO_API_KEY` and
  `INTERNAL_API_SECRET` in `.env.local`; `USER_APP_URL` is optional and defaults to
  production.
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
- `lib/metadata.ts` — the one metadata builder. It owns the tag set; each page owns its
  own title and description. Built pages call it; the stubs fall back to the root
  layout, which is also where `metadataBase` lives.

**Route Segment Config must be a literal in the route file.** `export const
revalidate = N`, never re-exported from a shared module and never an imported
constant: Next reads it by static analysis, so a re-export warns on every build and an
imported constant fails the build. `lib/editorial/routes.tsx` has the measurements.

## Next steps

Three left, in order. Re-plan after the last one lands.

1. **The long tail.** Left: `/tools` and the 3 calculators. Everything else this
   step once listed is blocked on empty tables rather than on code — see below.
   `/` shipped 2026-09-21 against `archetype/home.md`; its §12 records what changed.
   The 3 calculators are a straight port with two things already settled: there is no PostHog in this app,
   so the `capture` calls drop, and `solar-calculator`'s `state_subsidies` query is dead
   in the original — the page never reads it.
2. **Forms and handlers.** `business-form`, `get-quotes`, `partners/join`, the
   thank-you pages, the 10 API routes and 2 US legacy shims answering 501, and the
   legacy 301s from `hooks.server.ts` into `middleware.ts` — including
   `/solar-pumps/kusum-scheme` to `kusum-yojana`. `/data-access` and `/data-deletion`
   belong here too: both look static and both post to a handler that answers 501.
   The phone-length item below belongs here.
3. **Sitemaps, metadata, a smoke harness.** The 3 sitemap handlers, `pageMetadata` on
   every page, and a test that fetches one URL of each route shape and asserts 200.

## Open items

1. **A phone number of `+` plus 16 digits is a 500.** `@solar/validation`'s `phone`
   primitive allows 17 characters; `leaddata.phone` is `varchar(16)`. Pre-existing and
   shared with main-app live, so narrowing the primitive is a cross-app change.
2. **`robots.txt` points at a 501.** `/sitemap.xml` is still a stub; step 3 builds it.
   The declaration is correct for where the file is going, not for today.
3. **The installer specimen is out of date.** `/specimen/archetypes/installer` still
   hides the boilerplate About; the shipped page renders it.
4. **`/about-us` adds 2,000 to the lead count it prints.** `lib/stats.ts` carries the
   `+ 2000` from the SvelteKit loader across verbatim, named `LEADS_BEFORE_LEADDATA`.
   Nothing in the database supports it, so "3,269+ Leads Generated" is 1,269 real rows
   plus a number no one here can source. Either the business confirms it or it comes out.
5. **ISR is not actually running on 49 of the 76 routes — ~1,380 of the 1,413 URLs.**
   `export const revalidate` only applies to pages Next statically generates. A `[slug]`
   route with no `generateStaticParams` is `ƒ` — re-rendered on every request, querying
   the database each time. Measured 2026-09-21 against `next build && next start`:

   | URL | `Cache-Control` |
   | --- | --- |
   | `/rooftop-solar` (static) | `s-maxage=1296000, stale-while-revalidate=30240000` |
   | `/rooftop-solar/cost` (dynamic) | `private, no-cache, no-store, max-age=0` |

   It covers the 110 cluster articles, the 649 installer profiles, the 957 geo pages
   and the 3 project routes. Pre-existing, and a porting gap rather than a bug in any
   one file: SvelteKit's `config.isr` gave ISR to dynamic routes *without* prerendering
   them, and Next has no equivalent. Three ways out, none free — `generateStaticParams`
   per route (restores ISR, couples the build to the database for ~1,380 pages);
   `unstable_cache` around the two data seams (caches the queries, keeps the build
   DB-free); or accept it. **Deferred deliberately; decide before launch, not after.**
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
- **`solar_brands` is empty**, so the leaf route has no brand variant.
- **`solar_products` is empty**, so the three product model routes
  (`/{pillar}/{brand}/{model}`) are not built.
- **`authors` is empty**, so `/authors/{slug}` is not built. `features.authors` is on
  for IN and the route is in `MOVED_TO_ROOT`, so the gate opens the moment a row lands.
- **`rscore` is 0 on all 643 rows**, so the installer sort falls back to its tiebreakers.
- **`CountryConfig.name` has no article**, so `/us/solar`'s `h1` reads "Solar installers
  across United States". Wants a field on the config, which is a shared-type change.
