/**
 * `/{cc}/partners/join/thank-you` — the partner signup confirmation.
 *
 * **Nothing routes here today**, and that is carried across rather than fixed:
 * `BusinessForm` sends every successful signup to `/{cc}/thank-you-business`,
 * on all three of the pages that render it, exactly as the SvelteKit form
 * does. This page exists, is linked from nothing, and says something slightly
 * different from the page that IS reached — a 48-hour promise where
 * thank-you-business promises a call.
 *
 * It is ported anyway because it is in the inventory and because deciding
 * which of the two confirmations a partner signup should land on is a content
 * decision, not a porting one. Recorded in the README as an open item.
 *
 * `noindex`, as the original has: a confirmation page in a search result is a
 * page reached without the thing it confirms.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { PageShell, Section, Stack } from '@/components/layout';
import { getCountry, isCountry } from '@/lib/countries';
import { breadcrumbLD } from '@/lib/directory/structuredData';
import { pageMetadata } from '@/lib/metadata';

/** 15 days. Static copy, so the window is the tree's default rather than a measurement. */
export const revalidate = 1296000;

/** Empty on purpose — see "ISR needs `generateStaticParams` too" in the README. */
export async function generateStaticParams() {
  return [];
}

const STEPS = [
  'Our team reviews your business details.',
  'We verify your business and contact you.',
  'Your profile goes live and you start receiving leads.'
];

export async function generateMetadata({
  params
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  if (!isCountry(country)) return {};
  const config = getCountry(country);

  return {
    ...pageMetadata({
      title: 'Thank You | Partner Sign-Up',
      description: `Thank you for signing up as a ${config.brandName} partner. Our team will review your application and contact you within 48 hours.`,
      path: `/${country}/partners/join/thank-you`,
      locale: config.locale,
      imageAlt: `${config.brandName} partner sign-up received`
    }),
    robots: { index: false, follow: true }
  };
}

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (!isCountry(country)) notFound();

  const trail = [
    { name: 'Home', href: `/${country}` },
    { name: 'Partners', href: `/${country}/partners` },
    { name: 'Thank You' }
  ];

  return (
    <PageShell>
      <Section width="narrow">
        <Stack gap="md">
          <header>
            <CheckCircle aria-hidden className="h-10 w-10 text-action" />
            <h1 className="mt-md text-2xl leading-tight">Thank you for signing up</h1>
            <p className="mt-sm text-ink-muted">
              We have your partner application. Our team will review your details and get in touch
              within <strong className="font-semibold text-ink">48 hours</strong>.
            </p>
          </header>
        </Stack>
      </Section>

      <Section width="narrow">
        <div className="rounded-lg border border-line bg-surface-sunken p-lg">
          <h2 className="text-lg">What happens next</h2>
          {/* An ordered list, because these are steps in sequence — the
              original numbered them by hand inside <li>s, which reads the
              same and announces as an unordered list of strings starting
              with digits. */}
          <ol className="mt-md flex list-decimal flex-col gap-sm pl-md text-sm text-ink-muted">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </Section>

      <Section width="narrow">
        <a href={`/${country}/partners`} className="text-sm">
          Back to Partners
        </a>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD(trail)) }}
      />
    </PageShell>
  );
}
