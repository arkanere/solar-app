/**
 * Field validation for the lead form.
 *
 * Ported from apps/main-app/src/lib/constants/formValidation.ts, trimmed to the
 * five rules the lead form actually applies. The phone rule is the SvelteKit
 * `validatePhone` — 10 to 16 digits, optional leading `+` — and not the
 * per-country `phone.pattern` in the country config, which is narrower
 * (`^[6-9]\d{9}$` for IN). That difference is in the original and is carried
 * across rather than tightened: the form has always accepted a wider set than
 * the config describes, and narrowing it here would start rejecting numbers
 * the live site takes today.
 *
 * The postal rule DOES come from the country config, because that one the
 * original already dispatches on — 6 digits for IN, 5 for US.
 *
 * Kept out of the component so it is testable and so the shape is available to
 * a server-side check when the submit endpoint is ported. Right now nothing
 * submits (see LeadForm).
 */
import type { CountryConfig } from '@/lib/countries';

export type LeadFields = {
  name: string;
  phone: string;
  postalCode: string;
  email: string;
  comment: string;
};

export type LeadErrors = Partial<Record<keyof LeadFields, string>>;

export function validateLead(values: LeadFields, country: CountryConfig): LeadErrors {
  const errors: LeadErrors = {};
  const { label, maxLength, pattern } = country.postalCode;

  if (!values.name.trim()) errors.name = 'Name is required';

  if (!/^\+?\d{10,16}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a phone number of 10 to 16 digits';
  }

  if (!new RegExp(pattern).test(values.postalCode.trim())) {
    errors.postalCode = `Enter a valid ${maxLength}-digit ${label.toLowerCase()}`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.comment.trim()) {
    errors.comment = 'Tell us briefly what you need';
  }

  return errors;
}
