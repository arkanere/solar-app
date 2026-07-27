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
	id,
	inMobile,
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
 * business-app /in/api/addReferrer
 *
 * Replaces the hand-rolled required/slug/phone/email checks in the handler.
 * Same rules, same messages.
 * ---------------------------------------------------------------------- */

export const addReferrerSchema = z.object({
	businessId: id,
	name: requiredText('Name'),
	slug,
	phone: inMobile,
	email: optionalEmail,
	notes: optionalText()
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

export type LeadInput = z.output<ReturnType<typeof leadSchema>>;
export type AddReferrerInput = z.output<typeof addReferrerSchema>;
export type SaveProposalInput = z.output<typeof saveProposalSchema>;
export type UpdateBusinessDetailsInput = z.output<typeof updateBusinessDetailsSchema>;
