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
 */
import { MessageCircle, Phone } from 'lucide-react';

const BASE =
  'inline-flex items-center justify-center gap-xs rounded-md px-md py-xs text-sm font-semibold no-underline transition-colors duration-fast ease-standard';

export function CallButton({ phone, wide }: { phone: string; wide?: boolean }) {
  return (
    <a
      href={`tel:${phone}`}
      className={`${BASE} bg-action text-action-ink hover:bg-action-hover ${wide ? 'flex-1' : ''}`}
    >
      <Phone aria-hidden className="size-4" />
      Call
    </a>
  );
}

export function WhatsAppButton({ phone, wide }: { phone: string; wide?: boolean }) {
  return (
    <a
      href={`https://wa.me/${phone.replace(/\D/g, '')}`}
      className={`${BASE} border border-action text-action hover:bg-accent-surface ${
        wide ? 'flex-1' : ''
      }`}
    >
      <MessageCircle aria-hidden className="size-4" />
      WhatsApp
    </a>
  );
}
