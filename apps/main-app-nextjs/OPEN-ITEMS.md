# Open items

Known holes and pending decisions — not a work queue. Named, not numbered; a file
header citing "open item N" is a stale hint, not an address.

## Cutover blockers

Neither is code in this app.

- **The retention purge has no host.** A monthly Cronicle job POSTs
  `https://solarvipani.com/api/cron/purge-old-leads` — the six-month purge
  `privacy-policy` §6 promises. That route belongs to admin-app
  (`~/Developer/solar/solar-app-internal`) and is not ported here, so **cutover
  404s the job silently** until admin-app hosts it and the job is repointed.
- **Whatever posts projects to main-app today** needs repointing. SvelteKit's
  `postRecentProject` has a JSON branch marked "Android App". `postRecentProject`
  and `updateRecentProject` are not ported because `business-app` owns both.

## Product and content decisions

- **The Meta Pixel is not ported** — a `PageView` on the two forms and on
  `/{cc}/partners` and `/{cc}/business-listing`, and a **`Lead` conversion** on the
  two confirmations. Decided: it stays out, with Hotjar and Twitter (README, Next
  steps). No longer a launch blocker, but **the ad account's conversion reporting
  is blind after cutover** — say so to whoever runs Meta ads. The "See How It
  Works" video on those two pages points at `youtube-nocookie.com` for the same
  reason.
- **Two confirmation pages, one reachable.** `BusinessForm` sends every signup to
  `/{cc}/thank-you-business`, so `/{cc}/partners/join/thank-you` is routed to by
  nothing and promises something different (48 hours vs a call). A content decision.
- **`/{cc}/thank-you` is not routed to from this app either.** `LeadForm` confirms in
  place; the page is reached from the confirmation email. Worth deciding deliberately.
- **`/us/business-listing` prints an Indian phone number.** `+91 8983066701` in the
  contact card and in the page's `Organization` markup, carried across verbatim from
  the SvelteKit US page, which had the same. There is no US number to put there. It
  belongs on `CountryConfig` the day one exists — a shared-type change, like
  `CountryConfig.name` below.
- **`/{cc}/partners` and `/about-us` both add 2,000 to the lead count they print.**
  `LEADS_BEFORE_LEADDATA` in `lib/stats.ts`, carried across verbatim. Nothing in the
  database supports it. Either the business confirms it or it comes out — one line
  either way, and it now moves two pages. Ask before launch.
- **Editorial metadata is too long.** `meta_title` to 98 chars against Google's ~60,
  `meta_description` to 188 against ~155, on all 117 pages. A CMS pass over
  `seo_pages`; `lib/metadata.ts` should keep passing both through unaltered.
- **The deletion table is narrower than the schema that writes to it.**
  `dataRequestSchema` allows a 40-char phone; `data_deletion_requests` types it
  `varchar(20)`, so a 21-char phone is a 500 on `/api/submitDataDeletion`. Live
  SvelteKit has the same hole. The ceiling belongs to `@solar/validation`, which two
  other apps validate against — one line in `primitives.ts` or one migration.
- **Nothing suppresses mail to an unsubscribed address.** `/unsubscribe` records the
  row and no sender in this app reads `unsubscribe` back; the suppression happens in
  Brevo. Live SvelteKit is identical, so this is carried across rather than
  introduced — but the table is a record of intent, not an enforcement point. The
  same table also has no unique index on `email`, so its check-then-insert can
  duplicate under two simultaneous clicks; harmless, since the list is consumed as a
  set, and the right fix is one migration.

- **Nothing tells the team a deletion request landed.** `submitDataAccess` mails a
  copy to admin@solarvipani.com; `submitDataDeletion` sends nothing, so the erasure
  queue is rows no app reads back. Close it when someone owns that queue.
- **main-app's own phone rule is still the old one.** Its real guard is its own copy
  in `src/lib/constants/formValidation.ts` (`/^\+?\d{10,16}$/`), so a 17-character
  phone is still a 500 there. Live SvelteKit, outside the port — one regex, whenever
  that app is next opened.
- **The 14 data-driven `generateStaticParams` still `return []`, deferred to
  migration.** Real params is what prerenders ~1,380 pages and makes every deploy wait
  on the database; an empty return is a Next 16 Cache Components build error and leaves
  the ISR key space unbounded. The deploy shape — full prerender, or a top-N slice with
  the tail on on-demand ISR — is decided at migration time, not before. The 10
  country-only routes are already done (`countryParams`, `lib/countries/index.ts`).

## Blocked on data, not code

Each is an empty table, not a missing branch.

- **`state_subsidies`** — the state hub's subsidy callout is not built.
- **`solar_financing_banks`** — `/tools/emi-calculator`'s bank table is built and
  waiting; the section appears the day a row lands. The calculator is unaffected.
- **`solar_brands`** — the leaf route has no brand variant.
- **`solar_products`** — the three `/{pillar}/{brand}/{model}` routes are not built.
- **`authors`** — `/authors/{slug}` is not built, but `features.authors` is on for IN
  and the route is in `MOVED_TO_ROOT`, so the gate opens the moment a row lands.
- **`rscore` is 0 on all 643 rows**, so the installer sort falls back to its tiebreakers.
- **`CountryConfig.name` has no article**, so `/us/solar`'s `h1` reads "Solar
  installers across United States". Wants a field on the config — a shared-type change.
