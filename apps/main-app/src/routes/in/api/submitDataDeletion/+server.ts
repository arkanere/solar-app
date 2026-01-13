import { createPool, type VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

interface DataDeletionRequest {
	email: string;
	phone?: string;
	reason?: string;
}

interface DeletionResult {
	id: number;
}

export const POST: RequestHandler = async ({ request }) => {
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json() as DataDeletionRequest;
		const { email, phone, reason } = data;

		if (!email) {
			return json({ success: false, error: 'Email is required' }, { status: 400 });
		}

		const insertQuery = `
            INSERT INTO data_deletion_requests (email, phone, reason, created_at, status)
            VALUES ($1, $2, $3, NOW(), 'pending')
            RETURNING id
        `;

		const result = await pool.query<DeletionResult>(insertQuery, [email, phone || null, reason || null]);

		return json({ 
			success: true, 
			id: result.rows[0].id,
			message: 'Data deletion request submitted successfully'
		});
	} catch (error) {
		console.error('Error inserting data deletion request:', error);
		
		if (error instanceof Error && 'code' in error && error.code === '42P01') {
			return json({ 
				success: false, 
				error: 'Database table not found. Please contact support.' 
			}, { status: 500 });
		}
		
		return json({ 
			success: false, 
			error: 'Failed to submit data deletion request' 
		}, { status: 500 });
	}
};
