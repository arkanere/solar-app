# Migration plan: dissolve `routes/in/`

> **STATUS: in progress. Stages 1–4 of 16 done (2026-07-31).** Next: **S5**
> (delete the `/us` duplicate legal pages).
>
> ⚠️ **S6 has been restructured — read the S4 and S6 notes before continuing.**
> Redirects are no longer one late stage; each move stage lands its own.
>
> This document is written to be executed across many cold-start sessions. The
> per-route checklist in §8 and the stage log beneath it are the **only** memory
> between sessions — tick them as you go and commit the update with each stage.
> Read §3 (decisions taken) before changing anything; those were settled with the
> user and should not be relitigated.

## 1. Context

`apps/main-app` was forked per country at every layer. `docs/country-scalable-architecture.md`
records the unification effort: unified DB tables with `country_code`, a `CountryConfig`
layer (`src/lib/countries/`), and one route tree `routes/[country=country]/`.

That effort is **partially done**. `[country=country]/` today serves only `solar/**`,
`installer/[installer_slug]`, six API endpoints and a (currently dead) `sitemap.xml`.
`routes/in/` still holds ~40 page routes and 3 API routes with no `[country]` equivalent —
the 7 SEO content pillars, tools, projects, partners, legal pages, forms and funnels.

`docs/country-scalable-architecture.md:103` deliberately decided those stay under
`routes/in/`, reasoning that feature-flag-404ing dozens of content routes "adds risk for
no benefit." **This plan reverses that decision**, on the user's instruction: the goal is
one simple, non-chaotic route surface, not three.

Intended end state: `routes/in/` does not exist. Nothing that is IN-specific-by-accident
remains addressable only under `/in`.

## 2. Target architecture — three destinations

The routes do **not** all go to one place. Each existing `/in` route lands in one of three:

| Destination | What goes there | URL shape |
|---|---|---|
| **A. Country-less root** (`routes/(layout-1)/`) | 7 content pillars, tools, legal & static, authors, seo-index | `/rooftop-solar`, `/tools/emi-calculator`, `/privacy-policy` |
| **B. Country tree** (`routes/[country=country]/`) | Marketplace routes that are genuinely per-country: home, projects, partners, business-listing/form, get-quotes, thank-you\*, unsubscribe, district shim, the 3 APIs | `/in/partners`, `/us/business-listing` |
| **C. Deleted** | `in/sitemap.xml` (superseded), dead `$lib/us/*` components | — |

`routes/us/` is **out of scope and stays**. Its literal routes keep winning for `/us`.
The only `/us` files this plan touches are the duplicate legal pages that destination A
makes redundant (§Stage 5) and a new `+layout.server.ts` (§Stage 3).

### Consequence: URLs change

Destination A means `/in/rooftop-solar` → `/rooftop-solar`. These URLs are indexed.
**Every moved content URL needs a 301.** This is the single largest risk in the plan and
the reason Stage 6 exists. `/in/solar/**` and `/in/installer/**` are untouched (they
already moved with zero URL change) — the SEO exposure is confined to the content pillars,
tools, authors and legal pages.

### Consequence: feature flags lose their routing role

`features.seoContentFamilies`, `tools`, `subsidy`, `financing`, `authors` currently exist
to gate these routes per country. Once the content is country-less they gate **nav links
only**, not routes. Do not delete the flags — `slug-resolver.ts` still uses
`seoContentFamilies` to stop a US city slug resolving to a brand page, and
`lib/server/sitemap.ts` uses several. Narrow them; don't remove.

## 3. Decisions taken (do not relitigate)

1. **Move everything out of `routes/in/`.** Reverses `country-scalable-architecture.md:103`.
   Record the reversal in that doc as part of Stage 16.
2. **Content is country-less at the root**, accepting for now that India-specific data
   (INR pricing, `state_subsidies`, `discoms`, `solar_financing_banks`, `pincode_mapping`)
   is served at country-less URLs. De-countrying the *data* is explicitly a later effort.
3. **`routes/us/` is not deleted.** Merging the nine `/in`↔`/us` twins is out of scope
   except where destination A already collapses them (legal pages).
4. **Component merge (`$lib/in` + `$lib/us` → `$lib/components`) is in scope** — this is
   the unfinished Step 6 of the architecture doc. It runs last (Stage 15).
5. **SQL stays byte-identical.** Do not switch moved loaders from legacy tables
   (`in_business_profiles`, `LeadData`, `locations`) to unified (`businesses`, `leads`,
   `geo_locations`). The final write cutover is a separate atomic cross-app effort
   (`country-scalable-architecture.md:241-249`); entangling them makes both unrevertible.
   Byte-identical SQL is also what makes the HTML/sitemap diffs in §7 meaningful.
6. **Never remove `in` from `COUNTRIES`** (`src/lib/countries/index.ts`). The matcher
   depends on it; `/in/solar/**` and `seo_pages` DB content depend on `/in/` staying live.

## 4. Facts established during planning (trust these)

- **Nothing under `routes/in/` is prerendered.** `svelte.config.js` has
  `prerender: { entries: ['*'] }`, but Kit's `'*'` expansion skips any route id containing
  `[` and only enqueues ids with `prerender === true`. The only `prerender = true` in the
  app is four files, all literal `/us` paths. **Add no `export const entries`.**
  The real prerender hazard is the *crawler*: `handleHttpError` defaults to `fail`, so if a
  prerendered `/us` page emits a link to a 404, `npm run build` fails. That bites in
  Stage 15, not in the route moves.
- **`[country=country]/(layout-1)/+layout.svelte` is already a parameterized superset** of
  the `in` layout — it renders `/{cc}/rooftop-solar`, `/{cc}/tools` etc. behind feature
  flags. Under this plan those links become country-less (`/rooftop-solar`), which
  *simplifies* it.
- ~~**`/us/solar/**` already emits `/in/` links today** — a live bug.~~ **Wrong, corrected
  in S2.** `DistrictCTA` is not imported by `[country]/solar/**` at all — only by
  `ClusterPage`, which lives entirely under `routes/in/`. `ProjectGallery` *is* imported
  there, but both call sites sit behind `{#if country.features.projects}` and US has
  `projects: false`, so the hardcoded `/in/project/` never rendered on `/us`. It was dead
  code, not a live bug. S2 de-hardcoded it anyway.
- **`in/api/submitBusiness` fetches `/in/api/sendBusinessSubmissionConfirmation`**, which no
  longer exists under `/in`. It resolves only via `[country]` fallthrough. Fix in Stage 12.
- **`aboutStats` will change value.** `in/(layout-1)/+layout.server.ts` counts legacy
  `in_business_profiles`/`LeadData`; `[country]/(layout-1)/+layout.server.ts` counts unified
  `businesses`/`leads` with `country_code`. Snapshot both before Stage 4 so a changed number
  on a live page isn't mistaken for a bug.
- **`routes/(layout-1)/` already exists** with a country-less home, `data-deletion`, and a
  334-line layout — precedent for destination A. But that layout has none of the site nav
  chrome the 604/630-line country layouts have. Stage 1 resolves this.
- **`src/lib/server/migrations/*.sql` seed `seo_pages.content` JSONB with `/in/...` hrefs.**
  These are rendered raw and live in the prod DB — invisible to grep. Stage 6's redirects
  must cover them; never rewrite the historical `.sql` files.
- **No tests exist anywhere in the monorepo.** The build is the test. See §7.
- **IN lead forms POST to `https://user.solarvipani.com/in/api/submitLead`** — a *different
  app*. Never rewrite that URL.

## 5. Cross-cutting prerequisites

### 5a. Shared site chrome (blocks destination A)

Country-less content pages need the site header/footer. Today that chrome lives duplicated
inside `routes/[country=country]/(layout-1)/+layout.svelte` (630 ln) and
`routes/in/(layout-1)/+layout.svelte` (604 ln), while `routes/(layout-1)/+layout.svelte`
(334 ln) has almost none.

Extract header + footer into `src/lib/components/chrome/SiteHeader.svelte` /
`SiteFooter.svelte` taking an **optional** `country?: CountryConfig` prop:
- `country` present → country-aware links (`/{cc}/partners`, `/{cc}/business-listing`).
- `country` absent → country-less links only; hide per-country CTAs.
- Content links (`/rooftop-solar`, `/tools/...`) are country-less in **both** cases.

This is the largest single piece of work in the plan. It is Stage 1 because destinations
A and B both depend on it.

### 5b. Sitemaps

`routes/sitemap.xml/+server.ts` is currently a bare index over `Object.keys(COUNTRIES)`.
Country-less content has no home in it. Restructure (Stage 13): the root sitemap becomes a
**sitemap index** listing `/{cc}/sitemap.xml` per country **plus** a new
`/content-sitemap.xml` for the country-less URLs. Move the `seoContentFamilies`, `subsidy`,
`financing`, `authors` sections out of `generateSitemapEntries()`
(`src/lib/server/sitemap.ts`) into the new content sitemap — they are no longer per-country.
`generateSitemapEntries` keeps geo + installers + the per-country static pages.

## 6. Stages

Each stage is one commit, one deploy, one revert. Run `npm run check && npm run build`
before every deploy. Straight to `main` per CLAUDE.md.

| # | Stage | Depends on |
|---|---|---|
| 1 | Extract shared chrome (`SiteHeader`/`SiteFooter`) | — |
| 2 | De-hardcode `$lib/in/components/seo/*` URLs | — |
| 3 | Add `routes/us/(layout-1)/+layout.server.ts` | — |
| 4 | Country-less: legal & static | 1 |
| 5 | Delete `/us` duplicate legal pages | 4 |
| 6 | Redirect layer for all moved content URLs | 4 |
| 7 | Country-less: 7 content pillars | 1, 2, 6 |
| 8 | Country-less: tools | 1, 6 |
| 9 | Country-less: authors + seo-index | 1, 6 |
| 10 | `[country]`: projects | 1 |
| 11 | `[country]`: partners, forms, funnels, home, district shim | 1 |
| 12 | `[country]`: the 3 API routes | — |
| 13 | Sitemap restructure | 7, 8, 9 |
| 14 | Delete `routes/in/` | 4–13 |
| 15 | Component merge → `$lib/components/` | 14 |
| 16 | Update the architecture doc | 15 |

---

### S1 — Extract shared chrome
*Why first: both destinations need it; nothing can move until content pages have a header.*

New `src/lib/components/chrome/{SiteHeader,SiteFooter}.svelte` per §5a. Rewire
`routes/[country=country]/(layout-1)/+layout.svelte`, `routes/in/(layout-1)/+layout.svelte`
and `routes/(layout-1)/+layout.svelte` to use them. **No route moves in this stage** — the
site must look and behave identically afterward.

Content links become country-less here (`/rooftop-solar` not `/{cc}/rooftop-solar`). Those
targets don't exist until S7 — so either land S1's link change together with S7, or point
them at `/in/...` in S1 and flip in S7. **Prefer the latter**: it keeps S1 a pure refactor.

Breaks: the whole site's chrome, on every page. Diff rendered HTML of one page per tree
(`/in`, `/us`, `/`) before and after — should be identical.

**Done 2026-07-31.** As built:
- `SiteHeader` owns the nav *and* the translation modal (it owns the modal's state);
  the modal was deleted from all three layouts. `SiteFooter` owns the 5-column footer
  plus the copyright bar. `AboutSolarVipani` stayed in the layouts — it needs
  `data.aboutStats`, which the country-less tree has no loader for.
- Both components take `country?: CountryConfig`. Absent ⇒ brand href `/`, Solar Guide
  and Tools shown, **Find Solar / Get Quotes / Partner / List Your Business hidden**.
- `routes/in/(layout-1)/+layout.svelte` has no `data.country`, so it passes
  `getCountry("in")` directly. That is what keeps its HTML identical.
- Content links go through a single `contentPrefix` derived in each component —
  `/${cc}` with a country, `/in` without. **S7 flips both to `''`.** Grep
  `contentPrefix` to find them.
- Verified: `/us` byte-identical; `/in` and `/in/rooftop-solar` differ only in
  trailing whitespace and Svelte hydration-marker comments. `/` intentionally gained
  the footer + brand/Solar Guide/Tools links (all `/in/...` for now) — this is the
  §5a change destination A needs. Build passes; all four prerendered `/us` pages
  still emit; route-dir count unchanged at 419.

### S2 — De-hardcode `$lib/in/components/seo/*`
*Why early: fixes the live `/us/solar/**` bug and unblocks S7.*

~18 files in `src/lib/in/components/seo/`. Extend `src/lib/countries/urls.ts` (already has
`toSlug`, `countryUrl`, `geoUrl`, `installerUrl`) with the helpers these need. For links
that become country-less (pillars, tools, authors) just emit the literal country-less path.
For links that stay per-country (`/{cc}/get-quotes`, `/{cc}/project/{slug}`) take an
explicit `country: CountryConfig` prop from the calling page — **not** `page.data.country`,
which is `undefined` in the country-less tree.

Update the four already-migrated callers under `routes/[country=country]/(layout-1)/solar/**`.

Verify: `/us/solar/california/orange` HTML contains zero `/in/` hrefs.

**Done 2026-07-31.** As built, with three deviations from the text above:
1. **`contentUrl()` instead of literal country-less paths.** Emitting `/rooftop-solar/`
   here would 404 until S7 — a live regression for the whole interim. Instead
   `src/lib/countries/urls.ts` gained `contentUrl(path)`, backed by a single
   `CONTENT_PREFIX = '/in'`. **S7 flips that one constant to `''`** and every content
   link in the app follows. Same discipline S1 used for its `contentPrefix`.
   (`SiteHeader`/`SiteFooter` still have their own local `contentPrefix` — S7 flips
   three constants, not one. Grep `CONTENT_PREFIX|contentPrefix`.)
2. **The prop is `country: CountryCode`, not `CountryConfig`.** Nothing in these
   components needs more than the code, and `country="in"` at 20-odd call sites is far
   lighter than `getCountry('in')`. Widen it in S15 if the merged components need labels.
3. **`seo-index/+page.svelte` was left alone.** It is ~150 hardcoded `/in/...` hrefs and
   belongs to S9; converting it here would have tripled the diff for no benefit.

Also added: `projectUrl(country, slug)` to `urls.ts`.

Split of link kinds, for reference when doing S7–S11:
- `contentUrl(...)` — pillars, clusters, brands, products, tools, authors, subsidy and
  financing sub-pages. Destination A.
- `countryUrl(country, ...)` — the **Home breadcrumb** and `/get-quotes/`. Destination B.
  Note `{ name: 'Home' }` means the *IN home*, which S11 moves to `[country]`. It is
  deliberately **not** `contentUrl` anywhere.
- `geoUrl(country, ...)` — `/solar/**`. Already migrated.
- `projectUrl(country, ...)` — `/project/**`. Destination B, S10.

**Open question for S8/S9:** once tools and authors are country-less, should their Home
breadcrumb still point at `/in/` (`countryUrl('in', '/')`, what it does today) or at the
country-less `/`? Left as-is in S2 so the stage changed no behavior. Decide when moving.

**Verification gap:** `solar_brands`, `state_subsidies` and `discoms` appear to be empty
in the dev DB — no brand, product-spec, state-subsidy or discom URL is in
`/in/sitemap.xml`, and those routes 404 locally. So `BrandPage`, `ProductSpecPage`,
`StateSubsidyPage`, `DiscomPage` and `BankSchemePage` were verified by `svelte-check` and
the build only, never by rendering. Re-check them against prod after S7b/S7c.

Verified: `/in/rooftop-solar` and `/in/rooftop-solar/cost` render an identical href
multiset before and after. `npm run check` still 17/14. Build passes. `/in/` grep
(excluding migrations) 329 -> **240**.

### S3 — `routes/us/(layout-1)/+layout.server.ts`
*Why: `/us` pages have no `data.country` today; S15's merged components need it.*

```ts
export const load: LayoutServerLoad = () => ({ country: getCountry('us') });
```

Pure and non-async, so the four `prerender = true` US pages keep prerendering — confirm
their HTML still lands in `.svelte-kit/output/prerendered/`. Do **not** add `aboutStats`
here; that would couple a prerendered page's build to the DB.

**Done 2026-07-31.** Exactly as specified. All four prerendered pages still emit.
`/us` markup and hrefs are identical; `data.country` is now in the payload. Every page
under `us/(layout-1)/` returns 200, including the
`recent-solar-installation-projects/[page_slug]` stub the S10 note flagged — it ignores
the new prop and does not crash. (`/us/unsubscribe` returns 405 on GET; that is a
POST-only `+server.js` and predates this work.)

Note for HTML diffing in dev: the inline `<style>` block varies run to run with Vite's
dev CSS injection, so a raw `diff` reports large phantom changes. Compare the tag
sequence with `<style>` bodies elided, or compare the href multiset.

### S4 — Country-less: legal & static
*Why the first move: near-zero logic, exercises the pattern cheaply.*

To `routes/(layout-1)/`: `privacy-policy`, `terms-of-use`, `about-us`, `data-access`,
`write-for-us`, `seo-index`. (`data-deletion` is **already** there — delete the `/in` copy
and reconcile.) Most `+page.server.ts` are ISR-only shells returning `{}`.

**Copy `export const config` verbatim.** Losing an `isr.expiration` silently turns a cached
page into an on-demand function — invisible in dev, visible on the Vercel bill.

**Done 2026-07-31.** All seven moved via `git mv`, so every `export const config`
(`isr.expiration: 1296000` on privacy-policy, terms-of-use, about-us, data-deletion) came
across byte-identical. `data-access`, `write-for-us` and `seo-index` have no
`+page.server.ts` at all.

- **`data-deletion` reconciliation:** the two copies had diverged a long way. The `/in`
  copy is the newer one — it uses the shadcn `Card`/`Input`/`Alert` components; the root
  copy was older raw-Tailwind markup and its loader returned an unused `{ user: null }`.
  **The `/in` copy won** and replaced the root copy wholesale. Same rule as S15c: start
  from the IN version.
- **Redirects landed here, not in S6** — see the S6 note above.
- Internal links between these seven are now written as literal country-less paths
  (`/privacy-policy`), **not** `contentUrl()`. `contentUrl`/`contentPrefix` mean "still
  under `/in`, moves at S7"; these have already moved. Same for `SiteFooter`'s About Us,
  which came off `contentPrefix`, and `/us/(layout-1)/+layout.svelte`'s About us link.
- `CookieConsent.svelte` and `routes/(layout-1)/+page.svelte` also pointed at
  `/in/privacy-policy`; both retargeted.

Verified: all seven country-less URLs 200. All seven `/in/*` originals redirect in
**exactly one hop** with the query string preserved. The four `/us` twins still 200 with
zero hops — S5 owns those. `npm run check` 17/14, build passes.

**Known gap, closed by S13:** `/in/sitemap.xml` still advertises `/in/privacy-policy`,
`/in/terms-of-use` and `/in/data-deletion`, which now 301. Three URLs, correctly
redirected, so it is cosmetic until the sitemap restructure.

### S5 — Delete `/us` duplicate legal pages
Now redundant: `us/(layout-1)/{privacy-policy,terms-of-use,about-us,write-for-us}`.
`/us/privacy-policy` 301s to `/privacy-policy` by adding `'us'` to `MOVED_TO_ROOT_FROM`
in `src/hooks.server.ts` — **in this same commit**, since that is what vacates them. Note `us/about-us/+page.js` carries
`prerender = true` — removing it changes the prerender set; confirm the build still passes.

### S6 — Redirect layer
*Why before the big moves: the redirects must be live the moment a URL vacates.*

> **RESTRUCTURED IN S4 — this stage no longer exists as a standalone step.**
> The ordering in §6's table was self-contradictory: S4 vacates `/in/privacy-policy`
> and friends, but S6 (which adds the 301s) was scheduled *after* it, so those URLs
> would 404 for a whole deploy. And S6's single combined rule could not simply be
> moved earlier either — it lists `rooftop-solar`, `tools`, `authors` etc., which are
> still **live** until S7–S9, so landing it first would 301 working pages.
>
> Both failure modes come from the same mistake: treating the redirect list as one
> atomic thing. It is now incremental. `src/hooks.server.ts` holds
> `MOVED_TO_ROOT` (families) and `MOVED_TO_ROOT_FROM` (country prefixes the rule
> applies to). **Each move stage appends its own families in the same commit that
> moves them.** The invariant is written at the call site.
>
> What is left of S6 is the pieces that are not per-family, to be done during S7a:
> retarget `rooftop-solar/roi/+server.ts` at the country-less `/solar-financing/roi/`
> so it does not become a two-hop chain, and re-run the §7.4 hop check across the
> whole moved surface.

Extend `legacyRedirect()` in `src/hooks.server.ts` (pure string rewrites, no DB, already has
the `building` guard). One rule covers the lot:

```
/(in|us)/(rooftop-solar|solar-panels|solar-inverters|solar-pumps|solar-financing
         |solar-installation|solar-subsidy|tools|authors|seo-index
         |privacy-policy|terms-of-use|about-us|write-for-us|data-access|data-deletion)(/.*)?
  → /$2$3
```

Single hop, 301, preserve `event.url.search`. **Verify no chains**: `/in/rooftop-solar/roi/`
redirects to `/in/solar-financing/roi/` today, which would then redirect again. Retarget
`rooftop-solar/roi/+server.ts` to the country-less `/solar-financing/roi/` in S7.

This rule also covers the `/in/...` hrefs living in `seo_pages.content` JSONB.

### S7 — Country-less: 7 content pillars *(split into 3 deploys)*
- **7a** `rooftop-solar`, `solar-installation` (+`[slug]`, + `rooftop-solar/roi/+server.ts`)
- **7b** `solar-panels`, `solar-inverters`, `solar-pumps` (+`[slug]`, +`[slug]/[model_slug]`)
- **7c** `solar-financing`, `solar-subsidy` (+`[slug]`)

Move to `routes/(layout-1)/`. Drop the `params.country` plumbing entirely — these loaders
take no country. Tables unchanged: `seo_pages`, `solar_brands`, `solar_products`,
`solar_financing_banks`, `state_subsidies`, `discoms`, `in_business_profiles` COUNT.
`isClusterSlug()` from `src/lib/in/pillar-config.ts` keeps working as-is.

Flip the S1 nav links to country-less here.

### S8 — Country-less: tools
`tools/`, `tools/{solar-calculator,emi-calculator,subsidy-checker}` → `routes/(layout-1)/`.
Queries hit **legacy `locations`** (not `geo_locations`) plus `in_business_profiles`,
`state_subsidies`, `solar_financing_banks` — keep all of it verbatim.
`tools/+page.server.ts` returns hardcoded `/in/tools/...` hrefs; make them country-less.

### S9 — Country-less: authors + seo-index
`authors/[author_slug]` (tables `authors`, `in_blog_posts`, `seo_pages`) → root.
Blogs were removed 2026-07 (`hooks.server.ts:21` 301s `/{in,us}/blogs`) — check the author
page isn't linking to dead `/in/blogs/...`. Also fix `src/lib/seo.ts:100`
(`${BASE_URL}/in/authors/${slug}/`) and `:44` (`/in/installer/` — already stale, should be
`installerUrl()`).

### S10 — `[country]`: projects
`project/[project_id]`, `recent-solar-installation-projects/` (+`[page_slug]`) →
`routes/[country=country]/(layout-1)/`. Joins `projects` → `in_business_profiles`.
Gate on `features.projects` → `error(404)` for US.

`routes/us/(layout-1)/recent-solar-installation-projects/[page_slug]/+page.svelte` is a
stub with no server file and keeps winning for `/us`. After S3 it receives `data.country` —
confirm it doesn't crash.

### S11 — `[country]`: partners, forms, funnels, home
`partners/`, `partners/join/`, `partners/join/[district_slug]`, `partners/join/thank-you`,
`business-listing`, `business-form`, `get-quotes`, `thank-you`, `thank-you-business`,
`unsubscribe` (both `+page.svelte` and `+server.js`), `district/[district_slug]`, and the
IN home (`in/(layout-1)/+page.*`).

Notes:
- `unsubscribe/+server.js` needs the `isCountry(params.country)` guard. It has its own
  `createPool` — leave it.
- `thank-you` reads `LeadData` by `reference_uuid`; the form posting to it lives in
  **user-app**. Don't touch that URL.
- `district/[district_slug]` is a pure 301 shim over legacy `locations`. Gate it.
- Moving the IN home makes it the default for any future country. Intended; note it.
- `/us` keeps its literal `business-listing`, `business-form`, `thank-you*`, `unsubscribe`.

### S12 — `[country]`: the 3 API routes
`in/api/{postRecentProject,submitBusiness,updateRecentProject}` → `[country=country]/api/`.
Each needs its own guard (no layout to do it):

```ts
if (!params.country || !isCountry(params.country))
  return json({ error: 'Unknown country' }, { status: 404 });
```

**Fix here:** `submitBusiness`'s fetch of `/in/api/sendBusinessSubmissionConfirmation` →
`/${params.country}/api/sendBusinessSubmissionConfirmation`.

Leave every DB write exactly as-is (`businesses_1` + `in_business_profiles` +
`in_business_accounts` + `syncBusinessToUnified`) — the write cutover owns those.

Also fix `src/lib/constants/india.ts:45-47` and
`src/lib/components/chat/widgets/LeadFormCard.svelte:51`, which call `/in/api/*`.

### S13 — Sitemap restructure
Per §5b. Delete `routes/in/sitemap.xml/+server.ts` (has an inline `createPool`);
`[country=country]/sitemap.xml` — currently dead code — takes over `/in/sitemap.xml`.
Add `routes/content-sitemap.xml/+server.ts`; move the content sections out of
`generateSitemapEntries()`.

**Diff `/in/sitemap.xml` before and after.** Every URL that leaves it must appear either in
`/content-sitemap.xml` or as a 301 source in S6. Re-run
`scripts/chatbot-related/sync-embedding-index.js` (it fetches
`https://solarvipani.com/in/sitemap.xml`) and confirm the doc count doesn't drop.

### S14 — Delete `routes/in/`
By construction a no-op. `find src/routes/in -type f` must show only
`(layout-1)/+layout.server.ts` and `(layout-1)/+layout.svelte` before deleting.

### S15 — Component merge → `$lib/components/`
- **15a** Delete dead `$lib/us/*` — `BusinessTilesList`, `RecentProjectsCity`,
  `RecommendedSolarSystems`, `SolarComparisonTable`, `SolarSizeCalculator`, `LeadForm`,
  `LeadFormModal`, `LeadProgressBar`, `LeadStageFilter`. Zero refs from `routes/`.
- **15b** Move `$lib/in/components/*` → `$lib/components/*` as a pure rename + import
  rewrite. `AboutSolarVipani` and `StoriesModal` must move in the **same commit** as their
  non-`[country]` importers (`routes/(layout-1)/+layout.svelte:7`).
- **15c** Merge the 4 live US pairs, one commit each: `AboutSolarVipani`, `BusinessForm`,
  `LeadFormBusiness` (US-only — relocate). Start from the IN version (TS, newer) and port
  US deltas, per `country-scalable-architecture.md:126`. Leave `$lib/us/themeStore` alone
  (9 refs, not a component).
- **15d** `lib/countries/faq.ts` imports `$lib/us/faqData` — move to
  `$lib/countries/faq-us.ts` if you want `$lib/us/` gone.

**This is the stage that can fail the build** — the four prerendered US pages render merged
components, and the crawler fails on any 404 link. Check every emitted `href` against the
real `/us` surface.

### S16 — Update `docs/country-scalable-architecture.md`
Record the reversal of line 103 and mark Step 6 done.

## 7. Verification (no tests exist)

Run at **every** stage against `npm run dev`:

1. **`npm run check && npm run build`** — the primary signal. Catches route conflicts, stale
   `./$types`, prerender-crawl 404s.
2. **Route-manifest diff**: `npx svelte-kit sync && find .svelte-kit/types/src/routes -type d | sort`,
   before vs after. Pattern count constant; only prefixes change.
3. **Status matrix** — write expected codes *before* moving:
   `for p in <paths>; do printf '%s ' "$p"; curl -so /dev/null -w '%{http_code}\n' "localhost:5173$p"; done`
4. **Redirect hops**:
   `curl -sIL -o /dev/null -w '%{num_redirects} %{url_effective} %{http_code}\n' localhost:5173/in/rooftop-solar`
   → `1 …/rooftop-solar 200`. Any `num_redirects > 1` is an SEO regression.
5. **HTML equivalence**, one page per family: `curl -s` before/after, `diff`. Expect empty
   or only `aboutStats` numbers.
6. **Sitemap diff**: `curl -s localhost:5173/in/sitemap.xml | grep -o '<loc>[^<]*' | sort`.
7. **`/in/` leakage grep**, monotonically shrinking:
   ``grep -rn "'/in/\|\"/in/\|\`/in/" src/lib src/routes`` — should end at only
   `src/lib/server/migrations/*.sql`.
8. **Cross-app smoke** after S12/S13: `apps/business-app` links to
   `https://solarvipani.com/in/installer/{slug}` and `/in/business-form` — both must resolve.
9. **Lead e2e** after S11: submit an IN lead in dev; confirm `/in/thank-you?ref={uuid}`
   renders and the POST target is still `user.solarvipani.com`.

## 8. Per-route checklist — *tick and commit as you go*

Legend: dest **A** = country-less root, **B** = `[country=country]`, **C** = delete.

| Route (under `routes/in/`) | Dest | Stage | Moved | 301 | Verified |
|---|---|---|---|---|---|
| `(layout-1)/+page.*` (home) | B | 11 | ☐ | n/a | ☐ |
| `rooftop-solar/` + `[slug]` | A | 7a | ☐ | ☐ | ☐ |
| `rooftop-solar/roi/+server.ts` | A | 7a | ☐ | ☐ | ☐ |
| `solar-installation/` + `[slug]` | A | 7a | ☐ | ☐ | ☐ |
| `solar-panels/` + `[slug]` + `[model_slug]` | A | 7b | ☐ | ☐ | ☐ |
| `solar-inverters/` + `[slug]` + `[model_slug]` | A | 7b | ☐ | ☐ | ☐ |
| `solar-pumps/` + `[slug]` + `[model_slug]` | A | 7b | ☐ | ☐ | ☐ |
| `solar-financing/` + `[slug]` | A | 7c | ☐ | ☐ | ☐ |
| `solar-subsidy/` + `[slug]` | A | 7c | ☐ | ☐ | ☐ |
| `tools/` + 3 calculators | A | 8 | ☐ | ☐ | ☐ |
| `authors/[author_slug]` | A | 9 | ☐ | ☐ | ☐ |
| `seo-index/` | A | **4** | ✅ | ✅ | ✅ | ← moved early with S4; its ~150 hardcoded `/in/` hrefs still await S9
| `privacy-policy/` | A | 4 | ✅ | ✅ | ✅ |
| `terms-of-use/` | A | 4 | ✅ | ✅ | ✅ |
| `about-us/` | A | 4 | ✅ | ✅ | ✅ |
| `write-for-us/` | A | 4 | ✅ | ✅ | ✅ |
| `data-access/` | A | 4 | ✅ | ✅ | ✅ |
| `data-deletion/` (root copy exists) | A | 4 | ✅ | ✅ | ✅ |
| `project/[project_id]` | B | 10 | ☐ | n/a | ☐ |
| `recent-solar-installation-projects/` + `[page_slug]` | B | 10 | ☐ | n/a | ☐ |
| `partners/` + `join/` + `join/[district_slug]` + `join/thank-you` | B | 11 | ☐ | n/a | ☐ |
| `business-listing/` | B | 11 | ☐ | n/a | ☐ |
| `business-form/` | B | 11 | ☐ | n/a | ☐ |
| `get-quotes/` | B | 11 | ☐ | n/a | ☐ |
| `thank-you/` | B | 11 | ☐ | n/a | ☐ |
| `thank-you-business/` | B | 11 | ☐ | n/a | ☐ |
| `unsubscribe/` (`+page.svelte` + `+server.js`) | B | 11 | ☐ | n/a | ☐ |
| `district/[district_slug]` | B | 11 | ☐ | n/a | ☐ |
| `api/postRecentProject` | B | 12 | ☐ | n/a | ☐ |
| `api/submitBusiness` | B | 12 | ☐ | n/a | ☐ |
| `api/updateRecentProject` | B | 12 | ☐ | n/a | ☐ |
| `sitemap.xml/` | C | 13 | ☐ | n/a | ☐ |

**Baselines captured 2026-07-31, before S1** (dev server runs on port **7123**, not 5173):
- `/in/sitemap.xml` `<loc>` count: **1346**
- `aboutStats` legacy (`/in`, counts `in_business_profiles`/`LeadData`):
  installerCount **634**, leadsGenerated **3199**
- `aboutStats` unified (`/in/solar`, counts `businesses`/`leads`):
  installerCount **634**, leadsGenerated **3196**
  → after S11 moves the IN home, `/in` shows **3196**. Not a bug.
- `find .svelte-kit/types/src/routes -type d | wc -l` = **419**
- `/in/` grep count: **975** total / **329** excluding `src/lib/server/migrations/`
  (the migrations figure never shrinks — those `.sql` files are historical)
- `npm run check` baseline: **17 errors, 14 warnings in 11 files**, all pre-existing.
  A stage is clean when it does not move these numbers.

**Stage log** (append: stage, date, commit SHA — the revert target for a later session):

| Stage | Date | SHA |
|---|---|---|
| 1 — shared chrome | 2026-07-31 | `af5fa11` |
| 2 — de-hardcode seo/* | 2026-07-31 | `1b80cb0` |
| 3 — /us layout country | 2026-07-31 | `6d6e7df` |
| 4 — legal & static -> root | 2026-07-31 | `S4_SHA` |

## 9. Hazards

1. **SEO.** ~30 indexed content URL families change. S6 must be live before S7–S9, single
   hop, no chains. Every URL leaving `/in/sitemap.xml` must be a 301 source or appear in
   `/content-sitemap.xml`.
2. **`export const config` (ISR) must be copied verbatim** on ~30 loaders.
3. **`aboutStats` value change** — snapshot before S4 (§8).
4. **`seo_pages.content` JSONB holds `/in/` hrefs** in the prod DB, invisible to grep.
   Covered by S6's redirects. Never rewrite the historical migration `.sql` files.
5. **Prerender crawler fails the build** on any 404 link from the four prerendered `/us`
   pages. Bites in S5 and S15.
6. **`routes/+error.svelte` is the only error page** — look at a gated 404 before shipping S10.
7. **Gating is not type-checked.** `svelte-check` will not tell you a route was moved but
   not gated. The §8 checklist is the only safeguard.
8. **Out of scope, note only:** `routes/api/{stories,cron/*,submitDataAccess,submitDataDeletion}`
   have no country context; `features.chatbot` hides the UI but leaves endpoints open.

## 10. First action for the implementation session

Start **S1** (extract shared chrome). It blocks both destinations A and B, and it is a pure
refactor — the before/after HTML diff of one page per tree (`/`, `/in`, `/us`) should be
empty, which makes it the cheapest possible way to confirm the working setup is sound
before any route actually moves.

Capture the §8 baselines at the same time; several of them (the sitemap `<loc>` count, the
route-directory count) are only meaningful if taken before anything moves.
