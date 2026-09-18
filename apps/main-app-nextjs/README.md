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
   Approve visually at `/specimen/archetypes`.

3. **Layout primitives — done.** Four in `components/layout/`: `PageShell` (the
   `<main>`, and the only place `--spacing-section` is applied), `Section` (one
   section, at a measure, with the page gutter), `Container` (measure + gutter) and
   `Stack` (vertical rhythm from the spacing scale). The two lint rules that were
   blocked on them landed with them: no `mx-auto` outside `components/layout/`, and
   no numeric Tailwind spacing anywhere. Both specimen sheets were converted to
   `Container`, which is what proved the rules catch real markup.

4. **Archetype 2, district page — done (cdc05d8).** `/{cc}/solar/{state}/{district}`,
   with both density treatments and the installer row that renders on all 601 geo
   pages. Scoped to the sparse page (`geo-listing.md` §5); everything else is gated on
   a country feature flag. `geo-listing.md` §12's three questions are decided: city
   chips show linked cities only, the video hero is replaced by a typographic header,
   both CTAs are `action`.

5. **@solar/db wired — done (f2fd815).** `lib/server/db.ts` holds the pool;
   `lib/directory/data.ts` is the real loader. The seam held — no component or page
   markup changed.

6. **The rest of the district page — done.** `lib/countries/` ported first, because
   every remaining section is gated on it: one file now renders 6 sections for a US
   county and all 17 for an Indian district. `geo-listing.md` §12 has no open questions
   left. The lead form was built here without a submit path; step 7 wired it.

7. **The submit path — done.** `POST /{cc}/api/submitLead` inserts `leaddata` through
   `lib/server/leads.ts`, and `LeadForm.tsx` posts to it. Three decisions: both countries
   post **local** (the SvelteKit split, where IN goes cross-origin to user-app, is not
   carried across); success **confirms in place** rather than redirecting to the
   `/{cc}/thank-you` stub; and the endpoint **enforces** `@solar/validation`'s `leadSchema`
   through `parseBody`, instead of the original's log-only `inspectBody` (safe here because
   this app's own form is the only caller — re-read that if another one is ever pointed at
   it). `lib/directory/leadValidation.ts` stays, client-side only, for blur-time messages;
   it is allowed to be stricter than the server, never looser, and the two known gaps are
   listed in its header.

   Verified against live: over-long name and malformed JSON now 400 rather than 500, an IN
   row resolved 560001 → Bengaluru Urban / Karnataka, a US row took a ZIP+4 with no comment
   and null levels. All test rows deleted after.

   **Known gap, not introduced here and not fixed here:** the canonical `phone` rule allows
   `+` plus 16 digits (17 characters) but `leaddata.phone` is `varchar(16)`, so that one
   input is a 500. It is shared with main-app live; narrowing the primitive is a cross-app
   change and belongs in its own commit.

8. **The city/size leaf — done.** `/{cc}/solar/{state}/{district}/{slug}`, 356 pages.
   The route is polymorphic, so `getLeaf` returns a discriminated `LeafLoad` and the page
   dispatches on `kind` — which is what `geo-listing.md` §4 asks for, and what makes brand
   an added case rather than a rewrite. **Brand is not implemented**: `solar_brands` is
   empty on live, so the branch would query nothing 356 times to render a page that has no
   design. It is named in `LeafLoad` and in `getLeaf` where it goes.

   Both failure modes are live and they differ on purpose: an unresolvable slug 404s, a
   city with no installers of its own redirects to the district. Three new components —
   `LeafHeader` (dispatches on variant), `SizePricing`, `BackLink` — and the five hardcoded
   price rows moved out of `SubsidySection` to `lib/directory/pricing.ts`, because the size
   tiles show one row of the same table and the SvelteKit app kept two copies of those
   numbers. `getDistrict`'s installer query became `loadInstallers`, shared by both pages.

   Verified against live: a Pune city leaf renders gallery, subsidy, FAQ and sibling chips;
   a US leaf renders the sparse set; `3kw-solar-system` prices and `4kw-solar-system` falls
   back; a city with no installers redirects; a nonsense slug 404s. Arizona Yuma shows the
   Arizona installer, so the level1 predicate `getDistrict` added is carried across.

   **One divergence from the spec:** §4 says 301 and this emits **308**. Next's App Router
   has no 301 — `permanentRedirect` is 308 and so is a `next.config` permanent redirect.
   Search engines treat them the same; the difference is that 308 forbids method rewriting,
   which does not arise on a GET-only page.

## Open items

9. **The directory routes sit in `(layout-1)`**, which loads the editorial serif.
   `archetype.md`, "Seeing them".
10. **Imagery policy beyond the hero.** `design-foundation.md` §9;
    `WorkThumb.tsx`, `ProjectGallery.tsx`.
11. **Archetypes 1 and 3.** `archetype/installer-profile.md`, `archetype/geo-index.md`.
12. **The lead confirmation email.** `/{cc}/api/sendLeadSubmissionConfirmation` is still a
    501 stub and `submitLead` deliberately does not call it, so a lead is captured but the
    visitor gets no email. Porting it pulls in `sendEmail`, `internalAuth` and
    `generateUserMagicLink`.
13. **No page metadata anywhere.** Nothing in this app emits a title, description,
    canonical or OG tag — not the leaf, not the district page at sitemap priority 1.0.
    The SvelteKit pages emit all four. Wants one `generateMetadata` helper applied across
    the page types, not a per-page fix.
