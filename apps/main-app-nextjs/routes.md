# Routes

URL inventory taken from the live sitemaps on 2026-09-05.

- `/sitemap.xml` — index, lists the three below
- `/in/sitemap.xml` — 1,238 URLs
- `/us/sitemap.xml` — 46 URLs
- `/content-sitemap.xml` — 130 URLs

**Total advertised: 1,414 URLs.**

## Directory surface — `[country=country]`

| Pattern | IN | US |
| --- | ---: | ---: |
| `/{cc}/installer/{slug}` | 643 | 6 |
| `/{cc}/solar/{state}/{district}/{city}` | 349 | 7 |
| `/{cc}/solar/{state}/{district}` | 220 | 25 |
| `/{cc}/solar/{state}` | 22 | 5 |
| `/{cc}/solar` | 1 | 1 |
| `/{cc}/business-listing` | 1 | 1 |
| `/{cc}/business-form` | 1 | 1 |
| `/{cc}/recent-solar-installation-projects` | 1 | — |

## Editorial surface — `(layout-1)`

| Pattern | Count |
| --- | ---: |
| `/solar-pumps/*` | 23 |
| `/rooftop-solar/*` | 23 |
| `/solar-subsidy/*` | 14 |
| `/solar-panels/*` | 13 |
| `/solar-installation/*` | 13 |
| `/solar-inverters/*` | 13 |
| `/solar-financing/*` | 12 |
| `/tools/*` | 3 |
| Pillar landings (7) | 7 |
| Single pages | 8 |

Single pages: `/`, `/about-us`, `/terms-of-use`, `/privacy-policy`, `/data-deletion`,
`/data-access`, `/write-for-us`, `/seo-index`, plus `/tools`.

### `/{pillar}/{slug}` is polymorphic

One route serves two different page types. `solar-panels/[slug]/+page.server.ts` checks a
cluster whitelist first (`isClusterSlug`), then falls back to `resolveBrandSlug`. So the
counts above mix SEO cluster articles and brand pages and cannot be split from the sitemap
alone. Same for `/solar-subsidy/{slug}`, which serves both state subsidies and discoms.

## Routes not in any sitemap

These exist and are database-backed, but are not advertised.

| Pattern | Source |
| --- | --- |
| `/solar-panels/{brand}/{model}` | `solarProducts`, ISR |
| `/solar-inverters/{brand}/{model}` | `solarProducts`, ISR |
| `/solar-pumps/{brand}/{model}` | `solarProducts`, ISR |
| `/{cc}/project/{project_id}` | projects |
| `/{cc}/recent-solar-installation-projects/{page_slug}` | pagination |
| `/{cc}/district/{district_slug}` | geo shim |
| `/{cc}/partners/join/{district_slug}` | geo |
| `/{cc}/county/{county_slug}` | US legacy shim |
| `/{cc}/solar-panel-installer-directory/{city}` | US legacy shim |
| `/authors/{slug}` | `authors` — in the generator, 0 rows live |

## Non-page routes to port

- `/sitemap.xml`, `/content-sitemap.xml`, `/{cc}/sitemap.xml`
- `/{cc}/api/*` — 9 endpoints
- `/api/stories`, `/api/submitDataAccess`, `/api/submitDataDeletion`, `/api/cron/purge-old-leads`
- `hooks.server.ts` — legacy 301s and rewrites, to become `middleware.ts`
