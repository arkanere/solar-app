# Open items

Known holes and pending decisions. Named, not numbered.

## Before the domain moves

Outside this app:

- **The retention purge has no host.** A monthly Cronicle job POSTs
  `https://solarvipani.com/api/cron/purge-old-leads`, the six-month purge the
  privacy policy (§6) promises. That route belongs to admin-app
  (`solar-app-internal`) and is not here, so after cutover the job 404s silently
  until admin-app hosts it and the job is repointed.
- **Whatever posts projects to main-app today needs repointing.** SvelteKit's
  `postRecentProject` has an "Android App" JSON branch. `business-app` owns it.

Deploy config:

- `NEXT_PUBLIC_API_BASE_URL` is set on Vercel
  (`https://solar-agent-backend-489624964901.asia-south1.run.app`, no trailing
  slash), and the database works (smoke passes). `BREVO_API_KEY` is proven only
  by the lead check below. `NEXT_PUBLIC_` values are build-time: change one, redeploy.
- **The 14 data-driven `generateStaticParams` still `return []`.** Decide the
  deploy shape now: full prerender (~1,380 pages, every build waits on the
  database) or a top-N slice with the tail on on-demand ISR. The 10
  country-only routes are done.

The switch, in Vercel:

- Remove `solarvipani.com` and `www.solarvipani.com` from the SvelteKit project,
  add both here. Apex is primary and `www` redirects to it: canonicals,
  sitemaps and `robots.txt` all use the apex.

## Check in the first minutes after the switch

These cannot be tested on `*.vercel.app`: FastAPI's CORS allows only
`solarvipani.com` and `www`, and third-party widgets may be locked to the domain.

- Chat: a text reply, voice input with a real mic (Safari records `audio/mp4`),
  spoken replies, and one real lead from the chat card.
- One real lead from a district page: the row lands and Brevo sends the
  confirmation email.
- CallSafe and Umami load; PostHog custom events arrive after Accept.

## Decisions to make

- **The 2,000 added to the lead count** on `/{cc}/partners` and `/about-us`
  (`LEADS_BEFORE_LEADDATA`, `lib/stats.ts`). Nothing in the database supports it.
  Confirm or remove before launch.
- **Meta Pixel, Hotjar and Twitter are not ported.** The Meta ad account loses its
  `Lead` conversion reporting at cutover. Tell whoever runs the ads.
- **`/{cc}/partners/join/thank-you` is unreachable.** `BusinessForm` goes to
  `/{cc}/thank-you-business`, which promises something different.
- **`/{cc}/thank-you`** is reached only from the confirmation email; `LeadForm`
  confirms in place.
- **`/us/business-listing` prints an Indian phone number**, as SvelteKit does.
  No US number exists yet; it belongs on `CountryConfig` when one does.
- **`CountryConfig.name` has no article**, so `/us/solar` reads "across United
  States". A shared-type change.
- **Editorial metadata is too long** on all 117 pages (titles to 98 chars, descriptions
  to 188). A CMS pass over `seo_pages`.

## Carried over from SvelteKit

- A 21+ char phone is a 500 on `/api/submitDataDeletion`: `dataRequestSchema`
  allows 40, the column is `varchar(20)`. Fix in `@solar/validation` or a migration.
- Nothing suppresses mail to unsubscribed addresses in this app; Brevo does. The
  `unsubscribe` table has no unique index on `email`.
- `submitDataDeletion` notifies nobody; `submitDataAccess` mails admin@.
- A lead card submitted in the chat shows empty again after the popup is reopened.

## Blocked on empty tables

- `state_subsidies`: the state hub's subsidy callout is not built.
- `solar_financing_banks`: the EMI calculator's bank table appears when a row lands.
- `solar_brands`: no brand variant of the leaf route.
- `solar_products`: the three `/{pillar}/{brand}/{model}` routes are not built.
- `authors`: `/authors/{slug}` is not built; the gate opens when a row lands.
- `rscore` is 0 on all 643 rows, so the installer sort uses its tiebreakers.
