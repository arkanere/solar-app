# Archetype 4 — Editorial (pillar + cluster)

The 7 pillar landings and the 110 cluster articles under them. 117 URLs, one page
shape, one table: `seo_pages`.

Measured against live on 2026-09-21 (`POSTGRES_URL`, read-only aggregates). `data.md`
grounds archetypes 1–3 and covers the directory tables; it says nothing about
`seo_pages`, so the numbers this spec argues from are in §2 here.

Scope: `/{pillar}` and `/{pillar}/{slug}`. Not `/` — the home page shares the route
group but has no data, no archetype and no relation to these; it is its own job.

## 1. Why pillar and cluster are one archetype

They are the same row. Both come from `seo_pages`, both carry `h1` + `content[]` +
`faq[]`, both render 9 sections of database HTML and 6 questions. The only real
difference is what surrounds the body: a pillar lists its clusters, a cluster lists its
siblings and names its pillar in the breadcrumb.

The SvelteKit app already built them as two components (`PillarPage.svelte`,
`ClusterPage.svelte`) that duplicate the breadcrumb, the body renderer, the FAQ and the
closing CTA. One archetype with two link-block variants is the honest description.

## 2. What the live data actually looks like

### Scale — and it matches `routes.md` exactly

| | Published rows |
| --- | ---: |
| Pillars | 7 |
| Clusters | 110 |
| **Total** | **117** |

Per pillar: `rooftop-solar` 23, `solar-pumps` 22, `solar-subsidy` 14, `solar-panels` 13,
`solar-inverters` 13, `solar-installation` 13, `solar-financing` 12.

As first measured it was 111 clusters and 118 pages, and that is the number `routes.md`
records from the live sitemap — precisely the editorial count there, which means **the
sitemap contains no brand pages at all** (§3). `solar-pumps/kusum-scheme` was unpublished
on 2026-09-21 (see below), taking `solar-pumps` from 23 to 22. Nothing else is in
`draft`.

### The body is uniform, and it is long

| | min | p50 | max |
| --- | ---: | ---: | ---: |
| Sections per page | 0 | 8 (cluster) / 9 (pillar) | 10 |
| FAQ items per page | 0 | 5 (cluster) / 6 (pillar) | 6 |
| Chars per section body | 209 | 845 | 1,683 |
| **Chars of body per page** | — | **6,873** | 9,248 |
| `h1` length | 23 | 66 | 80 |

There is no long tail and no thin page. Every page is a ~7,000-character article with
nine `<h2>` sections and a six-question FAQ. The archetype does not need a short-page
degradation the way archetype 2 needed its one-installer treatment — it needs to make
7,000 characters readable.

Section objects are `{heading, body}`; FAQ objects are `{question, answer}`. Nothing
else. Both hold raw HTML.

### Tables are the archetype

This is the finding that should drive the design.

**112 of the 118 pages then published contained at least one table.** 282 tables in all: 5,311 `<td>`,
1,024 `<th>`, 1,761 `<tr>`.

| Tables on a page | min 1 | p50 **2** | max 5 |
| --- | --- | --- | --- |

| Columns | 2 | 3 | 4 | 5 | 6 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tables | 21 | 113 | 104 | 37 | 7 |

Every other tag is ordinary prose furniture — 2,360 `<strong>`, 2,248 `<li>`, 2,150
`<p>`, 408 `<ul>`, 106 `<ol>`, 58 `<em>`, and 7 stray `<h3>` (only on `for-apartments`
and `on-grid-vs-off-grid`).

So: a mobile-first site whose editorial surface is 95% tables, half of them 4 columns or
wider, inside a 68ch measure. **The table treatment is the design problem of this
archetype.** §5.

### 885 of 1,020 body links point at a redirect

Every `<a href>` in every body is root-relative and country-prefixed — 1,020 of them,
zero external, zero absolute, zero with a trailing slash.

| Target | Links |
| --- | ---: |
| `/in/{pillar}/*` and `/in/tools/*` — **families that moved to the root** | 885 |
| `/in/get-quotes` — still correctly country-scoped | 135 |

All seven pillars and `tools` are in `MOVED_TO_ROOT`. The bodies were written before
that migration and were never rewritten; in SvelteKit they survive only because
`hooks.server.ts` 301s `/{cc}/<family>/**` to `/<family>/**`. That rule is carried
across as `MOVED_TO_ROOT_PATTERN` in `middleware.ts`. §6.

### Two rows that are not like the others

- ~~**`kusum-scheme`**~~ (`solar-pumps`, id 89) was published with `content = []` and
  `faq = []` — the only such row, a live indexed URL rendering an `h1` and nothing
  else. It was a never-written stub duplicating its sibling `kusum-yojana`, which is
  the real KUSUM page and the one everything links to; nothing at all linked to
  `kusum-scheme`. **Set to `draft` on 2026-09-21**, which is what every consumer's
  `status = 'published'` filter already keys off, so it left the pages, the whitelist
  and the sitemap at once and the row is still there if it is ever wanted. There is now
  no published page with an empty body, and the archetype needs no branch for one.
  Its URL wants a 301 — see §6.
- **`author_slug` is empty on every row** — `null` on 98, the empty string on 20. There
  are no bylines, consistent with `authors` having 0 rows. No author furniture.

### Two pre-existing metadata problems

`meta_title` runs to 98 characters and `meta_description` to 188. Both are past where
Google truncates. This is data, not code — `lib/metadata.ts` should pass them through
unaltered and the overflow gets fixed in the CMS. Recorded, not solved here.

## 3. The polymorphic resolver is dead code

`routes.md` says `/{pillar}/{slug}` is polymorphic: cluster whitelist first
(`isClusterSlug`), then `resolveBrandSlug`. Both halves turn out to be inert.

**The whitelist is a copy of the table.** Diffed `PILLAR_CONFIG` against
`seo_pages` — 7 pillars, all 7 cluster lists, **zero drift in either direction**:

```
rooftop-solar        cfg=23 db=23      solar-installation   cfg=13 db=13
solar-panels         cfg=13 db=13      solar-subsidy        cfg=14 db=14
solar-inverters      cfg=13 db=13      solar-financing      cfg=12 db=12
solar-pumps          cfg=23 db=23
```

A 181-line config file that must be hand-edited whenever a row is published, and whose
only job is to predict the answer of a query that is about to run anyway.

**The brand branch can never fire.** `solar_brands` is empty (`data.md` §"`solar_brands`
is empty — a provision, not a gap"), so `resolveBrandSlug` returns nothing for every
slug, and the counts in §2 confirm it: the clusters are the whole of `/{pillar}/{slug}`.

**Decision (approved 2026-09-21): port the cluster branch only, and drop the
whitelist.** One query — `slug`, `pillar_slug`, `status = 'published'` — is both the
lookup and the whitelist. No row, no page: `notFound()`. `PILLAR_CONFIG` does not come
across; the pillar display names it also holds move to a 7-entry map next to the route.

When `solar_brands` gets rows, the brand branch is a second query behind the first
`notFound()`, added then against data that can be looked at. Building it now ships a
page nobody can verify.

This is the same call the geo leaf already made for its own missing brand variant, so
the app is consistent about it.

## 4. Anatomy

Top to bottom. Marked P (pillar only), C (cluster only), or both.

| | Block | Notes |
| --- | --- | --- |
| 1 | Breadcrumb | `components/directory/Breadcrumb.tsx` as-is. P: Home / *pillar*. C: Home / *pillar* / *cluster*. Feeds `BreadcrumbList`. |
| 2 | `h1` | Up to 80 chars — this is a headline, not a label. Serif, `--text-2xl`. |
| 3 | Body — 9 × (`h2` + HTML) | The page. §5. |
| 4 | FAQ — 6 × `<details>` | §7. |
| 5 P | Explore topics | 12–23 cluster links. §8. |
| 5 C | Related topics | The 11–22 siblings, current one marked. §8. |
| 6 | Directory bridge | The one link from the editorial surface into the directory. |
| 7 | Get-quotes CTA | `/in/get-quotes`, the only country-scoped link on the page. |

Four blocks of the SvelteKit components do **not** come across:

- **The stat chips** ("643 Installers") on the pillar. `data.md` already established
  that a raw network count is a weak claim, and archetype 3 §4 removed the same chips
  for restating a callout. They restate nothing here — they are decoration above a
  7,000-word article.
- **`entitySection`** and **`siblingPillars`** on `PillarPage`. Only `solar-panels`
  passes a sibling, and it passes exactly one, hardcoded in the page. That is a
  navigation job the site header already does.
- **The tool CTA** on the cluster, whose target is picked by regex over the slug
  (`/cost|price|\d+kw-system/` → solar calculator, and so on). It was dropped because
  the three tools were stubs and a CTA to a 501 is worse than no CTA. **The tools are
  built now, so that reason has expired** — whether the CTA returns is an open call.
- **The `{n}kW prices by city` chip row**, which fires on `^(\d+)kw-system$` and links
  into district size-leaf URLs. Those leaves exist, so this one is real — but it serves
  5 of 110 clusters and depends on `getTopDistricts()`. Deferred; noted in §10.

## 5. Design direction — the body, and the tables

**Measure.** One column at `--container-prose` (68ch), Source Serif, `--text-prose`
(17/1.7). The route group already sets `data-editorial` and loads the serif, so this
costs nothing new. No sidebar, no sticky table of contents: nine headings is a
contents-worthy page, but a floating ToC is a component with scroll-spy state on a site
whose rule is server components and CSS-only motion. Deferred to §10.

**Tables break the measure.** A 4-column table at 68ch is unreadable and a 6-column one
at 375px is impossible. The proposal:

- The prose column stays 68ch. Tables — and only tables — break out to the full content
  width (`--container-content`, 72rem) on wide viewports.
- Below that, each table gets a horizontally scrolling wrapper with a fading right edge
  so it reads as scrollable rather than clipped. `overflow-x: auto` on a focusable
  wrapper, so it is keyboard-reachable, with `role="region"` and an `aria-label` from
  the preceding `h2`.
- Not a card-stack transform. Turning `<tr>`s into stacked label/value cards is the
  common mobile answer, but these are comparison tables — 3- and 4-column price and spec
  grids where the whole point is reading across the row. Stacking destroys the
  comparison to save a swipe.

Styling comes from the `@tailwindcss/typography` `prose` classes plus a small table
override, replacing the `:global()` block in `ContentSections.svelte` — which exists
only because the Svelte app has no typography plugin and the `prose` classes there are
inert. Here they are real.

### What the specimen showed — 2026-09-21

Built at `/specimen/archetypes/editorial` and looked at. **The premise above is wrong,
and the aggregates are what misled it.** Column count does not predict the problem;
cell length does.

- **The six-column table is fine contained.** `interest-rates` — the widest shape in
  the database, 6 × 10 — fits inside 68ch with room to spare and needs no scrolling on
  a desktop at all, because no cell in it exceeds 14 characters. Widened to 72rem under
  option B it gets *worse*: the columns stretch apart and the row stops reading as one
  thing.
- **The five-column table with 42-character cells is not.** `state-wise` at 68ch wraps
  three separate cells onto two and three lines, so row heights go ragged and the eye
  loses the row. At full content width every cell fits on one line and the table
  becomes scannable. Option B wins this one clearly.

So the rule is **not** "tables break out". It is:

> A table breaks out of the measure when it does not fit in it. One that fits stays.

Which is `min-width` plus a scroll container doing the deciding, not a hand-applied
per-table choice — the table gets its natural width, is capped at the content measure,
and scrolls only past that. The 21 two-column and many three-column tables never move.

**Three bugs the specimen caught, all of which rendered as nothing visibly broken** —
the same failure class `design-foundation.md` §8 warns about:

1. **The body was not serif.** `design-foundation.md` §6 buys Source Serif for the
   article body and `(layout-1)` loads it, but styling only `prose-headings:font-serif`
   spends it on the headings and leaves 6,900 characters of body in Inter — the font
   the route group exists to avoid. The reading surface has to say `font-serif` itself.
2. **`prose-headings:` reaches into tables.** Its selector includes `th`, so it made
   every table's header row serif while the cells stayed sans. Dropped: once the
   wrapper is serif the headings inherit it, and the table opts back out with
   `font-sans` — a table is data, and Inter is the reason the system runs two families.
3. **`w-full` on a table defeats the scroll treatment entirely.** The table shrinks to
   its column instead of overflowing it, so at 414px a four-column table does not
   scroll — it wraps every cell onto three lines and doubles in height. It needs a
   `min-width` before the scroller has anything to scroll.

This settles the treatment, and §10 item 1 settles the rest of it: **no table
restacks.** One rule for all 282 — natural width, capped at the content measure,
scrolling past that — beats a second rule plus a cell-length guess to rescue ~10 of
them on phones.

**Colour and rhythm.** Zebra striping on `tbody tr:nth-child(even)` at the lowest
surface tint, a line under the header row, and no vertical rules — `design-foundation.md`
§7 says things on the page are separated by a line, not a shadow, and a 4-column grid of
boxes is heavier than the data in it.

## 6. The 885 stale links

Every body link to a moved family (`/in/solar-panels/price`) is one 301 away from its
real URL (`/solar-panels/price`). Three options:

1. **Leave them.** Every internal link on the editorial surface burns a redirect hop,
   and the 301s do not exist in this app yet, so today all 885 are 404s.
2. **Fix the data.** One `UPDATE` over the 117 rows. Correct, and out of scope: this is the
   port, and a write to live content is not a thing to slip into it.
3. **Rewrite at render.** The body already passes through a render step. Rewriting
   `href="/in/<moved family>/…"` to `href="/<family>/…"` there costs one regex.

**Recommendation: 3, and it does not preclude 2.** `MOVED_TO_ROOT` is already in this
app (`lib/countries/moved-content.ts`) and is the list to key off — the rewrite is
exactly `contentUrl()` run backwards, so it stays correct as families move. `/in/get-quotes`
is untouched because `get-quotes` is not in the list, which is the right answer and
falls out for free.

The middleware 301s still land in step 4 for the indexed URLs. This is about what the
pages link to, not about what answers.

**One 301 to add.** `/solar-pumps/kusum-scheme` was in the live sitemap until
2026-09-21 and is likely indexed, so it needs a redirect to `/solar-pumps/kusum-yojana`
— the page it was a stub of. **Added**, in `middleware.ts` with the rest of the
legacy 301s.

**Sanitizing.** The HTML is first-party CMS content and goes in with
`dangerouslySetInnerHTML`. **No sanitizer, decided 2026-09-21:** `seo_pages` is a
trusted table, which is the same trust boundary the SvelteKit app's `{@html}` already
assumes. This holds only while that is true — see §10 item 7.

## 7. FAQ

Six questions per page, answers 137–369 characters. Exactly one answer in the whole
table contains HTML.

`components/directory/FAQ.tsx` is the component — native `<details>`, no Radix, and its
header comment argues the case. But its heading is hardcoded (`Common questions about
solar in {place}`) and its `FAQItem` type comes from `lib/countries/faq.ts`. It needs a
heading prop and a structural type before it can serve both surfaces. That is a change
to a shipped component, so it is the one edit outside this archetype's own files.

The one HTML answer: render answers as HTML too, same as the body. Escaping it would
show the user a tag.

`FAQPage` JSON-LD is derived from the same array the page renders, so the markup cannot
claim a question the page does not show — the rule `FAQ.tsx` already follows.

## 8. The link blocks

A pillar lists 12–22 clusters; a cluster lists its 11–21 siblings. Same data, same
counts, two presentations in the Svelte app: a 3-column card grid on the pillar, a chip
wrap on the cluster.

**Make both the chip wrap.** The cards hold nothing but the `h1` — a bordered box with
one line of text in it, 22 times. There is no second line, no icon, no count, nothing a
card is for. A wrapped chip list carries the same 22 links in a third of the height, and
`components/directory/ChipList.tsx` already exists and already does it.

On the cluster, the current page keeps itself in the list as a non-link marked chip. Keep
that: it tells the reader where they are in a 22-item set.

## 9. Structured data

- `BreadcrumbList` on both, from the same trail the breadcrumb renders.
- `FAQPage` on both, from the rendered array. Every published row has one.
- **`Article` on neither.** No author (§2), no dated revision, no publisher beyond the
  site. `Article` without an author is markup that asserts less than the page.

Canonical is the country-less URL — `/solar-panels/price`, not the `/in/` form.

## 10. Open questions — RESOLVED 2026-09-21

All six were decided in one pass. Nothing here is open.

1. ~~**Stacking, for the three-column tables whose cells are sentences.**~~ **No.**
   Every table scrolls; none of them restack. `warranty` — three columns of
   112-character prose — reads worse on a phone this way than the ~10 such tables are
   worth, but the alternative buys a phone-only improvement for 9% of tables at the
   price of parsing the HTML on all of them, plus a cell-length heuristic that no field
   in the data supports. One rule for 282 tables beats two rules and a guess.
   `TableStacked` stays on the specimen as the record of what was turned down; the real
   page does not import it.
2. ~~**`kusum-scheme` renders an `h1` and nothing else.**~~ The row was set to `draft`
   (§2), so there is no empty-content case to design for and none is built. A row
   published with no body is a content bug, and the page code does not need a branch
   for it. Its URL still wants a 301 — noted in §6 and in `middleware.ts`.
3. ~~**A table of contents** for nine headings.~~ **No.** A sticky one needs scroll-spy
   state, which this app does not do, and a static one is a second list of the headings
   already visible a screen away. Revisit only if the pages get longer.
4. ~~**The `{n}kW prices by city` chip row**~~ **Later.** It serves 5 of 110 clusters
   and needs `getTopDistricts()`. It comes back when something else already needs that
   query.
5. ~~**Fixing the 885 links in the data**~~ **Yes, as its own task.** `rewriteMovedLinks`
   keeps every page correct today (§6), so this is a data-hygiene job with no user-facing
   symptom and no reason to ride along inside the port. When it lands, the rewrite stops
   matching anything and can be deleted.
6. ~~**The 98-char `meta_title`s.**~~ Content, not code. `lib/metadata.ts` passes them
   through unaltered. Raised in `OPEN-ITEMS.md` so it is not lost.

And the one thing §6 flagged without listing here:

7. ~~**Sanitizing the body HTML.**~~ **No sanitizer.** `seo_pages` is a trusted,
   first-party table — the same trust boundary the SvelteKit app's `{@html}` already
   assumes. `dangerouslySetInnerHTML` is correct while that holds. **If outside
   contributors are ever given write access to `seo_pages`, this decision has to be
   reopened before that happens,** because nothing else in the render path would catch
   it.

## 11. What shipped — 2026-09-21

All 117 pages. `/{pillar}` and `/{pillar}/{slug}` under all seven pillars, built to
this spec. Where the code differs from what is written above, it is recorded here.

**The files.** `lib/editorial/pillars.ts` (the 7-entry name map that replaces
`PILLAR_CONFIG`), `lib/editorial/data.ts` (the seam — three queries),
`lib/editorial/routes.tsx` (the two routes, once), `components/editorial/`
(`EditorialArticle` and `ArticleBody`), and fourteen six-line route files that do
nothing but name their own pillar. `lib/editorial/body.ts` was already there.

**Two edits outside the archetype, not one.** §7 predicted `FAQ.tsx`; `ChipList.tsx`
also needed the inert current chip §8 asks for, which it had no variant for. Both are
additive: `FAQ` takes `heading` and an opt-in `html`, and its `items` type is now
structural rather than `FAQItem` from `lib/countries/faq.ts`; `ChipList` takes an
optional `currentHref`. The three directory callers pass the heading they had
hardcoded and nothing else changed.

**The table breakout is a section, not a table.** §5's rule — natural width, capped at
the content measure, scrolling past that — is implemented on the body section that
*contains* a table, because wrapping each table individually would mean parsing the
HTML, and §10 item 1 declined to do that. Three consequences:

- `w-auto`, not the specimen's `w-full`. That is what makes the narrow six-column
  table stay narrow and the wide five-column one take the space, which §5 found was
  the actual distinction.
- The breakout is `xl:` (1280px) and not lower. It works by overflowing the prose
  column to the right by half the difference between the two measures, which lands on
  the content container's right edge — but only once the viewport can hold 72rem plus
  its gutters. Below that a table keeps the prose measure and scrolls.
- The prose inside a widened section is pinned back to the measure, or the paragraph
  either side of a table would run longer than the paragraph in the section above it.

**No fading right edge.** §5 asked for one. It was written when each table was to get
its own wrapper; the wrapper is the section, so a mask would fade the right edge of
every paragraph in it too. Below `md` the scroll box bleeds into the page gutter
instead, which is the same cue and costs no mask.

**The site suffix is stripped from `meta_title`.** All 117 rows already end in
" | Solar Vipani" and `pageMetadata` adds it. Removing the part `lib/metadata.ts` owns
is not editing the copy — the 98-character overflow §10 item 6 recorded is untouched
and still wants the CMS pass.

**The FAQ and chip-list headings are serif here.** They are Inter in the directory,
which is right there; following nine serif `h2`s a tenth in a second face reads as the
article having ended. The questions and the chip labels stay sans.

**One thing worth watching.** The chips are `h1`s, which run to 80 characters, so on a
wide viewport the "Explore topics" list is close to one chip per line rather than the
compact wrap §8 pictured. It is still a third of the height of the card grid it
replaced, so the call stands, but if these lists are ever revisited the label is the
thing to change, not the shape.

**Not built, and still open:**

- `/` — out of scope by §"Scope"; `archetype/home.md` covers it. It shares the route
  group and nothing else.
- `/solar-subsidy/{slug}` serves clusters only. The state-subsidy and discom variants
  `routes.md` describes are blocked on `state_subsidies` being empty, the same call
  §3 made for brands.
- ~~The `/solar-pumps/kusum-scheme` 301 (§6)~~ — built, in `middleware.ts` with the
  other legacy redirects.
