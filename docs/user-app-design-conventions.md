# User-App Design Conventions

Rules for `apps/user-app`. Short on purpose: **user-app follows
`docs/business-app-design-conventions.md`.** It is a logged-in product surface, not marketing,
so the dashboard rules apply and main-app's do not. Read that doc first — §1 colour, §2 buttons,
§3 page template, §4 card grids, §5 forms all apply here unchanged.

This file only records where user-app differs.

---

## 1. The token names are main-app's, not business-app's

user-app's `src/app.css` was copied from **main-app**, so a few token names business-app's doc
mentions do not exist here:

| business-app writes | user-app must write |
|---|---|
| `text-accent-strong` | `text-primary-strong` |

There is no `--accent-strong` in this app. `text-accent-strong` compiles to nothing and renders
as inherited colour, silently — it does not error. The contrast rule itself is unchanged: orange
lettering on a light surface is `text-primary-strong` (`#B84900`), because plain `text-accent`
is 2.77:1 on the cream background. Text on an orange surface is `text-primary-foreground`
(a warm near-black), never white.

## 2. Local UI kit, not shadcn

`src/lib/components/ui/` holds seven hand-written Svelte components — `AppShell`, `Card`,
`Badge`, `Button`, `Field`, `Alert`, `EmptyState`. There is no `bits-ui`, no `tailwind-variants`,
no `tailwind-merge`, no `cn()`. Consequences:

- **Classes passed via the `class` prop are appended, not merged.** With no `twMerge`, a passed
  class that conflicts with a base class wins only if it comes later in the stylesheet, which is
  not something to rely on. Pass additive classes (`p-5`, `mb-4`, `md:col-span-2`, `flex flex-col`);
  don't try to override a base colour or radius from the call site.
- `Badge` variants are `neutral | accent | success | warning | outline`, and follow the
  status-badge rule: a `*-muted` surface with the saturated colour as text, never a solid fill.
- `Button` renders an `<a>` when `href` is set, a `<button>` otherwise. Variants are
  `default | outline | ghost` — same intent mapping as §2 of the business-app doc.

Add to the kit rather than hand-rolling a second card or badge in a page.

## 3. `AppShell`, not a sidebar layout

There is no nav rail. `AppShell` is a sticky logo bar plus a centred content container, and it is
used **explicitly by each page** rather than dropped into `+layout.svelte`, because
`/thank-you` has no session to pass a `user` from.

- `maxWidth` is `'5xl'` (default) or `'3xl'` (forms and the thank-you page). It is a lookup, not
  string interpolation, so Tailwind's scanner can see the class names — keep it that way.
- **Sign Out posts to `/?/logout`, absolute.** The logout action lives on the dashboard page at
  `/`, so a relative `?/logout` silently misses it from `/feedback`.
- Pages emit only their `<header>` and content; the container lives in the shell.

## 4. No `dark:` variants

The `.dark` class is never applied anywhere in this app — there is no theme toggle and no
`prefers-color-scheme` hook. The tokens already flip on their own if one is ever added, so
writing `dark:` here is dead code that will drift. (Same conclusion as main-app's doc, different
reason.)

## 5. Never put `:root` inside a scoped `<style>`

Svelte does not scope `:root`, so it leaks app-wide — and only while that page is mounted, which
makes the resulting bugs intermittent. Two pages used to do this, aliasing `--primary-color`,
`--text-dark`, `--container-width` and friends onto the shared tokens. Both are gone. Use the
tokens from `app.css` directly.

## 6. Styling is Tailwind utilities

Tailwind v4 is wired via `@import "tailwindcss"` in `app.css` and `@tailwindcss/postcss`; the
`@theme` block emits the `--color-*` bridge, so `bg-card`, `text-muted-foreground`,
`border-border` etc. work. Scoped `<style>` blocks were removed from the converted pages — don't
reintroduce them for anything a utility covers.

Two exceptions where an inline `style` is correct, because Tailwind v4's `@theme` namespaces
don't cover the token: the z-index scale (`--z-sticky` and friends are not `--z-index-*`, so
`z-sticky` generates nothing — `AppShell` uses `style="z-index: var(--z-sticky)"`).

## 7. Scope

Converted: `/`, `/thank-you`, `/feedback`, and `BillUpload`. **Still on bespoke scoped CSS:**
`src/routes/signin-link/[token]`. Bring it across when you next touch it.

Routes carry no country segment. `/in` was dropped on 2026-08-23 — see §8.

## 8. No country in the URL

user-app URLs have **no `/in` or `/us` prefix** (dropped 2026-08-23, matching business-app's
Phase 7). The dashboard is `/`, not `/in`. There was never a `/us` tree here; the region picker
that linked to one was deleted with the move.

The app is still India-only in its data — the `eq(..., 'in')` predicates in the page loaders and
API routes are deliberate and were left untouched. Country is a query filter, not a route.

Only **main-app** URLs still carry a country, so a cross-app link into main-app keeps its prefix.
