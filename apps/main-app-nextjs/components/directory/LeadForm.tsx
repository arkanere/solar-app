/* eslint-disable-next-line no-restricted-syntax -- Interactive leaf. Five controlled fields, per-field validation on blur and a consent checkbox that gates the submit: all of it is local state reacting to typing, which is the one thing a server component cannot do. It is the only 'use client' on the district page. */
'use client';

/**
 * The lead form. geo-listing.md §5 section 7, §11 ("client leaf").
 *
 * ⚠️ NOT WIRED. Decided 2026-09-16: this slice builds the markup and the
 * validation, and submits nowhere. The submit button is disabled and the form
 * says so above it, in plain words, where a visitor reads it.
 *
 * The reason is worth writing down, because "finish it later" is how the
 * SvelteKit version acquired its worst bug. That form fired the request and
 * navigated to the thank-you page unconditionally; when the endpoint moved on
 * 2026-08-23 and main-app was not redeployed, every submission 404'd and every
 * visitor still saw a confirmation. Nobody noticed for 19 days. A form that
 * visibly does not submit is a smaller failure than a form that claims to.
 *
 * Where it will point when it is wired, from the SvelteKit original:
 *  - IN posts cross-origin to https://user.solarvipani.com/in/api/submitLead,
 *    which user-app owns. That is a cross-origin *read*, so it depends on
 *    user-app's Access-Control-Allow-Origin header.
 *  - Everything else posts to /{cc}/api/submitLead, which in this app is still
 *    a 501 stub.
 * Whichever lands first, the rule the SvelteKit form learned applies: read the
 * response and check `body.success` before claiming anything.
 *
 * Validation runs on blur rather than on submit, because with the submit
 * disabled there is no submit event to hang it on — and on a five-field form
 * blur is the better moment anyway: the reader finds out about a bad phone
 * number while they are still looking at the phone number.
 */
import { useId, useState } from 'react';
import type { CountryConfig } from '@/lib/countries';
import { validateLead, type LeadErrors, type LeadFields } from '@/lib/directory/leadValidation';

const EMPTY: LeadFields = { name: '', phone: '', postalCode: '', email: '', comment: '' };

const FIELD =
  'w-full rounded-md border border-line-strong bg-surface px-sm py-xs text-base transition-colors duration-fast ease-standard placeholder:text-ink-subtle disabled:opacity-60';

export function LeadForm({ country }: { country: CountryConfig }) {
  const formId = useId();
  const [values, setValues] = useState<LeadFields>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [consent, setConsent] = useState(false);

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

  function field(
    name: keyof LeadFields,
    label: string,
    input: (props: {
      id: string;
      value: string;
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
            // The fields stay enabled although the submit is not: the whole
            // point of this slice is that the validation can be exercised and
            // reviewed. It is the BUTTON that must not claim anything.
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

  return (
    <form
      className="flex flex-col gap-md"
      // No action and no onSubmit. `noValidate` would normally be here to let
      // the code own the messages; with nothing to submit, the browser never
      // gets the chance to validate either way.
      onSubmit={(e) => e.preventDefault()}
    >
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
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-2xs size-4 shrink-0 accent-[var(--color-action)]"
        />
        <span className="text-ink-muted">
          I consent to Solar Vipani sharing my contact details with solar installers in my area to
          follow up on my enquiry.
        </span>
      </label>

      <p role="status" className="rounded-md border border-line bg-surface-sunken px-sm py-xs text-sm text-ink-muted">
        This form is not connected yet — nothing you type here is sent or stored. Call an installer
        below in the meantime.
      </p>

      <button
        type="submit"
        disabled
        className="rounded-md bg-action px-md py-sm text-base font-semibold text-action-ink transition-colors duration-fast ease-standard hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        Get free quotes
      </button>
    </form>
  );
}
