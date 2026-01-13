import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

interface DeleteLeadRequest {
	id: number;
}

export const POST: RequestHandler = async ({ request }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const { id }: DeleteLeadRequest = await request.json();

		if (!id) {
			return json({ success: false, error: 'Lead ID is required' }, { status: 400 });
		}

		// Update `isvisible` to FALSE instead of deleting the record
		const updateQuery = `
            UPDATE leaddata
            SET isvisible = FALSE
            WHERE id = $1
            RETURNING *;
        `;

		const result = await pool.query(updateQuery, [id]);

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Lead not found' }, { status: 404 });
		}

		return json({ success: true, lead: result.rows[0] });
	} catch (error) {
		console.error('Error deleting lead data:', error);
		return json({ success: false, error: 'Failed to delete lead' }, { status: 500 });
	}
};
