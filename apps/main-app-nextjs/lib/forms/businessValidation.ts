/**
 * Field validation for the business signup form.
 *
 * Ported from apps/main-app/src/lib/constants/formValidation.ts
 * (`validatePhoneNumber`, `validateGSTN`) and BusinessForm.svelte's three
 * field checks. Same arrangement as `lib/directory/leadValidation.ts`, and the
 * same contract:
 *
 * **Client-side only.** `/{cc}/api/submitBusiness` validates independently
 * with `@solar/validation`'s `submitBusinessSchema`, which is the canonical
 * rule set and the authoritative one. This exists because it is synchronous
 * and per-field, which is what blur-time messages need.
 *
 * It may be STRICTER than the server, never looser. Here it is stricter on
 * three fields, all of them carried across from the original:
 *
 *  - **phone and WhatsApp are digits only, 10 to 16.** The schema checks
 *    presence and a 40-character cap, nothing else — it says so, because the
 *    endpoint never checked a format and a schema must not start rejecting
 *    what used to save. The FORM has always checked, so the rule lives here.
 *  - **the tax id is 15 uppercase alphanumerics.** GSTN's real format is
 *    narrower than that (it encodes a state code and a checksum), and this is
 *    deliberately not that: the original checks shape only, and a checksum
 *    rule would reject valid numbers the live site accepts today.
 *
 * Note what is NOT here. The original's phone rule is `/^\d{10,16}$/` — no
 * leading `+`, unlike the lead form's — and that difference is carried across
 * rather than reconciled. `business_profiles.phonenumber` is varchar(20), so
 * neither field has the length problem `leaddata.phone` had.
 */
import type { CountryConfig } from '@/lib/countries';

export type BusinessFields = {
  businessName: string;
  taxId: string;
  address: string;
  plusCode: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  loginEmail: string;
  website: string;
  state: string;
  level2: string;
  city: string;
};

export type BusinessErrors = Partial<Record<keyof BusinessFields, string>>;

/** The original's `validatePhoneNumber`: digits only, no `+`. */
const PHONE = /^\d{10,16}$/;
/** The original's `validateGSTN`: shape only, no checksum. */
const TAX_ID = /^[0-9A-Z]{15}$/;
/**
 * Matches `@solar/validation`'s `email` primitive closely enough to catch a
 * typo at blur. The endpoint's check is the one that decides.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBusiness(
  values: BusinessFields,
  country: CountryConfig
): BusinessErrors {
  const errors: BusinessErrors = {};
  const level2Label = country.levels.level2.singular;

  if (!values.businessName.trim()) errors.businessName = 'Business name is required';

  // Only for countries that collect one at signup. US posts an empty string
  // and the schema accepts it, so requiring it here would reject every US
  // signup at the form instead.
  if (country.taxId.collectOnSignup && !TAX_ID.test(values.taxId.trim())) {
    errors.taxId = `${country.taxId.label} must be 15 characters long and contain only uppercase letters and numbers`;
  }

  if (!values.address.trim()) errors.address = 'Address is required';

  if (!PHONE.test(values.phoneNumber.trim())) {
    errors.phoneNumber = 'Phone number must be between 10 and 16 digits';
  }

  // Optional, so only a non-empty value is checked.
  if (values.whatsappNumber.trim() && !PHONE.test(values.whatsappNumber.trim())) {
    errors.whatsappNumber = 'WhatsApp number must be between 10 and 16 digits';
  }

  if (!EMAIL.test(values.email.trim())) errors.email = 'Enter a valid business email address';
  if (!EMAIL.test(values.loginEmail.trim())) errors.loginEmail = 'Enter a valid login email address';

  if (!values.state) errors.state = 'Select a state';
  if (!values.level2) errors.level2 = `Select a ${level2Label.toLowerCase()}`;
  if (!values.city) errors.city = 'Select a city';

  return errors;
}
