/**
 * The visual anchor for a listing row.
 *
 * Rooftop solar is a visual product, and a photograph of a finished
 * installation is the most persuasive thing a local installer has. Where one
 * exists it leads the row. Where one does not, initials hold the same slot so
 * the column keeps a single rhythm and the eye can still run down it — an empty
 * box, or a row that changes height, would break the scan.
 *
 * Only ~6% of rows have a photograph (archetype/data.md), so the initials path
 * is the common one and has to look deliberate rather than like a failure.
 *
 * WHY A PLAIN <img> AND NOT next/image. next/image is a client component and
 * takes its loader as a function prop, which cannot cross the server boundary —
 * passing `loader={squareLoader}` from this server component fails at render
 * with "Functions cannot be passed directly to Client Components". The ways
 * round it are a global `loaderFile` in next.config.ts, or making every row
 * thumbnail a client component.
 *
 * Neither is worth it here, and next/image would buy nothing this does not
 * already have: Cloudinary does the resizing and format negotiation, the box is
 * a fixed 64px square so width and height are known and no layout shift is
 * possible, and `loading="lazy"` is one attribute. A global loaderFile is also
 * a decision that belongs with the imagery policy design-foundation.md §9 still
 * defers — it would have to serve the profile gallery's 4:3 crops too, and
 * those are archetype 1.
 *
 * The 2x source is deliberate: these are small and the directory's readers are
 * overwhelmingly on phones.
 */
import { initials, thumbUrl } from '@/lib/directory/cloudinary';
import type { InstallerRowData } from '@/lib/directory/types';

export function WorkThumb({ b, size = 64 }: { b: InstallerRowData; size?: number }) {
  if (b.thumb) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- see the note above: Cloudinary is the optimiser, and next/image cannot take a loader from a server component.
      <img
        src={thumbUrl(b.thumb, size * 2, size * 2)}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="shrink-0 rounded-md border border-line object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-md border border-line bg-surface-sunken text-sm font-semibold text-ink-subtle"
      style={{ width: size, height: size }}
    >
      {initials(b.name)}
    </span>
  );
}
