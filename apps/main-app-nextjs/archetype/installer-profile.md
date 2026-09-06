# Archetype 1 — Installer profile

`/{cc}/installer/{slug}` — **649 pages, 46% of the site.** The single largest archetype.

Ported from `installer/[installer_slug]/+page.{server.ts,svelte}`.
Data figures throughout come from `data.md`.

---

## 1. What this page is for

One business, and one decision: *should I call this company?* Everything on the page
either supports that decision or is in the way.

That framing matters because, per `data.md`, most of what the page currently displays
is constant across all 649 pages. The badge, the About text, the service chips and the
score are the same on nearly every profile. **The differentiating fields are the name,
the location, the phone, the website, and — on 6% of pages — photographs of actual
work.** The design has to put its weight there.

## 2. What the data says before any layout is drawn

| Field | Reality | What that means here |
| --- | --- | --- |
| `businessname` | p50 21 chars, **max 70** | Primary element; must wrap to 2 lines, never truncate |
| `tag` | `'Verified Business'` on 100% | **Badge dropped** — see §5 |
| `description` | boilerplate on **94.6%** | "About" is a dead section on 608 pages |
| `services` | `{1,2,3}` on **90%** | Chip row is near-constant |
| `brands` | empty on **93%** | Section renders on 44 of 643 pages |
| `rscore` | **0 everywhere today**, to be populated later | Reserve the metric slot; needs a stable tiebreaker meanwhile |
| projects | **5.9%** have any | Gallery is an exception path, not a standard section |
| `phonenumber` | missing on 11 | Both CTAs depend on it — real empty state |
| `website` | missing on **280 (43.5%)** | Must not anchor a layout |
| `address` | missing on 19; **482 distinct across 643** | Present but not an identifier |
| `google_maps_link` | 15.2% | Genuinely optional |

## 3. Anatomy

Content inventory. Nothing here is dropped silently; anything proposed for removal is
in §7.

| # | Section | Gate | Renders on |
| ---: | --- | --- | ---: |
| 1 | Breadcrumb — Home / Solar / {name} | always | 649 |
| 2 | Identity — `h1` name (~~+ `tag` badge~~, dropped) | always | 649 |
| 3 | Location line — address, falling back to `city, district, state` | always | 649 |
| 4 | Action row — `CALL NOW`, `WHATSAPP` | `phonenumber` | 638 |
| 5 | About — description | `description` | 643 (**608 identical**) |
| 6 | Services chips | `services.length > 0` | 632 |
| 7 | Brands chips | `brands.length > 0` | **44** |
| 8 | Service areas — city chips → city leaf pages | up to 20 rows | most |
| 9 | Project gallery — square cards, title, pincode, date | `features.projects` | **38** |
| 10 | Contact & location — phone, email, website, address, map | any present | 649 |
| 11 | Quote CTA | `cc === 'in'` | 643 |
| 12 | Back link — "← All installers in {district}" | slugs derivable | 649 |

Sections 4 and 10 both present the phone: buttons at the top for action, a `tel:` link
at the bottom for reference. Deliberate, and worth keeping — but only one of them
should look like a call to action.

## 4. Proposed scan order

Current order works top-to-bottom through twelve equally-weighted blocks, five of which
are `h2`s in the same brand colour. Proposed instead, three zones:

**Zone A — identity and action (above the fold)**
1. Breadcrumb
2. **Name** — the largest thing on the page, ink, 2-line capable. Nothing beside it
   now that the badge is gone
3. **Place** — one line, `ink-muted`: address, or `city, district, state`
4. **Action row** — `CALL NOW` primary, `WHATSAPP` secondary

Nothing else competes here. This zone answers "who and where" and offers the action.

**Zone B — evidence**
5. Project gallery, when it exists (6% of pages) — this is the only *proof* on the page
   and it currently sits eighth, below three rows of constant chips
6. Service areas — the one chip row that is genuinely navigational and genuinely varies

**Zone C — reference**
7. Contact details as a definition list (phone, email, website, address, map)
8. Quote CTA
9. Back link

Sections 5, 6 and 7 (About, Services, Brands) fold into zone C or disappear — see §7.

**The single biggest change is moving the project gallery above the constant chip
rows.** On the 38 pages that have one, it is the most persuasive thing on the page. On
the other 605, zone B collapses to the service areas and the page gets shorter, which
is the correct outcome.

## 5. The badge — DECIDED: dropped

`tag` is `'Verified Business'` on 100% of visible profiles. A trust marker that every
result carries is not a trust marker; it is a logo. It occupied the top-right of the
identity block — the second most valuable position on the page — and it repeated on
every installer row in archetype 2, where 22 identical badges would stack down a Pune
listing.

**Decision (2026-09-06): remove it, and do not replace it with anything.**

That frees the top-right of the identity block and one line of every listing row. The
`tag` column stays in the query for now but renders nowhere; drop it from
`BUSINESS_CARD_SELECTION` once nothing reads it.

## 6. Design direction against the three rules

- **Rule 1 (headings are ink).** The `h1`, all five `h2`s, every project `h3`, and the
  contact labels are `text-primary-strong`. The business name — the one thing that must
  dominate — currently has the same colour as five subordinate headings. Size and weight
  alone will fix the hierarchy, and it will be visibly better immediately.
- **Rule 2 (sky means you can act).** Phone, email, website, map, service-area chips and
  the back link are all `text-primary-strong`, the same token as the headings. They
  become `action` with an underline. Note sky-on-ink is 2.68:1, so **the underline is
  the primary signal**, not the colour.
- **Rule 3 (sunlight is identity only).** The pin/phone/mail icons are brand-coloured
  decoration. Icons go to `ink-subtle`; they are labels, not affordances.
- **CTA colour — DECIDED.** `CALL NOW` was `bg-destructive` and `WHATSAPP` was
  `bg-success`: two status colours doing the work of actions, which is rule 2 broken and
  reaches for tokens the system deliberately does not carry as actions. Both become
  **`action`** — `CALL NOW` as the filled primary, `WHATSAPP` as an outlined secondary
  of the same hue. One colour, one job; the WhatsApp glyph carries the recognition that
  the green used to.
- **Chips that are not links must not look like links.** Sections 6 and 7 are static
  labels; section 8 is navigation. Identical today. They must diverge — this is the same
  fault as the city chips in archetype 2, and one decision fixes both.
- **Contact block is a definition list.** It is an icon + label + value grid; mark it up
  as `<dl>`.

## 7. Sections proposed for removal or change

Flagged, not done — README rule 2 is "keep most content as it is", so these are yours to
approve.

| Section | Proposal | Why |
| --- | --- | --- |
| 5 — About | **Hide when the description is boilerplate**; render when it is real | 608 of 643 pages show the words "Solar panel installer" under a heading that says About. The 35 real descriptions are worth showing |
| 6 — Services | Demote to one plain line, not a chip row | Same three services on 90% of pages |
| 7 — Brands | Keep as-is | Renders on 44 pages, and is a real differentiator on those |
| 2 — Badge | **Removed** (decided) | Constant on 100% of profiles |

The meta description is a related problem: it interpolates `description` truncated to
120 chars, so **608 profiles ship near-identical meta descriptions**. Build it from
name, city, district and — where present — project count instead.

## 8. Data contract

One query for the business, then two in parallel.

**Business** — `business_profiles` ⋈ `business_accounts` on
`source_id = account_business_id`, filtered `businessInCountry(cc)`, `slug`,
`isvisible`, ordered `rscore DESC NULLS LAST`, limit 1; 404 when empty.

Fields: `businessname`, `description`, `phonenumber`, `email`, `website`, `slug`,
`address`, `level2` as `district`, `level1` as `state`, `city`, `tag`, `rscore`,
`businessfilled`, `services`, `brands`, `instagram_id`, `google_maps_link`.

Six are nullable in the schema but restated non-null with `sql<T>` because the page
dereferences them as required. Keep the restatement rather than widening the component
— root `CLAUDE.md`.

`rscore` is uniformly 0 **today** and is to be populated later, so the ordering stays.
While it is flat, `ORDER BY … LIMIT 1` picks arbitrarily among duplicate slugs — add
`businessname ASC` as a tiebreaker so the choice is at least stable across deploys.

**Projects** — up to 12, ordered `project_date DESC, created_at DESC`, gated on
`features.projects`. **Branch rule:** a slug matching `-branch-{id}$` is stripped to its
parent first, so every branch shows the parent company's work. Port exactly.

**Service areas** — up to 20 distinct cities in the same district and state, matched
`LOWER(...) = LOWER(...)` on both sides because the tables disagree on casing.

**Presentation logic that must move out of markup:**
- `SERVICE_MAPPING` (ids 1–6) and `BRAND_MAPPING` (ids 1–7) are hardcoded in the
  component with an `'Unknown'` fallback. They are ids in a Postgres array column with
  no lookup table. Move to a shared constants module — the business form needs them too.
- `mapUrl` normalisation: `google_maps_link` sometimes holds a bare place name or plus
  code. Without a scheme it would be treated as a relative link and resolve against the
  installer path. The fix builds a `google.com/maps/search/?api=1&query=` URL from the
  value plus city and state. This is a real bug fix — port it.

## 9. Imagery

All 130 visible projects have `cloudinary_public_id`, `image_url` **and**
`image_width`/`image_height`. So:

- The three-way fallback (Cloudinary → `image_url` → "No Image") is dead code on live
  data. Keep the guard, but design for the image always being there.
- `next/image` gets real intrinsic dimensions — no layout shift, no guessing.
- Current transform is `c_fill,w_300,h_300` into an `aspect-square`. Up to 12 per page
  across 38 pages. Settle the crop policy here jointly with archetype 2 and the project
  detail page.

## 10. Structured data

`breadcrumbLD` + `localBusinessLD` (name, slug, address, city, state, empty postal code,
phone). This is the archetype where `LocalBusiness` matters most — 649 pages of it.

Two improvements available from data already loaded: `postalCode` is passed as `''`
though `business_profiles.postal_code` exists, and `aggregateRating` should **not** be
emitted from `rscore` while it is uniformly 0.

## 11. Components

`Breadcrumb`, `PageHeader`, `ActionRow` (client leaf), `ChipList` (static and link
variants), `ProjectGallery`, `DefinitionList`, `QuoteCTA`, `BackLink`.

Only `ActionRow` needs `'use client'` — `makeCall`/`openWhatsApp` plus PostHog capture.
Everything else is a server component.

## 12. Open questions

~~1. Badge~~ — **decided: dropped, not replaced** (§5).
~~2. CTA colour~~ — **decided: both are `action`** (§6).

1. **Hide the About section when the description is boilerplate?** (§7) — 608 of 643
   pages currently render the words "Solar panel installer" under a heading saying About.
2. Render `instagram_id` (15.2% coverage), or drop it from the selection?
3. Where do `SERVICE_MAPPING` / `BRAND_MAPPING` live — constants module or database?
