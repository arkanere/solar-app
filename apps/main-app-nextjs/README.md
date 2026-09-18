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

## Where things are

Reasoning lives in the doc or the file header, never here; `git log` is the record.

Built: the directory surface, all three archetypes, 1,279 of 1,414 URLs — 5 page files.
Stubbed: 44 pages, and 16 of the 19 route handlers answer 501.

| Doc | Covers |
| --- | --- |
| `routes.md` | Every route: 49 pages + 19 handlers. |
| `design-foundation.md` | Type, spacing, colour, radius, elevation, motion, imagery. Approve at `/specimen`; re-verify with `npm run check:contrast`. |
| `archetype.md` | Why there are three archetypes. `archetype/data.md` has the live measurements they are designed against. |
| `archetype/geo-listing.md` | Archetype 2 — district page and city/size leaf, 957 pages. |
| `archetype/installer-profile.md` | Archetype 1 — 649 pages, the largest. |
| `archetype/geo-index.md` | Archetype 3 — country and state hubs, 29 pages. §9 and §10 record what it decided and where it shipped differently from spec. |

Approve the page designs at `/specimen/archetypes` (dev only).

Code worth knowing before editing:

- `lib/directory/data.ts` — the single data seam. Every directory query lives here, each
  with the trap it avoids written above it (casing, correlated subqueries, composite keys).
- `components/layout/` — the layout primitives, and the two lint rules they unblocked:
  no `mx-auto` outside that folder, no numeric Tailwind spacing anywhere.
- `lib/countries/` — the per-country gate. Labels and features are data, never hardcoded.
- `lib/cloudinary-loader.ts` — the only place an image transform is written.
- `lib/server/` — the server-only modules: `db`, `leads`, `email` (Brevo),
  `magicLink` (mints customer sign-in tokens, IN-only), `leadConfirmation` (the email
  body, shared by `submitLead` and its own route). Needs `BREVO_API_KEY` and
  `INTERNAL_API_SECRET` in `.env.local`; `USER_APP_URL` is optional and defaults to
  production.
- `lib/metadata.ts` — the one metadata builder. It owns the tag set; each page owns its
  own title and description. Only the five built directory pages call it; the 44 route
  stubs fall back to the root layout, which is also where `metadataBase` lives.

## Next steps

Five, in order, planned 2026-09-18. Re-plan after the last one lands.

1. **Site chrome.** `SiteHeader` + `SiteFooter` into the root layout, plus `robots.txt`,
   favicon and the OG image. Ported from the SvelteKit `lib/components/chrome/`. Every
   page built so far renders with no nav and no footer.
2. **Archetype 4 — the editorial page.** `/`, the 7 pillar landings and
   `/{pillar}/{slug}`: the polymorphic resolver (cluster whitelist first, then brand —
   `routes.md`) and one `prose` body for the database HTML. ~90 URLs, the largest block
   left.
3. **The long tail.** Product model pages, `/solar-subsidy/{slug}` (state subsidy vs
   discom — polymorphic again), project detail, the paginated project list, authors,
   `/seo-index`, the legal pages and the 3 tools. Assembly from step 2's parts.
4. **Forms and handlers.** `business-form`, `get-quotes`, `partners/join`, the
   thank-you pages, the 10 API routes and 2 US legacy shims answering 501, and the
   legacy 301s from `hooks.server.ts` into `middleware.ts`. Open item 1 belongs here.
5. **Sitemaps, metadata, a smoke harness.** The 3 sitemap handlers, `pageMetadata` on
   every page, and a test that fetches one URL of each route shape and asserts 200.

## Open items

1. **A phone number of `+` plus 16 digits is a 500.** `@solar/validation`'s `phone`
   primitive allows 17 characters; `leaddata.phone` is `varchar(16)`. Pre-existing and
   shared with main-app live, so narrowing the primitive is a cross-app change.
2. **The installer specimen is out of date.** `/specimen/archetypes/installer` still
   hides the boilerplate About; the shipped page renders it.

### Blocked on data, not code

- **`state_subsidies` is empty** in every status, so the state hub's subsidy callout is
  not built — the gate can never open. Same shape as **`solar_brands`**, which is why the
  leaf route has no brand variant: a provisioned table with no rows.
- **`rscore` is 0 on all 643 rows**, so the installer sort falls back to its tiebreakers.
- **`CountryConfig.name` has no article**, so `/us/solar`'s `h1` reads "Solar installers
  across United States". Wants a field on the config, which is a shared-type change.
