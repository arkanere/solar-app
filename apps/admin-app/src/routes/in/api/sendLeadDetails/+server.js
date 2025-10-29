import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/sendEmail'; // Assume you have an email utility to send emails
import escapeHtml from 'escape-html';

const pool = createPool({ connectionString: POSTGRES_URL });

export async function POST({ request }) {
	const { lead, business_slug } = await request.json(); // Data sent from the client-side

	try {
		// Query the business's login_email and magic_link_token using the business_slug
		const result = await pool.query(
			'SELECT login_email, magic_link_token FROM businesses_1 WHERE slug = $1 LIMIT 1',
			[business_slug]
		);

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}

		const { login_email: businessEmail, magic_link_token } = result.rows[0];
		const adminEmail = 'admin@solarvipani.com';

		// Convert 'created_at' to IST (UTC+5:30)
		const createdAtUTC = new Date(lead.created_at);
		const createdAtIST = new Date(createdAtUTC.getTime() + 5.5 * 60 * 60 * 1000); // Add 5.5 hours in milliseconds

		// Format the IST time as a string
		const createdAtISTString = createdAtIST.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

		let message;
		if (magic_link_token) {
			// Generate the magic link if the token is available
			const magicLink = `https://business.solarvipani.com/in/${business_slug}/signin-link/${magic_link_token}`;

			// Email content with the magic link
			message = `
        <h2>Customer Enquiry</h2>
        <p><strong>Lead Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Phone:</strong> <a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a></p>
        <p><strong>Pin Code:</strong> ${escapeHtml(lead.pin_code)}</p>
        <p><strong>Type:</strong> ${escapeHtml(lead.type)}</p>
        <p><strong>Customer Comment:</strong> ${escapeHtml(lead.comment)}</p>
        <p><strong>Created At:</strong> ${createdAtISTString}</p>
        <p>To access your account and check this lead, click the link below:</p>
        <p style="margin-bottom: 2rem;">
          <a href="${magicLink}" style="color: blue; text-decoration: underline;">Access your account</a>
        </p>
        <p>If you have any questions or need assistance, call us at <a href="tel:+918983066701"> +91 8983066701 </a></p>
        <p>Team</p>
        <p><strong>Solar Vipani</strong></p>
      `;
		} else {
			// Fallback message if the magic link is unavailable
			message = `
        <h2>Customer Enquiry</h2>
        <p><strong>Lead Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Phone:</strong> <a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a></p>
        <p><strong>Pin Code:</strong> ${escapeHtml(lead.pin_code)}</p>
        <p><strong>Type:</strong> ${escapeHtml(lead.type)}</p>
        <p><strong>Customer Comment:</strong> ${escapeHtml(lead.comment)}</p>
        <p><strong>Created At:</strong> ${createdAtISTString}</p>
        <p>Log in to your account at <a href="https://solarvipani.com/business/login">this link</a> to check if there are any leads available.</p>
        <p>If you have any questions or need assistance, call us at <a href="tel:+918983066701"> +91 8983066701 </a></p>
        <p>Team</p>
        <p><strong>Solar Vipani</strong></p>
      `;
		}

		// Email subject
		const subject = `Customer enquiry through Solar Vipani - ${escapeHtml(lead.name)} - Created At: ${createdAtISTString}`;

		// Send email to both admin and business login_email
		await sendEmail([adminEmail, businessEmail], subject, message, { isHtml: true });

		// Increment email_invite_count for the lead after successful email send
		try {
			await pool.query(
				'UPDATE leaddata SET email_invite_count = email_invite_count + 1 WHERE id = $1',
				[lead.id]
			);
		} catch (updateError) {
			console.error('Error updating email_invite_count:', updateError);
			// Don't fail the entire operation if the count update fails
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error sending lead details:', error);
		return json({ success: false, error: 'Failed to send lead details' }, { status: 500 });
	}
}
