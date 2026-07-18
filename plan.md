# Monorepo Dependency & user-app Parity Plan

> Status: in progress. This document is the source of truth for the work. Update the
> checkboxes as steps complete.

## 1. Context & goal

The repo is an npm-workspaces monorepo (`apps/*`) with three SvelteKit apps that each
deploy independently on Vercel:

- **main-app** — richest app: Svelte 5, Tailwind v4, TypeScript, AI/RAG (langchain,
  pinecone, openai), Vercel Microfrontends. Declares its own deps.
- **business-app** (`solarvipani-business`) — Svelte 5, Tailwind v4, TypeScript. Declares
  its own deps.
- **user-app** — built in haste. Declares **zero** dependencies, so it silently inherits
  **Svelte 4.2.20** from the root `package.json` (a phantom dependency). Plain-CSS
  components, `jsconfig.json` (JS, not TS).

Goal: bring user-app up to the main-app baseline (Svelte 5 + TypeScript + self-describing
`package.json`), and clean up the monorepo so dependency ownership is correct and each app
is self-describing.

## 2. Architecture decision (root vs app-local)

**Rule adopted:** if a dependency ends up in a specific app's deployed bundle, it belongs
in that app's `package.json`. The root holds only repo-wide orchestration + lint/format
tooling.

- **Root keeps:** `workspaces`, `packageManager`, `dev:*`/`build`/`lint` orchestration
  scripts, and repo-wide dev tooling where version skew is harmless:
  `eslint`, `@eslint/js`, `eslint-plugin-svelte`, `globals`, `prettier`,
  `prettier-plugin-svelte`. Also the shared `tsconfig.base.json`.
- **Root loses:** all framework runtime/toolchain deps (`svelte`, `@sveltejs/kit`,
  `@sveltejs/adapter-*`, `vite`, `@sveltejs/vite-plugin-svelte`, `svelte-check`,
  `typescript`, `svelte-cloudinary`, `tailwindcss`) and all app-specific libraries — these
  move down into the app(s) that import them.

Rationale (solo dev): version independence (upgrade one app without dragging the others),
reproducible independent Vercel deploys, and readability (one `package.json` = one app's
real stack). The current root pinning Svelte 4 is exactly what stranded user-app.

**Package manager:** stay on npm workspaces for now; document a pnpm migration path for
later (pnpm's non-hoisted `node_modules` would have made the phantom-dependency bug a hard
install-time error instead of a silent wrong-version).

## 3. Verified dependency ownership map

Import scan across `apps/**` (excluding node_modules):

| Root dep | Actually imported by | Action |
|---|---|---|
| `@auth/sveltekit` | main-app | move to main-app |
| `@langchain/core`, `@langchain/openai`, `@langchain/pinecone` | main-app | already in main-app (newer); drop from root |
| `@pinecone-database/pinecone` | main-app | already in main-app; drop from root |
| `openai` | main-app | move to main-app |
| `langchain` | main-app | already in main-app; drop from root |
| `@vercel/speed-insights` | main-app | move to main-app |
| `twilio` | business-app | already in business-app; drop from root |
| `@sendgrid/mail` | main-app, business-app | already in business-app; add to main-app; drop from root |
| `bcrypt` | main-app, business-app | already in business-app; add to main-app; drop from root |
| `cloudinary` | all three | already in main+business; add to user-app; drop from root |
| `uuid` | all three | already in main+business; add to user-app; drop from root |
| `@sveltejs/adapter-vercel` (root `^5.4.4`) | main-app, business-app (both declare `^6.2.0`) | delete from root (stale/overridden) |
| `csv-parser`, `dotenv`, `puppeteer` | **nobody (0 imports repo-wide)** | delete entirely |
| `svelte` `^4`, `@sveltejs/adapter-auto`, `vite` `^5`, `@sveltejs/vite-plugin-svelte` `^3`, `svelte-check`, `typescript`, `svelte-cloudinary`, `@sveltejs/kit` | framework toolchain (only user-app still leaned on root) | move per-app |

**Dead deps to remove (React libs in Svelte apps):**
- `@radix-ui/react-slider` in main-app
- `@radix-ui/react-collapsible` in business-app

(Confirm zero imports before removing.)

## 4. user-app migration surface

Small and mechanical: 6 `.svelte` files, 18 ts/js files, ~3.4k LOC.
Svelte-4-isms: 7 `$:` reactive statements, 9 `export let` props, 7 `on:` handlers,
**0 slots, 0 `createEventDispatcher`**. Plain CSS `<style>` in every component.

**Tailwind decision (confirmed): add tooling only.** Wire up Tailwind v4 (deps, config,
`app.css`, `+layout.svelte` import) so it's available for new UI, but do **not** rewrite
existing plain-CSS components.

## 5. Execution steps

### Step 1 — user-app to full parity (Svelte 5 + TS + Tailwind tooling) ✅ DONE
- [x] Wrote a complete `apps/user-app/package.json`: Svelte 5, `@sveltejs/kit`, `vite ^7`,
      `@sveltejs/vite-plugin-svelte ^6`, `@sveltejs/adapter-vercel ^6`, `svelte-check`,
      `typescript`, `@types/uuid`, Tailwind v4 stack (`tailwindcss`, `@tailwindcss/postcss`,
      `autoprefixer`, `postcss`), plus runtime deps `@vercel/postgres`, `cloudinary`, `uuid`.
      (Email uses Brevo via `fetch` — no package dep. Skipped `tailwindcss-animate`/`clsx`/
      `bits-ui` etc. — not used; "simplest first".)
- [x] Replaced `jsconfig.json` with `tsconfig.json` extending `../../tsconfig.base.json`
      (`allowJs: true, checkJs: false` — TS tooling available, existing `.js` not force-checked).
- [x] Updated `svelte.config.js`: `adapter-vercel` (nodejs22.x) + `vitePreprocess()` +
      `compilerOptions.runes: true`.
- [x] Added `postcss.config.js`, `tailwind.config.ts`, `src/app.css` (`@import "tailwindcss";`),
      and `src/routes/+layout.svelte` importing `app.css`.
- [x] Migrated all 6 components to runes: `export let` → `$props()`, `$:` → `$derived`,
      mutable `let` → `$state`, `billUrl`/`billFormat` → `$bindable`, `on:*` → `on*`.
      Plain-CSS `<style>` blocks left intact.
- [x] `npm install` clean; `npm run check -w user-app` = **0 errors, 8 benign warnings**
      (a11y/unused-CSS/initial-value advisories, all behavior-preserving);
      `npm run build -w user-app` = **success**.

### Step 2 — Root cleanup ✅ DONE
- [x] Moved owned deps into main-app: `@auth/sveltekit`, `@sendgrid/mail`, `openai`,
      `@vercel/speed-insights` (deps) + `vite`, `svelte-check`, `typescript` (devDeps it was
      borrowing from root). NOTE: main-app uses `bcryptjs` (already declared), not `bcrypt` —
      the earlier scan was a substring false-positive; only business-app uses `bcrypt`.
- [x] Deleted unused deps from root: `csv-parser`, `dotenv`, `puppeteer`,
      `svelte-cloudinary`, `@sveltejs/adapter-auto`, stale `@sveltejs/adapter-vercel ^5.4.4`.
- [x] Stripped ALL framework toolchain + app libs from root (every one now owned by an app
      or unused). Root `dependencies` block removed entirely.
- [x] Root now keeps only: workspaces, packageManager, `dev:*`/build/lint scripts, and
      `eslint`/`@eslint/js`/`eslint-plugin-svelte`/`globals`/`prettier`/`prettier-plugin-svelte`.

### Step 3 — Remove dead radix deps ✅ DONE
- [x] Confirmed zero React imports; removed `@radix-ui/react-slider` (main-app) and
      `@radix-ui/react-collapsible` (business-app).

### Step 4 — Reinstall & verify all apps ✅ DONE
- [x] `npm install` clean.
- [x] **user-app**: `check` 0 errors (8 benign warnings), `build` ✓.
- [x] **main-app**: `build` ✓. (`check` reports 53 pre-existing type errors, unchanged by
      this work — svelte-check/typescript resolve the same versions as before; build unaffected.)
- [x] **business-app**: pre-existing LOCAL build blocker (`$env/static/private` POSTGRES_URL
      not set at build time; likely builds on Vercel with env). Verified via a baseline
      worktree at the pre-change commit — it fails there too. NOT caused by this work; out of
      scope. (Also unrelated: a TS-in-`.svelte` parse issue in `us-new-rewrites/Sidebar.svelte`.)

### Step 5 — Document the convention ✅ DONE
- [x] Added `docs/monorepo-dependencies.md`: root-vs-app-local rule, ownership map,
      phantom-dependency lesson, and the pnpm-later migration path.

## 7. Known follow-ups surfaced during this work

### ESLint Svelte 5 + TypeScript support ✅ DONE
- Root cause: root `node_modules/svelte` was still **4.2.20** (hoisted via Svelte-4 peer
      constraints), so `svelte-eslint-parser` parsed Svelte 5 files with the v4 compiler
      (→ `{@render}` "Unexpected character '@'", runes flagged `no-undef`). Additionally the
      config had **no TypeScript parser**, so `.ts` files and `<script lang="ts">` couldn't parse.
- Fix applied:
  - Added `svelte@^5.46.1` to root devDeps (peer for the root-level eslint-plugin-svelte /
        svelte-eslint-parser) → parser now resolves Svelte 5's compiler.
  - Added `typescript-eslint@^8` and rewrote `eslint.config.js`: `.ts`/`.svelte.ts` parsed
        with `@typescript-eslint/parser`; `.svelte` files hand `<script lang="ts">` to the TS
        parser via `parserOptions.parser`. `no-undef` disabled for TS/Svelte (TS + svelte-check
        own that; runes are compiler globals). Enabled **parsing only** — did NOT switch on the
        heavy TS ruleset (would flood unrelated findings).
  - Downgraded `svelte/prefer-svelte-reactivity` to `warn` (style rule, false-positives on
        computed Maps), consistent with the other downgraded svelte rules.
  - Replaced the old `apps/business-app/src/lib/components/ui/**` ignore with a generalized
        `**/src/lib/components/ui/**` (vendored shadcn/bits-ui components — not hand-maintained).
- Result: **runes + `{@render}` + TypeScript all parse.** business-app now lints with **0
      parse errors** (its UI components previously had to be ignored entirely). Builds unaffected.
- Remaining lint output is real **content/code findings**, not config failures:
  - ~~main-app 41 parse errors~~ → **FIXED, see below.**
  - user-app has 1 real bug surfaced by working lint: `src/lib/auth/user/index.js`
        `createUserAuthService()` calls `new UserAuthService()` but only *re-exports* the class
        (`export { X } from …` creates no local binding) — that call throws at runtime. Pre-existing.
  - Other errors across main-app/business-app are ordinary rule findings now that lint runs.

### main-app parse errors ✅ DONE (41 → 0)
- Root cause: SEO JSON-LD embedded as `{@html \`<script type="application/ld+json">${x}</script>\`}`.
      A literal `</script>` inside the template literal makes svelte-eslint-parser treat it as a
      script-element terminator (the Svelte *compiler* handles it fine — these pages all build
      & render). Plus one invalid hand-rolled rune shim in `app.d.ts`.
- Fixes:
  - `app.d.ts`: removed the invalid `declare global { function $state… $effect.pre… }` block —
        Svelte 5 provides those rune globals via the `svelte` package. Kept the real `App` types.
  - 39 `.svelte` files: escaped the in-`{@html}` closing tag as `</script>`
        (`/` === `'/'`, so rendered HTML is **byte-identical** — verified). Used a backtick-state
        parser (scratchpad script) that escapes ONLY `</script>` inside a template literal, never
        real `<script>` elements or component closers. Build verified after applying.
        (Chose `/` over `<\/script>` because the latter trips `no-useless-escape`.)
  - 2 files (`in/(layout-1)/+page.svelte`, `…/partners/+page.svelte`) hit deeper
        svelte-eslint-parser limits — a multi-line inline JSON-LD object mixed with real
        `<script>` ld+json elements, and an inline `<script>` block in markup. Every safe rewrite
        either failed to parse or risked breaking the SEO output (note: `{@html}` does NOT
        interpolate inside a real `<script>` element — content is raw text). They build & render
        correctly, so they're added to ESLint `ignores` with a comment (same approach the repo
        already used for the UI components).
- Result: **user-app / main-app / business-app all report 0 parse errors.** main-app's remaining
      lint output is ordinary rule findings (real code-quality items), not parse failures.
- **business-app local build** needs env vars (or `.env`) to build locally; and the
      `Sidebar.svelte` TS parse error should be looked at.
- **main-app `check`** has 53 pre-existing type errors worth cleaning up separately.
- **Consider `syncpack`** to detect cross-app version drift (e.g. keep Svelte/kit aligned)
      without forcing a single root version.

## 6. Guardrails
- Commit in logical chunks (user-app parity; root cleanup; dead-dep removal) so each is
  independently reviewable/revertible.
- Verify builds after each consequential change; do not batch-break.
- Do not rewrite working plain-CSS components (Tailwind tooling only).
- Preserve app-specific config (main-app microfrontends, business-app specifics) untouched.
