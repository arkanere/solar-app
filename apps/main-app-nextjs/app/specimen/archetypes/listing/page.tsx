import { notFound } from 'next/navigation';
import { LONE, PUNE, PUNE_CITIES, TOP_DISTRICTS } from '../fixtures';
import { Breadcrumb, Frame, InstallerRow, Lede, Section, SoleInstaller } from '../parts';

/**
 * Archetype 2 — Geo listing. 601 pages, 42% of the site, sitemap priority 1.0.
 * Dev-only. Spec: archetype/geo-listing.md.
 */
export default function ListingSpecimen() {
  if (process.env.NODE_ENV === 'production') notFound();

  const linked = PUNE_CITIES.filter((c) => c.linked);
  const withWork = PUNE.filter((b) => b.projects > 0).length;

  return (
    <main className="mx-auto max-w-content px-md py-2xl">
      <header className="border-b border-line pb-lg">
        <p className="text-xs uppercase tracking-widest text-ink-subtle">
          Archetype 2 · 601 pages · 42% of the site
        </p>
        <h1 className="mt-xs text-2xl">Geo listing</h1>
        <Lede>
          A reader who lands here has already decided to get solar and has decided where.
          The only thing left is choosing who. So this page is a comparison surface: a
          column of businesses that can be run down, compared and acted on — and every
          design choice below serves being scanned rather than being read.
        </Lede>
      </header>

      <Section
        label="A"
        title="The listing"
        intent="Each row leads with the work. A photograph of a finished installation is the most persuasive thing a local installer has, and rooftop solar is a visual product — so where a photo exists it anchors the row, and where it does not, initials hold the same slot so the column keeps one rhythm. Name, then place, then what they do; the comparable number right-aligned and tabular; the action always in the same position."
      >
        <Frame>
          <Breadcrumb trail={['Home', 'Solar', 'Maharashtra', 'Pune']} />

          <h1 className="text-2xl leading-tight">Solar installers in Pune</h1>
          <p className="mt-sm max-w-prose text-ink-muted">
            {PUNE.length} businesses install rooftop solar across Pune district, {withWork} of
            them with photographed work on this site.
          </p>

          <div className="mt-lg flex flex-wrap items-center justify-between gap-md border-y border-line py-sm">
            <p className="text-sm text-ink-muted">
              <span className="font-semibold tabular-nums text-ink">{PUNE.length}</span>{' '}
              installers
            </p>
            <p className="text-sm text-ink-muted">
              Sorted by <span className="text-ink">completed installations</span>
            </p>
          </div>

          <ul>
            {PUNE.map((b) => (
              <InstallerRow key={b.slug} b={b} />
            ))}
          </ul>

          <section className="mt-2xl border-t border-line pt-lg">
            <h2 className="text-xl">Where these installers work</h2>
            <p className="mt-xs text-sm text-ink-muted">
              Seven places in Pune district have an installer of their own.
            </p>
            <ul className="mt-md flex flex-wrap gap-x-md gap-y-xs">
              {linked.map((c) => (
                <li key={c.slug}>
                  <a href="#" className="text-sm">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-md max-w-prose text-sm text-ink-subtle">
              Installers here also cover {PUNE_CITIES.filter((c) => !c.linked).length} other
              places in the district, including Baramati, Lonavala and Shirur.
            </p>
          </section>
        </Frame>
      </Section>

      <Section
        label="B"
        title="The same archetype where one installer covers the district"
        intent="Half of all district pages have a single installer, and that is a state to design for rather than a state to survive. A list of one reads as a failed search. The same content, presented as an answer to the question instead, plus a route to more choice."
      >
        <Frame>
          <Breadcrumb trail={['Home', 'Solar', 'Rajasthan', 'Alwar']} />
          <h1 className="text-2xl leading-tight">Solar installers in Alwar</h1>
          <div className="mt-lg max-w-narrow">
            <SoleInstaller b={LONE} place="Alwar district" />
          </div>
        </Frame>
      </Section>

      <Section
        label="C"
        title="Onward, when this district is not the answer"
        intent="Every listing page needs somewhere to send a reader it cannot serve. Not a generic chip row — the places where the directory is genuinely deep, with the number that proves it."
      >
        <Frame>
          <h2 className="text-xl">Districts with the most installers</h2>
          <ul className="mt-md grid gap-x-lg gap-y-sm sm:grid-cols-2">
            {TOP_DISTRICTS.map((d) => (
              <li
                key={d.name}
                className="flex items-baseline justify-between gap-md border-b border-line pb-xs"
              >
                <a href="#" className="min-w-0 truncate">
                  {d.name}
                  <span className="text-ink-subtle">, {d.state}</span>
                </a>
                <span className="shrink-0 text-sm tabular-nums text-ink-muted">
                  {d.installers}
                </span>
              </li>
            ))}
          </ul>
        </Frame>
      </Section>
    </main>
  );
}
