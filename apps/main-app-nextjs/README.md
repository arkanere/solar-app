# README

The Next.js port of the marketing/directory site. In `solar-app/apps/main-app-nextjs`,
sharing `@solar/db` and `@solar/validation`. SvelteKit and Next coexist in the workspace.

1. Keep all the routes as it is!
2. Keep most content as it is!
3. Design system, component library is the major opportunity that we want to exploit with React/Nextjs ecosystem.

## Principles

- Mobile-first sizing, semantic HTML.
- Spacing comes from the layout primitives, never by hand.
- CSS transitions via Tailwind. No JS animation libraries.
- Structured data is a first-class requirement, not an afterthought.
- **No dark mode at all.** `:root { color-scheme: light; }`

## Stack

- Next.js App Router + TypeScript strict. RSC is the default — server components
  everywhere, `'use client'` only at interactive leaves.
- Tailwind 4, with daisyUI as a plugin (`app/globals.css`).
- `@tailwindcss/typography` (prose), `lucide-react` icons.
- Free / MIT only. No paid libraries.
- No Radix yet. It is the plan for dialog/drawer and combobox, when one is needed.

## State

Reasoning lives in the doc or the file header, never here; `git log` is the record.

**Built:** the directory surface, the editorial surface, the four static pages, the
projects surface, the homepage, the tools, the legacy redirects, the lead forms and
the two compliance pages — 1,412 of the 1,413 advertised URLs. 40 of 47 page files;
the other 7 are stubs. 3 of the 16 route handlers answer 501, and all three are
sitemaps. (`/{cc}/district/{district_slug}` stopped being a page when it shipped: it
always redirected, so it is a route handler now.)

**Three routes are deliberately not ported**, which is why the handler count fell
from 19 to 16. `postRecentProject` and `updateRecentProject` are duplicates —
`business-app` already owns both, and a project is posted from there, not from the
marketing site. `/api/cron/purge-old-leads` belongs to admin-app, which is
live but in a different repo — `solar-app-internal`, at
`~/Developer/solar/solar-app-internal` (**not** the `~/Developer/svelte/…` path
`next-steps.md` still records). Decided 2026-09-21; the work is queued there, in
`admin-app-nextjs/spec/README.md` under **What is left**.

Two consequences worth holding. This app never needs the Cloudinary **admin** SDK
— delivery URLs are built by `lib/cloudinary-loader.ts` and need no credentials.
And the six-month retention purge that `privacy-policy` §6 promises is served by
SvelteKit main-app only: its caller is a monthly Cronicle job that POSTs
`https://solarvipani.com/api/cron/purge-old-leads`, so **cutover 404s that job
silently** until admin-app hosts it.

**Cutover is blocked on two repointings, neither of them code here:** that purge
job, and whatever posts projects to main-app today — SvelteKit's
`postRecentProject` has a JSON branch marked "Android App".

## Where things are

| Doc | Covers |
| --- | --- |
| `routes.md` | Every route: 48 pages + 16 handlers. |
| `design-foundation.md` | Type, spacing, colour, radius, elevation, motion, imagery. Approve at `/specimen`; re-verify with `npm run check:contrast`. |
| `archetype.md` | Why there are four archetypes. `archetype/data.md` has the live measurements they are designed against. |
| `archetype/geo-listing.md` | Archetype 2 — district page and city/size leaf, 957 pages. |
| `archetype/installer-profile.md` | Archetype 1 — 649 pages, the largest. |
| `archetype/geo-index.md` | Archetype 3 — country and state hubs, 29 pages. §9 and §10 record what it decided and where it shipped differently from spec. |
| `archetype/editorial.md` | Archetype 4 — the 7 pillar landings and 110 cluster articles, 117 pages. Its own §2 holds the `seo_pages` measurements; `data.md` does not cover that table. §11 is what shipped. |
| `archetype/home.md` | Not an archetype — one page, `/`. §1 says why it gets a spec anyway: it is the only long-tail page whose source design contradicts the design system. §12 is what shipped. |

Approve the page designs at `/specimen/archetypes` (dev only).

Code worth knowing before editing:

- `lib/directory/data.ts` — the single data seam for the directory and projects
  surfaces. Every query lives here, each with the trap it avoids written above it
  (casing, correlated subqueries, composite keys).
- `components/layout/` — the layout primitives, and the two lint rules they unblocked:
  no `mx-auto` outside that folder, no numeric Tailwind spacing anywhere.
  `PageShell`'s `hero` slot is the one full-bleed exception, and `/` is its only
  caller — read the comment there before adding a second.
- `lib/countries/` — the per-country gate. Labels and features are data, never
  hardcoded. `moved-content.ts` is the list of families that live at the root.
- `lib/cloudinary-loader.ts` — the only place an image transform is written.
- `lib/server/` — the server-only modules: `db`, `leads`, `email` (Brevo),
  `magicLink` (mints customer sign-in tokens, IN-only), `leadConfirmation` (the email
  body, shared by `submitLead` and its own route). Needs `BREVO_API_KEY` and
  `INTERNAL_API_SECRET` in `.env.local`; `USER_APP_URL` is optional and defaults to
  production.
- `middleware.ts` — the legacy 301s, ported from SvelteKit's `hooks.server.ts`. They
  run before routing, which is why they are the rules that keep the query string. The
  four shims that need a geo lookup are route handlers instead and do not — read
  `lib/redirects.ts` before adding a fifth.
- `components/chrome/` — `SiteHeader`, `SiteFooter` and `Chrome`. Read Chrome.tsx first:
  it records why chrome is not in the root layout. `NavMenu` is the only client leaf.
- `lib/editorial/` — the editorial surface's seam. `data.ts` is the three queries,
  `routes.tsx` is both routes written once with the pillar as a parameter, and
  `body.ts` rewrites the 885 body links that point at a family which has since moved
  to the root. `components/editorial/ArticleBody.tsx` holds the table treatment, which
  is the design problem of that archetype.
- `lib/directory/projectRoutes.tsx` — the two project-list routes written once, the
  gallery and its pager. `components/directory/Pager.tsx` is the only pagination in
  the app.
- `lib/tools/` — the calculators' seam. `data.ts` is the three queries (the IN district
  tree, the visible-installer count, the financing banks), `estimate.ts` is the
  arithmetic — the PM Surya Ghar slabs and the cost-per-kW ladder live there because
  two of the three pages quote them and two copies of a published money figure drift.
  `components/tools/` is the shared furniture: `Panel`, `StatTile`, `BreakdownRow` and
  the two controls. The controls are native `<input type="range">` and `<select>`, not
  Radix — `Field.tsx` records why.
- `lib/forms/` — the lead-forms surface's seam. `data.ts` is the geo lookups the two
  cascading selects fetch, the get-quotes counts, the partner-district figures and the
  `/{cc}/thank-you` receipt; `businessValidation.ts` is the client-side field rules.
  `lib/server/business.ts` is the two-row write a signup is (profile + account, and
  the placeholder-then-UPDATE that 075 forces), `businessConfirmation.ts` the email.
  `components/forms/BusinessForm.tsx` is the one client leaf, shared by all three
  signup pages.
- `lib/server/dataRequests.ts` — the two DPDP compliance writes, access and deletion.
  One module because they are one shape; the endpoints stay two because the URLs are
  two. Neither request is fulfilled in code — a row is a work item the team acts on by
  hand, and nothing reads either table back. `components/forms/DataRequestForm.tsx` is
  the client leaf both pages render; the long copy around it stays in the two server
  components. Its header records why there is no client-side validation module.
- `lib/metadata.ts` — the one metadata builder. It owns the tag set; each page owns its
  own title and description. Built pages call it; the stubs fall back to the root
  layout, which is also where `metadataBase` lives.

**Route Segment Config must be a literal in the route file.** `export const
revalidate = N`, never re-exported from a shared module and never an imported
constant: Next reads it by static analysis, so a re-export warns on every build and an
imported constant fails the build. `lib/editorial/routes.tsx` has the measurements.

**ISR needs `generateStaticParams` too.** `revalidate` alone does nothing on a route
with a dynamic segment — without the function Next renders it `ƒ` and re-queries the
database on every request. It returns `[]` in all 15 built dynamic routes: Next's
"all paths at runtime", so nothing is prerendered, the build stays database-free, and
each path caches on first visit. Returning real params instead is what couples a
~1,380-page build to the database. Two consequences: 404s cache with the same
`s-maxage` and the key space is unbounded (parity with SvelteKit's `config.isr`, worth
a rate limit if abused); and under Next 16's Cache Components an empty return is a
build error, so that upgrade reworks all 15 files.

## Next steps

Five left, in order. Re-plan after the last one lands. Every one of them lands in
this app — the Meta Pixel and the two cutover repointings are launch blockers but
not this list's work; they stay under **Open items** and **State**.

> ~~**The lead forms.**~~ **Done 2026-09-21.** The seven pages and the four
> handlers shipped; `lib/forms/` is the seam and `components/forms/BusinessForm.tsx`
> the one client leaf. Its prerequisite, phone length, shipped with it. What the step
> did NOT carry across is the Meta Pixel — see the open item below.

> ~~**The remaining handlers.**~~ **Done 2026-09-21.** `/data-access` and
> `/data-deletion` are real pages now — the step's note that they were already built
> was wrong, they were 7-line stubs — and `submitDataAccess`, `submitDataDeletion`
> and `/api/stories` answer. The step shrank as it ran: `postRecentProject`,
> `updateRecentProject` and `purge-old-leads` are not this app's, so they were
> deleted rather than ported (see **State**). `internalAuth.ts` therefore has no new
> caller, and no cron schedule needed deciding.

> ~~**Metadata on every built page.**~~ **Done, and never tracked as a step.** The
> old step 1 paired this with the sitemaps; it was already true when it was written.
> All 40 built pages carry a title and description through `lib/metadata.ts` — 26
> call it directly, the other 14 through `lib/editorial/routes.tsx` and
> `lib/directory/projectRoutes.tsx`. The only pages falling back to the root layout
> are the 7 stubs, which get theirs when they are built. Nothing to do; the sitemaps
> stand alone as step 1.

1. **The 3 sitemap handlers.** `/sitemap.xml`, `/content-sitemap.xml` and
   `/{cc}/sitemap.xml` are the last three 501s in the app, and building them closes
   **robots.txt points at a 501**. They are the one place that needs the full URL list
   rather than a page of it, so they query `lib/directory/data.ts` and
   `lib/editorial/data.ts` for slugs only — not the page queries, which select far more
   than a sitemap needs. Decide the `revalidate` per file, not once: the country
   sitemap changes when an installer lands, the content sitemap when the CMS publishes.
   The 117 editorial pages are in `/content-sitemap.xml`; **editorial metadata is too
   long** stays a CMS pass and is not in scope here.

2. **The three stubs that no empty table blocks.** `/{cc}/unsubscribe`,
   `/{cc}/partners` and `/{cc}/business-listing` are 9-line stubs for no reason but
   ordering — unlike the other four, which wait on `authors` and `solar_products`.
   `/{cc}/unsubscribe` goes first and is the only one with a real consequence: this app
   sends lead and signup mail through `lib/server/email.ts`, and an opt-out link that
   404s after cutover is the kind of thing that costs a sending domain. Port each from
   its SvelteKit page, metadata included.

3. **A smoke harness.** One URL of each of the 76 route shapes, asserting 200, plus
   `x-nextjs-cache` on the 15 ISR shapes — Next sets it to `HIT`/`STALE`/`MISS`/
   `REVALIDATED`, so the assertion that keeps ISR from silently regressing is a header
   check, not a timing heuristic. `NEXT_PRIVATE_DEBUG_CACHE=1` logs hits and misses.
   Add a shape in the same commit that adds a route. Sequenced after 1 and 2 so it is
   written once, against the full 76, rather than amended twice.

4. **Prove the data-blocked gates open.** Five of the seven entries under **Blocked
   on data, not code** are a belief, not a test: `state_subsidies`,
   `solar_financing_banks`, `solar_brands`, `solar_products` and `authors` are empty,
   so the branch each one feeds has never run. Seed one row per table into a local
   fixture, walk the gate, and record the result per entry — a gate that does not open is
   a bug found now rather than on the day the business lands its first row. This is a
   verification pass, not a feature: no gate gets rewritten unless it is broken, and
   the fixture is dev-only and never shipped.

5. **Next 16 readiness.** Two known breaks, both recorded above and neither urgent
   until the upgrade. Under Cache Components an empty `generateStaticParams` return is
   a build error, so all 15 dynamic routes need reworking together. And the same empty
   return leaves the ISR key space unbounded, which is parity with SvelteKit today but
   still worth a rate limit before a public cutover. Do them in one pass: they are the
   same 15 files.

Not in these five, and deliberately: the Meta Pixel and the two cutover repointings
(not this app's code), the two unreachable thank-you pages and the lead count (content
and business decisions), and **editorial metadata is too long** (a CMS pass). The lead
count is a one-line fix in `lib/stats.ts` either way — ask before launch, not at the
end.

## Open items

Named, not numbered. The numbers used to drift every time an item closed, and some
file headers still cite "README open item N" against a numbering that no longer
exists — treat any such number as a hint, not an address.

- **The Meta Pixel is not ported.** The SvelteKit `business-form`, `partners/join`,
  `thank-you` and `thank-you-business` heads each inject `fbq` inline — a `PageView`
  on the two forms and a **`Lead` conversion** on the two confirmations. None came
  across: a third-party tracker belongs behind a consent decision and a
  `next/script` strategy, and neither has been made. **The ad account's conversion
  reporting is blind on this app until it lands**, which makes it a launch blocker
  rather than a nicety.
- **Two confirmation pages, one reachable.** `BusinessForm` sends every successful
  signup to `/{cc}/thank-you-business`, from all three pages that render it — so
  `/{cc}/partners/join/thank-you` is built, advertised and routed to by nothing. It
  also promises something different (48 hours, vs a call). Carried across as the
  SvelteKit form has it. Which one a partner signup should land on is a content
  decision.
- **`/{cc}/thank-you` is not routed to from this app either.** `LeadForm` confirms in
  place rather than redirecting — its header says why, and the reasoning still holds
  now the page is real. The page is reached from the confirmation email's link. Worth
  deciding deliberately rather than by default.
- **main-app's own phone rule is still the old one.** Closing the phone-length item
  narrowed `@solar/validation`'s `phone` primitive to 16 characters total, which fixes
  the Next app because it validates with `parseBody`. main-app live calls
  `inspectBody` on the same schema — log-only — so its real guard is its own copy in
  `src/lib/constants/formValidation.ts`, which still reads `/^\+?\d{10,16}$/`. A
  17-character phone is therefore still a 500 there. Not touched: it is live SvelteKit
  and outside the port. One regex, whenever that app is next opened.
- **The deletion table is narrower than the schema that writes to it.**
  `dataRequestSchema` allows a 40-character phone and puts no ceiling on an email,
  but `data_deletion_requests` types them `varchar(20)` and `varchar(255)` —
  so a 21-character phone is a database error and a 500 on `/api/submitDataDeletion`.
  `data_access_requests` types both `text` and is unaffected. Live SvelteKit has the
  same hole. Not fixed in the port: the ceiling belongs to `@solar/validation`, which
  main-app and business-app also validate against, so narrowing it is a change to live
  behaviour. One line in `primitives.ts` or one migration, whichever the data says.
- **Nothing tells the team a deletion request landed.** `submitDataAccess` mails
  admin@solarvipani.com a copy of its acknowledgement, so the access queue is visible
  in a mailbox. `submitDataDeletion` sends no mail at all — carried across as
  SvelteKit has it — so the erasure queue exists only as rows in
  `data_deletion_requests`, which nothing in any app reads back. Worth closing when
  someone owns that queue.
- **`robots.txt` points at a 501.** `/sitemap.xml` is still a stub; next step 2 builds
  it. The declaration is correct for where the file is going, not for today.
- **The installer specimen is out of date.** `/specimen/archetypes/installer` still
  hides the boilerplate About; the shipped page renders it.
- **`/about-us` adds 2,000 to the lead count it prints.** `lib/stats.ts` carries the
  `+ 2000` from the SvelteKit loader across verbatim, named `LEADS_BEFORE_LEADDATA`.
  Nothing in the database supports it, so "3,269+ Leads Generated" is 1,269 real rows
  plus a number no one here can source. Either the business confirms it or it comes out.
- **Editorial metadata is too long.** `meta_title` runs to 98 characters against
  Google's ~60, `meta_description` to 188 against ~155 — on all 117 pillar and cluster
  pages. Content, not code: `lib/metadata.ts` passes both through unaltered and should
  keep doing so. The fix is a CMS pass over `seo_pages`. `archetype/editorial.md` §2.

### Blocked on data, not code

All verified 2026-09-21.

- **`state_subsidies` is empty** in every status, so the state hub's subsidy callout is
  not built — the gate can never open.
- **`solar_financing_banks` is empty**, so `/tools/emi-calculator`'s bank comparison
  never renders. The calculator itself is unaffected — it is arithmetic on the sliders —
  and the table is built and waiting, so the section appears the day a row lands.
- **`solar_brands` is empty**, so the leaf route has no brand variant.
- **`solar_products` is empty**, so the three product model routes
  (`/{pillar}/{brand}/{model}`) are not built.
- **`authors` is empty**, so `/authors/{slug}` is not built. `features.authors` is on
  for IN and the route is in `MOVED_TO_ROOT`, so the gate opens the moment a row lands.
- **`rscore` is 0 on all 643 rows**, so the installer sort falls back to its tiebreakers.
- **`CountryConfig.name` has no article**, so `/us/solar`'s `h1` reads "Solar installers
  across United States". Wants a field on the config, which is a shared-type change.
