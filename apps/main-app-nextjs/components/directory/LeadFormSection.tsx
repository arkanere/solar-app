/**
 * The lead form and the offer above it. geo-listing.md §5 section 7.
 *
 * Server component wrapping the one client leaf on the page, so the heading,
 * the copy and the panel are all rendered on the server and only the five
 * controlled fields ship JavaScript.
 *
 * The SvelteKit original had two headings — "Get 2-3 Free Quotes at {city}"
 * when the place has installers and "Be the First to Get Quotes When
 * Installers Join {city}" when it does not. The second is unreachable from
 * this page: a district with no businesses 404s (§4). It is dropped rather
 * than carried across dead; the city leaf can reintroduce it if it turns out
 * to need one, which is where that branch is actually live.
 *
 * Capped at the narrow measure for the reason SoleInstaller is: at the full
 * content width the fields stretch to 1152px, which is unreadable as a form
 * and unbuildable as a scan. The lint rule allows a bare `max-w-*` for exactly
 * this — it is typography inside a wider section, not a second container, so
 * it must not centre.
 */
import type { CountryConfig } from '@/lib/countries';
import { LeadForm } from './LeadForm';

export function LeadFormSection({
  country,
  place
}: {
  country: CountryConfig;
  place: string;
}) {
  return (
    <div className="max-w-narrow rounded-lg border border-line bg-surface p-lg">
      <h2 className="text-xl">Get 2–3 free quotes in {place}</h2>
      <p className="mt-sm text-ink-muted">
        Tell us what you need once, and installers who cover {place} come back to you. No cost, no
        obligation.
      </p>
      <div className="mt-lg">
        <LeadForm country={country} />
      </div>
    </div>
  );
}
