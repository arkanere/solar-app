# Business-App Design Conventions (Indian side)

Rules for how to *use* the design system already defined in
`apps/business-app/src/app.css`. The tokens are good; the inconsistency comes
from using them without rules. This doc applies to routes under
`apps/business-app/src/routes/in/` and components in
`apps/business-app/src/lib/in-new-rewrites/`.

Guiding principle: **colour means something.** If a colour doesn't carry
meaning (action, state, danger), don't use it — use foreground/muted neutrals.

---

## 1. Colour usage rules

### Accent blue (`accent` / `primary`)
Blue means **"you can interact with this."** Nothing else is blue.

- Primary action buttons (one per view/card — see §2)
- Links (`text-accent`)
- Active nav item, selected tab, focus ring
- **Never** on static headings, labels, or decorative text. Headings are
  `text-foreground`; hierarchy comes from size and weight, not colour.

### Success green (`success`)
Green means **"this succeeded / this is in a good state."** It is a *state*
colour, not an *action* colour.

- Success toasts, "Claimed ✓" confirmations, completed-step indicators,
  progress bars that represent completion
- **Never** on buttons asking the user to do something. "Claim Now" is a
  primary action → accent blue, not green.

### Warning amber (`warning`)
Pending/attention states: "awaiting decision", expiring soon, incomplete setup.
Not for actions.

### Destructive red (`destructive`)
Irreversible or dangerous actions and error states only.

- Destructive actions default to **low prominence**: `variant="ghost"` with
  `text-destructive`, or an item inside a dropdown menu. A solid/outlined red
  button is reserved for the *confirmation step* (e.g. inside a "Delete
  branch?" dialog), never repeated across a grid of cards.

### Status colours (`lead-*`, `stage-*`, `project-*`, `priority-*`)
Only in badges, chips, and chart marks — small areas paired with a text label.
Never as button or surface colours.

### Neutrals
Everything else. Card surfaces are `card`, page background is `background`,
secondary text is `foreground-secondary`, hints/placeholders are
`foreground-muted` / `muted-foreground`.

---

## 2. Buttons

Always use the shadcn `Button` component
(`$lib/components/ui/button`) — no hand-rolled `<button class="bg-...">`.

| Intent | Variant | Rule |
|---|---|---|
| Primary action | `default` | Max **one** per card/view. It's the answer to "what should the user do here?" |
| Secondary action | `outline` | Edit, view, cancel, etc. |
| Tertiary / low-stakes | `ghost` | Toggles, "Hide details", icon buttons |
| Destructive | `ghost` + `text-destructive` (in place) or menu item; `destructive` only inside confirmation dialogs | See §1 |
| Navigation styled as text | `link` | |

Don't override variant colours with utility classes (`class="bg-success ..."`
on a Button is what caused the green/blue drift). If a button seems to need a
custom colour, the intent is probably wrong — re-map it to the table above.

Full-width buttons (`w-full`) only inside cards/forms narrower than ~480px.

---

## 3. Page template

Every authenticated page under `in/(layout-1)/[business_slug]/` uses the same
skeleton:

```svelte
<div class="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
  <!-- Page header -->
  <header class="mb-6">
    <h1 class="text-2xl font-semibold text-foreground">Page Title</h1>
    <p class="mt-1 text-sm text-muted-foreground">Optional one-line subtitle.</p>
  </header>

  <!-- Content -->
</div>
```

- **Left-aligned** header, always. No centered hero titles inside the
  dashboard (Quotation Maker's centered h1 migrates to this pattern).
- One `h1` per page at `text-2xl font-semibold`. Section headings inside the
  page are `h2` at `text-lg font-semibold`. Card titles are `text-base
  font-semibold`.
- `max-w-5xl` is the default content width. Forms may use `max-w-3xl`;
  wide tables/boards may use `max-w-7xl`. Content fills its container — no
  half-width cards floating in a wider column.
- Vertical rhythm: `gap-6` / `space-y-6` between top-level sections, `gap-4`
  inside sections.

---

## 4. Cards in a grid

Card grids (branches, projects, leads) keep internals aligned regardless of
how much content each card has:

```svelte
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
  <Card class="flex flex-col">
    <!-- header: title + status badge -->
    <!-- body: details -->
    <div class="mt-auto flex gap-2 pt-4">
      <!-- actions pinned to bottom, same order on every card:
           primary → secondary → overflow/destructive -->
    </div>
  </Card>
</div>
```

- `flex flex-col` on the card + `mt-auto` on the footer keeps action rows on
  one baseline across the row.
- Action order is fixed: primary (`default`), secondary (`outline`), then
  destructive tucked into a `ghost` icon/menu. A card with fewer actions still
  keeps the footer at the bottom.
- One badge per card header, using the status token colours from §1.

---

## 5. Forms

- Labels: `text-sm font-medium text-foreground`; required marker
  `<span class="text-destructive">*</span>`.
- Two-column field grid on `md+` (`grid md:grid-cols-2 gap-4`), full-width
  fields (address, notes) span both columns.
- Section headings inside a form follow §3 (`h2`, `text-foreground` — not
  accent blue).
- Submit button: `default` variant, right-aligned at the form footer (or
  full-width if the form is `max-w-md` or narrower).

---

## 6. Checklist for touched components

When editing an `in-new-rewrites/` component, bring it into compliance:

1. No `text-accent` on headings/labels → `text-foreground`.
2. No `bg-success` buttons → Button `default` variant; green only for state.
3. Destructive buttons demoted per §1.
4. Page wrapped in the §3 template.
5. Grids use the §4 card skeleton.
6. Raw `<button>`s replaced with the `Button` component.
