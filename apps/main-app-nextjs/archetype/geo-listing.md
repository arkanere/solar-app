# Archetype 2 — Geo listing (district + city/size leaf)

`/{cc}/solar/{state}/{district}` (245 pages) and
`/{cc}/solar/{state}/{district}/{slug}` (356 pages). **601 pages, 42% of the site.**
District pages carry sitemap priority 1.0 — the highest on the site.

Ported from `solar/[state]/[district]/+page.*` and `solar/[state]/[district]/[slug]/+page.*`.
Data figures from `data.md`.

---

## 1. What this page is for

A list of businesses that can do the job, in a place. The reader is comparing, then
picking one to contact. This is the site's core information-design problem and the
component it produces — the installer row — renders on all 601 of these pages.

## 2. The density problem, stated properly

| Installers per district | today |
| --- | ---: |
| p50 | **2** |
| p90 | 7 |
| max | 22 (Pune, Ernakulam) |
| districts with exactly 1 | **108 of 221** |

**The design target is 20+, not 2.** Pune (22), Ernakulam (22), Lucknow (17) and Jaipur
(16) are the shape the directory is growing into; designing for a median of 2 designs
for the state the site is leaving.

But both cases are live at once, and they want opposite things:

| | 1 result | 20+ results |
| --- | --- | --- |
| Layout | a single profile summary | a scannable column |
| Scan order | irrelevant | decisive |
| Right-aligned metric | pointless | necessary |
| Sort / filter controls | noise | real |
| Card height | can be generous | must be tight |

**Resolve it by designing the 20+ column first, then giving the 1-result case its own
treatment** — not a one-item list, but a "the installer serving {district}" block that
looks deliberate. The middle (2–6 results, ~40% of pages) uses the column layout
without controls.

Do **not** design one elastic layout that is mediocre at both ends. Two treatments,
one component, switched on `installerCount`.

## 3. The sort — DECIDED: `rscore` stays, with a stable tiebreaker

Businesses are ordered by recent-project count, then `rscore` descending. From `data.md`:
`rscore` is **0 on all 643 rows**, and only **38 businesses have any project at all** —
so today the order of the primary content is whatever Postgres happens to return,
unstable across deploys.

**Decision (2026-09-06): `rscore` is the intended ranking signal and will be populated
later.** The sort stays as designed. Two things follow:

1. **Add `businessname ASC` as a final tiebreaker.** While `rscore` is flat this is what
   actually orders the page, and it makes today's ordering stable and explicable instead
   of arbitrary. It costs nothing once `rscore` fills.
2. **The row reserves a metric slot** (§7) that `rscore` will occupy. Until it is
   populated the slot shows project count where there is one, and nothing where there is
   not — it does not show a score of zero.

So the effective order is: `projects DESC, rscore DESC NULLS LAST, businessname ASC`.

Worth stating on the page once there is a real signal to state. While the visible order
is alphabetical, saying so is honest and cheap.

## 4. The leaf route is polymorphic

`resolveLeafSlug()` resolves the slug in order:

| `pageType` | Resolves against | Example | Live? |
| --- | --- | --- | --- |
| `city` | `geo_locations` | `/in/solar/maharashtra/pune/wakad` | yes — 351 pages |
| `brand` | `solar_brands` | `…/pune/waaree` | **no — table empty (provision)** |
| `size` | `{n}kw-solar-system` | `…/pune/3kw-solar-system` | yes, IN only |

Brand and size are gated on `features.seoContentFamilies`, so a US city slug can never
resolve to either.

Two consequences:
- **Today the leaf is city or size.** No design work is owed to the brand variant.
- The component must nevertheless **dispatch on variant** rather than being a city page
  with two special cases bolted on, because brands are a known future requirement. That
  is what makes the provision pay off instead of forcing a rewrite.

**A city with no installers 301s to the district page.** The district is the canonical
listing. Do not lose that redirect — it is what keeps thin pages out of the index.
The district page instead **404s** when it has no businesses. Different on purpose.

## 5. Anatomy

| # | Section | District | City | Size | Notes |
| ---: | --- | :---: | :---: | :---: | --- |
| 1 | Hero banner (video, title overlay) | ✓ | ✓ | ✓ | see §8 |
| 2 | Breadcrumb | ✓ | ✓ | ✓ | |
| 3 | Stat chips | ✓ | ✓ | ✓ | installers, cities served |
| 4 | Local social-proof line | ✓ | — | — | floor of 3 leads — **113 of 221 pages** |
| 5 | Size pricing tiles | — | — | ✓ | 3 tiles, hardcoded table |
| 6 | Size cluster-guide link | — | — | ✓ | |
| 7 | **Lead form** | ✓ | ✓ | ✓ | |
| 8 | **Installer list** | ✓ | ✓ | ✓ | **the page** |
| 9 | Project gallery | ✓ | ✓ | — | limit 6 |
| 10 | Subsidy section | ✓ | ✓ | — | `features.subsidy` |
| 11 | Quote CTA | ✓ | ✓ | ✓ | IN only |
| 12 | Solar guides chips | ✓ | — | — | 3 hardcoded links |
| 13 | Recommended systems | ✓ | — | — | |
| 14 | FAQ | ✓ | ✓ | — | generated, `<details>` |
| 15 | Child/sibling chips | ✓ cities | ✓ nearby | ✓ sizes | see §6 |
| 16 | Size chips | ✓ | — | — | 1/2/3/5/10 kW |
| 17 | Back link | — | ✓ | ✓ | |

**The US district page is sections 1, 2, 3, 7, 8, 11, 15 only** — everything else is
gated on `features.projects`, `features.subsidy`, `features.seoContentFamilies` or
`cc === 'in'`. Design the sparse page first; the IN page is the fat one and will look
fine either way.

## 6. The city chip row is 89% dead labels

Measured over the 221 district pages that exist:

| | p50 | p90 | max |
| --- | ---: | ---: | ---: |
| Total chips | 9 | 20 | 47 |
| Chips that are **links** | **1** | 3 | 7 |

A typical district page renders **nine chips of which one works**. The other eight are
grey spans styled identically to the link. That is rule 2 broken, and it is also just a
bad section: it advertises coverage the site does not have.

Options: show only the linked cities; or keep all but make the unlinked ones visibly
inert (lighter, no chip container); or drop the section on pages where fewer than *n*
cities link. Needs a decision — it is one of three chip rows on this page (12, 15, 16)
that are visually identical and mean three different things: editorial cross-links,
navigation down, and navigation sideways.

## 7. The installer row — the most-rendered component on the site

601 pages. Get this right and the site is most of the way there.

**Current anatomy:** header with the business name as an `h3`-wrapped link plus a `tag`
badge; body with an address line (pin icon), a phone line (`tel:` link, phone icon), and
a "Recent Work" strip of up to three 56px thumbnails; footer with `CALL NOW` and
`WHATSAPP`.

**What the data says about it:**

- The **badge is gone.** It was `'Verified Business'` on 100% of rows — 22 identical
  badges stacked down a Pune page. Decided 2026-09-06: removed, not replaced. See
  archetype 1 §5.
- **"Recent Work" appears on ~6% of rows.** It is an exception, not a standard row
  element, and the layout must not reserve space for it.
- **The name reaches 70 characters.** Must wrap to two lines without breaking the row.
- **Address is missing on 19 and non-unique** (482 distinct across 643) — it is
  location context, not an identifier.
- **11 rows have no phone**, and both CTAs depend on it. Real empty state.
- **No metric is currently shown at all.** `rscore` sorts but is invisible and zero;
  project count sorts but is only implied by thumbnails. The row reserves a slot for it
  (§3).

**Proposed row anatomy** — one entity per row, fixed reading order, metric right-aligned:

```
┌────────────────────────────────────────────────────────────┐
│ Business Name (link, ink, wraps to 2 lines)   │  3 projects │
│ City · District                               │             │
│ +91 XXXXX XXXXX                               │ [Call] [WA] │
└────────────────────────────────────────────────────────────┘
```

Name → place → phone on the left; the one comparable metric right-aligned and tabular so
the eye can scan a column; actions in a fixed position. At 22 rows this scans. At 1 row
it becomes the single-result treatment from §2 instead.

The metric column holds project count today and `rscore` once it is populated (§3). It
renders nothing rather than a zero when there is no signal — an empty cell reads as
"not measured", a `0` reads as "measured and bad".

## 8. Design direction

- **Rules 1–3 as everywhere:** every heading and every link is `text-primary-strong`;
  icons are brand-coloured decoration. Headings → ink, links → `action` + underline,
  icons → `ink-subtle`.
- **CTA colour — DECIDED.** `CALL NOW` was `bg-destructive` and `WHATSAPP`
  `bg-success`. Both become **`action`**: `CALL NOW` filled primary, `WHATSAPP` outlined
  secondary of the same hue. See archetype 1 §6.
- **The video hero** sits on all 601 of these pages plus the leaf variants, carries no
  information, and is the largest asset on the two highest-traffic page types.
  `design-foundation.md` §9 defers imagery policy to exactly this slice. Recommend
  replacing it with a typographic header; flagged as a question rather than assumed.
- **Three identical chip rows meaning three different things** (§6).
- **Section 4's floor is right.** Keep the `>= 3` gate.
- **Build this archetype first.** It exercises the installer row, both density
  treatments, the imagery decision, the chip-row decision and the empty state — and it
  is the page the site is judged on.

## 9. Data contract

`resolveLevel2()` for the 404, then six parallel queries: businesses
(`BUSINESS_CARD_SELECTION`), recent projects (limit 6), cities with a `hasBusiness`
flag, subsidy row, one postal code, lead count. Then
`getTopProjectsPerBusiness(slugs)` — `ROW_NUMBER() OVER (PARTITION BY business_slug)`,
top 3 each, on the `sql` escape hatch.

`BUSINESS_CARD_SELECTION` (snake_case wire shape): `businessname`, `description`,
`phonenumber`, `slug`, `address`, `pluscode`, `level1` as `state`, `city`, `tag`,
`rscore`, `businessfilled`, `services`.

Note `description`, `tag`, `rscore` and `businessfilled` are all selected and are all
either constant or unrendered (`data.md` §"six fields"). The selection can shrink once
the row design is settled.

Two traps already fixed upstream, easy to reintroduce — both documented in the SvelteKit
loader and worth re-reading before porting:

- Per-level2 counts must be a **separate grouped query**, not a correlated subquery in
  the select list. Drizzle renders an interpolated column unqualified, so the correlation
  silently became `b.level2 = b.level2` and every district reported the state total.
- Counts key on `LOWER(level2)` and **sum**, because `geo_locations` and
  `business_profiles` disagree on casing and the latter holds several casings of one
  name. `level1` is part of the match because level2 names repeat across states
  ("Washington County").

## 10. Structured data

`breadcrumbLD`, up to 5 `localBusinessLD`, and `faqLD` when FAQ items exist. An
`ItemList` over the installer rows is the obvious addition and is not currently emitted
— this is a ranked list of local businesses, which is exactly what `ItemList` is for.
Now unblocked: §3 gives a defined, stable order.

## 11. Components

`HeroBanner`, `Breadcrumb`, `StatChips`, `CalloutBand`, `KeyFactsGrid` (size tiles),
`LeadFormSection` (client), **`InstallerRow`** + `InstallerList` (with the two density
treatments), `ProjectGallery`, `SubsidySection`, `QuoteCTA`, `ChipList` (link and inert
variants), `FAQ` (native `<details>` — no Radix needed), `BackLink`.

Client leaves: `LeadFormSection`, and the action buttons inside `InstallerRow`. The row
body stays a server component.

## 12. Open questions

~~1. Sort order~~ — **decided: `rscore` stays, `businessname ASC` tiebreaker** (§3).
~~2. Badge~~ — **decided: dropped, not replaced** (§7).
~~3. CTA colour~~ — **decided: both `action`** (§8).

1. **City chip row** — show only linked, style inert differently, or drop below a
   threshold? A typical district shows 9 chips of which 1 is a link (§6).
2. **Keep the video hero?** (§8)
3. Sections 12, 13 and 16 are IN-only SEO surface — keep as three blocks, or fold into
   one "related" section?
