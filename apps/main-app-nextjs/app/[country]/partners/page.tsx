/**
 * `/{cc}/partners` — the installer-acquisition pitch. Ported from
 * apps/main-app/src/routes/[country=country]/(layout-1)/partners/+page.svelte
 * and its loader.
 *
 * **IN-only in practice.** `middleware.ts` 301s `/us/partners` and everything
 * under it to `/us/business-listing`, so this page never renders for US. That
 * is why it needs no feature gate of its own and why the copy below says
 * India without a country fork — unlike `business-listing`, which is a real
 * page in both countries and forks accordingly. The `isCountry` guard stays
 * anyway: it is the page's own type safety, not a second copy of the
 * middleware rule.
 *
 * This and `business-listing` are two standalone pages, not one page plus a
 * shared component set. They overlap on about two thirds of their sections,
 * but the overlap is layout rather than content — every benefit, FAQ and
 * heading differs — so a shared component would take a config object per
 * section and nothing would be simpler. The one genuinely shared thing is the
 * installer grid's query, and that lives in `lib/directory/data.ts`.
 *
 * Three things the SvelteKit page does that this one does not:
 *
 *  - **the Meta Pixel.** Same decision as `business-form/page.tsx`: a
 *    third-party tracker waits on a consent decision and a `next/script`
 *    strategy. Recorded in the README, not dropped silently.
 *  - **`organizationLD`.** Site-wide identity asserted from a marketing page.
 *    The page's own claims are the breadcrumb, the Service and the FAQs, and
 *    those three are emitted below; Organization belongs wherever the site
 *    decides to state it once.
 *  - **the `youtube.com` embed host.** Swapped for `youtube-nocookie.com`,
 *    which serves the same video without setting a profiling cookie on view.
 *    The section is worth keeping; the tracking that came attached is not.
 *
 * The stat row is `getPlatformStats`, the same figures /about-us prints. The
 * SvelteKit loader counted cities off `geo_locations` (~8,043) where that
 * helper counts places with a visible business (~356) — see its header for
 * why the smaller number is the true one. The `+2000` lead offset comes with
 * it, and so does the README open item that says nothing in the database
 * supports it.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Compass,
  Images,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  Shield
} from 'lucide-react';
import { Container, PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb, FAQ, type FaqEntry } from '@/components/directory';
import { getCountry, isCountry } from '@/lib/countries';
import { listRecentBusinesses } from '@/lib/directory/data';
import { BASE_URL, breadcrumbLD, faqLD } from '@/lib/directory/structuredData';
import { installerUrl } from '@/lib/directory/urls';
import { pageMetadata } from '@/lib/metadata';
import { getPlatformStats } from '@/lib/stats';

/** 15 days, matching the SvelteKit page's `config.isr.expiration`. */
export const revalidate = 1296000;

/** Empty on purpose — see "ISR needs `generateStaticParams` too" in the README. */
export async function generateStaticParams() {
  return [];
}

const BENEFITS = [
  {
    icon: Compass,
    title: 'Get Discovered Online',
    body: 'Customers search for "solar panel installers near me". We rank on the first page of Google, ChatGPT and more for those queries.'
  },
  {
    icon: BarChart3,
    title: 'Verified Leads',
    body: 'Receive qualified leads from homeowners actively looking for solar installation in your service area.'
  },
  {
    icon: LayoutDashboard,
    title: 'Business Dashboard',
    body: 'Manage your profile, track leads and showcase completed projects from a single dashboard.'
  },
  {
    icon: Images,
    title: 'Post Recent Projects',
    body: 'Showcase your workmanship to potential customers with project photos and details.'
  },
  {
    icon: Shield,
    title: 'Verified Badge',
    body: 'Build trust with a verified installer badge that boosts customer confidence in your business.'
  },
  {
    icon: Building2,
    title: 'Multiple Branch Offices',
    body: 'Expand your reach by managing multiple branch locations under one main business profile.'
  }
];

const FAQS: FaqEntry[] = [
  {
    question: 'What is Solar Vipani?',
    answer:
      "Solar Vipani is India's leading platform connecting customers actively seeking solar installation with verified solar installers. We help grow your business by giving you direct access to qualified leads in your area."
  },
  {
    question: 'How much does it cost to list my business?',
    answer:
      'Listing your business is completely free of charge. We believe in providing value first and helping solar businesses grow their online presence without any upfront costs.'
  },
  {
    question: "Why should I list my business if I'm already getting customers?",
    answer:
      "Even if you have a steady customer base, listing on Solar Vipani significantly increases your online visibility, helping you reach even more potential customers who are actively searching for solar installation services. It's an additional channel that complements your existing marketing efforts."
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
  // The same memoised call the page body makes — one query, not two.
  const stats = await getPlatformStats();

  return pageMetadata({
    // An em dash, not the SvelteKit title's second pipe: that title was
    // "Partner with Solar Vipani | India's Solar Installer Network" and
    // `pageMetadata` appends "| Solar Vipani" of its own, so keeping both
    // would render the brand twice and the separator three times.
    title: "Partner with Us — India's Solar Installer Network",
    description: `Join India's fastest-growing solar installer network. Get verified leads, showcase your projects and grow your solar business — completely free. ${stats.installerCount.toLocaleString(config.locale)}+ installers across ${stats.citiesServed.toLocaleString(config.locale)}+ cities.`,
    path: `/${country}/partners`,
    locale: config.locale,
    imageAlt: 'Partner with Solar Vipani'
  });
}

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (!isCountry(country)) notFound();
  const config = getCountry(country);

  const [stats, businesses] = await Promise.all([
    getPlatformStats(),
    listRecentBusinesses(country)
  ]);

  const joinUrl = `/${country}/partners/join`;
  const trail = [{ name: 'Home', href: `/${country}` }, { name: 'Partners' }];

  const figures = [
    { value: stats.installerCount, label: 'Verified installers' },
    { value: stats.citiesServed, label: 'Cities served' },
    { value: stats.projectsCompleted, label: 'Projects completed' },
    { value: stats.leadsGenerated, label: 'Leads generated' }
  ];

  const hero = (
    /* The homepage's hero band, same construction: the <section> is the
       photograph and the scrim, the copy sits in a normal Container so the
       <h1> aligns with every heading below it. */
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
            <p className="mt-md text-lg text-white">
              Join{' '}
              <span className="font-semibold tabular-nums">
                {stats.installerCount.toLocaleString(config.locale)}
              </span>{' '}
              verified installers — listing is free, and always has been.
            </p>
          </div>
          <div>
            <a
              href={joinUrl}
              className="inline-flex items-center gap-xs rounded-md bg-action px-lg py-sm text-base font-semibold text-action-ink no-underline transition-colors duration-fast ease-standard hover:bg-action-hover"
            >
              Join as a partner
              <ArrowRight aria-hidden className="size-4" />
            </a>
          </div>
        </Stack>
      </Container>
    </section>
  );

  return (
    <PageShell hero={hero}>
      <Section>
        <Stack gap="lg">
          <Breadcrumb trail={trail} />
          {/* Four figures, tabular-nums so they read as data — the same
              treatment /about-us gives the three it shares with this page. */}
          <div className="grid grid-cols-2 gap-md md:grid-cols-4">
            {figures.map((figure) => (
              <div
                key={figure.label}
                className="rounded-lg border border-line bg-surface p-md text-center"
              >
                <div className="text-2xl font-bold tabular-nums text-ink">
                  {figure.value.toLocaleString(config.locale)}+
                </div>
                <div className="mt-2xs text-sm text-ink-muted">{figure.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-ink-subtle">Counted live from our database.</p>
        </Stack>
      </Section>

      <Section>
        <Stack gap="lg">
          <div className="max-w-prose">
            <h2 className="text-xl text-ink">Why partner with Solar Vipani?</h2>
            <p className="mt-sm text-ink-muted">
              Get discovered by customers ready to install solar panels — completely free.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-md md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-lg border border-line bg-surface p-md"
              >
                {/* Decoration: the title carries the meaning. */}
                <benefit.icon aria-hidden className="size-6 text-ink-subtle" />
                <h3 className="mt-sm text-base leading-snug text-ink">{benefit.title}</h3>
                <p className="mt-2xs text-sm text-ink-muted">{benefit.body}</p>
              </div>
            ))}
          </div>
          <div>
            <a
              href={joinUrl}
              className="inline-flex items-center gap-xs rounded-md bg-action px-lg py-sm text-base font-semibold text-action-ink no-underline transition-colors duration-fast ease-standard hover:bg-action-hover"
            >
              Get started for free
              <ArrowRight aria-hidden className="size-4" />
            </a>
          </div>
        </Stack>
      </Section>

      <Section>
        <Stack gap="lg">
          <div className="max-w-prose">
            <h2 className="text-xl text-ink">Recently joined verified installers</h2>
            <p className="mt-sm text-ink-muted">
              These solar professionals recently joined the network.
            </p>
          </div>
          {businesses.length > 0 ? (
            <ul className="grid list-none grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
              {businesses.map((business) => (
                <li key={business.slug}>
                  {/* The whole card is the anchor, as in InstallerRow — and it
                      stays in-tab: an installer profile is this site, so a
                      forced new window would be the page overriding the
                      reader's own navigation. The SvelteKit card opened one. */}
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
        </Stack>
      </Section>

      <Section id="product-working" width="narrow">
        <Stack gap="lg">
          <div className="max-w-prose">
            <h2 className="text-xl text-ink">See how it works</h2>
            <p className="mt-sm text-ink-muted">
              A short video on how Solar Vipani connects you with customers.
            </p>
          </div>
          {/* youtube-nocookie, not youtube.com: the same video without a
              profiling cookie on view. `loading="lazy"` keeps the player off
              the critical path — nothing is requested until it scrolls near. */}
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
        </Stack>
      </Section>

      <Section width="narrow">
        <FAQ items={FAQS} heading="Frequently asked questions" />
      </Section>

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
              '@type': 'Service',
              name: 'Solar Installer Partner Network',
              description:
                'Free partnership program for solar panel installers to receive verified leads and grow their business',
              provider: { '@type': 'Organization', name: config.brandName, url: BASE_URL },
              serviceType: 'Business Directory',
              areaServed: { '@type': 'Country', name: config.name },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: config.currency,
                description: 'Free partnership for solar installers'
              }
            },
            faqLD(FAQS)
          ])
        }}
      />
    </PageShell>
  );
}
