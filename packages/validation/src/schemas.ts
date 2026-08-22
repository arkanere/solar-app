// Request schemas for the routes adopting zod first.
//
// Each schema mirrors what its endpoint already enforced. Where an endpoint
// enforced nothing, the schema adds type and presence checks only — it does
// not invent format rules for fields that previously accepted anything, so
// adopting one cannot start rejecting saves that used to work.

import { z } from 'zod';
import {
	blankToNull,
	decimal,
	email,
	inPincode,
	optionalEmail,
	optionalId,
	optionalText,
	phone,
	plainText,
	requiredText,
	slug,
	usZipCode
} from './primitives';

/* -------------------------------------------------------------------------
 * Public lead intake — main-app /[country]/api/submitLead
 *
 * Applied in log-only mode. The forms feeding this endpoint validate with
 * three different phone rules, so the real shape of accepted traffic is
 * unknown; this schema is the hypothesis being tested against production
 * before it is allowed to reject anything.
 * ---------------------------------------------------------------------- */

export const leadSchema = (country: 'in' | 'us') =>
	z
		.object({
			name: requiredText('Name'),
			phone,
			// Forms send pinCode (IN legacy name) or zipCode (US legacy name).
			pinCode: z.string().optional(),
			zipCode: z.string().optional(),
			postalCode: z.string().optional(),
			type: optionalText(120),
			comment: optionalText(),
			urlParam: optionalText(),
			email: optionalEmail,
			marketing_consent: z.boolean().optional()
		})
		// The endpoint coalesces the three postal aliases before inserting;
		// validate whichever one actually arrived.
		.check((ctx) => {
			const v = ctx.value;
			const postal = v.pinCode ?? v.zipCode ?? v.postalCode ?? '';
			const rule = country === 'in' ? inPincode : usZipCode;
			const result = rule.safeParse(postal);
			if (!result.success) {
				ctx.issues.push({
					code: 'custom',
					input: postal,
					path: [country === 'in' ? 'pinCode' : 'zipCode'],
					message: result.error.issues[0].message
				});
			}
		});

/* -------------------------------------------------------------------------
 * business-app /in/api/saveProposal
 *
 * The handler previously did `parseFloat(system_capacity_kw.toString())` on a
 * cast value, which threw a TypeError on null and surfaced as a generic 500.
 * `decimal` handles the number-or-numeric-string the form sends.
 *
 * phone_number and email stay free text: the endpoint never validated their
 * format, and businesses may well have "n/a" style values in existing
 * proposals. Tightening them is a separate, deliberate decision.
 * ---------------------------------------------------------------------- */

export const saveProposalSchema = z.object({
	id: optionalId,
	lead_id: optionalId,
	business_slug: requiredText('Business slug'),
	customer_name: requiredText('Customer name'),
	phone_number: optionalText(40),
	address: optionalText(),
	email: optionalText(320),
	// `!system_capacity_kw` previously rejected 0, so positive() is faithful.
	system_capacity_kw: decimal('System capacity').positive('System capacity is required'),
	panels_brand_model: optionalText(255),
	number_of_panels: blankToNull(z.coerce.number().int().nonnegative()),
	inverter_brand_model: optionalText(255),
	notes: optionalText()
});

/* -------------------------------------------------------------------------
 * business-app /in/api/updateBusinessDetails
 *
 * Previously had no validation at all — `services` and `brands` were declared
 * `number[]` by a cast and passed straight into a parameterised UPDATE as SQL
 * array values. Those two are the ones that matter here.
 *
 * The text fields are optional because the client always sends the full form
 * with `|| ''` defaults; only businessname and business_slug are required.
 * ---------------------------------------------------------------------- */

export const updateBusinessDetailsSchema = z.object({
	businessname: requiredText('Business name'),
	address: plainText(),
	phonenumber: plainText(40),
	whatsapp: plainText(40),
	email: plainText(320),
	website: plainText(500),
	description: plainText(5000),
	instagram_id: plainText(255),
	google_maps_link: plainText(1000),
	services: z.array(z.number().int()).default([]),
	brands: z.array(z.number().int()).default([]),
	business_slug: requiredText('Business slug')
});

/**
 * business-app /us/api/updateBusinessDetails
 *
 * The same form minus services/brands, which the US table doesn't carry.
 */
export const usUpdateBusinessDetailsSchema = updateBusinessDetailsSchema.omit({
	services: true,
	brands: true
});

/* -------------------------------------------------------------------------
 * main-app /[country]/api/submitBusiness
 *
 * Replaces nine near-identical `if (!x || x.trim() === '')` blocks. Presence
 * only, matching what the handler checked — the GSTN and phone *formats* are
 * enforced client-side by BusinessForm.svelte and are not reproduced here, so
 * this cannot start rejecting submissions the endpoint used to accept.
 *
 * Country-parameterized when the two submitBusiness endpoints merged. The old
 * US endpoint validated nothing,
 * so the US variant adds presence checks only — the discipline this file's
 * header states — and must not require what the US form never sends.
 * ---------------------------------------------------------------------- */

export const submitBusinessSchema = (country: 'in' | 'us') =>
	z
		.object({
			businessName: requiredText('Business name'),
			address: requiredText('Address', 1000),
			plusCode: optionalText(120),
			phoneNumber: requiredText('Phone number', 40),
			whatsappNumber: optionalText(40),
			email: requiredText('Business email', 320),
			login_email: requiredText('Login email', 320),
			website: optionalText(500),
			// IN collects a tax id on signup, US does not
			// (CountryConfig.taxId.collectOnSignup), so the shared BusinessForm
			// posts gstn: "" for US. Requiring it would reject every US signup.
			gstn: country === 'in' ? requiredText('GSTN', 20) : optionalText(20),
			state: requiredText('State', 120),
			// BusinessForm keys level2 by the country's own noun, derived from
			// CountryConfig.levels.level2.singular: district (IN) / county (US).
			// Reading the wrong one drops the value without erroring, which is
			// why both are declared and exactly one is required below.
			district: z.string().optional(),
			county: z.string().optional(),
			city: requiredText('City', 120)
		})
		.check((ctx) => {
			const key = country === 'in' ? 'district' : 'county';
			const label = country === 'in' ? 'District' : 'County';
			const result = requiredText(label, 120).safeParse(ctx.value[key] ?? '');
			if (!result.success) {
				ctx.issues.push({
					code: 'custom',
					input: ctx.value[key],
					path: [key],
					message: result.error.issues[0].message
				});
			}
		});

/* -------------------------------------------------------------------------
 * main-app /api/submitDataAccess and /api/submitDataDeletion
 *
 * Identical shapes, so one schema. Both endpoints previously checked only
 * `!email`; the format rule is a deliberate tightening. Email is the sole
 * identifier on a compliance request, and submitDataAccess mails a copy of
 * the user's data to whatever arrives here — a malformed address means the
 * request can never be fulfilled. Both public forms are `type="email"` and
 * `required`, so browsers already enforce this client-side.
 * ---------------------------------------------------------------------- */

export const dataRequestSchema = z.object({
	email,
	phone: optionalText(40),
	reason: optionalText()
});

/* -------------------------------------------------------------------------
 * business-app /in/api/resetPassword and /us/api/resetPassword
 *
 * Presence and type only. Password *strength* stays with
 * TokenSecurity.validatePasswordStrength, which owns that policy and returns
 * its own field-level errors; this schema exists so that check can no longer
 * be handed `undefined`.
 * ---------------------------------------------------------------------- */

export const resetPasswordSchema = z.object({
	business_slug: slug,
	token: requiredText('Reset token', 512),
	newPassword: z.string({ error: 'New password is required' }).min(1, 'New password is required')
});

/* -------------------------------------------------------------------------
 * business-app /in/api/forgotPassword and /us/api/forgotPassword
 *
 * Email only, matching the login form: login resolves the business slug from
 * the address rather than asking for it, and so does this. The endpoint's
 * response is deliberately identical whether or not the address is known, so
 * a rejection here must not be able to say more than "that is not an email".
 * ---------------------------------------------------------------------- */

export const forgotPasswordSchema = z.object({
	email
});

export type LeadInput = z.output<ReturnType<typeof leadSchema>>;
export type SaveProposalInput = z.output<typeof saveProposalSchema>;
export type UpdateBusinessDetailsInput = z.output<typeof updateBusinessDetailsSchema>;
export type UsUpdateBusinessDetailsInput = z.output<typeof usUpdateBusinessDetailsSchema>;
export type SubmitBusinessInput = z.output<ReturnType<typeof submitBusinessSchema>>;
export type DataRequestInput = z.output<typeof dataRequestSchema>;
export type ResetPasswordInput = z.output<typeof resetPasswordSchema>;
export type ForgotPasswordInput = z.output<typeof forgotPasswordSchema>;
