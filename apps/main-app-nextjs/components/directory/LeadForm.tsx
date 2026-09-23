/* eslint-disable-next-line no-restricted-syntax -- Interactive leaf. Five controlled fields, per-field validation on blur, a consent checkbox that gates the submit, and the submit itself: all of it is local state reacting to typing, which is the one thing a server component cannot do. It is the only 'use client' on the district page. */
'use client';

/**
 * The lead form. geo-listing.md §5 section 7, §11 ("client leaf").
 *
 * It posts to this app's own
 * `/{cc}/api/submitLead` for BOTH countries. The SvelteKit original sends IN
 * cross-origin to https://user.solarvipani.com/in/api/submitLead and only
 * non-IN to the local endpoint; that split is not carried across, so there is
 * one code path here and no dependency on another app's
 * Access-Control-Allow-Origin allowlist. The row written is the same either
 * way — both handlers insert `leaddata` with country_code 'in'.
 *
 * Two rules this form is built around, both learned the hard way:
 *
 *  - **Read the response before claiming anything.** The SvelteKit form used
 *    to fire the request and navigate to the thank-you page unconditionally.
 *    When the endpoint moved on 2026-08-23 and main-app was not redeployed,
 *    every submission 404'd and every visitor still saw a confirmation.
 *    Nobody noticed for 19 days. So success here is gated on `body.success`,
 *    not on the request having been sent.
 *  - **Confirm in place, do not redirect.** `/{cc}/thank-you` is still a
 *    scaffold stub in this app, and sending someone to a stub is worse than
 *    confirming where they are. The panel replaces the form on success.
 *
 * The confirmation email is live, so the
 * success copy may now mention it — but only when an address was actually
 * given. `email` is optional in `leadSchema` and `submitLead` skips the mail
 * without one; promising an email to someone who left the field blank is the
 * same class of mistake as the unconditional redirect above.
 *
 * Validation runs on blur as well as on submit — on a five-field form blur is
 * the better moment: the reader finds out about a bad phone number while they
 * are still looking at the phone number. `validateLead` is a CLIENT-SIDE
 * convenience only; the endpoint validates independently with
 * `@solar/validation`'s `leadSchema`, so a client bypass does not get a row
 * in. See `leadValidation.ts` for where the two deliberately differ.
 */
import { useId, useState } from 'react';
import { usePathname } from 'next/navigation';
import { capture } from '@/lib/analytics';
import type { CountryConfig } from '@/lib/countries';
import { validateLead, type LeadErrors, type LeadFields } from '@/lib/directory/leadValidation';

const EMPTY: LeadFields = { name: '', phone: '', postalCode: '', email: '', comment: '' };

const FIELD =
  'w-full rounded-md border border-line-strong bg-surface px-sm py-xs text-base transition-colors duration-fast ease-standard placeholder:text-ink-subtle disabled:opacity-60';

/**
 * `prefill` and `urlParam` are for the chatbot's lead card, which fills in what
 * the conversation already established and reports its leads as `/chatbot`.
 */
export function LeadForm({
  country,
  prefill,
  urlParam
}: {
  country: CountryConfig;
  prefill?: Partial<LeadFields>;
  urlParam?: string;
}) {
  const formId = useId();
  const pathname = usePathname();
  const [values, setValues] = useState<LeadFields>({ ...EMPTY, ...prefill });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /** Validate the whole form but surface only the field being left, so a
   *  reader is not told about fields they have not reached yet. */
  function checkOnBlur(field: keyof LeadFields) {
    const all = validateLead(values, country);
    setErrors((prev) => ({ ...prev, [field]: all[field] }));
  }

  function set(field: keyof LeadFields, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear an error as soon as the field is corrected — but never raise one
    // mid-keystroke, which would flag every address as invalid up to the `@`.
    if (errors[field]) {
      const all = validateLead({ ...values, [field]: value }, country);
      if (!all[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // On submit every error surfaces at once, unlike blur: at this point the
    // reader has been through the whole form, so there is nothing to protect
    // them from.
    const all = validateLead(values, country);
    setErrors(all);
    if (Object.keys(all).some((key) => all[key as keyof LeadFields]) || !consent) return;

    setSubmitting(true);
    setSubmitError('');
    const source = urlParam ?? pathname;

    try {
      const response = await fetch(`/${country.code}/api/submitLead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          postalCode: values.postalCode,
          email: values.email,
          comment: values.comment,
          // `urlParam` is the page the lead came from — the pathname only,
          // matching the SvelteKit form. It is what tells a claimed lead which
          // district page produced it.
          urlParam: source,
          marketing_consent: consent
        })
      });

      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.success) {
        throw new Error(body?.error ?? `submitLead returned ${response.status}`);
      }

      capture('quote_submitted', { source_url: source });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        'We could not submit your details just now. Please check your connection and try again.'
      );
      setSubmitting(false);
    }
  }

  function field(
    name: keyof LeadFields,
    label: string,
    input: (props: {
      id: string;
      value: string;
      disabled: boolean;
      'aria-invalid': boolean | undefined;
      'aria-describedby': string | undefined;
      onChange: (e: { target: { value: string } }) => void;
      onBlur: () => void;
    }) => React.ReactNode
  ) {
    const id = `${formId}-${name}`;
    const error = errors[name];
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-semibold">
          {label}
        </label>
        <div className="mt-2xs">
          {input({
            id,
            value: values[name],
            disabled: submitting,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': error ? `${id}-error` : undefined,
            onChange: (e) => set(name, e.target.value),
            onBlur: () => checkOnBlur(name)
          })}
        </div>
        {error ? (
          <p id={`${id}-error`} role="alert" className="mt-2xs text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  const consentId = `${formId}-consent`;

  // The form is replaced rather than hidden, so there is nothing left to
  // resubmit and no second row from a double click.
  if (submitted) {
    return (
      <div role="status" className="rounded-md border border-line bg-surface-sunken p-md">
        <p className="text-base font-semibold">Your request is in.</p>
        <p className="mt-xs text-sm text-ink-muted">
          Installers who cover your area will call you on the number you gave. Keep an eye on your
          phone over the next couple of working days.
          {values.email ? ` A confirmation is on its way to ${values.email}.` : ''}
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-md" noValidate onSubmit={handleSubmit}>
      {field('name', 'Name', (p) => (
        <input {...p} type="text" autoComplete="name" placeholder="Your name" className={FIELD} />
      ))}

      {field('phone', 'Phone number', (p) => (
        <input
          {...p}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={`${country.phone.callingCode} 00000 00000`}
          className={FIELD}
        />
      ))}

      {field('postalCode', country.postalCode.label, (p) => (
        <input
          {...p}
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={country.postalCode.maxLength}
          placeholder={`${country.postalCode.maxLength} digits`}
          className={FIELD}
        />
      ))}

      {field('email', 'Email address', (p) => (
        <input
          {...p}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={FIELD}
        />
      ))}

      {field('comment', 'What do you need?', (p) => (
        <textarea
          {...p}
          rows={3}
          placeholder="Roof type, monthly bill, rough system size — whatever you know."
          className={`${FIELD} resize-y`}
        />
      ))}

      <label htmlFor={consentId} className="flex cursor-pointer items-start gap-xs text-sm">
        <input
          id={consentId}
          type="checkbox"
          checked={consent}
          disabled={submitting}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-2xs size-4 shrink-0 accent-[var(--color-action)]"
        />
        <span className="text-ink-muted">
          I consent to Solar Vipani sharing my contact details with solar installers in my area to
          follow up on my enquiry.
        </span>
      </label>

      {submitError ? (
        <p role="alert" className="text-sm text-danger">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        // Gated on consent only. Leaving it enabled with invalid fields is
        // deliberate: the submit handler surfaces every error at once, which
        // tells the reader what is wrong. A disabled button tells them nothing.
        disabled={!consent || submitting}
        className="rounded-md bg-action px-md py-sm text-base font-semibold text-action-ink transition-colors duration-fast ease-standard hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Sending…' : 'Get free quotes'}
      </button>
    </form>
  );
}
