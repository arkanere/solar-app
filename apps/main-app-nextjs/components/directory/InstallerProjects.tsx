/**
 * The installer's own recent work. installer-profile.md §3 section 9, up to
 * 12 tiles, gated on `features.projects` (IN only today).
 *
 * This is a SEPARATE component from ProjectGallery rather than a variant of
 * it, and the reason is the caption. The district gallery answers "who did
 * this and when", because its tiles come from different businesses; on a
 * profile the who is the page, so the caption is where and when instead. Two
 * props' worth of difference would have been one component; a different
 * question is two. They share the date rule through lib/directory/format.ts,
 * which is the part that must not drift.
 *
 * WHY IT SITS HIGH ON THE PAGE. §4 is explicit: on the 38 profiles that have
 * one, the gallery is the only proof of work anywhere on the page, and it
 * currently renders eighth, below three rows of chips that are identical on
 * 90% of profiles. On the other 605 this section is absent and the page is
 * shorter, which is the correct outcome.
 *
 * The pincode stays here, unlike the district gallery which drops it. There it
 * is an internal identifier for a place the page has already named; here it is
 * the only thing that says WHERE this roof is, and "did they work near me" is
 * the second question a photograph raises.
 *
 * 4:3, `g_auto`, and no tile at all for a project with no photograph — all
 * three for the reasons ProjectGallery records. The old page cropped these
 * square at w_300,h_300.
 */
import Image from 'next/image';

import { cloudinarySrc } from '@/lib/directory/cloudinary';
import { formatDate } from '@/lib/directory/format';
import { projectUrl } from '@/lib/directory/urls';
import type { ProjectCard } from '@/lib/directory/types';

export function InstallerProjects({
  projects,
  country,
  name,
  locale
}: {
  projects: ProjectCard[];
  country: string;
  name: string;
  locale: string;
}) {
  const withImage = projects.filter((p) => p.cloudinaryPublicId || p.imageUrl);
  if (withImage.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl">Recent installations</h2>
      <ul className="mt-lg grid grid-cols-2 gap-md lg:grid-cols-3">
        {withImage.map((p) => (
          <li key={p.id}>
            <a href={`${projectUrl(country, p.slug)}/`} data-unstyled className="group block">
              <Image
                src={p.cloudinaryPublicId ? cloudinarySrc(p.cloudinaryPublicId, '4:3') : p.imageUrl!}
                alt={`${p.title} — installed by ${name}`}
                width={400}
                height={300}
                // The main column is at most 2/3 of a 72rem page, so a tile
                // caps around 280px; below `lg` it is half the viewport.
                sizes="(min-width: 1024px) 288px, 50vw"
                unoptimized={!p.cloudinaryPublicId}
                className="aspect-[4/3] w-full rounded-lg border border-line object-cover"
              />
              {/* Clamped, unlike the district gallery: up to twelve tiles here against
                  six there, and these titles run to a sentence, so without it the
                  caption lines stop aligning across the rows. */}
              <h3 className="mt-sm line-clamp-2 text-sm leading-snug group-hover:underline">
                {p.title}
              </h3>
              <p className="mt-2xs text-xs tabular-nums text-ink-subtle">
                {p.pincode} · {formatDate(p.projectDate, locale)}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
