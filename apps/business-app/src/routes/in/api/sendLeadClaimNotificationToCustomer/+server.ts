import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/in/sendEmail';
import { mintUserToken } from '$lib/server/magicLink';
import type { RequestHandler } from './$types';

const pool = createPool({ connectionString: POSTGRES_URL });

interface LeadRow {
	name: string;
	email: string | null;
}

interface BusinessRow {
	businessname: string;
	phonenumber: string | null;
	email: string | null;
	slug: string;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { lead_id, business_id } = await request.json();

		if (!lead_id || !business_id) {
			return json({ success: false, error: 'Lead ID and Business ID are required' }, { status: 400 });
		}

		const leadResult = await pool.query<LeadRow>(
			`SELECT name, email FROM leads WHERE country_code = 'in' AND source_id = $1`,
			[lead_id]
		);

		if (leadResult.rows.length === 0) {
			return json({ success: false, error: 'Lead not found' }, { status: 404 });
		}

		const lead = leadResult.rows[0];

		if (!lead.email) {
			return json({ success: true, skipped: true, reason: 'No customer email' });
		}

		const businessResult = await pool.query<BusinessRow>(
			`SELECT businessname, phonenumber, email, slug FROM businesses WHERE country_code = 'in' AND source_id = $1`,
			[business_id]
		);

		if (businessResult.rows.length === 0) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}

		const business = businessResult.rows[0];
		const profileLink = `https://solarvipani.com/in/installer/${business.slug}`;
		const adminEmail = 'admin@solarvipani.com';

		// Mint a fresh user token (stored hashed, upserts the in_user row);
		// email the raw token.
		const magicLinkToken = await mintUserToken(pool, lead.email, lead.name || null);
		const customerAccountLink = `https://user.solarvipani.com/signin-link/${magicLinkToken}`;

		const subject = 'A Solar Installer is Interested in Your Inquiry - Solar Vipani';
		const message = `
    <p>Dear ${lead.name},</p>
    <p>Great news! A verified solar installer has shown interest in your inquiry on Solar Vipani.</p>
    <p><strong>Installer Details:</strong></p>
    <ul>
        <li><strong>Name:</strong> ${business.businessname}</li>
        <li><strong>Phone:</strong> ${business.phonenumber || 'N/A'}</li>
        <li><strong>Email:</strong> ${business.email || 'N/A'}</li>
        <li><strong>View Profile:</strong> <a href="${profileLink}" style="color: #0056b3;">${business.businessname}</a></li>
    </ul>
    <p>One of our verified installers will reach out to you shortly to discuss your solar energy needs.</p>
    <p style="margin-top: 20px;"><strong>Track your inquiry:</strong></p>
    <p><a href="${customerAccountLink}" style="display: inline-block; padding: 10px 20px; background-color: #0056b3; color: #ffffff; text-decoration: none; border-radius: 5px;">View Your Account</a></p>
    <p style="font-size: 12px; color: #666;">This link is unique to you and gives you access to your Solar Vipani customer account.</p>
    <p>If you have any questions, feel free to contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.</p>
    <p>Best Regards,<br><strong>Solar Vipani Team</strong></p>
    `;

		await sendEmail([lead.email, adminEmail], subject, message, { isHtml: true });

		return json({ success: true });
	} catch (error) {
		console.error('Error sending lead claim notification to customer:', error);
		return json({ success: false, error: 'Failed to send notification email' }, { status: 500 });
	}
};
