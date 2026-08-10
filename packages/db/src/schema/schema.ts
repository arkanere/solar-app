import { pgTable, serial, varchar, text, timestamp, char, boolean, integer, doublePrecision, index, check, smallint, uuid, date, unique, foreignKey, numeric, uniqueIndex, jsonb, primaryKey, pgSequence } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const personalWebsiteBlogsIdSeq = pgSequence("personal_website_blogs_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })

export const contactUsForm = pgTable("contact_us_form", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }).notNull(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const ideaPot = pgTable("idea_pot", {
	id: serial().primaryKey().notNull(),
	idea: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	notes: char({ length: 255 }),
	isvisible: boolean().default(true),
	category: varchar({ length: 255 }).default(sql`NULL`),
});

export const queries = pgTable("queries", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 16 }).notNull(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	pincode: integer(),
	notes: varchar({ length: 255 }),
	urlparam: varchar({ length: 255 }),
});

export const serverLogs = pgTable("server_logs", {
	id: serial().primaryKey().notNull(),
	timestamp: timestamp({ mode: 'string' }).notNull(),
	method: varchar({ length: 10 }),
	url: text(),
	statusCode: integer("status_code"),
	responseTime: doublePrecision("response_time"),
	userAgent: text("user_agent"),
	referrer: text(),
	errorMessage: text("error_message"),
});

export const leaddata = pgTable("leaddata", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 16 }).notNull(),
	postalCode: varchar("postal_code", { length: 10 }).notNull(),
	type: varchar({ length: 510 }),
	comment: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	svnotes: text(),
	urlparams: varchar({ length: 255 }).default(sql`NULL`),
	isvisible: boolean().default(true),
	email: varchar({ length: 255 }),
	category: smallint(),
	level2: varchar({ length: 255 }),
	stage: smallint().default(0),
	status: boolean().default(true),
	claimCount: smallint("claim_count").default(0),
	originalId: integer("original_id"),
	businessId: integer("business_id"),
	emailInviteCount: integer("email_invite_count").default(0),
	svCommentForBusinesses: text("sv_comment_for_businesses"),
	referenceUuid: uuid("reference_uuid").defaultRandom(),
	businessNotes: text("business_notes"),
	level1: varchar({ length: 100 }),
	qualificationScore: integer("qualification_score"),
	billUrl: text("bill_url"),
	billCloudinaryPublicId: text("bill_cloudinary_public_id"),
	billFormat: text("bill_format"),
	billUploadedAt: timestamp("bill_uploaded_at", { withTimezone: true, mode: 'string' }),
	marketingConsent: boolean("marketing_consent").default(false).notNull(),
	countryCode: char("country_code", { length: 2 }).default('in').notNull(),
}, (table) => [
	index("leaddata_country_created_idx").using("btree", table.countryCode.asc().nullsLast().op("bpchar_ops"), table.createdAt.desc().nullsFirst().op("bpchar_ops")),
	foreignKey({
			columns: [table.countryCode],
			foreignColumns: [countries.code],
			name: "leaddata_country_code_fkey"
		}),
	check("check_claim_count_limit", sql`(claim_count >= 0) AND (claim_count <= 5)`),
]);

export const claimdata = pgTable("claimdata", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 16 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	message: text().notNull(),
	businessSlug: varchar("business_slug", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	isresolved: boolean().default(false),
});

export const projects = pgTable("projects", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	pincode: varchar({ length: 20 }).notNull(),
	projectDate: date("project_date").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	imagePath: varchar("image_path", { length: 255 }),
	imageUrl: varchar("image_url", { length: 255 }),
	cloudinaryPublicId: varchar("cloudinary_public_id", { length: 255 }),
	imageWidth: integer("image_width"),
	imageHeight: integer("image_height"),
	imageFormat: varchar("image_format", { length: 10 }),
	businessSlug: varchar("business_slug", { length: 255 }),
	isvisible: boolean().default(true),
	projectSlug: varchar("project_slug", { length: 255 }),
	district: varchar({ length: 100 }),
	city: varchar({ length: 100 }),
});

export const leaddataClaimrequests = pgTable("leaddata_claimrequests", {
	id: serial().primaryKey().notNull(),
	leadId: serial("lead_id").notNull(),
	claimId: serial("claim_id").notNull(),
	businessId: smallint("business_id"),
	isallotted: boolean().default(false),
	isresolved: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("unique_lead_business_claim").on(table.leadId, table.businessId),
]);

export const svUser = pgTable("sv_user", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	magicLinkToken: varchar("magic_link_token", { length: 255 }),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	feedbackEmailSentAt: timestamp("feedback_email_sent_at", { mode: 'string' }),
	magicLinkTokenExpiresAt: timestamp("magic_link_token_expires_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const pincodeMapping = pgTable("pincode_mapping", {
	id: serial().primaryKey().notNull(),
	pincode: char({ length: 6 }).notNull(),
	district: varchar({ length: 255 }).notNull(),
	state: varchar({ length: 100 }),
});

export const chatbotmessagecount = pgTable("chatbotmessagecount", {
	id: serial().primaryKey().notNull(),
	ip: varchar({ length: 45 }).notNull(),
	date: date().notNull(),
	count: integer().default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("unique_ip_date").on(table.ip, table.date),
]);

export const branches = pgTable("branches", {
	id: serial().primaryKey().notNull(),
	mainId: integer("main_id").notNull(),
	branchId: integer("branch_id").notNull(),
	isactive: boolean().default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const unsubscribe = pgTable("unsubscribe", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const dataDeletionRequests = pgTable("data_deletion_requests", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }),
	reason: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	status: varchar({ length: 50 }).default('pending'),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	notes: text(),
});

export const callsafeusers = pgTable("callsafeusers", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	isActive: boolean("is_active").default(true),
	sourceid: varchar({ length: 30 }),
	isembedded: boolean().default(false),
}, (table) => [
	unique("callsafeusers_email_key").on(table.email),
]);

export const callsafehandles = pgTable("callsafehandles", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	handle: varchar({ length: 30 }).notNull(),
	isEmbedded: boolean("is_embedded").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [callsafeusers.id],
			name: "callsafelinks_user_id_fkey"
		}).onDelete("cascade"),
]);

export const svProposals = pgTable("sv_proposals", {
	id: serial().primaryKey().notNull(),
	customerName: varchar("customer_name", { length: 255 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 20 }),
	address: text(),
	email: varchar({ length: 255 }),
	systemCapacityKw: numeric("system_capacity_kw", { precision: 10, scale:  2 }).notNull(),
	panelsBrandModel: varchar("panels_brand_model", { length: 255 }),
	numberOfPanels: integer("number_of_panels"),
	inverterBrandModel: varchar("inverter_brand_model", { length: 255 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	leadId: integer("lead_id"),
	businessSlug: varchar("business_slug", { length: 255 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.leadId],
			foreignColumns: [leaddata.id],
			name: "proposals_lead_id_fkey"
		}).onDelete("cascade"),
]);

export const projectManagement = pgTable("project_management", {
	id: serial().primaryKey().notNull(),
	leadId: integer("lead_id").notNull(),
	stage: smallint().default(1),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastUpdated: timestamp("last_updated", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.leadId],
			foreignColumns: [leaddata.id],
			name: "projectmanagement_lead_id_fkey"
		}).onDelete("cascade"),
]);

export const masterlistUsaBusinesses = pgTable("masterlist_usa_businesses", {
	id: serial().primaryKey().notNull(),
	state: varchar({ length: 100 }).notNull(),
	vendorName: varchar("vendor_name", { length: 255 }).notNull(),
	recipientEmail: varchar("recipient_email", { length: 255 }).notNull(),
	verified: integer().default(0),
	earlierDate: date("earlier_date"),
	unsubscribe: integer().default(0),
	contactPerson: varchar("contact_person", { length: 255 }),
	mobileNumber: varchar("mobile_number", { length: 20 }),
	earlierToEarlierDate: date("earlier_to_earlier_date"),
	numberOfEmailsSent: integer("number_of_emails_sent").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	county: varchar({ length: 100 }),
	googleMapsUrl: text("google_maps_url"),
	website: varchar({ length: 255 }),
}, (table) => [
	index("idx_county").using("btree", table.county.asc().nullsLast().op("text_ops")),
	index("idx_earlier_to_earlier_date_usa").using("btree", table.earlierToEarlierDate.asc().nullsLast().op("date_ops")),
	index("idx_number_of_emails_sent_usa").using("btree", table.numberOfEmailsSent.asc().nullsLast().op("int4_ops")),
	index("idx_recipient_email_usa").using("btree", table.recipientEmail.asc().nullsLast().op("text_ops")),
	index("idx_state_usa").using("btree", table.state.asc().nullsLast().op("text_ops")),
	index("idx_unsubscribe_usa").using("btree", table.unsubscribe.asc().nullsLast().op("int4_ops")),
	index("idx_verified_usa").using("btree", table.verified.asc().nullsLast().op("int4_ops")),
	check("check_verified_usa", sql`verified = ANY (ARRAY[0, 1])`),
	check("check_emails_sent_usa", sql`number_of_emails_sent >= 0`),
	check("check_unsubscribe_usa", sql`unsubscribe = ANY (ARRAY[0, 1])`),
]);

export const callsafeUnsubscribe = pgTable("callsafe_unsubscribe", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	uniqueIndex("callsafe_unsubscribe_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	unique("callsafe_unsubscribe_email_key").on(table.email),
]);

export const seoPages = pgTable("seo_pages", {
	id: serial().primaryKey().notNull(),
	slug: varchar({ length: 255 }).notNull(),
	pillarSlug: varchar("pillar_slug", { length: 100 }),
	pageType: varchar("page_type", { length: 50 }).notNull(),
	productCategory: varchar("product_category", { length: 50 }),
	h1: text().notNull(),
	metaTitle: varchar("meta_title", { length: 160 }).notNull(),
	metaDescription: varchar("meta_description", { length: 320 }).notNull(),
	content: jsonb().notNull(),
	faq: jsonb(),
	authorSlug: varchar("author_slug", { length: 100 }),
	status: varchar({ length: 20 }).default('draft'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_seo_pages_pillar").using("btree", table.pillarSlug.asc().nullsLast().op("text_ops")),
	index("idx_seo_pages_type").using("btree", table.pageType.asc().nullsLast().op("text_ops")),
	unique("seo_pages_slug_pillar_unique").on(table.slug, table.pillarSlug),
]);

export const solarBrands = pgTable("solar_brands", {
	id: serial().primaryKey().notNull(),
	slug: varchar({ length: 100 }).notNull(),
	name: varchar({ length: 200 }).notNull(),
	productCategory: varchar("product_category", { length: 50 }).notNull(),
	description: text(),
	logoUrl: text("logo_url"),
	metaTitle: varchar("meta_title", { length: 160 }),
	metaDescription: varchar("meta_description", { length: 320 }),
	faq: jsonb(),
	status: varchar({ length: 20 }).default('draft'),
}, (table) => [
	unique("solar_brands_slug_key").on(table.slug),
]);

export const solarProducts = pgTable("solar_products", {
	id: serial().primaryKey().notNull(),
	brandSlug: varchar("brand_slug", { length: 100 }),
	modelSlug: varchar("model_slug", { length: 100 }).notNull(),
	name: varchar({ length: 200 }).notNull(),
	productCategory: varchar("product_category", { length: 50 }).notNull(),
	specs: jsonb().notNull(),
	priceRangeMin: integer("price_range_min"),
	priceRangeMax: integer("price_range_max"),
	datasheetUrl: text("datasheet_url"),
	status: varchar({ length: 20 }).default('draft'),
}, (table) => [
	foreignKey({
			columns: [table.brandSlug],
			foreignColumns: [solarBrands.slug],
			name: "solar_products_brand_slug_fkey"
		}),
	unique("solar_products_brand_slug_model_slug_key").on(table.brandSlug, table.modelSlug),
]);

export const stateSubsidies = pgTable("state_subsidies", {
	id: serial().primaryKey().notNull(),
	stateSlug: varchar("state_slug", { length: 100 }).notNull(),
	stateName: varchar("state_name", { length: 100 }).notNull(),
	centralSubsidyRate: text("central_subsidy_rate"),
	stateTopupRate: text("state_topup_rate"),
	eligibility: text(),
	applicationProcess: text("application_process"),
	content: jsonb(),
	faq: jsonb(),
	lastVerified: date("last_verified"),
	status: varchar({ length: 20 }).default('draft'),
}, (table) => [
	unique("state_subsidies_state_slug_key").on(table.stateSlug),
]);

export const discoms = pgTable("discoms", {
	id: serial().primaryKey().notNull(),
	slug: varchar({ length: 100 }).notNull(),
	name: varchar({ length: 200 }).notNull(),
	stateSlug: varchar("state_slug", { length: 100 }),
	netMeteringPolicy: text("net_metering_policy"),
	tariffStructure: text("tariff_structure"),
	applicationProcess: text("application_process"),
	content: jsonb(),
	faq: jsonb(),
	status: varchar({ length: 20 }).default('draft'),
}, (table) => [
	foreignKey({
			columns: [table.stateSlug],
			foreignColumns: [stateSubsidies.stateSlug],
			name: "discoms_state_slug_fkey"
		}),
	unique("discoms_slug_key").on(table.slug),
]);

export const solarFinancingBanks = pgTable("solar_financing_banks", {
	id: serial().primaryKey().notNull(),
	slug: varchar({ length: 100 }).notNull(),
	name: varchar({ length: 200 }).notNull(),
	interestRate: text("interest_rate"),
	maxAmount: text("max_amount"),
	tenure: text(),
	eligibility: text(),
	documents: text(),
	content: jsonb(),
	faq: jsonb(),
	status: varchar({ length: 20 }).default('draft'),
}, (table) => [
	unique("solar_financing_banks_slug_key").on(table.slug),
]);

export const authors = pgTable("authors", {
	id: serial().primaryKey().notNull(),
	slug: varchar({ length: 100 }).notNull(),
	name: varchar({ length: 200 }).notNull(),
	photoUrl: text("photo_url"),
	credentials: text(),
	expertise: text(),
	bio: text(),
	socialLinks: jsonb("social_links"),
	status: varchar({ length: 20 }).default('published'),
}, (table) => [
	unique("authors_slug_key").on(table.slug),
]);

export const installerInvitationEmailCampaignLog = pgTable("installer_invitation_email_campaign_log", {
	id: serial().primaryKey().notNull(),
	dbTable: varchar("db_table", { length: 100 }).notNull(),
	businessId: integer("business_id").notNull(),
	recipientEmail: varchar("recipient_email", { length: 255 }).notNull(),
	vendorName: varchar("vendor_name", { length: 255 }),
	state: varchar({ length: 100 }),
	emailNumber: integer("email_number"),
	campaignRunId: varchar("campaign_run_id", { length: 50 }).notNull(),
	sentAt: timestamp("sent_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const callsafeMasterlist = pgTable("callsafe_masterlist", {
	id: serial().primaryKey().notNull(),
	website: varchar().notNull(),
	country: varchar().notNull(),
	recipientEmail: varchar("recipient_email"),
	phoneNumber: varchar("phone_number"),
	verified: integer().default(0),
	unsubscribe: integer().default(0),
	numberOfEmailsSent: integer("number_of_emails_sent").default(0),
	earlierDate: date("earlier_date"),
	earlierToEarlierDate: date("earlier_to_earlier_date"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const callsafeEmailCampaignLog = pgTable("callsafe_email_campaign_log", {
	id: serial().primaryKey().notNull(),
	businessId: integer("business_id"),
	recipientEmail: text("recipient_email"),
	website: text(),
	country: text(),
	emailNumber: integer("email_number"),
	campaignRunId: text("campaign_run_id"),
	sentAt: timestamp("sent_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const svUserFeedback = pgTable("sv_user_feedback", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	gotCallback: boolean("got_callback").notNull(),
	gotQuotation: boolean("got_quotation").notNull(),
	recommendationRating: smallint("recommendation_rating").notNull(),
	suggestions: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [svUser.id],
			name: "in_user_feedback_user_id_fkey"
		}),
	unique("in_user_feedback_user_id_key").on(table.userId),
	check("in_user_feedback_recommendation_rating_check", sql`(recommendation_rating >= 1) AND (recommendation_rating <= 5)`),
]);

export const dataAccessRequests = pgTable("data_access_requests", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	phone: text(),
	reason: text(),
	status: text().default('pending').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("data_access_requests_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
]);

export const rateLimits = pgTable("rate_limits", {
	identifier: text().primaryKey().notNull(),
	count: integer().default(0).notNull(),
	resetTime: timestamp("reset_time", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("rate_limits_reset_time_idx").using("btree", table.resetTime.asc().nullsLast().op("timestamptz_ops")),
]);

export const legalAcceptances = pgTable("legal_acceptances", {
	id: serial().primaryKey().notNull(),
	businessId: integer("business_id").notNull(),
	policyId: integer("policy_id").notNull(),
	acceptedAt: timestamp("accepted_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	ipAddress: varchar("ip_address", { length: 45 }),
	countryCode: char("country_code", { length: 2 }).notNull(),
}, (table) => [
	index("legal_acceptances_business_policy_idx").using("btree", table.countryCode.asc().nullsLast().op("bpchar_ops"), table.businessId.asc().nullsLast().op("int4_ops"), table.policyId.asc().nullsLast().op("int4_ops"), table.acceptedAt.desc().nullsFirst().op("bpchar_ops")),
	foreignKey({
			columns: [table.policyId],
			foreignColumns: [legalPolicies.id],
			name: "legal_acceptances_policy_id_fkey"
		}),
	foreignKey({
			columns: [table.countryCode],
			foreignColumns: [countries.code],
			name: "legal_acceptances_country_code_fkey"
		}),
	foreignKey({
			columns: [table.countryCode, table.businessId],
			foreignColumns: [businessAccounts.countryCode, businessAccounts.sourceId],
			name: "legal_acceptances_business_fkey"
		}),
]);

export const legalPolicies = pgTable("legal_policies", {
	id: serial().primaryKey().notNull(),
	type: varchar({ length: 50 }).notNull(),
	version: varchar({ length: 20 }).notNull(),
	summary: text().notNull(),
	effectiveAt: timestamp("effective_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	unique("legal_policies_type_version_key").on(table.type, table.version),
]);

export const businessProfiles = pgTable("business_profiles", {
	id: serial().primaryKey().notNull(),
	businessId: serial("business_id").notNull(),
	slug: varchar({ length: 255 }),
	businessname: varchar({ length: 255 }),
	email: varchar({ length: 255 }),
	phonenumber: varchar({ length: 20 }),
	whatsapp: varchar({ length: 20 }),
	description: varchar({ length: 256 }),
	website: varchar({ length: 255 }),
	instagramId: varchar("instagram_id", { length: 255 }),
	googleMapsLink: varchar("google_maps_link", { length: 255 }),
	address: text(),
	pluscode: varchar({ length: 255 }),
	services: integer().array(),
	brands: integer().array(),
	taxId: varchar("tax_id", { length: 50 }),
	level1: varchar({ length: 100 }),
	level2: varchar({ length: 100 }),
	city: varchar({ length: 100 }),
	postalCode: varchar("postal_code", { length: 10 }),
	rscore: integer(),
	tag: varchar({ length: 255 }),
	notes: text(),
	businessfilled: boolean(),
	tier3: boolean(),
	isvisible: boolean(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	countryCode: char("country_code", { length: 2 }).default('in').notNull(),
}, (table) => [
	index("business_profiles_country_slug_idx").using("btree", table.countryCode.asc().nullsLast().op("bpchar_ops"), table.slug.asc().nullsLast().op("text_ops")),
	index("business_profiles_geo_idx").using("btree", table.countryCode.asc().nullsLast().op("text_ops"), table.level2.asc().nullsLast().op("text_ops"), table.isvisible.asc().nullsLast().op("bool_ops")),
	foreignKey({
			columns: [table.countryCode],
			foreignColumns: [countries.code],
			name: "business_profiles_country_code_fkey"
		}),
	unique("business_profiles_business_id_key").on(table.businessId),
]);

export const masterlistIndianBusinesses = pgTable("masterlist_indian_businesses", {
	id: serial().primaryKey().notNull(),
	state: varchar({ length: 100 }),
	vendorName: varchar("vendor_name", { length: 255 }).notNull(),
	recipientEmail: varchar("recipient_email", { length: 255 }).notNull(),
	verified: integer().default(0),
	earlierDate: date("earlier_date"),
	unsubscribe: integer().default(0),
	contactPerson: varchar("contact_person", { length: 255 }),
	mobileNumber: varchar("mobile_number", { length: 20 }),
	earlierToEarlierDate: date("earlier_to_earlier_date"),
	numberOfEmailsSent: integer("number_of_emails_sent").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	empanelledVendor: integer("empanelled_vendor").default(0),
	rating: numeric({ precision: 2, scale:  1 }),
	installedCapacity: integer("installed_capacity"),
	website: text(),
	address: text(),
	vendorId: integer("vendor_id"),
	district: text(),
	districtId: integer("district_id"),
	locationSource: text("location_source"),
}, (table) => [
	index("idx_earlier_to_earlier_date").using("btree", table.earlierToEarlierDate.asc().nullsLast().op("date_ops")),
	index("idx_empanelled_vendor").using("btree", table.empanelledVendor.asc().nullsLast().op("int4_ops")),
	index("idx_masterlist_loc_key").using("btree", sql`loc_key((state)::text)`, sql`loc_key(district)`),
	uniqueIndex("idx_masterlist_vendor_id").using("btree", table.vendorId.asc().nullsLast().op("int4_ops")).where(sql`(vendor_id IS NOT NULL)`),
	index("idx_number_of_emails_sent").using("btree", table.numberOfEmailsSent.asc().nullsLast().op("int4_ops")),
	index("idx_recipient_email").using("btree", table.recipientEmail.asc().nullsLast().op("text_ops")),
	index("idx_state").using("btree", table.state.asc().nullsLast().op("text_ops")),
	index("idx_unsubscribe").using("btree", table.unsubscribe.asc().nullsLast().op("int4_ops")),
	index("idx_verified").using("btree", table.verified.asc().nullsLast().op("int4_ops")),
	unique("unique_recipient_email").on(table.recipientEmail),
	check("check_verified", sql`verified = ANY (ARRAY[0, 1])`),
	check("check_unsubscribe", sql`unsubscribe = ANY (ARRAY[0, 1])`),
	check("check_emails_sent", sql`number_of_emails_sent >= 0`),
	check("check_empanelled", sql`empanelled_vendor = ANY (ARRAY[0, 1])`),
]);

export const countries = pgTable("countries", {
	code: char({ length: 2 }).primaryKey().notNull(),
	name: text().notNull(),
	isActive: boolean("is_active").default(true).notNull(),
});

export const geoLocations = pgTable("geo_locations", {
	id: serial().primaryKey().notNull(),
	countryCode: char("country_code", { length: 2 }).notNull(),
	level1: varchar({ length: 255 }).notNull(),
	level2: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 255 }).notNull(),
	level1Slug: varchar("level1_slug", { length: 255 }).notNull(),
	level2Slug: varchar("level2_slug", { length: 255 }).notNull(),
	citySlug: varchar("city_slug", { length: 255 }).notNull(),
}, (table) => [
	index("geo_locations_level2_idx").using("btree", table.countryCode.asc().nullsLast().op("text_ops"), table.level1Slug.asc().nullsLast().op("bpchar_ops"), table.level2Slug.asc().nullsLast().op("bpchar_ops")),
	foreignKey({
			columns: [table.countryCode],
			foreignColumns: [countries.code],
			name: "geo_locations_country_code_fkey"
		}),
	unique("geo_locations_country_code_level1_slug_level2_slug_city_slu_key").on(table.countryCode, table.level1Slug, table.level2Slug, table.citySlug),
]);

export const businessAccounts = pgTable("business_accounts", {
	id: serial().primaryKey().notNull(),
	countryCode: char("country_code", { length: 2 }).notNull(),
	sourceId: integer("source_id").notNull(),
	loginEmail: varchar("login_email", { length: 255 }),
	loginPassword: varchar("login_password", { length: 255 }),
	magicLinkToken: text("magic_link_token"),
	magicLinkTokenExpiresAt: timestamp("magic_link_token_expires_at", { withTimezone: true, mode: 'string' }),
	resetToken: varchar("reset_token", { length: 255 }),
	resetTokenExpires: timestamp("reset_token_expires", { mode: 'string' }),
	isvisible: boolean(),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("business_accounts_login_email_idx").using("btree", table.countryCode.asc().nullsLast().op("text_ops"), table.loginEmail.asc().nullsLast().op("text_ops")),
	index("business_accounts_magic_token_idx").using("btree", table.countryCode.asc().nullsLast().op("text_ops"), table.magicLinkToken.asc().nullsLast().op("bpchar_ops")),
	foreignKey({
			columns: [table.countryCode],
			foreignColumns: [countries.code],
			name: "business_accounts_country_code_fkey"
		}),
	unique("business_accounts_country_code_source_id_key").on(table.countryCode, table.sourceId),
]);

export const chatbotmessagesstore = pgTable("chatbotmessagesstore", {
	id: serial().primaryKey().notNull(),
	ip: varchar({ length: 45 }).notNull(),
	timestamp: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	messageType: varchar("message_type", { length: 10 }).notNull(),
	messageContent: text("message_content").notNull(),
	sessionId: varchar("session_id", { length: 100 }),
	processingTimeMs: integer("processing_time_ms"),
	tokensUsed: integer("tokens_used"),
	metadata: jsonb(),
}, (table) => [
	index("chatbotmessagesstore_session_idx").using("btree", table.sessionId.asc().nullsLast().op("text_ops"), table.timestamp.asc().nullsLast().op("text_ops")),
	check("chatbotmessagesstore_message_type_check", sql`(message_type)::text = ANY ((ARRAY['user'::character varying, 'assistant'::character varying])::text[])`),
]);

export const masterlistVendorDistrictCoverage = pgTable("masterlist_vendor_district_coverage", {
	vendorId: integer("vendor_id").notNull(),
	stateId: integer("state_id").notNull(),
	state: text().notNull(),
	districtId: integer("district_id").notNull(),
	district: text().notNull(),
	installationCount: integer("installation_count").default(0).notNull(),
	installedCapacity: integer("installed_capacity").default(0).notNull(),
}, (table) => [
	index("idx_cov_installed").using("btree", sql`loc_key(state)`, sql`loc_key(district)`).where(sql`(installation_count > 0)`),
	index("idx_cov_loc_key").using("btree", sql`loc_key(state)`, sql`loc_key(district)`),
	primaryKey({ columns: [table.vendorId, table.districtId], name: "masterlist_vendor_district_coverage_pkey"}),
]);
