import { notFound } from 'next/navigation';

/**
 * Archetype specimen index. Dev-only, like /specimen.
 *
 * /specimen approves the token layer. This approves the three page designs
 * those tokens have to carry — 1,279 of 1,414 URLs, 90.5% of the site.
 *
 * It deliberately does NOT show the current implementation anywhere. Putting
 * "today" beside "proposed" turns the question into keep-or-tweak, and the
 * question worth asking is what these pages should be.
 *
 * It sits outside (layout-1) on purpose: that route group loads the editorial
 * serif, and the directory surface never uses it.
 */
export default function ArchetypeIndex() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <main className="mx-auto max-w-narrow px-md py-2xl">
      <header className="border-b border-line pb-lg">
        <p className="text-xs uppercase tracking-widest text-ink-subtle">Archetypes</p>
        <h1 className="mt-xs text-2xl">Three page designs, 90.5% of the site</h1>
        <p className="mt-sm text-ink-muted">
          Rendered against real rows from live — real business names up to seventy
          characters, real blank addresses, real photographs, real geography. A layout
          that only works against tidy sample data is not a layout for this site.
        </p>
      </header>

      <ul className="mt-xl space-y-md">
        {[
          {
            href: '/specimen/archetypes/listing',
            n: '2',
            name: 'Geo listing',
            pages: '601 pages · 42%',
            note: 'A comparison surface. Twenty-two businesses in Pune, and the same archetype where one installer covers the district.'
          },
          {
            href: '/specimen/archetypes/installer',
            n: '1',
            name: 'Installer profile',
            pages: '649 pages · 46%',
            note: 'A portfolio page. The work is the argument; contact stays within reach the whole way down.'
          },
          {
            href: '/specimen/archetypes/geo',
            n: '3',
            name: 'Geo index',
            pages: '29 pages · 2%',
            note: 'A coverage page. Says how deep the directory goes rather than implying it is everywhere.'
          }
        ].map((a) => (
          <li key={a.href}>
            <a
              href={a.href}
              className="block rounded-lg border border-line bg-surface p-lg text-ink no-underline transition-shadow duration-fast ease-standard hover:shadow-raised"
            >
              <p className="text-2xs uppercase tracking-widest text-ink-subtle">
                Archetype {a.n} · {a.pages}
              </p>
              <h2 className="mt-2xs text-lg text-action underline decoration-action/40 underline-offset-2">
                {a.name}
              </h2>
              <p className="mt-xs text-sm text-ink-muted">{a.note}</p>
            </a>
          </li>
        ))}
      </ul>

      <section className="mt-2xl border-t border-line pt-lg">
        <h2 className="text-xl">What the design is arguing</h2>
        <dl className="mt-md space-y-md text-sm">
          <div>
            <dt className="font-semibold">Lead with the work.</dt>
            <dd className="mt-2xs text-ink-muted">
              Rooftop solar is a visual product and the photographs are already in
              Cloudinary. They anchor the listing row and they are the whole top half of a
              profile. Where a business has none, initials hold the slot so the column
              keeps one rhythm.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">One entity per row, one reading order.</dt>
            <dd className="mt-2xs text-ink-muted">
              Anchor, name, place, what they do — and the comparable number right-aligned
              and tabular, so twenty-two of them can be scanned as a column rather than
              read as twenty-two blocks.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">A number appears only when it means something.</dt>
            <dd className="mt-2xs text-ink-muted">
              A blank cell reads as “not measured”. A zero reads as “measured, and bad”.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Nothing is shown on every page.</dt>
            <dd className="mt-2xs text-ink-muted">
              A marker every result carries is a logo, not a signal, and it costs the most
              valuable position on the card.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Say what the coverage actually is.</dt>
            <dd className="mt-2xs text-ink-muted">
              Ratios, not bare counts. Claiming a district and delivering one installer
              spends trust that is hard to earn back.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">One installer is an answer, not an empty list.</dt>
            <dd className="mt-2xs text-ink-muted">
              Half of all district pages have exactly one. A list of one reads as a failed
              search, so it gets its own treatment and a route to more choice.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-2xl border-t border-line pt-lg">
        <h2 className="text-xl">What this needs from the data</h2>
        <p className="mt-sm text-sm text-ink-muted">
          The design assumes signals that exist but are not yet filled in. It degrades to
          today&rsquo;s data without breaking, and gets better as these land.
        </p>
        <ul className="mt-md space-y-sm text-sm text-ink-muted">
          <li>
            <span className="text-ink">rscore</span> — the ranking signal the sort is built
            around. Until it is populated, completed installations order the page and the
            business name breaks ties.
          </li>
          <li>
            <span className="text-ink">Project photographs</span> — the design leans on
            them hardest. Two of the twenty-two Pune businesses have one today.
          </li>
          <li>
            <span className="text-ink">Descriptions</span> — a real sentence per business
            would carry the profile&rsquo;s opening. Most are a two-word placeholder.
          </li>
          <li>
            <span className="text-ink">Panel brands</span> — a genuine differentiator
            between installers, and a provision waiting to be filled.
          </li>
        </ul>
      </section>
    </main>
  );
}
