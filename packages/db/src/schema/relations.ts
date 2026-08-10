import { relations } from "drizzle-orm/relations";
import { callsafeusers, callsafehandles, leaddata, svProposals, projectManagement, solarBrands, solarProducts, stateSubsidies, discoms, svUser, svUserFeedback, legalPolicies, legalAcceptances, countries, businessAccounts, businessProfiles, geoLocations } from "./schema";

export const callsafehandlesRelations = relations(callsafehandles, ({one}) => ({
	callsafeuser: one(callsafeusers, {
		fields: [callsafehandles.userId],
		references: [callsafeusers.id]
	}),
}));

export const callsafeusersRelations = relations(callsafeusers, ({many}) => ({
	callsafehandles: many(callsafehandles),
}));

export const svProposalsRelations = relations(svProposals, ({one}) => ({
	leaddatum: one(leaddata, {
		fields: [svProposals.leadId],
		references: [leaddata.id]
	}),
}));

export const leaddataRelations = relations(leaddata, ({one, many}) => ({
	country: one(countries, {
		fields: [leaddata.countryCode],
		references: [countries.code]
	}),
	svProposals: many(svProposals),
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

export const discomsRelations = relations(discoms, ({one}) => ({
	stateSubsidy: one(stateSubsidies, {
		fields: [discoms.stateSlug],
		references: [stateSubsidies.stateSlug]
	}),
}));

export const stateSubsidiesRelations = relations(stateSubsidies, ({many}) => ({
	discoms: many(discoms),
}));

export const svUserFeedbackRelations = relations(svUserFeedback, ({one}) => ({
	svUser: one(svUser, {
		fields: [svUserFeedback.userId],
		references: [svUser.id]
	}),
}));

export const svUserRelations = relations(svUser, ({many}) => ({
	svUserFeedbacks: many(svUserFeedback),
}));

export const legalAcceptancesRelations = relations(legalAcceptances, ({one}) => ({
	legalPolicy: one(legalPolicies, {
		fields: [legalAcceptances.policyId],
		references: [legalPolicies.id]
	}),
	country: one(countries, {
		fields: [legalAcceptances.countryCode],
		references: [countries.code]
	}),
	businessAccount: one(businessAccounts, {
		fields: [legalAcceptances.businessId],
		references: [businessAccounts.countryCode]
	}),
}));

export const legalPoliciesRelations = relations(legalPolicies, ({many}) => ({
	legalAcceptances: many(legalAcceptances),
}));

export const countriesRelations = relations(countries, ({many}) => ({
	legalAcceptances: many(legalAcceptances),
	businessProfiles: many(businessProfiles),
	geoLocations: many(geoLocations),
	businessAccounts: many(businessAccounts),
	leaddata: many(leaddata),
}));

export const businessAccountsRelations = relations(businessAccounts, ({one, many}) => ({
	legalAcceptances: many(legalAcceptances),
	country: one(countries, {
		fields: [businessAccounts.countryCode],
		references: [countries.code]
	}),
}));

export const businessProfilesRelations = relations(businessProfiles, ({one}) => ({
	country: one(countries, {
		fields: [businessProfiles.countryCode],
		references: [countries.code]
	}),
}));

export const geoLocationsRelations = relations(geoLocations, ({one}) => ({
	country: one(countries, {
		fields: [geoLocations.countryCode],
		references: [countries.code]
	}),
}));

