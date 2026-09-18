/**
 * geo-listing.md §5 section 17. Leaf pages only.
 *
 * The breadcrumb at the top already links the district, so this is a second
 * route to the same place — kept because it is at the bottom, which is where
 * a reader who has read the whole list of installers actually is, and the
 * label states what is there rather than repeating the place name alone.
 */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <p className="text-sm">
      <a href={href} className="text-ink-muted transition-colors duration-fast ease-standard hover:text-ink">
        ← {label}
      </a>
    </p>
  );
}
