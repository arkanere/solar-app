/**
 * Recent installations in the district. geo-listing.md §5 section 9, limit 6,
 * gated on `features.projects` (IN only today).
 *
 * This is the page's one genuinely photographic section — README §3's
 * "imagery beats any component restyle" — so the picture is the card and the
 * text is caption. The old card put a heading, a pincode, a date and an
 * installer name under every tile in four separate lines; that is a lot of
 * furniture around a photograph, and the pincode in particular is an internal
 * identifier a reader has no use for. It is dropped. Date and installer stay
 * as one caption line, because "who did this and when" is the only question a
 * photograph of someone else's roof raises.
 *
 * TILES ARE 4:3. They were square, and that was wrong: archetype/data.md
 * surveyed the real files and found field-documentation photographs carrying
 * marketing watermarks and GPS camera stamps along their edges, concluding
 * never to crop tighter than 4:3 because the overlays eat the edges. A square
 * is tighter. `g_auto` is load-bearing for the same survey — a top crop of a
 * rooftop photo is pure sky and a centre crop cuts through the overlays.
 *
 * A project with no image renders no tile at all rather than a "No Image"
 * placeholder. A gallery is a claim about work that can be seen; a grey box
 * saying the picture is missing is not a smaller version of that claim.
 *
 * `sizes` describes the grid, not the file: two columns of the page gutter's
 * width, three from `sm`, capped once the container stops growing at 72rem.
 * Without it next/image assumes 100vw and every phone downloads a desktop tile.
 *
 * The legacy `imageUrl` branch is `unoptimized`. It is dead code on live data —
 * all 130 visible projects have a `cloudinaryPublicId` — and those URLs are not
 * on Cloudinary, so the loader passes them through unchanged; asking for a
 * srcset would emit the same URL at six widths.
 */
import Image from 'next/image';

import { cloudinarySrc } from '@/lib/directory/cloudinary';
import { formatDate } from '@/lib/directory/format';
import { projectUrl } from '@/lib/directory/urls';
import type { ProjectCard } from '@/lib/directory/types';

/** "acme-installers" -> "Acme Installers". The gallery has no other name for
 *  the business — joining business_profiles would cost a query to render a
 *  name the installer column above already shows. Carried across from
 *  apps/main-app/src/lib/constants/projectFormatters.ts. */
function businessName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function ProjectGallery({
  projects,
  country,
  place,
  locale
}: {
  projects: ProjectCard[];
  country: string;
  place: string;
  locale: string;
}) {
  const withImage = projects.filter((p) => p.cloudinaryPublicId || p.imageUrl);
  if (withImage.length === 0) return null;

  return (
    <>
      <h2 className="text-xl">Recent installations in {place}</h2>
      <ul className="mt-lg grid grid-cols-2 gap-md sm:grid-cols-3">
        {withImage.map((p) => (
          <li key={p.id}>
            <a href={`${projectUrl(country, p.slug)}/`} data-unstyled className="group block">
              <Image
                src={
                  p.cloudinaryPublicId
                    ? cloudinarySrc(p.cloudinaryPublicId, '4:3')
                    : p.imageUrl!
                }
                alt={`${p.title} — solar installation in ${place}`}
                width={400}
                height={300}
                sizes="(min-width: 1152px) 384px, (min-width: 640px) 33vw, 50vw"
                unoptimized={!p.cloudinaryPublicId}
                className="aspect-[4/3] w-full rounded-lg border border-line object-cover"
              />
              <h3 className="mt-sm text-sm leading-snug group-hover:underline">{p.title}</h3>
              <p className="mt-2xs text-xs text-ink-subtle">
                {businessName(p.businessSlug)} · {formatDate(p.projectDate, locale)}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
