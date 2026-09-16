/**
 * The most-rendered component on the site: 601 geo pages plus the leaf
 * variants. geo-listing.md §7.
 *
 * One entity, one fixed reading order, scanned down a column of twenty-two:
 * anchor → name → place → what they do, with the comparable number
 * right-aligned and tabular so the eye can run down a column of numbers rather
 * than hunting for each one.
 *
 * Three things the data forced (archetype/data.md):
 *  - The name reaches 70 characters, so it must wrap to two lines without
 *    breaking the row. `basis-64` plus `min-w-0` is what allows that.
 *  - 11 rows have no phone and both CTAs depend on it. That is a real empty
 *    state, not an edge case — it falls back to the profile link.
 *  - The "Verified Business" badge is gone. It was on 100% of rows, and a
 *    marker every result carries is a logo, not a signal.
 *
 * The metric renders only when there is something to say. A blank reads as
 * "not measured"; a zero reads as "measured, and bad".
 */
import { SERVICE_NAMES } from '@/lib/directory/services';
import { installerUrl } from '@/lib/directory/urls';
import type { InstallerRowData } from '@/lib/directory/types';
import { CallButton, WhatsAppButton } from './ContactButtons';
import { WorkThumb } from './WorkThumb';

export function InstallerRow({ b, country }: { b: InstallerRowData; country: string }) {
  const href = installerUrl(country, b.slug);
  const services = b.services
    .slice(0, 2)
    .map((s) => SERVICE_NAMES[s])
    .filter(Boolean)
    .join(' · ');

  return (
    <li className="flex flex-wrap items-start gap-x-md gap-y-sm border-b border-line py-md last:border-b-0">
      <WorkThumb b={b} />

      <div className="min-w-0 flex-1 basis-64">
        <h3 className="text-base leading-snug">
          <a href={href}>{b.name.trim()}</a>
        </h3>
        <p className="mt-2xs truncate text-sm text-ink-muted">{b.address?.trim() || b.city}</p>
        {services ? <p className="mt-2xs truncate text-xs text-ink-subtle">{services}</p> : null}
      </div>

      <div className="ml-auto flex shrink-0 flex-col items-end gap-xs">
        {b.projects > 0 ? (
          <p className="text-xs tabular-nums text-ink-muted">
            <span className="font-semibold text-ink">{b.projects}</span>{' '}
            {b.projects === 1 ? 'install' : 'installs'}
          </p>
        ) : null}

        {b.phone ? (
          <div className="flex gap-xs">
            <CallButton phone={b.phone} />
            <WhatsAppButton phone={b.phone} />
          </div>
        ) : (
          <a href={href} className="text-sm">
            View contact details
          </a>
        )}
      </div>
    </li>
  );
}
