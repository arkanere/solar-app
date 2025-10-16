import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json();
		const { email, phone, reason } = data;

		if (!email) {
			return json({ success: false, error: 'Email is required' }, { status: 400 });
		}

		const insertQuery = `
            INSERT INTO data_deletion_requests (email, phone, reason, created_at, status)
            VALUES ($1, $2, $3, NOW(), 'pending')
            RETURNING id
        `;

		const result = await pool.query(insertQuery, [email, phone || null, reason || null]);

		return json({ 
			success: true, 
			id: result.rows[0].id,
			message: 'Data deletion request submitted successfully'
		});
	} catch (error) {
		console.error('Error inserting data deletion request:', error);
		
		if (error.code === '42P01') {
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
}