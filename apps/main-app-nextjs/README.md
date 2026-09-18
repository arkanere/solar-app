# README

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

In `solar-app/apps/main-app-nextjs`, sharing `@solar/db` and `@solar/validation`.
SvelteKit and Next coexist in the workspace.

## Done

A pointer list. Reasoning lives in the doc or the file header each line names; `git log`
is the record.

1. **Scaffold** — 49 pages + 19 route handlers. `routes.md`.
2. **Design foundation** — type, spacing, colour, radius, elevation, motion as one set.
   `design-foundation.md`; approve at `/specimen`; `npm run check:contrast`.
3. **Archetypes** — the three that are 90.5% of the site. `archetype.md`, specs in
   `archetype/`, live measurements in `archetype/data.md`. Approve at
   `/specimen/archetypes`.
4. **Layout primitives** — `components/layout/`, plus the two lint rules they unblocked:
   no `mx-auto` outside that folder, no numeric Tailwind spacing anywhere.
5. **Archetype 2, geo listing** — district page and city/size leaf, 957 pages.
   `archetype/geo-listing.md`, `lib/directory/data.ts`, gated by `lib/countries/`.
6. **Archetype 1, installer profile** — 649 pages, the largest archetype.
   `archetype/installer-profile.md`, `getInstaller` in `lib/directory/data.ts`.
7. **The submit path** — `POST /{cc}/api/submitLead` writes `leaddata`; `LeadForm.tsx`
   posts to it and `@solar/validation` is enforced at the endpoint.
8. **Imagery policy** — `next/image` through `images.loaderFile`;
   `lib/cloudinary-loader.ts` is the only place a transform is written.
   `design-foundation.md` §9.
9. **Archetype 3, geo index** — the two hubs, 29 pages. `archetype/geo-index.md` §9
   and §10 record the five open questions it closed and the five places it shipped
   differently. `getCountryHub` / `getStateHub` in `lib/directory/data.ts`.
   **The directory surface is now complete: all three archetypes are built.**

## Open items

1. **No page metadata anywhere.** Nothing in this app emits a title, description,
   canonical or OG tag. Wants one `generateMetadata` helper across the page types, not a
   per-page fix — and it must not copy the profile's meta description, which interpolates
   a description that is boilerplate on 608 of 643 rows.
2. **The lead confirmation email.** `/{cc}/api/sendLeadSubmissionConfirmation` is a 501
   stub and `submitLead` deliberately does not call it, so a lead is captured but the
   visitor gets no email. Porting it pulls in `sendEmail`, `internalAuth` and
   `generateUserMagicLink`.
3. **A phone number of `+` plus 16 digits is a 500.** `@solar/validation`'s `phone`
   primitive allows 17 characters; `leaddata.phone` is `varchar(16)`. Pre-existing and
   shared with main-app live, so narrowing the primitive is a cross-app change.
4. **The installer specimen is out of date.** `/specimen/archetypes/installer` still
   hides the boilerplate About; the shipped page renders it.
5. **`state_subsidies` is empty on live**, in every status. It gates the state hub's
   subsidy callout (`archetype/geo-index.md` §3 section 5), which is therefore not
   built — the gate can never open. Same shape as `solar_brands`, which blocks the
   leaf route's brand variant: a provisioned table with no rows.
6. **`CountryConfig.name` has no article.** It is a bare "United States", so
   `/us/solar`'s `h1` reads "Solar installers across United States". Wants a field on
   the config, which is a shared-type change; the SvelteKit page live today has the
   same wording.
