/**
 * `/{cc}/thank-you-business` — where a business lands after signing up.
 *
 * `BusinessForm` sends every successful signup here, from all three of the
 * pages that render it. (There is a second, near-identical confirmation at
 * `/{cc}/partners/join/thank-you` that nothing routes to — its own header has
 * the note.)
 *
 * **The two countries make different promises, and both are kept verbatim.**
 * IN says it will call to verify; US commits to two business days and says
 * nothing about a call. That is not a copy inconsistency to tidy — it is two
 * operations with different staffing, and the page is the commitment.
 *
 * `noindex`: a confirmation page reached from a search result is a
 * confirmation of nothing.
 *
 * The Meta Pixel on the SvelteKit original is not ported, and here it is the
 * `Lead` CONVERSION event rather than a page view — see the note in
 * `business-form/page.tsx`. This is the page where that matters most.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { PageShell, Section, Stack } from '@/components/layout';
import { countryParams, getCountry, isCountry } from '@/lib/countries';
import { pageMetadata } from '@/lib/metadata';

/** 15 days. Static copy; the window is the tree's default. */
export const revalidate = 1296000;

/**
 * Both countries. `[country]` is the only dynamic segment, so the registry
 * enumerates the set with no query — see `countryParams` for why these routes
 * return real params where the data-driven ones return `[]`.
 */
export async function generateStaticParams() {
  return countryParams();
}

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
      title: 'Thank You',
      description: 'Thank you for submitting your details. We will contact you soon.',
      path: `/${country}/thank-you-business`,
      locale: config.locale,
      imageAlt: `${config.brandName} business details received`
    }),
    robots: { index: false, follow: true }
  };
}

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (!isCountry(country)) notFound();

  return (
    <PageShell>
      <Section width="narrow">
        <Stack gap="md">
          <header>
            <CheckCircle aria-hidden className="h-10 w-10 text-action" />
            <h1 className="mt-md text-2xl leading-tight">
              Thank you for submitting your details
            </h1>
          </header>

          {country === 'in' ? (
            <>
              <p className="text-ink-muted">
                We will call you soon to verify the business details you submitted in the form.
              </p>
              <p className="text-ink-muted">
                If you would like to speak to us right away, call{' '}
                <a href="tel:+918983066701" className="text-action">
                  +91 8983066701
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <p className="text-ink-muted">
                We will verify the business details you submitted in the form. Our response time is
                two business days.
              </p>
              <p className="text-ink-muted">
                After verification we will list your business in the directory on{' '}
                {getCountry(country).brandName}.
              </p>
            </>
          )}
        </Stack>
      </Section>
    </PageShell>
  );
}
