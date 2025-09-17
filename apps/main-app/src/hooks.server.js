import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { handle as authHandle } from './auth'; // Import the handle function from auth.js

const pool = createPool({ connectionString: POSTGRES_URL });

export async function handle({ event, resolve }) {
	// Run authentication first
	const authResponse = await authHandle({ event, resolve });
	if (authResponse) return authResponse; // Stop if authentication overrides response

	const start = Date.now(); // Start timing the request

	try {
		// Proceed with the request
		const response = await resolve(event);
		const duration = Date.now() - start; // Calculate response time

		// Extract request details
		const { request } = event;
		const method = request.method;
		const url = new URL(request.url);
		const path = url.pathname + url.search; // e.g., "/api?city=London"
		const status = response.status;

		// Get user-agent and referrer
		const userAgent = request.headers.get('user-agent') || '';
		const referrer = request.headers.get('referer') || request.headers.get('referrer');

		// Skip logging for non-business routes
		if (!path.startsWith('/business/')) return response;

		// Skip logging if request is from Googlebot
		if (userAgent.toLowerCase().includes('googlebot')) return response;

		// Capture error message if status is 400+
		const errorMessage = status >= 400 ? response.statusText || 'An error occurred' : null;

		// Log the data asynchronously
		logToDatabase({ method, path, status, duration, userAgent, referrer, errorMessage });

		return response;
	} catch (error) {
		console.error('Error in request handling:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}

/**
 * Logs request data to the database asynchronously.
 */
async function logToDatabase({
	method,
	path,
	status,
	duration,
	userAgent,
	referrer,
	errorMessage
}) {
	try {
		const client = await pool.connect();
		const query = `
      INSERT INTO server_logs (
        timestamp, method, url, status_code, response_time, user_agent, referrer, error_message
      ) VALUES (
        NOW(), $1, $2, $3, $4, $5, $6, $7
      )
    `;
		const values = [method, path, status, duration, userAgent, referrer, errorMessage];
		await client.query(query, values);
		client.release();
	} catch (err) {
		console.error('Logging Error:', err);
	}
}
