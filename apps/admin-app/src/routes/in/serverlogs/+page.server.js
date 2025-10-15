export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const result = await pool.query(`
      SELECT
        id,
        timestamp,
        method,
        url,
        status_code,
        response_time,
        user_agent,
        referrer,
        error_message
      FROM server_logs
      ORDER BY timestamp DESC
      LIMIT 100
    `);

		return {
			logs: result.rows
		};
	} catch (error) {
		console.error('Error fetching server logs:', error);
		return {
			logs: [],
			errorMessage: 'Failed to fetch server logs.'
		};
	}
}
