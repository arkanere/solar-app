import { createPool, type VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail';

interface DataAccessRequest {
	email: string;
	phone?: string;
	reason?: string;
}

interface AccessResult {
	id: number;
}

export const POST: RequestHandler = async ({ request }) => {
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = (await request.json()) as DataAccessRequest;
		const { email, phone, reason } = data;

		if (!email) {
			return json({ success: false, error: 'Email is required' }, { status: 400 });
		}

		const insertQuery = `
            INSERT INTO data_access_requests (email, phone, reason, created_at, status)
            VALUES ($1, $2, $3, NOW(), 'pending')
            RETURNING id
        `;

		const result = await pool.query<AccessResult>(insertQuery, [
			email,
			phone || null,
			reason || null
		]);

		// Acknowledge the request — fulfillment itself is manual (team emails a CSV
		// within 30 days). Email failure must not fail the request submission.
		const subject = 'We received your data access request - Solar Vipani';
		const message = `
    <p>Hello,</p>
    <p>We have received your request to access the personal data we hold about you.</p>
    <p>Our team will review your request and email you a copy of your data within 30 days,
       in line with applicable data protection laws.</p>
    <p>If you have any questions, please contact us at
       <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
    <p>Best Regards,<br><strong>Solar Vipani Team</strong></p>
    `;
		try {
			await sendEmail([email, 'admin@solarvipani.com'], subject, message, { isHtml: true });
		} catch (emailError) {
			console.error('Error sending data access acknowledgement email:', emailError);
		}

		return json({
			success: true,
			id: result.rows[0].id,
			message: 'Data access request submitted successfully'
		});
	} catch (error) {
		console.error('Error inserting data access request:', error);

		if (error instanceof Error && 'code' in error && error.code === '42P01') {
			return json(
				{ success: false, error: 'Database table not found. Please contact support.' },
				{ status: 500 }
			);
		}

		return json(
			{ success: false, error: 'Failed to submit data access request' },
			{ status: 500 }
		);
	}
};
