/**
 * One solar installation project — `/{cc}/project/{slug}`. 144 pages, IN only.
 *
 * Ported from apps/main-app/src/routes/[country=country]/(layout-1)/project/
 * [project_id]/+page.svelte and its loader.
 *
 * The page is a photograph and an attribution. Everything else on it exists
 * to answer the two questions a picture of someone else's roof raises — who
 * built this, and where — so the layout is: image, title, facts, installer,
 * place, and out.
 *
 * What the port changes, and why:
 *
 *  - **`window.location.href` is gone.** The original's "View Installer
 *    Profile" was a <Button onclick={...}> doing a JS navigation to a URL
 *    that was already an anchor two lines above it. It is one link now, so
 *    it works without JavaScript and can be opened in a new tab.
 *  - **the hero is next/image.** The original hand-built a Cloudinary URL at
 *    a fixed `w_800` — no srcset, so a phone downloaded the desktop file.
 *    lib/cloudinary-loader.ts exists precisely so no page writes a transform.
 *  - **the hero is NOT cropped.** Every other image in the app is a 4:3 tile;
 *    this one is the subject of the page, so it keeps the photographer's
 *    frame. That is why it passes no `ar` and uses `object-contain` inside a
 *    min-height box rather than `c_fill`.
 *  - **the pincode chip is kept here** though both galleries drop it. On a
 *    tile it is noise beside a caption; on the detail page it is the only
 *    precise location the row carries, and `district` is often the
 *    installer's rather than the project's.
 *  - **the `{n}kW guide` link is gated on the family being real.** The
 *    original regex-matched a size out of the title and linked to
 *    `/rooftop-solar/{n}kw-system` for ANY number it found, so a "12kW"
 *    project linked to a page that does not exist. The five sizes that have
 *    an article are listed.
 *  - **no `Article` JSON-LD.** The original emitted one with the installer as
 *    `author`. A photograph with a title is not an article, it has no body
 *    and no author in the sense the type means. `ImageObject` inside the
 *    breadcrumb trail is the honest description, and that is what ships.
 *
 * No client components: every control is an anchor.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CalendarCheck, Hash, MapPin } from 'lucide-react';
import { PageShell, Section, Stack } from '@/components/layout';
import { BackLink, Breadcrumb, QuoteCTA, type Crumb } from '@/components/directory';
import { getCountry, isCountry } from '@/lib/countries';
import { cloudinarySrc } from '@/lib/directory/cloudinary';
import { getProjectPage } from '@/lib/directory/data';
import { formatDate } from '@/lib/directory/format';
import { BASE_URL, breadcrumbLD } from '@/lib/directory/structuredData';
import { contentUrl, geoUrl, installerUrl, projectUrl } from '@/lib/directory/urls';
import { pageMetadata } from '@/lib/metadata';
import type { ProjectDetail } from '@/lib/directory/types';

/** 15 days, matching `config.isr.expiration` on the SvelteKit load. */
export const revalidate = 1296000;
/**
 * Empty on purpose: this is what turns ISR on, and it is the port of
 * `config.isr` from the SvelteKit load. Do not "tidy" it into a list of real
 * params — that is the variant that couples a ~1,380-page build to the
 * database. See "ISR needs `generateStaticParams` too" in the README.
 */
export async function generateStaticParams() {
  return [];
}


type Params = { params: Promise<{ country: string; project_id: string }> };

/**
 * The sizes that actually have an article under `/rooftop-solar`. Anything
 * else in a title — 12kW, 100kW, a stray "4kw" — gets no link rather than a
 * link to a 404. Matches the chip rows on the district page.
 */
const GUIDE_SIZES = [1, 2, 3, 5, 10];

/** Projects are IN-only and no layout gates it, so the route carries it. */
function gate(country: string) {
  if (!isCountry(country)) return null;
  const config = getCountry(country);
  return config.features.projects ? config : null;
}

/** Slugs are stored lowercase; a mixed-case URL should still find the page. */
async function read(params: Params['params']) {
  const { country, project_id } = await params;
  if (!gate(country)) return null;
  return getProjectPage(project_id.toLowerCase());
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { country } = await params;
  const config = gate(country);
  const data = await read(params);
  if (!config || !data) return {};

  const { project, business } = data;
  const where = project.city || project.district;

  return pageMetadata({
    title: `${project.title} by ${business.name}`,
    // Built from the facts that actually vary per row, for the reason
    // lib/metadata.ts gives about the installer description: the original
    // interpolated pincode and district into a fixed sentence and produced
    // near-identical copy wherever either was blank.
    description:
      `${project.title} — a completed solar installation by ${business.name}` +
      `${where ? ` in ${where}` : ''}, ${formatDate(project.projectDate, config.locale)}. ` +
      `See the work and get quotes from verified installers nearby.`,
    path: projectUrl(country, project.slug),
    locale: config.locale,
    imageAlt: `${project.title} by ${business.name}`,
    ...(project.district && business.level1
      ? { geo: { region: business.level1, placename: project.district } }
      : {})
  });
}

/** One fact about the project: an icon and a value. */
function Fact({ icon: Icon, children }: { icon: typeof Hash; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-xs rounded-md border border-line bg-surface px-sm py-2xs text-sm text-ink-muted">
      <Icon aria-hidden className="h-4 w-4 shrink-0 text-ink-subtle" />
      {children}
    </li>
  );
}

/** The sentence linking the project back into the geo directory. */
function Place({ data, country }: { data: ProjectDetail; country: string }) {
  const { project, level1Slug, level2Slug } = data;
  if (!level1Slug || !level2Slug || !project.district) return null;

  const citySlug = project.city?.trim().toLowerCase().replace(/\s+/g, '-');

  return (
    <Stack gap="sm">
      <h2 className="text-xl">Where this is</h2>
      <p className="max-w-prose text-ink-muted">
        This installation is in{' '}
        {project.city && citySlug ? (
          <>
            <a href={geoUrl(country, level1Slug, level2Slug, citySlug)}>{project.city}</a>,{' '}
          </>
        ) : null}
        <a href={geoUrl(country, level1Slug, level2Slug)}>{project.district}</a>. See every
        installer working in the area, and the other projects they have published.
      </p>
    </Stack>
  );
}

export default async function Page({ params }: Params) {
  const { country } = await params;
  const config = gate(country);
  if (!config) notFound();

  const data = await read(params);
  if (!data) notFound();

  const { project, business } = data;
  const profileHref = installerUrl(country, business.slug);

  const trail: Crumb[] = [
    { name: 'Home', href: '/' },
    { name: 'Solar', href: geoUrl(country) },
    { name: business.name, href: profileHref },
    { name: project.title }
  ];

  // A 4:3 tile crops; this does not. `cloudinarySrc` with no ratio returns
  // the bare delivery URL, and the loader then emits f_auto/q_auto/w_ only.
  const hero = project.cloudinaryPublicId
    ? cloudinarySrc(project.cloudinaryPublicId)
    : project.imageUrl;

  const sizeMatch = /(\d+)\s*kw/i.exec(project.title);
  const sizeKw = sizeMatch ? Number(sizeMatch[1]) : null;
  const guideSize = sizeKw !== null && GUIDE_SIZES.includes(sizeKw) ? sizeKw : null;

  return (
    <PageShell>
      <Section>
        <Stack gap="md">
          <Breadcrumb trail={trail} />
          <h1 className="text-2xl leading-tight">{project.title}</h1>
        </Stack>
      </Section>

      {hero ? (
        <Section>
          <Image
            src={hero}
            alt={`${project.title} — installed by ${business.name}`}
            width={1200}
            height={900}
            // The LCP image on every one of these 144 pages.
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            unoptimized={!project.cloudinaryPublicId}
            className="w-full rounded-lg border border-line bg-surface-sunken object-contain"
          />
        </Section>
      ) : null}

      <Section>
        <Stack gap="lg">
          <ul className="flex flex-wrap gap-xs">
            <Fact icon={CalendarCheck}>{formatDate(project.projectDate, config.locale)}</Fact>
            {project.district ? <Fact icon={MapPin}>{project.district}</Fact> : null}
            {project.pincode ? (
              <Fact icon={Hash}>
                <span className="tabular-nums">{project.pincode}</span>
              </Fact>
            ) : null}
          </ul>

          {/* The attribution. It is the point of the page, so it is a panel
              rather than a line — and the installer's name is the link, not a
              button beside it. */}
          <div className="rounded-lg border border-line bg-surface p-md">
            <p className="text-sm text-ink-subtle">Installed by</p>
            <p className="mt-2xs text-lg font-semibold">
              <a href={profileHref}>{business.name}</a>
            </p>
            {business.city && business.level1 ? (
              <p className="mt-2xs text-sm text-ink-muted">
                {business.city}, {business.level1}
              </p>
            ) : null}
          </div>

          {guideSize !== null ? (
            <p className="text-sm text-ink-muted">
              Thinking about a system this size?{' '}
              <a href={contentUrl(`/rooftop-solar/${guideSize}kw-system`)}>
                Read the {guideSize}kW solar system guide
              </a>
              .
            </p>
          ) : null}
        </Stack>
      </Section>

      <Section>
        <Place data={data} country={country} />
      </Section>

      <Section>
        <QuoteCTA country={country} place={project.district || config.name} />
      </Section>

      <Section>
        <BackLink href={profileHref} label={`More work by ${business.name}`} />
      </Section>

      {/* BreadcrumbList from the trail the breadcrumb renders. No Article —
          see the file header. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(trail),
            ...(project.cloudinaryPublicId
              ? [
                  {
                    '@context': 'https://schema.org',
                    '@type': 'ImageObject',
                    contentUrl: hero,
                    name: project.title,
                    creditText: business.name,
                    url: `${BASE_URL}${projectUrl(country, project.slug)}`
                  }
                ]
              : [])
          ])
        }}
      />
    </PageShell>
  );
}
