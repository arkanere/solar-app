# Archetypes

Templated pages only — routes that render many pages from one design. Single pages
(`/about-us`, legal, `/seo-index`) are excluded; they are one-offs, not archetypes.

Counts from the live sitemaps, 2026-09-05. Ordered by how much of the site each covers.

## Directory surface — `[country=country]`

| # | Archetype | Pattern | Pages |
| --- | --- | --- | ---: |
| 1 | **Installer profile** | `/{cc}/installer/{slug}` | 649 |
| 2 | **Geo city page** | `/{cc}/solar/{state}/{district}/{city}` | 356 |
| 3 | **Geo district page** | `/{cc}/solar/{state}/{district}` | 245 |
| 4 | **Geo state hub** | `/{cc}/solar/{state}` | 27 |

These four are **1,277 of 1,414 URLs — 90% of the site.**

Archetypes 2–4 are the same shape at three zoom levels (state → district → city): a geo
header, a list of child locations, a list of businesses. Decide whether they are one
archetype with a depth parameter or three designs.

## Editorial surface — `(layout-1)`

| # | Archetype | Pattern | Pages |
| --- | --- | --- | ---: |
| 5 | **SEO cluster article** | `/{pillar}/{slug}` | ~111 combined with 6 |
| 6 | **Brand page** | `/solar-{category}/{slug}` | (same route as 5) |
| 7 | **Pillar landing** | `/{pillar}` | 7 |
| 8 | **State subsidy / discom** | `/solar-subsidy/{slug}` | 14 |
| 9 | **Bank financing page** | `/solar-financing/{slug}` | 12 |
| 10 | **Product model** | `/solar-{category}/{brand}/{model}` | not sitemapped |
| 11 | **Author profile** | `/authors/{slug}` | 0 rows live |

5 and 6 share one route and are separated at runtime by a slug resolver, so the sitemap
count cannot split them. They are still two archetypes: an article and a product-brand page.

## Not sitemapped, still templated

| # | Archetype | Pattern |
| --- | --- | --- |
| 12 | **Project detail** | `/{cc}/project/{project_id}` |
| 13 | **Paginated project list** | `/{cc}/recent-solar-installation-projects/{page_slug}` |
| 14 | **Partner join by district** | `/{cc}/partners/join/{district_slug}` | - NOT REQUIRED
| 15 | **Legacy geo shims** | `/{cc}/district/{slug}`, `/{cc}/county/{slug}`, `/{cc}/solar-panel-installer-directory/{city}` | - NOT REQUIRED

## Where to concentrate

1. **Installer profile** and the **geo pages** — 90% of URLs, highest sitemap priority
   (district pages are 1.0). Cards, listing density and imagery decide the site.
2. **SEO cluster article** and **brand page** — the editorial surface. Typography and
   `prose`, since the body is database HTML.
3. Everything else is long-tail.

