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
 * Tiles are square and `g_auto`, for the reason lib/directory/cloudinary.ts
 * records: these are rooftop photographs, so a top crop is sky and a centre
 * crop cuts through the watermarks installers bake along the bottom edge.
 *
 * A project with no image renders no tile at all rather than a "No Image"
 * placeholder. A gallery is a claim about work that can be seen; a grey box
 * saying the picture is missing is not a smaller version of that claim.
 *
 * Plain <img> for the same reason as WorkThumb — next/image is a client
 * component and cannot take a loader from a server component, Cloudinary is
 * already the optimiser, and the box is a fixed aspect ratio so there is no
 * layout shift to prevent. The broader next/image policy is still open
 * (design-foundation.md §9, README item 9).
 */
import { thumbUrl } from '@/lib/directory/cloudinary';
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

/** The date column is a plain `date`, so it arrives as 'YYYY-MM-DD' with no
 *  zone. Formatting it through the locale is safe; parsing it as a Date and
 *  reading local parts would not be — CLAUDE.md's timestamp trap, one table
 *  over. */
function formatDate(value: string, locale: string): string {
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return value;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC'
  });
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
              {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary is the optimiser; next/image cannot take a loader from a server component. See WorkThumb. */}
              <img
                src={
                  p.cloudinaryPublicId ? thumbUrl(p.cloudinaryPublicId, 600, 600) : p.imageUrl!
                }
                alt={`${p.title} — solar installation in ${place}`}
                width={300}
                height={300}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded-lg border border-line object-cover"
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
