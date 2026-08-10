// Column projections for READING the two country-neutral stores — `leaddata`
// (a lead) and `business_profiles` (a business) — aliased back to the legacy
// per-country column names the page loads and components still speak.
//
// Neither selection reads a projection any more: 064 dropped `businesses`, and
// since 066 the lead selections read `leaddata` directly. `leads` is still
// projected by sv_sync_lead through the 066 deploy, but nothing reads it — that
// is the gate 067 checks before dropping it.
//
// The aliasing is all that remains of the transition, and it is one-way:
// level1 -> state, level2 -> district/county, postal_code -> pin_code/zipcode.
// Renaming the consumer sites instead is what would let this module go.
//
// Both LEAD selections key on `leaddata.id`, which is the platform's lead id:
// project_management.lead_id and in_proposals.lead_id are foreign keys to it.
// Before 066 this read `leads.source_id`, which held the same value.

// businesses -> business_profiles legacy names.
export const IN_BUSINESS_COLUMNS = `
	source_id AS id, slug, businessname, email, phonenumber, whatsapp,
	description, website, instagram_id, google_maps_link, address, pluscode,
	services, brands, tax_id AS gstn, level1 AS state, level2 AS district,
	city, postal_code AS pincode, rscore, tag, notes, businessfilled, tier3,
	isvisible`;

// businesses -> us_businesses legacy names (no brands column in the US
// legacy table; consumers never read it).
export const US_BUSINESS_COLUMNS = `
	source_id AS id, slug, businessname, email, phonenumber, whatsapp,
	description, website, instagram_id, google_maps_link, address, pluscode,
	services, tax_id AS ein, level1 AS state, level2 AS county, city,
	postal_code AS zipcode, rscore, tag, notes, businessfilled, tier3,
	isvisible, created_at`;

// ── Drizzle equivalents ─────────────────────────────────────────────────────
// Typed selection maps mirroring the string projections above, for converted
// queries: db.select(IN_LEAD_SELECTION).from(leaddata)... Same legacy-name
// aliasing; both forms coexist until the raw-SQL call sites finish migrating.

import { businessProfiles, leaddata } from '@solar/db/schema';

export const IN_LEAD_SELECTION = {
	id: leaddata.id,
	name: leaddata.name,
	phone: leaddata.phone,
	pin_code: leaddata.postalCode,
	type: leaddata.type,
	comment: leaddata.comment,
	created_at: leaddata.createdAt,
	svnotes: leaddata.svnotes,
	urlparams: leaddata.urlparams,
	isvisible: leaddata.isvisible,
	email: leaddata.email,
	category: leaddata.category,
	district: leaddata.level2,
	stage: leaddata.stage,
	status: leaddata.status,
	claim_count: leaddata.claimCount,
	original_id: leaddata.originalId,
	business_id: leaddata.businessId,
	email_invite_count: leaddata.emailInviteCount,
	sv_comment_for_businesses: leaddata.svCommentForBusinesses,
	reference_uuid: leaddata.referenceUuid,
	business_notes: leaddata.businessNotes,
	state: leaddata.level1,
	qualification_score: leaddata.qualificationScore,
	bill_url: leaddata.billUrl,
	bill_cloudinary_public_id: leaddata.billCloudinaryPublicId,
	bill_format: leaddata.billFormat,
	bill_uploaded_at: leaddata.billUploadedAt,
	marketing_consent: leaddata.marketingConsent
};

export const US_LEAD_SELECTION = {
	id: leaddata.id,
	name: leaddata.name,
	phone: leaddata.phone,
	zipcode: leaddata.postalCode,
	type: leaddata.type,
	comment: leaddata.comment,
	created_at: leaddata.createdAt,
	svnotes: leaddata.svnotes,
	urlparams: leaddata.urlparams,
	isvisible: leaddata.isvisible,
	email: leaddata.email,
	category: leaddata.category,
	county: leaddata.level2,
	stage: leaddata.stage,
	status: leaddata.status,
	claim_count: leaddata.claimCount,
	original_id: leaddata.originalId,
	business_id: leaddata.businessId,
	email_invite_count: leaddata.emailInviteCount,
	sv_comment_for_businesses: leaddata.svCommentForBusinesses,
	marketing_consent: leaddata.marketingConsent
};

export const IN_BUSINESS_SELECTION = {
	id: businessProfiles.businessId,
	slug: businessProfiles.slug,
	businessname: businessProfiles.businessname,
	email: businessProfiles.email,
	phonenumber: businessProfiles.phonenumber,
	whatsapp: businessProfiles.whatsapp,
	description: businessProfiles.description,
	website: businessProfiles.website,
	instagram_id: businessProfiles.instagramId,
	google_maps_link: businessProfiles.googleMapsLink,
	address: businessProfiles.address,
	pluscode: businessProfiles.pluscode,
	services: businessProfiles.services,
	brands: businessProfiles.brands,
	gstn: businessProfiles.taxId,
	state: businessProfiles.level1,
	district: businessProfiles.level2,
	city: businessProfiles.city,
	pincode: businessProfiles.postalCode,
	rscore: businessProfiles.rscore,
	tag: businessProfiles.tag,
	notes: businessProfiles.notes,
	businessfilled: businessProfiles.businessfilled,
	tier3: businessProfiles.tier3,
	isvisible: businessProfiles.isvisible
};

export const US_BUSINESS_SELECTION = {
	id: businessProfiles.businessId,
	slug: businessProfiles.slug,
	businessname: businessProfiles.businessname,
	email: businessProfiles.email,
	phonenumber: businessProfiles.phonenumber,
	whatsapp: businessProfiles.whatsapp,
	description: businessProfiles.description,
	website: businessProfiles.website,
	instagram_id: businessProfiles.instagramId,
	google_maps_link: businessProfiles.googleMapsLink,
	address: businessProfiles.address,
	pluscode: businessProfiles.pluscode,
	services: businessProfiles.services,
	ein: businessProfiles.taxId,
	state: businessProfiles.level1,
	county: businessProfiles.level2,
	city: businessProfiles.city,
	zipcode: businessProfiles.postalCode,
	rscore: businessProfiles.rscore,
	tag: businessProfiles.tag,
	notes: businessProfiles.notes,
	businessfilled: businessProfiles.businessfilled,
	tier3: businessProfiles.tier3,
	isvisible: businessProfiles.isvisible,
	created_at: businessProfiles.createdAt
};
