/**
 * The offer_lead_form tool result: the site's own LeadForm inside a card. The
 * agent cannot write leads itself; submitting here is the only path to the
 * leads table, through the same endpoint and validation as every other form.
 *
 * The payload carries a title, a description, and a prefill map built from
 * what the conversation already established.
 *
 * The country comes from the URL, because the chat is on every page, prefixed
 * or not. An unprefixed page posts as IN, as SvelteKit did.
 */
import { usePathname } from 'next/navigation';
import { LeadForm } from '@/components/directory/LeadForm';
import { getCountry, isCountry } from '@/lib/countries';
import { WidgetShell, type ToolData } from './parts';

export function LeadFormCard({ data }: { data: ToolData }) {
  const segment = usePathname().split('/')[1] ?? '';
  const country = getCountry(isCountry(segment) ? segment : 'in');

  const p: ToolData = data.prefill ?? {};
  // pinCode is the backend's name for it; the form calls it postalCode.
  const prefill = {
    name: p.name ?? '',
    phone: p.phone ?? '',
    postalCode: p.pinCode ?? '',
    email: p.email ?? '',
    comment: p.comment ?? ''
  };
  const prefilled = Object.values(prefill).some(Boolean);

  return (
    <WidgetShell emoji="📝" title={data.title ?? 'Get Your Solar Consultation'}>
      <p className="text-sm text-ink-muted">
        {data.description ??
          'Please fill out the form below and our team will help you get quotations from 2-3 verified installers working in your area.'}
      </p>
      {prefilled && (
        <p className="text-xs text-ink-muted">
          We&apos;ve filled in what you already told us — please check it and add the rest.
        </p>
      )}
      <LeadForm country={country} prefill={prefill} urlParam="/chatbot" />
    </WidgetShell>
  );
}
