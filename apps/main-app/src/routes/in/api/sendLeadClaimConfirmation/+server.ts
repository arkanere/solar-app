// src/routes/api/sendLeadClaimConfirmation/+server.js
import { json, type RequestHandler } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail'; // Utility for sending emails
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const { lead_id, business_id } = await request.json();

		if (!lead_id || !business_id) {
			return json(
				{ success: false, error: 'Lead ID and Business ID are required' },
				{ status: 400 }
			);
		}

		// Get lead details from database
		const leadResult = await pool.query(
			'SELECT name, pin_code as "pinCode" FROM leaddata WHERE id = $1',
			[lead_id]
		);

		if (leadResult.rows.length === 0) {
			return json({ success: false, error: 'Lead not found' }, { status: 404 });
		}

		const lead = leadResult.rows[0];

		// Get business details from database
		const businessResult = await pool.query('SELECT name, slug FROM businesses_1 WHERE id = $1', [
			business_id
		]);

		if (businessResult.rows.length === 0) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}

		const business = businessResult.rows[0];

		const adminEmail = 'admin@solarvipani.com';

		// Email to Admin only
		const adminSubject = `Lead Claim Notification - Solar Vipani`;
		const adminMessage = `
            <p>Hello Admin,</p>
            <p>A lead has been claimed on Solar Vipani.</p>
            <p><strong>Business Details:</strong></p>
            <ul>
                <li><strong>Business Name:</strong> ${business.name}</li>
                <li><strong>Business ID:</strong> ${business_id}</li>
                <li><strong>Business Slug:</strong> ${business.slug || 'N/A'}</li>
            </ul>
            <p><strong>Lead Details:</strong></p>
            <ul>
                <li><strong>Lead ID:</strong> ${lead_id}</li>
                <li><strong>Lead Name:</strong> ${lead.name}</li>
                <li><strong>Lead Pin Code:</strong> ${lead.pinCode}</li>
            </ul>
            <p>This is an automated notification from the Solar Vipani platform.</p>
            <p>Best Regards,<br><strong>Solar Vipani System</strong></p>
        `;

		// Send email only to admin
		await sendEmail([adminEmail], adminSubject, adminMessage, { isHtml: true });

		return json({ success: true });
	} catch (error) {
		console.error('Error sending lead claim confirmation:', error);
		return json({ success: false, error: 'Failed to send confirmation email' }, { status: 500 });
	} finally {
		// Close the pool connection
		await pool.end();
	}
}
