/**
 * Formatting shared by the two project galleries — the district's (archetype
 * 2) and the installer profile's (archetype 1).
 *
 * It moved out of ProjectGallery.tsx when the profile gallery arrived: both
 * render the same column out of the same table, and a date rule copied into
 * two files is a date rule that will disagree with itself.
 */

/**
 * A `date` column, so it arrives as 'YYYY-MM-DD' with no zone. Formatting it
 * through the locale is safe; parsing it as a Date and reading local parts
 * would not be — CLAUDE.md's timestamp trap, one table over.
 *
 * Month and year only. The day is precision the reader cannot use: "Jul 2026"
 * answers "is this recent work?", which is the whole question a date on a
 * photograph raises.
 */
export function formatDate(value: string, locale: string): string {
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return value;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC'
  });
}
