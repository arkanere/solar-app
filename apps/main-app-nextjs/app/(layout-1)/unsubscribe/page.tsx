/**
 * `/unsubscribe` — the email opt-out the confirmation mails link to. Ported
 * from apps/main-app/src/routes/[country=country]/(layout-1)/unsubscribe/+page.svelte.
 *
 * **It has moved out from under the country prefix.** Nothing on this page is
 * country-specific: no copy, no CTA, no link, and the `unsubscribe` table has
 * no country column. The Svelte page read `data.country.code` for exactly one
 * purpose — building the URL it posted to — and that endpoint is country-less
 * now too. `'unsubscribe'` is appended to `MOVED_TO_ROOT` in the same commit
 * as this file, so `/in/unsubscribe?unsubscribe=…` 301s here **carrying its
 * query string** (`middleware.ts` redirects on `target + search`, which is the
 * whole reason those rules run before routing). Mail already sent keeps
 * working. The page is in no sitemap, so the advertised count is unchanged.
 *
 * THE ADDRESS IS READ ON THE SERVER, from `?unsubscribe=`. The original read
 * it in `onMount`; see `UnsubscribeForm.tsx` for why that is worth changing.
 * `searchParams` makes this route dynamic, which is correct — it is a
 * one-visitor transactional page, not content, and it must never be cached
 * with someone else's address in it.
 *
 * `noindex`: this URL is only ever reached from a mailed link and its useful
 * form always carries a personal address in the query. It is the one page in
 * the port that asks not to be indexed.
 *
 * **Nothing here suppresses future mail.** The row is recorded and no sender
 * in this app reads it back — see `lib/server/unsubscribe.ts`. Live SvelteKit
 * is the same; the suppression happens in Brevo.
 */
import type { Metadata } from 'next';
import { UnsubscribeForm } from '@/components/forms';
import { PageShell, Section, Stack } from '@/components/layout';
import { getCountry } from '@/lib/countries';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Unsubscribe',
    description: 'Confirm that you no longer want to receive email from Solar Vipani.',
    path: '/unsubscribe',
    locale: getCountry('in').locale,
    imageAlt: 'Solar Vipani'
  }),
  robots: { index: false, follow: false }
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ unsubscribe?: string }>;
}) {
  const { unsubscribe } = await searchParams;
  const email = unsubscribe?.trim() ?? '';

  return (
    <PageShell>
      <Section width="narrow">
        <Stack gap="md">
          <h1 className="font-serif text-2xl text-ink">
            {email ? 'Confirm unsubscription' : 'Unsubscribe'}
          </h1>

          {/* No address in the link is not an error the visitor can fix by
              retrying — the link is malformed or the query was stripped in
              transit. It says what to do instead, which is more use than the
              original's disabled button and "No email address found". */}
          {email ? (
            <>
              <p className="font-serif text-prose text-ink-muted">
                Please confirm that you want to unsubscribe{' '}
                <strong className="font-semibold text-ink">{email}</strong> from our email list.
              </p>
              <UnsubscribeForm email={email} />
            </>
          ) : (
            <p className="font-serif text-prose text-ink-muted">
              This link did not carry an email address, so there is nothing to unsubscribe. Please
              open the unsubscribe link in one of our emails again, or write to{' '}
              <a href="mailto:admin@solarvipani.com" className="text-action underline">
                admin@solarvipani.com
              </a>{' '}
              and we will remove you by hand.
            </p>
          )}
        </Stack>
      </Section>
    </PageShell>
  );
}
