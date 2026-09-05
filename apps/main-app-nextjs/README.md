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

1. 