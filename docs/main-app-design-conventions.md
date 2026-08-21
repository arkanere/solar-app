# Main-App Design Conventions

Rules for how to *use* the design system already defined in `apps/main-app/src/app.css`. The
tokens are good; the inconsistency came from using them without rules. This doc applies to
`apps/main-app` — the public marketing site.

**This is not the same rulebook as `business-app-design-conventions.md`.** That one governs a
logged-in dashboard, where colour must mean "you can interact with this". This is a public site,
where the brand orange is identity. The two disagree on purpose; don't port rules between them.

Guiding principle: **light and dark come from the tokens, not from the markup.**

---

## 1. Page layout

Every content page uses `PageShell` (`$lib/components/layout/PageShell.svelte`). It owns the
`<main>` landmark, the container width, the horizontal padding and the vertical rhythm.

```svelte
<script lang="ts">
  import PageShell from '$lib/components/layout/PageShell.svelte';
  import PageHeader from '$lib/components/layout/PageHeader.svelte';
</script>

<PageShell>
  <PageHeader title="Page Title" lede="Optional one-line summary." />

  <section>
    <PageHeader as="h2" title="Section Title" />
    <p class="text-base leading-relaxed">…</p>
  </section>
</PageShell>
```

- **Never write your own `<main>`, `mx-auto max-w-*`, or page padding.** Neither route layout
  constrains width, which is exactly why the tree drifted into five different container widths
  before this existed.
- Width is a prop, not a class: `width="page"` (1140px, default) · `"content"` (896px, tools and
  utilities) · `"doc"` (768px, legal and form pages).
- **Don't add `mb-8` to sections.** `PageShell` spaces its children with `--section-gap`.
- Headings and the orange divider come from `PageHeader`. Do not hand-roll the
  `<span class="w-[theme(--divider-line-width)] …">` unit — it was duplicated 20+ times in two
  different spellings before it was extracted.

---

## 2. Never write `dark:`

The tokens are redefined under `.dark` in `app.css`. `bg-card`, `text-foreground` and
`text-muted-foreground` already flip. A `dark:` variant means light and dark are being authored
separately, and they will drift.

`/about-us` carried 18 of them — every other page in its tree had zero — and its dark mode ended
up dimmer and lower-contrast than its light mode as a result.

The only legitimate reason to write `dark:` is when an element should play a genuinely *different
role* in dark mode. If a colour looks wrong in one theme, **fix the token, not the component.**

---

## 3. Colour

Orange headings are correct here — `PageHeader` applies `text-primary-strong` for you. Hierarchy
comes from size and weight as well as colour.

**There are two oranges, and the split matters.** `--primary` (#FF6600) is the brand colour and is
for *surfaces* — button fills, table header rows, the divider. `--primary-strong` (#B84900 in light,
identical to `--primary` in dark) is for *orange text on a light surface*, because the brand orange
is only 2.77:1 on the cream background and fails AA. **Any orange lettering uses
`text-primary-strong`; `text-primary` on a light background is a bug.**

### Accent surfaces are for buttons and large text only

`--accent` is `var(--primary)`: accent *is* the brand orange, not a second colour. Two rules
follow:

- **Never put body copy on `bg-accent`.** `bg-accent` + `text-foreground` measures 5.94:1 in
  light but **2.53:1 in dark**, under the 4.5:1 AA floor. Use **`bg-accent-muted`** for callouts
  and tinted panels — 15.29:1 light, 11.36:1 dark.
- **Gradients between `primary` and `accent` do nothing.** They resolve to the same colour. The
  old about-us hero was `from-primary to-primary` and rendered as a flat band.

### Verified pairings

| surface | text | light | dark |
|---|---|---|---|
| `bg-background` / `bg-card` | `text-foreground` | 17.44:1 | 16.43:1 |
| `bg-accent-muted` | `text-foreground` | 15.29:1 | 11.36:1 |
| `bg-card` | `text-muted-foreground` | 4.70:1 | 6.99:1 |
| `bg-background` | `text-muted-foreground` | **4.44:1** | 7.65:1 |
| `bg-accent` | `text-foreground` | 5.94:1 | **2.53:1** |
| `bg-primary` (button) | `text-primary-foreground` | 5.94:1 | 6.50:1 |
| `bg-success` | `text-success-foreground` | 6.19:1 | 7.93:1 |
| `bg-background` | `text-primary-strong` | 4.97:1 | 7.12:1 |
| `bg-background` | `text-primary` | **2.77:1** | 7.12:1 |

**Body copy is `text-foreground`.** `text-muted-foreground` is for captions and helper text only
— on the page background it is marginally under AA in light mode.

`--primary-foreground` and `--secondary-foreground` are a warm near-black, not white: white on the
brand orange is 2.94:1 and white on the brand green is 2.82:1, both failing. If you want white text
over a hero photo, say `text-white` — that is what it means. Using `text-primary-foreground` for it
broke when the token was corrected.

Known gap: `bg-destructive` + white is **3.78:1** — under AA for normal text, over the 3:1
large-text threshold. Not yet fixed.

---

## 4. Use what exists

Before writing a utility string, check `@layer components` in `app.css`:

- `.text-link` instead of `text-primary hover:underline`
- `.card-interactive` instead of hand-rolled `hover:shadow-* hover:-translate-y-*`
- `.font-display` / `.text-display` for display type

Use the `Button` component (`$lib/components/ui/button`) rather than an `<a>` styled as a button;
it takes `href` and renders an anchor.

Note `prose` / `prose-sm` classes appearing in some older components are **inert** — no
`@tailwindcss/typography` is installed. Don't copy them into new markup.

---

## 5. Checklist for a page you touch

1. Wrapped in `PageShell`, with no hand-written `<main>` or `max-w-*`.
2. Headings via `PageHeader`; no inline divider spans.
3. Zero `dark:` classes.
4. Orange lettering uses `text-primary-strong`, never `text-primary`.
5. No body text on `bg-accent` — use `bg-accent-muted`.
6. Body copy `text-foreground`; `text-muted-foreground` only for captions.
7. `.text-link` / `.card-interactive` / `Button` instead of re-rolled utilities.

---

## Still to convert

The first pass migrated `about-us`, `terms-of-use`, `privacy-policy` and `write-for-us`, plus the
sitewide `AboutSolarVipani`. Not yet converted, each still on its own dialect:

- the seven `lib/components/seo/*Page.svelte` shells, which repeat one identical
  `max-w-6xl mx-auto px-4 py-8` wrapper seven times — the largest remaining duplication
- `tools/*`, `authors/[author_slug]`, `seo-index` (`max-w-4xl`)
- `data-access`, `data-deletion` (`max-w-2xl`, and the only files still writing raw
  `hsl(var(--…))` instead of semantic utilities)
- the `[country]` tree's `partners` and `business-listing` (11 `dark:` overrides between them)

Convert them as you touch them.
