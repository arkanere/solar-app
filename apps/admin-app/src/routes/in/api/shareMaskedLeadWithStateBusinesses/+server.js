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

		// First, get the state from the locations table using district
		const stateResult = await pool.query(
			`SELECT state FROM locations WHERE district = $1 LIMIT 1`,
			[lead.district]
		);

		if (stateResult.rows.length === 0) {
			return json(
				{ success: false, error: 'State not found for the given district.' },
				{ status: 404 }
			);
		}

		const state = stateResult.rows[0].state;

		// Fetch businesses from the same state with magic_link_token
		const businessesResult = await pool.query(
			`SELECT id AS business_id, login_email, slug, magic_link_token, district
       FROM businesses_1
       WHERE state = $1
         AND isvisible = true
         AND magic_link_token IS NOT NULL
         AND magic_link_token <> ''
         AND login_email <> 'businessadminz@solar.com'`,
			[state]
		);

		if (businessesResult.rows.length === 0) {
			return json(
				{ success: false, error: 'No businesses found in this state.' },
				{ status: 404 }
			);
		}

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

		// Email content template (same for all businesses)
		const emailTemplate = `
        <h2>New Solar Inquiry in ${escapeHtml(state)}</h2>
        <p><strong>Customer Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Phone:</strong> ${maskedPhone}</p>
        <p><strong>Email:</strong> ${maskedEmail}</p>
        <p><strong>Pin Code:</strong> ${escapeHtml(lead.pin_code)}</p>
        <p><strong>District:</strong> ${escapeHtml(lead.district)}</p>
        <p><strong>Customer Comment:</strong> ${escapeHtml(lead.comment)}</p>
        ${lead.sv_comment_for_businesses ? `<p style="margin-top: 0.75rem; font-style: italic; color: #0056b3; background-color: rgba(0, 86, 179, 0.05); padding: 0.5rem; border-radius: 4px; border-left: 3px solid #0056b3;"><strong>Solarvipani.com Comment:</strong> ${escapeHtml(lead.sv_comment_for_businesses)}</p>` : ''}
        <p><strong>Created At:</strong> ${createdAtISTString}</p>
        
        <p><strong>Important:</strong> Businesses that have either main branch or branch office in <a href="https://solarvipani.com/solar-panel-installer-directory/${lead.district.toLowerCase().replace(/\s+/g, '-')}" style="font-weight: bold;">${escapeHtml(lead.district)}</a> district can claim this lead by logging into their account.</p>
        `;

		const subject = `New Solar Lead Inquiry in  ${escapeHtml(lead.district)}, ${escapeHtml(state)} - ${escapeHtml(lead.name)}`;

		for (const business of businesses) {
			const { business_id, login_email, slug, magic_link_token, district } = business;

			// Generate the magic login link
			const magicLink = `https://business.solarvipani.com/in/${slug}/signin-link/${magic_link_token}`;

			// Append business details for admin summary
			businessDetailsForAdmin += `
          <p><strong>Business ID:</strong> ${business_id}</p>
          <p><strong>Login Email:</strong> ${login_email}</p>
          <p><strong>Business Slug:</strong> ${slug}</p>
          <p><strong>District:</strong> ${district}</p>
          <p><strong>Magic Link:</strong> <a href="${magicLink}">${magicLink}</a></p>
          <hr>
        `;

			// Complete email content with business-specific magic link
			const message = emailTemplate + `
        <p>If you're interested in claiming this lead, use the link below:</p>
        <p style="margin-bottom: 2rem;">
        <a href="${magicLink}">Access Your Account</a>
        </p>
        
        <p><strong>How to Add Branch:</strong></p>
        <ul>
          <li>Log into your Solar Vipani business account</li>
          <li>Go to "Branch Management" section</li>
          <li>Click "Add New Branch" and enter branch details</li>
          <li>This will expand your service coverage and lead eligibility</li>
        </ul>
        
        <p> Few more businesses are invited to show interest. Therefore, the allotment is subject to certain conditions. </p>
        <p>For assistance, call us at <a href="tel:+918983066701">+91 8983066701</a></p>
        <p>Team</p>
        <p><strong>Solar Vipani</strong></p>
        `;

			try {
				// Send email to business only
				await sendEmail([login_email], subject, message, { isHtml: true });

				emailsSentCount++;
			} catch (error) {
				// ❌ Log failure
				console.error(
					`❌ Failed to send email to Business ID: ${business_id}, Email: ${login_email}`,
					error
				);
			}
		}

		// Send single copy to admin after all business emails are sent
		if (emailsSentCount > 0) {
			try {
				// Use the first business's magic link for admin copy (or create a generic message)
				const firstBusiness = businesses[0];
				const adminCopyMessage = emailTemplate + `
        <p><strong>Admin Note:</strong> This is a copy of the email sent to ${emailsSentCount} businesses in ${state}.</p>
        <p>If you need to access any business account, use the magic links in the admin summary email.</p>
        
        <p><strong>How to Add Branch:</strong></p>
        <ul>
          <li>Log into your Solar Vipani business account</li>
          <li>Go to "Branch Management" section</li>
          <li>Click "Add New Branch" and enter branch details</li>
          <li>This will expand your service coverage and lead eligibility</li>
        </ul>
        
        <p> Few more businesses are invited to show interest. Therefore, the allotment is subject to certain conditions. </p>
        <p>For assistance, call us at <a href="tel:+918983066701">+91 8983066701</a></p>
        <p>Team</p>
        <p><strong>Solar Vipani</strong></p>
        `;

				await sendEmail([adminEmail], `[COPY] ${subject}`, adminCopyMessage, { isHtml: true });
			} catch (error) {
				console.error('❌ Failed to send admin copy:', error);
			}
		}

		// Send email to admin with business details
		const adminMessage = `
      <h2>Lead Shared with State Businesses</h2>
      <p><strong>Lead Name:</strong> ${lead.name}</p>
      <p><strong>State:</strong> ${state}</p>
      <p><strong>Created At:</strong> ${createdAtISTString}</p>
      <hr>
      <h3>Businesses Notified:</h3>
      ${businessDetailsForAdmin}
      <p><strong>Total Businesses:</strong> ${businesses.length}</p>
    `;

		await sendEmail([adminEmail], 'Admin Notification: Lead Shared with State', adminMessage, {
			isHtml: true
		});

		// Increment email_invite_count if at least one email was sent successfully
		if (emailsSentCount > 0) {
			try {
				await pool.query(
					'UPDATE leaddata SET email_invite_count = email_invite_count + 1 WHERE id = $1',
					[lead.id]
				);
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