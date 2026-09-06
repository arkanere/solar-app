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
        <h1 className="mt-xs text-2xl">Sky, glass, slate, sunlight</h1>
        <p className="mt-sm max-w-prose text-ink-muted">
          Every colour below was solved to a contrast target against the background it sits on, not
          picked by eye. Run <code className="text-sm">npm run check:contrast</code> to re-verify the
          17 pairings after any change.
        </p>
      </header>

      <Section
        n="00"
        title="Where the colours come from"
        note="Four values, four objects, one role each. Three were taken as the brief wrote them; the fourth was not, and the two cards below are why."
      >
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          {(
            [
              ['Trust', 'Clear midday sky', 'action — links, buttons, focus', 'as briefed'],
              [
                'Transparency',
                'Glass / clean light',
                'canvas and surface — the ground, not a hue',
                'as briefed, warmed a trace'
              ],
              ['Prudence', 'Wet slate', 'ink, lines, structure', 'as briefed'],
              [
                'Convenience',
                'Sunlight',
                'brand — fills and marks only',
                'changed: the brief said CTAs'
              ]
            ] as const
          ).map(([value, object, role, verdict], i) => (
            <div
              key={value}
              className={`grid gap-x-md gap-y-2xs px-md py-sm sm:grid-cols-[8rem_10rem_minmax(0,1fr)_11rem] ${
                i > 0 ? 'border-t border-line' : ''
              } ${i % 2 ? 'bg-surface-sunken' : ''}`}
            >
              <span className="text-sm font-semibold">{value}</span>
              <span className="text-sm text-ink-muted">{object}</span>
              <span className="min-w-0 text-sm text-ink-muted">{role}</span>
              <span className="text-2xs text-ink-subtle">{verdict}</span>
            </div>
          ))}
        </div>

        <div className="mt-lg grid gap-lg md:grid-cols-2">
          <div className="min-w-0 rounded-lg border border-line bg-surface p-md">
            <h3 className="text-base font-semibold">Why sunlight cannot carry actions</h3>
            <p className="mt-2xs text-sm text-ink-muted">
              Sunlight is 1.82:1 against canvas. A button survives that, because the text sits on
              the fill at 8.93:1 — but a link and a focus ring do not, and both need to work.
            </p>
            <div className="mt-md space-y-xs border-t border-line pt-md">
              <p className="text-sm">
                Sky as a link: <a href="#00">get three quotes</a> — 6.07:1, plus the underline.
              </p>
              <p className="text-sm">
                Sunlight as a link:{' '}
                <span className="text-brand underline underline-offset-2">get three quotes</span>{' '}
                — 1.82:1, unreadable.
              </p>
            </div>
          </div>

          <div className="min-w-0 rounded-lg border border-line bg-surface p-md">
            <h3 className="text-base font-semibold">And why it matters beyond contrast</h3>
            <p className="mt-2xs text-sm text-ink-muted">
              Follow the brief literally and sky is the brand while sunlight is the CTA. Links
              would have to stay sky, so two colours would both mean &ldquo;you can act on
              this.&rdquo; That is the exact fault this app was rebuilt to remove: one overloaded
              token used 315 times in the SvelteKit app, on 126 headings and 76 links.
            </p>
            <p className="mt-md border-t border-line pt-md text-sm text-ink-muted">
              So sunlight stays identity-only here. The brief&rsquo;s own principle —{' '}
              <em>one colour, one job</em> — is what rules it out.
            </p>
          </div>
        </div>
      </Section>

      <Section
        n="01"
        title="The three rules"
        note="These are what the colour set exists to enforce, and they are structural in the base layer rather than conventions markup can ignore."
      >
        <div className="grid gap-lg md:grid-cols-3">
          <Rule
            rule="Headings are ink"
            body="Hierarchy comes from size and weight. Slate ink at 16.25:1 is the only thing a heading is ever allowed to be."
          >
            <h3 className="text-lg">Solar installers in Pune</h3>
            <p className="text-sm text-ink-muted">Size and weight, no colour.</p>
          </Rule>

          <Rule
            rule="Sky means actionable"
            body="Links, buttons and focus rings. Nothing decorative is sky, so sky reliably means you can act on it."
          >
            <p className="text-sm">
              Compare <a href="#01">a link in running text</a> against the words around it.
            </p>
            <p className="mt-xs text-2xs text-ink-subtle">
              Sky against ink is 2.68:1 — under the 3:1 needed to tell a link from body text, so
              the underline carries the signal and colour supports it.
            </p>
          </Rule>

          <Rule
            rule="Sunlight is identity only"
            body="It fills marks and bands and carries dark text at 8.93:1. It never sets type on a light ground and it never means status."
          >
            <span
              data-brand-chip
              className="inline-block rounded-sm px-xs py-2xs text-2xs font-semibold"
            >
              Verified installer
            </span>
            <p className="mt-xs text-2xs text-ink-subtle">
              1.82:1 against canvas, so the chip carries a border to define its edge. Sunlight is
              the lightest thing in the set; that border is what makes it findable.
            </p>
          </Rule>
        </div>
      </Section>

      <Section
        n="02"
        title="Colour"
        note="Every step solved for a ratio against the ground it actually sits on, in OKLCH. Ratios shown are against that ground."
      >
        <div className="grid gap-lg md:grid-cols-2">
          <Swatches
            heading="Glass and slate"
            items={[
              ['bg-canvas', 'canvas', 'oklch(98.6% 0.005 78)', ''],
              ['bg-surface', 'surface', 'oklch(100% 0 78)', ''],
              ['bg-surface-sunken', 'surface-sunken', 'oklch(96.3% 0.008 78)', ''],
              ['bg-ink', 'ink', 'oklch(23% 0.012 250)', '16.25'],
              ['bg-ink-muted', 'ink-muted', 'oklch(43.8% 0.012 250)', '6.99'],
              ['bg-ink-subtle', 'ink-subtle', 'oklch(53.7% 0.014 250)', '4.57'],
              ['bg-line', 'line', 'oklch(88.8% 0.007 250)', ''],
              ['bg-line-strong', 'line-strong', 'oklch(64.8% 0.014 250)', '3.14']
            ]}
          />
          <Swatches
            heading="Sky, sunlight, status"
            items={[
              ['bg-action', 'action', 'oklch(47.5% 0.155 240)', '6.07'],
              ['bg-action-hover', 'action-hover', 'oklch(36.8% 0.13 240)', '9.94'],
              ['bg-accent-surface', 'accent-surface', 'oklch(96.4% 0.021 240)', ''],
              ['bg-brand', 'brand', 'oklch(80% 0.152 78)', '8.93'],
              ['bg-brand-surface', 'brand-surface', 'oklch(96.4% 0.032 78)', '15.21'],
              ['bg-success', 'success', 'oklch(52% 0.115 155)', '4.75'],
              ['bg-danger', 'danger', 'oklch(55% 0.2 25)', '4.86'],
              ['bg-danger-surface', 'danger-surface', 'oklch(96.6% 0.01 25)', '']
            ]}
          />
        </div>
        <p className="mt-md max-w-prose text-sm text-ink-muted">
          Transparency is the one value with no swatch of its own. It is not a colour — it is the
          near-white ground, the capped measure and the contrast floor. The ground does carry a
          trace of the sunlight hue so the page is not clinical, but a trace is all it is: at
          chroma 0.005 every ratio in this table moves by less than 0.05. Giving transparency a
          real hue would have been the mistake the brief&rsquo;s first pass made, where five
          objects produced five hues and two of them wanted the same job.
        </p>
      </Section>

      <Section
        n="03"
        title="Directory density"
        note="The surface that decides the site — 1,277 of 1,414 URLs are this shape. This is where a palette is actually judged."
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
                <a href="#03">{name}</a>
              </h3>
              {verified ? (
                <span data-brand-chip className="rounded-sm px-2xs py-px text-2xs font-semibold">
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
          Row 2 sits on <code>surface-sunken</code>. Every ink step is solved against that darker
          ground, so a stripe cannot drop a step under AA — sky in a stripe is still 5.68:1.
        </p>
      </Section>

      <Section
        n="04"
        title="Type scale"
        note="Tuned, not a pure ratio: tight where the directory needs density, open where the editorial surface needs air. Only the top two steps go fluid."
      >
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
            <div
              key={cls}
              className="grid grid-cols-[7rem_1fr] items-baseline gap-x-md gap-y-2xs py-sm sm:grid-cols-[7rem_9rem_minmax(0,1fr)]"
            >
              <code className="text-2xs text-ink-subtle">{cls}</code>
              <span className="text-2xs text-ink-subtle">{role}</span>
              <span
                className={`col-span-2 sm:col-span-1 ${
                  cls === 'text-prose' ? `${cls} font-serif` : cls
                }`}
              >
                {sample}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        n="05"
        title="Editorial measure"
        note="Cool slate ink on faintly warm paper, and the serif loaded only under this route group. Long-form reading is judged here, not on the directory rows."
      >
        <div className="max-w-prose">
          <h2 className="text-xl">How rooftop solar subsidy works in Maharashtra</h2>
          <p className="mt-sm font-serif text-prose">
            Under the PM Surya Ghar scheme a residential rooftop system draws a central financial
            assistance of up to ₹78,000, paid directly into the applicant&rsquo;s bank account
            after the installation is inspected. The amount is tiered by system size, not by
            spend, so a <a href="#05">3 kW system</a> and a 3 kW system costing twice as much draw
            the same grant.
          </p>
          <p className="mt-md font-serif text-prose">
            Most of the body on these pages is database HTML, so it renders through{' '}
            <code className="font-sans text-sm">prose</code> rather than hand-written markup. The
            measure is capped at 68ch — long enough to avoid a ragged column, short enough to keep
            the eye from losing the line.
          </p>
        </div>
      </Section>

      <Section
        n="06"
        title="Controls"
        note="daisyUI classes, reading this token set. Nothing restyled — the theme block in globals.css maps daisyUI's own variable names onto these tokens."
      >
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
        <p className="mt-sm text-2xs text-ink-subtle">
          The primary button is sky, not sunlight — the one place this set departs from the
          brief, for the reason section 00 gives.
        </p>

        <div className="mt-lg grid max-w-narrow gap-md sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Pincode</span>
            <input
              type="text"
              defaultValue="411001"
              className="mt-2xs w-full rounded-md border border-line-strong bg-surface px-sm py-xs tabular-nums"
            />
            <span className="mt-2xs block text-2xs text-ink-subtle">
              Used to find nearby installers.
            </span>
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

      <Section
        n="07"
        title="Rhythm and elevation"
        note="One 4px-based scale, applied by layout primitives rather than by pages. Both shadows are slate at low alpha, so a shadow is always this set's own ink and never a generic grey."
      >
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
          <div className="rounded-lg bg-surface px-md py-sm text-sm shadow-raised">
            shadow-raised
          </div>
          <div className="rounded-lg bg-surface px-md py-sm text-sm shadow-overlay">
            shadow-overlay
          </div>
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
    <div className="min-w-0 rounded-lg border border-line bg-surface p-md">
      <h3 className="text-base font-semibold">{rule}</h3>
      <p className="mt-2xs text-sm text-ink-muted">{body}</p>
      <div className="mt-md border-t border-line pt-md">{children}</div>
    </div>
  );
}

function Swatches({ heading, items }: { heading: string; items: readonly (readonly string[])[] }) {
  return (
    <div className="min-w-0 rounded-lg border border-line bg-surface p-md">
      <h3 className="mb-sm text-base font-semibold">{heading}</h3>
      <div className="divide-y divide-line">
        {items.map(([cls, name, value, ratio]) => (
          <div key={name} className="flex flex-wrap items-center gap-x-sm gap-y-2xs py-xs">
            <span className={`size-7 shrink-0 rounded-sm border border-line ${cls}`} />
            <code className="w-28 shrink-0 text-2xs">{name}</code>
            <span className="order-last w-full min-w-0 text-2xs text-ink-subtle sm:order-none sm:w-auto sm:flex-1">
              {value}
            </span>
            <span className="ml-auto shrink-0 text-2xs tabular-nums text-ink-muted">
              {ratio ? `${ratio}:1` : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
