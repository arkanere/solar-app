/**
 * Vertical rhythm. One column, one gap, taken from the spacing scale.
 *
 * design-foundation.md §7: "one 4px-based scale, 2xs…3xl, plus a fluid
 * --spacing-section. Layout primitives apply it; pages will not." This is the
 * primitive that applies it.
 *
 * It uses `gap` rather than margins on purpose. Margins are per-child, so
 * spacing depends on what each child happens to carry, collapses in ways that
 * are hard to predict, and needs a `last:` reset at the end of every list. A
 * gap is one number owned by the parent — which is the whole point of having
 * a rhythm.
 *
 * `as` exists because the rhythm is just as often wanted on a list or a
 * <main> as on a <div>, and wrapping one in the other only to get a gap adds
 * an element for nothing. The union is short and stays short.
 */

/** Full class strings, not built by template — Tailwind only sees literals. */
const GAPS = {
  '2xs': 'gap-2xs',
  xs: 'gap-xs',
  sm: 'gap-sm',
  md: 'gap-md',
  lg: 'gap-lg',
  xl: 'gap-xl',
  '2xl': 'gap-2xl',
  '3xl': 'gap-3xl',
  /** Fluid, 48-80px. Between page sections only — PageShell uses this. */
  section: 'gap-section'
} as const;

export type StackGap = keyof typeof GAPS;

export function Stack({
  gap = 'md',
  as: Tag = 'div',
  children
}: {
  gap?: StackGap;
  as?: 'div' | 'main' | 'section' | 'ul' | 'ol' | 'dl';
  children: React.ReactNode;
}) {
  return <Tag className={`flex flex-col ${GAPS[gap]}`}>{children}</Tag>;
}
