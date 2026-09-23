/**
 * The site header. Ported from apps/main-app/src/lib/components/chrome/SiteHeader.svelte.
 *
 * `country` is optional, exactly as in the original: the country-less tree
 * (the editorial route group) renders this with no country, and every
 * per-country link and CTA is hidden. See components/chrome/Chrome.tsx for
 * where each variant is mounted.
 *
 * Three things in the original did not come across:
 *
 *  - **The theme toggle.** This app has no dark mode; :root pins
 *    color-scheme: light and a lint rule bans `dark:`. A control that flips
 *    nothing is worse than no control.
 *  - **The Translate dropdown and its instructions modal.** The modal is the
 *    one piece of header chrome that wants a real dialog — focus trap, inert
 *    background, Escape — and README's stack note defers dialog to Radix.
 *    Hand-rolling it here would be the throwaway version of exactly the thing
 *    already planned.
 *  - **The PostHog `capture` on the Get Quotes CTA.** There is no analytics
 *    in this app yet, so there is nothing to call.
 *
 * Everything else is the original's structure: brand, two dropdowns, and the
 * per-country CTA pair on the right.
 */
import type { CountryConfig } from '@/lib/countries';
import { contentUrl } from '@/lib/directory/urls';
import { trackAttrs } from '@/lib/track';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { NavMenu, type NavGroup } from './NavMenu';

/** The 7 content pillars, grouped the way the original groups them. */
const SOLAR_GUIDE: NavGroup[] = [
  {
    group: 'Getting Started',
    items: [
      { href: contentUrl('/rooftop-solar'), label: 'Rooftop Solar' },
      { href: contentUrl('/solar-installation'), label: 'Solar Installation' }
    ]
  },
  {
    group: 'Products',
    items: [
      { href: contentUrl('/solar-panels'), label: 'Solar Panels' },
      { href: contentUrl('/solar-inverters'), label: 'Solar Inverters' },
      { href: contentUrl('/solar-pumps'), label: 'Solar Pumps' }
    ]
  },
  {
    group: 'Money',
    items: [
      { href: contentUrl('/solar-subsidy'), label: 'Solar Subsidy' },
      { href: contentUrl('/solar-financing'), label: 'Solar Financing' }
    ]
  }
];

const CTA =
  'rounded-md bg-action px-md py-xs text-sm font-semibold text-action-ink no-underline transition-colors duration-fast ease-standard hover:bg-action-hover whitespace-nowrap';

const NAV_LINK =
  'text-sm font-medium text-ink no-underline transition-colors duration-fast ease-standard hover:text-action whitespace-nowrap';

export function SiteHeader({ country }: { country?: CountryConfig }) {
  const cc = country?.code;
  const features = country?.features;

  const findSolar: NavGroup[] = country
    ? [
        {
          group: 'Find Solar',
          items: [
            { href: `/${cc}/solar`, label: 'Solar Directory' },
            ...(features?.projects
              ? [
                  {
                    href: `/${cc}/recent-solar-installation-projects`,
                    label: 'Recent Projects'
                  }
                ]
              : [])
          ]
        }
      ]
    : [];

  return (
    <header className="border-b border-line bg-surface">
      <Container>
        <nav className="flex flex-wrap items-center justify-between gap-md py-sm">
          <div className="flex flex-wrap items-center gap-lg">
            {/* Always `/`: the country homes merged into the root page on
                2026-08-22 and `/in` and `/us` 301 there, so linking per
                country would send the brand link through a redirect.

                The one <Link> in the app. Everywhere else the hrefs are built
                at runtime, so next/link buys nothing the lint rule can see;
                here the target is a literal known page and the rule is right
                that it should be a Link. */}
            <Link href="/" className="text-lg font-semibold text-ink no-underline">
              Solar Vipani
            </Link>

            {!country || features?.seoContentFamilies ? (
              <NavMenu label="Solar Guide" groups={SOLAR_GUIDE} />
            ) : null}

            {country ? <NavMenu label="Find Solar" groups={findSolar} /> : null}
          </div>

          <div className="flex flex-wrap items-center gap-sm">
            {/* The two countries ask for different things. IN sells quotes to
                homeowners and recruits installers at /in/partners; US has no
                lead funnel live, so its one CTA is the business listing. */}
            {country && cc === 'in' ? (
              <>
                <a
                  href={`/${cc}/get-quotes`}
                  className={CTA}
                  {...trackAttrs('get_quotes_cta_clicked', { source: 'nav' })}
                >
                  Get Quotes
                </a>
                <a href={`/${cc}/partners`} className={NAV_LINK}>
                  Partner with Us
                </a>
              </>
            ) : null}

            {country && cc !== 'in' ? (
              <a href={`/${cc}/business-form`} className={CTA}>
                List Your Business
              </a>
            ) : null}
          </div>
        </nav>
      </Container>
    </header>
  );
}
