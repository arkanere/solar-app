/**
 * `/{cc}/get-quotes` — the standalone quote request. 2 pages (IN and US).
 *
 * The one page whose whole job is the lead form. Everywhere else the form is a
 * section of a page about a place; here the page is about the form, so the
 * structure is: what you get, the form, how it works, and the FAQ that answers
 * the objections to filling it in.
 *
 * It reuses `LeadFormSection` rather than growing a second form. That
 * component takes a `place` and interpolates it into the heading and the
 * offer, which is exactly right for a district page and needs a sensible value
 * here — this page is not about a place, so it passes the country's name. The
 * alternative was a second variant of the copy, which is two strings to keep
 * in step for one page.
 *
 * **The two counts come from `getPlatformStats`**, the same source /about-us
 * and /{cc}/partners print. They used to be their own query counting visible
 * business_profiles — branches, not companies — which printed 653 here
 * against 476 on /{cc}/partners for the same word, "installers". The projects
 * query was identical to the one in lib/stats.ts, so nothing else changed.
 * Platform-wide, not country-scoped, like every other figure on those pages.
 *
 * The FAQ copy is IN-specific in the original — it says "in India" and quotes
 * rupee expectations. It is carried across as written and gated to IN rather
 * than being generalised: /us gets the page without the FAQ, which is what a
 * page with no US answers should show. Writing US answers is a content task.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FolderCheck, Users } from 'lucide-react';
import { PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb, FAQ, LeadFormSection, type FaqEntry } from '@/components/directory';
import { StatTile } from '@/components/tools/Panel';
import { getCountry, isCountry } from '@/lib/countries';
import { getPlatformStats } from '@/lib/stats';
import { breadcrumbLD, faqLD } from '@/lib/directory/structuredData';
import { pageMetadata } from '@/lib/metadata';

/**
 * The SvelteKit loader sets `isr: { expiration: false }` — cache forever, no
 * revalidation. That is not carried across: the page prints two live counts,
 * and a permanent cache means they are the counts from whenever the page was
 * first built. 15 days, the same window as every other page in this tree.
 */
export const revalidate = 1296000;

/**
 * IN only. `middleware.ts` 301s `/us/get-quotes` — the loaders here read IN-only
 * legacy tables, and a real US funnel is new product surface. There is no
 * feature flag behind that rule, so the literal is written out and cites it;
 * `dynamicParams` stays true, so a third country would still render on demand.
 */
export async function generateStaticParams() {
  return [{ country: 'in' }];
}

/**
 * Three questions, carried across from the SvelteKit head's FAQPage block. The
 * page renders the same array it feeds to the structured data, so the markup
 * cannot claim a question the page does not show.
 */
const FAQS_IN: FaqEntry[] = [
  {
    question: 'Where can I get a solar quotation online in India?',
    answer:
      'You can get a free solar quotation online at Solar Vipani. Fill the inquiry form on this page with your location and energy requirements, and you will receive competitive quotations from 2-3 verified solar installers near you — entirely online, with no obligation.'
  },
  {
    question: 'Is the online solar quotation free?',
    answer:
      'Yes. Requesting a solar quotation online through Solar Vipani is completely free. You only deal with verified installers, compare their quotations, and decide if you want to proceed — there is no charge for the quotes.'
  },
  {
    question: 'How long does it take to receive my solar quotation?',
    answer:
      'After you submit the form online, you typically receive 2-3 competitive quotations from verified installers within 24 hours.'
  }
];

const STEPS = [
  {
    title: 'Fill the form',
    body: 'Share your location and what you need. It takes less than a minute.'
  },
  {
    title: 'Receive 2–3 quotations',
    body: 'Verified installers who cover your area quote for the work, usually within 24 hours.'
  },
  {
    title: 'Compare and choose',
    body: 'Compare prices, equipment and reviews, then pick the installer that suits you.'
  }
];

export async function generateMetadata({
  params
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  if (!isCountry(country)) return {};
  const config = getCountry(country);

  // Memoised for the request, so the page below re-reads this rather than
  // running both counts a second time.
  const { installerCount, projectsCompleted } = await getPlatformStats();

  return pageMetadata({
    title: 'Get a Free Solar Quotation Online',
    description: `Get a free solar quotation online from verified solar panel installers in ${config.name}. Compare 2-3 competitive quotations on price, services and reviews. ${installerCount}+ installers, ${projectsCompleted}+ completed projects.`,
    path: `/${country}/get-quotes`,
    locale: config.locale,
    imageAlt: `Get free solar quotes in ${config.name}`
  });
}

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (!isCountry(country)) notFound();
  const config = getCountry(country);

  const { installerCount, projectsCompleted } = await getPlatformStats();
  const faqs = country === 'in' ? FAQS_IN : [];

  const trail = [{ name: 'Home', href: `/${country}` }, { name: 'Get Quotes' }];

  return (
    <PageShell>
      <Section width="narrow">
        <Stack gap="md">
          <Breadcrumb trail={trail} />
          <header>
            <h1 className="text-2xl leading-tight">Get a free solar quotation online</h1>
            <p className="mt-sm text-ink-muted">
              Tell us what you need once. Verified installers who cover your area come back with
              2–3 competitive quotations, usually within 24 hours. No cost, no obligation.
            </p>
          </header>
        </Stack>
      </Section>

      <Section width="narrow">
        {/* Two tiles, so 2-up holds at every width — the orphan the district
            page has to avoid cannot happen here. `gap-md` matches the tools'
            tile rows. */}
        <div className="grid grid-cols-2 gap-md">
          <StatTile
            icon={Users}
            value={`${installerCount.toLocaleString(config.locale)}+`}
            label="Verified installers"
          />
          <StatTile
            icon={FolderCheck}
            value={`${projectsCompleted.toLocaleString(config.locale)}+`}
            label="Verified projects"
          />
        </div>
      </Section>

      <Section width="narrow">
        {/* `place` is the country name: this page is not about one place, and
            the component's copy needs something to name. */}
        <LeadFormSection country={config} place={config.name} />
      </Section>

      <Section width="narrow">
        <h2 className="text-xl">How it works</h2>
        {/* An ordered list because the steps are a sequence. The original
            numbered three cards by hand with a styled circle; the number is
            the semantics, so it comes from the list. */}
        <ol className="mt-lg flex list-decimal flex-col gap-md pl-md">
          {STEPS.map((step) => (
            <li key={step.title}>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="mt-2xs text-sm text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {faqs.length > 0 ? (
        <Section width="narrow">
          <FAQ items={faqs} heading="Frequently asked questions" />
        </Section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(trail),
            ...(faqs.length > 0 ? [faqLD(faqs)] : [])
          ])
        }}
      />
    </PageShell>
  );
}
