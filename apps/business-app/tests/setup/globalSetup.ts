// Runs once per `vitest` invocation, before any test file.
//
// Drops and rebuilds the public schema, then replays the numbered SQL
// migrations. Rebuilding from scratch each run means a test can never pass
// because of state a previous run left behind.

import pg from 'pg';
// @ts-expect-error - plain .mjs script shared with main-app, no types
import { applyMigrations } from '../../../../scripts/apply-test-migrations.mjs';

const TEST_POSTGRES_URL =
	process.env.TEST_POSTGRES_URL ?? 'postgres://solar:solar@localhost:5433/solar_test';

export default async function setup() {
	const client = new pg.Client({ connectionString: TEST_POSTGRES_URL });
	try {
		await client.connect();
	} catch (error) {
		throw new Error(
			`Cannot reach the test database at ${TEST_POSTGRES_URL}.\n` +
				'Start it first:  docker compose -f docker-compose.test.yml up -d\n' +
				'or point TEST_POSTGRES_URL at a scratch database of your own.\n' +
				`Underlying error: ${(error as Error).message}`
		);
	}

	// Guard rail: this schema gets dropped. Refuse to do that to anything that
	// is not obviously a throwaway.
	const { rows } = await client.query<{ current_database: string }>('SELECT current_database()');
	const dbName = rows[0].current_database;
	if (!/test/i.test(dbName)) {
		await client.end();
		throw new Error(
			`Refusing to run tests against database "${dbName}" — the suite drops and ` +
				'recreates the public schema, and this name does not contain "test".'
		);
	}

	await client.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
	await client.end();

	await applyMigrations(TEST_POSTGRES_URL);
}
