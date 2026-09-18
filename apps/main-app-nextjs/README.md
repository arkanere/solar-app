# README

The Next.js port of the marketing/directory site. In `solar-app/apps/main-app-nextjs`,
sharing `@solar/db` and `@solar/validation`. SvelteKit and Next coexist in the workspace.

1. Keep all the routes as it is!
2. Keep most content as it is!
3. Design system, component library is the major opportunity that we want to exploit with React/Nextjs ecosystem.

## Principles

The site is a content and directory site, not a component showcase. Most of the pixels are
type, whitespace, images and tables. Buttons and dialogs are a rounding error — so density
and hierarchy on the data pages is where the impression of quality forms, and imagery
beats any component restyle.

Standing rules for anything new:

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
- No Radix yet. It is the plan for real interactive things — dialog/drawer, combobox —
  but the FAQ is native `<details>` and the contact buttons are anchors, so nothing has
  needed one.

## Where things are

**The directory surface is complete — all three archetypes are built, 1,279 of 1,414
URLs.** Reasoning lives in the doc or the file header, never here; `git log` is the record.

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
