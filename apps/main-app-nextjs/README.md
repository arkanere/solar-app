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

Each step's reasoning lives in the file it points at, or in the header comment of the code
it produced. This list is a pointer, not a record.

0. **Scaffold** (`0be12f8`) — 49 pages + 19 route handlers; the route list diffs clean
   against the SvelteKit app both ways. `routes.md`, `archetype.md`.
1. **Design foundation** — type, spacing, colour, radius, elevation and motion decided as
   one set. `design-foundation.md`; approve at `/specimen`; `npm run check:contrast`
   re-verifies the 17 pairings.
2. **Archetypes** — scoped to the three that are 90.5% of the site: installer profile
   (649), geo listing (601), geo index (29). Specs in `archetype/`, grounded on live
   measurements in `archetype/data.md`. Approve at `/specimen/archetypes`.
3. **Layout primitives** — `PageShell`, `Section`, `Container`, `Stack` in
   `components/layout/`, plus the two lint rules they unblocked: no `mx-auto` outside that
   folder, no numeric Tailwind spacing anywhere.
4. **District page** (`cdc05d8`) — `/{cc}/solar/{state}/{district}`, both density
   treatments, and the installer row that renders on all 601 geo pages.
5. **`@solar/db` wired** (`f2fd815`) — `lib/server/db.ts` holds the pool,
   `lib/directory/data.ts` is the real loader. The seam held: no markup changed.
6. **The rest of the district page** — `lib/countries/` ported first, because every
   remaining section is gated on it. One file renders 6 sections for a US county and all
   17 for an Indian district.
7. **The submit path** (`847bdb3`) — `POST /{cc}/api/submitLead` writes `leaddata` and
   `LeadForm.tsx` posts to it. Both countries post local; success confirms in place; the
   endpoint enforces `@solar/validation`'s `leadSchema`. Reasons in the route header.
8. **The city/size leaf** (`b531f4a`) — 356 pages. The route is polymorphic, so `getLeaf`
   returns a discriminated `LeafLoad` and the page dispatches on `kind`. Brand is
   deliberately unimplemented (`solar_brands` is empty). Reasons in the page header.
9. **The directory group flattened** — `app/[country]/(layout-1)/` is gone; its routes
   sit directly under `app/[country]/`. The serif was never leaking: that group was a
   sibling of the editorial `app/(layout-1)/`, not a child, and its own layout was an
   empty pass-through. Route groups are URL-transparent, so no URL moved.
10. **Imagery policy** — `next/image` everywhere through `images.loaderFile`, which is
    what makes `<Image>` work from a server component; `lib/cloudinary-loader.ts` is the
    only place a transform is written. Galleries are 4:3, the 64px row anchor stays 1:1,
    and both numbers come from `archetype/data.md`'s survey of the real photographs.
    Argument in `design-foundation.md` §9 — including why `sizes` on a fixed-size image is
    a trap.

**Archetype 2 is complete.** Both its page types run on real data.

## Open items

9. **Archetypes 1 and 3.** `archetype/installer-profile.md`, `archetype/geo-index.md`.
10. **The lead confirmation email.** `/{cc}/api/sendLeadSubmissionConfirmation` is a 501
    stub and `submitLead` deliberately does not call it, so a lead is captured but the
    visitor gets no email. Porting it pulls in `sendEmail`, `internalAuth` and
    `generateUserMagicLink`.
11. **No page metadata anywhere.** Nothing in this app emits a title, description,
    canonical or OG tag — not the leaf, not the district page at sitemap priority 1.0.
    The SvelteKit pages emit all four. Wants one `generateMetadata` helper across the page
    types, not a per-page fix.
12. **A phone number of `+` plus 16 digits is a 500.** `@solar/validation`'s `phone`
    primitive allows 17 characters; `leaddata.phone` is `varchar(16)`. Pre-existing and
    shared with main-app live, so narrowing the primitive is a cross-app change.
