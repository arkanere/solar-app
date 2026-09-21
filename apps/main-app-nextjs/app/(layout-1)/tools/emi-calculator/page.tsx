/**
 * `/tools/emi-calculator`. Ported from
 * apps/main-app/src/routes/(layout-1)/tools/emi-calculator/+page.svelte and
 * its loader.
 *
 * The page is a server component and the calculator is its one client leaf —
 * the split the whole app is built on. Everything a search engine reads (the
 * h1, the lead, the breadcrumb, both JSON-LD blocks, the related links) is
 * rendered on the server; only the three controls and the numbers they
 * produce ship as JavaScript.
 *
 * `revalidate` is `false` on the SvelteKit `config.isr`, which in SvelteKit
 * means "cache forever, never revalidate". The equivalent here is simply not
 * exporting `revalidate` at all on a page whose only query is the bank list —
 * but the bank list IS the thing that changes, so this takes the 15 days the
 * rest of the app uses instead. Per the README's ISR rule, this page is static
 * (no dynamic segment), so the header is real here.
 */
import type { Metadata } from 'next';
import { PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb } from '@/components/directory';
import { EmiCalculator } from '@/components/tools/EmiCalculator';
import { ToolLinks } from '@/components/tools/Panel';
import { getCountry } from '@/lib/countries';
import { breadcrumbLD, webApplicationLD } from '@/lib/directory/structuredData';
import { contentUrl, geoUrl } from '@/lib/directory/urls';
import { pageMetadata } from '@/lib/metadata';
import { getFinancingBanks } from '@/lib/tools/data';

export const revalidate = 1296000;

const DESCRIPTION =
  'Calculate monthly EMI for solar panel loans. Compare interest rates across SBI, HDFC, and other banks. Free solar loan calculator for India.';

export const metadata: Metadata = pageMetadata({
  title: 'Solar EMI Calculator — Monthly Loan Payment Estimator',
  description: DESCRIPTION,
  path: '/tools/emi-calculator',
  locale: getCountry('in').locale,
  imageAlt: 'Solar Vipani'
});

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Tools', href: '/tools' },
  { name: 'EMI Calculator' }
];

export default async function Page() {
  const banks = await getFinancingBanks();

  return (
    <PageShell>
      <Section width="content">
        <Stack gap="sm">
          <Breadcrumb trail={TRAIL} />
          <h1 className="text-2xl text-ink">Solar EMI Calculator</h1>
          <p className="max-w-prose text-lg text-ink-muted">
            Calculate monthly EMI for your solar panel loan. Adjust loan amount, tenure, and
            interest rate to find the best financing option.
          </p>
        </Stack>
      </Section>

      <Section width="content">
        <Stack gap="lg">
          <EmiCalculator banks={banks} />
        </Stack>
      </Section>

      <Section width="content">
        <ToolLinks
          links={[
            { label: 'Solar Calculator', href: '/tools/solar-calculator' },
            { label: 'Solar Financing Guide', href: contentUrl('/solar-financing') },
            { label: 'Browse Installers', href: geoUrl('in') }
          ]}
        />
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(TRAIL),
            webApplicationLD({
              name: 'Solar EMI Calculator',
              description:
                'Calculate monthly EMI for solar panel loans. Compare rates across banks and find the best financing for your solar installation in India.',
              path: '/tools/emi-calculator'
            })
          ])
        }}
      />
    </PageShell>
  );
}
