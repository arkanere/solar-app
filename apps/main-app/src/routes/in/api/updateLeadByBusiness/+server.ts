// api/updateLeadByBusiness/server.ts
import { createPool } from '@vercel/postgres';
import type { VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

interface UpdateLeadRequest {
	id: number;
	stage?: number;
	status?: boolean;
}

interface LeadRow {
	[key: string]: unknown;
	id: number;
}

export const POST: RequestHandler = async ({ request }) => {
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

	try {
		const { id, stage, status }: UpdateLeadRequest = await request.json();

		if (!id) {
			return json({ success: false, error: 'Lead ID is required' }, { status: 400 });
		}

		// ✅ Update only `stage` and `status`
		const updateQuery = `
            UPDATE leaddata
            SET stage = $1, status = $2
            WHERE id = $3
            RETURNING *;
        `;

		const result = await pool.query<LeadRow>(updateQuery, [stage, status, id]);

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Lead not found' }, { status: 404 });
		}

		return json({ success: true, lead: result.rows[0] });
	} catch (error) {
		console.error('Error updating lead data:', error);
		return json({ success: false, error: 'Failed to update lead' }, { status: 500 });
	}
};
