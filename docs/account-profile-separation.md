# Account / Profile Separation — Status & Next Steps

_Last updated: 2026-07-11_

## Why

`businesses_1` held two unrelated concerns in one row: **account data**
(login email, password hash, magic-link and reset tokens) and **profile
data** (business name, slug, contact info, description, services, brands,
location, rscore). One flat type exposed both, and `SELECT *` loaders
shipped credential columns into browser page data. main-app, admin-app, and
business-app all read/write this table, so it could not be restructured
directly without downtime.

## What was done (this phase — India, business-app only)

Two new tables; `businesses_1` untouched so main-app and admin-app keep
working with zero changes:

| Table | Holds | Who uses it |
|---|---|---|
| `in_business_profiles` | Listing data only (name, slug, contact, description, services, brands, location, rscore, …) | business-app + main-app `/in` reads + writes |
| `in_business_accounts` | Credentials only (login_email, login_password, magic-link token, reset token, isvisible, last_login) | business-app + main-app `/in` auth reads; main-app auth writes (with dual-write) |
| `businesses_1` | Everything (legacy, unchanged schema) | admin-app; business-app auth writes; main-app dual-writes (id-minting on signup) |

Both new tables are keyed by `business_id` (= `businesses_1.id`). Tables are
region-specific by design (`in_*` prefix); `/us` gets its own tables when it
migrates — IN and US will never share tables.

**Sync model (no app can go stale, no loops):**
- Two triggers on `businesses_1` mirror every profile-column and
  auth-column write into the respective new table. This covers admin-app
  edits, legacy main-app endpoints, and business-app's own auth writes.
- business-app's profile update (`updateBusinessDetails`) writes
  `in_business_profiles` first and dual-writes `businesses_1`
  (TODO-tagged) so the marketplace/admin views stay fresh.
- Auth writes (token minting, password reset, delete account, last-login)
  deliberately still hit `businesses_1` and propagate via trigger — this is
  what keeps admin-app's `createMagicLinkToken` / `triggerPasswordReset`
  compatible without touching that repo.

**Also fixed:** the credential leak — dashboard, branch, and
recent-projects loaders no longer `SELECT *`; page payloads contain no
password hashes or tokens. `BusinessProfile` (TS) no longer declares
credential fields.

**Migrations:** `apps/main-app/src/lib/server/migrations/039-business-profiles.sql`
and `040-in-business-tables.sql` — both applied to the live DB
(6,683 rows backfilled, verified zero mismatches).

**Known data issue found during migration:** slugs in `businesses_1` are
not unique — 124 rows share the slug `incorrect`, 34 are NULL, ~25 real
businesses are duplicated. The new table therefore has a plain (non-unique)
slug index. Worth a cleanup at some point.

## Done since (2026-07-11): main-app migrated (step 1)

All main-app `/in` reads now hit the new tables: marketplace/profile loaders
and the sitemap read `in_business_profiles` (explicit columns,
`business_id AS id`). Writes follow the dual-write pattern:
`createMagicLinkToken` updates `in_business_accounts` first, then a
TODO-tagged write keeps `businesses_1` fresh for admin-app (its triggers
re-upsert the same values — idempotent). `submitBusiness` still inserts
`businesses_1` first (it mints the business id) and then explicitly upserts
both new tables.

Main-app's legacy business-auth and business-data endpoints were deleted —
business-app owns these flows now (own `resetPassword`, login via
TokenManager/PasswordManager, dashboard reads): `businessLogin`,
`resetPassword`, `triggerPasswordReset`, `getBranchesByBusiness`,
`getProjectsByBusiness`, plus dead helpers `getBusinessesByCity`,
`getCitiesFromSameDistrict`, `getRecentProjectsByCity`, `submitPartner`.

Migration `041-in-business-profiles-created-at.sql` backfills
`in_business_profiles.created_at` from `businesses_1` (039 didn't copy it,
and `/in/solar/[state]` shows MAX(created_at) as "latest installer added").

## Next steps (high level, in order)

1. ~~**Migrate main-app**~~ Done — see above. Grep tag for the dual-writes:
   `TODO(remove after admin-app migrates)`.
2. **Migrate admin-app** (separate repo, `solar-app-internal`): the
   business edit page and the magic-link / password-reset endpoints move to
   the new tables. Until then the triggers bridge it.
3. **Retire the dual-write** in business-app's `updateBusinessDetails`
   (grep for `TODO(remove after main-app/admin-app migrate)`).
4. **Cleanup migration**: drop both sync triggers and drop the profile +
   credential columns from `businesses_1` (or drop the table if nothing
   else needs it). Only after steps 1–3 are deployed and soaked.
5. **Mirror for US**: create `us_business_profiles` / `us_business_accounts`
   from `us_businesses` following the same pattern, and repoint the `/us`
   code tree.
6. **Optional hygiene**: clean up duplicate/NULL slugs, then add a unique
   slug constraint; consider a proper `account_status` field to replace the
   `isvisible` overload (listing visibility vs account-active vs
   approval-pending).
