// /login's password sign-in. It used the India-bound auth service, so a US
// business with a correct password was told "Invalid email or password".

import { beforeEach, describe, expect, it } from 'vitest';
import bcrypt from 'bcrypt';
import { pool } from '../setup/testDb';
import { createBusiness, createUsBusiness, resetDatabase } from '../helpers/fixtures';
import { createCookies } from '../helpers/request';

const { actions } = await import('../../src/routes/(layout-1)/login/+page.server');

const PASSWORD = 'correct horse battery';

/** Submit the login form; return the redirect thrown, or the failure returned. */
async function login(email: string, password: string) {
	const body = new FormData();
	body.set('email', email);
	body.set('password', password);
	const request = new Request('http://localhost/login', { method: 'POST', body });
	try {
		const returned = (await actions.default({ request, cookies: createCookies() } as any)) as {
			status: number;
		};
		return { redirect: null, failure: returned.status };
	} catch (thrown) {
		const e = thrown as { status?: number; location?: string };
		if (e.status !== 302) throw thrown;
		return { redirect: e.location, failure: null };
	}
}

async function setPassword(businessId: number) {
	await pool.query('UPDATE business_accounts SET login_password = $1 WHERE source_id = $2', [
		await bcrypt.hash(PASSWORD, 4),
		businessId
	]);
}

describe('/login signs a business in by email and password', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	it('signs an Indian business in', async () => {
		await setPassword(await createBusiness({ slug: 'pune-solar', loginEmail: 'owner@pune.test' }));

		expect(await login('owner@pune.test', PASSWORD)).toEqual({
			redirect: '/pune-solar',
			failure: null
		});
	});

	it('signs a US business in too', async () => {
		await setPassword(
			await createUsBusiness({ slug: 'chester-solar', loginEmail: 'owner@chester.test' })
		);

		expect(await login('owner@chester.test', PASSWORD)).toEqual({
			redirect: '/chester-solar',
			failure: null
		});
	});

	it('refuses a wrong password on a US business', async () => {
		await setPassword(
			await createUsBusiness({ slug: 'chester-solar', loginEmail: 'owner@chester.test' })
		);

		expect((await login('owner@chester.test', 'wrong')).failure).toBe(401);
	});

	it('answers an unknown email the same way as a wrong password', async () => {
		expect((await login('nobody@example.test', PASSWORD)).failure).toBe(401);
	});
});
