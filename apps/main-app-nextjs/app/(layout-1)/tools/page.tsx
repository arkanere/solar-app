/**
 * `/tools` — the index of the three calculators. Ported from
 * apps/main-app/src/routes/(layout-1)/tools/+page.svelte and its loader.
 *
 * The SvelteKit loader returns the three tools as data and the page maps an
 * icon name back to a component through a lookup table. That indirection
 * exists because a Svelte load function cannot return a component — it is
 * serialised to the client. Nothing here crosses that boundary, so the list
 * is a constant in this file with the icon in it, and the `load` disappears
 * entirely. The page makes no query at all now.
 *
 * `revalidate` is therefore not strictly needed — there is nothing to
 * re-read — but it is left to match the SvelteKit `config.isr` and the other
 * pages in this route group. A page with no data is static either way.
 *
 * Styling is the design system's, not the original's: cards are a hairline
 * on bg-surface with no shadow, the h1 is ink rather than brand orange, and
 * the spacing is the token scale. Same call the homepage made — see
 * archetype/home.md §3, which is the same contradiction on the same source.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Banknote, BadgeIndianRupee, Calculator } from 'lucide-react';
import { PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb } from '@/components/directory';
import { getCountry } from '@/lib/countries';
import { breadcrumbLD } from '@/lib/directory/structuredData';
import { pageMetadata } from '@/lib/metadata';

export const revalidate = 1296000;

export const metadata: Metadata = pageMetadata({
  title: 'Free Solar Tools & Calculators',
  description:
    'Free solar tools: calculate system size & cost, estimate EMI for solar loans, and check government subsidies. Make informed solar decisions.',
  path: '/tools',
  locale: getCountry('in').locale,
  imageAlt: 'Solar Vipani'
});

const TOOLS = [
  {
    href: '/tools/solar-calculator',
    icon: Calculator,
    title: 'Solar Calculator',
    description:
      'Estimate system size, cost, savings, and payback period based on your electricity bill and location.'
  },
  {
    href: '/tools/emi-calculator',
    icon: Banknote,
    title: 'EMI Calculator',
    description:
      'Calculate monthly EMI for solar panel loans. Compare rates across banks and find the best financing option.'
  },
  {
    href: '/tools/subsidy-checker',
    icon: BadgeIndianRupee,
    title: 'Subsidy Checker',
    description:
      'Check central and state solar subsidies applicable to your system. See eligibility and total savings.'
  }
];

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Tools' }
];

export default function Page() {
  return (
    <PageShell>
      <Section width="content">
        <Stack gap="sm">
          <Breadcrumb trail={TRAIL} />
          <h1 className="text-2xl text-ink">Solar Tools &amp; Calculators</h1>
          <p className="max-w-prose text-lg text-ink-muted">
            Free tools to help you plan your solar installation. Calculate costs, compare financing,
            and check subsidies — all based on real marketplace data.
          </p>
        </Stack>
      </Section>

      <Section width="content">
        <ul className="grid grid-cols-1 gap-md md:grid-cols-3">
          {TOOLS.map((tool) => (
            <li key={tool.href}>
              {/* data-unstyled: the whole card is the link, so the underline
                  that carries "link" everywhere else would run across the
                  card's own heading. The card's border and hover state say
                  it is interactive instead. globals.css §base. */}
              <a
                data-unstyled
                href={tool.href}
                className="group block h-full rounded-lg border border-line bg-surface p-md transition-colors duration-fast ease-standard hover:border-line-strong"
              >
                <tool.icon aria-hidden className="mb-sm h-8 w-8 text-action" />
                <h2 className="text-lg text-ink group-hover:underline">{tool.title}</h2>
                <p className="mt-xs text-sm text-ink-muted">{tool.description}</p>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section width="content">
        <div>
          <Link href="/in/get-quotes" className="btn btn-primary">
            Get Free Solar Quotes
          </Link>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD(TRAIL)) }}
      />
    </PageShell>
  );
}
