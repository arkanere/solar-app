# README

1. Keep all the routes as it is!
2. Keep most content as it is!
3. Design system, component library is the major opportunity that we want to exploit with React/Nextjs ecosystem.

## Problems with the SvelteKit app

1. Buttons, links and headings are indistinguishable.
2. A retrofitted design system, with components and tokens bolted into `app.css`.

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

Radix primitives (headless) are the plan for the few genuinely interactive things —
dialog/drawer for mobile navigation, combobox for the location selects — because they give
focus traps, keyboard navigation, ARIA and portals without any visuals of their own.
**Nothing has needed one yet**: the FAQ is native `<details>` and the contact buttons are
anchors, so Radix is not a dependency.

## Location

`solar-app/apps/main-app-nextjs`, inside the existing monorepo, sharing `@solar/db` and
`@solar/validation`. SvelteKit and Next will coexist in the workspace for months.

## Done

Reasoning lives in the file each line points at, or in the header comment of the code it
produced. This is a pointer list; `git log` is the record.

1. **Scaffold** — 49 pages + 19 route handlers, diffed clean against the SvelteKit route
   list both ways. `routes.md`.
2. **Design foundation** — type, spacing, colour, radius, elevation and motion decided as
   one set. `design-foundation.md`; approve at `/specimen`; `npm run check:contrast`
   re-verifies the 17 pairings.
3. **Archetypes** — the three that are 90.5% of the site: installer profile (649), geo
   listing (601), geo index (29). `archetype.md`, specs in `archetype/`, grounded on live
   measurements in `archetype/data.md`. Approve at `/specimen/archetypes`.
4. **Layout primitives** — `PageShell`, `Section`, `Container`, `Stack` in
   `components/layout/`, plus the two lint rules they unblocked: no `mx-auto` outside that
   folder, no numeric Tailwind spacing anywhere.
5. **Archetype 2, complete on real data** — the district page and the city/size leaf, 601
   + 356 pages, loaded by `lib/directory/data.ts` over `@solar/db`. `lib/countries/` gates
   every section: one file renders 6 for a US county and all 17 for an Indian district. The
   leaf route is polymorphic, so `getLeaf` returns a discriminated `LeafLoad`; brand is
   deliberately unimplemented (`solar_brands` is empty). Reasons in the page headers.
6. **The submit path** — `POST /{cc}/api/submitLead` writes `leaddata` and `LeadForm.tsx`
   posts to it. Both countries post local, success confirms in place, `@solar/validation`'s
   `leadSchema` is enforced at the endpoint. Reasons in the route header.
7. **Imagery policy** — `next/image` everywhere through `images.loaderFile`, which is what
   makes `<Image>` work from a server component; `lib/cloudinary-loader.ts` is the only
   place a transform is written. Galleries are 4:3, the 64px row anchor 1:1, both numbers
   from `archetype/data.md`'s survey of the real photographs. `design-foundation.md` §9,
   including why `sizes` on a fixed-size image is a trap.

## Open items

1. **Archetypes 1 and 3.** `archetype/installer-profile.md`, `archetype/geo-index.md`.
2. **The lead confirmation email.** `/{cc}/api/sendLeadSubmissionConfirmation` is a 501 stub
   and `submitLead` deliberately does not call it, so a lead is captured but the visitor
   gets no email. Porting it pulls in `sendEmail`, `internalAuth` and
   `generateUserMagicLink`.
3. **No page metadata anywhere.** Nothing in this app emits a title, description, canonical
   or OG tag — not the leaf, not the district page at sitemap priority 1.0. The SvelteKit
   pages emit all four. Wants one `generateMetadata` helper across the page types, not a
   per-page fix.
4. **A phone number of `+` plus 16 digits is a 500.** `@solar/validation`'s `phone`
   primitive allows 17 characters; `leaddata.phone` is `varchar(16)`. Pre-existing and
   shared with main-app live, so narrowing the primitive is a cross-app change.
