/**
 * `/{cc}/business-form` — the business signup. 2 pages (IN and US).
 *
 * A static shell around `<BusinessForm>`: no loader, because the state list
 * ships with the page and the other two levels are fetched by the form. That
 * is what the SvelteKit `+page.ts` says too — it exists only to carry the ISR
 * config.
 *
 * `/{cc}/partners/join` is the same page under a second URL. Both are in the
 * inventory and both are advertised, so both are built; the shared part is
 * the form, and each keeps its own copy of the shell because the copy above
 * the form is the only thing that differs and it is three lines.
 *
 * **The Meta Pixel is not ported.** The SvelteKit head injects `fbq` inline on
 * this page, on `/partners/join` and on the two thank-you pages. It is not
 * carried across: a third-party tracker belongs behind whatever consent and
 * script-loading policy this app decides on, `next/script` is the mechanism,
 * and neither has been decided. Recorded in the README rather than dropped
 * silently — the conversion events it fires are load-bearing for the ad
 * account, so this page is not "done" for marketing until that lands.
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
 * Empty on purpose: this is what turns ISR on. See "ISR needs
 * `generateStaticParams` too" in the README.
 */
export async function generateStaticParams() {
  return [];
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
    title: 'List Your Solar Business',
    description: `Expand your solar business reach by listing on ${config.brandName}. Connect with customers actively seeking solar installation services in your area.`,
    path: `/${country}/business-form`,
    locale: config.locale,
    imageAlt: `List your solar business on ${config.brandName}`
  });
}

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (!isCountry(country)) notFound();
  const config = getCountry(country);

  const trail = [
    { name: 'Home', href: `/${country}` },
    { name: 'List your business' }
  ];

  return (
    <PageShell>
      <Section width="narrow">
        <Stack gap="md">
          <Breadcrumb trail={trail} />
          <header>
            <h1 className="text-2xl leading-tight">Get listed by filling the form below</h1>
            <p className="mt-sm text-ink-muted">
              It takes about 90 seconds. We verify every business before it appears in the
              directory, and you will hear from us once that is done.
            </p>
          </header>
        </Stack>
      </Section>

      <Section width="narrow">
        <BusinessForm country={config} />
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLD(trail))
        }}
      />
    </PageShell>
  );
}
