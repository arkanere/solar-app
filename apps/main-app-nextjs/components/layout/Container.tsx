/**
 * Horizontal measure and page gutter. The only thing in the app allowed to
 * centre a column and cap its width.
 *
 * design-foundation.md decided three measures and nothing else: 68ch for
 * article body, 44rem for forms and legal, 72rem for the directory surface.
 * They live in globals.css as --container-* and Tailwind turns them into
 * max-w-prose / max-w-narrow / max-w-content. Before this file, no code used
 * them: both specimen pages wrote `mx-auto max-w-* px-md` by hand, which is
 * how the SvelteKit app ended up with a container per page.
 *
 * The gutter is part of the measure, not a separate decision. A page that
 * picks its own gutter breaks alignment with every other page, so it is set
 * here once, from --page-gutter in globals.css: 16px on mobile, 24px from the
 * sm breakpoint.
 *
 * The gutter is ADDED to the max-width rather than eaten out of it. Tailwind
 * boxes are border-box, so a plain `max-w-content px-lg` would have made the
 * text column 1152 - 48 = 1104px — the gutter silently paid for out of the
 * measure, and --container-content no longer the number it claims to be. With
 * the calc, the column is 1152px at every width above the breakpoint and the
 * gutter is genuinely extra space beside it.
 *
 * There is deliberately no `className` prop. The point of the primitive is
 * that the width and the gutter are not negotiable per page; a page that
 * needs something else nests its own element inside.
 */

/** Full class strings, not built by template — Tailwind only sees literals. */
const WIDTHS = {
  /** 72rem — directory pages: listings, profiles, tables. */
  content: 'max-w-[calc(var(--container-content)+2*var(--page-gutter))]',
  /** 44rem — forms, legal, single-column pages. */
  narrow: 'max-w-[calc(var(--container-narrow)+2*var(--page-gutter))]',
  /** 68ch — article body. */
  prose: 'max-w-[calc(var(--container-prose)+2*var(--page-gutter))]'
} as const;

export type ContainerWidth = keyof typeof WIDTHS;

export function Container({
  width = 'content',
  children
}: {
  width?: ContainerWidth;
  children: React.ReactNode;
}) {
  return (
    <div className={`mx-auto w-full px-[var(--page-gutter)] ${WIDTHS[width]}`}>{children}</div>
  );
}
