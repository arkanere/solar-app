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
 * SQUARE, AND THE ONLY SQUARE IN THE APP. The galleries are 4:3, because
 * archetype/data.md found watermarks and GPS stamps living on the edges of
 * these photographs. This box is the deliberate exception: at 64px it is a mark
 * saying where a row begins, not a photograph anyone reads, and the initials
 * fallback it has to match is a square by nature. `g_auto` keeps the subject in
 * frame; see lib/cloudinary-loader.ts.
 *
 * NO `sizes` PROP, DELIBERATELY. It looks like the right thing to write on a
 * fixed 64px box and it is the opposite: `sizes` puts next/image into fluid
 * mode, where the srcset is the whole device-width ladder — 16 entries out to
 * w_3840 for a 64px square, with `src` falling back to the largest of them.
 * That is ~16KB of extra markup on a 22-row page, and a 3840px download in any
 * client that ignores `sizes`. Left off, next/image emits exactly two entries,
 * 1x and 2x, from `width` — which is what the old hand-rolled <img> hardcoded
 * as `size * 2`, now chosen by the device's pixel ratio instead of assumed.
 *
 * The gallery keeps its `sizes` because its tiles really are fluid.
 */
import Image from 'next/image';

import { cloudinarySrc, initials } from '@/lib/directory/cloudinary';
import type { InstallerRowData } from '@/lib/directory/types';

export function WorkThumb({ b, size = 64 }: { b: InstallerRowData; size?: number }) {
  if (b.thumb) {
    return (
      <Image
        src={cloudinarySrc(b.thumb, '1:1')}
        alt=""
        width={size}
        height={size}
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
