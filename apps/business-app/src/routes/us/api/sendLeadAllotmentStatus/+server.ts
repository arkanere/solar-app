//api/sendLeadAllotmentStatus/+server.ts

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/us/sendEmail';
import type { RequestHandler } from './$types';

const pool = createPool({ connectionString: POSTGRES_URL });

interface LeadAllotmentRequest {
	business_id: number;
	isallotted: boolean;
}

interface BusinessResult {
	businessname: string;
	login_email: string;
	slug: string;
	magic_link_token: string;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { business_id } = (await request.json()) as LeadAllotmentRequest;

		// Fetch business details
		const businessResult = await pool.query<BusinessResult>(
			'SELECT businessname, login_email, slug, magic_link_token FROM businesses_1 WHERE id = $1 LIMIT 1',
			[business_id]
		);

		if (businessResult.rows.length === 0) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}

		const { businessname, login_email, slug, magic_link_token } = businessResult.rows[0];
		const adminEmail = 'admin@solarvipani.com';

		// Generate magic login link
		const magicLink = `https://business.solarvipani.com/us/${slug}/signin-link/${magic_link_token}`;

		// Email content
		const subject = `New Lead Allotted - Solar Vipani`;
		const message = `
    <p>Dear ${businessname},</p>
    <p>Great news! A new lead has been successfully allotted to your business.</p>
    <p>You can view the lead details by logging into your Solar Vipani business account.</p>

    <p style="margin-bottom: 2rem;">
        <a href="${magicLink}" style="color: blue; text-decoration: underline;">Access Your Business Account</a>
    </p>

    <p>Best Regards,</p>
    <p><strong>Solar Vipani Team</strong></p>

    <hr style="margin: 2rem 0; border: none; border-top: 1px solid #e0e0e0;" />
    <p style="font-size: 0.9rem; color: #555;">
        Looking for a digital marketing agency to run ads on Facebook, Instagram and Google?
        Check out <a href="https://qualityclickss.com/" style="color: blue; text-decoration: underline;">Quality Clickss</a>.
    </p>
    `;

		// Send email to business and admin
		await sendEmail([login_email, adminEmail], subject, message, { isHtml: true });

		return json({ success: true });
	} catch (error) {
		console.error('Error sending lead allotment status:', error);
		return json({ success: false, error: 'Failed to send lead allotment status' }, { status: 500 });
	}
};
