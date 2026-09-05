import { notFound } from 'next/navigation';

/**
 * Specimen sheet for the token layer.
 *
 * Dev-only on purpose: the URL inventory in routes.md is a contract, and this
 * page is not part of it. It 404s in production.
 *
 * It lives inside (layout-1) so the editorial serif is actually loaded — that
 * font is scoped to this route group, and outside it the prose specimen would
 * fall back to Georgia and misrepresent the type.
 *
 * This is the artefact the design foundation is approved from — not a component
 * gallery. Everything shown is at the density and measure the archetypes will
 * actually use.
 */
export default function Specimen() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <main className="mx-auto max-w-content px-md py-2xl">
      <header className="mb-3xl border-b border-line pb-xl">
        <p className="text-xs uppercase tracking-widest text-ink-subtle">Design foundation</p>
        <h1 className="mt-xs text-2xl">Specimen sheet</h1>
        <p className="mt-sm max-w-prose text-ink-muted">
          Every colour below was solved to a contrast target against the background it sits on,
          not picked by eye. Run <code className="text-sm">npm run check:contrast</code> to
          re-verify the 17 pairings after any change.
        </p>
      </header>

      <Section
        n="01"
        title="The three rules"
        note="These are what the colour set exists to enforce. The SvelteKit app broke all three."
      >
        <div className="grid gap-lg md:grid-cols-3">
          <Rule
            rule="Headings are ink"
            body="Hierarchy comes from size and weight. No heading ever takes a brand colour — that is what made 126 headings and 76 links indistinguishable in the old app."
          >
            <h3 className="text-lg">Solar installers in Pune</h3>
            <p className="text-sm text-ink-muted">Size and weight, no colour.</p>
          </Rule>

          <Rule
            rule="Teal means actionable"
            body="Links, buttons and focus rings. Nothing decorative is ever teal, so teal reliably means you can act on it."
          >
            <p className="text-sm">
              Compare <a href="#01">a link in running text</a> against the words around it.
            </p>
            <p className="mt-xs text-2xs text-ink-subtle">
              Teal against ink is only 2.65:1, so the underline carries the signal and the colour
              supports it.
            </p>
          </Rule>

          <Rule
            rule="Amber is identity only"
            body="It fills marks and bands and carries dark text at 8.12:1. It never sets type on a light ground and it never means status."
          >
            <span
              data-brand-chip
              className="inline-block rounded-sm px-xs py-2xs text-2xs font-semibold"
            >
              Verified installer
            </span>
            <p className="mt-xs text-2xs text-ink-subtle">
              1.99:1 against canvas, so the chip carries a border to define its edge.
            </p>
          </Rule>
        </div>
      </Section>

      <Section n="02" title="Type scale" note="Tuned, not a pure ratio. Only the top two steps go fluid.">
        <div className="divide-y divide-line">
          {(
            [
              ['text-3xl', 'display', 'Rooftop solar, priced honestly'],
              ['text-2xl', 'h1 / page title', 'Solar panel installers in Pune district'],
              ['text-xl', 'h2 / section', 'Recent installations nearby'],
              ['text-lg', 'h3 / lead', 'What a 5 kW system costs in 2026'],
              ['text-prose', 'article body (serif)', 'Long-form reading measure, 17px at 1.7.'],
              ['text-base', 'UI body', 'Interface copy and form labels.'],
              ['text-sm', 'UI secondary', 'Supporting detail and helper text.'],
              ['text-xs', 'listing meta', '12 installers · updated 4 days ago'],
              ['text-2xs', 'legal / dense meta', 'Prices exclude GST and net-metering charges.']
            ] as const
          ).map(([cls, role, sample]) => (
            <div key={cls} className="grid grid-cols-[7rem_9rem_1fr] items-baseline gap-md py-sm">
              <code className="text-2xs text-ink-subtle">{cls}</code>
              <span className="text-2xs text-ink-subtle">{role}</span>
              <span className={cls === 'text-prose' ? `${cls} font-serif` : cls}>{sample}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section n="03" title="Colour" note="Ratio shown is against the ground each token is used on.">
        <div className="grid gap-lg md:grid-cols-2">
          <Swatches
            heading="Surfaces and ink"
            items={[
              ['bg-canvas', 'canvas', 'page ground', ''],
              ['bg-surface', 'surface', 'cards, panels', ''],
              ['bg-surface-sunken', 'surface-sunken', 'table stripe, inset', ''],
              ['bg-ink', 'ink', 'body and headings', '16.12'],
              ['bg-ink-muted', 'ink-muted', 'meta, secondary', '6.98'],
              ['bg-ink-subtle', 'ink-subtle', 'labels, captions', '4.59'],
              ['bg-line', 'line', 'hairline rules', ''],
              ['bg-line-strong', 'line-strong', 'input borders', '3.09']
            ]}
          />
          <Swatches
            heading="Interaction, brand, status"
            items={[
              ['bg-action', 'action', 'links, button fill', '6.08'],
              ['bg-action-hover', 'action-hover', 'hover state', '9.58'],
              ['bg-accent-surface', 'accent-surface', 'selected tint', ''],
              ['bg-brand', 'brand', 'identity fill', '8.12'],
              ['bg-brand-surface', 'brand-surface', 'tinted band', '14.80'],
              ['bg-success', 'success', 'confirmation', '4.63'],
              ['bg-danger', 'danger', 'validation error', '4.87'],
              ['bg-danger-surface', 'danger-surface', 'error ground', '']
            ]}
          />
        </div>
        <p className="mt-md max-w-prose text-sm text-ink-muted">
          There is no <code className="text-xs">warning</code> and no{' '}
          <code className="text-xs">info</code> token. No archetype has a use for either yet, and
          the point of this layer is to build what the pages need rather than a kit.
        </p>
      </Section>

      <Section
        n="04"
        title="Directory density"
        note="The surface that decides the site — 1,277 of 1,414 URLs are this shape."
      >
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          {[
            ['Suryodaya Solar Systems', 'Pune · Pimpri-Chinchwad', '4.8', '61 projects', true],
            ['Green Volt Energy', 'Pune · Hadapsar', '4.6', '38 projects', false],
            ['Anand Solar Solutions', 'Pune · Kothrud', '4.5', '27 projects', true]
          ].map(([name, area, rating, count, verified], i) => (
            <article
              key={name as string}
              className={`flex flex-wrap items-center gap-x-md gap-y-2xs border-line px-md py-sm ${
                i > 0 ? 'border-t' : ''
              } ${i % 2 ? 'bg-surface-sunken' : ''}`}
            >
              <h3 className="text-base font-semibold">
                <a href="#04">{name}</a>
              </h3>
              {verified ? (
                <span
                  data-brand-chip
                  className="rounded-sm px-2xs py-px text-2xs font-semibold"
                >
                  Verified
                </span>
              ) : null}
              <span className="text-xs text-ink-subtle">{area}</span>
              <span className="ml-auto text-xs tabular-nums text-ink-muted">
                {rating} ★ · {count}
              </span>
            </article>
          ))}
        </div>
        <p className="mt-sm text-2xs text-ink-subtle">
          Row 2 sits on <code>surface-sunken</code>: every ink step above is solved against that
          darker ground, so a stripe cannot drop a step under AA.
        </p>
      </Section>

      <Section
        n="05"
        title="Editorial measure"
        note="Serif is loaded only under the (layout-1) route group, never on directory pages."
      >
        <div className="max-w-prose">
          <h2 className="text-xl">How rooftop solar subsidy works in Maharashtra</h2>
          <p className="mt-sm font-serif text-prose">
            Under the PM Surya Ghar scheme a residential rooftop system draws a central financial
            assistance of up to ₹78,000, paid directly into the applicant&rsquo;s bank account after
            the installation is inspected. The amount is tiered by system size, not by spend, so a{' '}
            <a href="#05">3 kW system</a> and a 3 kW system costing twice as much draw the same
            grant.
          </p>
          <p className="mt-md font-serif text-prose">
            Most of the body on these pages is database HTML, so it renders through{' '}
            <code className="font-sans text-sm">prose</code> rather than hand-written markup. The
            measure is capped at 68ch — long enough to avoid a ragged column, short enough to keep
            the eye from losing the line.
          </p>
        </div>
      </Section>

      <Section n="06" title="Controls" note="daisyUI classes, reading this token set. Nothing restyled.">
        <div className="flex flex-wrap items-center gap-md">
          <button type="button" className="btn btn-primary">
            Get quotes
          </button>
          <button type="button" className="btn btn-outline">
            Compare installers
          </button>
          <button type="button" className="btn btn-ghost">
            Cancel
          </button>
          <a href="#06">Or read the buying guide</a>
        </div>

        <div className="mt-lg grid max-w-narrow gap-md sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Pincode</span>
            <input
              type="text"
              defaultValue="411001"
              className="mt-2xs w-full rounded-md border border-line-strong bg-surface px-sm py-xs tabular-nums"
            />
            <span className="mt-2xs block text-2xs text-ink-subtle">Used to find nearby installers.</span>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Monthly bill</span>
            <input
              type="text"
              defaultValue="abc"
              aria-invalid
              className="mt-2xs w-full rounded-md border-2 border-danger bg-surface px-sm py-xs"
            />
            <span className="mt-2xs block text-2xs font-medium text-danger">
              Enter an amount in rupees.
            </span>
          </label>
        </div>

        <div className="mt-lg grid gap-sm md:grid-cols-2">
          <p className="rounded-md bg-success-surface px-md py-sm text-sm text-success">
            Your request reached 4 installers in Pune.
          </p>
          <p className="rounded-md bg-danger-surface px-md py-sm text-sm text-danger">
            We could not reach that installer. Try another.
          </p>
        </div>
      </Section>

      <Section n="07" title="Rhythm and elevation" note="One vertical scale. Two shadows, both for things that float.">
        <div className="flex flex-wrap items-end gap-md">
          {(
            [
              ['2xs', 'h-1'],
              ['xs', 'h-2'],
              ['sm', 'h-3'],
              ['md', 'h-4'],
              ['lg', 'h-6'],
              ['xl', 'h-8'],
              ['2xl', 'h-12'],
              ['3xl', 'h-16']
            ] as const
          ).map(([name, h]) => (
            <div key={name} className="text-center">
              <div className={`w-8 rounded-sm bg-action ${h}`} />
              <code className="mt-2xs block text-2xs text-ink-subtle">{name}</code>
            </div>
          ))}
        </div>
        <div className="mt-lg flex flex-wrap gap-lg">
          <div className="rounded-lg bg-surface px-md py-sm text-sm shadow-raised">shadow-raised</div>
          <div className="rounded-lg bg-surface px-md py-sm text-sm shadow-overlay">shadow-overlay</div>
          <div className="rounded-lg border border-line bg-surface px-md py-sm text-sm">
            on-page separation is a line, not a shadow
          </div>
        </div>
      </Section>
    </main>
  );
}

function Section({
  n,
  title,
  note,
  children
}: {
  n: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section id={n} className="mb-section">
      <div className="mb-lg">
        <h2 className="text-xl">
          <span className="mr-sm text-ink-subtle tabular-nums">{n}</span>
          {title}
        </h2>
        <p className="mt-2xs max-w-prose text-sm text-ink-muted">{note}</p>
      </div>
      {children}
    </section>
  );
}

function Rule({
  rule,
  body,
  children
}: {
  rule: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-md">
      <h3 className="text-base font-semibold">{rule}</h3>
      <p className="mt-2xs text-sm text-ink-muted">{body}</p>
      <div className="mt-md border-t border-line pt-md">{children}</div>
    </div>
  );
}

function Swatches({ heading, items }: { heading: string; items: readonly (readonly string[])[] }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-md">
      <h3 className="mb-sm text-base font-semibold">{heading}</h3>
      <div className="divide-y divide-line">
        {items.map(([cls, name, use, ratio]) => (
          <div key={name} className="flex items-center gap-sm py-xs">
            <span className={`size-7 shrink-0 rounded-sm border border-line ${cls}`} />
            <code className="w-36 shrink-0 text-2xs">{name}</code>
            <span className="flex-1 text-2xs text-ink-subtle">{use}</span>
            <span className="text-2xs tabular-nums text-ink-muted">{ratio ? `${ratio}:1` : '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
