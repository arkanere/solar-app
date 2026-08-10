import { leaddata } from '@solar/db/schema';

// Column projection for WRITING to the lead table (`leaddata`), aliased back to
// the snake_case column names the wire shape uses. Since 066 three of those
// aliases are renames rather than a case change — postal_code -> pin_code,
// level2 -> district, level1 -> state — which keeps the payload identical to
// what it was when the columns carried the India-shaped names.
//
// The raw handlers used `RETURNING *` and shipped the driver row straight to
// the client, so the wire shape is the table's own column names. Drizzle's
// bare `.returning()` would hand back camelCase keys and silently change that
// payload, so converted write endpoints pass this map explicitly. Same idea as
// PROPOSAL_RETURNING in $lib/server/proposals.
export const IN_LEAD_RETURNING = {
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
} as const;
