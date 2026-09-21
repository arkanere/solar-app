# The homepage — `/`

One page. Ported from `apps/main-app/src/routes/(layout-1)/+page.svelte`, which renders
`$lib/components/HomePage.svelte` and nothing else.

Figures measured against the live database and `next dev` on **2026-09-21**.

---

## 1. Not an archetype, and why it gets a spec anyway

`archetype.md` sets the bar: an archetype is a route that renders many pages from one
design **and** is worth designing rather than porting. This is one page, so it fails the
first half outright: it is a long-tail page, one of the pile carried across as-is.

It gets a spec because of the second half. Every other long-tail page could be ported
straight because **the design it was porting did not contradict the design system**. This
one does, on every axis the system has (§3). A straight port would make `/` the only page
in the app that is centred, that colours its headings, that lifts cards on a shadow, and
that shows the reader no numbers at all. The choice is not "design or port" — it is
"resolve the contradiction here, or leave the front door disagreeing with the other
1,412 URLs."

It is also the only page with a full-bleed element, which costs a change to a layout
primitive (§6). That is worth writing down before it is written in code.

## 2. What the live page is

Measured at 1440×900 on `https://solarvipani.com/`.

| # | Band | Height | Contents |
| ---: | --- | --- | --- |
| 1 | Hero | `--height-lg`, `md:42rem` | full-bleed photo, `black/55` scrim, two centred lines of white text |
| 2 | Browse Installers | — | centred orange `h2` + rule, 2 country cards |
| 3 | Learn About Solar | — | centred orange `h2` + rule, lede, 7 pillar cards |
| 4 | About Solarvipani | — | blurb, 2 stat tiles, social row |

**Band 4 is not in the repo.** `HomePage.svelte` ends after band 3. The deployment and
the source have drifted; this spec ports the source, and band 4's content already exists
as `/about-us`, which is linked from the footer.

Three things measured rather than inferred:

- **There is no call to action anywhere in the hero.** Not a button, not a link. On the
  site's front door, at 42rem tall, the first actionable element is below the fold.
- **There is no number anywhere above the fold.** No installer count, no coverage, no
  proof of any kind.
- **The hero loads a 4.5MB MP4** over a 91KB AVIF, on `requestIdleCallback`, to fade in
  a decorative video. The AVIF is the LCP element and is preloaded correctly.

The country cards carry a name, the sentence "Solar installers by state", and an arrow.
No count, no coverage — which is the same card the geo index rejected (`geo-index.md`
§5: "a name and a comparable number").

## 3. What the port cannot inherit

`design-foundation.md` gives the system three rules. The live homepage breaks all three,
and two more decisions the built pages have already settled.

| | System | Live homepage |
| --- | --- | --- |
| Rule 1 | Headings are ink; hierarchy from size and weight | `h2`s are brand orange with an underline rule |
| Rule 2 | Sky means "you can act on this" | nothing on the page is sky; nothing is a button |
| Rule 3 | Sunlight is identity only | sunlight is the heading colour |
| Alignment | left, at the measure | headings and hero copy centred |
| Elevation | a line, never a shadow, on the page itself | cards lift on `--shadow-card-hover` |

These are not five separate ports to fix. They are one fact: **the homepage predates the
design system and was never revisited.** The other 26 built page files already resolved
each of these, so the resolution here is to apply what they decided, not to invent.

## 4. The counts the original refused to print

`HomePage.svelte` carries a comment explaining why it shows no installer figures:

> Deliberately carries no installer counts. The headline numbers people reach for live in
> `masterlist_indian_businesses` / `masterlist_usa_businesses`, which are raw scrape
> lists — the directory itself shows 640 visible profiles for IN and 6 for US. Printing
> the masterlist figure would be false, and printing the true one would need a query this
> page otherwise does not make.

**The objection is correct and no longer binding.** It rejects the masterlist figure as
false — right — and then rejects the true figure only on cost. That cost is now zero:
`getCountryHub(cc)` already computes it, is memoised per request with React `cache`, and
is the exact query behind the sentence the country hub prints.

Measured through `getCountryHub` on 2026-09-21:

| | IN | US |
| --- | ---: | ---: |
| Visible installers | **646** | **6** |
| Districts / counties covered | 220 of 785 | 6 of 3,207 |
| States covered | 22 of 36 | 5 of 52 |

`geo-index.md` §2 calls the coverage ratio "the best piece of information design on the
directory surface." The homepage is where it matters most and the one place it does not
appear.

## 5. The page is a country chooser

The original takes no country prop, and its comment says the three URLs `/`, `/in` and
`/us` are meant to render identically.

**Two of the three no longer exist.** `/in` and `/us` 301 to `/` — see the comment on
the brand link in `components/chrome/SiteHeader.tsx`, and the merge dated 2026-08-22. So
the page is not "the same homepage under three prefixes." It is the one country-less
page, and the first decision it asks a reader to make is *which country*.

That settles §4's remaining ambiguity. A country chooser that does not say how much
coverage each country has is withholding the only fact relevant to the choice.

## 6. The hero is the one real design problem

Everything else in this spec is applying decisions the app has already made. The hero is
not, because nothing in the app is full-bleed yet.

**Shape.** A hero caps the *content* width, not the *background*. The `<section>` runs
edge to edge — that is the photograph and the scrim — and the copy inside sits in a
normal `Container`, so the `h1` aligns with every heading further down the page. Copy is
left-aligned, not centred, for the same reason.

**Height.** 42rem is a poster. ~24rem is a header with a photograph in it. The band has
to earn its height with content, and the content is a headline, a lede and two buttons.

**The `h1` belongs inside `<main>`.** `<main>` is the page's primary content and the `h1`
is the primary content; a hero above `<main>` means "skip to content" skips the page's
own headline. This is the structural cost of the section: `PageShell` owns both the
`<main>` and its `pt-xl`, so a flush full-bleed hero needs a hero slot on `PageShell` —
rendered inside `<main>`, before the stacked sections, with no gutter and no top padding.
About four lines. The alternative is the homepage hand-rolling its own `<main>` and
duplicating the primitive, which is worse.

**The subline is a `<p>`, not an `<h2>`.** "Save 10-20% on installation costs" is a
subtitle. As an `h2` it puts a phantom entry in the document outline above the page's
real sections.

**The photograph is decorative, so `alt=""`.** The copy on top of it carries the meaning.
The current alt text is announced for no benefit.

**The video does not come across.** 4.5MB of decoration on the site's front door, and
the only reason the page would need a client component at all. Without it the homepage is
entirely server-rendered. `static/header/header.avif` (91KB) moves to
`public/header/header.avif` and stays the LCP element: explicit dimensions, `priority`,
never lazy.

## 7. Anatomy

| # | Section | Measure | Notes |
| ---: | --- | --- | --- |
| 1 | Hero | full-bleed, copy at `content` | `h1`, lede `<p>`, 2 buttons |
| 2 | Coverage line | `content` | the `geo-index.md` ratio sentence, IN |
| 3 | Browse installers | `content` | 2 country cards via `LocationGrid` |
| 4 | Learn about solar | `content` | 7 pillar cards |
| 5 | Tools | `content` | 3 calculator links |

Section 5 is new. The 3 calculators were reachable only from the footer when this was
written; they are built and linked from here now.

## 8. Design direction

- **Sections 3 and 4 use the card the app already has.** Hairline `border-line` on
  `bg-surface`, heading in ink, no shadow. `LocationGrid` takes `{name, href,
  installerCount, coverage}` and already renders the amber coverage bar — the country
  cards are exactly its shape, one level up from the state cards it was written for.
- **Two buttons in the hero, not one.** The page serves two readers: someone ready to
  buy (*Get free quotes* → `/in/get-quotes`) and someone still reading (*Browse
  installers* → `/in/solar`). One primary fill, one outline.
- **`tabular-nums` on every count**, as the geo index does — sections 2 and 3 are a
  column of numbers the eye scans down.
- **Nothing centred.** Including the section headings, which are centred and orange on
  the live page and are neither anywhere else in this app.
- The pillar card keeps its icon. Seven different glyphs across seven cards is
  navigation, not the "marker every result carries" that `LocationGrid` dropped its pin
  for.

## 9. Data contract

`getCountryHub('in')` and `getCountryHub('us')`, in parallel. Both already exist, both are
memoised, and nothing new is added to `lib/directory/data.ts`.

Read from each: `totalInstallers`, `coveredLevel2Count`, `totalLevel2Count`,
`level1Count`, `totalLevel1Count`. The per-state `level1s` and `topLevel2s` arrays are
ignored here — they are the country hub's own page.

`export const revalidate = 1296000` — 15 days, matching `config.isr` on the SvelteKit
root loader, and a literal in the route file per the README's "Two rules that break
the build".

The counts move. Without the revalidate they are read once at build and the page's
coverage claim silently ages.

## 10. Metadata and structured data

`pageMetadata` with the original's title and description, which are good and stay:

> Solar Vipani | Find Verified Solar Installers
> Browse verified solar panel installers by state. Compare quotes, read reviews and go
> solar. Free to use.

Note the title already carries the site name, so it is passed to `pageMetadata` without
it — the builder appends the suffix.

The `Organization` + `WebSite` `@graph` comes across. **`sameAs` does not**, for the
reason `/about-us` dropped it: it asserted Facebook and LinkedIn profiles that nothing on
the page or in `SiteFooter` links to.

## 11. Open questions

1. **The hero text is outside the contrast system.** White on a photograph is the one
   legitimate exception — it is not text on a token surface — but it means
   `npm run check:contrast` cannot verify the most-viewed text in the app. The `black/55`
   scrim is carried across unchanged and unverified.
2. **Whether `/` should show per-country counts at all** is a product call, not a design
   one. §5 argues it should, because the page's job is a choice between two countries and
   the counts are what the choice turns on. Recorded here so the reverse is a decision
   rather than a regression.
3. **`us` reads "6 installers listed in 6 of 3,207 counties, across 5 of 52 states."**
   That is honest and it is also thin enough to read as a warning. The card shows it
   anyway — `geo-index.md` §2 settled that coverage is reported, not hidden — but the US
   card is the weakest thing this page will print.
4. **The deployed page has an About band the repo does not** (§2). Worth confirming
   nothing else has drifted before `/` is cut over.

## 12. What shipped

Built 2026-09-21 as `app/(layout-1)/page.tsx`. Static (`○`) at `next build`, with
`s-maxage=1296000` measured against `next start` — so it is a route where `revalidate`
genuinely applies, being static with no dynamic segment.

Everything in §7 shipped, in that order, with the figures §4 measured: 646 installers,
220 of 785 districts, 22 of 36 states. Three notes on how:

- **The hero slot landed on `PageShell` as described in §6** — a `hero` prop rendered
  inside `<main>` above the section stack, and the `pt-xl` drops when one is present so
  the band sits flush under the site header. It is the only caller.
- **The pillar and tool cards are a local `IconCard` in the page file**, not a shared
  component. It is `LocationGrid`'s card minus the count, and these two grids are the
  only icon cards in the app — a second call site would be the time to lift it out.
- **`/tools` and the 3 calculators are still stubs**, so section 5's three links point
  at pages that render a placeholder `h1` today. They are the next thing step 1 builds.

§11 question 4 is still open: the deployed About band was not re-checked before this
landed, and nothing else was compared against the live page.
