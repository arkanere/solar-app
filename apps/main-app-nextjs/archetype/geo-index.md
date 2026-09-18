# Archetype 3 — Geo index (country + state hubs)

`/{cc}/solar` (2 pages) and `/{cc}/solar/{state}` (27 pages). **29 pages.**

Small by count, but it is the entry point to the other 1,250 URLs in the directory
surface. Ported from `solar/+page.*` and `solar/[state]/+page.*`.
Data figures from `data.md`.

---

## 1. Why this is one archetype with archetype 2, and not three levels

`archetype.md` used to ask whether state → district → city was one archetype with a
depth parameter or three designs. Reading all four levels: **neither.** The split is not
by zoom level, it is by **what the page lists**:

- The **country hub and state hub** list *child locations*. No businesses appear.
- The **district page and city leaf** list *businesses*. Child locations demote to a
  chip row at the bottom.

So the country hub belongs with the state hub, and the city leaf belongs with the
district — grouping **across** the depth boundary, not along it. Two archetypes, not one
and not three.

The two levels here are the same six parts at different scope. Vocabulary comes from the
country config (`levels.level1` = State/States, `levels.level2` = District/Districts in
IN, County/Counties in US), so labels are **data, never hardcoded strings**.

## 2. This is a coverage page, and coverage is thin

The page's real subject is *where we have installers*. From `data.md`:

| | |
| --- | ---: |
| States with installers | **22 of 36** |
| Districts with installers | **221** |
| Districts per state (all) | p50 20, max 75 |
| Installers per district | p50 **2**, max 22 |

So the country hub is honestly reporting **61% state coverage**, and behind most covered
states sits a handful of districts with one or two installers each.

The existing design already makes the right call here: it filters out zero-installer
locations, and it shows coverage as a ratio — "12 of 33 districts" — with a progress bar
on the country hub's state cards. **That bar is the best piece of information design on
the directory surface.** It shows a ratio as a ratio instead of a bare count. Keep it,
and extend it to the state hub, which already has the numbers (`level2Count` of
`totalLevel2Count`) and currently does not draw it.

The coverage arithmetic is the reason the country-hub query sits on the `sql` escape
hatch (a CTE with `COUNT(*) FILTER` plus a correlated scalar subquery). It is what the
page displays — port it verbatim.

## 3. Anatomy

| # | Section | Country | State | Notes |
| ---: | --- | :---: | :---: | --- |
| 1 | Breadcrumb | ✓ | ✓ | Home / Solar [/ State] |
| 2 | `h1` + intro paragraph | ✓ | ✗ | intro is country-hub only |
| 3 | Stat chips | ✓ | ✓ | country: installers, states, districts. state: installers, districts |
| 4 | Coverage callout | ✓ | ✓ | prose + percentage; state's links up to the country hub |
| 5 | Subsidy callout | — | ✓ | `features.subsidy` + a published row |
| 6 | Quote CTA | ✓ | ✓ | IN only |
| 7 | **Child-location card grid** | ✓ | ✓ | **the page.** Country cards have a coverage bar; state cards do not |
| 8 | Solar guides chips | ✓ | — | `features.seoContentFamilies` |
| 9 | FAQ | — | ✓ | generated, native `<details>` |

**The CTA sits above the grid on the state hub and below it on the country hub.** That
is drift, not a decision. Pick one — below the grid, since the grid is the page.

## 4. The stat chips restate the callout

Sections 3 and 4 say the same thing twice, in two registers:

> chips: `643 Installers` · `22 of 36 States` · `221 Districts`
> callout: "Nationwide coverage: verified installers in 22 of 36 states (61%), across
> 221 districts."

Three numbers, then the same three numbers as a sentence with a percentage. Showing a
figure twice is a large part of why these pages read as noisy. **Pick one carrier.**
Recommend keeping the chips as the scannable summary and dropping the callout prose to
just the percentage — or the reverse. Not both.

## 5. Design direction

- **Rules 1–3.** Every `h1`, `h2` and `h3` is `text-primary-strong`, and so is every
  link — including the links *inside* the coverage callout, which are therefore
  indistinguishable from the bold text around them. This is `design-foundation.md` §2 in
  its purest form. Headings → ink; links → `action` + underline; the pin icons on the
  cards → `ink-subtle`.
- **The card grid deserves the attention.** 29 pages, but they are the doorway to 1,250.
  The card is: pin icon, location name, installer count, and (country only) a coverage
  ratio plus bar. That is already close to right — a name and a comparable number. Fix
  the colour, keep the structure, add the bar to the state hub.
- **Counts should be tabular figures**, since the whole grid is a column of numbers the
  eye scans down.
- The `h2` on the grid is `text-center` at `text-3xl` — larger and centred where nothing
  else on the page is. Bring it into the scale.
- Two tinted `bg-accent/10` callouts (4 and 5) sit adjacent on the state hub meaning
  different things — coverage, and a subsidy offer. Same problem as archetype 2's three
  chip rows.

## 6. Data contract

**Country hub.** One `sql` CTE plus a total count. Per level1: `name`, `slug`,
`level2Count`, `coveredLevel2Count`, `installerCount`; rows with `installerCount === 0`
filtered in JS. Page-level: `totalInstallers`, `level1Count`, `totalLevel1Count`,
`coveredLevel2Count`, `totalLevel2Count`.

**State hub.** `resolveLevel1(cc, slug)` for the 404, then five parallel queries: level2
list, per-level2 installer counts, aggregate stats (`count`, `max(createdAt)`), subsidy
row, latest project date. Per level2: `name`, `slug`, `installerCount`; zero-installer
entries filtered out.

Two traps, both already fixed in the SvelteKit loader and both easy to reintroduce:

- Per-level2 counts are a **separate grouped query**, not a correlated subquery in the
  select list. Drizzle renders an interpolated column unqualified, so the correlation
  became `b.level2 = b.level2`, every district reported the state total, and the `> 0`
  filter stopped filtering.
- Counts key on `LOWER(level2)` and are **summed**, because `geo_locations` and
  `business_profiles` disagree on casing and the latter holds several casings of one
  name. `level1` is part of the match because level2 names repeat across states.

`lastUpdated` on the state hub is a real `max()` over installer and project dates; on
the country hub it is `new Date().toISOString()` — i.e. always "now", which is not a
last-updated date. Neither is currently rendered. Either compute it properly or drop it.

## 7. Structured data

`breadcrumbLD` only. An `ItemList` over the child locations would be reasonable and,
unlike archetype 2, the order here **is** well defined (alphabetical), so it is not
blocked on anything.

## 8. Components

`Breadcrumb`, `StatChips`, `CalloutBand`, **`LocationCard`** + `LocationGrid` (with the
optional coverage bar), `ChipList`, `FAQ`, `QuoteCTA`. All shared with archetypes 1 and
2 except `LocationCard`.

No client components at all. This archetype is entirely static — `FAQ` is native
`<details>`, every card is an anchor.

## 9. Open questions — RESOLVED 2026-09-18

All five settled when the archetype was built. The answers are in the page files;
this records the calls and why.

1. **Chips or callout — which carries the coverage numbers?** (§4) → **Neither.**
   One sentence under the `h1` carries them, at both levels: "646 installers listed
   in 220 of 785 districts, across 22 of 36 states." The three `bg-muted` chips and
   the tinted `bg-accent/10` band both go. That is what the approved specimen
   renders, and it removes the tinted-callout collision §5 flagged as well.
2. **Add the coverage bar to the state hub?** → **Yes.** At page scale, under the
   header, not per card: a state has one ratio to report where the country hub has
   one per state. No new query, as predicted.
3. **Country hub has intro copy, state hub has none. Add one, or drop both?** →
   **Both dropped.** The stat sentence replaced the marketing intro; the generic
   "browse by state to compare quotes and go solar with confidence" said nothing the
   page does not show.
4. **CTA placement** → **below the grid at both levels**, as §3 recommended.
5. **`lastUpdated`** → **dropped.** Never rendered at either level, and `now()` on
   the country hub was not a last-updated date. Dropping it also takes the state
   hub's fifth query (latest project date) with it.

Two things settled that were not on this list:

6. **"Where choice is deepest"** — the top-8 districts nationally, above the state
   grid. In the approved specimen but not §3's anatomy; **built**, because the page
   has two kinds of visitor and a 36-card alphabetical grid only serves one.
   It suppresses itself where it would lie — see `getTopLevel2s`.
7. **District card order on the state hub** → **installer count descending**, name
   breaking ties, not alphabetical. §7 assumed alphabetical when it called the order
   "well defined"; the specimen's argument won. The `ItemList` describes the order
   the grid actually renders.

## 10. What shipped differently from this spec

- **The subsidy callout (§3 section 5) is not built.** `state_subsidies` is empty on
  live in every status, verified 2026-09-18, so `features.subsidy && a published row`
  can never both be true. Same call `lib/directory/data.ts` already made about the
  district page's dead subsidy query. It comes back with a populated table.
- **No pin icons on the cards** (§5 assumed they stay, recoloured). Thirty-six
  identical pins beside thirty-six place names is decoration in the most valuable
  position on the card.
- **`ItemList` is emitted at both levels** (§7 said it "would be reasonable"), and
  omitted rather than emitted empty on a state with no coverage.
- **A state with no installers renders an honest empty page**, not a 404 — unlike a
  district page with no businesses, which does 404. `/in/solar/sikkim` is the live
  case. Its generated FAQ is suppressed there too: the generator answers "listed
  across 0 districts", which reads as a bug and which `FAQPage` markup would publish.
- **The country hub's stat sentence drops the possessive on the country name.**
  `config.name` is a bare "United States", so "of United States's 3,207 counties" is
  what that construction produces. The `h1` still reads "Solar installers across
  United States" — an article would need a new field on `CountryConfig`, which is a
  shared-type change, and the SvelteKit page live today has the same wording.
