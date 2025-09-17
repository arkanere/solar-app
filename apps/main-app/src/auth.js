// import { SvelteKitAuth } from "@auth/sveltekit"
// import Google from "@auth/sveltekit/providers/google"

// export const { handle, signIn } = SvelteKitAuth({
//   providers: [Google],
//   trustHost: true
// })

import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

// Initialize the Postgres connection pool
const pool = createPool({ connectionString: POSTGRES_URL });

export const { handle, signIn } = SvelteKitAuth({
	providers: [Google],
	trustHost: true,
	callbacks: {
		// Runs when a user logs in for the first time or subsequent times
		async signIn({ user }) {
			try {
				const { email, name } = user;

				if (!email) {
					console.error('No email found in user object');
					return false; // Reject the sign-in if no email is available
				}

				const client = await pool.connect();

				// Check if the user already exists
				const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [email]);

				if (rows.length === 0) {
					// If the user doesn't exist, insert them into the database
					const query = `
            INSERT INTO users (email, name, created_at)
            VALUES ($1, $2,  NOW())
            RETURNING *;
          `;

					const result = await client.query(query, [email, name]);

					console.log('New user created:', result.rows[0]);
				} else {
					console.log('User already exists:', rows[0]);
				}

				client.release();
				return true; // Allow the sign-in
			} catch (error) {
				console.error('Error in signIn callback:', error);
				return false; // Reject the sign-in on error
			}
		}
	}
});
