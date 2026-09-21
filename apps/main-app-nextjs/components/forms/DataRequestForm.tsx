/* eslint-disable-next-line no-restricted-syntax -- Interactive leaf. Three controlled fields, a submit that posts and swaps the form for a confirmation panel. All local state reacting to typing, which a server component cannot do. */
'use client';

/**
 * The DPDP compliance request form. Ported from the two Svelte pages
 * apps/main-app/src/routes/(layout-1)/data-access/+page.svelte and
 * .../data-deletion/+page.svelte, which carried a copy of it each.
 *
 * ONE COMPONENT, TWO PAGES. The originals are the same three fields, the same
 * submit and the same success swap; they differ in the endpoint, the button,
 * one field label and the confirmation copy. Those four are props. The copy
 * around the form is not — it is long, it is different on each page, and it is
 * static, so it stays in the two server components where it can render on the
 * server.
 *
 * Two departures from the originals, both the calls BusinessForm.tsx records:
 *
 *  - **The submit stays enabled.** Nothing here disables it on a validation
 *    state, so there is no dead button with no explanation.
 *  - **Errors render in the form**, not in an alert or a toast.
 *
 * NO CLIENT-SIDE VALIDATION BEYOND `required` AND `type="email"`. There is no
 * `dataRequestValidation.ts` to match `businessValidation.ts`, and there
 * should not be: the only rule the schema has past the browser's own is a
 * length ceiling nobody reaches by hand. The endpoint validates with
 * `dataRequestSchema` and its field errors are surfaced below.
 *
 * ON SUCCESS THE FORM IS REPLACED, not redirected. Unlike a signup there is no
 * confirmation page to send anyone to, and the receipt the visitor needs is
 * one sentence — the same call `LeadForm` makes.
 */
import { useId, useState } from 'react';

/** Shared with BusinessForm's FIELD and Field.tsx's CONTROL. */
const FIELD =
  'w-full rounded-md border border-line-strong bg-surface px-sm py-xs text-base transition-colors duration-fast ease-standard placeholder:text-ink-subtle disabled:opacity-60';

type Fields = { email: string; phone: string; reason: string };

const EMPTY: Fields = { email: '', phone: '', reason: '' };

export function DataRequestForm({
  endpoint,
  submitLabel,
  reasonLabel,
  reasonPlaceholder,
  confirmation
}: {
  /** The route handler this posts to, e.g. `/api/submitDataAccess`. */
  endpoint: string;
  submitLabel: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  /** What replaces the form once the request is recorded. */
  confirmation: React.ReactNode;
}) {
  const formId = useId();
  const [values, setValues] = useState<Fields>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof Fields, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.success) {
        // The endpoint's own message when it has one — a 400 from
        // `dataRequestSchema` says which field is wrong, and repeating that is
        // more use than "failed to submit", which is all the originals said.
        throw new Error(body?.error ?? `${endpoint} returned ${response.status}`);
      }

      setSubmitted(true);
      setValues(EMPTY);
    } catch (submitFailure) {
      console.error('Error submitting data request:', submitFailure);
      setError(
        submitFailure instanceof Error && submitFailure.message
          ? submitFailure.message
          : 'We could not submit your request just now. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-lg border border-line-strong bg-surface-sunken p-lg font-serif text-prose text-ink-muted"
      >
        {confirmation}
      </div>
    );
  }

  return (
    // `font-sans` is explicit because both callers render this inside a serif
    // prose block. A control is UI, not prose — the same call privacy-policy
    // makes for its table, and ArticleBody.tsx before it.
    <form className="flex flex-col gap-md font-sans text-ink" onSubmit={handleSubmit}>
      <div>
        <label htmlFor={`${formId}-email`} className="block text-sm font-semibold">
          Email address
        </label>
        <div className="mt-2xs">
          <input
            id={`${formId}-email`}
            type="email"
            required
            autoComplete="email"
            disabled={submitting}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="Enter your email address (business or personal)"
            className={FIELD}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-phone`} className="block text-sm font-semibold">
          Phone number
        </label>
        <p id={`${formId}-phone-hint`} className="mt-2xs text-2xs text-ink-subtle">
          Optional. It helps us find records filed against a number rather than an address.
        </p>
        <div className="mt-2xs">
          <input
            id={`${formId}-phone`}
            type="tel"
            autoComplete="tel"
            disabled={submitting}
            aria-describedby={`${formId}-phone-hint`}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="Enter your phone number"
            className={FIELD}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-reason`} className="block text-sm font-semibold">
          {reasonLabel}
        </label>
        <div className="mt-2xs">
          <textarea
            id={`${formId}-reason`}
            rows={4}
            disabled={submitting}
            value={values.reason}
            onChange={(e) => set('reason', e.target.value)}
            placeholder={reasonPlaceholder}
            className={FIELD}
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-action px-md py-sm text-base font-semibold text-action-ink transition-colors duration-fast ease-standard hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : submitLabel}
      </button>
    </form>
  );
}
