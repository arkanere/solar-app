import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail'; // Email utility
import escapeHtml from 'escape-html';

const pool = createPool({ connectionString: POSTGRES_URL });

export async function POST({ request }) {
	try {
		const { lead } = await request.json();

		if (!lead.district || lead.district.trim() === '') {
			return json(
				{ success: false, error: 'District value is missing. Cannot share lead.' },
				{ status: 400 }
			);
		}

		// Fetch businesses from the same district with magic_link_token
		const businessesResult = await pool.query(
			`SELECT id AS business_id, login_email, slug, magic_link_token 
       FROM businesses_1 
       WHERE district = $1 
         AND isvisible = true 
         AND login_email <> 'businessadminz@solar.com'
         AND businessfilled = false
         AND tier3 = false`,
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

		// Convert 'created_at' to IST (UTC+5:30)
		const createdAtUTC = new Date(lead.created_at);
		const createdAtIST = new Date(createdAtUTC.getTime() + 5.5 * 60 * 60 * 1000);
		const createdAtISTString = createdAtIST.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

		// Mask phone & email
		const maskedPhone = lead.phone.replace(/\d(?=\d{4})/g, '*'); // Mask all but last 4 digits
		const maskedEmail = lead.email.replace(
			/^(.{2})(.*)(@.*)$/,
			(_, first, middle, domain) => first + '*****' + domain
		);

		let businessDetailsForAdmin = '';
		let emailsSentCount = 0;

		for (const business of businesses) {
			const { business_id, login_email, slug, magic_link_token } = business;

			// Generate the magic login link
			const magicLink = `https://solarvipani.com/business/${slug}/signin-link/${magic_link_token}`;
			const businessListingLink = `https://solarvipani.com/business-listing?utm_source=email&utm_medium=invitation`;

			// Append business details for admin summary
			businessDetailsForAdmin += `
          <p><strong>Business ID:</strong> ${business_id}</p>
          <p><strong>Login Email:</strong> ${login_email}</p>
          <p><strong>Business Slug:</strong> ${slug}</p>
          <p><strong>Magic Link:</strong> <a href="${magicLink}">${magicLink}</a></p>
          <hr>
        `;

			// Email content
			const message = `
        <h2>New Solar Inquiry in ${escapeHtml(lead.district)}</h2>
        <p><strong>Customer Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Phone:</strong> ${maskedPhone}</p>
        <p><strong>Email:</strong> ${maskedEmail}</p>
        <p><strong>Pin Code:</strong> ${escapeHtml(lead.pin_code)}</p>
        <p><strong>Customer Comment:</strong> ${escapeHtml(lead.comment)}</p>
        <p><strong>Created At:</strong> ${createdAtISTString}</p>
        <p>If you're interested in claiming this lead, get listed on SolarVipani.com using the link below:</p>
        <p style="margin-bottom: 2rem;">
        <a href="${businessListingLink}" style="color: blue; text-decoration: underline;">List your Business on Solar Vipani</a>
        </p>
        <p> Few more businesses are invited to show interest. Therefore, the allotment is subject to certain conditions. </p>
        <p>For assistance, call us at <a href="tel:+918983066701">+91 8983066701</a></p>
        <p>Team</p>
        <p><strong>Solar Vipani</strong></p>
        `;

			const subject = `New Solar Lead Inquiry in ${escapeHtml(lead.district)} - Solar Vipani`;

			try {
				// Send email
				await sendEmail([login_email], subject, message, { isHtml: true });
				// await sendEmail([adminEmail], subject, message, { isHtml: true });

				// ✅ Log success and increment counter
				console.log(
					`✅ Email sent successfully to Business ID: ${business_id}, Email: ${login_email}`
				);
				emailsSentCount++;
			} catch (error) {
				// ❌ Log failure
				console.error(
					`❌ Failed to send email to Business ID: ${business_id}, Email: ${login_email}`,
					error
				);
			}
		}

		// Send email to admin with business details
		const adminMessage = `
      <h2>Unverified businesses invited</h2>
      <p><strong>Lead Name:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Created At:</strong> ${createdAtISTString}</p>
      <hr>
      <h3>Businesses Invited:</h3>
      ${businessDetailsForAdmin}
      <p><strong>Total Businesses:</strong> ${businesses.length}</p>
    `;

		await sendEmail(
			[adminEmail],
			'Admin Notification: Unverified businesses invited',
			adminMessage,
			{ isHtml: true }
		);

		// Increment email_invite_count if at least one email was sent successfully
		if (emailsSentCount > 0) {
			try {
				await pool.query(
					'UPDATE leaddata SET email_invite_count = email_invite_count + 1 WHERE id = $1',
					[lead.id]
				);
				console.log(`✅ Updated email_invite_count for lead ID: ${lead.id}`);
			} catch (updateError) {
				console.error('Error updating email_invite_count:', updateError);
				// Don't fail the entire operation if the count update fails
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error sharing masked lead details:', error);
		return json({ success: false, error: 'Failed to share masked lead details' }, { status: 500 });
	}
}
