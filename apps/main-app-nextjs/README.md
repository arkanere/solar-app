# main-app-nextjs

The Next.js port of the Solar Vipani marketing and installer-directory site.
Shares `@solar/db` and `@solar/validation` with the rest of the workspace; the
SvelteKit `main-app` still serves production and the two coexist here.

The three rules the port follows, cited by number across the archetype docs:

1. Keep all the routes as they are.
2. Keep most content as it is.
3. The design system and component library are the opportunity React/Next buys us.

## Getting started

```bash
npm install
npm run dev        # http://localhost:7124
```

`.env.local` needs `BREVO_API_KEY` and `INTERNAL_API_SECRET` for the server
modules in `lib/server/`. `USER_APP_URL` is optional. Database access comes from
`@solar/db`. `NEXT_PUBLIC_POSTHOG_KEY` is optional: without it PostHog does not
load. It is a public project key, so on the host it is config, not a secret —
and it is baked in at build time, so changing it needs a redeploy.

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server on port 7124. |
| `npm run build` | Production build. Needs the database — the country routes prerender for real. |
| `npm run start` | Serve the build on port 7124. |
| `npm run check` | `tsc --noEmit`. |
| `npm run lint` | ESLint, including the two local layout rules. |
| `npm run check:contrast` | Re-verify the colour tokens after changing any value. |
| `npm run smoke` | Hit one URL of every route shape and assert its status. Targets production by default; `BASE_URL=…` points it elsewhere. |

## Stack

Next.js App Router, TypeScript strict, RSC by default — `'use client'` only at
interactive leaves. Tailwind 4 with daisyUI (`app/globals.css`),
`@tailwindcss/typography`, `lucide-react`. Free/MIT licences only. No Radix yet;
it is the plan for dialog/drawer and combobox when one is needed.

## Conventions

- Mobile-first sizing, semantic HTML.
- Spacing comes from the layout primitives in `components/layout/`, never by
  hand. Two lint rules enforce it: no `mx-auto` outside that folder, and no
  numeric Tailwind spacing anywhere.
- CSS transitions via Tailwind. No JS animation libraries.
- Structured data is a first-class requirement.
- **No dark mode at all.** `:root { color-scheme: light; }`
- Add a route and add its shape to `scripts/smoke.mjs` in the same commit.

## Two rules that break the build

**Route Segment Config must be a literal in the route file.** Write
`export const revalidate = N` in the route itself — never re-exported from a
shared module, never an imported constant. Next reads it by static analysis: a
re-export warns on every build, an imported constant fails it.

**ISR needs `generateStaticParams` too.** `revalidate` alone does nothing on a
route with a dynamic segment; without the function Next renders it `ƒ` and
re-queries the database on every request. 24 routes are in this shape and all 24
export `revalidate`. The 10 whose only dynamic segment is `[country]` return real
params from `countryParams` in `lib/countries/index.ts`. The other 14 have a
second, data-driven segment and still return `[]` — see `OPEN-ITEMS.md`.

## Layout

Every file below has a header that says more than this table does.

| Path | Holds |
| --- | --- |
| `lib/directory/data.ts` | The directory and projects seam. Every query, each with the trap it avoids above it. |
| `lib/editorial/` | The editorial seam. `routes.tsx` is both routes written once with the pillar as a parameter; `body.ts` rewrites moved body links. |
| `lib/forms/`, `lib/server/business.ts` | The lead-forms seam. `components/forms/BusinessForm.tsx` is the one client leaf, shared by all three signup pages. |
| `lib/tools/` | The calculators. `estimate.ts` holds the PM Surya Ghar slabs and the cost-per-kW ladder, so two pages quote one copy. |
| `lib/sitemap.ts` | The XML serializers. No database import; the queries stay in the data seams, slug-only. |
| `lib/countries/` | The per-country gate. Labels and features are data, never hardcoded. `moved-content.ts` lists the families that live at the root. |
| `lib/metadata.ts` | The one metadata builder. It owns the tag set; each page owns its title and description. |
| `lib/server/` | Server-only modules. |
| `lib/cloudinary-loader.ts` | The only place an image transform is written. |
| `middleware.ts` | The legacy 301s, and the only rules that keep the query string. Read `lib/redirects.ts` before adding a geo-lookup shim. |
| `components/layout/` | The layout primitives. |
| `components/chrome/` | Read `Chrome.tsx` first: it records why chrome is not in the root layout. |

## Docs

| Doc | Covers |
| --- | --- |
| `routes.md` | Every route: 47 pages + 17 handlers. |
| `design-foundation.md` | Type, spacing, colour, radius, elevation, motion, imagery. |
| `archetype.md` | Why there are four page archetypes. `archetype/data.md` has the measurements. |
| `archetype/installer-profile.md` | Archetype 1 — installer profiles. |
| `archetype/geo-listing.md` | Archetype 2 — district page and city/size leaf. |
| `archetype/geo-index.md` | Archetype 3 — country and state hubs. |
| `archetype/editorial.md` | Archetype 4 — pillars and clusters. |
| `archetype/home.md` | `/` alone. |
| `scripts/smoke.mjs` | The route shapes and the sample URL of each. |
| `OPEN-ITEMS.md` | Known holes, pending decisions, and what is blocked on empty tables. |

Reasoning lives in the spec docs and the file headers, not here. `git log` is the
record of how it got this way.

## Next steps

What is left before the domain moves here and the SvelteKit app is retired.
One step per commit, in order. Tick each off as it lands. Next session starts
at step 5.

1. **Umami.** Done. Script on every page, not gated (cookieless). Plus the `engaged`
   event (10s visible + one interaction).
2. **CallSafe.** Done. `callsafe.online/embed.js` after `load`, on every page. Umami
   events `callsafe-widget-clicked`, `callsafe-mute-clicked`, `callsafe-call-ended`.
3. **Cookie consent banner.** Done. Same `analytics_consent` localStorage key as
   SvelteKit, so a visitor's choice carries over. On every page.
4. **GA + PostHog, behind consent.** Done. Load only after Accept. PostHog also records
   a pageview on each client navigation. Hotjar, Twitter and the Meta Pixel are
   not ported.
5. **Chatbot — shell.** `ChatDock`, launcher, popup, scroll auto-open. Next
   rewrite to the FastAPI backend for local dev; `NEXT_PUBLIC_API_BASE_URL` in prod.
6. **Chatbot — messages.** `ChatBotBox`, `MessageBubble`, text chat over `/api/chatbot`.
7. **Chatbot — voice.** `/api/transcribe` and `/api/speak`.
8. **Chatbot — widgets.** The tool-result cards, and `LeadFormCard` posting to
   `/{cc}/api/submitLead`.
9. **PostHog custom events.** SvelteKit sends them from `LeadForm`, `SiteHeader`,
   `InstallerCard`, the three tools and `businessTracking.ts`. Only pageviews and
   autocapture are ported so far.
