# Solar Vipani

**A live, production solar marketplace connecting homeowners and businesses with verified solar installers in India and the United States.**

🌐 **Live at [solarvipani.com](https://solarvipani.com)** · Built and operated by a solo developer · Open source (MIT)

[![Solar Vipani homepage](.github/assets/solarvipani-home.jpg)](https://solarvipani.com)

## What it does

Switching to solar is a high-stakes, low-trust purchase. Solar Vipani removes the friction: homeowners and businesses request quotes and compare proposals from verified installers in one place, while installers get a dedicated portal to manage leads, send proposals, and grow their customer base. The platform is independent — no affiliation with any installer or manufacturer.

- **Customers** — browse verified installers, get 2–3 free quotes, track installation from inquiry to completion
- **Installers** — business listings, lead management, proposals, and client communication in one portal
- **Regions** — India and the US, served from a single codebase

## Engineering highlights

This is an operated production system, not a demo. Some of the more interesting problems solved here:

- **RAG-powered solar advisor** — a chatbot that answers sizing, subsidy, and pricing questions over a Pinecone vector index. Follow-up questions ("and for a shop?") are rewritten into standalone queries with a condenser model before retrieval, and quote-intent messages hand off into a guided lead flow. Embedding sync and city-page embedding pipelines keep the index current with site content.
- **PII compliance built in** — consent capture, DSAR endpoints (data access and deletion), private bill storage, and a scheduled retention purge (Vercel cron) that deletes stale leads automatically.
- **Programmatic SEO at scale** — city/district/installer pages generated from Postgres with slug resolution, per-region sitemaps, and content shipped through versioned SQL migrations.
- **Passwordless auth** — magic-link sign-in for both customer and installer portals; tokens are stored hashed at rest with last-write-wins invalidation, and token-minting endpoints are guarded by a timing-safe internal-secret check so they can't be hit anonymously.
- **Multi-region monorepo** — one npm-workspaces repo serving the India marketplace, US marketplace, installer portal, and customer portal as separate SvelteKit deployments.

## Stack

SvelteKit (Svelte 5 runes) · TypeScript · PostgreSQL (Vercel Postgres) · Pinecone + LangChain + OpenAI · Cloudinary · SendGrid · PostHog · Vercel

## Apps

| App | Purpose |
|-----|---------|
| `main-app` | Customer-facing marketplace (India + US) — [solarvipani.com](https://solarvipani.com) |
| `business-app` | Installer portal |
| `user-app` | Customer account portal |

## Development

```bash
npm install

npm run dev:main      # marketplace (port 5173)
npm run dev:business  # installer portal
npm run dev:user      # customer portal
```

## Open source

Solar Vipani's codebase is open source because transparency builds trust — you can read, audit, and understand exactly how the platform works. Contributions and feedback are welcome. See [ARCHITECTURE.md](ARCHITECTURE.md) for how the system fits together.

For press inquiries or data requests, reach out via the contact page on [solarvipani.com](https://solarvipani.com).

## License

MIT
