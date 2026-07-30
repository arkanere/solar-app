import { relations } from "drizzle-orm/relations";
import { callsafeusers, callsafehandles, businesses1, inReferrers, leaddata, inProposals, projectManagement, solarBrands, solarProducts, authors, inBlogPosts, stateSubsidies, discoms, inUser, inUserFeedback, legalAcceptances, legalPolicies, countries, geoLocations, businessAccounts, businesses, leads } from "./schema";

export const callsafehandlesRelations = relations(callsafehandles, ({one}) => ({
	callsafeuser: one(callsafeusers, {
		fields: [callsafehandles.userId],
		references: [callsafeusers.id]
	}),
}));

export const callsafeusersRelations = relations(callsafeusers, ({many}) => ({
	callsafehandles: many(callsafehandles),
}));

export const inReferrersRelations = relations(inReferrers, ({one}) => ({
	businesses1: one(businesses1, {
		fields: [inReferrers.businessId],
		references: [businesses1.id]
	}),
}));

export const businesses1Relations = relations(businesses1, ({many}) => ({
	inReferrers: many(inReferrers),
	legalAcceptances: many(legalAcceptances),
}));

export const inProposalsRelations = relations(inProposals, ({one}) => ({
	leaddatum: one(leaddata, {
		fields: [inProposals.leadId],
		references: [leaddata.id]
	}),
}));

export const leaddataRelations = relations(leaddata, ({many}) => ({
	inProposals: many(inProposals),
	projectManagements: many(projectManagement),
}));

export const projectManagementRelations = relations(projectManagement, ({one}) => ({
	leaddatum: one(leaddata, {
		fields: [projectManagement.leadId],
		references: [leaddata.id]
	}),
}));

export const solarProductsRelations = relations(solarProducts, ({one}) => ({
	solarBrand: one(solarBrands, {
		fields: [solarProducts.brandSlug],
		references: [solarBrands.slug]
	}),
}));

export const solarBrandsRelations = relations(solarBrands, ({many}) => ({
	solarProducts: many(solarProducts),
}));

export const inBlogPostsRelations = relations(inBlogPosts, ({one}) => ({
	author: one(authors, {
		fields: [inBlogPosts.authorSlug],
		references: [authors.slug]
	}),
}));

export const authorsRelations = relations(authors, ({many}) => ({
	inBlogPosts: many(inBlogPosts),
}));

export const discomsRelations = relations(discoms, ({one}) => ({
	stateSubsidy: one(stateSubsidies, {
		fields: [discoms.stateSlug],
		references: [stateSubsidies.stateSlug]
	}),
}));

export const stateSubsidiesRelations = relations(stateSubsidies, ({many}) => ({
	discoms: many(discoms),
}));

export const inUserFeedbackRelations = relations(inUserFeedback, ({one}) => ({
	inUser: one(inUser, {
		fields: [inUserFeedback.userId],
		references: [inUser.id]
	}),
}));

export const inUserRelations = relations(inUser, ({many}) => ({
	inUserFeedbacks: many(inUserFeedback),
}));

export const legalAcceptancesRelations = relations(legalAcceptances, ({one}) => ({
	businesses1: one(businesses1, {
		fields: [legalAcceptances.businessId],
		references: [businesses1.id]
	}),
	legalPolicy: one(legalPolicies, {
		fields: [legalAcceptances.policyId],
		references: [legalPolicies.id]
	}),
}));

export const legalPoliciesRelations = relations(legalPolicies, ({many}) => ({
	legalAcceptances: many(legalAcceptances),
}));

export const geoLocationsRelations = relations(geoLocations, ({one}) => ({
	country: one(countries, {
		fields: [geoLocations.countryCode],
		references: [countries.code]
	}),
}));

export const countriesRelations = relations(countries, ({many}) => ({
	geoLocations: many(geoLocations),
	businessAccounts: many(businessAccounts),
	businesses: many(businesses),
	leads: many(leads),
}));

export const businessAccountsRelations = relations(businessAccounts, ({one}) => ({
	country: one(countries, {
		fields: [businessAccounts.countryCode],
		references: [countries.code]
	}),
}));

export const businessesRelations = relations(businesses, ({one}) => ({
	country: one(countries, {
		fields: [businesses.countryCode],
		references: [countries.code]
	}),
}));

export const leadsRelations = relations(leads, ({one}) => ({
	country: one(countries, {
		fields: [leads.countryCode],
		references: [countries.code]
	}),
}));