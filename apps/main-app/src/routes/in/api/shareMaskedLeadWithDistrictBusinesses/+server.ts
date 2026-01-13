import { createPool, type VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail';

interface Business {
	business_id: number;
	login_email: string;
	slug: string;
	magic_link_token: string;
	is_branch: boolean;
}

interface Lead {
	id: number;
	district: string;
	name: string;
	phone: string;
	email: string;
	pin_code: string;
	comment: string;
	created_at: string;
	sv_comment_for_businesses?: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

	try {
		const { lead } = await request.json() as { lead: Lead };

		if (!lead.district || lead.district.trim() === '') {
			return json(
				{ success: false, error: 'District value is missing. Cannot share lead.' },
				{ status: 400 }
			);
		}

		const businessesResult = await pool.query<Business>(
			`SELECT DISTINCT
				b.id AS business_id,
				b.login_email,
				CASE
					WHEN b.slug LIKE '%-branch-%' THEN
						COALESCE(main_b.slug, b.slug)
					ELSE b.slug
				END AS slug,
				CASE
					WHEN b.slug LIKE '%-branch-%' THEN
						COALESCE(main_b.magic_link_token, b.magic_link_token)
					ELSE b.magic_link_token
				END AS magic_link_token,
				CASE
					WHEN b.slug LIKE '%-branch-%' THEN true
					ELSE false
				END AS is_branch
			FROM businesses_1 b
			LEFT JOIN businesses_1 main_b ON (
				b.slug LIKE '%-branch-%'
				AND main_b.slug = SPLIT_PART(b.slug, '-branch-', 1)
				AND main_b.isvisible = true
			)
			WHERE b.district = $1
				AND b.isvisible = true
				AND b.login_email <> 'businessadminz@solar.com'
				AND (
					(b.slug NOT LIKE '%-branch-%' AND b.magic_link_token IS NOT NULL AND b.magic_link_token <> '')
					OR
					(b.slug LIKE '%-branch-%' AND main_b.magic_link_token IS NOT NULL AND main_b.magic_link_token <> '')
				)`,
			[lead.district]
		);

		if (businessesResult.rows.length === 0) {
			return json(
				{ success: false, error: 'No businesses found in this district.' },
				{ status: 404 }
			);
		}

		console.log(businessesResult.rows);

		const businesses = businessesResult.rows;
		const adminEmail = 'admin@solarvipani.com';

		const createdAtUTC = new Date(lead.created_at);
		const createdAtIST = new Date(createdAtUTC.getTime() + 5.5 * 60 * 60 * 1000);
		const createdAtISTString = createdAtIST.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

		const maskedPhone = lead.phone.replace(/\d(?=\d{4})/g, '*');
		const maskedEmail = lead.email.replace(
			/^(.{2})(.*)(@.*)$/,
			(_, first, middle, domain) => first + '*****' + domain
		);

		let businessDetailsForAdmin = '';
		let emailsSentCount = 0;

		const svCommentHtml = lead.sv_comment_for_businesses 
			? `<p style="margin-top: 0.75rem; font-style: italic; color: #0056b3; background-color: rgba(0, 86, 179, 0.05); padding: 0.5rem; border-radius: 4px; border-left: 3px solid #0056b3;"><strong>Solarvipani.com Comment:</strong> ${lead.sv_comment_for_businesses}</p>`
			: '';

		const emailTemplate = `
        <h2>New Solar Inquiry in ${lead.district}</h2>
        <p><strong>Customer Name:</strong> ${lead.name}</p>
        <p><strong>Phone:</strong> ${maskedPhone}</p>
        <p><strong>Email:</strong> ${maskedEmail}</p>
        <p><strong>Pin Code:</strong> ${lead.pin_code}</p>
        <p><strong>District:</strong> ${lead.district}</p>
        <p><strong>Customer Comment:</strong> ${lead.comment}</p>
        ${svCommentHtml}
        <p><strong>Created At:</strong> ${createdAtISTString}</p>
        `;

		const subject = `New Solar Lead Inquiry in ${lead.district} - ${lead.name}`;

		for (const business of businesses) {
			const { business_id, login_email, slug, magic_link_token } = business;

			const magicLink = `https://solarvipani.com/business/${slug}/signin-link/${magic_link_token}`;

			businessDetailsForAdmin += `
          <p><strong>Business ID:</strong> ${business_id}</p>
          <p><strong>Login Email:</strong> ${login_email}</p>
          <p><strong>Business Slug:</strong> ${slug}</p>
          <p><strong>Magic Link:</strong> <a href="${magicLink}">${magicLink}</a></p>
          <hr>
        `;

			const message = emailTemplate + `
        <p>If you're interested in claiming this lead, use the link below:</p>
        <p style="margin-bottom: 2rem;">
        <a href="${magicLink}" style="color: blue; text-decoration: underline;">Claim the Lead</a>
        </p>
        <p> Few more businesses are invited to show interest. Therefore, the allotment is subject to certain conditions. </p>
        <p>For assistance, call us at <a href="tel:+918983066701">+91 8983066701</a></p>
        <p>Team</p>
        <p><strong>Solar Vipani</strong></p>
        `;

			try {
				await sendEmail([login_email], subject, message, { isHtml: true });
				console.log(
					`Email sent successfully to Business ID: ${business_id}, Email: ${login_email}`
				);
				emailsSentCount++;
			} catch (error) {
				console.error(
					`Failed to send email to Business ID: ${business_id}, Email: ${login_email}`,
					error
				);
			}
		}

		if (emailsSentCount > 0) {
			try {
				const adminCopyMessage = emailTemplate + `
        <p><strong>Admin Note:</strong> This is a copy of the email sent to ${emailsSentCount} businesses in ${lead.district}.</p>
        <p>If you need to access any business account, use the magic links in the admin summary email.</p>
        <p> Few more businesses are invited to show interest. Therefore, the allotment is subject to certain conditions. </p>
        <p>For assistance, call us at <a href="tel:+918983066701">+91 8983066701</a></p>
        <p>Team</p>
        <p><strong>Solar Vipani</strong></p>
        `;

				await sendEmail([adminEmail], `[COPY] ${subject}`, adminCopyMessage, { isHtml: true });
				console.log(`Single admin copy sent for lead shared with ${emailsSentCount} businesses`);
			} catch (error) {
				console.error('Failed to send admin copy:', error);
			}
		}

		const adminMessage = `
      <h2>Lead Shared with Businesses</h2>
      <p><strong>Lead Name:</strong> ${lead.name}</p>
      <p><strong>Created At:</strong> ${createdAtISTString}</p>
      <hr>
      <h3>Businesses Notified:</h3>
      ${businessDetailsForAdmin}
      <p><strong>Total Businesses:</strong> ${businesses.length}</p>
    `;

		await sendEmail([adminEmail], 'Admin Notification: Lead Shared', adminMessage, {
			isHtml: true
		});

		if (emailsSentCount > 0) {
			try {
				await pool.query(
					'UPDATE leaddata SET email_invite_count = email_invite_count + 1 WHERE id = $1',
					[lead.id]
				);
				console.log(`Updated email_invite_count for lead ID: ${lead.id}`);
			} catch (updateError) {
				console.error('Error updating email_invite_count:', updateError);
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error sharing masked lead details:', error);
		return json({ success: false, error: 'Failed to share masked lead details' }, { status: 500 });
	}
};
