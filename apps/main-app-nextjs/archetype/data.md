# What the live data actually looks like

Measured against live on 2026-09-06 (`POSTGRES_URL_NON_POOLING`, read-only aggregates).
This file grounds all three archetype specs — every design decision in them traces back
to a row here.

Read this first. Several sections of the current SvelteKit pages turn out to render
constants, dead code, or empty lists, and none of that is visible from the source.

## Scale

| | IN | US |
| --- | ---: | ---: |
| Visible installers | 643 | 6 |
| District pages (≥1 installer) | 221 | 6 |
| City pages | 351 | 7 |
| States with installers | 22 of 36 | — |
| Visible projects | 130 | 0 |

## The design target is 20+, not the median

Installers per district today:

| | min | p50 | p90 | p99 | max |
| --- | ---: | ---: | ---: | ---: | ---: |
| IN | 1 | **2** | 7 | 17 | 22 |

**108 of 221 district pages list exactly one installer.** 240 of 351 city pages list
exactly one.

But the densest districts are the goal state, not the exception:

| State | District | Installers | Cities |
| --- | --- | ---: | ---: |
| Kerala | Ernakulam | 22 | 6 |
| Maharashtra | Pune | 22 | 7 |
| Uttar Pradesh | Lucknow | 17 | 2 |
| Rajasthan | Jaipur | 16 | 3 |
| Karnataka | Bengaluru Urban | 14 | 4 |

**Design for 20+ rows and degrade to 1.** Designing for a median of 2 would be
designing for the state the site is trying to leave. But the one-installer page is 49%
of district pages *today* and must not look broken — it needs a real single-result
treatment, not a list with one item in it.

At 20+ rows, scan order and a right-aligned comparable metric start to matter, and the
question of sorting/filtering becomes real. At 1 row neither does. Both cases are
live simultaneously.

## Six fields that carry no information

This is the most important section here. The current pages give visual weight to fields
that are constants.

| Field | Reality | Consequence |
| --- | --- | --- |
| `tag` | **`'Verified Business'` on 100%** of visible profiles (649/649) | The badge on every card and every profile distinguishes nothing |
| `rscore` | **`0` on all 643** IN rows; one distinct value | `ORDER BY rscore DESC NULLS LAST` is a **no-op** in every query that uses it |
| `description` | **`'Solar panel installer'` on 608/643 (94.6%)** | The profile "About" section is boilerplate; 608 meta descriptions are near-identical |
| `services` | **`{1,2,3}` on 579/643 (90%)** | The services chip row shows the same three chips on 9 of 10 profiles |
| `brands` | **empty on 599/643 (93%)** | The Brands section renders on 44 pages |
| `businessfilled` | selected everywhere, rendered nowhere | dead in the wire shape |

Two consequences worth stating plainly:

- **The district listing has no sort.** Businesses are ordered by project count, then
  `rscore`. Only 38 businesses have any project and `rscore` is uniformly 0, so on the
  overwhelming majority of pages the order is whatever Postgres returns. There is
  currently no defined ordering of the primary content on the site's biggest archetype.
- **The trust marker marks nothing.** "Verified Business" on 100% of rows is decoration.
  Either find a signal that varies, or drop the badge and stop spending the most
  valuable position on the card.

Note the code checks `tag !== 'Blank'`. The live values are `'Verified Business'`
(visible) and lowercase `'blank'` / `''` (hidden only), so that check never fires.

## Field completeness — the real numbers

`count(col)` counts non-NULL but not empty strings, which overstates completeness.
Counting blanks as missing, over 643 IN profiles:

| Field | Missing | % present |
| --- | ---: | ---: |
| `description` | 0 | 100% (but see boilerplate above) |
| `email` | 3 | 99.5% |
| `phonenumber` | 11 | 98.3% |
| `address` | 19 | 97.0% |
| `website` | **280** | **56.5%** |
| `google_maps_link` | 546 | 15.2% |
| `instagram_id` | 546 | 15.2% |

So the card can assume a phone and an address in 97%+ of cases — but must still handle
the 11 with no phone, because the phone is what both call-to-action buttons depend on.
Website is a coin flip and should never anchor a layout.

`address` is not unique: 482 distinct values across 643 rows, with one address shared by
16 businesses. Address is not an identifier.

## Business name length — sizes the card

| | min | p50 | p90 | p99 | max |
| --- | ---: | ---: | ---: | ---: | ---: |
| IN | 4 | **21** | 37 | 55 | **70** |

The name is the primary element and must survive 70 characters. Two lines at typical
card widths; do not truncate to one line, and do not centre it.

## Projects are rare but complete

- **38 of 643 businesses (5.9%)** have any visible project. Max 14.
- **130 visible projects total.**
- All 130 have `cloudinary_public_id`, `image_url`, **and** `image_width`/`image_height`.

Two consequences: the three-way image fallback (Cloudinary → `image_url` → "No Image")
is **dead code on live data** — it is always the first branch; and `next/image` can
always be given real intrinsic dimensions, so no layout shift and no guessing.

**A third, found only by rendering them.** These are *field-documentation* photographs,
not marketing photography, and they carry two kinds of baked-in overlay:

- **Marketing watermarks** — company logo, phone number, panel brand, marketing copy;
  usually top and bottom edges.
- **GPS camera-app stamps** — date, time, latitude/longitude, altitude, administrative
  division, in a translucent block, usually bottom-right. Standard for install
  documentation in India.

Subject matter varies just as much: some are attractive rooftop arrays, others are
inverter cupboards and meter boards.

Three consequences, all decided by looking rather than by reading the schema:

- **Crop gravity is load-bearing.** `g_north` returns pure sky on a rooftop photo — it
  rendered blank white tiles in the specimen. A centre crop cuts through the overlays.
  `g_auto` picks the subject and is what the specimen now uses.
- **Never crop tighter than 4:3** without checking; the overlays eat the edges.
- **The biggest available win is not a layout change.** Guidance to installers on what
  to photograph, plus a `c_fill,g_auto` thumbnail pipeline, would raise the quality
  ceiling of the whole directory surface further than any component restyle. Flagged
  because the design leans on these images hardest.

Project *titles* have the same problem in text form: several read
`5kW Agricultural Solar Installation at [Sivasagar]` — square brackets and all, a
template artifact that ships to the page today.

The "Recent Work" thumbnail strip therefore appears on ~6% of installer cards. It is an
exception, not a row in the standard card.

## Geography

| | min | p50 | p90 | max |
| --- | ---: | ---: | ---: | ---: |
| Districts per state | 1 | 20 | 38 | 75 |
| Cities per district | 1 | 9 | 21 | 47 |

The "Cities in {district}" chip row on a district page, measured over the 221 pages that
exist:

| | p50 | p90 | max |
| --- | ---: | ---: | ---: |
| Total chips | 9 | 20 | 47 |
| Chips that are **links** (city has an installer) | **1** | 3 | 7 |

**Typically 9 chips of which 1 is a link.** The rest render as identically-styled grey
spans that do nothing. A section that is ~89% dead labels, styled exactly like the
links, on 221 pages. This is rule 2 broken and it is also just a bad section.

## `solar_brands` is empty — a provision, not a gap

`SELECT ... FROM solar_brands` returns **0 rows.**

Confirmed as intentional: brands are a provision built ahead of need, to be populated
as the directory grows. The code path is correct and stays.

Two consequences for design work *now*:

- The geo leaf route resolves a slug to a city, a **brand**, or a `{n}kw-solar-system`
  size page. Until the table fills, it is **city or size** — two live types, not three.
- The brand branch of `/{pillar}/{slug}` is likewise dormant.

So no design work is owed to the brand variant in this round. But the leaf component
must stay a **variant-dispatching** component rather than a city page with two
special cases bolted on, because a third variant is a known future requirement — that
is the difference between the provision paying off and needing a rewrite.

## Leads — the social-proof line

`leaddata` per district: 270 districts have at least one lead, p50 is **2**, max 69.
The page shows the line only at `>= 3`, so it appears on **113 districts** — about half
the district pages. Correct call: "1 customer has started their solar journey" is worse
than silence.

## Queries

All read-only aggregates. Re-run any of them with:

```
cd apps/main-app
export PGURL=$(grep '^POSTGRES_URL_NON_POOLING=' .env.local | cut -d= -f2- | tr -d '"')
psql "$PGURL" -X -q -c "<query>"
```

Remember country scoping: `business_profiles` has no `country_code` since migration 079.
Join `business_accounts` on `source_id = account_business_id` and filter the account —
see `$lib/server/businessCountry.ts`.
