# Monorepo dependency conventions

This repo is an **npm workspaces** monorepo (`apps/*`). Each app under `apps/` is an
independently deployed SvelteKit app (its own Vercel deployment / microfrontend).

## The rule

> **If a dependency ends up in a specific app's deployed bundle, it belongs in that app's
> `package.json`. The root holds only repo-wide orchestration and lint/format tooling.**

Each app must be **self-describing**: you should be able to read one app's `package.json`
and know exactly what it needs, with no reliance on hoisting from a sibling.

### What lives at the root (`/package.json`)

- `workspaces`, `packageManager`
- Orchestration scripts (`dev:*`, `build`, `lint`, `format`, `check`, ...) that fan out
  across workspaces
- Repo-wide **dev-time** tooling where version skew is harmless:
  `eslint`, `@eslint/js`, `eslint-plugin-svelte`, `globals`, `prettier`,
  `prettier-plugin-svelte`
- Shared config: `tsconfig.base.json` (each app's `tsconfig.json` extends it)

### What lives in each app (`apps/<app>/package.json`)

- **Framework runtime/toolchain**: `svelte`, `@sveltejs/kit`, `@sveltejs/adapter-*`,
  `@sveltejs/vite-plugin-svelte`, `vite`, `svelte-check`, `typescript`, `tailwindcss`,
  `@tailwindcss/postcss`, `postcss`, `autoprefixer`
- **App libraries**: anything the app imports (`@vercel/postgres`, `cloudinary`, `uuid`,
  `bcrypt`/`bcryptjs`, `twilio`, `@sendgrid/mail`, `langchain`, `openai`, `bits-ui`, ...)

## Why (especially for a solo maintainer)

1. **Version independence** — upgrade one app's Svelte/Tailwind/etc. without dragging the
   others. A single Svelte version pinned at the root is what previously stranded `user-app`
   on Svelte 4 while the others moved to Svelte 5.
2. **Reproducible independent deploys** — Vercel builds one app at a time; a complete
   per-app manifest means the build never depends on what a sibling happened to hoist.
3. **Readability** — one `package.json` = one app's real stack.

The trade-off is losing *enforced* uniformity across apps. That's an acceptable trade at
this scale; use tooling (below) to *detect* drift instead of forcing a single version.

## The phantom-dependency lesson

npm workspaces **hoist** dependencies into the root `node_modules`. That means an app can
`import` a package it never declared, because a sibling installed it. It "works" — until a
sibling bumps or drops that package. `user-app` originally declared **zero** dependencies
and silently ran **Svelte 4** hoisted from the root; that is a phantom dependency.

Guard against it by keeping every app self-describing (the rule above). A future move to
**pnpm** would enforce this automatically — see below.

## Package manager: npm now, pnpm later

We stay on **npm workspaces** for now (simple, already set up). If the repo grows, consider
migrating to **pnpm**:

- pnpm uses a non-flat, symlinked `node_modules`, so an undeclared import **fails at install
  time** instead of silently resolving to a hoisted version. The `user-app`-on-Svelte-4 bug
  could not have happened silently under pnpm.
- Migration sketch: add `pnpm-workspace.yaml` (`packages: ["apps/*"]`), delete
  `package-lock.json`, run `pnpm import` then `pnpm install`, update the root `packageManager`
  field and any CI/Vercel install commands. Expect to fix a handful of newly-surfaced
  phantom deps — that is the point of the exercise.

### Detecting version drift (either package manager)

Consider [`syncpack`](https://github.com/JamieMason/syncpack) to *report* mismatched
versions of the same dependency across apps (e.g. keep `svelte`/`@sveltejs/kit` aligned)
without forcing them into the root.
