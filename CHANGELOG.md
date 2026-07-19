# Changelog

Notable changes to Solar Vipani. The platform has been live and continuously deployed since September 2024; this changelog starts with the first tagged release, which snapshots the production system at that point. Format follows [Keep a Changelog](https://keepachangelog.com/), versions follow [SemVer](https://semver.org/).

## [2.0.0] — 2026-07-19

Simplified the architecture and pruned features that carried no competitive advantage.

### Changed
- One country-scalable core replaces the per-country forks: unified `leads`/`businesses`/`business_accounts` tables with a `country_code` column, a single `/[country]` route tree, and a per-country config layer. All four apps (marketplace, installer portal, customer portal, admin) read and write the same data layer; the transitional sync triggers are gone.
- US URLs moved to the unified `/us/solar/{state}/{county}/{city}` and `/us/installer/{slug}` scheme; every legacy US URL 301s in one hop. India URLs unchanged.
- Adding a new country is now configuration, not a fork.

### Removed
- Blogs (public pages, admin blog management, and the underlying tables — content archived)
- Home-page installer directory dropdowns

## [1.0.0] — 2026-07-06

First tagged release. Solar Vipani in production: marketplace, installer portal, and customer portal for India and the US.

### Marketplace (`main-app`)
- Get-quotes lead flow with downloadable sample solar quotations
- RAG chatbot ("solar advisor") grounded in site content: streaming responses, multi-turn memory with query condensation, relevance-threshold retrieval, deterministic source citations, guided-flow handoff for quote intent
- Embedding pipeline: sitemap-driven index sync + city-page embedding into Pinecone
- Programmatic SEO: state/district/city installer pages, content shipped via versioned SQL migrations, per-region sitemaps
- Region routing for India (`/in`) and the US (`/us`)

### Installer portal (`business-app`)
- Business listings, lead management, proposals, and client communication
- Quotation maker (IN and US)
- US portal at feature parity with IN

### Customer portal (`user-app`)
- Magic-link sign-in, quote tracking, feedback

### Security & compliance
- Passwordless auth: magic-link tokens hashed at rest with expiry; minting endpoints gated behind a timing-safe internal secret
- HMAC-signed session cookies across portals
- PII compliance: consent capture, DSAR routes (data access / deletion), private bill storage, automated 6-month retention purge for unclaimed leads
- Platform-wide security headers (HSTS, frame denial, nosniff)

[2.0.0]: https://github.com/arkanere/solar-app/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/arkanere/solar-app/releases/tag/v1.0.0
