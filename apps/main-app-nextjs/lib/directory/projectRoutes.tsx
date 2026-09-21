/**
 * The two project-list routes, once.
 *
 * `/{cc}/recent-solar-installation-projects` and its `/{page_slug}` are the
 * same page; the only difference is where the page number comes from. In the
 * SvelteKit app they are two loaders of ~55 lines that differ by six, and the
 * drift that caused is documented in Pager.tsx — the unpaginated one
 * hardcoded `currentPage = 1` in its component while its loader computed it.
 *
 * Same arrangement as lib/editorial/routes.tsx: Next needs a real `page.tsx`
 * per route, so what the files can do is hold no logic.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb, Pager, ProjectList, QuoteCTA, type Crumb } from '@/components/directory';
import { getCountry, isCountry } from '@/lib/countries';
import { getProjectList, PROJECTS_PER_PAGE } from '@/lib/directory/data';
import { BASE_URL, breadcrumbLD } from '@/lib/directory/structuredData';
import { geoUrl, projectUrl } from '@/lib/directory/urls';
import { pageMetadata } from '@/lib/metadata';

/*
 * The ISR window is 1 day — `config.isr.expiration` on both SvelteKit loads,
 * and shorter than the rest of the directory because this list is ordered by
 * date and a new project should surface within a day, not a fortnight.
 *
 * It is NOT exported from here. Next reads `revalidate` by static analysis of
 * the route file and cannot follow a re-export, so each of the two routes
 * declares the literal itself.
 */

const LIST_PATH = '/recent-solar-installation-projects';

function listUrl(country: string, page: number): string {
  const base = `/${country}${LIST_PATH}`;
  // Page 1 is the bare path, never `/1`. Two URLs for one page of results is
  // a duplicate, and the canonical below has to name exactly one of them.
  return page <= 1 ? base : `${base}/${page}`;
}

/**
 * Projects are IN-only (`features.projects`) and no layout enforces it, so
 * each route carries the gate — the same note the SvelteKit loaders carry.
 * Without it India's project data is served under every country prefix.
 */
function gate(country: string) {
  if (!isCountry(country)) return null;
  const config = getCountry(country);
  return config.features.projects ? config : null;
}

function meta(country: string, page: number, total: number): Metadata {
  const config = getCountry(country);
  const suffix = page > 1 ? ` — Page ${page}` : '';

  return pageMetadata({
    title: `Recent Solar Installation Projects in ${config.name}${suffix}`,
    // The original ran one description on every page of the pager, so all 16
    // shipped identical copy. The page number is in it here for the same
    // reason it is in the title: 16 results that differ only by URL are 16
    // near-duplicates to a search engine.
    description:
      `Browse ${total.toLocaleString(config.locale)} solar panel installations completed by ` +
      `verified installers across ${config.name}. Real rooftop projects with locations and ` +
      `completion dates${suffix ? `, page ${page}` : ''}.`,
    path: listUrl(country, page),
    locale: config.locale,
    imageAlt: `Recent solar installation projects in ${config.name}`
  });
}

/**
 * One implementation, two routes. `resolvePage` is what differs: the bare
 * route is always page 1, the `[page_slug]` route parses its segment.
 */
function listRoute<P extends { country: string }>(resolvePage: (params: P) => number | null) {
  type Args = { params: Promise<P> };

  async function generateMetadata({ params }: Args): Promise<Metadata> {
    const p = await params;
    if (!gate(p.country)) return {};
    const page = resolvePage(p);
    if (page === null) return {};

    const data = await getProjectList(page);
    // A page past the end 404s below; metadata for it is the layout default.
    return page > data.totalPages && data.totalPages > 0 ? {} : meta(p.country, page, data.total);
  }

  async function Page({ params }: Args) {
    const p = await params;
    const config = gate(p.country);
    if (!config) notFound();

    const page = resolvePage(p);
    if (page === null) notFound();

    const data = await getProjectList(page);
    // Past the end is a 404, but an empty TABLE is not: page 1 of nothing is
    // an honest empty answer, the same call the state hub makes.
    if (page > data.totalPages && data.totalPages > 0) notFound();

    const trail: Crumb[] = [
      { name: 'Home', href: '/' },
      { name: 'Solar', href: geoUrl(p.country) },
      ...(page > 1
        ? [{ name: 'Recent projects', href: listUrl(p.country, 1) }, { name: `Page ${page}` }]
        : [{ name: 'Recent projects' }])
    ];

    const first = (page - 1) * PROJECTS_PER_PAGE + 1;
    const last = first + data.projects.length - 1;

    return (
      <PageShell>
        <Section>
          <Stack gap="md">
            <Breadcrumb trail={trail} />
            <header>
              <h1 className="text-2xl leading-tight">
                Recent solar installations in {config.name}
              </h1>
              <p className="mt-sm max-w-prose text-ink-muted">
                {data.total === 0 ? (
                  <>
                    No projects have been published yet.{' '}
                    <a href={geoUrl(p.country)}>Browse solar installers</a> instead.
                  </>
                ) : (
                  <>
                    Real rooftop work, published by the installers who did it. Showing{' '}
                    <span className="tabular-nums">
                      {first}&ndash;{last}
                    </span>{' '}
                    of <span className="font-semibold tabular-nums text-ink">{data.total}</span>.
                  </>
                )}
              </p>
            </header>
          </Stack>
        </Section>

        {data.projects.length > 0 ? (
          <Section>
            <ProjectList projects={data.projects} country={p.country} locale={config.locale} />
          </Section>
        ) : null}

        {data.totalPages > 1 ? (
          <Section>
            <Pager page={page} totalPages={data.totalPages} href={(n) => listUrl(p.country, n)} />
          </Section>
        ) : null}

        <Section>
          <QuoteCTA country={p.country} place={config.name} />
        </Section>

        {/* BreadcrumbList from the same trail the breadcrumb renders, and an
            ItemList of exactly the tiles on screen — not the 144 in the
            table, which is what `numberOfItems` would otherwise overclaim.

            `itemListLD` from structuredData.ts is not reused: it builds
            INSTALLER urls from a slug, which is right for the three lists it
            serves and wrong for a project. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              breadcrumbLD(trail),
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: `Recent solar installation projects in ${config.name}`,
                numberOfItems: data.projects.length,
                itemListElement: data.projects.map((project, i) => ({
                  '@type': 'ListItem',
                  position: first + i,
                  url: `${BASE_URL}${projectUrl(p.country, project.slug)}`,
                  name: project.title
                }))
              }
            ])
          }}
        />
      </PageShell>
    );
  }

  return { generateMetadata, Page };
}

/** `/{cc}/recent-solar-installation-projects` — always page 1. */
export const projectListRoute = listRoute<{ country: string }>(() => 1);

/**
 * `/{cc}/recent-solar-installation-projects/{n}`.
 *
 * The segment must be a plain positive integer. `parseInt` alone accepts
 * '2abc' and '2.5' and would serve page 2 at three different URLs, so the
 * shape is checked before the number is read. `/…/1` is rejected too — page 1
 * has a URL already, and `listUrl` never emits this form for it.
 */
export const projectListPageRoute = listRoute<{ country: string; page_slug: string }>(
  ({ page_slug }) => {
    if (!/^[1-9][0-9]*$/.test(page_slug)) return null;
    const page = Number(page_slug);
    return page > 1 ? page : null;
  }
);
