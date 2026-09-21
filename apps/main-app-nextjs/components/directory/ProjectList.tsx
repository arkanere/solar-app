/**
 * The public project gallery's grid — `/{cc}/recent-solar-installation-projects`.
 *
 * NOT the same component as ProjectGallery, and the difference is what the
 * card has to answer. The gallery is a section inside a district page or an
 * installer profile, where the place and often the installer are already
 * established by the page around it; this grid IS the page, so each card
 * carries its own attribution.
 *
 * What it does share is the rule that matters: tiles are 4:3 and a project
 * with no image renders no tile. archetype/data.md's survey found field
 * photographs with watermarks and GPS stamps along the edges, so nothing
 * crops tighter than 4:3, and `g_auto` is load-bearing because a top crop of
 * a rooftop photo is sky.
 *
 * Three things the SvelteKit card had that are gone:
 *
 *  - **the pincode.** "Pincode: 411038" is an internal identifier a reader
 *    has no use for; ProjectGallery dropped it for the same reason.
 *  - **the "No Image" grey box.** A gallery is a claim about work that can be
 *    seen, and a box saying the picture is missing is not a smaller version
 *    of that claim.
 *  - **the `system_size` row.** The component read `project.system_size`,
 *    which the loader never selected and the table does not have — a branch
 *    that could not render.
 *
 * The lift-and-shadow hover is gone too: design-foundation.md §7 keeps
 * elevation for things that float OVER content. The hover here is the title
 * underlining, which is what says the tile is a link.
 */
import Image from 'next/image';

import { cloudinarySrc } from '@/lib/directory/cloudinary';
import { formatDate } from '@/lib/directory/format';
import { projectUrl } from '@/lib/directory/urls';
import type { ProjectCard } from '@/lib/directory/types';

/** "acme-installers" -> "Acme Installers". Same call as ProjectGallery: the
 *  list has no other name for the business, and joining business_profiles to
 *  render nine names would cost a query per page of the pager. */
function businessName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function ProjectList({
  projects,
  country,
  locale
}: {
  projects: ProjectCard[];
  country: string;
  locale: string;
}) {
  const withImage = projects.filter((p) => p.cloudinaryPublicId || p.imageUrl);
  if (withImage.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
      {withImage.map((p) => (
        <li key={p.id}>
          <a href={projectUrl(country, p.slug)} data-unstyled className="group block">
            <Image
              src={p.cloudinaryPublicId ? cloudinarySrc(p.cloudinaryPublicId, '4:3') : p.imageUrl!}
              alt={`${p.title} — completed solar installation`}
              width={400}
              height={300}
              // Three columns from lg, two from sm, one below. Capped once the
              // container stops growing at 72rem. Without this next/image
              // assumes 100vw and a phone downloads a desktop tile.
              sizes="(min-width: 1152px) 373px, (min-width: 640px) 50vw, 100vw"
              unoptimized={!p.cloudinaryPublicId}
              className="aspect-[4/3] w-full rounded-lg border border-line object-cover"
            />
            <h2 className="mt-sm text-base leading-snug group-hover:underline">{p.title}</h2>
            <p className="mt-2xs text-xs text-ink-subtle">
              {businessName(p.businessSlug)} · {formatDate(p.projectDate, locale)}
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}
