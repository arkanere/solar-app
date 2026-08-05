import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/in/sendEmail';
import { mintUserToken } from '$lib/server/magicLink';
import type { RequestHandler } from './$types';
import { businesses, leads } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import { installerProfileUrl } from '$lib/mainAppUrls';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { lead_id, business_id } = await request.json();

		if (!lead_id || !business_id) {
			return json({ success: false, error: 'Lead ID and Business ID are required' }, { status: 400 });
		}

		// This endpoint is given ids, not a slug or an email, so there is nothing
		// to resolve a country *from* — it read `country_code = 'in'` on both
		// queries instead, which was internally consistent but made it IN-only.
		//
		// Since 054 leaddata and businesses_1 are one table per entity for every
		// country, each with a single id sequence, so a source id identifies a row
		// on its own. Take the country off the lead row and require the business
		// to agree, which keeps the cross-check the paired 'in' filters used to
		// give for free.
		const leadResult = await db
			.select({ name: leads.name, email: leads.email, countryCode: leads.countryCode })
			.from(leads)
			.where(eq(leads.sourceId, lead_id));

		if (leadResult.length === 0) {
			return json({ success: false, error: 'Lead not found' }, { status: 404 });
		}

		const lead = leadResult[0];

		// country_code is char(2) and arrives space-padded from some drivers, so
		// normalise before it reaches a URL. Comparing it back to another char(2)
		// column is safe either way — Postgres blank-pads char comparisons.
		const country = lead.countryCode?.trim().toLowerCase();
		if (country !== 'in' && country !== 'us') {
			return json({ success: false, error: 'Lead not found' }, { status: 404 });
		}

		if (!lead.email) {
			return json({ success: true, skipped: true, reason: 'No customer email' });
		}

		const businessResult = await db
			.select({
				businessname: businesses.businessname,
				phonenumber: businesses.phonenumber,
				email: businesses.email,
				slug: businesses.slug
			})
			.from(businesses)
			.where(and(eq(businesses.countryCode, country), eq(businesses.sourceId, business_id)));

		if (businessResult.length === 0) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}

		const business = businessResult[0];
		// `/in/installer/...` hardcoded here sent every US customer to an India
		// profile URL. installerProfileUrl builds the canonical form for either.
		const profileLink = installerProfileUrl(country, business.slug ?? '');
		const adminEmail = 'admin@solarvipani.com';

		// Mint a fresh user token (stored hashed, upserts the in_user row);
		// email the raw token.
		const magicLinkToken = await mintUserToken(lead.email, lead.name || null);
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
