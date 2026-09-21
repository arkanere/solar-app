# Design foundation

The token set, and the argument for it. Decided as one set, on 2026-09-06.

Nothing here was inherited from the SvelteKit app. Its token layer, its brand hue and its
conventions docs were all set aside deliberately.

Re-verify colour with `npm run check:contrast` after changing any value. The
`/specimen` route this was approved at is deleted; this document is the record.

## 1. What the system has to hold

The archetypes decide this, not taste. From `archetype.md`:

- **1,277 of 1,414 URLs (90%)** are the directory surface — installer profiles and the three
  geo zoom levels. Cards, listing rows, tables, meta. Dense.
- **~130 URLs** are the editorial surface — cluster articles and brand pages, whose body is
  database HTML rendered through `prose`.

So this is a content and directory site. Most pixels are type, whitespace, images and tables.
Buttons and dialogs are a rounding error, and a component kit would be solving the wrong
problem.

## 2. The problem being fixed

The README says buttons, links and headings are indistinguishable. That is measurable in the
SvelteKit app:

| Signal | Count |
| --- | ---: |
| Uses of `text-primary-strong` | 315 across 55 files |
| …on an `<h1>`–`<h3>` | 126 |
| …on an `<a>` | 76 |

One colour token means both "this is a heading" and "this is a link". That is not a bad token
value — it is a missing rule about what colour *means*. A new palette alone would reproduce it.

## 3. Reference survey

Surveyed from working knowledge of these systems rather than by measuring live CSS, so treat
the extracted principles as the load-bearing part, not any specific number.

**Directory and listing** — Google Business profiles, Checkatrade, Yelp, Zillow, EnergySage.
What works: one entity per row, a fixed reading order (name → trust marker → place → metrics),
metrics right-aligned and tabular so the eye can scan a column. What fails: colour used for
emphasis, which turns a list into noise the moment more than one thing is coloured.

**Editorial** — Stripe's docs and blog, Literata-era Google reading surfaces, MDN. What works:
hierarchy from size and weight alone, a capped measure, and generous space *between* blocks
rather than inside them.

**Systems** — GOV.UK Design System is the closest match to this problem: a content and service
site, dense, accessibility-first, and enormous. Its rule is the one worth stealing, and it is
the direct answer to §2:

> Each role gets exactly one signal, and colour is never overloaded.

USWDS follows the same lineage. Carbon is where the type-scale discipline comes from. Radix
Colors is where "solve a step to a contrast target, don't pick it" comes from.

## 4. The three rules

Everything below exists to enforce these. They are structural in `app/globals.css`, not
conventions in a document that markup can quietly ignore.

1. **Headings are ink.** Hierarchy is size and weight. The base layer sets no colour on
   `h1`–`h4`, so a heading inherits ink and cannot silently take a brand colour.
2. **Sky means "you can act on this."** Links, buttons, focus rings. Nothing decorative is
   sky. The base layer styles bare `<a>`, so no link needs a colour class.
3. **Sunlight is identity only.** Fills, marks, bands. It never sets type on a light ground and
   it never means status.

## 5. Colour

**Where the hues come from.** Each is a real object tied to one of the product values, and each
object gets exactly one job. Interaction and identity are deliberately different hues, because
one hue cannot do both well — a warm hue cannot carry a link, which is why the SvelteKit app
needed a second `-strong` token to patch its `#FF6600` at 2.94:1 on white.

| Value | Object | Role | Hue |
| --- | --- | --- | ---: |
| Trust | Clear midday sky | `action` — links, buttons, focus | 240 |
| Transparency | Glass and clean light | `canvas`, `surface` — the ground | 78, a trace |
| Prudence | Wet slate | `ink`, lines, structure | 250 |
| Convenience | Sunlight | `brand` — fills and marks | 78 |

- **Interaction: sky, hue 240.** Blue-as-link is the most over-learned convention on the web,
  and being unsurprising is the point on a directory where the scan is link-vs-not-link
  hundreds of times a session. It is also ten degrees from the slate ink, so the type and the
  links read as one family and the sunlight is the thing that deliberately is not.
- **Identity: sunlight, hue 78.** Golden rather than orange — it reads as light on a surface
  rather than as a warning. Carries dark text at 8.93:1.
- **Neutrals: wet slate, hue 250, on faintly warm paper, hue 78.** The ink is cool because
  "prudence" is; the ground carries a trace of the sunlight hue so the page is not clinical and
  the brand feels native to it. Cool ink on warm paper is the print pairing, not a conflict.
  The warmth is close to free: every ratio moves by under 0.05 across the chroma range that was
  in play, so it could be tuned last without re-deriving anything.

**Convenience does not carry the CTA.** That is the one role assignment made against the brief
this came from. Sunlight is 1.82:1 on canvas — a button survives it, because the text sits on
the fill, but a link and a focus ring do not. Making it the CTA colour would have meant sky
links *and* sunlight buttons: two colours both meaning "you can act on this", which is exactly
the fault in §2. The brief's own principle, one colour one job, is what rules it out.

**Method.** No step was picked by eye. Each was solved for a contrast ratio against the
background it actually sits on, in OKLCH so the ramp is perceptually even. `oklch → sRGB → WCAG`
is implemented in `scripts/check-contrast.mjs`, verified against known values (`#767676` = 4.54:1).

"Against the background it actually sits on" is the load-bearing half of that, and it is easy
to get wrong: the three ink steps are solved against `surface-sunken` rather than `canvas`,
because that is where a table stripe puts them, and both status colours are solved against
their own tinted surface rather than white. Solve any of those against the lighter ground and
it passes the check while failing on the page.

All 17 pairings the archetypes use pass. Two are close and worth knowing: `ink-subtle` on a
stripe is 4.57:1, and `line-strong` is 3.14:1. Neither has room to be lightened.

**Two results that became structural rules rather than tokens:**

- Sky against ink is **2.68:1** — under the 3:1 needed to tell a link from body text. Colour
  alone therefore cannot carry "link", so the underline is the primary signal. This is not a
  compromise; it is the GOV.UK answer and it is more robust.
- Sunlight against canvas is **1.82:1**, so a brand-filled chip needs a border to define its
  edge. Text on it is fine at 8.93:1.

**No `warning` and no `info` token.** No archetype has a use for either yet. daisyUI's own
`warning`/`info` variables are mapped to existing values so a stray `btn-info` is not broken,
but neither is part of the documented system.

## 6. Type

**Inter** for the directory surface and all UI — best free option at small sizes and for tabular
data, which is most of this site. **Source Serif 4** for article body, loaded *only* under the
`(layout-1)` route group, so the 90% of URLs that never use it never pay for it.

The scale is tuned, not a pure ratio — tight where the directory needs density, open where the
editorial surface needs air. Only the top two steps go fluid. `--text-prose` is 17px at 1.7,
deliberately larger than UI body.

## 7. Space, radius, elevation, motion

- **Rhythm**: one 4px-based scale, `2xs`…`3xl`, plus a fluid `--spacing-section`. Layout
  primitives apply it; pages will not. The numeric Tailwind scale stays enabled because
  daisyUI's own CSS depends on `--spacing`; the lint rule banning hand-applied spacing lands
  with the primitives.
- **Radius**: three steps, restrained. This is a reference site, not a consumer app.
- **Elevation**: two shadows, both for things that float over content. Everything on the page
  itself is separated by a line, not a shadow.
- **Motion**: two easings, three durations, CSS only. `prefers-reduced-motion` is honoured
  globally. The lint rule already bans JS animation libraries.

## 8. Traps found while building this

Three that will bite again:

- **`@theme static` is load-bearing.** Plain `@theme` lets Tailwind 4 tree-shake any token no
  utility references. Five tokens silently vanished from the build — including ones the base
  layer reads through `var()`.
- **`--color-success` collides with daisyUI.** Both use that exact name, so
  `--color-success: var(--color-success)` in the theme block is circular and resolves to
  nothing. It is deliberately not restated there; daisyUI reads the `@theme` value.
- **A custom property resolves where it is DECLARED, not where it is used.** `--font-serif` on
  `:root` could never see `--font-source-serif`, which next/font puts on a deeper element — so
  it collapsed to Georgia at `:root` and inherited down already collapsed. It is re-declared on
  `[data-editorial]`. Separately, a bare `var(--font-source-serif)` with no inline fallback is
  invalid at computed-value time and kills the whole declaration, so the `, Georgia, serif` tail
  never runs. Both bugs rendered as *nothing visibly wrong* — the same failure class as
  user-app's `text-accent-strong`.

## 9. Not decided here

- ~~Layout primitives~~ — **done**, in `components/layout/`, and both lint rules landed with
  them. Two things decided while building them:

  - The container lint rule tests for `mx-auto` alone, not for `max-w-*`. A container is a
    column centred in the viewport, so every hand-rolled one centres; a bare `max-w-*` capping
    a paragraph inside a wider section is typography, and routing it through `Container` would
    add a second page gutter.
  - **The gutter is added to the measure, not taken out of it.** Tailwind boxes are
    `border-box`, so `max-w-content px-lg` would have made the text column 1152 − 48 = 1104px
    — the gutter quietly paid for out of the measure, leaving `--container-content: 72rem` no
    longer the number it names. `Container` uses
    `max-w-[calc(var(--container-*)+2*var(--page-gutter))]`, so the column is exactly 72rem and
    the gutter is space beside it. `--page-gutter` lives on `:root` rather than in `@theme`,
    because it is read twice per container — as padding and inside that calc — and those two
    have to move together at the breakpoint.
- ~~Imagery treatment~~ — **decided**, now that there are real images to judge. Three
  parts, and one lesson that generalises:

  - **Two aspect ratios, both measured rather than chosen.** `4:3` for every photograph a
    reader is meant to look at — both galleries — because `archetype/data.md` surveyed
    the real files and found field-documentation photos with marketing watermarks and GPS
    camera stamps living on their edges, so anything tighter clips them. The district
    gallery was shipping square tiles against that finding and is now 4:3. `1:1` is the
    single exception: the 64px listing-row anchor, which is a mark saying where a row
    begins rather than a photograph anyone reads, and which has to match the initials
    square it stands in for.
  - **Cloudinary stays the optimiser, and the transform chain lives in one file.**
    `f_auto,q_auto` negotiate from the request headers, which a build-time optimiser
    cannot do at all. `c_fill,g_auto` is load-bearing and not a default — `g_north`
    returned pure sky and rendered blank white tiles on the specimen. `ar_` carries the
    ratio, so no height is ever computed in a component.
  - **`next/image` everywhere, through `images.loaderFile`.** The loader function cannot
    be a prop — it would have to cross the server boundary — so `loaderFile` is what
    makes `<Image>` usable from the server components that render almost everything here.
    It buys a real `srcset`, `priority` for archetype 1's eventual hero, and one place to
    change the chain. Next's own optimiser is out of the path entirely, so there are no
    `remotePatterns` and nothing is fetched at build time. Because the loader is global,
    it passes anything not on `res.cloudinary.com` through untouched — that is the
    `projects.image_url` legacy path and any future asset under `public/`.

  The lesson: **`sizes` is not a free improvement.** Writing `sizes="64px"` on the fixed
  64px thumb, which reads as obviously correct, switched `next/image` into fluid mode and
  emitted the entire device-width ladder — 16 srcset entries out to `w_3840` for a 64px
  square, with `src` falling back to the largest. Omitting it gives exactly `1x` and `2x`.
  `sizes` belongs only on something genuinely fluid, like the gallery grid. Same failure
  class as the rest of §8: it rendered as *nothing visibly wrong*.
- Whether state/district/city is one archetype or three.
