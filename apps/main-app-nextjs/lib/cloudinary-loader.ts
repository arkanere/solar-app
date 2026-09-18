/**
 * The imagery policy, as code. `next.config.ts` points `images.loaderFile`
 * here, so EVERY <Image> in this app — the listing row anchor, both galleries,
 * and whatever archetypes 1 and 3 add — resolves through this one function.
 *
 * WHY A loaderFile AND NOT A PLAIN <img>. next/image is a client component and
 * takes its `loader` as a function prop, which cannot cross the server
 * boundary: passing one from a server component fails at render with
 * "Functions cannot be passed directly to Client Components". `loaderFile` is
 * the documented way round it — the module is resolved by config, not passed
 * as a prop, so server components can render <Image> normally. That is the
 * whole reason the two directory components carried a plain <img> and an
 * eslint-disable until now.
 *
 * WHAT IT BUYS over the hand-rolled <img> it replaces: a real `srcset` driven
 * by `sizes`, so a tile in a 2-up mobile grid does not download the 3-up
 * desktop width; `priority` for the LCP image once archetype 1 has a hero; and
 * one place to change the transform chain. Next's own optimiser is NOT in the
 * path — a custom loader returns a URL and Next fetches nothing — so
 * Cloudinary stays the optimiser, which is correct: it already does format and
 * quality negotiation from the request headers, which a build-time optimiser
 * cannot.
 *
 * THE SRC CONTRACT. A Cloudinary image is addressed by its bare delivery URL,
 * built by `lib/directory/cloudinary.ts`:
 *
 *     https://res.cloudinary.com/<cloud>/image/upload/<publicId>[?ar=4:3]
 *
 * and this function injects the transform segment. An absolute URL rather than
 * a bare public id on purpose: next/image validates `src`, and an absolute
 * https URL passes every check without special-casing.
 *
 * `ar` is a query parameter because a loader is only ever handed `src`, `width`
 * and `quality` — the aspect ratio has to travel inside the src or not at all.
 * Cloudinary's own `ar_` does the rest, so one `w_` from next/image is enough
 * and no height is computed anywhere.
 *
 * ANYTHING NOT ON res.cloudinary.com IS RETURNED UNCHANGED. That is the
 * pass-through for `projects.image_url`, the pre-Cloudinary path, and for any
 * future asset under `public/`. It matters because a loaderFile is global:
 * every <Image> in the app hits this, not just the Cloudinary ones.
 *
 * TRANSFORM CHAIN, and why each part is there:
 *   f_auto, q_auto  — format and quality from the request. Not ours to guess.
 *   c_fill, g_auto  — g_auto is load-bearing, not a default. These are rooftop
 *                     photographs: g_north returns pure sky (it rendered blank
 *                     white tiles on the specimen) and a centre crop cuts
 *                     through the watermarks and GPS stamps installers bake
 *                     along the edges. archetype/data.md has the survey.
 *   ar_<ratio>      — only when the caller asked for a fixed box.
 *   w_<width>       — from next/image's srcset, the only reason this is a
 *                     loader rather than a constant.
 *
 * Client-bundled, so it stays dependency-free and must not import server code.
 */

/** Group 1 is the delivery prefix, group 2 everything after `upload/` —
 *  version segment, folders and public id included. The cloud name is
 *  deliberately not matched: it lives in lib/directory/cloudinary.ts, once. */
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

export default function cloudinaryLoader({ src, width }: { src: string; width: number }): string {
  const match = CLOUDINARY_UPLOAD.exec(src);
  if (!match) return src;

  const [, prefix, rest] = match;
  const [publicId, query] = rest!.split('?');
  const ar = query ? new URLSearchParams(query).get('ar') : null;

  const transform = ['f_auto', 'q_auto', 'c_fill', 'g_auto', ar && `ar_${ar}`, `w_${width}`]
    .filter(Boolean)
    .join(',');

  return `${prefix}${transform}/${publicId}`;
}
