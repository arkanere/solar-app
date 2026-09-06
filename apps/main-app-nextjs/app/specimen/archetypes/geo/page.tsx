import { notFound } from 'next/navigation';
import { STATES, TOP_DISTRICTS } from '../fixtures';
import { Breadcrumb, Frame, Lede, Section } from '../parts';

/**
 * Archetype 3 — Geo index. 29 pages, and the doorway to the other 1,250.
 * Dev-only. Spec: archetype/geo-index.md.
 */
export default function GeoSpecimen() {
  if (process.env.NODE_ENV === 'production') notFound();

  const installers = STATES.reduce((n, s) => n + s.installers, 0);
  const covered = STATES.reduce((n, s) => n + s.covered, 0);

  return (
    <main className="mx-auto max-w-content px-md py-2xl">
      <header className="border-b border-line pb-lg">
        <p className="text-xs uppercase tracking-widest text-ink-subtle">
          Archetype 3 · 29 pages · the doorway to 1,250
        </p>
        <h1 className="mt-xs text-2xl">Geo index</h1>
        <Lede>
          Somebody arriving here does not know whether this directory covers their
          area — so the page&rsquo;s job is to answer that fast, and to route them
          onward in one click. It says how deep the coverage is rather than implying
          it is everywhere, because a ratio shown honestly is more persuasive than a
          count shown alone.
        </Lede>
      </header>

      <Section
        label="A"
        title="The country hub"
        intent="Two ways in, because there are two kinds of visitor: one knows their state and scans for it, the other just wants the nearest place with real choice. The bar makes coverage legible at a glance without anyone having to read a fraction."
      >
        <Frame>
          <Breadcrumb trail={['Home', 'Solar']} />

          <h1 className="text-2xl leading-tight">Solar installers across India</h1>
          <p className="mt-sm max-w-prose text-ink-muted">
            <span className="font-semibold tabular-nums text-ink">{installers}</span>{' '}
            installers listed in{' '}
            <span className="font-semibold tabular-nums text-ink">{covered}</span> districts
            across <span className="font-semibold tabular-nums text-ink">{STATES.length}</span>{' '}
            states.
          </p>

          <section className="mt-xl">
            <h2 className="text-xl">Where choice is deepest</h2>
            <ul className="mt-md grid gap-x-lg gap-y-sm sm:grid-cols-2 lg:grid-cols-4">
              {TOP_DISTRICTS.map((d) => (
                <li
                  key={d.name}
                  className="flex items-baseline justify-between gap-sm border-b border-line pb-xs"
                >
                  <a href="#" className="min-w-0 truncate">
                    {d.name}
                  </a>
                  <span className="shrink-0 text-sm tabular-nums text-ink-muted">
                    {d.installers}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-2xl">
            <h2 className="text-xl">Browse by state</h2>
            <ul className="mt-md grid gap-md sm:grid-cols-2 lg:grid-cols-3">
              {STATES.map((s) => {
                const pct = Math.round((s.covered / s.districts) * 100);
                return (
                  <li key={s.slug}>
                    <a
                      href="#"
                      className="block h-full rounded-lg border border-line bg-surface p-md text-ink no-underline transition-shadow duration-fast ease-standard hover:shadow-raised"
                    >
                      <h3 className="text-base leading-snug text-action underline decoration-action/40 underline-offset-2">
                        {s.name}
                      </h3>
                      <p className="mt-2xs text-sm tabular-nums text-ink-muted">
                        <span className="font-semibold text-ink">{s.installers}</span>{' '}
                        {s.installers === 1 ? 'installer' : 'installers'}
                      </p>
                      <div
                        className="mt-sm h-1 w-full overflow-hidden rounded-sm bg-surface-sunken"
                        role="img"
                        aria-label={`${s.covered} of ${s.districts} districts covered`}
                      >
                        <div
                          className="h-full rounded-sm bg-brand"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-2xs text-xs tabular-nums text-ink-subtle">
                        {s.covered} of {s.districts} districts
                      </p>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        </Frame>
      </Section>

      <Section
        label="B"
        title="The state hub"
        intent="The same page one level down, and the same bar — a state has the numbers to draw it already. Districts are ordered by depth of choice rather than alphabetically, because someone browsing a state is looking for somewhere with options, not for a specific name they could have searched."
      >
        <Frame>
          <Breadcrumb trail={['Home', 'Solar', 'Maharashtra']} />
          <h1 className="text-2xl leading-tight">Solar installers in Maharashtra</h1>
          <p className="mt-sm max-w-prose text-ink-muted">
            <span className="font-semibold tabular-nums text-ink">164</span> installers across{' '}
            <span className="font-semibold tabular-nums text-ink">33</span> of Maharashtra&rsquo;s
            36 districts.
          </p>
          <div
            className="mt-md h-1 max-w-narrow overflow-hidden rounded-sm bg-surface-sunken"
            role="img"
            aria-label="33 of 36 districts covered"
          >
            <div className="h-full rounded-sm bg-brand" style={{ width: '92%' }} />
          </div>

          <ul className="mt-xl grid gap-md sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Pune', 22],
              ['Nashik', 11],
              ['Nagpur', 10],
              ['Thane', 9],
              ['Mumbai Suburban', 8],
              ['Ahmednagar', 6]
            ].map(([name, n]) => (
              <li key={name as string}>
                <a
                  href="#"
                  className="block h-full rounded-lg border border-line bg-surface p-md text-ink no-underline transition-shadow duration-fast ease-standard hover:shadow-raised"
                >
                  <h3 className="text-base leading-snug text-action underline decoration-action/40 underline-offset-2">
                    {name}
                  </h3>
                  <p className="mt-2xs text-sm tabular-nums text-ink-muted">
                    <span className="font-semibold text-ink">{n}</span> installers
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </Frame>
      </Section>
    </main>
  );
}
