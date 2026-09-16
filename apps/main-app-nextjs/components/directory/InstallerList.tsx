/**
 * The page. geo-listing.md §2 and §7.
 *
 * Switches the two density treatments on installerCount, which is the whole
 * point: p50 across districts is 2 installers and the max is 22, and those two
 * cases want opposite layouts. One elastic layout would be mediocre at both
 * ends, so there are two — and the switch lives here so no page has to know
 * about it.
 *
 * The 2+ case is the column the design targets. 20+ is the shape the directory
 * is growing into; designing for a median of 2 designs for the state the site
 * is leaving.
 */
import type { InstallerRowData } from '@/lib/directory/types';
import { InstallerRow } from './InstallerRow';
import { SoleInstaller } from './SoleInstaller';

export function InstallerList({
  installers,
  country,
  level1,
  level1Slug,
  level2
}: {
  installers: InstallerRowData[];
  country: string;
  level1: string;
  level1Slug: string;
  level2: string;
}) {
  if (installers.length === 1) {
    return (
      <SoleInstaller
        b={installers[0]!}
        country={country}
        place={level2}
        level1={level1}
        level1Slug={level1Slug}
      />
    );
  }

  return (
    <ul>
      {installers.map((b) => (
        <InstallerRow key={b.slug} b={b} country={country} />
      ))}
    </ul>
  );
}
