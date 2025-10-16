//api/sendLeadAllotmentStatus/+server.js

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail'; // Assuming you have an email utility

const pool = createPool({ connectionString: POSTGRES_URL });

export async function POST({ request }) {
	try {
		const { business_id, isallotted } = await request.json();

		// Fetch business details
		const businessResult = await pool.query(
			'SELECT businessname, login_email, slug, magic_link_token FROM businesses_1 WHERE id = $1 LIMIT 1',
			[business_id]
		);

		if (businessResult.rows.length === 0) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}

		const { businessname, login_email, slug, magic_link_token } = businessResult.rows[0];
		const adminEmail = 'admin@solarvipani.com';

		// Generate magic login link
		const magicLink = `https://solarvipani.com/business/${slug}/signin-link/${magic_link_token}`;

		// Email content
		const subject = `Lead Allotment Status Update - Solar Vipani`;
		const message = `
    <p>Dear ${businessname},</p>
    <p>We wanted to inform you that the allotment status of the lead claimed by you is available.</p>
    <p><strong>Status:</strong> ${isallotted ? 'Allotted' : 'Not Allotted'}</p>
    
    ${
			isallotted
				? `<p>A new lead has been successfully allotted to your business. You can view the details by logging into your Solar Vipani business account.</p>`
				: `<p>Lead could not be allotted to your business. You can check for updates or take action by logging into your Solar Vipani business account.</p>`
		}
    
    <p style="margin-bottom: 2rem;">
        <a href="${magicLink}" style="color: blue; text-decoration: underline;">Access Your Business Account</a>
    </p>

    <p>If you have any questions, feel free to contact us at <a href="tel:+918983066701">+91 8983066701</a>.</p>
    <p>Best Regards,</p>
    <p><strong>Solar Vipani Team</strong></p>
    `;

		// Send email to business and admin
		await sendEmail([login_email, adminEmail], subject, message, { isHtml: true });

		return json({ success: true });
	} catch (error) {
		console.error('Error sending lead allotment status:', error);
		return json({ success: false, error: 'Failed to send lead allotment status' }, { status: 500 });
	}
}
