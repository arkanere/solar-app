/**
 * The single-result treatment. geo-listing.md §2.
 *
 * 108 of 221 district pages have exactly one installer. A one-item list reads
 * as a failure to find anything — the scan affordances of a column (a sort
 * order, a right-aligned metric to compare against, rows to run down) all point
 * at a comparison the reader cannot make. So the same content is presented as
 * an answer instead: one installer covers this district, here they are, and
 * here is the route to more choice if that is not enough.
 *
 * Two treatments, one component set, switched on installerCount. Not one
 * elastic layout that is mediocre at both ends.
 */
import { SERVICE_NAMES } from '@/lib/directory/services';
import { geoUrl, installerUrl } from '@/lib/directory/urls';
import type { InstallerRowData } from '@/lib/directory/types';
import { CallButton, WhatsAppButton } from './ContactButtons';
import { WorkThumb } from './WorkThumb';

export function SoleInstaller({
  b,
  country,
  place,
  level1,
  level1Slug
}: {
  b: InstallerRowData;
  country: string;
  place: string;
  level1: string;
  level1Slug: string;
}) {
  const href = installerUrl(country, b.slug);
  const services = b.services
    .map((s) => SERVICE_NAMES[s])
    .filter(Boolean)
    .join(' · ');

  return (
    // Capped at the narrow measure, as the specimen sheet showed it. At the
    // full content width the two CTAs stretch to ~550px each, which reads as a
    // form, not a pair of buttons — and a single card has no column to align
    // with, so nothing is gained by letting it run.
    <div className="max-w-narrow rounded-lg border border-line bg-surface p-lg">
      <p className="text-xs text-ink-muted">One installer covers {place}.</p>

      <div className="mt-md flex gap-md">
        <WorkThumb b={b} size={72} />
        <div className="min-w-0">
          <h2 className="text-lg leading-tight">
            <a href={href}>{b.name.trim()}</a>
          </h2>
          <p className="mt-2xs text-sm text-ink-muted">{b.address?.trim() || b.city}</p>
          {services ? <p className="mt-2xs text-xs text-ink-subtle">{services}</p> : null}
        </div>
      </div>

      {b.phone ? (
        <div className="mt-lg flex gap-xs">
          <CallButton phone={b.phone} wide />
          <WhatsAppButton phone={b.phone} wide />
        </div>
      ) : null}

      <p className="mt-md text-sm text-ink-muted">
        Looking for more choice? <a href={geoUrl(country, level1Slug)}>See all installers in {level1}</a>.
      </p>
    </div>
  );
}
