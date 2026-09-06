# README

1. Keep all the routes as it is!
2. Keep most content as it is!
3. Design system, component library is the major opportunity that we want to exploit with React/Nextjs ecosystem.

## Problems with current system

1. Buttons, links and headings are indistinguishable
2. Retrofited design system, components, design tokens in app.css leaving its mark.

## Thought Process

The site is a content and directory site, not a component showcase. Most of the pixels are type, whitespace, images and tables. Buttons and dialogs are a rounding error.

1. Spacing rhythm. One vertical scale, applied by layout primitives, never by hand. PageShell was the right idea; it arrived late.
2. Density and hierarchy on data pages. Directory, installer and model-comparison pages are information design problems. That is where the impression of quality forms.
3. Imagery. Rooftop solar is a visual product and Cloudinary is already in place. Photography treatment, aspect ratios and next/image beat any component restyle.
4. Motion. CSS transitions only.

Define the system before anything renders

1. Type scale, spacing scale, colour, elevation, motion — decided as a set, argued once.
2. Layout primitives that make the archetypes buildable and the wrong thing unbuildable.
3. Components fall out of the archetypes — build what pages actually need, not a kit.
4. Lint rules locking all of it in from the first commit.

Mobile first sizing
Semantic HTML structure
CSS transitions via Tailwind for the "alive" feel — no JS animation libraries
Structured data is a first-class requirement.
typography owning the editorial surface; card, listing density and imagery own the directory surface.
No dark mode at all. :root { color-scheme: light; }

## Component strategy

daisyUI for everything visual. Radix primitives (headless) for the few genuinely
interactive things, styled with daisyUI classes.

Radix primitives give us focus traps, keyboard navigation, ARIA and portals — nothing
visual. So we keep one design system and one token set, and still get accessibility right.

Expect to need them for about three things: dialog/drawer for mobile navigation, combobox
for the location selects, accordion for FAQs. Everywhere else daisyUI plus plain Tailwind
is enough.

## Stack

- Next.js App Router + TypeScript strict. RSC is the default — server components everywhere, 'use client' only at interactive leaves.
- Tailwind 4 (daisyUI is a Tailwind plugin).
- @tailwindcss/typography (prose)
- lucide-react icons
- Free / MIT only. No paid libraries.

## Location

solar-app/apps/main-app-nextjs, inside the existing monorepo, sharing @solar/db and @solar/validation. SvelteKit and Next will coexist in the workspace for months.

## Archetype

Based on the routes create archetype

## Planning Steps

0. **Scaffold — done (0be12f8).** Empty Next 15 app, 49 pages + 19 route handlers,
   route list diffs clean against the SvelteKit app both ways. See `routes.md` and
   `archetype.md`.

1. **Design foundation — done.** Token set decided as one argument and verified:
   type, spacing, colour, radius, elevation, motion. Interaction and identity are
   separate hues on purpose. Approve it at `/specimen` (dev only). The argument,
   the reference survey and three traps worth re-reading are in
   `design-foundation.md`; `npm run check:contrast` re-verifies the 17 pairings.

2. **Archetypes — done.** Scoped to the three that are 90.5% of the site: installer
   profile (649), geo listing (601), geo index (29). Everything else is a port, not a
   design problem. Specs in `archetype/`, grounded on live-database measurements in
   `archetype/data.md` — which found that the badge, score, description and service
   chips are constants across the whole directory, and that the district sort is a
   no-op. Three decisions block the build; they are listed at the end of `archetype.md`.

2. **Archetypes — done.** Scoped to the three that are 90.5% of the site: installer
   profile (649), geo listing (601), geo index (29). Everything else is a port. Specs in
   `archetype/`, grounded on live measurements in `archetype/data.md` — which found the
   badge, score, description and service chips are constants across the directory, and
   that the district sort is a no-op. Approve visually at `/specimen/archetypes`.
