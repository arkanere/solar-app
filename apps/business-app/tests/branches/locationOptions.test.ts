// The branch form's two dropdown endpoints. Both read `locations`, which holds
// India only, so a US business got empty lists — the cascade could never start.
// They now read `geo_locations`, which is populated for both countries
// (31,253 US rows / 8,392 IN on live) and is the same table main-app's geo.ts
// already uses.
//
// getCities additionally needs the state, not just the county: US county names
// repeat heavily across states — "Washington" appears in 31 of them on live —
// so a county-only lookup would offer a California business cities from 30
// other states.

import { beforeEach, describe, expect, it } from 'vitest';
import { createGeoLocation, resetDatabase } from '../helpers/fixtures';
import { jsonRequest } from '../helpers/request';

const { POST: getDistricts } = await import('../../src/routes/api/getDistricts/+server');
const { POST: getCities } = await import('../../src/routes/api/getCities/+server');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function event(body: unknown): any {
	return { request: jsonRequest(body) };
}

describe('the branch form’s location dropdowns', () => {
	beforeEach(async () => {
		await resetDatabase();
		await createGeoLocation('in', 'Maharashtra', 'Pune', 'Kothrud');
		await createGeoLocation('in', 'Maharashtra', 'Pune', 'Hadapsar');
		await createGeoLocation('in', 'Maharashtra', 'Nagpur', 'Dharampeth');
		await createGeoLocation('us', 'California', 'Alameda', 'Berkeley');
		await createGeoLocation('us', 'California', 'Alameda', 'Fremont');
		await createGeoLocation('us', 'California', 'Washington', 'Somewhere CA');
		await createGeoLocation('us', 'Utah', 'Washington', 'St. George');
	});

	it('returns a US state’s counties', async () => {
		const response = await getDistricts(event({ state: 'California', country: 'us' }));
		const { districts } = await response.json();

		// Before the fix this was [] — `locations` has no US rows at all.
		expect(districts).toEqual(['Alameda', 'Washington']);
	});

	it('still returns an IN state’s districts', async () => {
		const response = await getDistricts(event({ state: 'Maharashtra', country: 'in' }));
		const { districts } = await response.json();

		expect(districts).toEqual(['Nagpur', 'Pune']);
	});

	it('does not leak the other country’s level2 values', async () => {
		const response = await getDistricts(event({ state: 'California', country: 'in' }));
		const { districts } = await response.json();

		expect(districts).toEqual([]);
	});

	it('defaults to IN when no country is given', async () => {
		// AddBranch always sends one; this pins the fallback so an older client
		// keeps its existing behaviour rather than getting an empty list.
		const response = await getDistricts(event({ state: 'Maharashtra' }));
		const { districts } = await response.json();

		expect(districts).toEqual(['Nagpur', 'Pune']);
	});

	it('returns a US county’s cities', async () => {
		const response = await getCities(
			event({ district: 'Alameda', state: 'California', country: 'us' })
		);
		const { cities } = await response.json();

		expect(cities).toEqual(['Berkeley', 'Fremont']);
	});

	it('scopes cities to the state, since US county names repeat', async () => {
		// Washington County exists in both California and Utah here, as it does
		// in 31 states on live. Without the state filter this returned both.
		const response = await getCities(
			event({ district: 'Washington', state: 'Utah', country: 'us' })
		);
		const { cities } = await response.json();

		expect(cities).toEqual(['St. George']);
	});

	it('still returns an IN district’s cities', async () => {
		const response = await getCities(
			event({ district: 'Pune', state: 'Maharashtra', country: 'in' })
		);
		const { cities } = await response.json();

		expect(cities).toEqual(['Hadapsar', 'Kothrud']);
	});

	it('rejects a request with no state', async () => {
		const response = await getCities(event({ district: 'Alameda', country: 'us' }));

		expect(response.status).toBe(400);
	});
});
