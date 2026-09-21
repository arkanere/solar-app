/**
 * `/tools/solar-calculator`. Ported from
 * apps/main-app/src/routes/(layout-1)/tools/solar-calculator/+page.svelte and
 * its loader.
 *
 * The FAQ and its `FAQPage` markup are rendered here rather than inside the
 * client leaf, and both come from the same array — the rule FAQ.tsx records:
 * the structured data cannot claim questions the page does not show.
 *
 * The loader's `state_subsidies` query is not ported. SolarCalculator.tsx has
 * the reason: nothing reads it, and the table is empty in every status.
 */
import type { Metadata } from 'next';
import { PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb, FAQ } from '@/components/directory';
import { SolarCalculator } from '@/components/tools/SolarCalculator';
import { ToolLinks } from '@/components/tools/Panel';
import { getCountry } from '@/lib/countries';
import { breadcrumbLD, faqLD, webApplicationLD } from '@/lib/directory/structuredData';
import { contentUrl, geoUrl } from '@/lib/directory/urls';
import { pageMetadata } from '@/lib/metadata';
import { getDistrictOptions, getVisibleInstallerCount } from '@/lib/tools/data';

export const revalidate = 1296000;

export const metadata: Metadata = pageMetadata({
  title: 'Solar Calculator — Estimate Cost, Savings & System Size',
  description:
    'Free solar calculator for India. Enter your electricity bill to get system size, cost estimate, subsidy, payback period, and 25-year savings. Based on real installer data.',
  path: '/tools/solar-calculator',
  locale: getCountry('in').locale,
  imageAlt: 'Solar Vipani'
});

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Tools', href: '/tools' },
  { name: 'Solar Calculator' }
];

/** The original's four, verbatim. They are the page's own claims about how it works. */
const FAQS = [
  {
    question: 'How accurate is this solar calculator?',
    answer:
      'Our calculator uses real marketplace data from verified installers across India. Estimates are based on current pricing, local solar irradiance, and applicable government subsidies. Actual costs may vary by 10-15% based on specific site conditions.'
  },
  {
    question: 'What system size do I need for my home?',
    answer:
      'System size depends on your electricity consumption. A typical Indian household with a monthly bill of Rs 1,500-2,000 needs a 3-4 kW system. Our calculator recommends the optimal size based on your bill amount.'
  },
  {
    question: 'How is the payback period calculated?',
    answer:
      'Payback period = net system cost (after subsidy) divided by annual savings. We account for PM Surya Ghar central subsidies and state-specific top-ups where available.'
  },
  {
    question: 'Does the calculator include subsidy?',
    answer:
      'Yes. The calculator applies the PM Surya Ghar central subsidy (Rs 30,000/kW for first 2 kW, Rs 18,000/kW for 2-3 kW) and state subsidies where data is available.'
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
          <h1 className="text-2xl text-ink">Solar Calculator</h1>
          <p className="max-w-prose text-lg text-ink-muted">
            Enter your electricity bill and location to get an estimate of system size, cost,
            savings, and payback period. Based on real data from {totalInstallers}+ verified
            installers.
          </p>
        </Stack>
      </Section>

      <Section width="content">
        <Stack gap="lg">
          <SolarCalculator districts={districts} totalInstallers={totalInstallers} />
        </Stack>
      </Section>

      <Section width="content">
        <ToolLinks
          links={[
            { label: 'Solar Panel Cost Guide', href: contentUrl('/rooftop-solar/cost') },
            { label: 'Browse Installers by State', href: geoUrl('in') }
          ]}
        />
      </Section>

      <Section width="content">
        <FAQ items={FAQS} heading="Common questions about this calculator" />
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(TRAIL),
            webApplicationLD({
              name: 'Solar Calculator',
              description:
                'Calculate your ideal solar system size, cost, savings, and payback period based on your electricity bill and location in India.',
              path: '/tools/solar-calculator'
            }),
            faqLD(FAQS)
          ])
        }}
      />
    </PageShell>
  );
}
