// This file exists only to carry the ISR config: business-form has no loader,
// its page is a static shell around <BusinessForm>, and the level2 dropdown is
// populated client-side from /[country]/api/getLevel2s.
//
// /us/business-form was prerendered until stage 3 of
// docs/migration-plan-delete-us.md deleted its `prerender = true`, and
// /in/business-form has never been cached at all. Stage 10 gives both the same
// 15-day ISR window every other [country] page uses, rather than leaving the
// one page in the tree served by an uncached function on every request.
export const config = {
	isr: {
		expiration: 1296000
	}
};
