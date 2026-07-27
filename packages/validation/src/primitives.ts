// Shared field rules.
//
// Before this package the same checks were copy-pasted across main-app and
// business-app and had drifted apart: three incompatible phone rules and two
// email rules were live at once (see `git log` for the audit). The rules here
// are the canonical set.
//
// Each rule below reproduces what the endpoint adopting it already enforced —
// nothing is silently tightened or loosened. Where two call sites disagreed,
// both variants are exported rather than one being picked for them, so
// adopting a schema is never a behaviour change on its own.

import { z } from 'zod';

/** Non-empty after trimming. The `name` / `customer_name` case. */
export const requiredText = (label: string, max = 255) =>
	z
		.string({ error: `${label} is required` })
		.trim()
		.min(1, `${label} is required`)
		.max(max, `${label} must be ${max} characters or fewer`);

/**
 * Free text that keeps the empty string rather than normalising to null.
 * For columns the profile form already writes `''` into.
 */
export const plainText = (max = 2000) => z.string().trim().max(max).default('');

/** Optional free text. Empty string and null both normalise to null. */
export const optionalText = (max = 2000) =>
	z
		.string()
		.trim()
		.max(max, `Must be ${max} characters or fewer`)
		.nullish()
		.transform((v) => (v ? v : null));

/**
 * Email. Replaces both hand-rolled regexes, including the stricter
 * `[\w-]{2,4}` TLD variant that rejected addresses at .info / .solar /
 * .online.
 */
export const email = z.email('Please enter a valid email address');

/**
 * Wraps a rule so that absent / null / empty-string all become null, while a
 * present non-empty value must still satisfy the rule.
 *
 * Note `.nullish()` rather than a `z.undefined()` union member: a union
 * accepting undefined does NOT make the object key optional in zod, so an
 * absent field would still fail with "expected nonoptional".
 */
export const blankToNull = <T extends z.ZodType>(rule: T) =>
	z
		.union([z.literal(''), rule])
		.nullish()
		.transform((v) => (v === '' || v === null || v === undefined ? null : (v as z.output<T>)));

export const optionalEmail = blankToNull(email);

/**
 * Permissive phone, matching `/^\+?\d{10,16}$/` — the rule the public lead
 * forms use. Digits only, optional leading `+`.
 */
export const phone = z
	.string({ error: 'Phone number is required' })
	.trim()
	.regex(/^\+?\d{10,16}$/, 'Phone number must be 10 to 16 digits, optionally starting with +');

/**
 * Indian mobile, matching `/^[6-9]\d{9}$/`. Stricter than `phone` and NOT
 * interchangeable with it — used where that rule is already enforced
 * (referrers).
 */
export const inMobile = z
	.string({ error: 'Phone number is required' })
	.trim()
	.regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number');

export const optionalPhone = blankToNull(phone);

/** Indian PIN code — 6 digits. */
export const inPincode = z
	.string({ error: 'PIN code is required' })
	.trim()
	.regex(/^\d{6}$/, 'PIN code must be exactly 6 digits');

/** US ZIP code — 5 digits, optional +4. */
export const usZipCode = z
	.string({ error: 'ZIP code is required' })
	.trim()
	.regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 digits');

/** URL-safe slug: lowercase alphanumeric segments joined by single hyphens. */
export const slug = z
	.string({ error: 'Slug is required' })
	.trim()
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		'Slug must be lowercase alphanumeric characters and hyphens only'
	);

/** Positive integer database id, accepting the numeric strings forms send. */
export const id = z.coerce.number().int().positive();

export const optionalId = blankToNull(id);

/**
 * Numeric field arriving as either a number or a string, as the proposal form
 * sends it. Replaces bare `parseFloat(x.toString())`, which threw on null.
 */
export const decimal = (label: string) =>
	z.coerce.number({ error: `${label} must be a number` }).finite();
