import { relations } from "drizzle-orm/relations";
import { callsafeusers, callsafehandles, leaddata, svProposals, projectManagement, solarBrands, solarProducts, stateSubsidies, discoms, svUser, svUserFeedback, legalPolicies, legalAcceptances, countries, businessAccounts, geoLocations } from "./schema";

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

// business_profiles has no `country` relation since 079 dropped its country_code
// and the FK to countries with it. A profile's country is its account's, reached
// through account_business_id -> business_accounts.source_id. That is not a
// foreign key (075 explains why account_business_id cannot carry one), so pull
// emits no relation for it and none is declared here.

export const geoLocationsRelations = relations(geoLocations, ({one}) => ({
	country: one(countries, {
		fields: [geoLocations.countryCode],
		references: [countries.code]
	}),
}));

