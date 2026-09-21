/**
 * `/tools/subsidy-checker`. Ported from
 * apps/main-app/src/routes/(layout-1)/tools/subsidy-checker/+page.svelte and
 * its loader.
 *
 * **The slab table moved out of the result panel and onto the page.** In the
 * SvelteKit version "PM Surya Ghar Yojana — Subsidy Slabs" only exists after
 * the reader presses Check Subsidy, so the three published rates — the most
 * quotable fact on the page — are not in the HTML a crawler sees and are not
 * there for a reader who just wants to look the numbers up. It is static
 * reference copy with no dependence on any control, so it renders on the
 * server, always. Nothing else about the page's order changes.
 *
 * The slab figures are the same constants the checker computes with
 * (lib/tools/estimate.ts), so the table and the arithmetic cannot drift.
 */
import type { Metadata } from 'next';
import { PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb, FAQ } from '@/components/directory';
import { SubsidyChecker } from '@/components/tools/SubsidyChecker';
import { BreakdownRow, Panel, ToolLinks } from '@/components/tools/Panel';
import { getCountry } from '@/lib/countries';
import { breadcrumbLD, faqLD, webApplicationLD } from '@/lib/directory/structuredData';
import { contentUrl, geoUrl } from '@/lib/directory/urls';
import { pageMetadata } from '@/lib/metadata';
import { getDistrictOptions, getVisibleInstallerCount } from '@/lib/tools/data';
import { SUBSIDY_MAX, rupees } from '@/lib/tools/estimate';

export const revalidate = 1296000;

export const metadata: Metadata = pageMetadata({
  title: 'Solar Subsidy Checker — PM Surya Ghar Yojana Subsidy Calculator',
  description:
    'Check PM Surya Ghar Yojana central solar subsidy for your system size. See subsidy amounts, eligibility, and net cost after subsidy. Free subsidy calculator.',
  path: '/tools/subsidy-checker',
  locale: getCountry('in').locale,
  imageAlt: 'Solar Vipani'
});

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Tools', href: '/tools' },
  { name: 'Subsidy Checker' }
];

/** The original's four, verbatim. */
const FAQS = [
  {
    question: 'Who is eligible for the PM Surya Ghar solar subsidy?',
    answer:
      'Residential consumers with a valid grid connection are eligible for the PM Surya Ghar subsidy. The system must be on-grid (grid-connected) and installed by a registered vendor. Commercial and industrial connections are not eligible for central subsidies.'
  },
  {
    question: 'What are the PM Surya Ghar subsidy rates?',
    answer:
      'The central subsidy is Rs 30,000 per kW for the first 2 kW and Rs 18,000 per kW for capacity between 2-3 kW. Maximum central subsidy is Rs 78,000 for 3 kW and above systems.'
  },
  {
    question: 'Can I get both central and state subsidies?',
    answer:
      'Yes, in many states you can avail both central subsidy (PM Surya Ghar) and state-specific top-up subsidies. The state subsidy amount varies by state and may have additional eligibility conditions.'
  },
  {
    question: 'Are off-grid systems eligible for subsidies?',
    answer:
      'Off-grid and hybrid systems are generally not eligible for the PM Surya Ghar central subsidy. Some states may offer separate subsidies for off-grid systems, but these are less common.'
  }
];

export default async function Page() {
  const [districts, totalInstallers] = await Promise.all([
    getDistrictOptions(),
    getVisibleInstallerCount()
  ]);

  return (
    <PageShell>
      <Section width="content">
        <Stack gap="sm">
          <Breadcrumb trail={TRAIL} />
          <h1 className="text-2xl text-ink">Solar Subsidy Checker</h1>
          <p className="max-w-prose text-lg text-ink-muted">
            Check your eligibility and subsidy amount under the PM Surya Ghar Yojana — the
            Government of India&rsquo;s national rooftop solar subsidy scheme.
          </p>
        </Stack>
      </Section>

      <Section width="content">
        <Stack gap="lg">
          <SubsidyChecker districts={districts} totalInstallers={totalInstallers} />

          <Panel title="PM Surya Ghar Yojana — Subsidy Slabs">
            <p className="max-w-prose text-sm text-ink-muted">
              Central government scheme providing direct subsidy for residential rooftop solar.
              Applicable to on-grid systems installed by registered vendors.
            </p>
            <dl className="mt-md divide-y divide-line border-t border-line pt-xs">
              <BreakdownRow label="Up to 2 kW" value={`${rupees(30_000)} / kW`} />
              <BreakdownRow label="2 – 3 kW" value={`${rupees(18_000)} / kW`} />
              <BreakdownRow label="Above 3 kW" value={`Max ${rupees(SUBSIDY_MAX)}`} />
            </dl>
          </Panel>
        </Stack>
      </Section>

      <Section width="content">
        <ToolLinks
          links={[
            {
              label: 'How to Apply for Solar Subsidy',
              href: contentUrl('/solar-subsidy/how-to-apply')
            },
            { label: 'Browse Installers', href: geoUrl('in') }
          ]}
        />
      </Section>

      <Section width="content">
        <FAQ items={FAQS} heading="Common questions about the solar subsidy" />
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(TRAIL),
            webApplicationLD({
              name: 'Solar Subsidy Checker',
              description:
                'Check PM Surya Ghar Yojana central solar subsidy for your system size. See subsidy amounts, eligibility, and savings.',
              path: '/tools/subsidy-checker'
            }),
            faqLD(FAQS)
          ])
        }}
      />
    </PageShell>
  );
}
