/**
 * Addressing for directory photographs. The transform chain is NOT here — it
 * lives in lib/cloudinary-loader.ts, which next/image calls once per srcset
 * entry. This file only names the image and the box it has to fill.
 *
 * The cloud name is public — it is in every image URL the live site serves —
 * and this is the one place it appears.
 *
 * ASPECT RATIOS. Two, and both are measurements rather than taste:
 *
 *   4:3  every photograph a reader is meant to look at — both galleries.
 *        archetype/data.md surveyed the real files and found field-
 *        documentation photos carrying marketing watermarks and GPS camera
 *        stamps along their edges, and concluded: never crop tighter than 4:3
 *        without checking, because the overlays eat the edges. Square gallery
 *        tiles were shipping against that finding; they are now 4:3.
 *
 *   1:1  the 64px listing-row anchor only. At that size it is a mark telling
 *        the eye where a row starts, not a photograph anyone reads, and the
 *        column's rhythm depends on every row being the same square whether it
 *        holds a photo or initials.
 */
const CLOUD = 'djiuiq129';

/** Cloudinary aspect ratios, in Cloudinary's own `ar_` syntax. */
export type Ratio = '4:3' | '1:1';

/**
 * The bare delivery URL for a public id, plus the box it should fill. The
 * loader turns this into the real URL; see lib/cloudinary-loader.ts for why
 * the ratio travels as a query parameter.
 */
export function cloudinarySrc(publicId: string, ratio: Ratio): string {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${publicId}?ar=${ratio}`;
}

/** Initials, for the ~94% of rows with no photograph yet. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter((w) => /[a-z0-9]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}
