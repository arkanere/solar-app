/**
 * `/{cc}/business-listing` — the free-listing pitch. 2 pages (IN and US).
 * Ported from
 * apps/main-app/src/routes/[country=country]/(layout-1)/business-listing/+page.svelte
 * and its loader.
 *
 * **A real page in both countries**, unlike `/{cc}/partners` next to it, which
 * `middleware.ts` 301s for US — and `/us/partners` 301s *here*, which makes
 * this the US installer-acquisition page. So the country fork is the whole
 * shape of the file: SvelteKit's page merged two pages that had drifted apart
 * and kept each country's live copy rather than unifying it, and that merge is
 * carried across as-is. The forked parts are `COPY` below; everything outside
 * it is shared because it was already identical.
 *
 * Kept from the SvelteKit merge, with its reasoning:
 *
 *  - **five of six benefits share a title, two differ in wording**, so it is a
 *    whole-array fork rather than a per-item gate.
 *  - **the US FAQ set is not a rewrite of the IN one.** The IN "What is Solar
 *    Vipani?" answer is India-specific and the US page never had that question,
 *    so US gets its own third entry.
 *  - **the closing CTA card is US-only; the video is IN-only.** Each country's
 *    live page, not a union of the two.
 *
 * Fixed here rather than carried across — the SvelteKit page's own comment
 * flags it and then ships it anyway: **the FAQPage JSON-LD was the US set for
 * both countries**. It is built from the array the page renders now, so the
 * markup cannot claim questions the reader is not shown. Same rule the
 * editorial and directory surfaces already follow.
 *
 * Two other changes from the original:
 *
 *  - **the "500+ businesses / 5,000+ cities" band is counted live.** Those two
 *    figures were never true — /about-us's header records 470 and 356 against
 *    them — and this page is asking an installer to trust the platform with
 *    their listing. `getPlatformStats` is the same source /about-us prints.
 *  - **`youtube-nocookie.com`, not `youtube.com`.** Same video, no profiling
 *    cookie on view.
 *
 * The Meta Pixel is not ported. See `business-form/page.tsx`.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Compass,
  Images,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserCheck
} from 'lucide-react';
import { Container, PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb, FAQ, type FaqEntry } from '@/components/directory';
import { getCountry, isCountry, type CountryCode } from '@/lib/countries';
import { listRecentBusinesses } from '@/lib/directory/data';
import { BASE_URL, breadcrumbLD, faqLD } from '@/lib/directory/structuredData';
import { installerUrl } from '@/lib/directory/urls';
import { OG_IMAGE, pageMetadata } from '@/lib/metadata';
import { getPlatformStats } from '@/lib/stats';

/** 15 days, matching the SvelteKit page's `config.isr.expiration`. */
export const revalidate = 1296000;

/** Empty on purpose — see "ISR needs `generateStaticParams` too" in the README. */
export async function generateStaticParams() {
  return [];
}

type Benefit = { icon: typeof Compass; title: string; body: string[] };

/** The three benefits both countries have carried since before the merge. */
const SHARED_BENEFITS: Benefit[] = [
  {
    icon: Compass,
    title: 'Get Discovered Online',
    body: [
      'Customers search for queries like "solar panel installers near me" and "top solar panel installer in [city]".',
      'We rank on the first page of Google, Yahoo, ChatGPT and more for those queries.'
    ]
  },
  {
    icon: Mail,
    title: 'Direct Customer Inquiries',
    body: [
      'We display your business phone number, WhatsApp, email and address.',
      'That lets customers reach out to you directly.'
    ]
  },
  {
    icon: Images,
    title: 'Post Recent Projects',
    body: ['Showcase your workmanship to potential customers.']
  }
];

const CREDIBILITY_BENEFIT: Benefit = {
  icon: Award,
  title: 'Strengthen Credibility',
  body: ['Get a verified business tag that boosts client confidence.']
};

const COST_FAQ: FaqEntry = {
  question: 'How much does it cost to list my business?',
  answer:
    'Listing your business is completely free of charge. We believe in providing value first and helping solar businesses grow their online presence without any upfront costs.'
};

const EXISTING_CUSTOMERS_FAQ: FaqEntry = {
  question: "Why should I list my business if I'm already getting customers?",
  answer:
    "Even if you have a steady customer base, listing on Solar Vipani significantly increases your online visibility, helping you reach even more potential customers who are actively searching for solar installation services. It's an additional channel that complements your existing marketing efforts."
};

/**
 * Everything that differs by country, in one object so the fork is visible in
 * one place rather than as six `cc === 'us'` ternaries down the page.
 *
 * `description` and `orgDescription` are each verbatim from the page that
 * country was served by before the merge.
 */
const COPY: Record<
  CountryCode,
  {
    subhead: string;
    lede: string | null;
    heroCta: boolean;
    finalCta: boolean;
    video: boolean;
    socialProof: boolean;
    description: string;
    orgDescription: string;
    languages: string[];
    benefits: Benefit[];
    faqs: FaqEntry[];
  }
> = {
  in: {
    subhead: 'Get discovered by customers researching online',
    // The IN hero has never had a lede or a hero CTA; the US one led with both.
    lede: null,
    heroCta: false,
    finalCta: false,
    video: true,
    socialProof: true,
    description:
      'Expand your solar business reach by listing on Solar Vipani. Connect with customers actively seeking solar installation services in your area.',
    orgDescription:
      "India's leading solar panel installer directory connecting customers with verified solar installation services",
    // Hindi is an India-only support language; every country serves English.
    languages: ['English', 'Hindi'],
    benefits: [
      ...SHARED_BENEFITS,
      {
        icon: UserCheck,
        title: 'Enhance Online Presence',
        body: [
          'Get a dedicated page on a website that ranks highly in the solar installation domain.'
        ]
      },
      CREDIBILITY_BENEFIT,
      {
        icon: Building2,
        title: 'Manage Multiple Branch Offices',
        body: [
          'Expand your reach by managing multiple branch locations under one main business profile.'
        ]
      }
    ],
    faqs: [
      {
        question: 'What is Solar Vipani?',
        answer:
          "Solar Vipani is India's leading platform connecting customers actively seeking solar installation with verified solar installers. We help grow your business by giving you direct access to qualified leads in your area."
      },
      COST_FAQ,
      EXISTING_CUSTOMERS_FAQ
    ]
  },
  us: {
    subhead: 'Get discovered on Google and ChatGPT',
    lede: 'Connect directly with customers seeking solar installation services in your area.',
    heroCta: true,
    finalCta: true,
    video: false,
    socialProof: false,
    description:
      'Expand your solar business reach by listing on Solar Vipani USA. Connect with customers actively seeking solar installation services in your area across the United States.',
    orgDescription:
      "America's leading solar panel installer directory connecting customers with verified solar installation services",
    languages: ['English'],
    benefits: [
      ...SHARED_BENEFITS,
      {
        icon: UserCheck,
        title: 'Enhance Online Presence',
        body: ['We provide a dedicated business profile page.']
      },
      CREDIBILITY_BENEFIT,
      {
        icon: Pencil,
        title: 'Manage Your Information',
        body: [
          'Keep your business details up to date so customers always have the latest information.'
        ]
      }
    ],
    faqs: [
      COST_FAQ,
      {
        question: 'How do you earn money if the business listing is free?',
        answer:
          'We provide premium marketing services to select businesses where we see growth potential. These paid services include targeted campaigns on platforms like Facebook, Instagram, Google Search and YouTube to further boost your visibility.'
      },
      EXISTING_CUSTOMERS_FAQ
    ]
  }
};

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
    description: COPY[country].description,
    path: `/${country}/business-listing`,
    locale: config.locale,
    imageAlt: `List your solar business on ${config.brandName}`
  });
}

/** The CTA every section on this page ends with. */
function ListButton({ country, label }: { country: string; label: string }) {
  return (
    <div>
      <a
        href={`/${country}/business-form`}
        className="inline-flex items-center gap-xs rounded-md bg-action px-lg py-sm text-base font-semibold text-action-ink no-underline transition-colors duration-fast ease-standard hover:bg-action-hover"
      >
        {label}
        <ArrowRight aria-hidden className="size-4" />
      </a>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (!isCountry(country)) notFound();
  const config = getCountry(country);
  const copy = COPY[country];

  const [stats, businesses] = await Promise.all([
    getPlatformStats(),
    listRecentBusinesses(country)
  ]);

  const trail = [{ name: 'Home', href: `/${country}` }, { name: 'Business listing' }];

  const hero = (
    <section className="relative isolate flex min-h-[20rem] items-center overflow-hidden py-2xl">
      {/* Decorative — the copy on top carries the meaning. */}
      <Image
        src="/header/header.avif"
        alt=""
        width={1920}
        height={600}
        priority
        className="absolute inset-0 -z-10 size-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-black/55" />
      <Container>
        <Stack gap="lg">
          <div className="max-w-prose">
            <h1 className="text-3xl leading-tight text-white">Grow Your Solar Business</h1>
            {/* A <p>, not the original's <h2>: a subtitle as a heading puts a
                phantom entry in the outline above the page's real sections. */}
            <p className="mt-md text-lg text-white">{copy.subhead}</p>
            {copy.lede ? <p className="mt-sm text-white">{copy.lede}</p> : null}
          </div>
          {copy.heroCta ? <ListButton country={country} label="List my business now" /> : null}
        </Stack>
      </Container>
    </section>
  );

  return (
    <PageShell hero={hero}>
      <Section>
        <Stack gap="lg">
          <Breadcrumb trail={trail} />
          <div className="max-w-prose">
            <h2 className="text-xl text-ink">
              Why list your business with {config.brandName}?
            </h2>
            <p className="mt-sm text-ink-muted">
              Get discovered by customers ready to install solar panels — completely free.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-md md:grid-cols-3">
            {copy.benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-lg border border-line bg-surface p-md">
                {/* Decoration: the title carries the meaning. */}
                <benefit.icon aria-hidden className="size-6 text-ink-subtle" />
                <h3 className="mt-sm text-base leading-snug text-ink">{benefit.title}</h3>
                {benefit.body.map((line) => (
                  <p key={line} className="mt-2xs text-sm text-ink-muted">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <ListButton country={country} label="Get started for free" />
        </Stack>
      </Section>

      {copy.socialProof ? (
        <Section>
          <Stack gap="lg">
            <h2 className="text-xl text-ink">Join the solar installer community</h2>
            {/* Counted live. The live page's "500+" and "5,000+" were never
                true — see this file's header. */}
            <div className="grid grid-cols-2 gap-md sm:grid-cols-3">
              {[
                { value: stats.installerCount, label: 'Businesses listed' },
                { value: stats.citiesServed, label: 'Cities and towns' },
                { value: stats.projectsCompleted, label: 'Projects published' }
              ].map((figure) => (
                <div
                  key={figure.label}
                  className="rounded-lg border border-line bg-brand-surface p-md text-center"
                >
                  <div className="text-2xl font-bold tabular-nums text-ink">
                    {figure.value.toLocaleString(config.locale)}
                  </div>
                  <div className="mt-2xs text-sm text-ink-muted">{figure.label}</div>
                </div>
              ))}
            </div>
            <ListButton country={country} label="List my business" />
          </Stack>
        </Section>
      ) : null}

      <Section>
        <Stack gap="lg">
          <div className="max-w-prose">
            <h2 className="text-xl text-ink">Recently joined verified installers</h2>
            <p className="mt-sm text-ink-muted">
              These solar professionals recently joined the directory.
            </p>
          </div>
          {businesses.length > 0 ? (
            <ul className="grid list-none grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
              {businesses.map((business) => (
                <li key={business.slug}>
                  {/* The whole card is the anchor, and it stays in-tab — an
                      installer profile is this site, so a forced new window
                      would override the reader's own navigation. */}
                  <a
                    href={installerUrl(country, business.slug)}
                    className="flex h-full flex-col rounded-lg border border-line bg-surface p-md text-ink no-underline transition-shadow duration-fast ease-standard hover:shadow-raised"
                  >
                    <div className="flex items-start justify-between gap-sm">
                      <h3 className="text-base leading-snug text-action underline decoration-action/40 underline-offset-2">
                        {business.name}
                      </h3>
                      <span className="inline-flex shrink-0 items-center gap-2xs rounded-full bg-success-surface px-xs py-2xs text-xs font-semibold text-ink">
                        <CheckCircle2 aria-hidden className="size-3.5 text-success" />
                        Verified
                      </span>
                    </div>
                    <div className="mt-sm flex flex-col gap-2xs text-sm text-ink-muted">
                      {business.city ? (
                        <span className="flex items-center gap-xs">
                          <MapPin aria-hidden className="size-4 shrink-0 text-ink-subtle" />
                          {[business.city, business.state].filter(Boolean).join(', ')}
                        </span>
                      ) : null}
                      {business.phone ? (
                        <span className="flex items-center gap-xs">
                          <Phone aria-hidden className="size-4 shrink-0 text-ink-subtle" />
                          {business.phone}
                        </span>
                      ) : null}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-muted">
              No verified installers to show yet. Be the first to join.
            </p>
          )}
          <ListButton country={country} label="Join these businesses" />
        </Stack>
      </Section>

      {copy.video ? (
        <Section id="product-working" width="narrow">
          <Stack gap="lg">
            <div className="max-w-prose">
              <h2 className="text-xl text-ink">See how it works</h2>
              <p className="mt-sm text-ink-muted">
                A short video on how Solar Vipani connects you with customers.
              </p>
            </div>
            {/* youtube-nocookie, not youtube.com — see this file's header. */}
            <div className="overflow-hidden rounded-lg border border-line">
              <iframe
                className="aspect-video w-full border-0"
                src="https://www.youtube-nocookie.com/embed/8UZ-4XN8Vq8"
                title="How Solar Vipani works"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <ListButton country={country} label="Try it now — free" />
          </Stack>
        </Section>
      ) : null}

      <Section width="narrow">
        <FAQ items={copy.faqs} heading="Frequently asked questions" />
      </Section>

      {copy.finalCta ? (
        <Section width="narrow">
          <div className="rounded-lg bg-accent-surface p-xl">
            <Stack gap="lg">
              <div className="max-w-prose">
                <h2 className="text-xl text-ink">Ready to grow your solar business?</h2>
                <p className="mt-sm text-ink-muted">
                  Join the solar installation companies already listed on {config.brandName}.
                </p>
              </div>
              <ListButton country={country} label="List my business now" />
            </Stack>
          </div>
        </Section>
      ) : null}

      <Section width="narrow">
        <Stack gap="lg">
          <h2 className="text-xl text-ink">We&rsquo;re here to help</h2>
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-surface p-md">
              <Mail aria-hidden className="size-5 text-ink-subtle" />
              <p className="mt-sm text-sm text-ink-muted">Email us at</p>
              <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>
            </div>
            <div className="rounded-lg border border-line bg-surface p-md">
              <Phone aria-hidden className="size-5 text-ink-subtle" />
              <p className="mt-sm text-sm text-ink-muted">Call us at</p>
              <a href="tel:+918983066701">+91 8983066701</a>
            </div>
          </div>
        </Stack>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(trail),
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: config.brandName,
              url: BASE_URL,
              logo: OG_IMAGE.url,
              description: copy.orgDescription,
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-8983066701',
                contactType: 'customer service',
                email: 'admin@solarvipani.com',
                availableLanguage: copy.languages
              },
              address: { '@type': 'PostalAddress', addressCountry: country.toUpperCase() }
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Solar Business Directory Listing',
              description:
                'Free business listing service for solar panel installers and solar energy companies',
              provider: { '@type': 'Organization', name: config.brandName, url: BASE_URL },
              serviceType: 'Business Directory',
              areaServed: { '@type': 'Country', name: config.name },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: config.currency,
                description: 'Free business listing for solar installers'
              }
            },
            // Built from the array the page renders. The SvelteKit version
            // shipped the US question set on both countries.
            faqLD(copy.faqs)
          ])
        }}
      />
    </PageShell>
  );
}
