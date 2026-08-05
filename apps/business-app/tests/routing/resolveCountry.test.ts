// Tests for $lib/server/resolveCountry — the two lookups that replaced the /in
// and /us URL prefixes in Phase 7.
//
// Country used to be readable off the path. It is now derived from the business,
// which makes these two functions the single point where a wrong answer renders
// an India-shaped dashboard for a US business (or vice versa). Three properties
// are worth pinning:
//
//  - each country resolves to itself, through the *unified* tables the sync
//    projections populate — not the legacy per-country ones;
//  - `isvisible` is load-bearing, not tidiness: the sentinel slugs 'incorrect'
//    and '' exist under both country codes in live data and are the only slugs
//    that span both, so the filter is what makes them deterministic;
//  - an unknown slug/email returns null rather than falling back to 'in'.
//    Callers must 404 on null; a silent default is the failure mode this whole
//    module exists to prevent.

import { beforeEach, describe, expect, it } from 'vitest';
import { countryForLoginEmail, countryForSlug } from '$lib/server/resolveCountry';
import { createBusiness, createUsBusiness, resetDatabase } from '../helpers/fixtures';

beforeEach(async () => {
	await resetDatabase();
});

describe('countryForSlug', () => {
	it('resolves an IN business to "in"', async () => {
		await createBusiness({ slug: 'pune-solar' });

		expect(await countryForSlug('pune-solar')).toBe('in');
	});

	it('resolves a US business to "us"', async () => {
		await createUsBusiness({ slug: 'oakland-solar' });

		expect(await countryForSlug('oakland-solar')).toBe('us');
	});

	it('returns null for a slug no business has', async () => {
		await createBusiness({ slug: 'pune-solar' });

		// Not 'in'. A mistyped slug must 404, not inherit the majority country.
		expect(await countryForSlug('no-such-business')).toBeNull();
	});

	it('returns null for the empty slug', async () => {
		expect(await countryForSlug('')).toBeNull();
	});

	it('ignores an invisible business when the same slug exists in both countries', async () => {
		// The live shape of the 'incorrect' / '' sentinels: present under both
		// country codes, all but one invisible. Without the isvisible filter this
		// lookup would return whichever row Postgres handed back first.
		await createBusiness({ slug: 'incorrect', isvisible: false });
		await createUsBusiness({ slug: 'incorrect', isvisible: true });

		expect(await countryForSlug('incorrect')).toBe('us');
	});

	it('returns null when every business with the slug is invisible', async () => {
		await createBusiness({ slug: 'incorrect', isvisible: false });
		await createUsBusiness({ slug: 'incorrect', isvisible: false });

		expect(await countryForSlug('incorrect')).toBeNull();
	});
});

describe('countryForLoginEmail', () => {
	it('resolves an IN account to "in"', async () => {
		await createBusiness({ slug: 'pune-solar', loginEmail: 'owner@pune-solar.test' });

		expect(await countryForLoginEmail('owner@pune-solar.test')).toBe('in');
	});

	it('resolves a US account to "us"', async () => {
		await createUsBusiness({ slug: 'oakland-solar', loginEmail: 'owner@oakland-solar.test' });

		expect(await countryForLoginEmail('owner@oakland-solar.test')).toBe('us');
	});

	it('returns null for an unregistered address', async () => {
		await createBusiness({ slug: 'pune-solar', loginEmail: 'owner@pune-solar.test' });

		// Callers map this to the same generic failure as a wrong password, so it
		// does not become an account-existence oracle.
		expect(await countryForLoginEmail('nobody@example.test')).toBeNull();
	});

	it('returns null for the empty address', async () => {
		expect(await countryForLoginEmail('')).toBeNull();
	});

	it('ignores an invisible account', async () => {
		await createBusiness({ slug: 'hidden-solar', loginEmail: 'owner@hidden.test', isvisible: false });

		expect(await countryForLoginEmail('owner@hidden.test')).toBeNull();
	});
});
