# main-app-nextjs

The Next.js port of the Solar Vipani site. It replaces the SvelteKit `main-app`,
which serves production until the domain moves here. It shares `@solar/db` and
`@solar/validation` with the rest of the workspace.

The port's three rules, cited by number in the archetype docs:

1. Keep all the routes as they are.
2. Keep most content as it is.
3. The design system and component library are the opportunity React/Next buys us.

## Getting started

```bash
npm install
npm run dev        # http://localhost:7124
```

`.env.local`:

| Variable | |
| --- | --- |
| `BREVO_API_KEY`, `INTERNAL_API_SECRET` | Required by `lib/server/`. |
| `USER_APP_URL` | Optional. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional; without it PostHog does not load. Baked in at build time. |
| `NEXT_PUBLIC_API_BASE_URL` | The FastAPI origin for the chatbot. Empty locally: dev forwards `/api/chatbot`, `/api/transcribe`, `/api/speak` to `localhost:8000`. Baked in at build time. |

| Script | Does |
| --- | --- |
| `npm run dev` / `start` | Dev server / built app, port 7124. |
| `npm run build` | Production build. Needs the database. |
| `npm run check` | `tsc --noEmit`. |
| `npm run lint` | ESLint, including the layout rules. |
| `npm run check:contrast` | Re-verify the colour tokens after changing one. |
| `npm run smoke` | One URL per route shape. Production by default; `BASE_URL=…` elsewhere. Too parallel for a dev server. |

## Stack and conventions

Next.js App Router, TypeScript strict, RSC by default, `'use client'` only at
interactive leaves. Tailwind 4 + daisyUI (`app/globals.css`),
`@tailwindcss/typography`, `lucide-react`. No Radix: the chat popup is a native
`<dialog>`. Free/MIT licences only.

- Spacing comes from `components/layout/`. Lint bans `mx-auto` outside it and
  numeric Tailwind spacing everywhere.
- CSS transitions only, no JS animation libraries. No dark mode.
- Structured data is a first-class requirement.
- A new route adds its shape to `scripts/smoke.mjs` in the same commit.
- Prettier is not the repo root's config (tabs). This app is 2 spaces, single
  quotes, width 100, no trailing commas.

**Route Segment Config must be a literal in the route file.** `export const
revalidate = N` in the route itself, never imported or re-exported.

**ISR needs `generateStaticParams` too.** Without it, `revalidate` on a dynamic
route does nothing and every request hits the database.

## Layout

Every file has a header that says more than this table.

| Path | Holds |
| --- | --- |
| `lib/directory/data.ts` | Directory and projects queries. |
| `lib/editorial/` | Pillar and cluster routes, written once. |
| `lib/forms/`, `lib/server/` | Lead and business forms; server-only modules. |
| `lib/tools/` | The calculators' shared maths. |
| `lib/countries/` | The per-country gate. Labels and features are data. |
| `lib/metadata.ts`, `lib/sitemap.ts` | The one metadata builder; the XML sitemaps. |
| `lib/analytics.ts`, `lib/track.ts` | GA and PostHog behind consent; `trackAttrs` for clicks on server-rendered links. |
| `lib/chat/`, `components/chat/` | The chatbot. `ChatDock.tsx` is the entry point. |
| `middleware.ts` | The legacy 301s. |
| `components/chrome/` | Read `Chrome.tsx` first. |

## Docs

| Doc | Covers |
| --- | --- |
| `OPEN-ITEMS.md` | What blocks cutover, pending decisions, empty tables. |
| `routes.md` | Every route. |
| `design-foundation.md` | Type, spacing, colour, radius, elevation, motion. |
| `archetype.md`, `archetype/` | The four page archetypes and `/`. |
