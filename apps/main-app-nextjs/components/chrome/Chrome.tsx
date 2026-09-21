/**
 * Header, page, footer — and the reason the footer sits at the bottom of a
 * short page instead of half way up it.
 *
 * Why this is not in the root layout, which is where README step 1 put it:
 * the header and footer links are country-scoped, and a root layout has no
 * route params. The three ways to get the country there were a client
 * component reading usePathname (ships the country registry to the browser),
 * middleware plus headers() (opts all 1,279 directory URLs out of static
 * rendering), or mounting chrome one level down where the param already
 * exists. This is the third: app/[country]/layout.tsx passes its config,
 * app/(layout-1)/layout.tsx passes nothing, and both stay server components.
 *
 * The cost is two mount points rather than one. Anything mounted outside them
 * — today only /specimen, which is dev-only — renders bare.
 */
import type { CountryConfig } from '@/lib/countries';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export function Chrome({
  country,
  children
}: {
  country?: CountryConfig;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader country={country} />
      <div className="flex-1">{children}</div>
      <SiteFooter country={country} />
    </div>
  );
}
