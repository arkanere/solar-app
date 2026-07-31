# Migration plan: delete `routes/us/`

> **STATUS: IN PROGRESS. S1, S3 and S4 applied 2026-07-31. S2 deleted — its
> premise did not hold. Next stage: S5.**
>
> ⚠️ **S2 no longer exists.** §5a assumed a per-country contact split. There is
> exactly **one** support number (`+918983066701`) and **one** support email
> (`admin@solarvipani.com`) company-wide, and the live `/us/business-listing`
> already showed both. The user confirmed US support routes to the same contact,
> so `CountryConfig.support` would have held identical values for both countries —
> the abstraction CLAUDE.md forbids. Every `tel:`/`mailto:`/`wa.me` link stays as
> it is. **Later stages must not "fix" an Indian number on a US page — that is the
> intended behaviour.**
>
> ⚠️ **Dev writes to the live Neon database** (`POSTGRES_URL` in `.env.local` points
> at `ep-sparkling-union-a1l7shpv-pooler…neon.tech/verceldb`). A POST to any endpoint
> in dev is a production write. One was made and reverted during S3 (a test row in
> `unsubscribe`, id 88, deleted). **§7.9's business-signup e2e in S7 must be planned
> with its rollback before it is run, not after.**
>
> Sequel to `docs/migration-plan-in-country.md` (complete, 16 stages). That plan
> dissolved `routes/in/`; this one dissolves `routes/us/`. Read §3 (decisions taken)
> before changing anything — they were settled with the user and should not be
> relitigated.
>
> ⚠️ **This is not the same shape of job as the `/in` plan.** That one was mostly
> `git mv` plus redirects: the routes it moved had no rival, so a move was a move. Here
> **every page under `routes/us/` has a live `[country]` counterpart that is a different
> page** — different copy, different markup system, in three cases a different database
> table. Deleting a `/us` file does not move it; it *replaces* it with the Indian page.
> The work is merging, not moving, and it is the work §10 of the `/in` plan explicitly
> said was "not scheduled anywhere in this plan and would be new work beyond it."
>
> ⚠️ **The single most dangerous fact in this document (§4.1): the `[country]` pages have
> zero feature gating.** Not one `{#if features.…}` in the home, business-listing,
> thank-you or thank-you-business. They are the Indian pages with the URL prefix
> parameterized, and they only ever answer as `/in` because the literal `/us` routes win.
> Delete a `/us` page without gating its counterpart first and `/us` silently serves
> Indian copy at a US URL — no error, no type error, no failed build. Stage 5 exists
> solely to close this, and it lands **before** any page deletion.
>
> This document is written to be executed across many cold-start sessions. The
> per-route checklist in §8 and the stage log beneath it are the **only** memory between
> sessions — tick them as you go and commit the update with each stage.

## 1. Context

`apps/main-app` was forked per country at every layer.
`docs/country-scalable-architecture.md` records the unification effort;
`docs/migration-plan-in-country.md` records its completion for India. The result today:

- `routes/(layout-1)/` — country-less content: 7 SEO pillars, tools, authors, seo-index,
  legal pages.
- `routes/[country=country]/` — the shared marketplace tree: home, solar/geo, installer,
  projects, partners, business-listing/form, get-quotes, thank-you\*, unsubscribe,
  district shim, 9 API routes, sitemap.
- `routes/us/` — **18 files, untouched by that plan.** §3.3 of it put `routes/us/` out of
  scope: "Merging the nine `/in`↔`/us` twins is out of scope except where destination A
  already collapses them (legal pages)."

This plan reverses that exclusion, on the user's instruction. Intended end state:
`routes/us/` does not exist, `$lib/us/` does not exist, and `/us/**` is served entirely
by `routes/[country=country]/` and `routes/(layout-1)/`.

### What `routes/us/` actually contains

| File | Lines | `[country]` counterpart | Disposition |
|---|---:|---|---|
| `(layout-1)/+layout.svelte` | 311 | `[country]/(layout-1)/+layout.svelte` (320) | **Different design.** S1 |
| `(layout-1)/+layout.server.ts` | 11 | same path | Delete (S11) |
| `(layout-1)/+page.svelte` | 746 | `[country]/(layout-1)/+page.svelte` (528) | **Merge.** S9 |
| `(layout-1)/+page.js` | 1 | — | Delete (prerender flag) |
| `(layout-1)/business-listing/+page.svelte` | 1391 | `[country]/…` (695) | **Merge.** S8 |
| `(layout-1)/business-listing/+page.server.js` | 38 | `[country]/…` (`in_business_profiles`) | **Merge**, reads `us_businesses`. S8 |
| `(layout-1)/business-listing/+page.js` | 1 | — | Delete (prerender flag) |
| `(layout-1)/business-form/+page.svelte` | 121 | `[country]/…` (54) | **Free delete.** S3 |
| `(layout-1)/business-form/+page.js` | 1 | — | Delete (prerender flag) |
| `(layout-1)/thank-you/+page.svelte` | 96 | `[country]/…` (157 + loader) | Merge-lite. S6 |
| `(layout-1)/thank-you-business/+page.svelte` | 110 | `[country]/…` (57) | Merge-lite. S6 |
| `(layout-1)/unsubscribe/+page.svelte` | 168 | `[country]/…` (120) | **Free delete.** S3 |
| `(layout-1)/unsubscribe/+server.js` | 55 | `[country]/…` (63) | **Free delete.** S3 |
| `(layout-1)/recent-solar-installation-projects/[page_slug]/+page.svelte` | 536 | `[country]/…` (gated 404) | **Delete outright — it is broken.** S4 |
| `api/submitBusiness/+server.js` | 98 | `[country]/api/…` (181) | **Merge**, writes `us_businesses`. S7 |
| `sitemap.xml/+server.ts` | 43 | `[country]/sitemap.xml` (45) | **Free delete.** S3 |
| `county/[county_slug]/+server.ts` | 34 | **none** | **Relocate.** S4 |
| `solar-panel-installer-directory/[city]/+server.ts` | 39 | **none** | **Relocate.** S4 |

Roughly 900 of the 3,800 lines are free deletes or relocations. Roughly 2,400 are the
three real merges (home, business-listing, submitBusiness) plus the two thank-you pages.

## 2. Target architecture — four dispositions

| Disposition | What | URL effect |
|---|---|---|
| **A. Already covered by `[country]`** | sitemap, unsubscribe (×2), business-form | none — `[country]` answers the same URL |
| **B. Merge into the `[country]` page** | home, business-listing (+loader), thank-you, thank-you-business, `api/submitBusiness` | none — same URL, one shared page |
| **C. Relocate** | `county/[county_slug]`, `solar-panel-installer-directory/[city]` | none — same URL, moved into `[country]` |
| **D. Delete outright** | `recent-solar-installation-projects/[page_slug]`, `(layout-1)/+layout.*`, the three `+page.js` prerender flags, `$lib/us/themeStore.js` | one URL starts 404ing (see §4.4) |

**No `/us` URL changes and no new 301s.** This is the structural difference from the
`/in` plan, where destination A moved ~30 indexed URL families and every one needed a
redirect. Here the URLs stay exactly where they are — `/us/business-listing` is still
`/us/business-listing`, just served by a shared page. §9's hazard 1 (SEO) is
correspondingly much smaller; the risk moved from *routing* to *content*.

The one exception is `/us/recent-solar-installation-projects/[page_slug]`, which starts
404ing — deliberately, see §4.4.

## 3. Decisions taken (do not relitigate)

1. **`/us/**` keeps working, served by `[country]` + the country-less root.** Not
   "retire the US market" — `/us/solar/**` and `/us/installer/**` are live and stay live.
   (User, 2026-07-31.)
2. **`/us` adopts the main brand chrome** — `SiteHeader`, `SiteFooter`,
   `AboutSolarVipani`, the same look as `/in` and the country-less pages. The current US
   design (Georgia serif, 5-link nav, dark/light toggle) is **retired, not preserved**.
   (User, 2026-07-31.) This is a visible product change to a live site; it lands once, in
   S1, so no later stage changes appearance.
3. **Prerendering is dropped in favour of ISR.** The three `prerender = true` US pages
   become normal SSR routes with `export const config = { isr: { expiration } }`, matching
   every `[country]` page. (User, 2026-07-31.) See §4.5 for what this simplifies.
4. **Merged write paths dispatch to the existing legacy tables per country.**
   `submitBusiness` branches on `params.country`: `us_businesses` + `sv_sync_*('us')` for
   US, `businesses_1`/`in_business_profiles`/`in_business_accounts` + `sv_sync_*('in')`
   for IN. **No data migration, no table switch.** This is the same rule §3.5 of the
   `/in` plan set — the final write cutover
   (`country-scalable-architecture.md`, "Retire old tables", step 6) is a separate atomic
   cross-app effort and entangling them makes both unrevertible.
   ⚠️ **This one was not confirmed by the user** — it was the recommended option on an
   unanswered question. Confirm before S7. The alternative was switching *reads* to
   unified `businesses WHERE country_code = $1` (already app-synced, so current) while
   keeping writes per-country; that is a strictly larger change and couples this plan to
   the unified read surface.
5. **Never remove `us` from `COUNTRIES`** (`src/lib/countries/index.ts`). The matcher
   depends on it, and after this plan `[country]` is the *only* thing serving `/us`.
6. **The two US-only legacy geo shims survive.** `/us/county/orange-ca` and
   `/us/solar-panel-installer-directory/anaheim-ca` are indexed legacy URLs with live
   301s. They move into `[country]`; they are not deleted.

## 4. Facts established during planning (trust these)

### 4.1 ⚠️ The `[country]` pages have no feature gating at all

Measured, not assumed — `grep -c "features\." ` over each:

| File | `features.` uses | India-specific strings |
|---|---:|---:|
| `[country]/(layout-1)/+page.svelte` | **0** | 63 |
| `[country]/(layout-1)/business-listing/+page.svelte` | **0** | 8 |
| `[country]/(layout-1)/thank-you/+page.svelte` | **0** | 4 |
| `[country]/(layout-1)/thank-you-business/+page.svelte` | **0** | 2 |

S11 of the `/in` plan moved these verbatim and parameterized only their **URLs**
(`countryUrl(cc, …)`), never their **content**. The home renders a "Solar Knowledge Hub"
linking `seoContentFamilies` pages (US: `false`), a `RecentProjectsHome` section
(US: `projects: false`), and a section headed *"Why Now is the Right Time to Install
Solar in India"* — all unconditionally.

They are unreachable from `/us` today only because `hooks.server.ts` 301s
`/us/partners` and `/us/get-quotes` before routing, and because the literal `/us` routes
win for everything else. **Deleting a `/us` page removes the only thing standing between
a US visitor and Indian copy.** `svelte-check` cannot see this; the build cannot see it;
only looking at the page can. It is hazard 7 of the `/in` plan, with the safety net now
removed rather than merely thinned.

### 4.2 The two site designs are unrelated

`routes/us/(layout-1)/+layout.svelte` was **never rewired in S1** of the `/in` plan — that
stage did `[country]`, `in` and the country-less root, and left `/us` alone. It still has:
its own `<nav>` with 5 links, a `Georgia, serif` `:global(body)` rule, ~130 lines of
hand-written light/dark CSS, and a `$lib/us/themeStore` toggle. It renders **no**
`SiteHeader`, **no** `SiteFooter`, **no** `AboutSolarVipani`, **no** chatbot.

Seven files import `$lib/us/themeStore` — the layout and six pages, all under
`routes/us/`. It is the last file in `$lib/us/` and dies with the tree (§S11).

### 4.3 `SiteHeader` is already correct for US — no dead links

Verified by reading `src/lib/components/chrome/SiteHeader.svelte`:
- Solar Guide dropdown: `{#if !country || features?.seoContentFamilies}` → hidden for US.
- Recent Projects: `features?.projects` → hidden for US.
- `{#if country && cc === 'in'}` gates *Get Quotes* and *Partner with Us*;
  `{:else if country}` renders *List Your Business* → `/us/business-form`.

So S1 introduces **zero** links into the redirect rules at
`hooks.server.ts` (`/us/partners`, `/us/get-quotes`). This is the payoff of S1+S15c of
the previous plan and it makes the chrome swap genuinely clean.

### 4.4 `/us/recent-solar-installation-projects/[page_slug]` is already broken

The stub reads `data.projects`, `data.pagination` and `data.success`, but the directory
has **no `+page.server.ts`** — `data` carries only `country` from the layout. So the page
renders its own error branch (`Error: Failed to load projects`) with an empty grid, and
has done since S3 of the previous plan gave it `data.country`. Its sibling
`/us/recent-solar-installation-projects` (no `[page_slug]`) already 404s through
`[country]`'s `features.projects` gate — the inconsistency the S10 note recorded.

**Delete it rather than fix it.** `projects` is an IN-only table with no `country_code`
column at all (S11 note), so there is no US data for it to show, and the `[country]`
route already returns the correct answer: 404. This is the one URL in this plan whose
status code changes, from a 200 rendering an error to a clean 404.

### 4.5 Dropping prerender removes an entire hazard class

`src/routes/us/(layout-1)/{+page.js, business-form/+page.js, business-listing/+page.js}`
are the **only three `prerender = true` in the app** (it was four until S5 deleted
`/us/about-us`). Kit's `entries: ['*']` expansion skips any route id containing `[`, so
no `[country]` or country-less route is prerenderable.

Deleting them takes the prerendered set to **zero**. That retires, permanently:
- **Hazard 5** of the `/in` plan — "the prerender crawler fails the build on any 404
  link". With no entries there is no crawl.
- The `building` guard in `hooks.server.ts:68` that exists because `url.search` is
  unreadable while prerendering.
- The constraint on `routes/us/(layout-1)/+layout.server.ts` being pure and non-async,
  and the matching constraint on `AboutSolarVipani`'s optional stats (S15c).

**Verify "3 prerendered US pages" stops being the build's success signal** — every stage
note in the previous plan uses that number. After S11 the correct assertion is that the
build passes with **0** prerendered pages.

### 4.6 Three tables genuinely fork

| Concern | `/us` reads/writes | `[country]` reads/writes |
|---|---|---|
| `business-listing` loader | `us_businesses` | `in_business_profiles` |
| `api/submitBusiness` | `us_businesses` + `sv_sync_*('us')` | `businesses_1` + `in_business_profiles` + `in_business_accounts` + `sv_sync_*('in')` |
| `unsubscribe/+server.js` | `unsubscribe` | `unsubscribe` — **identical, no fork** |

`[country]/api/submitBusiness:145` already carries the comment explaining that `'in'` is
hardcoded on purpose and must not become `params.country`, because every INSERT in that
handler targets IN-only legacy tables. §3.4 is the resolution: branch on the country and
keep both table sets.

`[country]/(layout-1)/thank-you/+page.server.ts` reads `LeadData` and
`in_business_profiles` — both IN-only. **US leads live in `us_leaddata`.** So `/us/thank-you`
today has no loader at all (the US page is static) while the merged page would run an
Indian query. See S6.

### 4.7 The `business-form` pair is already merged in all but the wrapper

Both `+page.svelte` files render `<BusinessForm country={data.country} />` — the merged,
`CountryConfig`-driven component S15c produced. The US wrapper differs only in chrome
(a dark-mode `div` vs a shadcn `Card`). Same for `unsubscribe`, where the `[country]`
version is a strict superset (it uses `countryUrl(cc, '/unsubscribe')` where the US one
hardcodes `/us/unsubscribe`, and both POST to the same `unsubscribe` table).

### 4.8 Cross-app references into `/us`

- `apps/business-app` links to `https://solarvipani.com/us/solar-panel-installer/{slug}`
  (`us/api/claimLead:283`) — a legacy URL served by `hooks.server.ts`'s
  `/us/solar-panel-installer/…` → `/us/installer/…` rule. Untouched by this plan, but
  re-check it in §7.8.
- `$lib/components/LeadFormBusiness.svelte` fetches `/us/api/submitLead` and
  `goto('/us/thank-you')`. `/us/api/submitLead` has no literal route — it already
  resolves through `[country]/api/submitLead`. `/us/thank-you` is S6's scope.
- **No test suite exists anywhere in the monorepo.** The build is the test. See §7.

### 4.9 Baselines (measured 2026-07-31, before S1)

- `npm run check`: **13 errors, 1 warning in 7 files**, all pre-existing. A stage is clean
  when it does not move these numbers. (Two of the errors are the svelte2tsx
  `{@html \`<script>…\`}` mis-parse described in the S11b note of the previous plan — the
  reported line is nowhere near the cause.)
- Build passes with **3** prerendered US pages → must become **0** by S11.
- Dev server runs on port **7123**, not 5173.
- Capture before S1: `/us` and `/us/business-listing` `<loc>` count from
  `/us/sitemap.xml` (was 47 after S13), and the rendered href multiset of `/us`,
  `/us/business-listing`, `/us/business-form`, `/us/thank-you`.

## 5. Cross-cutting prerequisites

### 5a. Country-aware contact details (blocks S6, S8)

`+918983066701` is hardcoded in **12 places across 8 files**, including four `[country]`
pages that this plan makes reachable from `/us`. An Indian mobile number rendered as the
support line on a US page is the most visible possible symptom of §4.1.

Add to `CountryConfig` (`src/lib/countries/types.ts`), beside the existing `taxId`:

```ts
support: {
  phone: string;        // E.164, for tel: hrefs
  phoneDisplay: string; // formatted for copy
  email: string;
};
```

Populate in `in.ts` and `us.ts`. Retarget the four `[country]` pages plus
`business-listing`, `partners` and `recent-solar-installation-projects` in S2. Leave the
country-less pages (`about-us`, `terms-of-use`) and `$lib/constants/social.ts` alone —
they are IN-company-registration facts, not per-country support routing. `seo.ts` and
`BusinessForm.svelte` need a judgement call at the call site; check whether the number is
support-facing or corporate-identity-facing.

### 5b. Where per-country copy lives

Two divergent pages carry real marketing copy: the home (63 India-specific strings vs 43
US-specific) and `business-listing` (8 vs 23). Two mechanisms, and the choice is per
page, not global:

1. **Feature gating** — `{#if features.projects}`, `{#if features.seoContentFamilies}` —
   for whole sections that simply do not apply. This handles most of the home's
   divergence: Knowledge Hub, Recent Projects, the subsidy/financing CTAs.
2. **Per-country copy modules** — `$lib/countries/copy-{in,us}.ts` behind one interface,
   dispatched exactly like `$lib/countries/faq.ts` dispatches `faq-in.ts`/`faq-us.ts`
   (the S15d precedent, which works). For the hero, the value propositions and the
   `business-listing` pitch, where both countries need a section but with different words.

**Prefer (1) wherever it suffices** — CLAUDE.md's simplest-thing-first rule. Reach for (2)
only when a section must exist in both countries with different text. Do **not** invent a
general i18n layer; there are two countries and one language.

### 5c. The two `hooks.server.ts` US rules become reviewable

```ts
if (clean === '/us/partners' || clean.startsWith('/us/partners/')) return '/us/business-listing';
if (clean === '/us/get-quotes') return '/us';
```

These exist because those `[country]` loaders read IN-only legacy tables and would
otherwise answer a US URL with Indian data — and their comment already says *"When the
shared IN/US pages land (stage 15c), delete the matching rule in the same commit that
makes the page country-aware."* S15c did not do that (it merged components, not pages).

**This plan does not delete them either.** Making `/us/partners` and `/us/get-quotes`
real US pages means a US partner-acquisition funnel and a US consumer lead funnel — new
product surface, not a migration. S12 records the decision explicitly and leaves the
rules in place. What S12 *does* fix is the comment, which currently points at a stage
that has shipped without doing what it promised.

⚠️ **Consequence worth stating: these two rules are the last thing keeping the moved
S11 loaders unreachable from `/us`.** After this plan, `hooks.server.ts` is a single
chokepoint protecting IN-only data across the whole marketplace tree. Grep it before
adding a third country to `COUNTRIES`.

## 6. Stages

Each stage is one commit, one deploy, one revert. Run `npm run check && npm run build`
before every deploy. Straight to `main` per CLAUDE.md.

| # | Stage | Depends on |
|---|---|---|
| 1 | Rewire `us/(layout-1)/+layout.svelte` to the shared chrome | — |
| 2 | `CountryConfig.support` + de-hardcode contact details | — |
| 3 | Free deletes: sitemap, unsubscribe ×2, business-form | 1 |
| 4 | Delete the broken projects stub; relocate the 2 geo shims | — |
| 5 | **Gate the `[country]` pages** — no `/us` change | 2 |
| 6 | Merge thank-you + thank-you-business; delete `/us` twins | 1, 5 |
| 7 | Merge `api/submitBusiness` (per-country dispatch) | — |
| 8 | Merge `business-listing` (page + loader); delete `/us` twin | 5, 7 |
| 9 | Merge the home; delete `/us` twin | 5 |
| 10 | Drop prerender → ISR | 3, 8, 9 |
| 11 | Delete `routes/us/` and `$lib/us/` | 1–10 |
| 12 | Update `hooks.server.ts` comments; record the partners/get-quotes decision | 11 |
| 13 | Update both docs | 12 |

---

### S1 — Rewire the US layout to the shared chrome
*Why first: it makes every later page deletion visually a no-op.*

Without this, each stage that deletes a `/us` page hands that one page to the `[country]`
layout while its siblings keep the serif nav — so `/us` looks like two different websites
for the duration of the migration, and every stage's HTML diff is dominated by chrome
churn that hides the real change.

Rewrite `routes/us/(layout-1)/+layout.svelte` to match
`routes/[country=country]/(layout-1)/+layout.svelte`: `SiteHeader country={data.country}`,
`SiteFooter country={data.country}`, `AboutSolarVipani` (stats omitted — §4.5),
`CookieConsent`. Delete the `<nav>`, the `:global(body)` Georgia rule and the ~130 lines
of light/dark CSS.

**Keep `initializeTheme` from `$lib/us/themeStore` for now.** Six `/us` pages still import
`isDarkMode` and carry their own dark-mode CSS; removing the initializer here would leave
them stuck in one mode for the whole migration. The store dies in S11 with its last
importer.

Do **not** move the US analytics loaders (Twitter `twq`, Facebook Pixel, CallSafe). They
are US-campaign-specific and have no `[country]` equivalent — port them into the merged
layout in S11, gated on the country, or confirm with the user that they are retired.

**No route changes in this stage.** The chrome changes; nothing else does.

Verify: all `/us` pages still 200; the header emits *List Your Business* → `/us/business-form`
and **no** link to `/us/partners` or `/us/get-quotes` (§4.3); the footer's content links are
country-less; the build still emits **3** prerendered pages. Diff the href multiset of `/us`
before/after and confirm every removed href was a nav link you meant to remove.

**Done 2026-07-31 (`7ff156e`).** Two deviations from the text above, both forced:

1. **`$lib/us/` was deleted here, not in S11.** The stage text said to keep
   `$lib/us/themeStore` until its last importer dies. That does not survive contact:
   both stores use the **same `localStorage` key `'theme'`** but disagree on its values
   (`$lib/us` treats anything `!== 'dark'` as light; `$lib/themeStore.svelte` defaults to
   `'system'`), and the `SiteHeader` toggle drives only the shared one. Keeping both would
   leave the six `/us` pages' `$isDarkMode` stale until reload, and mixed against the
   `<html>` class. All six now import `$lib/themeStore.svelte` — a drop-in, same exported
   names — and `$lib/us/` is gone. `us-states.ts`'s comment was updated with it.
   ⚠️ **Behaviour change: `/us` visitors with no stored preference now follow their OS
   dark-mode preference**, where the old store defaulted to light. That is what `/in` and
   `/` already do, and consistent with §3.2.
2. **`SiteFooter` gained a US branch.** `SiteHeader`'s US CTA points at
   `/us/business-form`, so swapping the nav orphaned `/us/business-listing` — a 1391-line
   landing page, and the 301 target for `/us/partners`. The Company column now links it
   for US, mirroring IN's *Partner with Us*. **§4.3 was right that no link lands on a
   redirect; it missed that one page lost its only link.**

**Correction to §4.2 and hazard 5: the US analytics are not unique.** The `[country]`
layout already loads the same Umami id, the same GA `G-BXXPPJ3LK8`, the same Hotjar
`5045118`, the same Twitter `opkvk` and the same CallSafe handle `eb37507909fa43ff`.
S11's "port the analytics or confirm they are retired" is therefore near-empty — check
the Facebook Pixel init id, which is the only one that differs in placement.

Verified: `/in`, `/in/business-listing` and `/` **byte-identical href sets**; `/us` pages
differ only by the brand href losing its trailing slash (one hop saved), the header CTA,
and the 5 social links `AboutSolarVipani` adds. No `Georgia` left in the `/us` markup.
`npm run check` 13/1, build passes, 3 prerendered US pages.

### ~~S2 — `CountryConfig.support` + de-hardcode contact~~ — DELETED
**The premise did not hold.** See the status header. There is one support number and one
support email company-wide; the user confirmed US routes to the same ones. No code change.

### S3 — Free deletes
Delete, in one commit, with **no** replacement work:
- `us/sitemap.xml/+server.ts` — `[country]/sitemap.xml/+server.ts` is the same generator
  with an `isCountry` guard added.
- `us/(layout-1)/unsubscribe/+page.svelte` and `+server.js` — §4.7; both hit the same
  country-agnostic `unsubscribe` table.
- `us/(layout-1)/business-form/+page.svelte` and `+page.js` — §4.7.

Verify: `/us/sitemap.xml` still returns the same `<loc>` count as the S13 baseline (47);
`/us/business-form` renders "County", a populated county dropdown and zero tax inputs
(the S15c assertions, now through the shared page); a POST to `/us/unsubscribe` still
succeeds. `/us/business-form` **stops prerendering** here — expect **2**, not 3.

**Done 2026-07-31 (`7644d83`).** Exactly as specified, no deviations.

Verified: `/us/sitemap.xml` **byte-identical** at 47 locs; `/us/business-form` href set
byte-identical, renders `County` ×2, zero `District`, zero `GSTN`; `/in/business-form`
still renders `District` and `GSTN`; `/us/unsubscribe` still 405s on GET (the POST-only
`+server.js` wins over the page — pre-existing, and true for `/in` too).
`npm run check` 13/1, build passes, prerendered **3 → 2**.

⚠️ **The county dropdown is populated client-side, so it has zero `<option>` in the SSR
HTML** — do not read that as a regression. Verify its data source instead:
`curl 'localhost:7123/us/api/getLevel2s?state=California'` (a **GET** with a query
param, not a POST — the S15c-era `/us/api/getCounties` was a POST and the shape changed).

⚠️ **A POST verification here wrote a row to the live DB.** See the status header. The
row was deleted. Prefer read-only verification; where a write is unavoidable, know the
`DELETE` before issuing the `POST`.

### S4 — The projects stub and the two geo shims
Two unrelated things, but both are pure route surgery with no merge:

**Delete** `us/(layout-1)/recent-solar-installation-projects/[page_slug]/+page.svelte`
per §4.4. `/us/recent-solar-installation-projects/2` goes 200 → **404**, matching its
already-404ing parent. Look at the rendered 404 (`routes/+error.svelte`) before shipping —
hazard 6.

**Relocate** `us/county/[county_slug]/+server.ts` and
`us/solar-panel-installer-directory/[city]/+server.ts` to
`[country=country]/county/[county_slug]/` and
`[country=country]/solar-panel-installer-directory/[city]/`. URLs unchanged.

Both already call country-parameterized helpers (`findLevel1ForLevel2('us', …)`,
`findCity('us', …)`, `resolveLevel2('us', …)`), so the move is mostly swapping the
literal `'us'` for `params.country`. **Gate them to US anyway** — these are legacy *US*
URL shapes and the `getStateName` suffix parsing is US state-abbreviation data; an IN
request should 404, not fall through to a bare-slug lookup against Indian rows. Same
reasoning as the district shim in S11c of the previous plan.

Verify: `/us/county/orange-ca`, a bare `/us/county/orange`, and
`/us/solar-panel-installer-directory/anaheim-ca` each still 301 in **exactly one hop** to
a 200; `/in/county/pune` 404s.

**Done 2026-07-31 (`f065563`).** The stub rendered `Error: Failed to load projects` —
§4.4 confirmed live before deleting.

⚠️ **The verification URLs in the stage text above are bad examples, and the "exactly one
hop" assertion is wrong for the directory shim.** Measured before touching anything:
- `/us/solar/california/orange` **404s** — Orange County has no visible businesses. The
  county shim redirects correctly *to a page with no data*. That is data, not routing,
  and it is pre-existing. Verify against a county that has rows: **`maricopa-az`**.
- The directory shim takes **2 hops, not 1**: it resolves to the *city*
  (`/us/solar/{state}/{county}/{city}`), and the city page then folds up to its district.
  Also pre-existing. Preserve 2; do not "fix" it to 1.

Verified: `/us/county/maricopa-az` and bare `/us/county/maricopa` → **1 hop → 200**;
`/us/solar-panel-installer-directory/phoenix-az` and bare `phoenix` → **2 hops → 200**;
`/in/county/pune` and `/in/solar-panel-installer-directory/pune` **404** through the new
gate; both deleted-stub URLs 404 through `routes/+error.svelte`.
`npm run check` 13/1, build passes, 2 prerendered US pages.

### S5 — Gate the `[country]` pages
*The keystone stage. No `/us` file is touched and no URL changes — and it is the stage
that makes every later deletion safe.*

Per §4.1 and §5b, make the four `[country]` pages country-aware:
`(layout-1)/+page.svelte`, `business-listing/+page.svelte`, `thank-you/+page.svelte`,
`thank-you-business/+page.svelte`.

Work backward from the US pages: read what `/us` says today, decide for each `[country]`
section whether US gets it (gate), gets a different version (copy module), or gets
nothing (gate off). The `/in` rendering must be **byte-identical** afterward — that is
what makes this stage revertible and what proves the gates are additive.

**You cannot verify the US half by loading a page in this stage** — the literal `/us`
routes still win. That is deliberate: it keeps the gating change and the deletion in
separate reverts. To see it, temporarily rename the `/us` directory, curl, and rename
back; do not commit that.

⚠️ **Do not skip this and gate opportunistically inside S6/S8/S9.** Splitting it means
each merge stage carries both a content change and a route change, and a US visitor
seeing Indian copy would be a *deploy* away from discovery rather than a `git revert`.

Verify: `/in`, `/in/business-listing`, `/in/thank-you?ref={uuid}`, `/in/thank-you-business`
all 200 with an **empty href diff and empty text diff** against the pre-stage capture.

### S6 — thank-you + thank-you-business
Delete both `/us` pages; the gated `[country]` versions take over.

⚠️ **`[country]/thank-you/+page.server.ts` reads `LeadData` and `in_business_profiles`**
(§4.6). The US page has no loader at all today, and US leads live in `us_leaddata`. Decide
one of:
- **Gate the loader to IN** and have the US branch return `{ customerDetails: null }`, so
  `/us/thank-you` renders the same static confirmation it renders today. **Simplest, and
  it changes no US behaviour.** Recommended.
- Dispatch to `us_leaddata` per §3.4 — a behaviour *addition* for US (the page would start
  showing submitted details). New product surface; confirm with the user first.

`$lib/components/LeadFormBusiness.svelte` `goto`s `/us/thank-you` with no `?ref` (§4.8), so
the US flow does not currently supply one either way.

Verify: `/us/thank-you` and `/us/thank-you-business` 200, in the shared chrome, with **US
support contact details** (§5a) and no rupee/India copy; `/in/thank-you?ref={uuid}` still
renders the lead — that is the URL **user-app** posts to and it must not change.

### S7 — `api/submitBusiness`
Merge `us/api/submitBusiness/+server.js` into
`[country=country]/api/submitBusiness/+server.ts`, dispatching per §3.4:

```
params.country === 'us' → INSERT us_businesses,          sv_sync_*(pool, 'us', id)
params.country === 'in' → INSERT businesses_1 + in_business_profiles
                                 + in_business_accounts,  sv_sync_*(pool, 'in', id)
```

⚠️ **Confirm §3.4 with the user before starting this stage.** It is the one decision in
this plan that was not explicitly settled.

Notes:
- The IN handler's duplicate check (`SELECT business_id FROM in_business_profiles WHERE
  gstn = $1`) has no US analogue and must stay IN-only — US does not collect a tax ID on
  signup (`taxId.collectOnSignup: false`, S15c).
- Both handlers already fetch `/{country}/api/sendBusinessSubmissionConfirmation`; the US
  one hardcodes `/us`, the IN one uses `params.country`. Converge on the latter.
- The US handler reads `county` from the request body, the IN one reads `district`.
  `BusinessForm.svelte` already derives that key from
  `country.levels.level2.singular` (S15c) — **do not re-derive it here.** The S15c note
  records that the wrong key drops the value *without erroring*.
- Keep the `'in'` / `'us'` literals in the `sv_sync_*` calls tied to which table set was
  written, never to a variable that could drift. The existing comment at line 145 explains
  why; keep it and extend it to cover the new branch.

Verify: POST an empty body to `/us/api/submitBusiness` and `/in/api/submitBusiness` (400
from each = handler reached); an unknown country 404s; then submit one real business per
country in dev and confirm the row lands in the right legacy tables **and** in unified
`businesses`/`business_accounts` with the right `country_code`. Roll both back.

### S8 — business-listing
The larger merge: 1391 US lines vs 695 IN. Delete the `/us` page and `+page.server.js`;
the gated `[country]` page and a per-country loader take over.

The loader dispatch mirrors S7: `us_businesses` for US, `in_business_profiles` for IN.
Note the US query has no `district` column and the IN one has no `county` — normalize to
the `level2` naming the unified layer already uses, or alias per branch.

Both pages link installer cards at `/{cc}/installer/{slug}`; the US one already does
(`/us/installer/{business.slug}`), so that is a `countryUrl`/`installerUrl` conversion,
not a behaviour change.

**Expect this stage to be mostly copywriting judgement.** The US page is more than twice
the length of the IN one; the §5b decision (gate vs copy module) is made here, section by
section.

Verify: `/us/business-listing` and `/in/business-listing` both 200 with a populated
installer list from the correct table; US shows the EIN/County vocabulary and US support
contact; `/in` href and text diff empty against the pre-stage capture. `/us/business-listing`
stops prerendering — expect **1**.

### S9 — the home
746 US lines vs 528 IN. Delete `us/(layout-1)/+page.svelte` and `+page.js`.

The structures are genuinely different — US is hero → benefits → `LeadFormBusiness` →
About; IN is hero → quotation CTA → `SolarComparisonTable` → Knowledge Hub → How It Works
→ `RecentProjectsHome` → "Why Now … in India" → FAQ. S5 will have gated the IN-only
sections off for US; what remains here is deciding whether the US hero/benefits copy and
the `LeadFormBusiness` block survive as a US branch of the shared page (per §5b) or are
retired.

**`LeadFormBusiness` is the US lead capture path** — it POSTs `/us/api/submitLead` and
`goto`s `/us/thank-you`. The IN home instead sends visitors to `/in/get-quotes`, which
`/us` does not have (§5c). **If the US branch loses `LeadFormBusiness`, `/us` loses its
only consumer lead form.** Confirm with the user before removing it.

⚠️ **`$lib/components/RecentProjectsHome.svelte` still writes `/in/project/…` literals** —
the S11d note flagged it as "the first place a second country would visibly break." Its
section must be gated on `features.projects` (US: `false`), or fixed, before this stage.

`/us` stops prerendering — expect **0**.

Verify: `/us` and `/in` both 200; `/in` href and text diff **empty**; `/us` contains zero
`/in/` hrefs, zero rupee symbols, zero links to `/us/get-quotes` or `/us/partners`, and no
section headed "…in India".

### S10 — Prerender → ISR
By S9 all three `+page.js` files are gone, so the prerendered set is already 0. What is
left here is making the replacement caching explicit and removing the scaffolding the
prerender constraint required:

- Confirm the merged home, business-form and business-listing carry
  `export const config = { isr: { expiration } }` on their `[country]` loaders. The
  `[country]` home and business-listing already have `isr.expiration: 1296000`; check
  business-form.
- Remove the `building` guard in `hooks.server.ts` **only if** nothing else needs it —
  re-read §4.5 first; `building` may still be true during the SSR build even with no
  prerender entries. **Verify by building, not by reasoning.**
- Update the comments in `AboutSolarVipani.svelte` and
  `routes/(layout-1)/+layout.server.ts` that justify themselves by "the three /us pages
  are prerendered."

⚠️ **This is the stage that changes the Vercel bill and TTFB for the US home.** A
prerendered page becomes an ISR-cached function. Note the `expiration` you choose.

Verify: build passes with **0** prerendered pages; `/us` and `/us/business-listing` 200
with the expected cache headers.

### S11 — Delete `routes/us/` and `$lib/us/`
By construction close to a no-op. `find src/routes/us -type f` must show only
`(layout-1)/+layout.svelte` and `(layout-1)/+layout.server.ts` before deleting.

- `+layout.server.ts` is redundant — `[country]/(layout-1)/+layout.server.ts` supplies
  `data.country` for `/us`.
- `+layout.svelte` after S1 is the shared chrome plus the US analytics loaders (§S1) and
  `initializeTheme`. **Port the analytics into the `[country]` layout gated on the
  country, or confirm they are retired** — do not drop them silently; they are live
  campaign pixels.
- `$lib/us/themeStore.js` loses its last importer here. Delete `$lib/us/` entirely.
  The `[country]` layout uses `$lib/themeStore.svelte.ts`; confirm nothing regressed.
- Update the header comment on `src/lib/countries/us-states.ts`, which says "The old .js
  module keeps its own copy until the last legacy US route is deleted" — that is now.

Verify as a **strict no-op**: `/us`, `/us/solar`, `/us/solar/arizona/maricopa`,
`/us/installer/{slug}`, `/us/business-listing`, `/us/business-form`, `/us/thank-you`,
`/us/sitemap.xml`, plus `/in` and `/` — all 200 with **byte-identical** href sets to the
pre-delete capture. All three sitemaps unchanged. Every legacy US 301 family still fires
in one hop (`/us/state`, `/us/state/solar-panel-installers-in-*`,
`/us/solar-panel-installer-directory`, `/us/solar-panel-installer/*`, `/us/county/*`,
`/us/blogs`, `/us/partners`, `/us/get-quotes`, plus every `MOVED_TO_ROOT` family).

### S12 — `hooks.server.ts` comments + the partners/get-quotes decision
Per §5c. No behaviour change: the two rules stay. Fix the comment that promises S15c
would delete them, and record that a US partners funnel and a US get-quotes funnel are
**new product work, deliberately not in this plan**. Add the third-country warning.

### S13 — Update the docs
Mark this plan complete. In `docs/country-scalable-architecture.md`, update the Step 4
end-state note — it currently says the final state is
"`routes/[country]/` + `routes/in/` + `routes/us/` (redirect shims + static US blogs)",
already amended once for `routes/in/`; amend it again for `routes/us/`. Record that the
legacy US 301 shims now live under `[country]`.

## 7. Verification (no tests exist)

Run at **every** stage against `npm run dev` (port **7123**):

1. **`npm run check && npm run build`** — the primary signal. `check` must hold at
   **13 errors / 1 warning**. The prerendered-page count is a *decreasing* assertion this
   time: 3 → 2 (S3) → 1 (S8) → 0 (S9). Write the expected number before the stage.
2. **Status matrix** — write expected codes *before* deleting:
   `for p in <paths>; do printf '%s ' "$p"; curl -so /dev/null -w '%{http_code}\n' "localhost:7123$p"; done`
3. **Redirect hops** — must not change, since this plan adds no 301s:
   `curl -sIL -o /dev/null -w '%{num_redirects} %{url_effective} %{http_code}\n' localhost:7123/us/county/orange-ca`
4. **Href multiset diff** — `curl -s` before/after, extract `href="…"`, sort, diff. The
   `/in` side must be **empty** at every stage; the `/us` side is the intended change.
   *Note (from the S3 note of the previous plan): the inline `<style>` block varies run to
   run with Vite's dev CSS injection, so a raw `diff` reports phantom changes. Compare
   href multisets, or the tag sequence with `<style>` bodies elided.*
5. **Text diff, not just hrefs.** New to this plan and the most important addition: the
   §4.1 failure mode is *Indian words on a US page*, which no href diff catches. Strip
   tags and grep the rendered US page for `India`, `Indian`, `₹`, `INR`, `rupee`, `lakh`,
   `crore`, `GSTN`, `district`, `PIN Code`, `+91`. Expect zero hits.
6. **Route-manifest diff**: `rm -rf .svelte-kit/types && npx svelte-kit sync && find .svelte-kit/types/src/routes -type d | sort`,
   before vs after. ⚠️ **The `rm -rf` is mandatory** — `sync` does not prune stale
   directories, so without it you are comparing leftovers (the S11d correction).
   Baseline **92** directories.
7. **Sitemap diff**: `curl -s localhost:7123/us/sitemap.xml | grep -o '<loc>[^<]*' | sort`
   — must be unchanged throughout (this plan moves no URLs into or out of it).
8. **Cross-app smoke** after S7: `apps/business-app` links to
   `https://solarvipani.com/us/solar-panel-installer/{slug}` and posts to
   `/us/api/*` — confirm both still resolve.
9. **Business signup e2e** after S7: submit one business per country in dev; confirm the
   row lands in the correct legacy tables **and** in unified `businesses` /
   `business_accounts` with the right `country_code`. Roll back.

## 8. Per-route checklist — *tick and commit as you go*

Legend: **A** = already covered by `[country]`, **B** = merge, **C** = relocate,
**D** = delete outright.

| File (under `routes/us/`) | Disp | Stage | Gated (S5) | Merged | Deleted | Verified |
|---|---|---|---|---|---|---|
| `sitemap.xml/+server.ts` | A | 3 | n/a | n/a | ✅ | ✅ |
| `(layout-1)/unsubscribe/+page.svelte` | A | 3 | n/a | n/a | ✅ | ✅ |
| `(layout-1)/unsubscribe/+server.js` | A | 3 | n/a | n/a | ✅ | ✅ |
| `(layout-1)/business-form/+page.svelte` | A | 3 | n/a | n/a | ✅ | ✅ |
| `(layout-1)/business-form/+page.js` | D | 3 | n/a | n/a | ✅ | ✅ |
| `(layout-1)/recent-solar-installation-projects/[page_slug]/` | D | 4 | n/a | n/a | ✅ | ✅ |
| `county/[county_slug]/+server.ts` | C | 4 | n/a | n/a | ✅ moved | ✅ |
| `solar-panel-installer-directory/[city]/+server.ts` | C | 4 | n/a | n/a | ✅ moved | ✅ |
| `(layout-1)/thank-you/+page.svelte` | B | 6 | ☐ | ☐ | ☐ | ☐ |
| `(layout-1)/thank-you-business/+page.svelte` | B | 6 | ☐ | ☐ | ☐ | ☐ |
| `api/submitBusiness/+server.js` | B | 7 | n/a | ☐ | ☐ | ☐ |
| `(layout-1)/business-listing/+page.server.js` | B | 8 | n/a | ☐ | ☐ | ☐ |
| `(layout-1)/business-listing/+page.svelte` | B | 8 | ☐ | ☐ | ☐ | ☐ |
| `(layout-1)/business-listing/+page.js` | D | 8 | n/a | n/a | ☐ | ☐ |
| `(layout-1)/+page.svelte` (home) | B | 9 | ☐ | ☐ | ☐ | ☐ |
| `(layout-1)/+page.js` | D | 9 | n/a | n/a | ☐ | ☐ |
| `(layout-1)/+layout.svelte` | B | 1, 11 | n/a | ✅ S1 | ☐ | ☐ |
| `(layout-1)/+layout.server.ts` | D | 11 | n/a | n/a | ☐ | ☐ |
| `$lib/us/themeStore.js` | D | **1** | n/a | n/a | ✅ | ✅ | ← pulled forward from S11; see the S1 note

**Stage log** (append: stage, date, commit SHA — the revert target for a later session):

| Stage | Date | SHA |
|---|---|---|
| 1 — US layout → shared chrome | 2026-07-31 | `7ff156e` |
| ~~2 — `CountryConfig.support`~~ | — | deleted, premise did not hold |
| 3 — free deletes | 2026-07-31 | `7644d83` |
| 4 — projects stub + geo shims | 2026-07-31 | `f065563` |
| 5 — **gate the `[country]` pages** | | |
| 6 — thank-you ×2 | | |
| 7 — submitBusiness | | |
| 8 — business-listing | | |
| 9 — the home | | |
| 10 — prerender → ISR | | |
| 11 — delete `routes/us/` + `$lib/us/` | | |
| 12 — hooks comments + decision record | | |
| 13 — docs | | |

## 9. Hazards

1. ⚠️ **Silent Indian content on US pages.** §4.1. The `[country]` pages have zero feature
   gating and `svelte-check` cannot see it. This is hazard 7 of the previous plan with the
   safety net removed: there, a missing gate produced a *wrong 404*; here it produces a
   *plausible-looking wrong page*. S5 exists solely for this; §7.5's text diff is the
   audit.
2. **Visible design change to a live site.** §3.2 is a product decision, not a refactor.
   It lands in S1, early and once, so it can be reverted independently of every merge.
3. **US lead capture could be lost in S9.** `LeadFormBusiness` on the US home is the only
   US consumer lead form; `/us/get-quotes` 301s away. Confirm before removing.
4. **Write-path divergence.** §4.6, §3.4. `submitBusiness` writing the wrong country's
   tables mislabels a business's nationality and is not obviously wrong at the call site —
   the existing `'in'`-hardcoded comment exists because this already nearly happened.
5. **US analytics pixels.** The Twitter, Facebook and CallSafe loaders live only in the US
   layout. S1 and S11 must not drop them silently.
6. **`export const config` (ISR) must be copied verbatim** on every merged loader — losing
   an `isr.expiration` turns a cached page into an on-demand function, invisible in dev
   and visible on the Vercel bill.
7. **`us_leaddata` has no reader in the merged tree.** §4.6. If `/us/thank-you` is ever
   meant to show submitted details, that is new work; S6 records the decision.
8. **`routes/+error.svelte` is the only error page** — look at the S4 404 before shipping.
9. **`hooks.server.ts` becomes a single chokepoint** protecting IN-only data across the
   whole marketplace tree. §5c. Grep it before adding a third country.
10. **The prerender count is a decreasing assertion**, not the constant `3` every note in
    the previous plan uses. §4.5.

## 10. Resume here (cold start)

**Next stage: S5 — gate the `[country]` pages.** S1, S3 and S4 are applied; S2 is deleted.
Read §4.1 (the gating hazard) before starting — S5 exists entirely for it, and every stage
from S6 on assumes it has landed.

**What is left under `routes/us/` (8 files):**

```
(layout-1)/+layout.server.ts          S11
(layout-1)/+layout.svelte             S11  (already shared chrome since S1)
(layout-1)/+page.svelte  +page.js     S9   (the home merge)
(layout-1)/business-listing/+page.svelte, +page.server.js, +page.js   S8
(layout-1)/thank-you/+page.svelte                                     S6
(layout-1)/thank-you-business/+page.svelte                            S6
api/submitBusiness/+server.js                                         S7
```

**Both open questions are settled** — the user confirmed §3.4 (per-country legacy-table
dispatch in `submitBusiness`) and S9 (the US home keeps `LeadFormBusiness`, its only
consumer lead form). Nothing is blocked.

**Standing constraints established during S1–S4, do not rediscover:**
- **Dev writes to the live DB.** Read-only verification by default.
- **Contact details are deliberately shared.** An Indian number on a US page is intended
  (S2's deletion). Do not "fix" it.
- **The prerendered count is now 2** (`/us`, `/us/business-listing`) → 1 after S8 → 0
  after S9.

**The ordering constraint that matters most:** S5 gates the `[country]` pages *before* any
`/us` page is deleted. Every stage from S6 on assumes it has landed. If you find yourself
gating inside a merge stage, stop — that means S5 was incomplete, and the fix belongs in
S5's commit, not the merge's.

**How to work a stage** (adapted from the `/in` plan's hard-won version):
1. **Read the `/us` page first, then its `[country]` counterpart.** The `/in` plan's rule
   was "grep for the family name before moving"; here the equivalent is "diff the two
   pages before deleting either." The delete is the last step, not the first.
2. **Grep three ways** before touching a family: `grep -rn "<name>" src/lib src/routes`,
   `grep -rn 'BASE_URL}/us' src/lib src/routes`, and
   ``grep -rn "'/us/\|\"/us/\|\`/us/" src/lib src/routes``. The quote-anchored pattern
   alone misses `` `${BASE_URL}/us/…` `` — that cost a stage in the previous plan.
3. **Grep inside the directory being deleted too**, `+page.server.ts` included. Loaders
   build hrefs.
4. **Verify by loading pages, not by reasoning.** Status matrix, hop counts, href diff
   **and text diff** (§7.5). `npm run check` holds at 13/1; the prerendered count follows
   the schedule in §7.1.
5. Tick §8, append the SHA, commit the doc.
