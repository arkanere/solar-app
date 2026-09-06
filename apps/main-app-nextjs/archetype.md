# Archetypes

An archetype is a route that renders many pages from one design **and** is worth
designing rather than porting. Both halves matter: the design work goes where the pages
are, and everything else gets carried across as-is.

Counts from the live sitemaps (2026-09-05) and the live database (2026-09-06).

## The three that matter

**The directory surface is 1,279 of 1,414 URLs — 90.5% of the site.** It is three
archetypes:

| # | Archetype | Pattern | Pages | Share | Spec |
| --- | --- | --- | ---: | ---: | --- |
| 1 | **Installer profile** | `/{cc}/installer/{slug}` | 649 | 46% | `archetype/installer-profile.md` |
| 2 | **Geo listing** | `/{cc}/solar/{state}/{district}` + `…/{slug}` | 601 | 42% | `archetype/geo-listing.md` |
| 3 | **Geo index** | `/{cc}/solar` + `/{cc}/solar/{state}` | 29 | 2% | `archetype/geo-index.md` |

`archetype/data.md` measures what is actually in these pages and grounds all three.
**Read it first** — several sections of the current pages turn out to render constants
or dead code, and none of that is visible from the source.

Archetype 2 carries sitemap priority 1.0, the highest on the site, and produces the
installer row that renders on all 601 of its pages. Build it first.

## Everything else is a port

The remaining ~135 URLs are the editorial surface (cluster articles, pillar landings,
subsidy and financing pages, product models) plus the long tail (project detail, the
paginated project list, author profiles). They are real pages and they still need to
work — but they are **assembly from the components archetypes 1–3 produce**, not
design problems of their own, and they do not justify their own specs.

Port them straight, reusing whatever the three archetypes have already established.
Two exceptions worth knowing when the time comes:

- The **editorial body is database HTML** rendered through `prose`. The Next app has
  `@tailwindcss/typography` installed where the SvelteKit app does not, so
  `ContentSections.svelte`'s hand-rolled table CSS — and the comment explaining that
  `prose` is inert — can go.
- `/{pillar}/{slug}` and `/solar-subsidy/{slug}` are **polymorphic**: each resolves a
  slug at runtime against two different tables (cluster vs brand; state subsidy vs
  discom). A port that assumes one shape per route will silently 404 a whole content
  family.

## Two structural facts the source and data reading turned up

**The geo split is by what a page lists, not by depth.** The old open question was
whether state → district → city was one archetype with a depth parameter or three
designs. It is neither. Country and state hubs list *child locations* and show no
businesses; district pages and city leaves list *businesses* and demote locations to a
chip row. So the country hub groups with the state hub, and the city leaf with the
district — across the depth boundary, not along it.

**The geo leaf route is polymorphic, with a dormant third branch.**
`resolveLeafSlug()` resolves a slug to a `city`, a `brand`, or a `{n}kw-solar-system`
**size** page. `solar_brands` is currently empty — a provision built ahead of need, to
be populated as the directory grows — so today the leaf is **city or size**. No design
work is owed to the brand variant now, but the component must dispatch on variant rather
than special-case two types onto a city page, or the provision costs a rewrite later.

## Decisions taken, 2026-09-06

| # | Decision | Effect |
| ---: | --- | --- |
| 1 | **`rscore` stays as the ranking signal** and will be populated later. Add `businessname ASC` as a final tiebreaker | Order becomes stable and explicable today; the row reserves a metric slot `rscore` will fill |
| 2 | **The "Verified Business" badge is removed**, and not replaced | Frees the top-right of the identity block and a line of every listing row. It was constant on 100% of profiles |
| 3 | **`CALL NOW` and `WHATSAPP` both become `action`** — filled primary and outlined secondary — instead of `bg-destructive` / `bg-success` | Status colours stop doing the work of actions; rule 2 holds |

## Still open

Narrower, but each shapes a whole section:

- **The city chip row.** A typical district page shows 9 chips of which 1 is a link, the
  rest identically-styled dead spans. Show only linked, style inert differently, or drop
  below a threshold?
- **The video hero** on all 601 geo-listing pages — keep, or replace with a typographic
  header?
- **The About section** on installer profiles, where 608 of 643 render the boilerplate
  string "Solar panel installer" under a heading saying About.

Approve these visually at `/specimen/archetypes` (dev only).

## Seeing them

`/specimen/archetypes` (dev only, alongside `/specimen`) renders all three against real
rows pulled from live — real business names up to seventy characters, real blank
addresses, real photographs, real geography.

It shows **only the proposed design**. It deliberately does not render the current
implementation anywhere: putting "today" beside "proposed" turns the question into
keep-or-tweak, and the question worth asking on 90% of the site is what these pages
should be.

It sits outside the `(layout-1)` route group on purpose: that group loads the editorial
serif, and the directory surface never uses it.

### What the design argues

1. **Lead with the work.** Rooftop solar is a visual product and the photographs are
   already in Cloudinary. They anchor every listing row and fill the top of a profile.
   Where a business has none, initials hold the slot so the column keeps one rhythm.
2. **One entity per row, one reading order** — anchor, name, place, services, with the
   comparable number right-aligned and tabular so twenty-two rows scan as a column.
3. **A number appears only when it means something.** A blank reads as "not measured";
   a zero reads as "measured, and bad".
4. **Nothing is shown on every page.** A marker every result carries is a logo, not a
   signal, and it costs the most valuable position on the card.
5. **Say what the coverage actually is** — ratios, not bare counts.
6. **One installer is an answer, not an empty list.** Half of all district pages have
   exactly one; that state gets its own treatment and a route to more choice.

### What the design needs from the data

It degrades to today's data without breaking and improves as these land: `rscore`
populated (the sort is built around it), more project photographs (two of Pune's
twenty-two have one), real descriptions (608 of 643 are a two-word placeholder), and
panel brands.
