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

1. **URL contract.** Snapshot the 1,414 live URLs as a fixture and diff-test against it.
   The contract is three layers: sitemap output, the 301s and rewrites in
   `hooks.server.ts`, and two US geo shims that redirect from inside their route
   handlers. Port `hooks.server.ts` into `middleware.ts` — including the `/in` and `/us`
   redirects the scaffold currently 404s on.

2. **Lint rules in CI.** No `dark:`, no raw hex outside tokens, no hand-rolled containers,
   no JS animation libraries, no `'use client'` without justification. These have to land
   before pages, not after — that is the whole lesson of the current app.

3. **Design foundation.** Reference survey first, then the token set decided as one
   argument: type scale, spacing, colour, radius, motion. One daisyUI theme configured
   from it. Ends with a specimen sheet to approve, not pages.

4. **One vertical slice.** Build the geo district page end to end at production quality —
   layout primitives, data layer, RSC boundary, metadata, structured data, images,
   mobile. Highest sitemap priority, exercises cards and listing density, links out to
   city and installer. Fix the design system here, before it is copied 1,200 times.

5. **Directory surface.** Installer profile, geo hub, geo listing. 90% of all URLs.
   Settle first whether state/district/city is one archetype or two.

6. **Editorial surface.** Pillar landings, cluster articles, brand pages, subsidy and
   discom, financing, product models. Typography and `prose` over database HTML.

7. **Non-page routes.** Three sitemap generators, the API endpoints, the cron route.

8. **Cutover.** Route tree by route tree behind rewrites, both apps live, watching Search
   Console between moves. Move a low-traffic tree first — tools or legal — to prove the
   rewrite mechanism before anything valuable depends on it.

### Open questions

- Are state, district and city one archetype or two? (Evidence says two: the state page
  is a browse page with no installers or lead form; district and city share their whole
  section stack, and `[slug]` already serves city, brand and size variants from one file.)
- Product model pages and the brand/size variants are in no sitemap. Deliberate or a gap?
- `/authors/{slug}` has a route and a generator but no rows. Keep or drop?
 