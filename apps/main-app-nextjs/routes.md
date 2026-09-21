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
`/data-access`, `/write-for-us`, plus `/tools`.

> `/seo-index` was the ninth. **Retired 2026-09-21, not ported**: nothing linked to it,
> it emitted `noindex, nofollow` while the sitemap advertised it at priority 0.5, its
> title said "| Dev", and its ~200 hand-written links had drifted — three pointed at
> `authors`, `solar_brands` and `solar_products` rows that do not exist. `/specimen`
> and this file already cover what it was for. **The advertised total is 1,413.**

> The counts above are the 2026-09-05 sitemap snapshot and are left as measured.
> One has moved since: `solar-pumps/kusum-scheme` was set to `draft` on 2026-09-21
> (an empty duplicate of `kusum-yojana` — `archetype/editorial.md` §2), so
> `/solar-pumps/*` is 22 and the editorial total is 117.

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
| `/{cc}/recent-solar-installation-projects/{page_slug}` | pagination — 15 pages at 9 per page, 130 visible rows |
| `/{cc}/district/{district_slug}` | geo shim — a 301 route handler, never a page |
| `/{cc}/partners/join/{district_slug}` | geo |
| `/{cc}/county/{county_slug}` | US legacy shim |
| `/{cc}/solar-panel-installer-directory/{city}` | US legacy shim |
| `/authors/{slug}` | `authors` — in the generator, 0 rows live |
| `/unsubscribe` | the email opt-out — reached only from a mailed link, `noindex` |

> `/unsubscribe` was `/{cc}/unsubscribe` in SvelteKit and **moved to the root on
> 2026-09-21**: nothing on it is country-specific and the `unsubscribe` table has no
> country column. `/in/unsubscribe` and `/us/unsubscribe` 301 to it via
> `MOVED_TO_ROOT`, keeping the `?unsubscribe=` query that already-sent mail carries.

## Non-page routes to port

- ~~`/sitemap.xml`, `/content-sitemap.xml`, `/{cc}/sitemap.xml`~~ — ported 2026-09-21.
  The content sitemap no longer lists `/seo-index` or the brand, state-subsidy,
  discom, financing-bank and author families: none of those routes were ported and
  all five tables are empty. `lib/sitemap.ts` has the reasoning.
- `/{cc}/api/*` — 7 endpoints
- ~~`/{cc}/unsubscribe` POST~~ — ported 2026-09-21 as `/api/unsubscribe`. The country
  prefix is dropped: the SvelteKit handler validated `params.country` and then never
  read it, and the table has no country column. Same call as the two compliance
  endpoints, so the handler total is 17.
- ~~`/api/stories`, `/api/submitDataAccess`, `/api/submitDataDeletion`~~ — ported
  2026-09-21 with the two compliance pages
- ~~`/api/cron/purge-old-leads`, `/{cc}/api/postRecentProject`,
  `/{cc}/api/updateRecentProject`~~ — **not ported, deliberately.** The two project
  writes are duplicates of routes `business-app` already owns; the purge belongs to an
  admin app. README **State** has the reasoning. This is the one place the port does
  not keep a route.
- ~~`hooks.server.ts` — legacy 301s and rewrites~~ — ported to `middleware.ts`, 2026-09-21
- ~~`/{cc}/api/submitBusiness`, `sendBusinessSubmissionConfirmation`, `getCities`,
  `getLevel2s`~~ — ported 2026-09-21 with the lead forms

> `/us/get-quotes` and `/us/partners/*` are advertised above but answer a 301
> (`middleware.ts`): both read IN-only tables, and a real US funnel is new product
> surface rather than porting work. `/us/business-form` is a real page.
>
> **`/us/business-listing` is a real page too**, and `/us/partners` 301s *to* it — so
> it, not `/{cc}/partners`, is the US installer-acquisition surface. That is why the
> page carries a country fork (benefits, FAQs, hero and closing CTA, video, social
> proof) and `/{cc}/partners` does not. Ported 2026-09-21.
