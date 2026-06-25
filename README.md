# Solar Vipani

Solar Vipani is an open marketplace connecting homeowners and businesses with verified solar installers across India and the United States.

We believe switching to solar should be simple, transparent, and trustworthy. Whether you are a homeowner looking to reduce your electricity bill, a business exploring rooftop solar, or an installer looking to grow your customer base — Solar Vipani is built for you.

## For Homeowners & Businesses

- Browse verified solar installers in your area
- Request quotes and compare proposals in one place
- Track your installation from inquiry to completion through your account portal

## For Solar Installers

- List your business and reach customers actively looking for solar
- Manage leads, send proposals, and communicate with clients through a dedicated business portal
- Available across India and the US

## Open Source

Solar Vipani's codebase is open source. We believe transparency builds trust — you can read, audit, and understand exactly how the platform works. Contributions and feedback from the community are welcome.

## For Journalists & Researchers

Solar Vipani is an independent platform with no affiliation to any installer or manufacturer. Our goal is to make solar adoption easier by removing friction from the discovery and quoting process. For press inquiries or data requests, please reach out via the contact page on solarvipani.com.

---

## Technical Details

### Stack

- **Framework:** SvelteKit (Svelte 5 runes on main apps; Svelte 4 on region apps)
- **Database:** PostgreSQL via Vercel Postgres
- **Deployment:** Vercel
- **Monorepo:** npm workspaces

### Apps

| App | Purpose |
|-----|---------|
| `main-app` | India-region customer-facing marketplace |
| `in-app` | India standalone app |
| `us-app` | US marketplace |
| `business-app` | Installer portal (all regions) |
| `user-app` | Customer account portal |

### Development

```bash
npm install

# Run a specific app
npm run dev:main      # main-app (port 5173)
npm run dev:business  # business portal
npm run dev:in        # India app
npm run dev:us        # US app
npm run dev:user      # user portal
```

## License

MIT
