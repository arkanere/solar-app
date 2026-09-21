/**
 * `/{cc}/partners/join` — the business signup under the partners tree.
 *
 * The same form as `/{cc}/business-form`, and in SvelteKit the same page
 * verbatim: two copies of one shell around `<BusinessForm>`. Both URLs are
 * advertised and both are kept, so what differs is the copy above the form —
 * this one is the end of the partners pitch and says so, where business-form
 * is reached cold from the footer and has to explain itself.
 *
 * The Meta Pixel on the SvelteKit original is not ported. See the note in
 * `business-form/page.tsx`, which this page shares.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb } from '@/components/directory';
import { BusinessForm } from '@/components/forms';
import { getCountry, isCountry } from '@/lib/countries';
import { breadcrumbLD } from '@/lib/directory/structuredData';
import { pageMetadata } from '@/lib/metadata';

/** 15 days, matching the SvelteKit page's `config.isr.expiration`. */
export const revalidate = 1296000;

/**
 * IN only. `middleware.ts` 301s `/us/partners/*` — the loaders here read IN-only
 * legacy tables, and a real US funnel is new product surface. There is no
 * feature flag behind that rule, so the literal is written out and cites it;
 * `dynamicParams` stays true, so a third country would still render on demand.
 */
export async function generateStaticParams() {
  return [{ country: 'in' }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  if (!isCountry(country)) return {};
  const config = getCountry(country);

  return pageMetadata({
    title: 'Join the Installer Network',
    description: `Expand your solar business reach by listing on ${config.brandName}. Connect with customers actively seeking solar installation services in your area.`,
    path: `/${country}/partners/join`,
    locale: config.locale,
    imageAlt: `Join the ${config.brandName} installer network`
  });
}

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (!isCountry(country)) notFound();
  const config = getCountry(country);

  const trail = [
    { name: 'Home', href: `/${country}` },
    { name: 'Partners', href: `/${country}/partners` },
    { name: 'Join' }
  ];

  return (
    <PageShell>
      <Section width="narrow">
        <Stack gap="md">
          <Breadcrumb trail={trail} />
          <header>
            <h1 className="text-2xl leading-tight">Join the installer network</h1>
            <p className="mt-sm text-ink-muted">
              Tell us about your business and we will verify it. Once you are listed, customers
              looking for solar in the areas you cover can reach you directly. It takes about 90
              seconds.
            </p>
          </header>
        </Stack>
      </Section>

      <Section width="narrow">
        <BusinessForm country={config} />
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD(trail)) }}
      />
    </PageShell>
  );
}
