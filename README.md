# Solar App

A multi-region solar installer marketplace connecting homeowners with solar installation businesses.

## What it is

- Homeowners can discover and request quotes from verified solar installers
- Installers manage leads, proposals, and client communication via a business portal
- Operates across India, US, UK, and Australia with region-specific apps

## Stack

- **Framework:** SvelteKit (Svelte 5 runes on main apps; Svelte 4 on region apps)
- **Database:** PostgreSQL via Vercel Postgres
- **Deployment:** Vercel (main-app, us-app, au-app use Vercel microfrontends)
- **Monorepo:** npm workspaces

## Apps

| App | Purpose |
|-----|---------|
| `main-app` | India-region customer-facing marketplace |
| `in-app` | India standalone app |
| `us-app` | US marketplace |
| `uk-app` | UK marketplace (SvelteKit) |
| `uk-app-nextjs` | UK marketplace (Next.js) |
| `au-app` | Australia marketplace |
| `business-app` | Installer portal (all regions) |
| `user-app` | Customer account portal |
| `admin-app` | Internal admin panel |

## Development

```bash
npm install

# Run a specific app
npm run dev:main      # main-app (port 5173)
npm run dev:business  # business portal
npm run dev:in        # India app
npm run dev:us        # US app
npm run dev:uk        # UK app
npm run dev:au        # AU app
npm run dev:user      # user portal
npm run dev:admin     # admin panel

# Microfrontends local dev (main + us + au)
npm run proxy         # in main-app, proxies on port 7123
```

## License

MIT
