/**
 * Cloudinary URL building for directory photographs.
 *
 * The cloud name is public — it is in every image URL the live site serves.
 *
 * Crop gravity is `g_auto`, and it is not a detail. These are rooftop
 * photographs: crop from the top and a square thumbnail is pure sky, crop from
 * the centre and you cut through the watermarks and phone numbers installers
 * bake along the bottom edge. `g_auto` picks the subject instead. Verified by
 * rendering on the specimen sheet — `g_north` produced blank white tiles.
 */
const CLOUD = 'djiuiq129';

export function thumbUrl(id: string, w: number, h: number): string {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/c_fill,g_auto,w_${w},h_${h},q_auto,f_auto/${id}`;
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
