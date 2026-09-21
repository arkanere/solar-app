import { notFound } from 'next/navigation';
import { Container } from '@/components/layout';
import { ONE_KW, HARD_TABLES } from '@/lib/fixtures/editorial';
import { rewriteMovedLinks } from '@/lib/editorial/body';
import {
  BodySection,
  Frame,
  Lede,
  Option,
  PROSE,
  Section,
  TableBlock,
  TableStacked
} from './parts';

/**
 * Archetype 4 — Editorial. 117 pages. Dev-only. Spec: archetype/editorial.md.
 *
 * Unlike the other three sheets this one is not asking for approval of a
 * finished design. §5 has one genuinely open question — 112 of 117 pages
 * carry a table, half of them 4 columns or wider, inside a 68ch measure — and
 * that question cannot be answered from aggregates. So section A puts the
 * three candidate treatments against the four hardest real tables in the
 * database, and everything after it assumes the answer.
 *
 * It sits inside no route group, like its siblings: (layout-1) would give it
 * the serif for free, but it would also give it the site header and footer,
 * and the specimen sheet is not a page of the site. The serif is applied here
 * instead, on the frames that are pretending to be editorial pages.
 */
export default function EditorialSpecimen() {
  if (process.env.NODE_ENV === 'production') notFound();

  const tableSections = ONE_KW.content.filter((s) => s.body.includes('<table'));

  return (
    <main className="py-2xl">
      <Container width="content">
        <header className="border-b border-line pb-lg">
          <p className="text-xs uppercase tracking-widest text-ink-subtle">
            Archetype 4 · 117 pages · 8%
          </p>
          <h1 className="mt-xs text-2xl">Editorial</h1>
          <Lede>
            Seven pillar landings and 110 cluster articles, every one of them a ~6,900-character
            piece with nine headed sections and six questions. The reading is the product here, so
            almost everything is settled by the type scale and the measure — except that 112 of the
            117 pages carry a table, 148 of the 282 tables are four columns or wider, and a 68ch
            column cannot hold them. That is the whole design question.
          </Lede>
          <p className="mt-sm max-w-prose text-sm text-ink-subtle">
            Rendered against real <code>seo_pages</code> HTML from live — the actual six-column
            table, the actual 112-character cells, the actual stale <code>/in/</code> links.
          </p>
        </header>

        {/* ---------------------------------------------------------- */}
        <Section
          label="A"
          title="Three ways to put a table in a reading column"
          intent="The same real table three times. Settled 2026-09-21: neither A nor B as a fixed choice, but the rule that falls out of both — a table takes its natural width, is capped at the content measure, and scrolls only past that. So a narrow six-column table stays inside the prose column and a wide five-column one breaks out, without anyone choosing per table. C was rejected."
        >
          {HARD_TABLES.map((t, i) => (
            <div key={t.label} className={i > 0 ? 'mt-3xl border-t border-line pt-xl' : ''}>
              <h3 className="text-lg">{t.label}</h3>
              <p className="mt-2xs max-w-prose text-sm text-ink-muted">{t.why}</p>
              <p className="mt-2xs text-2xs text-ink-subtle">
                <code>{t.source}</code>
              </p>

              <Option
                letter="A"
                name="Contained — table stays in the 68ch column"
                cost="One left edge the whole way down. A six-column table scrolls even on a desktop monitor, which is the cost."
              >
                <div data-editorial>
                  <Container width="prose">
                    <TableBlock html={t.html} />
                  </Container>
                </div>
              </Option>

              <Option
                letter="B"
                name="Breakout — tables widen to the full content measure"
                cost="Prose stays at 68ch; tables alone go to 72rem and only scroll below that. The page gains a second left edge. This is what §5 recommends."
              >
                <div data-editorial>
                  <Container width="prose">
                    <p className={`${PROSE} mb-md`}>
                      Prose stays here, at sixty-eight characters, so the paragraph before the table
                      and the paragraph after it keep one edge.
                    </p>
                  </Container>
                  <TableBlock html={t.html} />
                </div>
              </Option>

              <Option
                letter="C"
                name="Stacked — one block per row below md (rejected)"
                cost="No scrolling anywhere, but reading across a row is gone and the HTML has to be parsed rather than passed through. Turned down on 2026-09-21 — §10 item 1. Kept as the record of what it looked like. Narrow your window to see it."
              >
                <div data-editorial>
                  <Container width="prose">
                    <TableStacked html={t.html} />
                  </Container>
                </div>
              </Option>
            </div>
          ))}
        </Section>

        {/* ---------------------------------------------------------- */}
        <Section
          label="B"
          title="All five tables on one page"
          intent="One table in isolation is not the test — /rooftop-solar/1kw-system carries five of them among nine sections, and the question is whether a page that keeps widening and narrowing still reads as one column. Shown under option B."
        >
          <Frame>
            <div data-editorial>
              {tableSections.map((s) => (
                <div key={s.heading} className="mt-xl first:mt-0">
                  <Container width="prose">
                    <h2 className="font-serif text-xl text-ink">{s.heading}</h2>
                  </Container>
                  <div
                    className={`mt-sm ${PROSE} [&_table]:hidden`}
                    dangerouslySetInnerHTML={{ __html: rewriteMovedLinks(s.body) }}
                  />
                </div>
              ))}
            </div>
          </Frame>
          <p className="mt-sm max-w-prose text-sm text-ink-subtle">
            Note: the prose above is shown at content width to isolate the rhythm question. Section
            C renders the page properly.
          </p>
        </Section>

        {/* ---------------------------------------------------------- */}
        <Section
          label="C"
          title="The whole page"
          intent="/rooftop-solar/1kw-system end to end: nine sections, 6,093 characters, five tables, six questions — and its twelve body links, eleven of which were 404s until the rewrite in lib/editorial/body.ts. Hover them: the eleven moved families have lost their /in/ prefix and /in/get-quotes has kept it."
        >
          <Frame>
            <div data-editorial>
              <Container width="prose">
                {/* Labels, not links — the same shape the sibling sheets use. A
                    specimen is not in the route tree, so a real href here is
                    both a dead link and a lint error. */}
                <nav aria-label="Breadcrumb">
                  <ol className="flex flex-wrap items-center gap-x-xs text-xs text-ink-muted">
                    {['Home', 'Rooftop Solar', ONE_KW.h1].map((c, i, all) => (
                      <li key={c} className="flex items-center gap-x-xs">
                        <span className={i === all.length - 1 ? 'text-ink' : 'text-action'}>
                          {c}
                        </span>
                        {i < all.length - 1 && <span className="text-ink-subtle">/</span>}
                      </li>
                    ))}
                  </ol>
                </nav>
                <h1 className="mt-md font-serif text-2xl leading-tight text-ink">{ONE_KW.h1}</h1>
              </Container>

              {ONE_KW.content.map((s) => (
                <Container key={s.heading} width="prose">
                  <BodySection heading={s.heading} body={s.body} />
                </Container>
              ))}

              <Container width="prose">
                <section className="mt-3xl">
                  <h2 className="font-serif text-xl text-ink">Common questions</h2>
                  <div className="mt-lg divide-y divide-line border-y border-line">
                    {ONE_KW.faq.map((f) => (
                      <details key={f.question} className="group py-md">
                        <summary className="flex cursor-pointer list-none items-start gap-sm font-semibold [&::-webkit-details-marker]:hidden">
                          <span
                            aria-hidden
                            className="mt-2xs shrink-0 text-ink-subtle transition-transform duration-fast ease-standard group-open:rotate-90"
                          >
                            ›
                          </span>
                          {f.question}
                        </summary>
                        <div
                          className="mt-sm pl-lg text-sm text-ink-muted"
                          dangerouslySetInnerHTML={{ __html: rewriteMovedLinks(f.answer) }}
                        />
                      </details>
                    ))}
                  </div>
                </section>

                <nav className="mt-3xl">
                  <h2 className="font-serif text-lg text-ink">Related topics</h2>
                  <ul className="mt-sm flex flex-wrap gap-xs">
                    {RELATED.map((r) => (
                      <li key={r}>
                        {r === ONE_KW.h1 ? (
                          <span className="rounded-md border border-line-strong bg-surface-sunken px-sm py-2xs text-sm text-ink">
                            {r}
                          </span>
                        ) : (
                          <a
                            href="#"
                            data-unstyled
                            className="block rounded-md border border-line bg-surface px-sm py-2xs text-sm text-ink no-underline hover:border-line-strong"
                          >
                            {r}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </Container>
            </div>
          </Frame>
        </Section>

        {/* ---------------------------------------------------------- */}
        <Section
          label="D"
          title="What is not on this page"
          intent="Four blocks of the SvelteKit components do not come across, and one row of the table has nothing to render. archetype/editorial.md §4 and §10."
        >
          <dl className="max-w-prose space-y-md text-sm">
            {DROPPED.map((d) => (
              <div key={d.what}>
                <dt className="font-semibold">{d.what}</dt>
                <dd className="mt-2xs text-ink-muted">{d.why}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </Container>
    </main>
  );
}

/** The sibling clusters of 1kw-system, as the chip row would list them. */
const RELATED = [
  '1kW Solar System Price in India',
  '2kW Solar System',
  '3kW Solar System',
  '5kW Solar System',
  '10kW Solar System',
  'Rooftop Solar Cost',
  'On-Grid Solar',
  'Off-Grid Solar',
  'Hybrid Solar',
  'Net Metering',
  'Solar for Apartments'
];

const DROPPED = [
  {
    what: 'The stat chips on the pillar ("643 Installers")',
    why: 'Archetype 3 §4 already removed the same chips for restating a callout. Here they restate nothing — they are decoration above a 7,000-character article, in the position that should carry the first sentence.'
  },
  {
    what: 'The tool CTA on the cluster',
    why: 'Its target is picked by regex over the slug. The three tools are README step 3 and answer 501 today, and a call to action pointing at a 501 is worse than none. It returns with the tools.'
  },
  {
    what: 'siblingPillars and entitySection',
    why: 'Only solar-panels passes a sibling, and it passes exactly one, hardcoded in the page. That is navigation, and the site header already does it.'
  },
  {
    what: 'The {n}kW prices-by-city chip row',
    why: 'Real — those district size-leaves exist — but it serves 5 of 110 clusters and needs getTopDistricts(). Deferred, §10 item 4.'
  },
  {
    what: 'kusum-scheme',
    why: 'Was published with zero sections and zero FAQ — a live indexed URL rendering an h1 and nothing else, and a never-written duplicate of its sibling kusum-yojana. Set to draft on 2026-09-21, so there is no empty-body case left to design for. Its URL wants a 301 to kusum-yojana; noted in middleware.ts.'
  }
];
