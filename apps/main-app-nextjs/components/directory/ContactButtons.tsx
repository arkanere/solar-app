/**
 * The two actions a listing row offers.
 *
 * Decided 2026-09-06 (geo-listing.md §8, archetype 1 §6): both are `action`.
 * CALL NOW was `bg-destructive` and WHATSAPP `bg-success`, which had status
 * colours doing the work of actions — red for the primary call-to-action on a
 * directory is exactly the overload rule 2 exists to prevent. Now the pair is
 * one hue, filled primary and outlined secondary, and the distinction between
 * them is emphasis rather than meaning.
 *
 * These stay server components. They are anchors with `tel:` and `wa.me`
 * hrefs — nothing here needs JavaScript, so nothing here needs 'use client'.
 * The click events are data attributes (lib/track.ts). The Umami names are
 * SvelteKit's, city and slug as stored, so the dashboards carry over.
 */
import { MessageCircle, Phone } from 'lucide-react';
import { trackAttrs } from '@/lib/track';

type Props = { phone: string; slug: string; city: string; wide?: boolean };

const BASE =
  'inline-flex items-center justify-center gap-xs rounded-md px-md py-xs text-sm font-semibold no-underline transition-colors duration-fast ease-standard';

export function CallButton({ phone, slug, city, wide }: Props) {
  return (
    <a
      href={`tel:${phone}`}
      {...trackAttrs(
        'call_initiated',
        { business_slug: slug, city },
        `${city}-call-now-button-${slug}`
      )}
      className={`${BASE} bg-action text-action-ink hover:bg-action-hover ${wide ? 'flex-1' : ''}`}
    >
      <Phone aria-hidden className="size-4" />
      Call
    </a>
  );
}

export function WhatsAppButton({ phone, slug, city, wide }: Props) {
  return (
    <a
      href={`https://wa.me/${phone.replace(/\D/g, '')}`}
      {...trackAttrs(
        'whatsapp_initiated',
        { business_slug: slug, city },
        `${city}-whatsapp-button-${slug}`
      )}
      className={`${BASE} border border-action text-action hover:bg-accent-surface ${
        wide ? 'flex-1' : ''
      }`}
    >
      <MessageCircle aria-hidden className="size-4" />
      WhatsApp
    </a>
  );
}
