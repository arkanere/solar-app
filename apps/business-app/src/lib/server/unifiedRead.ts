// Column projections for READING the unified country-scalable tables
// (`businesses`, `leads`, `business_accounts` — migrations 043/044/046)
// during the phase-2 transition, aliased back to the legacy per-country
// column names so page loads and components are a drop-in switch.
//
// Writes still go to the old tables (businesses_1/us_businesses,
// leaddata/us_leaddata) and reach the unified tables via sync triggers;
// `source_id AS id` therefore preserves the old-table ids that branches,
// claim requests and the write endpoints key on. These aliases (and this
// module) disappear at the write cutover, when the legacy names go away.

// leads -> leaddata (IN) legacy names.
export const IN_LEAD_COLUMNS = `
	source_id AS id, name, phone, postal_code AS pin_code, type, comment,
	created_at, svnotes, urlparams, isvisible, email, category,
	level2 AS district, stage, status, claim_count, original_id, business_id,
	email_invite_count, sv_comment_for_businesses, reference_uuid,
	business_notes, level1 AS state, qualification_score, bill_url,
	bill_cloudinary_public_id, bill_format, bill_uploaded_at, marketing_consent`;

// leads -> us_leaddata (US) legacy names.
export const US_LEAD_COLUMNS = `
	source_id AS id, name, phone, postal_code AS zipcode, type, comment,
	created_at, svnotes, urlparams, isvisible, email, category,
	level2 AS county, stage, status, claim_count, original_id, business_id,
	email_invite_count, sv_comment_for_businesses, marketing_consent`;

// businesses -> in_business_profiles legacy names.
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
