/* eslint-disable-next-line no-restricted-syntax -- Interactive leaf. Twelve controlled fields, three of them a cascading state -> district -> city chain that fetches as the reader picks, per-field validation on blur, and the submit. All of it is local state reacting to typing, which is the one thing a server component cannot do. */
'use client';

/**
 * The business signup form. Ported from
 * apps/main-app/src/lib/components/BusinessForm.svelte.
 *
 * Three pages render it: `/{cc}/business-form`, `/{cc}/partners/join` and
 * `/{cc}/partners/join/{district_slug}`. It is the whole of the first two and
 * the bottom of the third, which is why it takes no copy — the heading and the
 * pitch belong to the page.
 *
 * **The cascading selects are the reason this fetches at all.** A country's
 * geo tree is 8,043 rows for IN and 20,940 for US, so the state list ships
 * with the page (`lib/countries/states.ts`) and the other two levels are
 * asked for as the reader picks: `/{cc}/api/getLevel2s` then
 * `/{cc}/api/getCities`. Both selects submit DISPLAY NAMES, not slugs —
 * `business_profiles.level1`/`level2`/`city` hold names — so the endpoints'
 * slugs are read and discarded here.
 *
 * Four departures from the original, all deliberate:
 *
 *  - **No `alert()`.** The original reports both a failed submission and a
 *    thrown fetch with `alert(...)`. A browser modal is the wrong control for
 *    a form error — it is unreadable to a screen reader in context, it cannot
 *    be styled, and it puts the message somewhere the reader must dismiss
 *    before they can look at the field. Errors render in the form.
 *  - **`isFormValid()` is gone.** The original disables the submit whenever
 *    any error string is non-empty, which means a reader who blurs a bad phone
 *    number and then corrects a DIFFERENT field is left with a dead button and
 *    nothing telling them why. The submit stays enabled and surfaces every
 *    error at once — the same call LeadForm.tsx records.
 *  - **`scrollToFirstError` is gone with it.** It queried
 *    `[data-error-field]` out of the DOM to scroll. With every error rendered
 *    at once and the first one focused instead, there is nothing to hunt for.
 *  - **The selects reset their dependents explicitly.** The original does this
 *    inside two `$effect`s that watch `selectedState` and `district`. Effects
 *    that fetch on a state change are the classic way to end up with a stale
 *    response overwriting a fresh one; these are event handlers, and each
 *    fetch is guarded by the value that started it.
 *
 * Validation runs on blur as well as on submit, as LeadForm does and for the
 * same reason. `validateBusiness` is a CLIENT-SIDE convenience only — the
 * endpoint validates independently with `@solar/validation`'s
 * `submitBusinessSchema`, so a client bypass does not get a row in.
 */
import { useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CountryConfig } from '@/lib/countries';
import { statesFor } from '@/lib/countries/states';
import {
  validateBusiness,
  type BusinessErrors,
  type BusinessFields
} from '@/lib/forms/businessValidation';

const EMPTY: BusinessFields = {
  businessName: '',
  taxId: '',
  address: '',
  plusCode: '',
  phoneNumber: '',
  whatsappNumber: '',
  email: '',
  loginEmail: '',
  website: '',
  state: '',
  level2: '',
  city: ''
};

/** Shared with LeadForm's FIELD and Field.tsx's CONTROL. */
const FIELD =
  'w-full rounded-md border border-line-strong bg-surface px-sm py-xs text-base transition-colors duration-fast ease-standard placeholder:text-ink-subtle disabled:opacity-60';

export function BusinessForm({ country }: { country: CountryConfig }) {
  const formId = useId();
  const router = useRouter();
  const states = statesFor(country.code);
  const level2Label = country.levels.level2.singular;

  const [values, setValues] = useState<BusinessFields>(EMPTY);
  const [errors, setErrors] = useState<BusinessErrors>({});
  const [level2s, setLevel2s] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingLevel2s, setLoadingLevel2s] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /**
   * The value that started the in-flight lookup. A reader who picks a state
   * and immediately picks another gets two requests, and the slower one may
   * land second; comparing against this on arrival drops the stale answer.
   */
  const level2Request = useRef('');
  const cityRequest = useRef('');

  function set(field: keyof BusinessFields, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear an error as soon as the field is corrected — but never raise one
    // mid-keystroke, which would flag every address as invalid up to the `@`.
    if (errors[field]) {
      const all = validateBusiness({ ...values, [field]: value }, country);
      if (!all[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  /** Validate the whole form but surface only the field being left. */
  function checkOnBlur(field: keyof BusinessFields) {
    const all = validateBusiness(values, country);
    setErrors((prev) => ({ ...prev, [field]: all[field] }));
  }

  async function chooseState(state: string) {
    // Both dependents are cleared at once: a district from the previous state
    // is not a valid answer for this one, and leaving it selected would submit
    // a district that does not exist in the state beside it.
    setValues((prev) => ({ ...prev, state, level2: '', city: '' }));
    setErrors((prev) => ({ ...prev, state: undefined }));
    setLevel2s([]);
    setCities([]);
    if (!state) return;

    level2Request.current = state;
    setLoadingLevel2s(true);
    try {
      const response = await fetch(
        `/${country.code}/api/getLevel2s?state=${encodeURIComponent(state)}`
      );
      const body = await response.json();
      if (level2Request.current !== state) return;
      setLevel2s((body?.level2s ?? []).map((l: { name: string }) => l.name));
    } catch (error) {
      console.error(`Error fetching ${level2Label.toLowerCase()}s:`, error);
    } finally {
      if (level2Request.current === state) setLoadingLevel2s(false);
    }
  }

  async function chooseLevel2(level2: string) {
    setValues((prev) => ({ ...prev, level2, city: '' }));
    setErrors((prev) => ({ ...prev, level2: undefined }));
    setCities([]);
    if (!level2) return;

    cityRequest.current = level2;
    setLoadingCities(true);
    try {
      const response = await fetch(
        `/${country.code}/api/getCities?state=${encodeURIComponent(values.state)}&level2=${encodeURIComponent(level2)}`
      );
      const body = await response.json();
      if (cityRequest.current !== level2) return;
      setCities((body?.cities ?? []).map((c: { name: string }) => c.name));
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      if (cityRequest.current === level2) setLoadingCities(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const all = validateBusiness(values, country);
    setErrors(all);
    const firstBad = (Object.keys(all) as (keyof BusinessFields)[]).find((key) => all[key]);
    if (firstBad) {
      // Focus rather than scroll: it moves the viewport the same way and it
      // also puts the caret where the reader has to type, which a scroll does
      // not. Replaces the original's `scrollToFirstError`.
      document.getElementById(`${formId}-${firstBad}`)?.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`/${country.code}/api/submitBusiness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: values.businessName,
          address: values.address,
          plusCode: values.plusCode,
          phoneNumber: values.phoneNumber,
          whatsappNumber: values.whatsappNumber,
          email: values.email,
          login_email: values.loginEmail,
          website: values.website,
          gstn: values.taxId,
          state: values.state,
          // Keyed by the country's own noun. The endpoint and the schema read
          // whichever one belongs to the country and a value under the wrong
          // key is dropped silently, so this is derived from the same config
          // that labels the select.
          [level2Label.toLowerCase()]: values.level2,
          city: values.city
        })
      });

      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.success) {
        throw new Error(body?.error ?? `submitBusiness returned ${response.status}`);
      }

      // Unlike LeadForm, this does redirect: `/{cc}/thank-you-business` is a
      // real page, and a signup's confirmation has to survive the reader
      // closing the tab and coming back — which an in-place panel does not.
      router.push(`/${country.code}/thank-you-business`);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : 'We could not submit your details just now. Please check your connection and try again.'
      );
      setSubmitting(false);
    }
  }

  function field(
    name: keyof BusinessFields,
    label: string,
    input: (props: {
      id: string;
      value: string;
      disabled: boolean;
      'aria-invalid': boolean | undefined;
      'aria-describedby': string | undefined;
      onChange: (e: { target: { value: string } }) => void;
      onBlur: () => void;
    }) => React.ReactNode,
    hint?: string
  ) {
    const id = `${formId}-${name}`;
    const error = errors[name];
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-semibold">
          {label}
        </label>
        {hint ? (
          <p id={hintId} className="mt-2xs text-2xs text-ink-subtle">
            {hint}
          </p>
        ) : null}
        <div className="mt-2xs">
          {input({
            id,
            value: values[name],
            disabled: submitting,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
            onChange: (e) => set(name, e.target.value),
            onBlur: () => checkOnBlur(name)
          })}
        </div>
        {error ? (
          <p id={errorId} role="alert" className="mt-2xs text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-md" noValidate onSubmit={handleSubmit}>
      {field('businessName', 'Business name', (p) => (
        <input {...p} type="text" autoComplete="organization" placeholder="Business name" className={FIELD} />
      ))}

      {/* Only for countries that collect a tax id at signup (IN: GSTN). The
          endpoint accepts the field either way and the US form has never
          shown it. */}
      {country.taxId.collectOnSignup
        ? field('taxId', `${country.taxId.label} (required)`, (p) => (
            <input
              {...p}
              type="text"
              // The stored value is uppercase and the rule only accepts
              // uppercase, so the field does the conversion rather than
              // failing someone who typed it in lower case.
              onChange={(e) => set('taxId', e.target.value.toUpperCase())}
              placeholder={country.taxId.label}
              maxLength={15}
              className={`${FIELD} uppercase`}
            />
          ))
        : null}

      {field(
        'address',
        'Address',
        (p) => <input {...p} type="text" autoComplete="street-address" placeholder="Business address" className={FIELD} />,
        'A complete address helps customers find your business.'
      )}

      {field(
        'plusCode',
        'Plus Code',
        (p) => <input {...p} type="text" placeholder="Plus Code" className={FIELD} />,
        'For navigation on Google Maps. Optional.'
      )}

      {field('phoneNumber', 'Phone number', (p) => (
        <input
          {...p}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Phone number"
          className={FIELD}
        />
      ))}

      {field(
        'whatsappNumber',
        'WhatsApp number',
        (p) => (
          <input
            {...p}
            type="tel"
            inputMode="tel"
            placeholder={`${country.phone.callingCode.replace('+', '')}9812345678`}
            className={FIELD}
          />
        ),
        'Optional.'
      )}

      {field(
        'email',
        'Business email',
        (p) => <input {...p} type="email" autoComplete="email" placeholder="Email address" className={FIELD} />,
        'Shown on your public business profile.'
      )}

      {field(
        'loginEmail',
        'Login email',
        (p) => <input {...p} type="email" placeholder="Email address" className={FIELD} />,
        'Where your login instructions are sent.'
      )}

      {field('website', 'Website', (p) => (
        <input {...p} type="text" inputMode="url" placeholder="Business website" className={FIELD} />
      ))}

      {field('state', country.levels.level1.singular, (p) => (
        <select {...p} onChange={(e) => chooseState(e.target.value)} className={FIELD}>
          <option value="">Select a {country.levels.level1.singular.toLowerCase()}</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      ))}

      {field('level2', level2Label, (p) => (
        <select
          {...p}
          disabled={submitting || !values.state || loadingLevel2s}
          onChange={(e) => chooseLevel2(e.target.value)}
          className={FIELD}
        >
          <option value="">
            {loadingLevel2s
              ? `Loading ${level2Label.toLowerCase()}s…`
              : `Select a ${level2Label.toLowerCase()}`}
          </option>
          {level2s.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      ))}

      {field('city', 'City', (p) => (
        <select
          {...p}
          disabled={submitting || !values.level2 || loadingCities}
          onChange={(e) => set('city', e.target.value)}
          className={FIELD}
        >
          <option value="">{loadingCities ? 'Loading cities…' : 'Select a city'}</option>
          {cities.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      ))}

      {submitError ? (
        <p role="alert" className="text-sm text-danger">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-action px-md py-sm text-base font-semibold text-action-ink transition-colors duration-fast ease-standard hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : 'Submit'}
      </button>

      <p className="text-sm text-ink-muted">
        If you run into any trouble, call us on{' '}
        <a href="tel:+918983066701" className="text-action underline">
          +91 8983066701
        </a>
        .
      </p>
    </form>
  );
}
